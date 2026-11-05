import { LEGACY_QUESTIONS } from './bank/legacy-v1.mjs';
import { QUESTION_REVISIONS } from './bank/revisions.mjs';
import { assembleQuestionBank } from './bank/assemble.mjs';

export const TRACKS = ['Laravel', 'PHP', 'TypeScript', 'React', 'MySQL', 'Google Analytics'];
export const DIFFICULTIES = ['Foundation', 'Applied', 'Advanced'];
export const QUESTION_BANK = assembleQuestionBank(LEGACY_QUESTIONS, QUESTION_REVISIONS);

export const TRACK_TOPICS = Object.fromEntries(TRACKS.map((track) => [
  track,
  [...new Set(QUESTION_BANK.filter((question) => question.track === track).map((question) => question.topic))],
]));

export const TOPICS = TRACKS.flatMap((track) => TRACK_TOPICS[track]);

export const CURRICULUM = TRACKS.flatMap((track) => TRACK_TOPICS[track].map((topic) => ({
  track,
  topic,
  count: QUESTION_BANK.filter((question) => question.track === track && question.topic === topic).length,
})));
