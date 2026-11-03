/** Join revisions by identity only. Array order is presentation, never identity. */
export function assembleQuestionBank(records, revisions = []) {
  const originals = new Map();
  for (const record of records) {
    if (!/^[A-Z]{2}-\d{3,}$/.test(record.id || '')) throw new Error('Question requires an explicit stable ID');
    if (originals.has(record.id)) throw new Error(`Duplicate question ID: ${record.id}`);
    originals.set(record.id, record);
  }
  const updates = new Map();
  for (const revision of revisions) {
    if (!originals.has(revision.id)) throw new Error(`Revision has no original: ${revision.id}`);
    if (updates.has(revision.id)) throw new Error(`Duplicate revision: ${revision.id}`);
    if (!Number.isInteger(revision.revision) || revision.revision <= 1) throw new Error(`Invalid revision: ${revision.id}`);
    if (revision.track && revision.track !== originals.get(revision.id).track) throw new Error(`Track changed: ${revision.id}`);
    updates.set(revision.id, revision);
  }
  return records.map(record => {
    const update = updates.get(record.id);
    const question = { ...record, revision: 1, ...update };
    if (update?.options) question.coreOptions = [...update.options];
    question.optionIds = update?.optionIds || question.options.map((_, index) => `${question.id}@${question.revision}:${index + 1}`);
    return question;
  });
}
