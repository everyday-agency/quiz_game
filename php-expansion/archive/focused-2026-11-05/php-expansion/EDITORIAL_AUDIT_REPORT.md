# PHP examination bank — editorial remediation audit

Date: 2026-11-05. Branch: `remediation/question-quality-pilot`.

**All 600 new questions were reviewed. 207 were revised, 390 were retained, and three require an independent editorial decision.** Local technical and browser checks passed. Independent approval remains **pending for all 600**. The original 300-question PHP bank remains active; no push, merge, deployment or replacement activation occurred.

The [30-question review export](EDITORIAL_REVIEW_30.md) contains complete student-facing questions followed by keys, every option's rationale, learning objectives, lesson mappings and the actual per-question validation observations. A [machine-readable copy](editorial-audit/review-30.json) is also available.

## Scope, method and preservation

The review covered each question's prerequisites, assumptions, prompt, files and options before revealing its stored answer key, followed by its objective, difficulty rationale and all explanations. A letter prediction and individual disposition were recorded for every ID in [the 600-record ledger](editorial-audit/records.json). All baseline predictions agreed with the stored keys; this is an author remediation pass, **not an independent blind evaluation or evidence of student discrimination**. Prior familiarity with the bank remains a limitation.

The second pass examined recurring prerequisite/API hints, testing stems that supplied the diagnosis, option completeness, answer length and semantic overlap. Confirmed defects were repaired without imposing length quotas, padding options or rewriting satisfactory questions for uniformity. Prerequisites now identify concepts without naming the sole corrective API where that supplied a shortcut. The learning objective and correct option ID were preserved for every question.

Before editing, 76 source/evidence files were copied to an immutable [baseline archive](archive/editorial-2026-11-05/snapshot.json). Regression checks verify every archived file's SHA-256. Each changed accepted record has exactly one revision increment relative to that baseline; the previous accepted modules are additionally retained by the existing revision-acceptance process. [changes.json](editorial-audit/changes.json) records the affected fields, old/new revisions, hashes, category, severity and reason per ID.

Preservation checks confirmed:

- All 600 new IDs, all 20 approved PHP pilot records and their sources remain present.
- The active 2,500-record bank, including the original 300 PHP and 2,200 non-PHP records, matches the pre-existing preservation hashes exactly. The original PHP archive remains intact.
- The static application and isolated `?collection=php-engineer-review-v1` route remain unchanged in purpose; the review collection contains 620 entries.
- Normal, legacy, pilot and review progress stay separate. Fresh Chrome profiles verified reload and return-to-normal compatibility without accessing the user's real browser profile.
- Existing lesson IDs were preserved. 386 questions have working mappings to Lessons 1–31; 214 remain unmapped. No lesson numbers were invented and no learning objective was silently replaced.

## Findings and dispositions

There were **210 flagged records**: 207 repairable records successfully revised and three unresolved records preserved for an intent/retargeting decision. A record can have more than one defect category, so the category counts overlap.

| Category | Records |
|---|---:|
| Answer leakage in assumptions, prerequisites, stems or source | 111 |
| Difficulty calibration | 103 |
| Weak distractors | 17 |
| Professional/completeness wording cues | 6 |
| Duplicate reasoning | 3 |
| Explanation accuracy | 2 |
| Answer-length cue requiring an option repair | 1 |
| Ambiguity | 1 |
| Missing context | 1 |
| Objective/scenario conflict | 1 |

Severity across the 210 flagged records: **25 high, 166 medium, 19 low**. High denotes a pre-answer solution disclosure or material objective/answer-determinacy problem; medium covers substantive distractor, cue, overlap or calibration defects; low covers limited calibration/explanation issues. These are editorial priorities, not production incident severities. Per-record assignments and reasons are in the ledger; this is not a statistically calibrated severity scale.

No question was deleted or replaced with a different learning objective. Difficulty corrections account for many revisions; 207 does not mean that 207 answer keys were wrong. No answer key changed in this pass.

## Significant before/after examples

### PHP-E26-0591 — canonical Base64, revision 1 → 2

**Before:** the assumptions explicitly said: “Zg== is the canonical encoding of f; Zh== has different unused pad bits but PHP’s strict decoder still yields f.” Prerequisites also named “Decode/re-encode validation.” The student could select the `Zh==` test without evaluating the code.

**After:** the assumptions specify canonical padded standard Base64 under RFC 4648, no whitespace, and an empty string for empty bytes. The prompt is now: “Which test has the required expected result but fails for the displayed implementation?” No example is decoded in the premises.

```php
function canonicalBase64(string $text): bool
{
    return base64_decode($text, true) !== false;
}
```

The four existing choices remain tests of canonical `Zg==`, invalid-alphabet `@@`, noncanonical `Zh==`, and empty input. The third is still the correct test: strict decoding accepts it but canonical re-encoding differs. Both PHP 8.4.17 and 8.5.2 ran all four tests against the displayed and repaired implementations; exactly that test fails before repair and all pass afterward. Advanced is retained because deriving the canonical-spelling counterexample requires reasoning about binary encoding, unused bits and decoder permissiveness, rather than ordinary syntax. Independent review should assess that calibration too. See [PHP's decoder contract](https://www.php.net/manual/en/function.base64-decode.php) and [RFC 4648 canonical encoding](https://datatracker.ietf.org/doc/html/rfc4648#section-3.5).

### PHP-E26-0193 — domain/transport separation, revision 2 → 3

**Before:** the displayed `ValidationOutcome` enum, `httpStatus(ValidationOutcome $outcome)` function and `cliStatus(ValidationOutcome $outcome)` function already implemented the answer. Students only needed to restate that design.

**After:** this is a requirement-only scenario. One validation use case serves HTTP and CLI; invalid input must become HTTP 422 or CLI exit 2; its domain API must contain neither transport's concepts and must remain unchanged when another transport is added. The prompt still asks which responsibility split preserves those boundaries.

The four choices remain concrete alternatives:

1. Return an HTTP status from the domain and make every adapter interpret it.
2. Branch on `PHP_SAPI` inside the domain.
3. Return a transport-neutral outcome and map it in each adapter — **correct**.
4. Return both HTTP and CLI statuses in the domain result object.

The code example and enum prerequisite were removed, while all four explanations still identify the coupling in that particular alternative. Validation is now an explicit requirements/document review. The removed demonstration is preserved in the archive; this revised scenario was **not** executed as an HTTP or CLI adapter integration.

### PHP-E26-0599 — durable handoff, revision 1 → 2

**Before:** only the correct answer mentioned durable enqueue acknowledgement; the alternatives were inline work, a shutdown callback and an in-process Fiber. Recognizing “durable queue” was sufficient, and the Advanced label overstated the reasoning.

**After:** every option publishes to a durable queue. The requirements define a broker confirmation for persistence in the intended queue, possible client buffering, an unknown outcome on timeout, routing failure handling, termination between steps and safe duplicate handling by the worker. The choices are:

1. Publish, return 202 and finish the response, then wait for confirmation.
2. Publish and wait; on timeout return 202 and schedule an in-process shutdown retry.
3. Publish and wait; return 202 only after confirmation, otherwise a retryable non-202 response — **correct**.
4. Publish, wait for the client socket to flush, then return 202.

Students must reason about the failure window and distinguish persistence confirmation from client-side progress. Difficulty is now **Intermediate**. The explanations address each sequence's failure, including timeout uncertainty and duplicate delivery. The stated contract was checked against [PHP-FPM response finishing](https://www.php.net/manual/en/function.fastcgi-finish-request.php) and [RabbitMQ publisher confirmations](https://www.rabbitmq.com/docs/confirms). No broker, FPM service or external queue was executed. The scenario explicitly handles routing failures because a generic publisher confirmation alone does not establish successful routing to an intended queue.

### Additional repairs

| ID | Before | After and validation |
|---|---|---|
| PHP-E26-0050 | Distractors suggested distinguishing two Boolean false values by runtime type or casting an already Boolean result. | Explicit active/inactive/storage-error contract, with plausible log-and-false, propagation, true-on-error and retry-and-false choices. The three-outcome witness and propagation contrast run on both PHP versions. |
| PHP-E26-0056 | `hash_equals` in prerequisites named the only timing-safe option. | Neutral string-comparison, authentication-token and timing-side-channel concepts. The strict-equality versus timing requirement remains explicit. |
| PHP-E26-0079 | Prerequisites and assumptions described the outbox solution; the requirement also failed to forbid notifying rolled-back orders. | Neutral database/broker/crash capabilities plus the missing “rolled-back orders must not notify” requirement. Students must derive the transaction/outbox relationship. |
| PHP-E26-0145 | Only the correct trait adaptation included both `final` and `sealed`. | All four attempt both requirements; wrong choices seal the original, readapt a new alias, or put `final` in the wrong grammar position. Every candidate is compiled/executed in its host file on both runtimes. |
| PHP-E26-0330 | Trace implied that all wrong output prefixes fail the return type. | Explains that weak-mode `return print` can coerce its integer result to string `"1"`, which still violates the selected-label/no-output contract. Existing all-option runtime observations confirm the distinction. |
| PHP-E26-0343 | The fixture calculated its received MAC directly from `$raw`, demonstrating the sought byte selection. | An equivalent fixed fixture MAC replaces that expression. Every proposed byte-selection patch still runs on both PHP versions. |
| PHP-E26-0432 | “Both required response shapes” were not actually specified. | The stem states the required JSON `[{},{"items":[1,2]}]`, making the top-level object/nested-list contract explicit. |
| PHP-E26-0447 | One distractor claimed nullable return types are illegal. | A realistic bare-`return` versus explicit `return null` misconception, backed by an expected compilation-failure contrast and a valid explicit-null contrast. |
| PHP-E26-0489 | The source already read the first yield and caught the next advance, demonstrating the correct test. | The displayed check only creates the generator and prints `created`; a separate validation contrast advances it and prints `rejected`. Explanations now distinguish the flawed displayed test from the correct consumption test. |
| PHP-E26-0600 | Its alternatives mostly repeated 0343's raw-versus-transformed byte decision. | One alternative now verifies the correct original bytes **after dispatch**. This adds a pre-effect authorization ordering decision while preserving the original pipeline objective. |

Complete old versions and evidence remain in the baseline archive. The 30-question export includes all three external findings and many of these additional repairs.

## Remaining decisions

| ID | Unresolved issue | Needed decision |
|---|---|---|
| PHP-E26-0355 | The stored objective says to preserve the original POST method/body. The scenario, correct answer and explanations instead require retrieval with 303. | Confirm whether the intended objective is POST preservation or POST/redirect/retrieval before authorizing the corresponding revision. No objective was silently changed. |
| PHP-E26-0549, compared with PHP-E26-0226 | Both require guarding empty input before `min`/`max` in a nullable aggregate helper. Switching function direction or question format adds insufficient reasoning. | Decide whether to retain both as deliberate practice or authorize retargeting one objective. |
| PHP-E26-0557, compared with PHP-E26-0431 | Both close a session, mutate local `$_SESSION`, reopen it and lose the mutation. The same timing rule and repair decide both. | Decide whether deliberate repetition is wanted or authorize a different objective for one stable ID. |

These records remain in the local review collection and are deliberately included in the external sample. They are not approved for release. PHP-E26-0226 was also selected by the deterministic random sample, so both sides of one duplicate pair are available together.

## Wording and answer-length measurements

Lengths count characters in the exact option text, including code. Measurements compare the immutable accepted baseline with the revised accepted-for-review records. A unique-longest strategy chooses only when one choice is strictly longer than the other three; tied items are excluded from its conditional accuracy.

| Measurement | Before | After |
|---|---:|---:|
| Questions with a uniquely longest option | 504 | 504 |
| Correct option uniquely longest | 180 / 600 (30.0%) | 176 / 600 (29.3%) |
| Accuracy of choosing that longest option where unique | 35.71% | 34.92% |
| Correct option uniquely shortest | 43 | 44 |
| Key more than 1.45× every distractor's length | 3 | 3 |
| Comparable baseline API-token candidates still matching a unique option | 66 | 44 |
| Those API-token matches pointing to the stored key | 28 | 6 |
| Confirmed answer-leakage records requiring repair | 111 | 0 unresolved confirmed repairs |
| Confirmed professional/completeness/length-cue records requiring repair | 6 | 0 unresolved confirmed repairs |

The length signal remains above the 25% random-choice reference. It improved only slightly; **this audit does not claim that length or wording bias has disappeared**. The three extreme length outliers are names/entity spellings rather than padded prose: PHP-E26-0010 (`UnhandledMatchError`), PHP-E26-0486 (an apostrophe entity example), and PHP-E26-0515 (`unsupported`). They were retained with explicit review notes, not shortened artificially.

The API comparison reapplies the same literal token-survival test to the original candidate list on both versions. It is not a fresh exhaustive language model. The initial broader screen contained 77 candidates, 30 pointing to the key; these are preserved separately and should not be mixed with the comparable 66/28 denominator. The six retained key-pointing matches are PHP-E26-0060, 0253, 0447, 0482, 0565 and 0590: their terms are already part of the displayed code/contract or broad terminology, and deciding the proposed behavior still requires tracing that context. Exact word overlap alone is not a confirmed leak.

Authored correct positions remain A: 123, B: 157, C: 172, D: 148. The application shuffles options by identity; positions were not artificially rebalanced. [statistics.json](editorial-audit/statistics.json) contains the measurements and limitations.

## Difficulty and curriculum

| Difficulty | Before | After |
|---|---:|---:|
| Foundation | 150 | 160 |
| Intermediate | 300 | 380 |
| Advanced | 150 | 60 |

The 103 reclassifications reflect the actual reasoning operation. For example, an explicit two-step Fiber or Reflection trace does not become Advanced simply because its API is unfamiliar; the learner still receives prerequisites and version assumptions. Conversely, comparing mutation during value/reference `foreach` and tracking suppressed diagnostics through `require` were raised to Intermediate. Multi-boundary lifecycle, protocol, concurrency and representation problems remain Advanced where warranted. These are provisional editorial judgments until independent review and learner evidence are available.

All six format counts remain unchanged: 150 execution, 120 debugging, 120 code review, 90 implementation, 70 testing and 50 architecture. All 25 repository topics remain represented. The audit did not invent a numbered advanced curriculum or assume a prerequisite was already studied. The three objective/overlap issues above are the remaining curriculum decisions.

## Similarity review

Every current draft was screened against the other five current batches, earlier questions within its batch, the 20 pilot records and the archived 300 PHP questions. This closes the earlier direction-only check that compared a batch only with its predecessors. Normalized full student tasks are checked for exact duplication; neutral repeated stems are permitted because their code, inputs and options supply the task.

The final token screen produced 277 unique candidate pairs, plus three manually tracked pairs, for **280 documented pair dispositions** in [similarity-review.json](editorial-audit/similarity-review.json). Fifty-seven current screen pairs lacked a previous pair note and received a new objective-specific disposition. Applicable baseline pair reasoning was carried forward explicitly; it is not presented as a new independent review. Generic prompt vocabulary was excluded from similarity scoring to avoid treating unrelated failing-assertion tasks as duplicates. The two unresolved pairs and revised 0343/0600 pair are tracked even though lexical thresholds alone missed them.

No exact complete student task duplicates were found. Lexical similarity cannot establish semantic originality, and the bank intentionally overlaps archived curriculum concepts that it may eventually replace. For example, repairing a falsy-default bug improves on the archived weak coalescing review but is not a brand-new curriculum concept. Independent review should also assess the pedagogical value of retained related pairs, including generator delegation and string read/write contrasts.

## Technical verification

Both installed runtimes were used: **PHP 8.4.17 and PHP 8.5.2**. Each report is hashed to its exact current authored batch. Executions use fresh temporary fixtures, empty environments, `php -n`, explicit extension allowlists, restricted `open_basedir`, time/memory bounds and disabled network/process APIs. No production data or external service was used.

| Batch | Records checked per runtime | Lints per runtime | Isolated executions per runtime |
|---|---:|---:|---:|
| 1 | 100 | 294 | 289 |
| 2 | 100 | 300 | 286 |
| 3 | 100 | 276 | 272 |
| 4 | 100 | 275 | 268 |
| 5 | 100 | 202 | 200 |
| 6 | 100 | 229 | 227 |
| **Total per runtime** | **600** | **1,576** | **1,542** |

The 501 questions with source comprise 516 complete named PHP files. Replacement expressions and statements are compiled in their host files, not incorrectly linted as standalone programs. Validation kinds are 149 observed-output, 194 all-candidate patches, 99 runtime contracts, 59 regression-test selections and **99 document/requirements reviews**. The latter are checked for an explicit rule and an audit of all four options in both passes; they do not contribute PHP executions. Expected parse/fatal errors are evidence for particular distractors, not ignored failures.

Fresh verification passed:

- All six schema, preservation, source-layout and similarity gates, followed by explicit pre-release refresh with revision archives.
- `node tests.mjs`: existing legacy/remediation contracts, original IDs, insertion/reordering, PHP pilot formatting and runtime behavior, code-viewer safety, expansion schema/filter/shuffle checks, and the new editorial archive/revision/sample regressions.
- `node tools/build-site.mjs`: 26 allowlisted static runtime files prepared locally; authoring, fixtures, archives and review evidence are not shipped in the runtime projection.
- All four actual headless Chrome **156.0.8078.80** suites against `_site`, using isolated profiles and GitHub Pages-style subpaths. Desktop and 390px mobile emulation were tested; this is not a physical-device test.
- `git diff --check`.

| Chrome suite | Result and evidence |
|---|---|
| Existing application | 9 workflow checks passed: neutral Exam, 5/10 shuffled grading, Learn/missed review, reload, original progress and mobile rendering. [Report](editorial-audit/browser-existing/browser-results.json) |
| Approved PHP pilot | 7 workflow checks passed: all 20 records, 60 distractor explanations, shuffled grading, cancellation, neutral 20-item Exam, 10/20 score and progress isolation. [Report](editorial-audit/browser-pilot/browser-results.json) |
| Code viewer | 8 checks passed: exact source/copy for all 22 pilot files/fragments, touch scrolling, multiline/long-source fixtures, inert injection text, clipboard-denial fallback, keyboard interaction and no-code questions. [Report](editorial-audit/browser-viewer/browser-results.json) |
| Expansion review | 6 aggregate workflow checks passed: all 620 desktop/mobile entries, 1,860 mapped distractor explanations, filters, shuffled keys, neutral Exam, reload, separate progress, multi-file review, copy and scrolling. [Report](editorial-audit/browser-review/browser-results.json) |

All four browser reports contain zero uncaught JavaScript errors. In the review suite the scripted Learn choices scored 531/620 and the Exam scored 10/20, producing exactly 640 review answers, 541 correct and two completed sessions. Existing main, legacy and pilot fixtures remained unchanged. These are deterministic regression outcomes, not learner-quality measurements.

Screenshots were captured before answering the three externally flagged questions on desktop and mobile. Representative inspected captures: [0193 desktop](editorial-audit/browser-review/PHP-E26-0193-desktop.png), [0591 desktop](editorial-audit/browser-review/PHP-E26-0591-desktop.png), [0599 mobile](editorial-audit/browser-review/PHP-E26-0599-mobile.png), and [code/scroll layout on mobile](editorial-audit/browser-review/PHP-E26-0258-mobile.png). The full [test logs](editorial-audit/logs/) and per-batch [runtime evidence](evidence/) are retained.

## Implementation changes and next review

This phase changed the six PHP authoring batches and their accepted review copies, prerequisite projections, manifests and evidence. It updated the checker to compare all current batches and complete student tasks, allowed the acceptance ledger to represent unresolved decisions honestly, added per-ID archive/revision regressions, and extended Chrome checks/screenshots for 0193, 0591 and 0599. `tools/php-editorial-report.mjs` reproducibly exports existing records, measurements and the review sample; it does not generate questions. No application scoring, storage, mode, styling, normal bank or non-PHP content logic was changed by this phase.

The next review should:

1. Read the 30 exported student sections before their answer sections. The sample contains 20 targeted cases and ten deterministic random selections without rerolls, all six formats and all three difficulty levels.
2. Resolve 0355's intended objective and the 0549/0226 and 0557/0431 overlap decisions. Authorize any objective change explicitly before it is made under the stable ID.
3. Evaluate whether the revised distractors, remaining long-answer signal and retained Advanced labels require another focused pass. Require a per-ID reason and fresh evidence for any further revision.
4. Use additional independent sampling across the remaining records and, when available, learner response data to measure discrimination and distractor selection. Technical success and author review alone do not establish examination validity.
5. Keep all 600 approvals pending and the original PHP bank active until a separate release review authorizes replacement. This report does not authorize activation.

## Affected stable IDs

The 207 revised records are listed below. Each increment, exact changed fields and reason is recorded in [changes.json](editorial-audit/changes.json). All other accepted records, including the three unresolved records, retain their baseline content.

**Batch 1 (24 revised):**

`PHP-E26-0022`, `PHP-E26-0041`, `PHP-E26-0047`, `PHP-E26-0050`, `PHP-E26-0056`, `PHP-E26-0059`, `PHP-E26-0061`, `PHP-E26-0062`, `PHP-E26-0063`, `PHP-E26-0064`, `PHP-E26-0069`, `PHP-E26-0070`, `PHP-E26-0076`, `PHP-E26-0078`, `PHP-E26-0079`, `PHP-E26-0081`, `PHP-E26-0082`, `PHP-E26-0084`, `PHP-E26-0085`, `PHP-E26-0088`, `PHP-E26-0089`, `PHP-E26-0090`, `PHP-E26-0092`, `PHP-E26-0098`.

**Batch 2 (29 revised):**

`PHP-E26-0115`, `PHP-E26-0120`, `PHP-E26-0133`, `PHP-E26-0140`, `PHP-E26-0142`, `PHP-E26-0144`, `PHP-E26-0145`, `PHP-E26-0147`, `PHP-E26-0154`, `PHP-E26-0156`, `PHP-E26-0158`, `PHP-E26-0160`, `PHP-E26-0162`, `PHP-E26-0163`, `PHP-E26-0167`, `PHP-E26-0169`, `PHP-E26-0172`, `PHP-E26-0179`, `PHP-E26-0180`, `PHP-E26-0184`, `PHP-E26-0186`, `PHP-E26-0191`, `PHP-E26-0192`, `PHP-E26-0193`, `PHP-E26-0196`, `PHP-E26-0197`, `PHP-E26-0198`, `PHP-E26-0199`, `PHP-E26-0200`.

**Batch 3 (34 revised):**

`PHP-E26-0205`, `PHP-E26-0219`, `PHP-E26-0221`, `PHP-E26-0222`, `PHP-E26-0224`, `PHP-E26-0237`, `PHP-E26-0241`, `PHP-E26-0242`, `PHP-E26-0243`, `PHP-E26-0244`, `PHP-E26-0245`, `PHP-E26-0247`, `PHP-E26-0256`, `PHP-E26-0259`, `PHP-E26-0262`, `PHP-E26-0263`, `PHP-E26-0264`, `PHP-E26-0267`, `PHP-E26-0275`, `PHP-E26-0278`, `PHP-E26-0279`, `PHP-E26-0280`, `PHP-E26-0282`, `PHP-E26-0283`, `PHP-E26-0284`, `PHP-E26-0285`, `PHP-E26-0287`, `PHP-E26-0288`, `PHP-E26-0289`, `PHP-E26-0290`, `PHP-E26-0291`, `PHP-E26-0292`, `PHP-E26-0299`, `PHP-E26-0300`.

**Batch 4 (46 revised):**

`PHP-E26-0307`, `PHP-E26-0314`, `PHP-E26-0315`, `PHP-E26-0320`, `PHP-E26-0321`, `PHP-E26-0323`, `PHP-E26-0324`, `PHP-E26-0325`, `PHP-E26-0327`, `PHP-E26-0330`, `PHP-E26-0332`, `PHP-E26-0336`, `PHP-E26-0339`, `PHP-E26-0342`, `PHP-E26-0343`, `PHP-E26-0344`, `PHP-E26-0345`, `PHP-E26-0346`, `PHP-E26-0347`, `PHP-E26-0351`, `PHP-E26-0357`, `PHP-E26-0359`, `PHP-E26-0362`, `PHP-E26-0363`, `PHP-E26-0364`, `PHP-E26-0365`, `PHP-E26-0367`, `PHP-E26-0368`, `PHP-E26-0369`, `PHP-E26-0378`, `PHP-E26-0379`, `PHP-E26-0380`, `PHP-E26-0381`, `PHP-E26-0382`, `PHP-E26-0383`, `PHP-E26-0384`, `PHP-E26-0385`, `PHP-E26-0386`, `PHP-E26-0387`, `PHP-E26-0388`, `PHP-E26-0389`, `PHP-E26-0390`, `PHP-E26-0391`, `PHP-E26-0392`, `PHP-E26-0398`, `PHP-E26-0400`.

**Batch 5 (32 revised):**

`PHP-E26-0401`, `PHP-E26-0412`, `PHP-E26-0419`, `PHP-E26-0420`, `PHP-E26-0421`, `PHP-E26-0422`, `PHP-E26-0424`, `PHP-E26-0425`, `PHP-E26-0426`, `PHP-E26-0430`, `PHP-E26-0432`, `PHP-E26-0438`, `PHP-E26-0441`, `PHP-E26-0444`, `PHP-E26-0445`, `PHP-E26-0447`, `PHP-E26-0452`, `PHP-E26-0461`, `PHP-E26-0462`, `PHP-E26-0463`, `PHP-E26-0464`, `PHP-E26-0465`, `PHP-E26-0470`, `PHP-E26-0471`, `PHP-E26-0485`, `PHP-E26-0486`, `PHP-E26-0487`, `PHP-E26-0489`, `PHP-E26-0492`, `PHP-E26-0497`, `PHP-E26-0499`, `PHP-E26-0500`.

**Batch 6 (42 revised):**

`PHP-E26-0511`, `PHP-E26-0514`, `PHP-E26-0519`, `PHP-E26-0520`, `PHP-E26-0521`, `PHP-E26-0522`, `PHP-E26-0523`, `PHP-E26-0524`, `PHP-E26-0525`, `PHP-E26-0533`, `PHP-E26-0537`, `PHP-E26-0541`, `PHP-E26-0542`, `PHP-E26-0544`, `PHP-E26-0545`, `PHP-E26-0547`, `PHP-E26-0554`, `PHP-E26-0561`, `PHP-E26-0562`, `PHP-E26-0563`, `PHP-E26-0564`, `PHP-E26-0565`, `PHP-E26-0566`, `PHP-E26-0567`, `PHP-E26-0568`, `PHP-E26-0569`, `PHP-E26-0570`, `PHP-E26-0575`, `PHP-E26-0576`, `PHP-E26-0578`, `PHP-E26-0580`, `PHP-E26-0581`, `PHP-E26-0582`, `PHP-E26-0584`, `PHP-E26-0586`, `PHP-E26-0587`, `PHP-E26-0589`, `PHP-E26-0591`, `PHP-E26-0597`, `PHP-E26-0598`, `PHP-E26-0599`, `PHP-E26-0600`.

