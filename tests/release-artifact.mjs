import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve('_site');
const walk=dir=>readdirSync(dir).flatMap(name=>{const path=resolve(dir,name);return statSync(path).isDirectory()?walk(path):[relative(root,path)];});
const expected=['index.html','styles.css','js/app.js','js/questions.mjs','js/php-bank.mjs','js/exam.mjs','js/progress.mjs','js/learning-notes.mjs','js/code-viewer.mjs','js/code-highlighting.mjs','js/vendor/highlightjs/core.min.mjs','js/vendor/highlightjs/php.min.mjs','js/vendor/highlightjs/LICENSE','release.json'];
const actual=walk(root);
assert.deepEqual(actual.sort(),expected.sort(),'Only the explicit runtime artifact may ship');
const {QUESTION_BANK}=await import(pathToFileURL(resolve(root,'js/questions.mjs')));
assert.equal(QUESTION_BANK.length,620);assert(QUESTION_BANK.every(q=>q.track==='PHP'));
assert(QUESTION_BANK.every(q=>!('validation' in q)&&!('fixtures' in q)&&!('executionAllowlist' in q)));
for(const file of actual.filter(p=>/\.(m?js)$/.test(p))){
 const source=readFileSync(resolve(root,file),'utf8');
 for(const match of source.matchAll(/(?:from\s*|import\s*\()(['"])(\.\.?\/[^'"\s]+)\1/g))assert(actual.includes(relative(root,resolve(root,dirname(file),match[2]))),`${file}: missing static import ${match[2]}`);
 assert(!/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b/.test(source),`${file}: credential pattern`);
}
const stamp=JSON.parse(readFileSync(resolve(root,'release.json'))),manifest=JSON.parse(readFileSync('release/manifest.json'));
assert.equal(stamp.activeCount,620);assert.equal(stamp.bankSha256,manifest.bankSha256);assert.equal(stamp.independentEditorialApproval,'pending');assert(/^[a-f0-9]{40}$/.test(stamp.commit));
console.log('Static artifact: exactly 14 allowed files; 620 PHP records; complete module graph; no retired banks, fixtures, reports or credential patterns.');
