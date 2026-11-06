import questions from './php-bank.mjs';

export const COLLECTION_ID = 'php-engineer-v1';
export const TRACKS = ['PHP'];
export const DIFFICULTIES = ['Foundation', 'Intermediate', 'Advanced'];
export const QUESTION_BANK = questions;
export const TRACK_TOPICS = { PHP: [...new Set(QUESTION_BANK.map(question => question.topic))] };
export const TOPICS = TRACK_TOPICS.PHP;
export const CURRICULUM = TOPICS.map(topic => ({
  track: 'PHP', topic, count: QUESTION_BANK.filter(question => question.topic === topic).length,
}));
