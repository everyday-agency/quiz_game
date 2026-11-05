import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url),read=p=>JSON.parse(readFileSync(new URL(p,root))),sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const manifest=read('php-expansion/focused-correction/changes.json'),expected=['PHP-E26-0300','PHP-E26-0355','PHP-E26-0549','PHP-E26-0557'],actual=[];
assert.deepEqual(manifest.scope,expected);assert.equal(manifest.independentApproval,'pending');assert.equal(manifest.productionActivation,false);
for(const f of read(manifest.archive+'snapshot.json').files)assert.equal(createHash('sha256').update(readFileSync(new URL(manifest.archive+f.path,root))).digest('hex'),f.sha256,f.path);
const baselineMaps=(await import('../../'+manifest.archive+'js/php-expansion/lesson-mappings.mjs')).default,currentMaps=(await import('../../js/php-expansion/lesson-mappings.mjs')).default;
const ledger=read('php-expansion/editorial-audit/records.json'),oldLedger=read(manifest.archive+'php-expansion/editorial-audit/records.json');
for(let b=1;b<=6;b++){
 const p=String(b).padStart(2,'0'),before=(await import('../../'+manifest.archive+`js/php-expansion/batches/batch-${p}.mjs`)).default,after=(await import(`../../js/php-expansion/batches/batch-${p}.mjs`)).default;
 assert.deepEqual(after.map(q=>q.id),before.map(q=>q.id));
 for(let i=0;i<100;i++){
  const a=before[i],q=after[i];assert.equal(q.validation.independentEditorialReview,'pending');
  if(!expected.includes(q.id)){assert.deepEqual(q,a,q.id+': outside focused scope');assert.deepEqual(currentMaps[q.id],baselineMaps[q.id]);assert.deepEqual(ledger.find(r=>r.id===q.id),oldLedger.find(r=>r.id===q.id));continue;}
  actual.push(q.id);const change=manifest.changes.find(c=>c.id===q.id);assert.equal(change.beforeSha256,sha(a));assert.equal(change.afterSha256,sha(q));assert.equal(q.revision,a.revision+1);
  if(q.id==='PHP-E26-0355'){const {revision:ar,objective:ao,...aRest}=a,{revision:qr,objective:qo,...qRest}=q;assert.deepEqual(qRest,aRest,'0355 scenario, options, answer and explanations must be unchanged');assert(qo.text.includes('303')&&qo.text.includes('307'));}
  if(q.id==='PHP-E26-0300'){assert.deepEqual(q.objective,a.objective);assert.equal(q.correctOptionId,a.correctOptionId);}
  if(manifest.retargetedIds.includes(q.id)){assert.notEqual(q.objective.id,a.objective.id);assert.notEqual(q.objective.text,a.objective.text);assert(q.validation.contrasts.length);}
 }
}
assert.deepEqual(actual,expected);assert.equal(ledger.filter(r=>r.decision==='unresolved').length,0);
const sample=read('php-expansion/editorial-audit/review-30.json');for(const id of expected){const s=sample.questions.find(x=>x.question.id===id);assert(s);assert.equal(sha(s.question),manifest.changes.find(c=>c.id===id).afterSha256);}
console.log('Focused correction: exactly four revised IDs; other 596 records, mappings and review decisions identical; archive hashes, authorized objective changes, 0355 scenario preservation and refreshed sample verified.');
