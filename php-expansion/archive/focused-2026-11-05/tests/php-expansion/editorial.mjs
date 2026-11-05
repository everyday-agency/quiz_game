import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url),archive='php-expansion/archive/editorial-2026-11-05/';
const read=p=>JSON.parse(readFileSync(new URL(p,root))),sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const snapshot=read(archive+'snapshot.json');
for(const file of snapshot.files)assert.equal(createHash('sha256').update(readFileSync(new URL(archive+file.path,root))).digest('hex'),file.sha256,file.path+': immutable baseline');
const ledger=read('php-expansion/editorial-audit/records.json'),changes=read('php-expansion/editorial-audit/changes.json'),sample=read('php-expansion/editorial-audit/review-30.json');
assert.equal(ledger.length,600);assert.equal(new Set(ledger.map(r=>r.id)).size,600);assert(ledger.every(r=>r.explanationsReviewed&&/^[ABCD]$/.test(r.blindAnswer)&&r.note&&r.independentApproval==='pending'));
const changed=new Map(changes.map(r=>[r.id,r]));let total=0;
for(let b=1;b<=6;b++){
 const p=String(b).padStart(2,'0'),before=(await import('../../'+archive+`js/php-expansion/batches/batch-${p}.mjs`)).default,after=(await import(`../../js/php-expansion/batches/batch-${p}.mjs`)).default;
 assert.deepEqual(after.map(q=>q.id),before.map(q=>q.id));
 for(let i=0;i<100;i++){
  total++;const a=before[i],q=after[i],r=ledger.find(r=>r.id===q.id);assert.deepEqual(q.objective,a.objective);assert.equal(q.correctOptionId,a.correctOptionId);assert.equal(q.validation.independentEditorialReview,'pending');
  if(sha(a)!==sha(q)){const c=changed.get(q.id);assert(c,q.id);assert.equal(q.revision,a.revision+1);assert.equal(c.beforeSha256,sha(a));assert.equal(c.afterSha256,sha(q));assert.equal(r.decision,'revise');assert(r.categories.length&&r.severity);if(a.difficulty.level!==q.difficulty.level)assert(r.categories.includes('difficulty'));}
  else{assert(!changed.has(q.id));assert.notEqual(r.decision,'revise');}
 }
}
assert.equal(total,600);assert.equal(changes.length,207);
assert.deepEqual(ledger.filter(r=>r.decision==='unresolved').map(r=>r.id),['PHP-E26-0355','PHP-E26-0549','PHP-E26-0557']);
assert.equal(sample.questions.length,30);assert.equal(sample.random.length,10);assert.equal(new Set(sample.questions.map(x=>x.question.id)).size,30);assert.equal(new Set(sample.questions.map(x=>x.question.format)).size,6);assert.equal(new Set(sample.questions.map(x=>x.question.difficulty.level)).size,3);
for(const x of sample.questions){assert.equal(x.question.options.length,4);assert(x.question.options.every(o=>o.rationale));assert.deepEqual(new Set(x.validationEvidence.map(v=>v.php.slice(0,3))),new Set(['8.4','8.5']));assert(x.validationEvidence.every(v=>v.result.id===x.question.id));}
console.log(`Editorial audit: ${snapshot.files.length} immutable archived files, 600 reviewed identities/objectives/keys, 207 revision increments, 3 explicit unresolved decisions and 30 complete review exports verified.`);
