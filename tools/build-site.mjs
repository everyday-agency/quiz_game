import { mkdir, copyFile, rm, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import './build-php-release.mjs';
import './build-laravel-release.mjs';

const root = fileURLToPath(new URL('../',import.meta.url));
const output = join(root,'_site');
// Explicit runtime allowlist: no retired banks, authoring sources, fixtures or reports.
export const RUNTIME_FILES = ['index.html','styles.css','js/app.js','js/questions.mjs','js/php-bank.mjs','js/laravel-bank.mjs',
  'js/exam.mjs','js/progress.mjs','js/learning-notes.mjs','js/code-viewer.mjs','js/code-highlighting.mjs',
  'js/vendor/highlightjs/core.min.mjs','js/vendor/highlightjs/php.min.mjs','js/vendor/highlightjs/LICENSE'];
await rm(output,{recursive:true,force:true});
for(const file of RUNTIME_FILES){await mkdir(dirname(join(output,file)),{recursive:true});await copyFile(join(root,file),join(output,file));}
const manifest = JSON.parse(await readFile(join(root,'release/laravel-beta/manifest.json'),'utf8'));
await writeFile(join(output,'release.json'), JSON.stringify({
  releaseId: manifest.releaseId,
  commit: process.env.GITHUB_SHA || execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
  activeCount: manifest.activeCount,
  bankSha256: manifest.bankSha256,
  subjects: manifest.subjects,
  laravelStatus: 'beta',
  independentEditorialApproval: manifest.independentEditorialApproval,
})+'\n');
console.log(`Prepared ${RUNTIME_FILES.length+1} static runtime files in _site; nothing uploaded or deployed.`);
