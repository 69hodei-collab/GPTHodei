import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { ensureDir, safeName, uniquePath } from './util.js';

const execFileAsync = promisify(execFile);
const FILE_EXT_RE = /\.(pdf|docx?|xlsx?|zip|xml|odt|ods|rtf)(?:$|[?#])/i;
const FILE_WORD_RE = /(pliego|pcap|ppt|pct|deuc|anexo|memoria|modelo|documento|fichero|descarga)/i;

async function saveDownload(download, outDir, label = '') {
  const suggested = download.suggestedFilename() || `${safeName(label || 'descarga')}.bin`;
  const target = await uniquePath(outDir, safeName(suggested));
  await download.saveAs(target);
  return target;
}

async function clickAndCaptureDownload(page, locator, outDir, label) {
  try {
    const downloadPromise = page.waitForEvent('download', { timeout: 12000 });
    await locator.click({ timeout: 8000 });
    const download = await downloadPromise;
    return await saveDownload(download, outDir, label);
  } catch {
    return null;
  }
}

async function collectCandidateLinks(page) {
  return page.locator('a').evaluateAll((anchors) => anchors.map((a, index) => ({
    index,
    text: (a.innerText || a.textContent || '').trim(),
    href: a.href || '',
    download: a.getAttribute('download') || ''
  })));
}

async function fetchDirectFile(page, href, outDir, label) {
  try {
    const response = await page.request.get(href, { timeout: 20000 });
    if (!response.ok()) return null;

    const headers = response.headers();
    const type = headers['content-type'] || '';
    const disposition = headers['content-disposition'] || '';
    if (!FILE_EXT_RE.test(href) && !/attachment/i.test(disposition) && !/(pdf|zip|xml|officedocument|msword)/i.test(type)) {
      return null;
    }

    let fileName = '';
    const match = disposition.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i);
    if (match) fileName = decodeURIComponent(match[1].replace(/\"/g, '').trim());
    if (!fileName) fileName = path.basename(new URL(href).pathname) || `${safeName(label)}.bin`;

    const target = await uniquePath(outDir, safeName(fileName));
    await fs.writeFile(target, await response.body());
    return target;
  } catch {
    return null;
  }
}

async function extractZipFiles(saved, tenderDir, errors) {
  const extracted = [];
  for (const file of saved) {
    if (path.extname(file).toLowerCase() !== '.zip') continue;
    const targetDir = await ensureDir(path.join(tenderDir, `${path.basename(file, '.zip')}_extraido`));
    try {
      await execFileAsync('unzip', ['-o', file, '-d', targetDir], { maxBuffer: 10 * 1024 * 1024 });
      const entries = await fs.readdir(targetDir, { recursive: true });
      for (const entry of entries) {
        const full = path.join(targetDir, entry);
        try {
          const stat = await fs.stat(full);
          if (stat.isFile()) extracted.push(full);
        } catch {}
      }
    } catch (error) {
      errors.push(`unzip ${path.basename(file)}: ${error.message}`);
    }
  }
  return extracted;
}

export async function downloadEuskadiTender(browser, tender, rootDir) {
  const tenderDir = await ensureDir(path.join(rootDir, safeName(tender.id)));
  const browserContext = await browser.newContext({ acceptDownloads: true, locale: 'es-ES' });
  const page = await browserContext.newPage();
  page.setDefaultTimeout(12000);

  const saved = [];
  const errors = [];
  let extracted = [];

  try {
    await page.goto(tender.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1500);

    await fs.writeFile(path.join(tenderDir, 'pagina.html'), await page.content(), 'utf8');
    await page.screenshot({ path: path.join(tenderDir, 'pagina.png'), fullPage: true });

    const metadata = {
      id: tender.id,
      source: 'euskadi',
      url: tender.url,
      title: await page.title(),
      capturedAt: new Date().toISOString(),
      bodyText: (await page.locator('body').innerText()).slice(0, 120000)
    };
    await fs.writeFile(path.join(tenderDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');

    const globalDownload = page.getByText(/Descarga de los ficheros|Descarga de ficheros|Descargar ficheros/i).first();
    if (await globalDownload.count()) {
      const file = await clickAndCaptureDownload(page, globalDownload, tenderDir, 'descarga-completa');
      if (file) saved.push(file);
    }

    const links = await collectCandidateLinks(page);
    const directCandidates = links.filter((x) => FILE_EXT_RE.test(x.href) || FILE_WORD_RE.test(`${x.text} ${x.download}`));
    for (const candidate of directCandidates.slice(0, 80)) {
      if (!candidate.href || candidate.href.startsWith('javascript:')) continue;
      const file = await fetchDirectFile(page, candidate.href, tenderDir, candidate.text || `link-${candidate.index}`);
      if (file) saved.push(file);
    }

    const clickCandidates = links.filter((x) => FILE_WORD_RE.test(x.text) && !/descarga de los ficheros/i.test(x.text));
    for (const candidate of clickCandidates.slice(0, 40)) {
      try {
        const locator = page.locator('a').nth(candidate.index);
        const file = await clickAndCaptureDownload(page, locator, tenderDir, candidate.text);
        if (file) saved.push(file);
      } catch (error) {
        errors.push(`click ${candidate.text}: ${error.message}`);
      }
    }

    extracted = await extractZipFiles([...new Set(saved)], tenderDir, errors);
  } catch (error) {
    errors.push(error.stack || error.message);
    try {
      await page.screenshot({ path: path.join(tenderDir, 'ERROR.png'), fullPage: true });
    } catch {}
  } finally {
    await fs.writeFile(path.join(tenderDir, 'resultado.json'), JSON.stringify({
      tender,
      saved: [...new Set(saved.map((file) => path.basename(file)))],
      extracted: extracted.map((file) => path.relative(tenderDir, file)),
      errors,
      finishedAt: new Date().toISOString()
    }, null, 2), 'utf8');
    await browserContext.close();
  }

  return { tenderDir, saved: [...new Set(saved)], extracted, errors };
}
