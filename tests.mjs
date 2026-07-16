import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { QUESTION_BANK, TRACKS, TRACK_TOPICS, TOPICS, DIFFICULTIES, CURRICULUM } from './js/questions.mjs';
import { buildLearningNotes } from './js/learning-notes.mjs';

assert.equal(QUESTION_BANK.length, 1200, 'Question bank must contain exactly 1,200 questions');
assert.deepEqual(TRACKS, ['Laravel', 'TypeScript', 'MySQL', 'Google Analytics'], 'The four learning tracks must be stable');
assert.equal(TOPICS.length, 100, 'Question bank must contain exactly 100 track-specific domains');
assert.equal(CURRICULUM.length, 100, 'Curriculum must contain one entry per track-specific domain');

const prompts = new Set();
const ids = new Set();
const prefixByTrack = { Laravel: 'LQ', TypeScript: 'TQ', MySQL: 'MQ', 'Google Analytics': 'GQ' };
const codeCoverage = Object.fromEntries(TRACKS.map((track) => [track, { correct: 0, alternatives: 0 }]));
const supportedCodeLanguages = new Set(['php', 'typescript', 'json', 'sql']);

function assertCodeLesson(lesson, context) {
  assert(supportedCodeLanguages.has(lesson.language), `${context} uses an unsupported code language`);
  assert(lesson.title.length >= 20, `${context} needs a useful code title`);
  assert(lesson.snippet.length >= 80 && lesson.snippet.includes('\n'), `${context} needs a substantial multiline code example`);
}

for (const track of TRACKS) {
  const trackQuestions = QUESTION_BANK.filter((question) => question.track === track);
  assert.equal(trackQuestions.length, 300, `${track} must contain exactly 300 questions`);
  assert.equal(TRACK_TOPICS[track].length, 25, `${track} must contain exactly 25 domains`);

  trackQuestions.forEach((question, index) => {
    const expectedId = `${prefixByTrack[track]}-${String(index + 1).padStart(3, '0')}`;
    assert.equal(question.id, expectedId, `Unexpected ${track} ID at track index ${index}`);
  });
}

for (const question of QUESTION_BANK) {
  assert(!ids.has(question.id), `Duplicate ID: ${question.id}`);
  ids.add(question.id);

  assert(question.prompt.length >= 45, `${question.id} prompt is too short to be a meaningful scenario`);
  assert(!prompts.has(question.prompt), `${question.id} duplicates another prompt`);
  prompts.add(question.prompt);

  assert(TRACKS.includes(question.track), `${question.id} has an unknown track`);
  assert(TRACK_TOPICS[question.track].includes(question.topic), `${question.id} has an unknown domain`);
  assert(DIFFICULTIES.includes(question.difficulty), `${question.id} has an unknown difficulty`);
  assert.equal(question.options.length, 4, `${question.id} must have four options`);
  assert.equal(new Set(question.options).size, 4, `${question.id} options must be unique`);
  assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${question.id} answer index is invalid`);
  assert(question.explanation.length >= 45, `${question.id} explanation is too short`);

  const notes = buildLearningNotes(question);
  assert.equal(notes.correct, question.options[question.answer], `${question.id} teaching notes identify the wrong correct answer`);
  assert(notes.whyCorrect.length >= 45, `${question.id} needs a complete correct-answer explanation`);
  assert(notes.correctExample.length >= 140, `${question.id} needs a concrete correct-answer example`);
  if (notes.correctCode) {
    codeCoverage[question.track].correct += 1;
    assertCodeLesson(notes.correctCode, `${question.id} correct-answer lesson`);
  }
  assert.equal(notes.alternatives.length, 3, `${question.id} must explain all three wrong choices`);
  assert.deepEqual(
    new Set(notes.alternatives.map((alternative) => alternative.option)),
    new Set(question.options.filter((_, index) => index !== question.answer)),
    `${question.id} teaching notes do not cover the exact wrong choices`,
  );
  notes.alternatives.forEach((alternative) => {
    assert(alternative.reason.length >= 140, `${question.id} has a shallow wrong-answer explanation`);
    assert(alternative.example.length >= 90, `${question.id} has a shallow wrong-answer example`);
    if (alternative.code) {
      codeCoverage[question.track].alternatives += 1;
      assertCodeLesson(alternative.code, `${question.id} wrong-answer lesson`);
    }
  });
}

for (const track of ['Laravel', 'TypeScript', 'MySQL']) {
  assert.equal(codeCoverage[track].correct, 100, `${track} should use code for one-third of correct-answer lessons`);
  assert.equal(codeCoverage[track].alternatives, 5, `${track} should include five curated code-backed wrong-answer explanations`);
  assert(codeCoverage[track].correct < 300, `${track} should not force code into every explanation`);
}
assert.deepEqual(codeCoverage['Google Analytics'], { correct: 0, alternatives: 0 }, 'This teaching-code pass should stay scoped to the three programming/database tracks');

for (const track of TRACKS) {
  for (const topic of TRACK_TOPICS[track]) {
    const topicQuestions = QUESTION_BANK.filter((question) => question.track === track && question.topic === topic);
    assert.equal(topicQuestions.length, 12, `${track} / ${topic} must contain exactly 12 questions`);
    for (const difficulty of DIFFICULTIES) {
      assert(topicQuestions.some((question) => question.difficulty === difficulty), `${track} / ${topic} is missing ${difficulty} coverage`);
    }
  }
}

const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('./js/app.js', import.meta.url), 'utf8');
assert(html.includes('type="module" src="js/app.js"'), 'index.html must load the app module');
assert(html.includes('id="trackControl"'), 'index.html must expose the learning-track selector');
assert(html.includes('id="bankTrack"'), 'question bank must expose the track filter');
assert(app.includes("from './questions.mjs'"), 'app must load the question bank');
assert(app.includes('question.track'), 'app must render and filter questions by track');
assert(app.includes('createCodeLesson'), 'app must render optional code walkthroughs');

console.log(`✓ ${QUESTION_BANK.length} questions across ${TRACKS.length} learning tracks`);
console.log(`✓ ${TOPICS.length} domains × 12 scenarios`);
console.log(`✓ 300 questions each for Laravel, TypeScript, MySQL, and Google Analytics`);
console.log(`✓ four unique options and one valid answer per question`);
console.log(`✓ unique IDs and prompts`);
console.log(`✓ all three difficulty levels represented in every domain`);
console.log(`✓ correct examples and explanations for all 3,600 wrong choices`);
console.log(`✓ 300 selective correct-answer code walkthroughs and ${Object.values(codeCoverage).reduce((total, coverage) => total + coverage.alternatives, 0)} code-backed wrong-answer explanations`);
