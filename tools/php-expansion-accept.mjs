import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const batch=Number(process.env.BATCH||1);const padded=String(batch).padStart(2,'0');
const refresh=process.argv.includes('--refresh');
const qs=(await import(`../php-expansion/authoring/batch-${padded}.mjs`)).default;
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const write=(p,v)=>writeFileSync(new URL('../'+p,import.meta.url),JSON.stringify(v,null,2)+'\n');
const checks=read(`php-expansion/evidence/batch-${batch}-checks.json`);
const editorial=read(`php-expansion/reviews/batch-${padded}-editorial.json`);
const duplicates=read(`php-expansion/reviews/batch-${padded}-duplicates.json`);
const runtime=read(`php-expansion/evidence/batch-${batch}-runtime.json`);
assert.equal(qs.length,100);
for(const report of [checks,editorial,duplicates,...runtime])assert.equal(report.sourceHash,sha(qs),'All gates must concern the exact current draft');
assert.equal(editorial.independentApproval,'pending');assert.equal(editorial.records.length,100);
assert.deepEqual(editorial.records.map(r=>r.id),qs.map(q=>q.id));assert(editorial.records.every(r=>r.finding&&['retain for independent review','revised; independent review pending','unresolved; independent decision required'].includes(r.decision)));
assert(checks.duplicateCandidates.every(c=>duplicates.records.some(r=>r.a===c.a&&r.b===c.b&&r.reason)));
assert(checks.wordingSignals.lengthOutliers.every(id=>duplicates.lengthReview[id]));
assert.equal(new Set(runtime.map(r=>r.php.slice(0,3))).size,2);
const state=read('php-expansion/WORK_STATE.json');
for(let prior=1;prior<batch;prior++)assert.equal(state.batches[prior-1].status,'accepted-for-review','Accept batches sequentially');
const output=new URL(`../js/php-expansion/batches/batch-${padded}.mjs`,import.meta.url);
if(existsSync(output)){
 assert(refresh,'Accepted batches require an explicit --refresh revision');
 assert.equal(state.releaseAuthorized,false,'Released records require a separate migration process');
 const old=(await import(output.href)).default;
 assert.deepEqual(old.map(q=>q.id),qs.map(q=>q.id),'A revision must preserve every identity');
 const changed=[];
 for(let i=0;i<qs.length;i++){
  const {lessonIds,lessonMappingStatus,coverageComplete,...curriculum}=qs[i].curriculum;
  const compare={...qs[i],status:old[i].status,curriculum,validation:{...qs[i].validation,status:old[i].validation.status,independentEditorialReview:'pending',evidenceBatch:batch}};
  if(JSON.stringify(compare)!==JSON.stringify(old[i])){
   assert(qs[i].revision>old[i].revision,qs[i].id+': changed accepted content requires a higher revision');
   changed.push({id:qs[i].id,from:old[i].revision,to:qs[i].revision});
  }
 }
 assert(changed.length,'A refresh must contain an explicit content revision');
 const archive=new URL(`../php-expansion/archive/pre-release/batch-${padded}-${sha(old).slice(0,12)}.mjs`,import.meta.url);
 mkdirSync(new URL('../php-expansion/archive/pre-release/',import.meta.url),{recursive:true});
 assert(!existsSync(archive),'Do not overwrite a previous revision archive');
 writeFileSync(archive,readFileSync(output));
 write(`php-expansion/evidence/batch-${batch}-revision.json`,{reason:'Explicit pre-release editorial revision; independent approval pending',changed,previousSha256:sha(old),archive:archive.pathname,productionActivation:false});
}else assert(!refresh,'Refresh requires an already accepted batch');
const records=qs.map(q=>{const {lessonIds,lessonMappingStatus,coverageComplete,...curriculum}=q.curriculum;return {...q,status:'editorially-reviewed',curriculum,validation:{...q.validation,status:'editorially-reviewed',independentEditorialReview:'pending',evidenceBatch:batch}};});
const mappingPath=new URL('../js/php-expansion/lesson-mappings.mjs',import.meta.url);
const mappings=existsSync(mappingPath)?{...(await import(mappingPath.href)).default}:{};
for(const q of qs){if(refresh)assert(mappings[q.id]);else assert(!mappings[q.id]);mappings[q.id]={lessonIds:q.curriculum.lessonIds,mappingStatus:q.curriculum.lessonMappingStatus,coverageComplete:q.curriculum.coverageComplete,prerequisites:q.prerequisites};}
mkdirSync(new URL('../js/php-expansion/batches/',import.meta.url),{recursive:true});
writeFileSync(output,'// Accepted for local independent review only. Production activation is not authorized.\nexport default '+JSON.stringify(records,null,2)+';\n');
writeFileSync(mappingPath,'// Working Lessons 1–31 only. Edit mappings independently of question identities and content.\nexport default '+JSON.stringify(mappings,null,2)+';\n');
write(`php-expansion/evidence/batch-${batch}-acceptance.json`,{batch,count:100,disposition:'accepted-for-review',authoringSha256:sha(qs),publishedRecordsSha256:sha(records),independentEditorialApproval:'pending',productionActivation:false,runtime:runtime.map(({php,executions,linted})=>({php,executions,linted})),editorialReview:`php-expansion/reviews/batch-${padded}-editorial.json`,duplicateReview:`php-expansion/reviews/batch-${padded}-duplicates.json`,ids:records.map(q=>q.id)});
state.batches[batch-1].status='accepted-for-review';state.batches[batch-1].draftCount=100;
state.acceptedForReview=state.batches.filter(b=>b.status==='accepted-for-review').length*100;
state.phase=batch<6?`batch-${batch+1}-authoring`:'integration-preparation';state.next=batch<6?`Author and validate batch ${batch+1}; no automatic question expansion. Complete remaining batches, isolated app integration and browser/regression tests before release review.`:'Prepare 620-question isolated review collection and full regression/browser tests; keep normal PHP bank unchanged.';
state.archiveCommit='c56a92c';write('php-expansion/WORK_STATE.json',state);
console.log(`Batch ${batch}: 100 accepted for local review; independent approval pending; normal examinations unchanged.`);
