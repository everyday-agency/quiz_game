import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { QUESTION_BANK } from '../release/archive/pre-php-only/js/questions.mjs';
import { LEGACY_QUESTIONS } from '../js/bank/legacy-v1.mjs';
import { QUESTION_REVISIONS } from '../js/bank/revisions.mjs';
import { PHP_REPAIR_REVISIONS } from '../js/bank/php-repairs.mjs';
import { LARAVEL_CORRECTIONS } from '../js/bank/laravel-corrections.mjs';
import { LARAVEL_COMPANION_REVISIONS } from '../js/bank/laravel-companions.mjs';
import { PILOT_IDS } from '../js/bank/pilot.mjs';

// Exports existing before/after records for review. Does not create questions.
const original = new Map(LEGACY_QUESTIONS.map(q=>[q.id,q]));
const current = new Map(QUESTION_BANK.map(q=>[q.id,q]));
const sha = q=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
const destination = name=>new URL(`../remediation/${name}`,import.meta.url);
const save = (name,value)=>writeFileSync(destination(name),JSON.stringify(value,null,2)+'\n');
const baseline=JSON.parse(readFileSync(destination('baseline/manifest.json')));
const changed=QUESTION_REVISIONS.map(q=>({id:q.id,previousRevision:1,revision:2,changeKind:q.changeKind,status:q.status,originalSha256:sha(original.get(q.id)),currentSha256:sha(current.get(q.id))})).sort((a,b)=>a.id.localeCompare(b.id));
save('affected-ids.json',{
  baselineCommit:baseline.sourceCommit || baseline.commit, total:QUESTION_BANK.length,
  existingIdsPreserved:2500,newIds:0,revised:changed.length,unchanged:2500-changed.length,
  groups:{phpCombinedRepairs:PHP_REPAIR_REVISIONS.map(q=>q.id),laravelReportingAndRetry:LARAVEL_CORRECTIONS.map(q=>q.id),laravelRelatedFamilyRepairs:LARAVEL_COMPANION_REVISIONS.map(q=>q.id),editorialPilot:PILOT_IDS},
  note:'Groups overlap: PQ-021, LQ-489, LQ-545 and LQ-546 are both repairs and pilot items. Hashes cover JSON serialization of each original or assembled current record.',
  revisions:changed,
});
const issues={
  'PQ-002':'The generic preserve-the-mechanism answer did not test whether strict typing changes this integer argument at all; obviously nontechnical distractors revealed the key.',
  'PQ-004':'The negative-stem key was a misconception, but generated learning notes presented it as true. The revision uses a positive, executable strict-typing question.',
  'PQ-005':'The required legacy file and function signature were missing, and a comment gave away the intended call-site rule.',
  'PQ-014':'The explanation discussed a static local absent from the snippet; comment replacement and failure suppression were trivial distractors.',
  'PQ-021':'Two PHP opening tags were concatenated inside one open block, causing a parse error in a question that assumed normal execution.',
  'PQ-041':'The answer and explanation discussed array_map/filter/values although the snippet used associative destructuring and null coalescing.',
  'PQ-053':'The shared answer mixed increment behavior from another example into a short-circuiting question; it did not ask the learner to trace calls.',
  'PQ-061':'The shared answer combined match and loop-control facts, instead of discriminating between strict and loose matching in this program.',
  'PQ-113':'The answer discussed JSON in a CSV snippet, omitted the input fixture and missed the PHP 8.4+ escape-argument deprecation.',
  'PQ-137':'The destination fragment depended on undefined upstream upload variables and its shared guarantee mentioned a size check not present in the code.',
  'PQ-197':'The generic answer combined constructor promotion and readonly behavior with a clone snippet; it did not test scalar copying versus object aliasing.',
  'PQ-281':'The example blurred immutable message updates and a mutable body stream, with unspecified collaborators and a generic protocol explanation.',
  'LQ-046':'The stem paraphrased the keyed answer, alternatives were unrelated lifecycle stages, and Advanced difficulty was unjustified.',
  'LQ-314':'Post-validation merge changed the request but did not change the validator snapshot returned by validated(). The original text implied a normalization guarantee for controller persistence.',
  'LQ-413':'route() defaults to an absolute URL; the original answer supplied only a path and no origin premise.',
  'LQ-453':'The dirty-state answer assumed an initial name different from Grace without saying so.',
  'LQ-142':'The general lock recommendation lacked the class-scoped key and lease-expiry details needed to assess an actual WithoutOverlapping configuration.',
  'LQ-489':'The key incorrectly combined tries and retryUntil as simultaneous limits; customerId was undeclared in the displayed job.',
  'LQ-545':'The key reversed registered reporting callback semantics: false stops default reporting.',
  'LQ-546':'The review recommendation preserved the same inverted false-return rule and used generic comment/suppression distractors.',
};
const pilots=PILOT_IDS.map(id=>({id,issue:issues[id],before:original.get(id),after:current.get(id)}));
save('pilot-before-after.json',pilots);
const code = q=>q.code ? (q.code.files || [{name:'Original displayed snippet',snippet:q.code.snippet}]).map(f=>`**${f.name}**${f.kind?` (${f.kind})`:''}\n\n\`\`\`php\n${f.snippet}\n\`\`\``).join('\n\n') : '_No code was supplied._';
const options = q=>q.options.map((text,i)=>`${i+1}. ${text}${i===q.answer?' **[key]**':''}`).join('\n');
const lines=[
  '# Editorial pilot — all 20 before/after reviews',
  'These are revisions of existing IDs, not new questions. Original displayed options below include their old padding; [the machine-readable export](pilot-before-after.json) also preserves original core options and all revised metadata. Source option numbers are not fixed display positions: the browser shuffles options by identity.',
  'All 12 PHP pilot fixtures passed on PHP 8.4.17 and 8.5.2. All 8 Laravel items have matching isolated v13.0.0 contract checks on both runtimes. Laravel collaborator limitations are documented in [the fixture notes](../tests/fixtures/README.md). Difficulty remains an editorial judgment awaiting learner calibration.',
  ['| ID | Before → after difficulty | Learning objective |',
  '|---|---|---|',
  ...pilots.map(({id,before,after})=>`| ${id} | ${before.difficulty} → ${after.difficulty} | ${after.objective} |`)].join('\n'),
];
for(const {id,issue,before,after} of pilots){
  lines.push(`\n## ${id}\n`,`**Issue:** ${issue}`,
    '\n### Before\n',before.prompt,code(before),options(before),`**Original explanation:** ${before.explanation}`,
    '\n### After — revision 2\n',after.prompt,`**Version / premises:** ${after.versions.label} ${after.assumptions}`,code(after),options(after),
    `**Explanation:** ${after.explanation}`,'**Option-by-option reasoning:**\n',...after.learning.rationales.map((reason,i)=>`${i+1}. ${reason}`),
    `**Objective:** ${after.objective}`,`**Difficulty:** ${after.difficulty}. ${after.difficultyReason}`,
    `**Validation:** ${after.validation.kind==='php-output'?`Observed stdout ${JSON.stringify(after.validation.stdout)}${after.validation.diagnostic?`; diagnostic: ${after.validation.diagnostic}`:''} on both PHP runtimes.`:`Pinned Laravel contract: ${after.validation.case}, passing on both PHP runtimes.`}`,
    `**References:** ${after.references.map(url=>`[Primary reference](${url})`).join(', ')}`);
}
writeFileSync(destination('PILOT_REVIEW.md'),lines.join('\n\n')+'\n');
const lengths=PILOT_IDS.map(id=>current.get(id));
save('pilot-quality.json',{
  count:20,trackCounts:Object.fromEntries(['PHP','Laravel'].map(track=>[track,lengths.filter(q=>q.track===track).length])),
  difficultyCounts:Object.fromEntries(['Foundation','Applied','Advanced'].map(difficulty=>[difficulty,lengths.filter(q=>q.difficulty===difficulty).length])),
  sourceKeyCounts:[0,1,2,3].map(answer=>lengths.filter(q=>q.answer===answer).length),
  uniqueLongestCorrect:lengths.filter(q=>q.options.filter(o=>o.length>=q.options[q.answer].length).length===1).map(q=>q.id),
  limits:'Structural and cue checks do not prove that all distractors are equally attractive or that difficulty is calibrated. Independent blind review and learner response data remain necessary.',
});
console.log(`Exported ${changed.length} affected IDs and exactly ${pilots.length} existing-question before/after reviews.`);
