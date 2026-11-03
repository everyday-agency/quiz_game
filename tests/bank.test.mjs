import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { LEGACY_QUESTIONS } from '../js/bank/legacy-v1.mjs';
import { assembleQuestionBank } from '../js/bank/assemble.mjs';
import { QUESTION_REVISIONS } from '../js/bank/revisions.mjs';
import { PILOT_IDS } from '../js/bank/pilot.mjs';
import { QUESTION_BANK, DIFFICULTIES } from '../js/questions.mjs';
import { buildLearningNotes } from '../js/learning-notes.mjs';
import { gradeSession } from '../js/exam.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
const manifest = JSON.parse(readFileSync(new URL('../remediation/baseline/manifest.json', import.meta.url)));
const originalHashes = new Map(manifest.questions.map(q => [q.id, q.sha256]));
const archivedNotesJSON = gunzipSync(readFileSync(new URL('../remediation/baseline/learning-notes-v1.json.gz', import.meta.url))).toString();
assert.equal(hash(archivedNotesJSON), manifest.notesSha256);
const archivedNotes = new Map(JSON.parse(archivedNotesJSON).map(q => [q.id, q.notes]));
for (const original of LEGACY_QUESTIONS) {
  assert.equal(hash(JSON.stringify(original)), originalHashes.get(original.id), `Original record changed: ${original.id}`);
  assert.deepEqual(buildLearningNotes(original), archivedNotes.get(original.id), `Original explanation changed: ${original.id}`);
}
assert.equal(QUESTION_BANK.length, 2500);
assert.deepEqual(new Set(QUESTION_BANK.map(q => q.id)), new Set(originalHashes.keys()));
assert.equal(QUESTION_REVISIONS.length, 133);
assert.equal(PILOT_IDS.length, 20);
assert.equal(new Set(PILOT_IDS).size, 20);

// Add a test-only record in the middle, then reorder everything. Identity and
// complete question content must be invariant; this fixture is never published.
const reordered = [...LEGACY_QUESTIONS].reverse();
reordered.splice(321, 0, { ...LEGACY_QUESTIONS[0], id: 'LQ-999999', prompt: 'Test-only insertion fixture' });
const changedOrder = new Map(assembleQuestionBank(reordered, [...QUESTION_REVISIONS].reverse()).map(q => [q.id, q]));
for (const q of QUESTION_BANK) assert.deepEqual(changedOrder.get(q.id), q, `Insertion/reorder changed ${q.id}`);
assert.equal(changedOrder.size, 2501);
assert.throws(() => assembleQuestionBank([{ ...LEGACY_QUESTIONS[0], id: undefined }]), /explicit stable ID/);
assert.throws(() => assembleQuestionBank([LEGACY_QUESTIONS[0], LEGACY_QUESTIONS[0]]), /Duplicate question/);
assert.throws(() => assembleQuestionBank(LEGACY_QUESTIONS, [{ id: 'LQ-999999', revision: 2 }]), /no original/);

const revisedIds = new Set(QUESTION_REVISIONS.map(q => q.id));
const prompts = new Set();
for (const q of QUESTION_BANK) {
  assert(!prompts.has(q.prompt), `Duplicate prompt: ${q.id}`);
  prompts.add(q.prompt);
  assert(DIFFICULTIES.includes(q.difficulty));
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(new Set(q.optionIds).size, 4);
  assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
  if (!revisedIds.has(q.id)) {
    const { revision, optionIds, ...content } = q;
    assert.equal(revision, 1);
    assert.equal(hash(JSON.stringify(content)), originalHashes.get(q.id), `Unscoped change: ${q.id}`);
  } else {
    assert.equal(q.revision, 2);
    assert.equal(q.learning.rationales.length, 4);
    assert(q.learning.rationales.every(reason => typeof reason === 'string' && reason.length > 20));
    assert(q.versions.label && q.assumptions);
    assert.deepEqual(q.options, q.coreOptions, `Revised item must not be padded: ${q.id}`);
  }
  // Grade every option identity, irrespective of its displayed index.
  const answers = [...q.optionIds].reverse().map(selectedOptionId => ({ question: q, selectedOptionId, correct: null }));
  const result = gradeSession(answers);
  assert.equal(result.answers.filter(a => a.correct).length, 1);
  assert.equal(result.answers.find(a => a.correct).selectedOptionId, q.optionIds[q.answer]);
  const ordered = [2, 0, 3, 1].map(i => ({ id: q.optionIds[i], sourceText: q.coreOptions[i] }));
  const notes = buildLearningNotes(q, ordered);
  for (const alternative of notes.alternatives) {
    assert.equal(alternative.option, ordered[alternative.number - 1].sourceText);
    if (q.learning) assert.equal(alternative.reason, q.learning.rationales[q.coreOptions.indexOf(alternative.option)]);
  }
}
for (const id of PILOT_IDS) {
  const q = QUESTION_BANK.find(q => q.id === id);
  assert(q.objective && q.difficultyReason && q.validation && q.family);
  assert(q.references.length);
  assert.equal(q.status, 'pilot');
  assert(!q.options.some(option => /Keep the relevant mechanism|Exercise the shown path|Suppress every failure|Replace the implementation with a comment|Reasoning check:|Evidence to inspect:/.test(option)), `${id} retains a cue`);
}
const pilot = QUESTION_BANK.filter(q => PILOT_IDS.includes(q.id));
assert.equal(new Set(pilot.map(q => q.answer)).size, 4, 'Pilot source keys must not all occupy one position');
const uniqueLongest = pilot.filter(q => q.options.filter(o => o.length === Math.max(...q.options.map(x => x.length))).length === 1);
assert(uniqueLongest.filter(q => q.options[q.answer].length === Math.max(...q.options.map(x => x.length))).length < uniqueLongest.length / 2, 'Pilot keeps a strong longest-option cue');
console.log('✓ All 2,500 original records and notes preserved; 2,367 current records unchanged');
console.log('✓ Stable IDs survive insertion and reordering; 133 explicit revisions, including 20 pilot items');
console.log('✓ All answer identities and shuffled explanations map correctly; pilot metadata and cue checks pass');
