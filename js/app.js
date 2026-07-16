import { QUESTION_BANK, TRACKS, TRACK_TOPICS, DIFFICULTIES } from './questions.mjs';
import { buildLearningNotes } from './learning-notes.mjs';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const domainKey = (track, topic) => `${track}::${topic}`;
const trackSlug = (track) => track.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const TRACK_META = {
  Laravel: { mark: 'L', detail: 'Application architecture' },
  TypeScript: { mark: 'TS', detail: 'Type-system design' },
  MySQL: { mark: 'DB', detail: 'Data & query reasoning' },
  'Google Analytics': { mark: 'GA', detail: 'Measurement & insight' },
};

const topicControl = $('#topicControl');
const availableCount = $('#availableCount');
const lifetimeCount = $('#lifetimeCount');
const toast = $('#toast');

const savedStats = readStats();

const state = {
  view: 'home',
  size: 20,
  mode: 'learn',
  tracks: new Set(TRACKS),
  domains: new Set(QUESTION_BANK.map((question) => domainKey(question.track, question.topic))),
  difficulties: new Set(DIFFICULTIES),
  session: [],
  current: 0,
  selectedOption: null,
  locked: false,
  answers: [],
  streak: 0,
  bestStreak: 0,
  stats: savedStats,
};

function readStats() {
  try {
    const stored = localStorage.getItem('underTheHoodStats') || localStorage.getItem('laravelQuizStats');
    const parsed = JSON.parse(stored);
    return {
      answered: Number(parsed?.answered) || 0,
      correct: Number(parsed?.correct) || 0,
      sessions: Number(parsed?.sessions) || 0,
      best: Number(parsed?.best) || 0,
    };
  } catch {
    return { answered: 0, correct: 0, sessions: 0, best: 0 };
  }
}

function saveStats() {
  try {
    localStorage.setItem('underTheHoodStats', JSON.stringify(state.stats));
  } catch {
    // The quiz remains fully usable when browser storage is unavailable.
  }
  updateLifetime();
}

function updateLifetime() {
  lifetimeCount.textContent = `${state.stats.answered.toLocaleString()} answered`;
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
      correct: index === question.answer,
    }))),
  };
}

function createCodeLesson(lesson, labelText) {
  const section = document.createElement('section');
  section.className = 'code-lesson';

  const header = document.createElement('div');
  header.className = 'code-lesson-header';
  const label = document.createElement('span');
  label.textContent = labelText;
  const language = document.createElement('span');
  language.className = 'code-language';
  language.textContent = lesson.language;
  header.append(label, language);

  const title = document.createElement('strong');
  title.textContent = lesson.title;
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = lesson.snippet;
  pre.append(code);

  section.append(header, title, pre);
  return section;
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
    option.textContent = alternative.option;
    const reason = document.createElement('p');
    reason.textContent = alternative.reason;
    const example = document.createElement('p');
    example.className = 'choice-example';
    const prefix = document.createElement('b');
    prefix.textContent = 'Example: ';
    example.append(prefix, alternative.example);
    copy.append(option, reason, example);
    if (alternative.code) {
      copy.append(createCodeLesson(alternative.code, 'Why this can fail in code'));
    }
    item.append(number, copy);
    alternatives.append(item);
  });

  wrapper.append(correctExample, alternativesHeading, alternatives);
  return wrapper;
}

function setupTracks() {
  const control = $('#trackControl');
  control.replaceChildren();
  TRACKS.forEach((track) => {
    const label = document.createElement('label');
    label.className = 'track-check';
    label.dataset.track = trackSlug(track);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = track;
    input.checked = state.tracks.has(track);

    const card = document.createElement('span');
    card.className = 'track-choice';
    const mark = document.createElement('span');
    mark.className = 'track-mark';
    mark.textContent = TRACK_META[track].mark;
    const copy = document.createElement('span');
    const name = document.createElement('strong');
    name.textContent = track;
    const detail = document.createElement('small');
    detail.textContent = TRACK_META[track].detail;
    copy.append(name, detail);
    card.append(mark, copy);

    input.addEventListener('change', () => {
      input.checked ? state.tracks.add(track) : state.tracks.delete(track);
      setupTopics();
      updateAvailable();
    });
    label.append(input, card);
    control.append(label);
  });
}

function visibleDomains() {
  return TRACKS.filter((track) => state.tracks.has(track)).flatMap((track) =>
    TRACK_TOPICS[track].map((topic) => ({ track, topic, key: domainKey(track, topic) }))
  );
}

function setupTopics() {
  topicControl.replaceChildren();
  TRACKS.filter((track) => state.tracks.has(track)).forEach((track) => {
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

  if (!state.tracks.size) {
    const empty = document.createElement('p');
    empty.className = 'topic-empty';
    empty.textContent = 'Choose a learning track to reveal its domains.';
    topicControl.append(empty);
  }
  updateTopicToggle();
}

function setupBankTopics() {
  const select = $('#bankTopic');
  const selectedTrack = $('#bankTrack').value;
  const previous = select.value;
  select.replaceChildren();

  const all = document.createElement('option');
  all.value = 'all';
  all.textContent = 'All domains';
  select.append(all);

  const tracks = selectedTrack === 'all' ? TRACKS : [selectedTrack];
  tracks.forEach((track) => {
    const parent = selectedTrack === 'all' ? document.createElement('optgroup') : select;
    if (selectedTrack === 'all') parent.label = track;
    TRACK_TOPICS[track].forEach((topic) => {
      const option = document.createElement('option');
      option.value = domainKey(track, topic);
      option.textContent = topic;
      parent.append(option);
    });
    if (selectedTrack === 'all') select.append(parent);
  });

  select.value = [...select.options].some((option) => option.value === previous) ? previous : 'all';
}

function matchesSetup(question) {
  return state.tracks.has(question.track)
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
    showToast('Choose at least one track, domain, and difficulty.');
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
  $('#progressBar').style.width = `${((state.current + 1) / state.session.length) * 100}%`;
  $('#feedbackPanel').hidden = true;
  $('#feedbackPanel').className = 'feedback-panel';
  $('#learningNotes').replaceChildren();
  $('#answerHint').textContent = state.mode === 'learn'
    ? 'Choose the strongest answer.'
    : 'Your answer is saved without feedback.';

  const action = $('#questionAction');
  action.disabled = true;
  action.textContent = state.mode === 'learn'
    ? 'Check answer'
    : state.current === state.session.length - 1 ? 'Finish exam' : 'Save & next';

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
    text.textContent = option.text;
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
  const question = state.session[state.current];
  const option = question.displayOptions[state.selectedOption];
  const answer = {
    question,
    selectedText: option.text,
    correctText: question.displayOptions.find((item) => item.correct).text,
    selectedIndex: state.selectedOption,
    correct: option.correct,
  };
  state.answers.push(answer);

  if (answer.correct) {
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
    if (question.displayOptions[index].correct) button.classList.add('correct');
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
  const correct = state.answers.filter((answer) => answer.correct).length;
  $('#scoreMetric').textContent = `${correct} correct`;
  $('#streakMetric').textContent = `${state.streak} streak`;
}

function finishSession() {
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
    explanation.textContent = `Correct: ${answer.correctText}. ${answer.question.explanation}`;
    details.append(summary, explanation, createLearningNotes(answer.question, answer.question.displayOptions));
    missedList.append(details);
  });
  if (missed.length > 8) {
    const more = document.createElement('p');
    more.className = 'empty-state';
    more.textContent = `Plus ${missed.length - 8} more—use “Review missed” for the complete set.`;
    missedList.append(more);
  }
}

function renderBank() {
  const term = $('#bankSearch').value.trim().toLowerCase();
  const track = $('#bankTrack').value;
  const domain = $('#bankTopic').value;
  const difficulty = $('#bankDifficulty').value;
  const matches = QUESTION_BANK.filter((question) => {
    const searchable = `${question.track} ${question.topic} ${question.prompt} ${question.explanation} ${question.options.join(' ')}`.toLowerCase();
    return (!term || searchable.includes(term))
      && (track === 'all' || question.track === track)
      && (domain === 'all' || domainKey(question.track, question.topic) === domain)
      && (difficulty === 'all' || question.difficulty === difficulty);
  });

  $('#bankCount').textContent = `${matches.length.toLocaleString()} of ${QUESTION_BANK.length.toLocaleString()} scenarios`;
  const list = $('#bankList');
  list.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No scenarios match those filters.';
    list.append(empty);
    return;
  }

  matches.forEach((question) => {
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
    const correct = document.createElement('strong');
    correct.textContent = `Strongest answer: ${question.options[question.answer]}`;
    const explanation = document.createElement('p');
    explanation.textContent = question.explanation;
    answer.append(correct, explanation);
    details.addEventListener('toggle', () => {
      if (!details.open || answer.dataset.enriched === 'true') return;
      answer.append(createLearningNotes(question));
      answer.dataset.enriched = 'true';
    });
    details.append(summary, answer);
    list.append(details);
  });
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

$('#bankSearch').addEventListener('input', renderBank);
$('#bankDifficulty').addEventListener('change', renderBank);
$('#bankTopic').addEventListener('change', renderBank);
$('#bankTrack').addEventListener('change', () => {
  setupBankTopics();
  renderBank();
});

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

setupTracks();
setupTopics();
setupBankTopics();
updateAvailable();
updateLifetime();
