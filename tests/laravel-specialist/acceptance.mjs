import assert from 'node:assert/strict';
import {readFileSync,statSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const files=['laravel-specialist/WORK_STATE.json','laravel-specialist/curriculum-mappings.json',...Array.from({length:6},(_,i)=>'laravel-specialist/batches/batch-'+String(i+1).padStart(2,'0')+'.json')];
const snapshot=()=>files.map(path=>({path,sha:createHash('sha256').update(readFileSync(path)).digest('hex'),mtime:statSync(path).mtimeMs}));
assert.equal(JSON.parse(readFileSync(files[0])).accepted,600);
const before=snapshot();
for(const batch of [1,6]){
 const r=spawnSync(process.execPath,['tools/laravel-specialist-accept.mjs'],{env:{...process.env,BATCH:String(batch)},encoding:'utf8'});
 assert.notEqual(r.status,0);assert.match(r.stderr,/Sequential acceptance required/);
 assert.deepEqual(snapshot(),before,'Rejected acceptance must not rewrite a snapshot, mapping or checkpoint');
}
writeFileSync('laravel-specialist/evidence/acceptance-guard.json',JSON.stringify({repeatedBatches:[1,6],refusedBeforeMutation:true,snapshotHashesAndMtimesUnchanged:true},null,2)+'\n');
console.log('Repeated batch acceptance is refused before any snapshot, mapping or checkpoint mutation.');
