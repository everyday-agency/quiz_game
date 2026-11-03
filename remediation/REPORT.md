# Remediation and 20-question editorial pilot

Work is complete on local branch **`remediation/question-quality-pilot`**, based on `50a7a02bb29f6614ccd613dbd2703a73a3129679`. Nothing has been pushed or deployed. No production data, regular browser profile, or external application service was used. No additional questions were generated.

The static application still has **2,500 questions with exactly the same IDs**. There are **133 revised existing items**: 111 PHP and 22 Laravel. Exactly **20** received the full editorial pilot treatment. All original records and original teaching notes are retained; **2,367 current records retain their original content**. TypeScript, React, MySQL and Google Analytics content is unchanged.

This report builds on [REPORT.md](../audit/REPORT.md), [EXAMPLES.md](../audit/EXAMPLES.md), [IMPLEMENTATION_PLAN.md](../audit/IMPLEMENTATION_PLAN.md) and their evidence. Those audit artifacts remain unchanged.

## Changes made

**Identity and preservation.** The live bank now starts from an explicit-ID materialization of the original records, with separate revision records joined by ID. The old position-dependent generators are no longer in the active import graph. Insertion, removal from a display list, and reordering no longer allocate or reassign existing identities. Missing IDs, duplicate IDs, unknown revision targets and duplicate revision entries fail validation. Displayed answer choices retain option identities scoped to their question revision.

The [baseline manifest](baseline/manifest.json) retains all 2,500 original hashes, and the [compressed original notes](baseline/learning-notes-v1.json.gz) retain the exact generated teaching notes. Tests compare every archived original and every unaffected current record with that baseline. Original revision 1 is available in `js/bank/legacy-v1.mjs`; the pilot is revision 2. Existing question-to-track/domain relationships and references remain intact.

**Exam workflow.** Exam answers remain ungraded until submission. The interface shows only “N of M answered”; streak is empty and hidden. Correct/incorrect classes, feedback, and teaching notes are absent while answering, including when switching from an already-revealed Learn question. The last action says **Submit exam**. Submission grades by option identity, calculates streak, and updates aggregates once. Learn retains immediate feedback. Missed-answer review now includes the original question code and the selected answer.

**Local progress.** Existing `underTheHoodStats` and fallback `laravelQuizStats` totals keep their meaning and keys. An isolated browser fixture started at 37 answered / 19 correct / 2 sessions / best 80; completing a 5/10 exam produced 47 / 24 / 3 / 80. The legacy value remained untouched. Reload preserved the new totals, and an unfinished review added nothing. No per-question examination history existed, so none was invented or regraded.

**Code presentation.** All 25 invalid combined PHP examples, covering 100 IDs, have been repaired. Independent files and contextual fragments have names and premises. Cooperating fragments explicitly state their shared variables. PQ-021's pilot is instead a single valid program with one opening tag and an explicit output separator. The strict-call example supplies `legacy.php`; the CSV family specifies escape behavior; the static-analysis example uses a proper multiline generic annotation. Contextual examples requiring uploads, PDO, queues or HTTP services are linted, not run against those services.

**Laravel corrections.** All four questions in each of the reporting and queue-retry families were checked and revised. Registered reporting callbacks returning false stop default logging; an exception object's own `report()` returning false requests fallback reporting. `retryUntil` takes precedence over `tries` for the stated ordinary retries. Follow-through also covers the stored deadline, repeated final backoff, remote-operation idempotency, callback recursion and a handler-level reporting assertion. These distinctions are supported by the [reporting documentation](https://laravel.com/docs/13.x/errors#reporting-exceptions), [queue documentation](https://laravel.com/docs/13.x/queues#time-based-attempts) and [pinned source manifest](../tests/fixtures/laravel-13.0.0/manifest.json).

Related-family checking repaired **nine additional companion items**: three Form Request examples now normalize before validation, three route examples specify an absolute origin, and three dirty-state examples supply the original name and save assumptions. The pilot separately demonstrates the post-validation snapshot and unchanged-value cases. This avoids leaving contradictory sibling explanations in those Laravel families.

**Editorial pilot.** Twelve PHP and eight Laravel items have specific stems, technical alternatives, unpadded options, explicit assumptions, a learning objective, a difficulty rationale, and a rationale for each option. Named framework assumptions use the tested **Laravel 13.0.0 reference**, with PHP **8.4–8.5**. The difficulty mix is 5 Foundation, 14 Applied and 1 Advanced; it reflects the reasoning demanded rather than a quota. Source keys occupy the four positions 5/4/6/5 times, and only two keys are uniquely the longest option. This is a cue screen, not a claim of psychometric validity.

**Validation and packaging.** The old structural tests remain as archive-integrity checks, including their historical padding checks; padding is not imposed on revisions. New tests exercise identity, grading, original-content preservation, PHP behavior and the browser workflow. CI definitions now run PHP 8.4/8.5 checks and Chrome before the existing Pages build. A local build stages only 13 static runtime files in `_site`, excluding audits, PHP fixtures, screenshots and development tools. No workflow or deployment was triggered remotely.

## Affected IDs

[affected-ids.json](affected-ids.json) lists every revised ID with old/new hashes and revision numbers. Groups overlap; there are **133 unique IDs**, not the sum of the group sizes.

The 100 combined-PHP repairs are these inclusive ranges:

| IDs | IDs | IDs | IDs | IDs |
|---|---|---|---|---|
| PQ-009–012 | PQ-021–024 | PQ-033–036 | PQ-045–048 | PQ-057–060 |
| PQ-069–072 | PQ-081–084 | PQ-093–096 | PQ-105–108 | PQ-117–120 |
| PQ-129–132 | PQ-141–144 | PQ-153–156 | PQ-165–168 | PQ-177–180 |
| PQ-189–192 | PQ-201–204 | PQ-213–216 | PQ-225–228 | PQ-237–240 |
| PQ-249–252 | PQ-261–264 | PQ-273–276 | PQ-285–288 | PQ-297–300 |

Additional PHP pilot IDs: **PQ-002, PQ-004, PQ-005, PQ-014, PQ-041, PQ-053, PQ-061, PQ-113, PQ-137, PQ-197, PQ-281**. PQ-021 is already in the repair ranges.

All affected Laravel IDs: **LQ-046, LQ-142, LQ-313–316, LQ-413–416, LQ-453–456, LQ-489–492, LQ-545–548**.

The **20 pilot IDs** are:

- PHP: **PQ-002, PQ-004, PQ-005, PQ-014, PQ-021, PQ-041, PQ-053, PQ-061, PQ-113, PQ-137, PQ-197, PQ-281**.
- Laravel: **LQ-046, LQ-142, LQ-314, LQ-413, LQ-453, LQ-489, LQ-545, LQ-546**.

## Before/after examples

[The complete pilot review](PILOT_REVIEW.md) contains every original stem, displayed options, key, code and explanation, followed by its revision, premises, objective, difficulty, option rationales and validation. [pilot-before-after.json](pilot-before-after.json) supplies the machine-readable records. These excerpts omit only the old artificial padding.

**PQ-014 — replace elimination with tracing.** The original asks which review comment preserves the implementation. Its key describes “closures capture variables explicitly and a static local retains its value,” although the shown snippet has no static local. Two alternatives are “Replace the implementation with a comment” and “Suppress every failure.”

The revision asks: “After rate changes, what does the program print when it invokes both callables?” It supplies:

```php
$rate = 2;
$byValue = fn (int $n) => $n * $rate;
$byReference = function (int $n) use (&$rate): int { return $n * $rate; };
$rate = 3;
echo $byValue(4), ' ', $byReference(4);
```

Choices are `8 8`, `12 12`, **`8 12`**, and `12 8`. The answer requires distinguishing value capture from reference capture. Each distractor corresponds to a specific mistaken capture model. Both tested runtimes print `8 12`.

**LQ-545 — correct a reversed key.** The original says a registered callback's `return false` allows default reporting to continue. The revision provides the only reporting callback, rules out a custom exception reporting method, and states that attaching context emits no record. It asks what happens to default logging. Options distinguish one contextual record, **no default record**, loss of callback context, and duplicate logging. The upstream callback/handler probes observe zero default records for false, and one contextual record after changing the return to null. The revised LQ-546 asks for that minimal repair.

**PQ-005 — make the question self-contained.** The original requires a missing `legacy.php` and calls `formatTotal('12')` without supplying its signature. The revision displays `caller.php` and `legacy.php` separately, defines `formatTotal(int $amount): string`, and gives the caller a TypeError catch. Choices are `12.00`, `12`, an empty string and **`TypeError`**. Strictness belongs to the caller; both runtimes print `TypeError`. Chrome verified that the two named code blocks remain separate.

**LQ-453 — supply the decisive initial state.** The original assigns Grace and assumes `isDirty('name')` must be true. The revision states that the freshly retrieved name is already Grace and excludes mutators/observers. The answer is **false, false, false** for the before-dirty, after-changed and remaining-dirty checks. Companion IDs LQ-454–456 explicitly start from Ada when teaching the changed-value case. The contract probe checks both cases.

## Validation results

| Check | Observed result |
|---|---|
| `WRITE_TEST_REPORT=1 node tests.mjs` | Passed on Node 22.19.0 |
| Original archive and notes | All 2,500 original record hashes and exact original teaching notes match |
| Stable identities | All current IDs preserved after reversing records/revisions and inserting a test-only record in the middle |
| Current content scope | 133 explicit revisions; 2,367 unaffected records match their original content hashes |
| Answer mapping | All four option identities graded for every question; shuffled distractor notes remain aligned |
| PHP 8.4.17 | 76 distinct PHP source/fragment lint checks; 12 reviewed pilot executions; 22 Laravel contract assertions passed |
| PHP 8.5.2 | The same 76 / 12 / 22 checks passed; CSV deprecation observed and asserted |
| Local static build | 13 runtime files prepared; audits and test fixtures excluded |
| Real Chrome | Passed on Chrome 156.0.8078.80 against `_site`, with real mouse/keyboard input |
| Browser exam | Ten answers alternate correct/incorrect; no pre-submit indicators; final result exactly 5/10 and 50% |
| Browser storage / review | Legacy fallback, current totals, finish-once, reload, missed code, Learn feedback and Learn→Exam clearing passed |
| Browser content | All 20 pilot questions plus a nonpilot repaired family render exact code, key, versions and three distractor explanations |
| Mobile / runtime | 390px viewport has no document overflow; no uncaught JavaScript exceptions |

Evidence: [PHP results](php-results.json), [browser results](browser-results.json), [pilot cue summary](pilot-quality.json), [neutral exam progress](browser-exam-neutral-progress.png), [before submission](browser-exam-before-submit.png), [results](browser-results.png), [named files](browser-multiple-files.png), and [mobile rendering](browser-mobile.png).

The browser session uses a new temporary profile and local origin. It does not inject the app's state or call internal application functions. It reads the known bank in the test runner to choose correct/wrong options, then drives the actual interface. Screenshot animation completion is awaited; screenshots were visually inspected as well as DOM-checked.

The PHP runner does **not** execute the bank indiscriminately. Only 12 reviewed programs with approved code hashes run, in temporary directories with no application environment, restricted file access, disabled command/network operations and time/memory limits. The rest are parsed. No PDO, HTTP, upload, queue or external API example was executed against application data or services.

Laravel evidence comes from **27 pinned upstream methods**, with 22 assertions per PHP runtime and controlled logger, cache, routing, validator and model collaborators. It is **not a full Laravel installation or integration suite**. Actual SQL persistence, distributed locking and validation rule implementations are outside those probes. [Fixture provenance and limits](../tests/fixtures/README.md) explain the distinction. The GitHub-hosted CI definitions have not been run remotely; only the local suites and prepared artifact have been verified.

## Remaining risks and known debt

1. **This is a pilot, not certification of the full bank.** Most content remains unreviewed or retains the audit's quality defects. The 99 combined-PHP repairs outside the pilot still use generic template distractors; syntax and factual-context repair do not make them strong assessment items. Related standalone PHP siblings can still have inherited explanations unrelated to their particular code, missing premises and negative-stem note problems. For example PQ-006–008, PQ-042–044, PQ-133–136/PQ-138–140 and PQ-282–284 remain editorial follow-up work. They are not silently classified as approved.
2. **Other documented Laravel families remain outside this batch.** LQ-521–524 (public storage versus signed-URL expiry), LQ-537–540 (configuration/application file boundaries) and LQ-541–544 (shell commands labelled PHP) remain in the review queue. They were not represented as fixed by the reporting/retry repairs.
3. **Exam secrecy is limited to the active interface.** A static site exposes its keys, and a learner can deliberately browse answers elsewhere or edit local totals. No backend or authentication was added. The source data is not hidden by the UI fix.
4. **Local history is aggregate-only.** Refresh loses an unfinished attempt; old totals cannot be traced to particular question revisions. Storage failure still falls back to a usable session without persistence. Full attempt persistence, export/import and storage-failure notices need a separately reviewed change.
5. **Difficulty and distractor quality need independent review.** The pilot removes the known mechanical cues and validates the decisive behavior, but no independent human blind-solve exercise or learner calibration has occurred. Option-length statistics alone cannot establish quality. Some paired pilot items share concepts; existing session selection can choose both and allow cross-question clues.
6. **Version and integration coverage is bounded.** PHP 8.4.17 and 8.5.2 were exercised; Laravel methods are pinned to 13.0.0. Other framework patches, real database behavior, queue backends and distributed caches need their own fixtures before related guarantees can be claimed.
7. **Materialization increases the static bank payload.** The explicit original bank is approximately 4.4 MB uncompressed. Local browser behavior passed, but slow-network performance has not been benchmarked. A later release can precompress or split by track while keeping explicit identities.

## Proposed next rollout — existing questions only

1. Review these 20 before/after items and the remaining-risk boundaries. Have a PHP/Laravel reviewer solve each item before seeing its key, then challenge every alternative. Correct any ambiguity in the candidate revision and rerun the relevant behavior/browser checks. Keep the original archive intact.
2. Approve a coverage rubric before more editing: primary assessment family (engineering reasoning/code review or language knowledge/execution), topic, objective, cognitive task, framework dependency, version range, family linkage and justified difficulty. Retain existing IDs and topic aliases so references and filters survive.
3. Revise the existing bank in **batches of at most 25**. Start with the known remaining correctness families above, the standalone siblings of the PHP repairs, negative-stem teaching notes and generic distractors. Review whole affected families together. Use the repaired 100 as syntax/context fixes, not as an approved editorial template.
4. Require one defensible key, explicit premises, plausible misconception-based distractors, code-specific reasoning and a rationale for every option. Remove padding only with a reviewed rewrite. Compare normalized code, objectives and option sets against the whole bank; preserve duplicate IDs and history, with explicit status/links instead of deletion.
5. Choose validation by artifact type. Lint complete PHP files and explicitly wrapped fragments; execute only reviewed isolated fixtures; test intended errors as expected diagnostics. Add version-locked integration fixtures where actual Laravel/database/cache behavior matters. Unknown code needs a stronger isolated execution environment, not an automatic addition to the current allowlist.
6. Keep each release manifest: retained/revised IDs, previous revision archive, content hashes, validation matrix, reviewer decisions and unresolved issues. Require insertion/reordering and local-progress regressions plus real browser checks before a preview. Sample at most one item per linked family in a short exam once that selection change is approved.
7. Calibrate on the intended learners through an explicitly approved collection method. Review ambiguity, negative discrimination, response time and seldom-selected distractors; current aggregate storage cannot supply those item-level statistics. Update difficulty from evidence rather than enforcing artificial equal counts.
8. Review the next completed batch before wider rollout. Publishing remains a separate approval. **The additional 600 questions remain deferred** until the repaired process and coverage blueprint are accepted.
