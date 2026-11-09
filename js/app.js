import { QUESTION_BANK, TRACKS, TRACK_TOPICS, DIFFICULTIES, SUBJECTS } from './questions.mjs';
import { HISTORICAL_KEYS, readProgress } from './progress.mjs';
import { buildLearningNotes } from './learning-notes.mjs';
import { gradeAnswer, gradeSession } from './exam.mjs';
import { createCodeLesson as renderCodeLesson, createCodeChoice } from './code-viewer.mjs';

// Old PHP bookmarks retain the PHP default; subject selection is explicit in the URL.
const pageUrl = new URL(location.href);
if (['php-pilot-v1', 'php-engineer-review-v1'].includes(pageUrl.searchParams.get('collection'))) {
  pageUrl.searchParams.delete('collection');
  history.replaceState(null, '', pageUrl);
}
let activeSubject = SUBJECTS.find(subject => subject.track.toLowerCase() === pageUrl.searchParams.get('subject')) || SUBJECTS[0];
document.documentElement.dataset.collection = activeSubject.collectionId;
const activeQuestions = () => QUESTION_BANK.filter(question => question.track === activeSubject.track);

const createCodeLesson = (lesson, label) => renderCodeLesson(lesson, label, { reading: true });
function appendAnswerText(container, text) {
  container.append(text.includes('\n') ? createCodeChoice(text) : document.createTextNode(text));
}

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const domainKey = (track, topic) => `${track}::${topic}`;
const trackSlug = (track) => track.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const topicControl = $('#topicControl');
const availableCount = $('#availableCount');
const lifetimeCount = $('#lifetimeCount');
const toast = $('#toast');

const savedStats = readStats();

const state = {
  view: 'home',
  size: 20,
  mode: 'learn',
  domains: new Set(activeQuestions().map((question) => domainKey(question.track, question.topic))),
  difficulties: new Set(['Foundation', 'Intermediate']),
  session: [],
  current: 0,
  selectedOption: null,
  locked: false,
  answers: [],
  streak: 0,
  bestStreak: 0,
  completed: false,
  stats: savedStats,
};

function readStats() {
  try { return readProgress(localStorage, activeSubject.statsKey); }
  catch { return readProgress(null, activeSubject.statsKey); }
}

function saveStats() {
  try {
    localStorage.setItem(activeSubject.statsKey, JSON.stringify(state.stats));
  } catch {
    // The quiz remains fully usable when browser storage is unavailable.
  }
  updateLifetime();
}

function updateLifetime() {
  lifetimeCount.textContent = `${state.stats.answered.toLocaleString()} ${activeSubject.track} answers`;
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const random = Math.floor(Math.random() * (index + 1));
    [result[index], result[random]] = [result[random], result[index]];
  }
  return result;
}

function materialize(question) {
  return {
    ...question,
    displayOptions: shuffle(question.options.map((text, index) => ({
      text,
      sourceText: question.coreOptions?.[index] || text,
      id: question.optionIds[index],
    }))),
  };
}

function createLearningNotes(question, orderedOptions = question.options) {
  const notes = buildLearningNotes(question, orderedOptions);
  const wrapper = document.createElement('div');
  wrapper.className = 'learning-notes';

  const correctExample = document.createElement('section');
  correctExample.className = 'learning-example';
  const exampleLabel = document.createElement('span');
  exampleLabel.className = 'learning-label';
  exampleLabel.textContent = 'Concrete example';
  const exampleText = document.createElement('p');
  exampleText.textContent = notes.correctExample;
  correctExample.append(exampleLabel, exampleText);
  if (notes.correctCode) {
    correctExample.append(createCodeLesson(notes.correctCode, 'See the concept in code'));
  }

  const alternativesHeading = document.createElement('h4');
  alternativesHeading.textContent = 'Why the other choices are weaker';
  const alternatives = document.createElement('div');
  alternatives.className = 'choice-analysis-list';

  notes.alternatives.forEach((alternative) => {
    const item = document.createElement('article');
    item.className = 'choice-analysis';
    const number = document.createElement('span');
    number.className = 'choice-analysis-number';
    number.textContent = String(alternative.number);
    const copy = document.createElement('div');
    const option = document.createElement('strong');
    appendAnswerText(option, alternative.option);
    const reason = document.createElement('p');
    reason.textContent = alternative.reason;
    const example = document.createElement('p');
    example.className = 'choice-example';
    const prefix = document.createElement('b');
    prefix.textContent = 'Example: ';
    example.append(prefix, alternative.example);
    copy.append(option, reason);
    if (alternative.example) copy.append(example);
    if (alternative.code) {
      copy.append(createCodeLesson(alternative.code, 'Why this can fail in code'));
    }
    item.append(number, copy);
    alternatives.append(item);
  });

  wrapper.append(correctExample, alternativesHeading, alternatives);
  return wrapper;
}

function visibleDomains() {
  return [activeSubject.track].flatMap((track) =>
    TRACK_TOPICS[track].map((topic) => ({ track, topic, key: domainKey(track, topic) }))
  );
}

function setupTopics() {
  topicControl.replaceChildren();
  [activeSubject.track].forEach((track) => {
    const heading = document.createElement('div');
    heading.className = 'topic-section-label';
    heading.dataset.track = trackSlug(track);
    heading.textContent = `${track} · ${TRACK_TOPICS[track].length} domains`;
    topicControl.append(heading);

    TRACK_TOPICS[track].forEach((topic) => {
      const key = domainKey(track, topic);
      const label = document.createElement('label');
      label.className = 'topic-check';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = key;
      input.checked = state.domains.has(key);
      const span = document.createElement('span');
      span.textContent = topic;
      input.addEventListener('change', () => {
        input.checked ? state.domains.add(key) : state.domains.delete(key);
        updateAvailable();
        updateTopicToggle();
      });
      label.append(input, span);
      topicControl.append(label);
    });
  });

  updateTopicToggle();
}

function setupBankTopics() {
  const select = $('#bankTopic');
  const previous = select.value;
  select.replaceChildren();

  const all = document.createElement('option');
  all.value = 'all';
  all.textContent = 'All domains';
  select.append(all);

  [activeSubject.track].forEach((track) => {
    const parent = select;
    TRACK_TOPICS[track].forEach((topic) => {
      const option = document.createElement('option');
      option.value = domainKey(track, topic);
      option.textContent = topic;
      parent.append(option);
    });
  });

  select.value = [...select.options].some((option) => option.value === previous) ? previous : 'all';
}

function matchesSetup(question) {
  return question.track === activeSubject.track
    && state.domains.has(domainKey(question.track, question.topic))
    && state.difficulties.has(question.difficulty);
}

function updateAvailable() {
  const count = QUESTION_BANK.filter(matchesSetup).length;
  availableCount.textContent = `${count.toLocaleString()} available`;
  $('#startButton').disabled = count === 0;
}

function updateTopicToggle() {
  const visible = visibleDomains();
  const selected = visible.filter((domain) => state.domains.has(domain.key)).length;
  $('#toggleTopics').textContent = visible.length > 0 && selected === visible.length ? 'Deselect all' : 'Select all';
  $('#toggleTopics').disabled = visible.length === 0;
}

function showView(name) {
  state.view = name;
  $$('.view').forEach((view) => view.classList.toggle('active', view.id === `${name}View`));
  $$('.nav-button').forEach((button) => button.classList.toggle('active', button.dataset.view === name));
  if (name === 'bank') renderBank();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startSession(sourceQuestions = null) {
  const pool = sourceQuestions || QUESTION_BANK.filter(matchesSetup);

  if (!pool.length) {
    showToast('Choose at least one domain and difficulty.');
    return;
  }

  const requested = state.size === 'all' ? pool.length : Math.min(Number(state.size), pool.length);
  state.session = shuffle(pool).slice(0, requested).map(materialize);
  state.current = 0;
  state.selectedOption = null;
  state.locked = false;
  state.answers = [];
  state.streak = 0;
  state.bestStreak = 0;
  state.completed = false;
  showView('quiz');
  renderQuestion();
}

function renderQuestion() {
  const question = state.session[state.current];
  state.selectedOption = null;
  state.locked = false;

  const track = $('#questionTrack');
  track.textContent = question.track;
  track.dataset.track = trackSlug(question.track);
  $('#questionTopic').textContent = question.topic;
  $('#questionDifficulty').textContent = question.difficulty;
  $('#questionNumber').textContent = `Question ${state.current + 1} of ${state.session.length}`;
  $('#questionPrompt').textContent = question.prompt;
  const context = $('#questionContext');
  context.textContent = [question.versions?.label, question.assumptions].filter(Boolean).join(' ');
  $('#questionMeta').textContent = `${question.id} · ${question.format} · Prerequisites: ${question.prerequisites.join(', ')}.`;
  $('#questionPrompt').dataset.questionId = question.id;
  context.hidden = !context.textContent;
  const questionCode = $('#questionCode');
  questionCode.replaceChildren();
  questionCode.hidden = !question.code;
  if (question.code) questionCode.append(createCodeLesson(question.code, 'Read this code'));
  $('#progressBar').style.width = `${((state.current + 1) / state.session.length) * 100}%`;
  $('#feedbackPanel').hidden = true;
  $('#feedbackPanel').className = 'feedback-panel';
  $('#feedbackText').textContent = '';
  $('#feedbackTitle').textContent = '';
  $('#feedbackIcon').textContent = '';
  $('#learningNotes').replaceChildren();
  $('#answerHint').textContent = state.mode === 'learn'
    ? 'Choose the strongest answer.'
    : 'Answers are kept for this session. Results appear after submission.';

  const action = $('#questionAction');
  action.disabled = true;
  action.textContent = state.mode === 'learn'
    ? 'Check answer'
    : state.current === state.session.length - 1 ? 'Submit exam' : 'Next question';

  const list = $('#optionList');
  list.replaceChildren();
  question.displayOptions.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-button';
    button.dataset.index = String(index);
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', 'false');

    const key = document.createElement('span');
    key.className = 'option-key';
    key.textContent = String(index + 1);
    const text = document.createElement('span');
    text.className = 'option-text';
    appendAnswerText(text, option.text);
    button.append(key, text);
    button.addEventListener('click', () => selectOption(index));
    list.append(button);
  });

  updateMetrics();
  requestAnimationFrame(() => list.querySelector('button')?.focus());
}

function selectOption(index) {
  if (state.locked) return;
  state.selectedOption = index;
  $$('.option-button').forEach((button, optionIndex) => {
    const selected = optionIndex === index;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-checked', String(selected));
  });
  $('#questionAction').disabled = false;
}

function recordAnswer() {
  if (state.completed || state.selectedOption === null || state.answers.length !== state.current) return null;
  const question = state.session[state.current];
  const option = question.displayOptions[state.selectedOption];
  let answer = {
    question,
    questionId: question.id,
    revision: question.revision,
    selectedOptionId: option.id,
    selectedText: option.sourceText || option.text,
    correctText: null,
    selectedIndex: state.selectedOption,
    correct: null,
  };
  if (state.mode === 'learn') answer = gradeAnswer(answer);
  state.answers.push(answer);

  if (state.mode === 'learn' && answer.correct) {
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
  } else {
    state.streak = 0;
  }
  updateMetrics();
  return answer;
}

function revealAnswer(answer) {
  state.locked = true;
  const question = state.session[state.current];
  $$('.option-button').forEach((button, index) => {
    button.disabled = true;
    button.classList.remove('selected');
    if (question.displayOptions[index].id === question.optionIds[question.answer]) button.classList.add('correct');
    if (index === answer.selectedIndex && !answer.correct) button.classList.add('wrong');
  });

  const panel = $('#feedbackPanel');
  panel.hidden = false;
  panel.classList.add(answer.correct ? 'correct' : 'wrong');
  $('#feedbackIcon').textContent = answer.correct ? '✓' : '↯';
  $('#feedbackTitle').textContent = answer.correct ? 'Sound reasoning' : 'Revisit the boundary';
  const learning = buildLearningNotes(question, question.displayOptions);
  $('#feedbackText').textContent = learning.whyCorrect;
  $('#learningNotes').replaceChildren(createLearningNotes(question, question.displayOptions));
  $('#answerHint').textContent = answer.correct
    ? `Current streak: ${state.streak}`
    : `Correct answer: ${answer.correctText}`;
  $('#questionAction').textContent = state.current === state.session.length - 1 ? 'See results' : 'Next question';
}

function advanceQuestion() {
  if (state.current >= state.session.length - 1) {
    finishSession();
    return;
  }
  state.current += 1;
  renderQuestion();
}

function updateMetrics() {
  if (state.mode === 'exam') {
    $('#scoreMetric').textContent = `${state.answers.length} of ${state.session.length} answered`;
    $('#streakMetric').textContent = '';
    $('#streakMetric').hidden = true;
    return;
  }
  $('#streakMetric').hidden = false;
  const correct = state.answers.filter((answer) => answer.correct).length;
  $('#scoreMetric').textContent = `${correct} correct`;
  $('#streakMetric').textContent = `${state.streak} streak`;
}

function finishSession() {
  if (state.completed || state.answers.length !== state.session.length) return;
  state.completed = true;
  Object.assign(state, gradeSession(state.answers));
  const correct = state.answers.filter((answer) => answer.correct).length;
  const percent = Math.round((correct / state.answers.length) * 100);
  state.stats.answered += state.answers.length;
  state.stats.correct += correct;
  state.stats.sessions += 1;
  state.stats.best = Math.max(state.stats.best, percent);
  saveStats();
  renderResults(correct, percent);
  showView('results');
}

function renderResults(correct, percent) {
  $('#scorePercent').textContent = `${percent}%`;
  $('#scoreRing').style.setProperty('--score', String(percent));
  $('#resultCount').textContent = `${correct} / ${state.answers.length} correct`;

  let message;
  if (percent >= 90) message = 'Excellent systems thinking. You are tracing behavior through the boundaries that actually matter.';
  else if (percent >= 75) message = 'A strong mental model. Review the misses—they are likely edge conditions rather than missing foundations.';
  else if (percent >= 55) message = 'The structure is taking shape. The missed scenarios show exactly which boundaries deserve another pass.';
  else message = 'This is useful signal, not failure. Read the explanations and retry the missed set while the reasoning is fresh.';
  $('#resultMessage').textContent = `${message} Best streak: ${state.bestStreak}.`;

  const domainMap = new Map();
  state.answers.forEach((answer) => {
    const key = domainKey(answer.question.track, answer.question.topic);
    const entry = domainMap.get(key) || {
      track: answer.question.track,
      topic: answer.question.topic,
      correct: 0,
      total: 0,
    };
    entry.total += 1;
    if (answer.correct) entry.correct += 1;
    domainMap.set(key, entry);
  });

  const breakdown = $('#topicBreakdown');
  breakdown.replaceChildren();
  [...domainMap.values()]
    .sort((a, b) => `${a.track} ${a.topic}`.localeCompare(`${b.track} ${b.topic}`))
    .forEach((score) => {
      const row = document.createElement('div');
      row.className = 'breakdown-item';
      const name = document.createElement('span');
      name.textContent = `${score.track} · ${score.topic}`;
      const bar = document.createElement('div');
      bar.className = 'breakdown-bar';
      const fill = document.createElement('span');
      fill.style.width = `${(score.correct / score.total) * 100}%`;
      bar.append(fill);
      const value = document.createElement('span');
      value.className = 'breakdown-score';
      value.textContent = `${score.correct}/${score.total}`;
      row.append(name, bar, value);
      breakdown.append(row);
    });

  const missed = state.answers.filter((answer) => !answer.correct);
  $('#missedCount').textContent = `${missed.length} missed`;
  $('#retryMissed').hidden = missed.length === 0;
  const missedList = $('#missedList');
  missedList.replaceChildren();
  if (!missed.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Nothing to revisit. Clean run.';
    missedList.append(empty);
    return;
  }

  missed.slice(0, 8).forEach((answer) => {
    const details = document.createElement('details');
    details.className = 'missed-item';
    const summary = document.createElement('summary');
    const topic = document.createElement('span');
    topic.textContent = `${answer.question.track} · ${answer.question.topic}`;
    const prompt = document.createElement('p');
    prompt.textContent = answer.question.prompt;
    summary.append(topic, prompt);
    const explanation = document.createElement('p');
    explanation.className = 'review-answer';
    explanation.append('Correct: ');
    appendAnswerText(explanation, answer.correctText);
    explanation.append(`. ${answer.question.explanation}`);
    details.append(summary);
    if (answer.question.code) details.append(createCodeLesson(answer.question.code, 'Question code'));
    const selected = document.createElement('p');
    selected.append('Your answer: ');
    appendAnswerText(selected, answer.selectedText);
    details.append(selected, explanation, createLearningNotes(answer.question, answer.question.displayOptions));
    missedList.append(details);
  });
  if (missed.length > 8) {
    const more = document.createElement('p');
    more.className = 'empty-state';
    more.textContent = `Plus ${missed.length - 8} more—use “Review missed” for the complete set.`;
    missedList.append(more);
  }
}

let bankRenderLimit = 100;

function renderBank() {
  const term = $('#bankSearch').value.trim().toLowerCase();
  const domain = $('#bankTopic').value;
  const difficulty = $('#bankDifficulty').value;
  const matches = activeQuestions().filter((question) => {
    const searchable = `${question.id} ${question.track} ${question.topic} ${question.prompt} ${question.objective} ${question.code?.title || ''} ${question.code?.snippet || ''} ${(question.code?.files || []).map(file => file.snippet).join(' ')} ${question.explanation} ${question.options.join(' ')} ${(question.coreOptions || []).join(' ')}`.toLowerCase();
    return (!term || searchable.includes(term))
      && (domain === 'all' || domainKey(question.track, question.topic) === domain)
      && (difficulty === 'all' || question.difficulty === difficulty);
  });

  const visibleMatches = matches.slice(0, bankRenderLimit);
  const showing = visibleMatches.length < matches.length ? ` · showing ${visibleMatches.length.toLocaleString()}` : '';
  $('#bankCount').textContent = `${matches.length.toLocaleString()} of ${activeQuestions().length.toLocaleString()} scenarios${showing}`;
  const list = $('#bankList');
  list.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No scenarios match those filters.';
    list.append(empty);
    return;
  }

  visibleMatches.forEach((question) => {
    const details = document.createElement('details');
    details.className = 'bank-question';
    const summary = document.createElement('summary');
    const id = document.createElement('span');
    id.className = 'bank-id';
    id.textContent = question.id;
    const prompt = document.createElement('span');
    prompt.className = 'bank-prompt';
    prompt.textContent = question.prompt;
    const tags = document.createElement('span');
    tags.className = 'bank-tags';
    [question.track, question.topic, question.difficulty].forEach((value, index) => {
      const tag = document.createElement('span');
      tag.textContent = value;
      if (index === 0) {
        tag.className = 'bank-track-tag';
        tag.dataset.track = trackSlug(question.track);
      }
      tags.append(tag);
    });
    summary.append(id, prompt, tags);

    const answer = document.createElement('div');
    answer.className = 'bank-answer';
    details.addEventListener('toggle', () => {
      if (!details.open || answer.dataset.enriched === 'true') return;
      const correct = document.createElement('strong');
      correct.append('Strongest answer: ');
      appendAnswerText(correct, (question.coreOptions || question.options)[question.answer]);
      const explanation = document.createElement('p');
      explanation.textContent = question.explanation;
      if (question.code) answer.append(createCodeLesson(question.code, 'Read this code'));
      if (question.versions || question.assumptions) {
        const context = document.createElement('p');
        context.textContent = [question.versions?.label, question.assumptions].filter(Boolean).join(' ');
        answer.append(context);
      }
      answer.append(correct, explanation);
      const metadata = document.createElement('p');
      metadata.className = 'question-detail';
      metadata.textContent = `${question.format} · ${question.objective} Prerequisites: ${question.prerequisites.join(', ')}. ${question.difficultyReason}`;
      answer.append(metadata);
      answer.append(createLearningNotes(question));
      answer.dataset.enriched = 'true';
    });
    details.append(summary, answer);
    list.append(details);
  });

  if (visibleMatches.length < matches.length) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'secondary-button bank-more';
    more.textContent = `Show ${Math.min(100, matches.length - visibleMatches.length).toLocaleString()} more`;
    more.addEventListener('click', () => {
      bankRenderLimit += 100;
      renderBank();
    });
    list.append(more);
  }
}

function resetBankAndRender() {
  bankRenderLimit = 100;
  renderBank();
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

$('#sizeControl').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-size]');
  if (!button) return;
  state.size = button.dataset.size === 'all' ? 'all' : Number(button.dataset.size);
  $$('#sizeControl button').forEach((item) => item.classList.toggle('selected', item === button));
});

$('#modeControl').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-mode]');
  if (!button) return;
  state.mode = button.dataset.mode;
  $$('#modeControl button').forEach((item) => item.classList.toggle('selected', item === button));
});

$('#difficultyControl').addEventListener('change', (event) => {
  const input = event.target;
  if (!input.matches('input[type="checkbox"]')) return;
  input.checked ? state.difficulties.add(input.value) : state.difficulties.delete(input.value);
  updateAvailable();
});

$('#toggleTopics').addEventListener('click', () => {
  const visible = visibleDomains();
  const selectAll = visible.some((domain) => !state.domains.has(domain.key));
  visible.forEach((domain) => selectAll ? state.domains.add(domain.key) : state.domains.delete(domain.key));
  $$('#topicControl input').forEach((input) => { input.checked = selectAll; });
  updateAvailable();
  updateTopicToggle();
});

$('#startButton').addEventListener('click', () => startSession());
$('#questionAction').addEventListener('click', () => {
  if (state.selectedOption === null && !state.locked) return;
  if (state.locked) {
    advanceQuestion();
    return;
  }
  const answer = recordAnswer();
  if (!answer) return;
  if (state.mode === 'learn') revealAnswer(answer);
  else advanceQuestion();
});

$('#exitQuiz').addEventListener('click', () => {
  if (state.answers.length && !window.confirm('Exit this session? Current answers will not be saved.')) return;
  showView('home');
});

$('#newSession').addEventListener('click', () => showView('home'));
$('#retryMissed').addEventListener('click', () => {
  const missed = state.answers.filter((answer) => !answer.correct).map((answer) => {
    const { displayOptions, ...source } = answer.question;
    return source;
  });
  if (!missed.length) return;
  state.size = 'all';
  state.mode = 'learn';
  $$('#sizeControl button').forEach((button) => button.classList.toggle('selected', button.dataset.size === 'all'));
  $$('#modeControl button').forEach((button) => button.classList.toggle('selected', button.dataset.mode === 'learn'));
  startSession(missed);
});

$$('.nav-button').forEach((button) => button.addEventListener('click', () => {
  if (state.view === 'quiz' && state.answers.length && !window.confirm('Leave this session? Current answers will not be saved.')) return;
  showView(button.dataset.view);
}));

$('#brandButton').addEventListener('click', () => {
  if (state.view === 'quiz' && state.answers.length && !window.confirm('Leave this session? Current answers will not be saved.')) return;
  showView('home');
});

$('#bankSearch').addEventListener('input', resetBankAndRender);
$('#bankDifficulty').addEventListener('change', resetBankAndRender);
$('#bankTopic').addEventListener('change', resetBankAndRender);
document.addEventListener('keydown', (event) => {
  if (state.view !== 'quiz' || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
  if (/^[1-4]$/.test(event.key) && !state.locked) {
    const button = $(`.option-button[data-index="${Number(event.key) - 1}"]`);
    button?.click();
  }
  if (event.key === 'Enter' && !$('#questionAction').disabled) {
    event.preventDefault();
    $('#questionAction').click();
  }
});

try {
  $('#historicalProgress').hidden = !HISTORICAL_KEYS.some(key => localStorage.getItem(key) !== null);
} catch { /* Storage is optional. */ }

const subjectControl = $('#subjectControl');
for (const subject of SUBJECTS) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'track-choice';
  button.dataset.subject = subject.track;
  const mark = document.createElement('span');
  mark.className = 'track-mark';
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = subject.track === 'Laravel' ? 'L' : subject.track;
  const copy = document.createElement('span');
  const name = document.createElement('strong');
  name.textContent = subject.label;
  const detail = document.createElement('small');
  detail.textContent = `${subject.count} questions`;
  copy.append(name, detail);
  button.append(mark, copy);
  button.addEventListener('click', () => switchSubject(subject));
  subjectControl.append(button);
}

function updateSubjectCopy() {
  subjectControl.querySelectorAll('button').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.subject === activeSubject.track));
  });
  document.documentElement.dataset.collection = activeSubject.collectionId;
  $('#subjectCount').textContent = `${activeSubject.count} ${activeSubject.label} questions`;
  $('#subjectVersions').textContent = activeSubject.track === 'Laravel' ? 'Laravel 13 · PHP 8.4 / 8.5' : 'PHP 8.4 / 8.5';
  $('#subjectDescription').textContent = `Trace ${activeSubject.track} behavior, debug realistic failures, and reason about implementation choices. Every answer explains the behavior and the tempting alternatives.`;
  $('#bankTitle').textContent = `The ${activeSubject.count}-question ${activeSubject.label} bank`;
  $('#bankDescription').textContent = `Browse ${activeSubject.track} execution, debugging, testing and engineering scenarios. Answers stay folded until you deliberately reveal them.`;
  $('.lifetime-score').title = `Completed answers in ${activeSubject.label}`;
}
function switchSubject(subject) {
  if (subject === activeSubject) return;
  if (state.view === 'quiz' && state.answers.length && !state.completed &&
      !window.confirm('Switch subjects? Current answers will not be saved.')) {
    return;
  }
  activeSubject = subject;
  const url = new URL(location.href);
  if (activeSubject === SUBJECTS[0]) url.searchParams.delete('subject');
  else url.searchParams.set('subject', activeSubject.track.toLowerCase());
  history.replaceState(null, '', url);
  state.stats = readStats();
  state.domains = new Set(activeQuestions().map(question => domainKey(question.track, question.topic)));
  state.session = [];
  state.answers = [];
  state.completed = false;
  $('#bankSearch').value = '';
  $('#bankTopic').value = 'all';
  bankRenderLimit = 100;
  setupTopics();
  setupBankTopics();
  updateSubjectCopy();
  updateAvailable();
  updateLifetime();
  if (state.view !== 'home') showView('home');
}
updateSubjectCopy();

setupTopics();
setupBankTopics();
updateAvailable();
updateLifetime();
