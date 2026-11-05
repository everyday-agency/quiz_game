export function buildLearningNotes(question, orderedOptions = question.options) {
  const sourceOptions = question.coreOptions || question.options;
  const options = orderedOptions.map((option) => {
    if (typeof option !== 'string') return option.sourceText || option.text;
    const displayedIndex = question.options.indexOf(option);
    return displayedIndex >= 0 ? sourceOptions[displayedIndex] : option;
  });
  const correct = sourceOptions[question.answer];
  return {
    correct,
    whyCorrect: question.explanation,
    correctExample: question.learning.trace,
    correctCode: null,
    alternatives: options.flatMap((option, index) => {
      const sourceIndex = sourceOptions.indexOf(option);
      if (sourceIndex === question.answer) return [];
      if (sourceIndex < 0) throw new Error(`Unknown option for ${question.id}`);
      return [{ number: index + 1, option, reason: question.learning.rationales[sourceIndex], example: null, code: null }];
    }),
  };
}
