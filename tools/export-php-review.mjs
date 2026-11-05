// Exports existing accepted records and evidence. Does not author or revise questions.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import mappings from '../js/php-expansion/lesson-mappings.mjs';
import curriculum from '../js/php-expansion/lessons.mjs';
const root=new URL('../',import.meta.url);
const read=path=>JSON.parse(readFileSync(new URL(path,root)));
const write=(path,value)=>writeFileSync(new URL(path,root),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const count=(records,key)=>Object.fromEntries([...new Set(records.map(key))].map(k=>[k,records.filter(q=>key(q)===k).length]));
const all=[],batches=[];
for(let b=1;b<=6;b++){
 const records=(await import('../js/php-expansion/batches/batch-'+String(b).padStart(2,'0')+'.mjs')).default;
 const acceptance=read('php-expansion/evidence/batch-'+b+'-acceptance.json');
 assert.equal(records.length,100);assert.equal(sha(records),acceptance.publishedRecordsSha256);
 const checks=read('php-expansion/evidence/batch-'+b+'-checks.json');
 const duplicates=read('php-expansion/reviews/batch-'+String(b).padStart(2,'0')+'-duplicates.json');
 batches.push({batch:b,count:records.length,ids:[records[0].id,records.at(-1).id],disposition:acceptance.disposition,independentApproval:acceptance.independentEditorialApproval,sourceHash:acceptance.authoringSha256,recordsHash:acceptance.publishedRecordsSha256,runtime:acceptance.runtime,formats:checks.formats,difficulty:checks.difficulty,knownLessonMappings:checks.knownLessonMappings,unmapped:checks.unmapped,completeWorkingCoverage:checks.studiedCoverageEligible,similarityCandidates:checks.duplicateCandidates.length,documentedPairReviews:duplicates.records.length,wording:checks.wordingSignals});
 all.push(...records);
}
assert.equal(all.length,600);assert.equal(new Set(all.map(q=>q.id)).size,600);
assert.equal(new Set(all.map(q=>q.objective.id)).size,600);
const runtimeSource=readFileSync(new URL('js/php-expansion/review-data.mjs',root));
const uniqueLongest=all.filter(q=>q.options.filter(o=>o.text.length===Math.max(...q.options.map(o=>o.text.length))).length===1);
const known=all.filter(q=>mappings[q.id].lessonIds?.length);
const code=all.filter(q=>q.context.files.length);
const coverage={
 scope:'600 new records only; retained pilot 20 and original active PHP 300 are excluded from these distributions',
 newQuestions:600,retainedPilot:20,reviewCollection:620,normalPhpStillActive:300,
 independentApproval:'pending for all 600 new records',productionActivation:false,
 byTopic:count(all,q=>q.topic),byFormat:count(all,q=>q.format),byDifficulty:count(all,q=>q.difficulty.level),byValidationKind:count(all,q=>q.validation.kind),
 distinctObjectives:new Set(all.map(q=>q.objective.id)).size,
 workingLessons:{knownQuestions:known.length,unmappedQuestions:600-known.length,completeCoverage:all.filter(q=>mappings[q.id].coverageComplete).length,note:'Multi-lesson counts overlap; mappings are provisional and editable independently of IDs. Partial coverage is excluded in studied-only mode.',lessons:curriculum.map(l=>({...l,questions:all.filter(q=>mappings[q.id].lessonIds?.includes(l.id)).length}))},
 code:{questionsWithFiles:code.length,scenarioOnly:600-code.length,sourceFiles:code.flatMap(q=>q.context.files).length,multiFileQuestions:code.filter(q=>q.context.files.length>1).length,kinds:count(code.flatMap(q=>q.context.files),f=>f.kind),note:'Displayed sources are complete named files; candidate replacement fragments are tested inside their stated host file.'},
 wording:{questionsWithUniqueLongest:uniqueLongest.length,uniqueLongestCorrect:batches.reduce((n,b)=>n+b.wording.uniqueLongestCorrect,0),uniqueShortestCorrect:batches.reduce((n,b)=>n+b.wording.uniqueShortestCorrect,0),lengthOutliers:batches.flatMap(b=>b.wording.lengthOutliers),authoredKeyPositions:count(all,q=>q.options.findIndex(o=>o.id===q.correctOptionId)+1),note:'Length and lexical checks are review signals, not proof of no answer leakage. Source positions are shuffled for every session.'},
 duplicates:{heuristicCandidatePairs:batches.reduce((n,b)=>n+b.similarityCandidates,0),documentedPairReviews:batches.reduce((n,b)=>n+b.documentedPairReviews,0),note:'Includes comparisons to the retained pilot and archived PHP bank. Manual reviews can find overlaps missed by token similarity.'},
 runtimeProjection:{bytes:runtimeSource.length,gzipBytes:gzipSync(runtimeSource).length,note:'Compression estimate, not a promise about HTTP hosting configuration. Projection is lazy loaded only by the review route.'},
 batches,
};
write('php-expansion/COVERAGE.json',coverage);
write('php-expansion/QUESTION_IDS.txt',all.map(q=>q.id).join('\n')+'\n');
write('php-expansion/MANIFEST.json',all.map(q=>({id:q.id,revision:q.revision,batch:q.validation.evidenceBatch,recordSha256:sha(q),status:q.status,independentApproval:q.validation.independentEditorialReview,topic:q.topic,subtopic:q.subtopic,objective:q.objective,format:q.format,difficulty:q.difficulty.level,php:q.runtime.php,lessonMapping:mappings[q.id],validationKind:q.validation.kind})));
const sampleIds=[1,204,419,516,34,231,341,530,46,164,358,557,67,478,573,81,386,591,193,599].map(n=>'PHP-E26-'+String(n).padStart(4,'0'));
const sample=sampleIds.map(id=>all.find(q=>q.id===id));assert(sample.every(Boolean));
const lines=['20 REPRESENTATIVE NEW PHP QUESTIONS — INDEPENDENT REVIEW COPY','',
 'Exported verbatim from accepted-for-review records. No questions are generated by this export.',
 'All six formats and all three difficulty levels are represented. This is a varied review sample, not a statistical certification of the 600-item bank.',
 'Review the stem, context and four options before consulting the answer section. Every new question still awaits independent editorial approval.',''];
for(const q of sample){
 lines.push('='.repeat(78),q.id+' — '+q.format+' — '+q.difficulty.level,'Topic: '+q.topic,'Subtopic/objective ID: '+q.objective.id,'Learning objective: '+q.objective.text,'Difficulty rationale: '+q.difficulty.rationale,'Prerequisites: '+q.prerequisites.join('; '),'PHP versions: '+q.runtime.php.join(', '),'Runtime: '+q.runtime.sapi+'; '+q.runtime.errorPolicy,'Extensions: '+(q.runtime.extensions.join(', ')||'none beyond PHP core'),'Working lesson mapping: '+(mappings[q.id].lessonIds?.join(', ')||'unmapped')+'; complete coverage: '+mappings[q.id].coverageComplete,'',q.stem,'','Assumptions:',...q.context.assumptions.map(a=>'- '+a),'');
 for(const f of q.context.files)lines.push('FILE: '+f.path+' ['+f.kind+']',f.source);
 if(!q.context.files.length)lines.push('No executable source: requirements/document-backed scenario.','');
 for(const [i,o]of q.options.entries())lines.push(String.fromCharCode(65+i)+'. '+o.text,'');
 lines.push('ANSWER AND REVIEW EVIDENCE','Correct: '+String.fromCharCode(65+q.options.findIndex(o=>o.id===q.correctOptionId))+' ['+q.correctOptionId+']',q.explanation.summary,'Trace: '+q.explanation.trace,'');
 for(const [i,o]of q.options.entries())lines.push(String.fromCharCode(65+i)+': '+o.rationale,...(o.misconception?['Misunderstanding tested: '+o.misconception]:[]),'');
 lines.push('Validation: '+q.validation.kind+'; status '+q.validation.status+'; independent approval '+q.validation.independentEditorialReview,'Batch evidence: evidence/batch-'+q.validation.evidenceBatch+'-runtime.json; evidence/batch-'+q.validation.evidenceBatch+'-acceptance.json','Sources:',...q.references,'');
}
write('php-expansion/EDITORIAL_REVIEW_20.txt',lines.join('\n')+'\n');
console.log('Exported 600-entry ID/coverage manifests and 20 existing representative records. No question content changed.');
