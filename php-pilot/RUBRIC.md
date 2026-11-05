# PHP editorial quality rubric

A question passes only when its answer is correct under explicit premises and its alternatives diagnose realistic misunderstandings. Difficulty is the reasoning demanded, not the amount of prose or the obscurity of an API name.

Use this rubric before admitting an item to the reviewed PHP pool. An author should solve it from the displayed material, then an independent reviewer should solve it without seeing the key. Record disputes rather than treating model agreement or a passing syntax check as approval.

| Gate | Pass condition | Reject or revise when |
|---|---|---|
| Objective | One observable skill explains the question’s inclusion. | It repeats another item with renamed values, or tests facts unrelated to its code. |
| Self-contained context | Every premise that can change the result is supplied: initial state, files, signatures, environment and failure policy. | The solver must invent a missing file, framework convention, caller state or I/O outcome. |
| Unique key | Exactly one option satisfies the stated contract. Execute applicable alternatives and construct counterexamples. | Another choice works under a reasonable reading, or the expected output ignores a warning/error. |
| Technical distractors | Each wrong option corresponds to a named misunderstanding, with a specific reason it fails here. | An option is unrelated, an obvious joke, generic failure suppression, or a non-executable “replace with a comment” response. |
| Wording and leakage | Comparable tone and specificity; no padded options, answer-revealing titles or repetitive key phrases. | The key can be selected by “keep,” positivity, unique detail, length, grammar or a fixed option position. |
| Explanation | Trace the actual values/control flow and explain each alternative. | Explanations merely restate the key or import a mechanism from a different example. |
| Version and context | State the PHP range, diagnostics, source/fragment boundaries, extensions and relevant SAPI assumptions. | A version-dependent claim is unqualified or a fragment is advertised as a runnable file. |
| Difficulty | State prerequisites and why the task is Foundation, Applied or Advanced. | An introductory item silently depends on an advanced rule, or “Advanced” only means verbose. |
| Originality and coverage | Compare the stem, code, objective, misconception set and decision with existing questions. | A new ID masks a cosmetic variant or the same reasoning path repeated across a template family. |
| Validation and review | Store observed results, source references, revision identity and review decisions. | A lint-only result is presented as runtime proof, unknown code is executed broadly, or human calibration is claimed without data. |

## Difficulty guide

- **Foundation / junior:** one principal PHP rule or a short direct trace; examples include array union precedence, omitted versus null arguments, and a clear comparison boundary.
- **Applied / junior or intermediate:** two or more interacting facts, a concrete bug diagnosis, or a repair that must preserve a stated contract; examples include a lingering foreach reference, typed inherited state, and stream ownership.
- **Advanced:** interacting lifetimes/concurrency, deeper type-system constraints, unfamiliar language features or a subtle multi-step counterexample. Declare the prerequisites explicitly. The present 20-item pilot does not require an Advanced tier.

## Wording-only challenge

For code-reading items, hide the code and identify whether the remaining wording singles out a key through tone, length or a recurring phrase. If it does, rewrite the alternatives. For requirements and conceptual items, being able to answer from the stated requirements plus PHP knowledge is legitimate; their objective need not require an output trace. The challenge is to remove irrelevant elimination clues, not to make every question harder.

A longer correct expression is sometimes necessary, such as separating a Content-Type token before comparing it. Do not pad the other choices to conceal this. Check whether other technically plausible implementations produce counterexamples. The pilot includes both shortest and longest keys, and the browser shuffles explicit option identities.

## Duplicate review

Automated normalized-code and prompt comparisons screen for exact copies; token similarity provides a review queue. Neither establishes semantic uniqueness. Read the nearest existing examples and inspect related objectives manually. Shared fundamentals are acceptable when the new decision differs: a stream cursor overwrite, a falsy line at EOF and ownership of a borrowed stream test three different contracts.

Do not create four questions by mechanically asking for behavior, a review comment, a test and a misconception about the same code. Each format needs an independent objective and scenario. For a future larger bank, link closely related cases and avoid selecting mutually revealing variants in the same short examination.

## Runtime and safety gates

Author PHP source with four-space indentation, expanded declaration/control-flow blocks, one statement per line and blank lines between logical sections. Use PSR-12 brace placement where it applies to the example. Keep expressions such as arrow functions intact. Format multiline method choices in the stored options too; never repair source formatting only at display time. A replacement task must identify one exact placeholder, and the executable fixture must replace that same region.

For formatting revisions, compare PHP tokens (including string/comment contents) against the accepted source and rerun all observed-output and candidate tests. Review line-sensitive code and every intentional non-whitespace change separately. The current [formatting review](formatting/REVIEW.html) records that process for all 20 pilot questions and the CLEANUP clarification.

Lint complete files and compile fragments only in their documented wrapper. Run reviewed fixtures on the stated PHP versions. Assert exact output, diagnostics and exit status. For repairs, execute all candidate alternatives; for tests, demonstrate the original failure and corrected behavior. HTTP helpers here are tested as pure policy functions, without claiming coverage of a live server.

The current runner requires the reviewed question and fixture hashes, uses temporary directories and an empty environment, restricts filesystem access, disables command/network operations and imposes time/memory limits. This is a runner for reviewed fixtures, not a general sandbox for hostile PHP. No production data or external service is used. Any future generated code needs technical review before its hash can enter this execution allowlist.

## Acceptance after this local pilot

The current evidence supports technical behavior, schema integrity, UI behavior and an author’s editorial review. An independent blind review and learner calibration remain open. For subsequent PHP batches, record one of `accept`, `revise`, or `defer`, with a reason; keep all IDs and prior accepted revisions. Examine learner item facility, discrimination, response time and distractor selections before treating the difficulty labels as calibrated. Existing aggregate browser counters cannot supply those statistics.
