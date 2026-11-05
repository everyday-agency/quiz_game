import generated from './review-data.mjs';
import mappings from './lesson-mappings.mjs';
import pilotMappings from './pilot-mappings.mjs';
import {PHP_PILOT_BANK,PHP_PILOT_QUESTIONS} from '../php-pilot/questions.mjs';
export const REVIEW_COLLECTION='php-engineer-review-v1';
export const REVIEW_STATS_KEY='underTheHoodPhpEngineerReviewV1Stats';
export const REVIEW_BANK=[
  ...generated.map(q=>({...q,lessonMapping:mappings[q.id]})),
  ...PHP_PILOT_BANK.map((q,index)=>({...q,difficulty:q.difficulty==='Applied'?'Intermediate':q.difficulty,objectiveId:PHP_PILOT_QUESTIONS[index].objective.id,lessonMapping:pilotMappings[q.id],validationStatus:'pilot-validated',independentEditorialReview:'retained approved pilot'})),
];
