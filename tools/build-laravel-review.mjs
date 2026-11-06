import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,rmSync,copyFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const root=resolve(new URL('../',import.meta.url).pathname);
export const REVIEW_KEY='underTheHoodLaravelSpecialistReviewV1Stats';
export const COLLECTION_ID='laravel-specialist-review-v1';
export const UNCHANGED_FILES=['styles.css','js/exam.mjs','js/learning-notes.mjs','js/code-viewer.mjs','js/code-highlighting.mjs','js/vendor/highlightjs/core.min.mjs','js/vendor/highlightjs/php.min.mjs','js/vendor/highlightjs/LICENSE'];
export const read=p=>readFileSync(resolve(root,p),'utf8');
export function adapt(q,mapping,collectionId=COLLECTION_ID){
 const options=q.options.map(o=>o.text);
 const kinds={'complete-file':'php-file',fragment:'php-fragment',blade:'blade',configuration:'configuration'};
 const assumptions=q.context.assumptions.join(' ');
 return {
  id:q.id,revision:q.revision,collectionId,track:'Laravel',topic:q.topic,difficulty:q.difficulty.level,
  prompt:q.stem,options,coreOptions:[...options],optionIds:q.options.map(o=>q.id+'@'+q.revision+':'+o.id),
  answer:q.options.findIndex(o=>o.id===q.correctOptionId),explanation:q.explanation.summary,
  learning:{trace:q.explanation.summary,rationales:q.options.map(o=>o.rationale)},
  ...(q.context.files.length?{code:{language:'php',title:'Code to inspect',files:q.context.files.map(f=>({name:f.path,kind:kinds[f.kind],snippet:f.source,...(f.scope?{context:f.scope}:{}),...(f.kind==='blade'?{context:'Blade template source'}:{})}))}}:{}),
  versions:{php:q.runtime.php.join(', '),laravel:q.runtime.laravel,label:'Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. '+q.runtime.errorPolicy+'.'},
  assumptions,objective:q.objective.text,objectiveId:q.objective.id,subtopic:q.subtopic,difficultyReason:q.difficulty.rationale,
  format:q.format,prerequisites:q.prerequisites,references:q.references,status:q.status,
  validationStatus:q.validation.status,validationKind:q.validation.kind,independentEditorialReview:'pending',
  lessonMapping:structuredClone(mapping)
 };
}
export function loadReview(){
 const state=JSON.parse(read('laravel-specialist/WORK_STATE.json'));
 assert.equal(state.accepted,600,'All six sequential batches must be accepted before assembling review');
 assert.equal(state.independentApproval,'pending');
 const mapping=JSON.parse(read('laravel-specialist/curriculum-mappings.json')).questions;
 const records=Array.from({length:6},(_,i)=>JSON.parse(read('laravel-specialist/batches/batch-'+String(i+1).padStart(2,'0')+'.json'))).flat();
 assert.equal(records.length,600);assert.equal(new Set(records.map(q=>q.id)).size,600);
 return records.map(q=>adapt(q,mapping[q.id]));
}
export function build(){
 const output=resolve(root,'_laravel-review'),questions=loadReview();
 rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});
 const put=(p,s)=>{mkdirSync(dirname(resolve(output,p)),{recursive:true});writeFileSync(resolve(output,p),s);};
 for(const p of [...UNCHANGED_FILES,'index.html','js/app.js','js/progress.mjs']){
  mkdirSync(dirname(resolve(output,p)),{recursive:true});copyFileSync(resolve(root,p),resolve(output,p));
 }
 put('js/laravel-bank.mjs','// Local review only; no executable fixtures.\nexport default '+JSON.stringify(questions)+';\n');
 put('js/questions.mjs',[
  "import questions from './laravel-bank.mjs';",
  "export const COLLECTION_ID = '"+COLLECTION_ID+"';",
  "export const SUBJECTS = [{track:'Laravel',label:'Laravel Specialist Review',collectionId:COLLECTION_ID,statsKey:'"+REVIEW_KEY+"',count:600}];",
  "export const TRACKS = ['Laravel'];",
  "export const DIFFICULTIES = ['Foundation','Intermediate','Advanced'];",
  "export const QUESTION_BANK = questions;",
  "export const TRACK_TOPICS = {Laravel:[...new Set(questions.map(q=>q.topic))]};",
  "export const TOPICS = TRACK_TOPICS.Laravel;",
  "export const CURRICULUM = TOPICS.map(topic=>({track:'Laravel',topic,count:questions.filter(q=>q.topic===topic).length}));",''
 ].join('\n'));
 const sha=s=>createHash('sha256').update(s).digest('hex');
 const manifest={collectionId:COLLECTION_ID,count:600,independentApproval:'pending',statsKey:REVIEW_KEY,bankSha256:sha(JSON.stringify(questions)),unchangedFiles:UNCHANGED_FILES.map(path=>({path,sha256:sha(readFileSync(resolve(root,path)))}))};
 put('review.json',JSON.stringify(manifest,null,2)+'\n');
 writeFileSync(resolve(root,'laravel-specialist/evidence/review-artifact.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('Built isolated review artifact with the same application UI; no deployment.');
 return manifest;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)build();
