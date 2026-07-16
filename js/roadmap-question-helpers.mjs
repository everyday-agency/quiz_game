import { codeLab, codeQuestion as c } from './code-question-helpers.mjs';

const clean = (value) => value.trim().replace(/[.!?]+$/, '');
const lower = (value) => {
  const sentence = clean(value);
  return /^[A-Z]{2,}\b/.test(sentence)
    ? sentence
    : sentence.charAt(0).toLowerCase() + sentence.slice(1);
};

function questionSet(track, title, behavior, pitfall) {
  const explanation = `The displayed ${track} code demonstrates that ${lower(behavior)}. The tempting mistake is to assume that ${lower(pitfall)}. The values, control flow, and API contract visible in the snippet are the deciding evidence.`;

  return [
    c('Foundation', `${title}: after tracing the displayed code, which description of its behavior is accurate?`, [
      clean(behavior),
      clean(pitfall),
      'The snippet changes editor hints but cannot affect the executed program',
      'The runtime skips the shown branch and supplies a safe default automatically',
    ], explanation),
    c('Applied', `${title}: which review comment best preserves the guarantee demonstrated by this implementation?`, [
      `Keep the relevant mechanism because ${lower(behavior)}`,
      `Remove the relevant mechanism because ${lower(pitfall)}`,
      'Replace the implementation with a comment describing the intended result',
      'Suppress every failure so callers always receive a successful-looking value',
    ], explanation),
    c('Applied', `${title}: which automated check most directly proves the important behavior in this snippet?`, [
      `Exercise the shown path and assert that ${lower(behavior)}`,
      'Assert only that the source file contains the title of this example',
      'Check that the code compiles without exercising the relevant runtime path',
      'Snapshot an unrelated component or endpoint and treat that as equivalent evidence',
    ], explanation),
    c('Advanced', `${title}: which interpretation is the dangerous trap when this code is changed or reused?`, [
      clean(pitfall),
      clean(behavior),
      'The exact API contract shown in the snippet continues to apply',
      'A focused test should observe the value, branch, side effect, or rendered output involved',
    ], `The unsafe interpretation is that ${lower(pitfall)}. In this snippet, ${lower(behavior)}. A reviewer has to follow the actual operator, branch, framework lifecycle, or library contract rather than infer behavior from a familiar-looking name.`),
  ];
}

function buildLab(track, topic, concepts, language, lesson, roadmap) {
  return codeLab(
    topic,
    language,
    lesson.title,
    lesson.snippet,
    questionSet(track, lesson.title, lesson.behavior, lesson.pitfall),
  ).map((question) => ({
    ...question,
    roadmap,
    roadmapConcepts: concepts,
  }));
}

function integrationLesson(topic, first, second) {
  const sameGuarantee = clean(first.behavior) === clean(second.behavior);
  return {
    title: `${topic}: integration review across two cooperating code paths`,
    snippet: `${first.snippet}\n\n// --- cooperating path ---\n${second.snippet}`,
    behavior: sameGuarantee
      ? `the combined example preserves the shared guarantee across both cooperating paths: ${lower(first.behavior)}`
      : `the combined example preserves both guarantees: ${lower(first.behavior)}; and ${lower(second.behavior)}`,
    pitfall: `either guarantee appears automatically even if its corresponding operator, guard, hook, constraint, or API call is removed`,
  };
}

export function roadmapBank(track, language, topicSpecs, { extended = false } = {}) {
  return topicSpecs.flatMap(({ topic, concepts, lessons }) => {
    if (lessons.length !== 2) {
      throw new Error(`${track} / ${topic} must define exactly two roadmap code labs`);
    }

    const roadmapQuestions = lessons.flatMap((lesson) =>
      buildLab(track, topic, concepts, language, lesson, true));

    if (!extended) return roadmapQuestions;

    return [
      ...roadmapQuestions,
      ...buildLab(track, topic, concepts, language, integrationLesson(topic, lessons[0], lessons[1]), false),
    ];
  });
}
