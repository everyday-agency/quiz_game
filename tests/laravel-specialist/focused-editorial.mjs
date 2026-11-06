import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import PHP from '../../js/php-bank.mjs';
import {adapt} from '../../tools/build-laravel-review.mjs';
import {TARGET_IDS} from '../../laravel-specialist/authoring/focused-editorial.mjs';
const read=p=>JSON.parse(readFileSync(p)),hash=v=>createHash('sha256').update(v).digest('hex');
const baseline=read('laravel-specialist/archive/pre-focused-editorial/questions.json');
const manifest=read('laravel-specialist/archive/pre-focused-editorial/manifest.json');
const all=read('release/laravel-beta/archive/pre-beta/laravel-600.json'); // Completed focused-remediation checkpoint, before the authorized 0437 correction.
const original=new Map(baseline.map(q=>[q.id,q])),changed=[];
assert.equal(all.length,600);assert.equal(new Set(all.map(q=>q.id)).size,600);
for(const q of all){
 const before=original.get(q.id);
 assert.equal(hash(JSON.stringify(before)),manifest.questions.find(x=>x.id===q.id).sha256);
 assert.equal(q.validation.independentEditorialReview,'pending');
 if(!TARGET_IDS.includes(q.id)){assert.deepEqual(q,before,q.id+' out-of-scope edit');continue;}
 changed.push(q.id);
 assert.equal(q.revision,before.revision+1);
 assert.deepEqual(q.objective,before.objective);
 assert.deepEqual(q.curriculum,before.curriculum);
 assert.equal(q.correctOptionId,before.correctOptionId);
 assert.deepEqual(q.options.map(o=>o.id),before.options.map(o=>o.id));
 assert.deepEqual(read('laravel-specialist/archive/revisions/'+q.id+'-r'+before.revision+'.json'),before);
 assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.text)).size,4);
 assert.equal(q.options.filter(o=>o.id===q.correctOptionId).length,1);
 assert.equal(q.explanation.summary,q.options.find(o=>o.id===q.correctOptionId).rationale);
 assert.deepEqual(q.explanation.trace,q.options.map(o=>o.rationale));
 const b=Math.ceil(Number(q.id.slice(-4))/100),technical=read('laravel-specialist/evidence/batch-'+b+'-technical.json');
 for(const r of technical.reports){const item=r.results.find(i=>i.id===q.id);assert(item);assert.equal(item.kind,q.validation.kind);if(item.kind==='runtime')assert.equal(item.stdout,q.validation.stdout);}
}
assert.deepEqual(changed,TARGET_IDS);
const curriculum=read('laravel-specialist/curriculum-mappings.json');
assert.equal(hash(readFileSync('laravel-specialist/curriculum-mappings.json')),manifest.curriculumHash);
for(const f of manifest.protected.files){
 const changedForBeta=['js/questions.mjs','js/progress.mjs','js/app.js','index.html','styles.css','tools/build-site.mjs'];
 const path=changedForBeta.includes(f.path)?'release/laravel-beta/archive/pre-beta/'+f.path:f.path;
 assert.equal(hash(readFileSync(path)),f.sha256,path);
}
assert.equal(hash(JSON.stringify(PHP)),manifest.protected.phpSha256);
assert.equal(PHP.length,620);
assert.equal(hash(readFileSync('laravel-specialist/archive/legacy-laravel-600.json')),manifest.protected.legacyArchiveSha256);
const selected=read('laravel-specialist/evidence/focused-editorial/random-selection.json');
assert.equal(selected.poolSize,593);assert.equal(new Set(selected.ids).size,15);
const rank=id=>hash(selected.seed+':'+id);
const pool=all.filter(q=>!TARGET_IDS.includes(q.id)).map(q=>q.id);
assert.deepEqual(selected.ids,pool.sort((a,b)=>rank(a).localeCompare(rank(b))).slice(0,15));
for(const [name,ids] of [['FOCUSED_REVISED_7',TARGET_IDS],['SPOT_CHECK_15',selected.ids]]){
 const exported=read('laravel-specialist/'+name+'.json');
 assert.equal(exported.independentEditorialApproval,'pending');
 assert.deepEqual(exported.questions,ids.map(id=>adapt(all.find(q=>q.id===id),curriculum.questions[id])));
}
for(const id of selected.ids)assert.deepEqual(all.find(q=>q.id===id),original.get(id));
const outbox=all.find(q=>q.id==='LAR-S26-0314');
assert(!/outbox|idempotent|deduplicat/i.test(outbox.prerequisites.join(' ')+outbox.context.assumptions.join(' ')),'Solution terminology leaked in preparatory metadata');
for(const id of ['LAR-S26-0284','LAR-S26-0400'])assert.equal(all.find(q=>q.id===id).difficulty.level,'Intermediate');
const report={changed,unchangedLaravelRecords:593,unchangedPhpRecords:620,objectivesPreserved:true,answerIdsAndPositionsPreserved:true,revisionIncrements:7,archivedPriorVersions:7,lessonMappingsUnchanged:true,randomUnchangedSpotCheck:15,independentEditorialApproval:'pending'};
writeFileSync('laravel-specialist/evidence/focused-editorial/preservation-and-exports.json',JSON.stringify(report,null,2)+'\n');
console.log(report);
