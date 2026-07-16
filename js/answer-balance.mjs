const CODE_EVIDENCE = [
  'the displayed values',
  'control flow',
  'operator semantics',
  'runtime behavior',
  'the API contract',
  'state changes',
  'side effects',
  'the failure path',
  'lifecycle timing',
  'the data boundary',
  'configuration',
  'the stated constraints',
  'the exact input types',
  'the observable output',
];

const SYSTEM_EVIDENCE = [
  'the scenario’s stated boundary',
  'ownership of the decision',
  'the guarantee actually provided',
  'the failure mode',
  'the trade-off',
  'the data flow',
  'the relevant scope',
  'timing',
  'configuration',
  'a counterexample',
  'the stated constraints',
  'the observable outcome',
  'the mechanism named in the prompt',
  'the missing guarantee',
];

const FRAME_TEMPLATES = [
  (evidence) => `Reasoning check: compare this claim with ${evidence}.`,
  (evidence) => `Evidence to inspect: ${evidence}.`,
];

const FRAME_CLOSINGS = [
  '',
  ' Keep the judgment limited to the exact scenario shown; distinguish an explicit guarantee from behavior that merely seems likely.',
];

function stableHash(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle(values, initialSeed) {
  const result = [...values];
  let seed = initialSeed || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const swapIndex = seed % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function formatList(values) {
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`;
}

function wordCount(value) {
  return value.trim().split(/\s+/).length;
}

function framedCandidates(option, question, seed) {
  const evidence = seededShuffle(question.code ? CODE_EVIDENCE : SYSTEM_EVIDENCE, seed);
  const optionLead = /[.!?]$/.test(option) ? `${option} ` : `${option}. `;
  const candidates = [];

  for (let evidenceCount = 1; evidenceCount <= evidence.length; evidenceCount += 1) {
    const evidenceList = formatList(evidence.slice(0, evidenceCount));
    FRAME_TEMPLATES.forEach((template) => {
      FRAME_CLOSINGS.forEach((closing) => {
        const text = `${optionLead}${template(evidenceList)}${closing}`;
        candidates.push({ text, length: text.length, words: wordCount(text) });
      });
    });
  }

  return candidates;
}

function lengthRanks(question, trackIndex, seed) {
  const correctRankSchedule = seededShuffle([0, 1, 2, 3], seed);
  const correctRank = correctRankSchedule[trackIndex % 4];
  const wrongIndices = seededShuffle(
    question.options.map((_, index) => index).filter((index) => index !== question.answer),
    seed ^ 0x9e3779b9,
  );
  const remainingRanks = [0, 1, 2, 3].filter((rank) => rank !== correctRank);
  const ranks = { [question.answer]: correctRank };
  wrongIndices.forEach((optionIndex, index) => {
    ranks[optionIndex] = remainingRanks[index];
  });
  return ranks;
}

/**
 * Gives every choice a short evidence prompt and assigns its final length rank
 * independently from correctness. Every consecutive block of four questions
 * uses all four correct-answer ranks exactly once, in a seeded order.
 */
export function balanceAnswerLengths(question, trackIndex, trackKey) {
  const blockIndex = Math.floor(trackIndex / 4);
  const seed = stableHash(`${trackKey}:${blockIndex}`);
  const ranks = lengthRanks(question, trackIndex, seed);
  const candidateSets = question.options.map((option, index) =>
    framedCandidates(option, question, seed + (index * 101)));

  let targetLength = Math.max(...candidateSets.map((candidates) =>
    Math.min(...candidates.map((candidate) => candidate.length))));
  let targetWords = Math.max(...candidateSets.map((candidates) =>
    Math.min(...candidates.map((candidate) => candidate.words))));
  const balancedOptions = [];

  Object.entries(ranks)
    .sort((first, second) => first[1] - second[1])
    .forEach(([rawOptionIndex]) => {
      const optionIndex = Number(rawOptionIndex);
      const candidates = candidateSets[optionIndex];
      let selected;
      let selectedDistance = Number.POSITIVE_INFINITY;
      let fallback = candidates[0];
      candidates.forEach((candidate) => {
        if (candidate.length + (candidate.words * 4) > fallback.length + (fallback.words * 4)) {
          fallback = candidate;
        }
        if (candidate.length < targetLength || candidate.words < targetWords) return;
        const distance = (candidate.length - targetLength) + ((candidate.words - targetWords) * 4);
        if (distance < selectedDistance) {
          selected = candidate;
          selectedDistance = distance;
        }
      });
      selected ||= fallback;
      balancedOptions[optionIndex] = selected.text;
      targetLength = selected.length + 5;
      targetWords = selected.words + 1;
    });

  return balancedOptions;
}
