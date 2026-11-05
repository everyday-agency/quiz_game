# Focused PHP editorial correction

Completed locally on `remediation/question-quality-pilot`. **Exactly four question records changed; the other 596 are unchanged.** This was a focused correction, not a second full editorial audit. All independent approvals remain pending.

| Stable ID | Revision | Final change |
|---|---|---|
| PHP-E26-0355 | 1 → 2 | Corrected the objective to describe HTTP 303 receipt retrieval after POST versus 307 replay. The scenario, options, correct answer and explanations are unchanged. |
| PHP-E26-0549 | 1 → 2 | Replaced the empty-aggregate duplicate with a shutdown-callback review: `exit()` in the first callback skips later cleanup; returning permits cleanup while retaining the main script's failure status. Classified Intermediate. |
| PHP-E26-0557 | 1 → 2 | Replaced the post-close session-mutation duplicate with strict session-ID validation: distinguish an uninitialized supplied ID from an existing stored session. Intermediate retained. |
| PHP-E26-0300 | 2 → 3 | Removed the premise supplying a permanent lock file. Alternatives now compare locking the replaceable data file, unlocking before publication, unlinking the shared lock file, and retaining that file through publication. The objective, correct protocol and Advanced classification remain unchanged. |

For 0300, the improvement is substantive: students must account for waiting processes that already opened a lock target. Unlinking and recreating the shared lock file can split coordination between different open files. The problem still states the filesystem, cooperation and I/O assumptions needed for one answer. Its evidence uses documented lock semantics and explicit failure schedules, not a claimed live concurrency experiment. [PHP flock](https://www.php.net/manual/en/function.flock.php), [flock open-file semantics](https://man7.org/linux/man-pages/man2/flock.2.html).

**Validation passed on PHP 8.4.17 and 8.5.2:**

- **0549:** original `main|flush|`, status 1; callback-return repair `main|flush|cleanup|`, status 1; callback `exit(0)` alternative still omits cleanup and changes status to 0. This distinguishes every offered misconception. [Shutdown callback contract](https://www.php.net/manual/en/function.register-shutdown-function.php).
- **0557:** strict fixture `[false,true]`; permissive contrast `[true,true]`. These are isolated CLI files-handler sessions, not production/browser sessions. [Strict session-mode contract](https://www.php.net/manual/en/session.configuration.php#ini.session.use-strict-mode).
- **0355:** fresh documentation check confirms the preserved 303/307 answer; no real HTTP redirect was executed. [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.4.4).
- Affected batches 3, 4 and 6: **782 lints and 769 isolated executions per runtime**, with their document-backed records checked separately. Automated schema/similarity gates passed; only the four questions and directly relevant overlaps received editorial reconsideration.
- `node tests.mjs`, the static build and all four Chrome 156 suites passed. Chrome covered desktop/390px mobile rendering, shuffled grading, explanations, neutral Exam mode, filters, copying and progress compatibility. The review suite exercised all 620 entries and 1,860 distractor rationales, with zero browser exceptions.

Previous versions and evidence are preserved in the [71-file snapshot](archive/focused-2026-11-05/snapshot.json) and revision archives. [The four-record change manifest](focused-correction/changes.json) and [complete questions with fresh observations](focused-correction/questions-and-evidence.json) provide exact evidence. The [30-question review export](EDITORIAL_REVIEW_30.md) now contains the revised versions. Two overlapping 0549 draft ideas were rejected before acceptance; neither changed another record.

**Remaining blockers:** none of the three authorized editorial decisions remains unresolved. Independent editorial approval and any later release authorization are still outstanding; this focused pass does not certify the rest of the bank or remove the earlier audit's general limitations. The original 300 PHP questions, 20 pilot records, non-PHP content and progress compatibility remain preserved. Nothing was pushed, merged, deployed or activated.
