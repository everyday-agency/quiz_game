// Evidence aggregation and review export, not an automated substitute for editorial judgment.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(readFileSync(p));
const write=(p,x)=>writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const sha=x=>createHash('sha256').update(x).digest('hex');
const batches=Array.from({length:6},(_,i)=>read('laravel-specialist/batches/batch-'+String(i+1).padStart(2,'0')+'.json'));
const qs=batches.flat(),state=read('laravel-specialist/WORK_STATE.json'),mappings=read('laravel-specialist/curriculum-mappings.json');
assert.equal(qs.length,600);assert.equal(state.accepted,600);assert.equal(state.productionActivation,false);
const count=f=>Object.fromEntries([...new Set(qs.map(f))].sort().map(k=>[k,qs.filter(q=>f(q)===k).length]));
const checks=[],reviews=[],technical=[];
for(let i=1;i<=6;i++){
 const c=read('laravel-specialist/evidence/batch-'+i+'-checks.json'),r=read('laravel-specialist/reviews/batch-'+String(i).padStart(2,'0')+'.json'),t=read('laravel-specialist/evidence/batch-'+i+'-technical.json');
 assert.equal(c.sourceHash,r.sourceHash);assert.equal(c.sourceHash,t.sourceHash);
 assert.equal(state.batches[i-1].acceptedHash,sha(JSON.stringify(batches[i-1])));
 assert(r.completed&&r.independentApproval==='pending');
 for(const [id,path] of Object.entries({bootstrapSha256:'laravel-specialist/validation/bootstrap.php',runnerSha256:'tests/laravel-specialist/runtime.mjs',composerLockSha256:'laravel-specialist/validation/harness/composer.lock'}))assert.equal(t.harness[id],sha(readFileSync(path)));
 checks.push(c);reviews.push(r);technical.push(t);
}
const normalize=s=>s.toLowerCase().replace(/\$[a-z_]\w*/g,'variable').replace(/\b\d+\b/g,'number').replace(/\s+/g,' ').trim();
const fingerprints=qs.map(q=>sha(normalize(JSON.stringify([q.stem,q.context.files,q.options.map(o=>o.text)]))));
assert.equal(new Set(fingerprints).size,600);
assert.equal(new Set(qs.map(q=>q.objective.id)).size,600);
const lexical=checks.flatMap(c=>c.duplicateCandidates);
const dispositions=reviews.flatMap(r=>r.duplicateDispositions||r.duplicateCandidateDispositions||[]).map(d=>({...d,reason:d.reason||d.decision}));
for(const p of lexical)assert(dispositions.some(d=>d.a===p.a&&d.b===p.b&&d.reason),'Unreviewed candidate '+p.a+' '+p.b);
const weighted=read('laravel-specialist/evidence/final-semantic-candidates.json');
const weightedDecisions=weighted.map(p=>({...p,decision:'retain-distinct',reason:p.a==='LAR-S26-0157'?'Nested $loop->parent access and outer iteration identity versus index/iteration offsets in one loop; different variable lookup and execution trace.':'Auth::once request-only state versus Auth::attempt credential checking and session persistence; distinct method contracts.'}));
const topicCounts=count(q=>q.topic);
const lessons=Object.fromEntries(Array.from({length:8},(_,i)=>[i+1,qs.filter(q=>mappings.questions[q.id].lessonIds?.includes(i+1)).length]));
const mapped=qs.filter(q=>mappings.questions[q.id].lessonIds!==null).length;
for(const q of qs){const m=mappings.questions[q.id];assert(m&& (m.lessonIds===null||m.lessonIds.every(n=>n>=1&&n<=8)));assert.equal(q.validation.independentEditorialReview,'pending');}
const contracts=qs.filter(q=>q.validation.kind==='documented-contract').map(q=>({id:q.id,topic:q.topic,source:q.validation.source,sourceRoot:q.validation.sourceRoot||'framework',reason:q.validation.reason}));
const files=qs.flatMap(q=>q.context.files.map(f=>({id:q.id,kind:f.kind})));
const fileKinds=Object.fromEntries([...new Set(files.map(f=>f.kind))].map(k=>[k,files.filter(f=>f.kind===k).length]));
const report={createdAt:new Date().toISOString(),count:600,ids:['LAR-S26-0001','LAR-S26-0600'],batches:batches.map((q,i)=>({batch:i+1,count:q.length,runtime:technical[i].reports[0].runtime,contracts:100-technical[i].reports[0].runtime,sourceHash:checks[i].sourceHash,acceptedHash:state.batches[i].acceptedHash})),
formats:count(q=>q.format),difficulty:count(q=>q.difficulty.level),keyPositions:count(q=>q.options.findIndex(o=>o.id===q.correctOptionId)+1),topicCounts,
curriculum:{mapped,unmapped:600-mapped,lessonCounts:lessons,note:'Working topic mappings to completed Lessons 1–8 only; detailed lesson contents must be confirmed before using them as an exam eligibility gate. Future lessons remain null.'},
validation:{php:technical[0].reports.map(r=>r.php),laravel:'13.40.0',inertia:'3.7.0',runtimePerVersion:600-contracts.length,contractsPerVersion:contracts.length,totalQuestionVersionChecks:1200,fileKinds},
wording:{uniqueLongest:checks.reduce((n,c)=>n+c.wording.uniqueLongest,0),uniqueShortest:checks.reduce((n,c)=>n+c.wording.uniqueShortest,0),outliers:checks.flatMap(c=>c.wording.outliers),note:'Length signals are heuristics. Exact short outputs are not padded to equal length.'},
duplicates:{normalizedWholeQuestionDuplicates:0,duplicateObjectiveIds:0,lexicalCandidates:lexical.length,lexicalDispositions:dispositions,weightedCandidates:weightedDecisions,note:'All candidate pairs and adjacent objective families received author review. Similarity scores do not prove semantic uniqueness.'},
archive:{legacyCount:600,revisedQuestionCount:qs.filter(q=>q.revision>1).length,archivedVersions:readdirSync('laravel-specialist/archive/revisions').filter(p=>p.endsWith('.json')).length},
independentApproval:'pending',productionActivation:false};
write('laravel-specialist/evidence/final-audit.json',report);
write('laravel-specialist/evidence/documented-contracts.json',contracts);
write('laravel-specialist/evidence/objective-coverage.json',qs.map(q=>({id:q.id,revision:q.revision,topic:q.topic,subtopic:q.subtopic,objective:q.objective,difficulty:q.difficulty,prerequisites:q.prerequisites,format:q.format,lessonMapping:mappings.questions[q.id]})));
write('laravel-specialist/reviews/final.json',{...report,reviewer:'author cross-batch editorial review; NOT independent approval',completed:true,
manualChecks:['Reviewed aggregate wording/length signals and retained the exact missing output in 0596 without padding.','Reviewed all lexical candidate dispositions and the second weighted corpus pass.','Reviewed related cross-domain mechanisms separately from actual duplicate assessment objectives.','Reviewed all mapped objectives against the supplied completed-topic outline; Eloquent and future topics stay unmapped.','Reviewed seven Advanced scenarios for interacting constraints; narrow API knowledge stays Foundation or Intermediate.','Reviewed all six batch correction records and runtime limitations; no documented contract relabelled as executed.','Inspected desktop PHP, mobile multi-file Blade and Exam screenshots after full browser traversal.'],
remaining:['Independent technical/editorial approval pending for all 600.','No real distributed service, cloud provider, Nginx or Octane runtime validation is claimed for documented contracts.','Difficulty and distractor effectiveness need learner data; current levels are editorial judgments.','Curriculum mappings are working topic mappings, not proof of a learner’s completed prerequisites.']});
const samples=[1,11,27,50,97,105,136,158,181,193,206,242,280,284,299,308,314,339,366,400,404,429,475,487,499,535,551,566,569,596].map(n=>qs[n-1]);
assert.equal(samples.length,30);assert.equal(new Set(samples.map(q=>q.id)).size,30);
write('laravel-specialist/REVIEW_30.json',{independentApproval:'pending',selection:'Five questions per batch; executable, contract, code/no-code, six formats and three difficulty levels represented.',questions:samples});
let txt='LARAVEL SPECIALIST — 30 QUESTIONS FOR INDEPENDENT REVIEW\n\nAll 600 questions remain pending independent approval. These are five complete records from each batch, with keys and all option rationales for reviewer use. The local quiz hides keys during Exam mode.\n\n';
for(const q of samples){
 txt+='='.repeat(78)+'\n'+q.id+' · revision '+q.revision+' · '+q.format+' · '+q.difficulty.level+'\n'+q.topic+' / '+q.subtopic+'\nObjective: '+q.objective.text+'\nDifficulty rationale: '+q.difficulty.rationale+'\nPrerequisites: '+q.prerequisites.join('; ')+'\nVersions: Laravel '+q.runtime.laravel+'; verified '+q.runtime.validatedLaravel+'; PHP '+q.runtime.php.join(' / ')+'\nLesson mapping: '+JSON.stringify(mappings.questions[q.id])+'\nAssumptions: '+(q.context.assumptions.join(' ')||'Only the scenario and code stated below; ordinary pinned framework defaults unless specified.')+'\n\n'+q.stem+'\n\n';
 for(const f of q.context.files)txt+='FILE '+f.path+' ['+f.kind+']'+(f.scope?' — '+f.scope:'')+'\n'+f.source+'\n\n';
 q.options.forEach((o,i)=>txt+=String.fromCharCode(65+i)+'. '+o.text+'\n');
 txt+='\nCorrect answer: '+String.fromCharCode(65+q.options.findIndex(o=>o.id===q.correctOptionId))+'\n'+q.explanation.summary+'\n\n';
 q.options.forEach((o,i)=>txt+=String.fromCharCode(65+i)+': '+o.rationale+'\n');
 txt+='\nValidation: '+q.validation.status+'; evidence '+q.validation.evidence+'\n'+(q.validation.kind==='runtime'?'Observed stdout on both PHP versions: '+JSON.stringify(q.validation.stdout):'Contract: '+q.validation.reason)+'\nReferences:\n'+q.references.join('\n')+'\n\n';
}
writeFileSync('laravel-specialist/REVIEW_30.txt',txt);
const coverage=['LARAVEL SPECIALIST — OBJECTIVE AND CURRICULUM COVERAGE','',JSON.stringify({formats:report.formats,difficulty:report.difficulty,curriculum:report.curriculum},null,2),'','Counts by topic:',...Object.entries(topicCounts).map(([k,v])=>k+': '+v),'','All 600 stable objective mappings:',''];
for(const q of qs)coverage.push(q.id+' | '+q.topic+' | '+q.subtopic+' | '+q.difficulty.level+' | lessons '+JSON.stringify(mappings.questions[q.id].lessonIds)+' | '+q.objective.text);
writeFileSync('laravel-specialist/COVERAGE.txt',coverage.join('\n')+'\n');
console.log(JSON.stringify({count:600,validation:report.validation,formats:report.formats,difficulty:report.difficulty,curriculum:report.curriculum,wording:report.wording,archive:report.archive,lexical:lexical.length,weighted:weightedDecisions.length,sampleFormats:[...new Set(samples.map(q=>q.format))]},null,2));
