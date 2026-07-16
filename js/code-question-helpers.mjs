export function codeQuestion(difficulty, prompt, options, explanation) {
  return { difficulty, prompt, options, answer: 0, explanation };
}

export function codeLab(topic, language, title, snippet, questions) {
  if (questions.length !== 4) {
    throw new Error(`${topic} code lab must contain exactly four questions`);
  }

  return questions.map((question) => ({
    ...question,
    topic,
    code: { language, title, snippet },
  }));
}
