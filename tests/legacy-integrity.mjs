import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
// Historical checks apply only to the immutable v1 archive, not current editorial policy.
import { LEGACY_QUESTIONS as QUESTION_BANK } from '../js/bank/legacy-v1.mjs';
import { TRACKS, TRACK_TOPICS, TOPICS, DIFFICULTIES, CURRICULUM } from '../release/archive/pre-php-only/js/questions.mjs';
import { buildLearningNotes } from '../release/archive/pre-php-only/js/learning-notes.mjs';

assert.equal(QUESTION_BANK.length, 2500, 'Question bank must contain exactly 2,500 questions');
assert.deepEqual(TRACKS, ['Laravel', 'PHP', 'TypeScript', 'React', 'MySQL', 'Google Analytics'], 'The six learning tracks must be stable');
assert.equal(TOPICS.length, 150, 'Question bank must contain exactly 150 track-specific domains');
assert.equal(CURRICULUM.length, 150, 'Curriculum must contain one entry per track-specific domain');

const prompts = new Set();
const ids = new Set();
const prefixByTrack = { Laravel: 'LQ', PHP: 'PQ', TypeScript: 'TQ', React: 'RQ', MySQL: 'MQ', 'Google Analytics': 'GQ' };
const codeCoverage = Object.fromEntries(TRACKS.map((track) => [track, { correct: 0, alternatives: 0 }]));
const questionCodeCoverage = Object.fromEntries(TRACKS.map((track) => [track, 0]));
const answerLengthStats = Object.fromEntries(TRACKS.map((track) => [track, {
  characters: { ranks: [0, 0, 0, 0], correct: 0, wrong: 0 },
  words: { ranks: [0, 0, 0, 0], correct: 0, wrong: 0 },
}]));
const supportedCodeLanguages = new Set(['php', 'typescript', 'tsx', 'json', 'sql']);

const wordCount = (value) => value.trim().split(/\s+/).length;

function assertCodeLesson(lesson, context) {
  assert(supportedCodeLanguages.has(lesson.language), `${context} uses an unsupported code language`);
  assert(lesson.title.length >= 20, `${context} needs a useful code title`);
  assert(lesson.snippet.length >= 80 && lesson.snippet.includes('\n'), `${context} needs a substantial multiline code example`);
}

for (const track of TRACKS) {
  const trackQuestions = QUESTION_BANK.filter((question) => question.track === track);
  const expectedTrackCount = {
    Laravel: 600,
    PHP: 300,
    TypeScript: 600,
    React: 300,
    MySQL: 400,
    'Google Analytics': 300,
  }[track];
  assert.equal(trackQuestions.length, expectedTrackCount, `${track} has the wrong question count`);
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
  assert.equal(question.coreOptions.length, 4, `${question.id} must preserve four semantic answer cores`);
  assert.equal(new Set(question.coreOptions).size, 4, `${question.id} semantic answer cores must be unique`);
  assert.equal(question.options.length, 4, `${question.id} must have four options`);
  assert.equal(new Set(question.options).size, 4, `${question.id} options must be unique`);
  assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${question.id} answer index is invalid`);
  question.options.forEach((option, index) => {
    assert(option.startsWith(question.coreOptions[index]), `${question.id} changed the meaning of option ${index + 1}`);
    assert(/(?:Reasoning check|Evidence to inspect):/.test(option), `${question.id} option ${index + 1} lacks its neutral reasoning check`);
  });

  for (const [metric, measure] of [['characters', (value) => value.length], ['words', wordCount]]) {
    const lengths = question.options.map(measure);
    assert.equal(new Set(lengths).size, 4, `${question.id} ${metric} must produce four distinct length ranks`);
    const correctLength = lengths[question.answer];
    const correctRank = lengths.filter((length, index) => index !== question.answer && length < correctLength).length;
    const stats = answerLengthStats[question.track][metric];
    stats.ranks[correctRank] += 1;
    stats.correct += correctLength;
    stats.wrong += lengths.reduce((total, length, index) =>
      total + (index === question.answer ? 0 : length), 0) / 3;
  }

  assert(question.explanation.length >= 45, `${question.id} explanation is too short`);
  if (question.code) {
    questionCodeCoverage[question.track] += 1;
    assertCodeLesson(question.code, `${question.id} question code`);
    if (['Laravel', 'TypeScript', 'MySQL'].includes(question.track)) {
      assert(Number(question.id.slice(3)) > 300, `${question.id} unexpectedly adds code to an existing question`);
    }
  }

  const notes = buildLearningNotes(question);
  assert.equal(notes.correct, question.coreOptions[question.answer], `${question.id} teaching notes identify the wrong correct answer`);
  assert(notes.whyCorrect.length >= 45, `${question.id} needs a complete correct-answer explanation`);
  assert(notes.correctExample.length >= 140, `${question.id} needs a concrete correct-answer example`);
  if (notes.correctCode) {
    codeCoverage[question.track].correct += 1;
    assertCodeLesson(notes.correctCode, `${question.id} correct-answer lesson`);
  }
  assert.equal(notes.alternatives.length, 3, `${question.id} must explain all three wrong choices`);
  assert.deepEqual(
    new Set(notes.alternatives.map((alternative) => alternative.option)),
    new Set(question.coreOptions.filter((_, index) => index !== question.answer)),
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

for (const track of TRACKS) {
  const trackQuestionCount = QUESTION_BANK.filter((question) => question.track === track).length;
  for (const [metric, stats] of Object.entries(answerLengthStats[track])) {
    assert.deepEqual(
      stats.ranks,
      Array(4).fill(trackQuestionCount / 4),
      `${track} correct answers must occupy every ${metric} rank equally often`,
    );
    const averageRatio = stats.correct / stats.wrong;
    assert(
      averageRatio >= 0.95 && averageRatio <= 1.05,
      `${track} correct-answer ${metric} average must stay within 5% of wrong-answer average`,
    );
  }
}

for (const track of ['Laravel', 'TypeScript', 'MySQL']) {
  assert.equal(codeCoverage[track].correct, 100, `${track} should use code for one-third of correct-answer lessons`);
  assert.equal(codeCoverage[track].alternatives, 5, `${track} should include five curated code-backed wrong-answer explanations`);
  assert(codeCoverage[track].correct < 300, `${track} should not force code into every explanation`);
}
assert.deepEqual(codeCoverage['Google Analytics'], { correct: 0, alternatives: 0 }, 'This teaching-code pass should stay scoped to the three programming/database tracks');
assert.deepEqual(codeCoverage.PHP, { correct: 0, alternatives: 0 }, 'PHP questions already carry their teaching code in the prompt');
assert.deepEqual(codeCoverage.React, { correct: 0, alternatives: 0 }, 'React questions already carry their teaching code in the prompt');
assert.deepEqual(questionCodeCoverage, {
  Laravel: 300,
  PHP: 300,
  TypeScript: 300,
  React: 300,
  MySQL: 100,
  'Google Analytics': 0,
}, 'The programming tracks must contain their intended code-reading question totals');

const roadmapCoverage = Object.fromEntries(TRACKS.map((track) => [track,
  QUESTION_BANK.filter((question) => question.track === track && question.roadmap === true).length,
]));
assert.deepEqual(roadmapCoverage, {
  Laravel: 200,
  PHP: 200,
  TypeScript: 200,
  React: 200,
  MySQL: 0,
  'Google Analytics': 0,
}, 'Roadmap expansions must contribute exactly 200 direct roadmap questions to each requested track');

for (const question of QUESTION_BANK.filter((candidate) => candidate.roadmap !== undefined)) {
  assert(Array.isArray(question.roadmapConcepts) && question.roadmapConcepts.length >= 3, `${question.id} needs explicit roadmap concept coverage`);
}

const requiredRoadmapConcepts = {
  Laravel: ['Laravel Herd', 'Breeze', 'Jetstream', 'Inertia', 'Livewire', 'route model binding', 'Form Requests', 'Sanctum', 'Passport', 'Eloquent queries', 'Blade escaping', 'queues', 'Pest', 'PHPUnit', 'Octane', 'Pulse', 'Forge', 'Laravel Cloud'],
  PHP: ['strict types', 'associative arrays', 'match', 'first-class callables', 'superglobals', 'file uploads', 'CSRF', 'PDO', 'prepared statements', 'transactions', 'interfaces', 'traits', 'Composer', 'attributes', 'generators', 'PHPStan', 'PSR-7', 'PHP-FPM'],
  TypeScript: ['type inference', 'type predicates', 'type aliases vs interfaces', 'hybrid types', 'generic constraints', 'non-null assertion', 'decorators', 'module resolution', 'Awaited', 'variadic tuples', 'satisfies keyword', 'mapped types', 'conditional types', 'runtime validation', 'React props', 'tsconfig.json', 'module augmentation', 'type tests'],
  React: ['Vite', 'functional components', 'JSX', 'render props', 'higher-order components', 'lists and keys', 'useState', 'useEffect', 'useRef', 'useReducer', 'useMemo', 'useCallback', 'custom hooks', 'MobX', 'Zustand', 'React Router', 'TanStack Router', 'React Aria', 'TanStack Query', 'Apollo Client', 'React Testing Library', 'Next.js', 'Zod', 'React Hook Form', 'error boundaries', 'Suspense', 'React Native'],
};

for (const [track, required] of Object.entries(requiredRoadmapConcepts)) {
  const covered = new Set(QUESTION_BANK
    .filter((question) => question.track === track && question.roadmap === true)
    .flatMap((question) => question.roadmapConcepts));
  required.forEach((concept) => assert(covered.has(concept), `${track} roadmap is missing ${concept}`));
}

for (const track of TRACKS) {
  for (const topic of TRACK_TOPICS[track]) {
    const topicQuestions = QUESTION_BANK.filter((question) => question.track === track && question.topic === topic);
    const expectedTopicCount = {
      Laravel: 24,
      PHP: 12,
      TypeScript: 24,
      React: 12,
      MySQL: 16,
      'Google Analytics': 12,
    }[track];
    assert.equal(topicQuestions.length, expectedTopicCount, `${track} / ${topic} has the wrong question count`);
    for (const difficulty of DIFFICULTIES) {
      assert(topicQuestions.some((question) => question.difficulty === difficulty), `${track} / ${topic} is missing ${difficulty} coverage`);
    }
  }
}

const html = await readFile(new URL('../release/archive/pre-php-only/index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('../release/archive/pre-php-only/js/app.js', import.meta.url), 'utf8');
assert(html.includes('type="module" src="js/app.js"'), 'index.html must load the app module');
assert(html.includes('id="trackControl"'), 'index.html must expose the learning-track selector');
assert(html.includes('id="bankTrack"'), 'question bank must expose the track filter');
assert(app.includes("from './questions.mjs'"), 'app must load the question bank');
assert(app.includes('question.track'), 'app must render and filter questions by track');
assert(app.includes('createCodeLesson'), 'app must render optional code walkthroughs');
assert(html.includes('id="questionCode"'), 'quiz view must expose the question-code container');
assert(app.includes("createCodeLesson(question.code, 'Read this code')"), 'app must render code inside code-reading questions');

console.log(`✓ v1 archive: ${QUESTION_BANK.length} questions across ${TRACKS.length} learning tracks`);
console.log(`✓ v1 archive: 25 domains per track across six tracks and 150 track-specific domains`);
console.log(`✓ v1 archive: 600 Laravel, 600 TypeScript, 400 MySQL, and 300 each for PHP, React, and Google Analytics`);
console.log(`✓ v1 archive: exactly 200 direct roadmap questions for Laravel, TypeScript, PHP, and React`);
console.log(`✓ v1 archive: 1,300 code-reading questions across the five programming/database tracks`);
console.log(`✓ v1 archive: four unique options and one valid answer per question`);
console.log(`✓ v1 archive: correct answers occupy each character-length and word-count rank exactly 25% of the time`);
console.log(`✓ v1 archive: correct and wrong answer lengths stay within a 5% average band in every track`);
console.log(`✓ v1 archive: unique IDs and prompts`);
console.log(`✓ v1 archive: all three difficulty levels represented in every domain`);
console.log(`✓ v1 archive: correct examples and explanations for all 7,500 wrong choices`);
console.log(`✓ v1 archive: 300 selective correct-answer code walkthroughs and ${Object.values(codeCoverage).reduce((total, coverage) => total + coverage.alternatives, 0)} code-backed wrong-answer explanations`);
