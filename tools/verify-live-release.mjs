import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,relative} from 'node:path';
const base=process.env.QUIZ_BASE_URL||'https://everyday-agency.github.io/quiz_game/';
const expectedCommit=process.env.EXPECTED_COMMIT;
assert(/^[a-f0-9]{40}$/.test(expectedCommit||''),'EXPECTED_COMMIT must identify the published release');
const sha=value=>createHash('sha256').update(value).digest('hex');
const manifest=JSON.parse(readFileSync('release/manifest.json'));
const get=async file=>{
 const response=await fetch(new URL(file,base),{cache:'no-store',signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,file);return Buffer.from(await response.arrayBuffer());
};
const stamp=JSON.parse(await get('release.json'));
assert.equal(stamp.commit,expectedCommit);assert.equal(stamp.activeCount,620);assert.equal(stamp.bankSha256,manifest.bankSha256);assert.equal(stamp.independentEditorialApproval,'pending');
const code=(await get('js/php-bank.mjs')).toString();
assert(code.startsWith('// Controlled PHP-only release:'));
const bank=JSON.parse(code.slice(code.indexOf('export default ')+15).trim().replace(/;$/,''));
assert.equal(bank.length,620);assert(bank.every(q=>q.track==='PHP'));assert.equal(sha(JSON.stringify(bank)),manifest.bankSha256);
for(const q of bank)assert.equal(sha(JSON.stringify(q)),manifest.questions.find(x=>x.id===q.id)?.sha256,q.id);
const root=resolve('_site'),walk=dir=>readdirSync(dir).flatMap(name=>{const path=resolve(dir,name);return statSync(path).isDirectory()?walk(path):[relative(root,path)];});
const files=[];
for(const file of walk(root)){
 if(file==='release.json')continue;
 const bytes=await get(file),hash=sha(bytes);
 assert.equal(hash,sha(readFileSync(resolve(root,file))),`${file}: deployed bytes differ from validated build`);files.push({file,sha256:hash});
}
const excluded=['js/bank/legacy-v1.mjs','js/questions-php.mjs','tests/php-expansion/runtime.mjs','php-expansion/authoring/batch-01.mjs','release/AUTHORIZATION.txt','release/archive/pre-php-only/questions-and-metadata.json'];
for(const file of excluded){const response=await fetch(new URL(file,base),{signal:AbortSignal.timeout(20000)});assert.equal(response.status,404,`${file} must not be deployed`);}
const result={url:base,verifiedAt:new Date().toISOString(),commit:expectedCommit,activePhp:620,activeNonPhp:0,bankSha256:manifest.bankSha256,independentEditorialApproval:'pending',files,excludedPaths:excluded,passed:true};
writeFileSync('release/evidence/live-http.json',JSON.stringify(result,null,2)+'\n');
console.log('Live HTTP verified: release commit, 620 exact PHP records, all runtime bytes and excluded internal/retired paths.');
