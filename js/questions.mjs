import { questions1 } from './questions-1.mjs';
import { questions2 } from './questions-2.mjs';
import { questions3 } from './questions-3.mjs';
import { questions4 } from './questions-4.mjs';
import { questions5 } from './questions-5.mjs';
import { typescriptQuestions1 } from './questions-ts-1.mjs';
import { typescriptQuestions2 } from './questions-ts-2.mjs';
import { typescriptQuestions3 } from './questions-ts-3.mjs';
import { typescriptQuestions4 } from './questions-ts-4.mjs';
import { typescriptQuestions5 } from './questions-ts-5.mjs';
import { mysqlQuestions1 } from './questions-mysql-1.mjs';
import { mysqlQuestions2 } from './questions-mysql-2.mjs';
import { mysqlQuestions3 } from './questions-mysql-3.mjs';
import { mysqlQuestions4 } from './questions-mysql-4.mjs';
import { mysqlQuestions5 } from './questions-mysql-5.mjs';

export const TRACKS = ['Laravel', 'TypeScript', 'MySQL'];
export const DIFFICULTIES = ['Foundation', 'Applied', 'Advanced'];

const trackBanks = [
  {
    track: 'Laravel',
    prefix: 'LQ',
    questions: [...questions1, ...questions2, ...questions3, ...questions4, ...questions5],
  },
  {
    track: 'TypeScript',
    prefix: 'TQ',
    questions: [...typescriptQuestions1, ...typescriptQuestions2, ...typescriptQuestions3, ...typescriptQuestions4, ...typescriptQuestions5],
  },
  {
    track: 'MySQL',
    prefix: 'MQ',
    questions: [...mysqlQuestions1, ...mysqlQuestions2, ...mysqlQuestions3, ...mysqlQuestions4, ...mysqlQuestions5],
  },
];

export const QUESTION_BANK = trackBanks.flatMap(({ track, prefix, questions }) =>
  questions.map((question, index) => ({
    ...question,
    track: question.track || track,
    id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
  }))
);

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
