import php from './php-bank.mjs';
import laravel from './laravel-bank.mjs';

export const COLLECTION_ID = 'php-engineer-v1'; // Existing default and bookmarks.
export const SUBJECTS = [
  {track:'PHP', label:'PHP Engineer', collectionId:COLLECTION_ID, statsKey:'underTheHoodPhpEngineerV1Stats', count:620},
  {track:'Laravel', label:'Laravel Specialist (Beta)', collectionId:'laravel-specialist-beta-v1', statsKey:'underTheHoodLaravelSpecialistBetaV1Stats', count:600},
];
export const TRACKS = SUBJECTS.map(subject => subject.track);
export const DIFFICULTIES = ['Foundation', 'Intermediate', 'Advanced'];
export const QUESTION_BANK = [...php, ...laravel];
export const TRACK_TOPICS = Object.fromEntries(TRACKS.map(track => [
  track, [...new Set(QUESTION_BANK.filter(question => question.track === track).map(question => question.topic))],
]));
export const TOPICS = TRACKS.flatMap(track => TRACK_TOPICS[track]);
export const CURRICULUM = TRACKS.flatMap(track => TRACK_TOPICS[track].map(topic => ({
  track, topic, count: QUESTION_BANK.filter(question => question.track === track && question.topic === topic).length,
})));
