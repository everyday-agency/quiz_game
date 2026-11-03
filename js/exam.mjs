export function gradeAnswer(answer) {
  const { question, selectedOptionId } = answer;
  return {
    ...answer,
    correct: selectedOptionId === question.optionIds[question.answer],
    correctText: question.coreOptions[question.answer],
  };
}

export function gradeSession(answers) {
  let streak = 0;
  let bestStreak = 0;
  const graded = answers.map(answer => {
    const result = gradeAnswer(answer);
    streak = result.correct ? streak + 1 : 0;
    bestStreak = Math.max(bestStreak, streak);
    return result;
  });
  return { answers: graded, streak, bestStreak };
}
