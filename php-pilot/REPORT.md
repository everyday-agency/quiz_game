# PHP architecture and quality pilot

The subsequent [PHP source-formatting review](formatting/REVIEW.html) shows the updated multiline source, simplified viewer, CLEANUP clarification and renewed PHP 8.4/8.5 validation. The current question exports below include those edits; the pre-formatting records remain archived in `formatting/before/`.

Completed locally on **2026-11-04** using **`remediation/question-quality-pilot`**, starting from commit **`4e1fae0`**. The new collection contains exactly **20 original PHP questions**, IDs **PHP-PILOT-001 through PHP-PILOT-020**. They are separate from the existing 300 PHP questions and the previous remediation’s 20 revised questions.

All **2,500 existing records, IDs and teaching notes remain unchanged**, including all non-PHP content and the previous remediation. The application remains static JavaScript, with no backend, Laravel installation, database or migrations added. Nothing was pushed, merged or deployed.

## Review and try the pilot

Run the existing local static server:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open **http://127.0.0.1:8080/?collection=php-pilot-v1**, or choose **Open PHP pilot** from the normal application. The ordinary URL still selects the original 2,500-question collection. The pilot has its own labelled bank, filters, Learn and Exam modes, and progress totals.

The deliverables are:

- [Schema proposal and compatibility contract](SCHEMA.md), with the [executable PHP-only validator/adapter](../js/php-pilot/schema.mjs).
- [Editorial quality rubric](RUBRIC.md).
- [All 20 questions, code, answers, option rationales and validation notes](QUESTIONS.md), plus [the same records as JSON](questions.json).
- [Per-item originality and wording review](review-notes.json), [automated quality comparison](quality-results.json), [runtime evidence](runtime-results.json) and [browser results](browser-results.json).
- [Preservation baseline](baseline.json) and [pilot manifest](manifest.json), including explicit identities and content hashes.

## Structure and coverage

The authoring record separates the learning objective, question format, PHP runtime assumptions, named source units, stable option identities, answer key and explanations. A PHP-only adapter supplies the existing renderer’s fields. No existing question bank was converted to this representation.

| Format | Questions |
|---|---:|
| Execution and output prediction | 7 |
| Error identification and debugging | 4 |
| Code review and refactoring | 3 |
| Implementation choices | 3 |
| Tests that expose a specific defect | 2 |
| Architecture and engineering reasoning | 1 |
| Total | **20** |

Coverage includes arrays and references (001–002), functions (003–004), HTTP policy helpers (005–006), files and streams (007–008, 020), exceptions (009–010), OOP and dependency lifetime (011–013), traits (014–015), static members (016), namespaces (017, 019), and boundary testing (018).

There are **5 Foundation and 15 Applied questions**, with junior and intermediate audiences and explicit prerequisites. No question is classified Advanced. Difficulty comes from the necessary reasoning: tracking a reference, distinguishing null from omission, comparing API contracts, or preserving a resource owner’s expectations.

The source contains **21 complete PHP files and one explicitly labelled class-body fragment**. Multi-file examples provide the relevant files. The trait fragment states its containing class and loaded trait; its executable fixture supplies exactly that wrapper. PHP assumptions are **8.4 and 8.5**, with CLI/error-policy and extension requirements stated where relevant. HTTP questions use pure helpers that model request-policy decisions; they do not claim live-server validation.

## Changes to the application

- Added `js/php-pilot/questions.mjs` and `schema.mjs`. These hold exactly 20 independently authored records and their PHP-only validation/adapter logic. There is no four-question template expansion or answer-length padding.
- Added an explicit collection switch in `js/app.js`. The pilot module loads only when `collection=php-pilot-v1` is selected. The default `js/questions.mjs`, every existing bank module, the grading module and teaching-note module are unchanged.
- Added the collection entry/return link, clear pilot labels and small notice styling, with long-code option wrapping scoped to the PHP pilot. Leaving an unfinished session through this link uses the existing confirmation behavior; cancelling keeps the current exam.
- Reused answer shuffling, identity-based grading, immediate Learn feedback and exam grading after submission. No alternate scoring implementation was added.
- Stored pilot aggregates under **`underTheHoodPhpPilotV1Stats`**. Existing **`underTheHoodStats`** and **`laravelQuizStats`** are neither migrated nor updated by pilot activity. Existing per-question attempt history did not exist; incomplete attempts remain in memory as before.
- Added PHP pilot structural, runtime and browser checks. The old browser runner gained an output-directory option so new regression evidence does not overwrite the previous remediation evidence.
- Updated the local static packaging allowlist from 13 to **15 runtime files** and added the PHP pilot browser workflow to validation CI. Tests, reports and PHP fixtures remain outside the packaged site. GitHub-hosted CI has not been triggered.

The two new runtime modules add approximately 50 KB of uncompressed JavaScript. There are no new package dependencies. Relative module imports and query-based collection selection work with a GitHub Pages project subdirectory.

## Validation results

| Validation | Result |
|---|---|
| Existing content preservation | All 2,500 record hashes and exact teaching-note hashes match the pre-task baseline; all protected bank/grading-module hashes match |
| Existing PHP population | Exactly 300, unchanged; none of the 20 new IDs collides with an existing ID |
| Pilot structure | Exactly 20 PHP-only records, six formats, four distinct options per item, one resolvable key, objectives and assumptions supplied |
| Answer identity | All **24 option permutations per item** grade correctly and map all distractor explanations correctly; reversing authored options preserves the keyed identity |
| PHP **8.4.17** | **63 distinct executable sources/variants linted; 61 isolated executions; all 20 keys supported** |
| PHP **8.5.2** | The same **63 / 61 / 20** checks pass |
| Candidate repairs | All four alternatives run for each of eight items; exactly one meets each stated requirement |
| Test-selection questions | Four candidate tests run against both buggy and repaired implementations for each of two items; exactly one exposes each original defect |
| Review counterexamples | Additional checks confirm the parameter rename, removal of the finally return, and fully qualified exception construction |
| Existing regression suite | Previous bank, identity, PHP and framework-contract checks pass unchanged; the previous browser workflow also passes |
| Pilot Learn browser session | All 20 questions rendered; selected correct answers produce **20/20**; all **60 distractor rationales** match their shuffled choices |
| Pilot Exam browser session | All 20 questions rendered; alternating correct/incorrect selections produce **10/20**, with neutral progress and no correctness feedback before submission |
| Browser compatibility | Current/legacy totals stay byte-for-byte unchanged; pilot totals survive reload; finish counts once; cancelled collection switch preserves the exam |
| Display and build | Chrome **156.0.8078.80** tested the prepared `_site` artifact, named files/fragment labels and all 20 option sets at a **390px** mobile viewport; no uncaught JavaScript errors |

The 61 executions per runtime comprise 10 primary output cases, 32 candidate implementations, 16 original/repaired test-case executions and three additional repair checks. Intentional failures are asserted as expected diagnostics, including incompatible trait method implementations. Lint success alone is never used as proof of an answer.

Execution requires reviewed hashes for all 20 records and the fixture definitions. Each process uses an empty environment, a fresh temporary directory, restricted filesystem access, disabled command/network functions and time/memory limits. File examples use memory streams; the only required PHP include files are supplied inside the temporary fixture. No production data or external service is accessed. These controls are for reviewed fixtures, not arbitrary hostile PHP.

The browser tests use real Chrome mouse/keyboard controls in an isolated temporary profile and local origin. They do not inject application state or call internal grading functions. Main progress was seeded to **37 answered / 19 correct / 2 sessions / best 80**, and stayed unchanged. After the 20/20 Learn session and 10/20 Exam session, pilot totals alone became **40 / 30 / 2 / 100**. Returning to the original collection restored the original displayed totals.

Screenshots: [pilot setup](browser-pilot-home.png), [trait feedback and fragment](browser-trait-feedback.png), [neutral exam progress](browser-exam-progress.png), [submission control](browser-exam-submit.png), [exam results](browser-exam-results.png), and [mobile multi-file review](browser-mobile-files.png), and [mobile code alternatives](browser-mobile-options.png). Screenshots were visually inspected. The [previous-workflow regression evidence](regression/browser-results.json) is stored separately.

## Old versus new question quality

This comparison uses the **current 300 PHP questions after the prior remediation**, not a hypothetical pristine bank. It measures specific defects and authoring improvements; it is not a controlled learner study.

| Screen | Existing PHP collection | New pilot |
|---|---:|---:|
| Questions containing at least one of four known stock option phrases | 123 / 300 | **0 / 20** |
| Questions retaining artificial “Reasoning check” / “Evidence to inspect” padding | 189 / 300 | **0 / 20** |
| Correct option uniquely longest by character count | 122 / 300 | **1 / 20** |
| Exact new stem or whitespace-normalized code duplicates against the old bank | — | **0** |
| New-item objective and misconception-specific review | — | **20 / 20 documented** |

The stock-phrase screen covers “suppress every failure,” “replace … with a comment,” “keep the relevant mechanism,” and “exercise the shown path.” These counts identify cue presence, not measured guessing accuracy. The pilot’s source key positions are deliberately not an equal-count requirement; the browser shuffles options by identity.

**Function contracts.** The existing named-argument family uses a generic answer about name binding and variadics, with unrelated comment/suppression alternatives. New **PHP-PILOT-003** asks whether renaming `limit` to `count` preserves positional and named callers. The learner must distinguish their binding rules. The runtime observes `3|Error`, and the pre-rename variant observes `3|3`.

**HTTP input.** Existing **PQ-121** contains a meaningful input-validation example, but its shared answer only says that input is untrusted and headers precede output. New **PHP-PILOT-005** asks which precise predicate rejects failed integer validation while admitting valid zero. Every alternative is a plausible PHP idiom. Tests demonstrate the distinct behavior of `!$quantity`, `=== null`, `=== false`, and `!isset(...)`.

**Engineering reasoning.** Existing **PQ-205** shows an injected Clock but its shared answer also discusses traits. New **PHP-PILOT-013** asks whether the same long-lived object observes a changing injected clock. Construction-time snapshots, system time and memoized time each violate a concrete part of the contract; all alternatives are exercised.

**Test selection.** New **PHP-PILOT-007** makes all four tests legitimate inputs with correct expected results, but only the final line `"0"` exposes the faulty truthiness-based `fgets` loop. This measures a PHP-specific edge case and test design rather than choosing “exercise the code” over unrelated snapshots.

The wording review also caught and removed a delimiter-only shortcut in **PHP-PILOT-006**. All four media-type alternatives now extract the portion before the semicolon; selecting the key requires distinguishing case-sensitive, prefix, substring and exact comparisons. No padding was added to equalize lengths.

Similarity screening produced nearest-neighbor candidates, which were reviewed by objective and behavior. Shared subjects remain intentional: namespace function resolution and missing-class resolution test different rules; cursor overwriting, EOF truthiness and borrowed-stream ownership test different contracts. [Per-item review notes](review-notes.json) record the distinctions. Token similarity alone is not evidence of semantic originality.

## Remaining limits

- Plausibility and wording have an author’s documented review, not an independent blind human review or learner calibration. The runtime establishes decisive behavior; it cannot prove how attractive a distractor is to the intended audience.
- The existing 300 PHP questions retain their previous defects because this task preserves them. The separate pilot does not certify or silently replace them.
- The HTTP examples validate PHP policy helpers, not actual web-server parsing or response behavior. Supported executable evidence is PHP 8.4.17 and 8.5.2; other versions need their own checks.
- The application still exposes its answer keys as static assets. Exam mode prevents feedback leakage in the active UI; it does not provide tamper-resistant examination security.
- Existing progress remains aggregate-only, and an unfinished session is lost on refresh. Pilot totals are deliberately separate; promoting the collection later needs an explicit decision about those totals.

## Recommendation for the existing 300 PHP questions

1. Evaluate these 20 with an independent reviewer before expanding the architecture. Solve without the key, challenge each distractor, and review the complete source/fragment context. Retain `pilot` status until that decision.
2. Map each existing PHP question to a real objective and one of the six formats. Classify it as retain, revise or defer. Use broad topics plus specific objectives; do not infer engineering depth merely from the presence of code.
3. Revise **PHP only**, in batches of at most **20–25**. Start with generic template families, negative-stem explanations, missing premises and known correctness problems. Review related families together, but do not manufacture four paraphrases of one scenario.
4. Keep every existing `PQ-*` ID, its accepted revision and its relationships. Add schema metadata through an explicit migration/adapter for PHP only after approval. Never replace records by regenerating IDs from array positions.
5. Apply the rubric and type-appropriate execution checks. Write the behavior oracle before using it to grade candidate alternatives. Include expected diagnostics and version boundaries. Require reviewed hashes before code is executed.
6. Remove padding as part of a substantive editorial revision. Replace generic alternatives with realistic PHP misunderstandings and distinct reasons they fail. Use normalized code/objective comparisons plus manual review to find superficial variants.
7. Validate each batch in the existing Learn/Exam browser workflow and preserve current/legacy progress keys. Link related items so a future examination sampler can avoid mutually revealing variants; this sampler change is not part of the present pilot.
8. Calibrate junior/intermediate difficulty with the intended learners using an explicitly approved item-level collection method. Current aggregate counters cannot supply discrimination or distractor-selection statistics. Only then decide how to expand toward approximately 2,000 PHP questions.

No larger generation or rewrite has been performed. The next decision is whether this PHP-only schema and editorial standard are suitable for a small revision batch of existing PHP questions.
