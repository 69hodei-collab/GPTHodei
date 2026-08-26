import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const targets = (process.env.PLACSP_TARGETS || 'CONT26053;032-2026-0235').split(';').filter(Boolean);
const month = process.env.PLACSP_MONTH || '202608';
const url = `https://contrataciondelsectorpublico.gob.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3_${month}.zip`;
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'placsp-'));
const zip = path.join(tmp, 'placsp.zip');
const out = path.resolve('downloads', 'placsp-probe');
await fs.mkdir(out, { recursive: true });
console.log('Downloading official PLACSP open-data ZIP:', url);
execFileSync('curl', ['-sSLk', '--fail', url, '-o', zip], { stdio: 'inherit' });
execFileSync('unzip', ['-q', zip, '-d', tmp], { stdio: 'inherit' });

async function walk(dir) {
  const files=[];
  for (const e of await fs.readdir(dir,{withFileTypes:true})) {
    const f=path.join(dir,e.name);
    if (e.isDirectory()) files.push(...await walk(f));
    else if (/\.atom$|\.xml$/i.test(e.name)) files.push(f);
  }
  return files;
}
const files=await walk(tmp);
for (const target of targets) {
  let found=0;
  const matches=[];
  for (const f of files) {
    const text=await fs.readFile(f,'utf8').catch(()=>null);
    if (!text || !text.includes(target)) continue;
    const entries=text.match(/<entry[\s\S]*?<\/entry>/g) || [];
    for (const entry of entries) {
      if (!entry.includes(target)) continue;
      found++;
      matches.push({file:path.basename(f),entry});
    }
  }
  await fs.writeFile(path.join(out, `${target.replace(/[^A-Za-z0-9._-]+/g,'_')}.json`), JSON.stringify({target,found,matches},null,2));
  console.log(target, 'matching entries:', found);
}
