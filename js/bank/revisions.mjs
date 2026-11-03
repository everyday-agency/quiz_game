// Explicit, reviewable revisions. The original records remain in legacy-v1.mjs.
import { PHP_REPAIR_REVISIONS } from './php-repairs.mjs';
import { LARAVEL_CORRECTIONS } from './laravel-corrections.mjs';
import { PILOT_REVISIONS, PILOT_IDS } from './pilot.mjs';
import { LARAVEL_COMPANION_REVISIONS } from './laravel-companions.mjs';

export const QUESTION_REVISIONS = [
  ...PHP_REPAIR_REVISIONS.filter(question => !PILOT_IDS.includes(question.id)),
  ...LARAVEL_CORRECTIONS.filter(question => !PILOT_IDS.includes(question.id)),
  ...LARAVEL_COMPANION_REVISIONS,
  ...PILOT_REVISIONS,
];
