import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { downloadEuskadiTender } from './euskadi.js';
import { getGraphAccessToken, resolveDrive, uploadFile } from './graph.js';
import { ensureDir, isoDateMadrid, listFilesRecursive, safeName } from './util.js';

const projectRoot = path.resolve(new URL('..', import.meta.url).pathname);
const configPath = process.env.EXPEDIENTES_FILE || path.join(projectRoot, 'config', 'expedientes.json');
const dateKey = isoDateMadrid();
const outputRoot = await ensureDir(process.env.OUTPUT_DIR || path.join(projectRoot, 'downloads', dateKey));

let tenders = JSON.parse(await fs.readFile(configPath, 'utf8'));
if (process.env.TENDER_URL) {
  tenders = [{
    id: process.env.TENDER_ID || 'manual',
    source: process.env.TENDER_SOURCE || 'euskadi',
    url: process.env.TENDER_URL
  }];
}

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const tender of tenders) {
    console.log(`\n=== ${tender.id} (${tender.source}) ===`);
    if (tender.source !== 'euskadi') {
      results.push({ tender, errors: [`Fuente no implementada todavía: ${tender.source}`] });
      continue;
    }
    const result = await downloadEuskadiTender(browser, tender, outputRoot);
    console.log(`Descargas detectadas: ${result.saved.length}`);
    if (result.errors.length) console.warn(result.errors.join('\n'));
    results.push(result);
  }
} finally {
  await browser.close();
}

const summaryPath = path.join(outputRoot, 'run-summary.json');
await fs.writeFile(summaryPath, JSON.stringify({ dateKey, tenders, results, generatedAt: new Date().toISOString() }, null, 2));

const token = await getGraphAccessToken();
const hostname = process.env.SHAREPOINT_HOSTNAME;
const sitePath = process.env.SHAREPOINT_SITE_PATH;
const targetBase = process.env.SHAREPOINT_TARGET_FOLDER || '069 Facturacion/Licitaciones/ChatGPTBUSCA';

if (token && hostname && sitePath) {
  console.log('\nMicrosoft Graph autorizado. Subiendo a OneDrive/SharePoint...');
  const { driveId } = await resolveDrive(token, hostname, sitePath);
  const files = await listFilesRecursive(outputRoot);
  for (const localFile of files) {
    const rel = path.relative(outputRoot, localFile).split(path.sep).map(safeName).join('/');
    const remote = `${targetBase}/${dateKey}/${rel}`;
    await uploadFile(token, driveId, localFile, remote);
    console.log(`UPLOAD ${remote}`);
  }
} else {
  console.warn('\nSharePoint upload omitido: falta autorización Graph/OIDC. Los ficheros quedan como artifact de GitHub Actions.');
}

const totalDownloads = results.reduce((n, result) => n + (result.saved?.length || 0), 0);
console.log(`\nFIN: ${tenders.length} expedientes; ${totalDownloads} descargas documentales detectadas.`);
process.exitCode = totalDownloads > 0 ? 0 : 2;
