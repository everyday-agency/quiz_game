// Authorized seven-record remediation, separate from one-time batch acceptance.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {TARGET_IDS} from '../laravel-specialist/authoring/focused-editorial.mjs';
const read=p=>JSON.parse(readFileSync(p)),write=(p,v)=>writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const old=read('laravel-specialist/archive/pre-focused-editorial/questions.json');
const original=new Map(old.map(q=>[q.id,q]));
const state=read('laravel-specialist/WORK_STATE.json');
assert.equal(state.accepted,600);assert.equal(state.independentApproval,'pending');assert.equal(state.productionActivation,false);
const result=[],batchData=[];
for(let batch=1;batch<=6;batch++){
 const pad=String(batch).padStart(2,'0'),path='laravel-specialist/batches/batch-'+pad+'.json',current=read(path);
 for(const q of current)assert.deepEqual(q,original.get(q.id),'Refusing to overwrite changes since focused baseline');
 const authored=(await import('../laravel-specialist/authoring/batch-'+pad+'.mjs')).default;
 const changed=authored.filter(q=>TARGET_IDS.includes(q.id));
 if(!changed.length){result.push(...current);continue;}
 const technical=read('laravel-specialist/evidence/batch-'+batch+'-technical.json');
 assert.equal(technical.sourceHash,sha(authored));assert.deepEqual(new Set(technical.reports.map(r=>r.php.slice(0,3))),new Set(['8.4','8.5']));
 for(const r of technical.reports)assert.equal(r.records,100);
 const next=current.map(previous=>{
  const draft=authored.find(q=>q.id===previous.id);
  if(!TARGET_IDS.includes(previous.id)){
   const comparable={...draft,status:previous.status,validation:{...draft.validation,status:previous.validation.status,evidence:previous.validation.evidence}};
   assert.deepEqual(comparable,previous,'Out-of-scope authoring change '+previous.id);
   return previous;
  }
  assert.equal(draft.revision,previous.revision+1);
  assert.deepEqual(draft.objective,previous.objective);
  assert.deepEqual(draft.options.map(o=>o.id),previous.options.map(o=>o.id));
  assert.equal(draft.correctOptionId,previous.correctOptionId);
  assert.deepEqual(read('laravel-specialist/archive/revisions/'+previous.id+'-r'+previous.revision+'.json'),previous);
  return{...draft,status:'internal-validated',validation:{...draft.validation,status:draft.validation.kind==='runtime'?'runtime-verified':'documented-contract-reviewed',evidence:'laravel-specialist/evidence/batch-'+batch+'-technical.json'}};
 });
 result.push(...next);batchData.push({batch,pad,path,next,sourceHash:sha(authored),acceptedHash:sha(next),changed});
}
const actual=result.filter(q=>sha(q)!==sha(original.get(q.id))).map(q=>q.id);
assert.deepEqual(actual,TARGET_IDS);
for(const b of batchData){
 write(b.path,b.next);
 const reviewPath='laravel-specialist/reviews/batch-'+b.pad+'.json',review=read(reviewPath);
 review.sourceHash=b.sourceHash;
 review.focusedUpdate={scope:'Only seven externally identified questions across batches 3, 4 and 6; no new full editorial pass',ids:b.changed.map(q=>q.id),report:'laravel-specialist/FOCUSED_EDITORIAL_CORRECTIONS.md',independentApproval:'pending'};
 for(const item of review.itemReviews){const q=b.next.find(q=>q.id===item.id);if(TARGET_IDS.includes(item.id)){item.revision=q.revision;item.difficulty=q.difficulty.level;item.validation=q.validation.kind;}}
 write(reviewPath,review);
 Object.assign(state.batches[b.batch-1],{sourceHash:b.sourceHash,acceptedHash:b.acceptedHash});
}
state.phase='focused-editorial-corrections-validation';
state.next='Complete focused schema/editorial checks, exports, static rebuild and Chrome regressions; keep independent approval pending.';
state.focusedEditorial={ids:TARGET_IDS,baseline:'laravel-specialist/archive/pre-focused-editorial/manifest.json',report:'laravel-specialist/FOCUSED_EDITORIAL_CORRECTIONS.md',independentApproval:'pending'};
write('laravel-specialist/WORK_STATE.json',state);
console.log('Updated exactly seven review records; 593 unchanged, objectives and answer IDs preserved.');
