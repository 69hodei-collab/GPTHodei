import fs from 'node:fs/promises';
import path from 'node:path';
import { ensureDir, safeName, uniquePath } from './util.js';

function extFromContentType(type = '') {
  if (/pdf/i.test(type)) return '.pdf';
  if (/zip/i.test(type)) return '.zip';
  if (/wordprocessingml/i.test(type)) return '.docx';
  if (/spreadsheetml/i.test(type)) return '.xlsx';
  if (/xml/i.test(type)) return '.xml';
  return '';
}

async function writeBody(response, doc, outDir) {
  const headers = response.headers();
  const type = headers['content-type'] || '';
  let name = safeName(doc.name || 'documento');
  if (!path.extname(name)) name += extFromContentType(type) || '.bin';
  const target = await uniquePath(outDir, name);
  await fs.writeFile(target, await response.body());
  return target;
}

async function saveUrl(context, doc, outDir) {
  let firstError = null;
  try {
    const response = await context.request.get(doc.url, { timeout: 45000, failOnStatusCode: false });
    if (response.ok()) return { file: await writeBody(response, doc, outDir) };
    firstError = `HTTP ${response.status()}`;
  } catch (error) {
    firstError = error.message;
  }

  // Algunos agregadores/CDN bloquean APIRequestContext pero permiten navegación Chromium.
  const docPage = await context.newPage();
  try {
    const response = await docPage.goto(doc.url, { waitUntil: 'commit', timeout: 60000 });
    if (response && response.ok()) {
      const target = await writeBody(response, doc, outDir);
      return { file: target };
    }
    return { error: `${doc.name}: ${firstError}; navegador ${response?.status() || 'sin respuesta'}` };
  } catch (error) {
    return { error: `${doc.name}: ${firstError}; navegador: ${error.message}` };
  } finally {
    await docPage.close().catch(() => {});
  }
}

async function autoCaptureDownloads(page, outDir) {
  const saved = [];
  const errors = [];
  const controls = page.locator('a,button').filter({ hasText: /descargar|download|pliego|documento/i });
  const count = Math.min(await controls.count(), 40);
  for (let i = 0; i < count; i++) {
    const locator = controls.nth(i);
    try {
      const text = (await locator.innerText({ timeout: 2000 })).trim().slice(0, 100) || `download-${i + 1}`;
      const href = await locator.getAttribute('href');
      if (href && !href.startsWith('javascript:')) {
        const absolute = new URL(href, page.url()).href;
        const direct = await saveUrl(page.context(), { name: text, url: absolute }, outDir);
        if (direct.file) {
          saved.push(direct.file);
          continue;
        }
      }
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
      await locator.click({ timeout: 5000 });
      const download = await downloadPromise;
      const target = await uniquePath(outDir, safeName(download.suggestedFilename() || `${text}.bin`));
      await download.saveAs(target);
      saved.push(target);
    } catch (error) {
      errors.push(`auto-download ${i + 1}: ${error.message}`);
    }
  }
  return { saved, errors };
}

export async function downloadGenericTender(browser, tender, rootDir) {
  const tenderDir = await ensureDir(path.join(rootDir, safeName(tender.id)));
  const context = await browser.newContext({ acceptDownloads: true, locale: 'es-ES' });
  const page = await context.newPage();
  const saved = [];
  const errors = [];

  try {
    await page.goto(tender.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    await fs.writeFile(path.join(tenderDir, 'pagina.html'), await page.content(), 'utf8');
    await page.screenshot({ path: path.join(tenderDir, 'pagina.png'), fullPage: true });
    const metadata = {
      id: tender.id,
      source: tender.source,
      url: tender.url,
      title: await page.title(),
      capturedAt: new Date().toISOString(),
      bodyText: (await page.locator('body').innerText()).slice(0, 160000)
    };
    await fs.writeFile(path.join(tenderDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');

    for (const doc of tender.documents || []) {
      const result = await saveUrl(context, doc, tenderDir);
      if (result.file) {
        saved.push(result.file);
        console.log(`DOWNLOAD ${path.basename(result.file)}`);
      } else if (result.error) {
        errors.push(result.error);
        console.warn(result.error);
      }
    }

    if (tender.autoDiscoverDownloads) {
      const auto = await autoCaptureDownloads(page, tenderDir);
      saved.push(...auto.saved);
      errors.push(...auto.errors);
    }
  } catch (error) {
    errors.push(error.stack || error.message);
    try { await page.screenshot({ path: path.join(tenderDir, 'ERROR.png'), fullPage: true }); } catch {}
  } finally {
    const deduped = [...new Set(saved)];
    await fs.writeFile(path.join(tenderDir, 'resultado.json'), JSON.stringify({
      tender, saved: deduped.map((f) => path.basename(f)), errors, finishedAt: new Date().toISOString()
    }, null, 2), 'utf8');
    await context.close();
  }
  return { tenderDir, saved: [...new Set(saved)], errors };
}
