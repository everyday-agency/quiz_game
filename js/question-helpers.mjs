export function q(topic, difficulty, prompt, options, explanation) {
  return { topic, difficulty, prompt, options, answer: 0, explanation };
}

export function trackQ(track, topic, difficulty, prompt, correct, wrong1, wrong2, wrong3, explanation) {
  return { track, topic, difficulty, prompt, options: [correct, wrong1, wrong2, wrong3], answer: 0, explanation };
}
