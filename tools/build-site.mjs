import { mkdir, copyFile, rm, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const root = fileURLToPath(new URL('../',import.meta.url));
const output = join(root,'_site');
// Explicit runtime allowlist: no audits, test fixtures, screenshots or history.
const files = ['index.html','styles.css','js/app.js','js/questions.mjs','js/exam.mjs','js/learning-notes.mjs',
  ...(await readdir(join(root,'js/bank'))).filter(file=>file.endsWith('.mjs')).map(file=>`js/bank/${file}`)];
await rm(output,{recursive:true,force:true});
for(const file of files){await mkdir(dirname(join(output,file)),{recursive:true});await copyFile(join(root,file),join(output,file));}
console.log(`Prepared ${files.length} static runtime files in _site; nothing uploaded or deployed.`);
