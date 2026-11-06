// Each active subject has separate totals; historical keys are never migrated.
// They describe different collections; their totals remain untouched in localStorage.
export const STATS_KEY = 'underTheHoodPhpEngineerV1Stats';
export const LARAVEL_STATS_KEY = 'underTheHoodLaravelSpecialistBetaV1Stats';
export const HISTORICAL_KEYS = ['underTheHoodStats', 'laravelQuizStats', 'underTheHoodPhpPilotV1Stats', 'underTheHoodPhpEngineerReviewV1Stats', 'underTheHoodLaravelSpecialistReviewV1Stats'];
export function readProgress(storage, key = STATS_KEY) {
  try {
    const value = JSON.parse(storage.getItem(key));
    const count = key => Number.isSafeInteger(value?.[key]) && value[key] >= 0 ? value[key] : 0;
    const answered = count('answered');
    return { answered, correct: Math.min(count('correct'), answered), sessions: count('sessions'), best: Math.min(count('best'), 100) };
  } catch {
    return { answered: 0, correct: 0, sessions: 0, best: 0 };
  }
}
