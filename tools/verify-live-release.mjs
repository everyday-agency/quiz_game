import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,relative} from 'node:path';
const base=process.env.QUIZ_BASE_URL||'https://everyday-agency.github.io/quiz_game/';
const expectedCommit=process.env.EXPECTED_COMMIT;
assert(/^[a-f0-9]{40}$/.test(expectedCommit||''),'EXPECTED_COMMIT must identify the published release');
const sha=value=>createHash('sha256').update(value).digest('hex');
const manifest=JSON.parse(readFileSync('release/laravel-beta/manifest.json'));
const get=async file=>{
 const response=await fetch(new URL(file,base),{cache:'no-store',signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,file);return Buffer.from(await response.arrayBuffer());
};
const stamp=JSON.parse(await get('release.json'));
assert.equal(stamp.commit,expectedCommit);assert.equal(stamp.activeCount,1220);assert.equal(stamp.bankSha256,manifest.bankSha256);assert.equal(stamp.laravelStatus,'beta');
const all=[];
for(const [file,track,count,expectedHash] of [
 ['js/php-bank.mjs','PHP',620,manifest.phpSha256],
 ['js/laravel-bank.mjs','Laravel',600,manifest.laravelSha256],
]){
 const code=(await get(file)).toString();
 const bank=JSON.parse(code.slice(code.indexOf('export default ')+15).trim().replace(/;$/,''));
 assert.equal(bank.length,count);assert(bank.every(q=>q.track===track));assert.equal(sha(JSON.stringify(bank)),expectedHash);
 for(const q of bank)assert.equal(sha(JSON.stringify(q)),manifest.questions.find(x=>x.id===q.id)?.sha256,q.id);
 all.push(...bank);
}
assert.equal(new Set(all.map(q=>q.id)).size,1220);assert.equal(sha(JSON.stringify(all)),manifest.bankSha256);
const root=resolve('_site'),walk=dir=>readdirSync(dir).flatMap(name=>{const path=resolve(dir,name);return statSync(path).isDirectory()?walk(path):[relative(root,path)];});
const files=[];
for(const file of walk(root)){
 if(file==='release.json')continue;
 const bytes=await get(file),hash=sha(bytes);
 assert.equal(hash,sha(readFileSync(resolve(root,file))),`${file}: deployed bytes differ from validated build`);files.push({file,sha256:hash});
}
const excluded=['.env','laravel-specialist/validation/harness/vendor/autoload.php','laravel-specialist/validation/bootstrap.php','laravel-specialist/FOCUSED_EDITORIAL_CORRECTIONS.md','release/laravel-beta/REPORT.md','laravel-specialist/batches/batch-01.json','js/bank/legacy-v1.mjs','js/questions-php.mjs','tests/php-expansion/runtime.mjs','php-expansion/authoring/batch-01.mjs','release/AUTHORIZATION.txt','release/archive/pre-php-only/questions-and-metadata.json'];
for(const file of excluded){const response=await fetch(new URL(file,base),{signal:AbortSignal.timeout(20000)});assert.equal(response.status,404,`${file} must not be deployed`);}
const result={url:base,verifiedAt:new Date().toISOString(),commit:expectedCommit,activePhp:620,activeLaravelBeta:600,total:1220,bankSha256:manifest.bankSha256,independentEditorialApproval:manifest.independentEditorialApproval,files,excludedPaths:excluded,passed:true};
writeFileSync('release/laravel-beta/evidence/live-http.json',JSON.stringify(result,null,2)+'\n');
console.log('Live HTTP verified: release commit, 620 exact PHP and 600 exact Laravel Beta records, all runtime bytes and excluded internal/retired paths.');
