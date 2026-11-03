# Proposed implementation and editorial plan

This plan preserves the static GitHub Pages architecture. It is awaiting review; none of the application, storage, or question changes below have been made. The 600 new questions are a later authorized phase.

**1. Freeze identity and document the baseline before changing shared generators.** Preserve the current commit and the audit's complete ID/hash manifest. Export the existing materialized content into an immutable version-one archive during the approved implementation phase, including displayed options and generated explanations so old presentations can be reconstructed. Assign explicit existing IDs to canonical records; stop deriving identity from array order. Preserve all 2,500 IDs across every track because the helpers are shared. Do not renumber or reuse an ID, even when a question is retired.

Introduce `revision` separately from `id`; retain the old revision and append reviewed replacements. Give options stable IDs within a revision. Record `supersedesRevision`, change reason, reviewer, content hash, and approval date. Retain existing ID-linked teaching notes until they have an explicit revision-aware replacement. An item moved out of exams should receive an availability/status flag, not be deleted. A semantic duplicate can be linked to a canonical item while retaining its own historical identity.

The acceptance check is that every old ID still resolves to its original revision, and changing order or adding a new source file changes no existing IDs. Reconstructing old content must not depend on the latest template helper.

**2. Preserve local progress and make attempts explicit.** Keep reading the existing `underTheHoodStats` and `laravelQuizStats` formats. Treat totals as historical aggregates; do not invent per-question history or claim that past totals can be regraded. Do not reset or reinterpret the old score counters when questions change.

If attempt persistence is approved, write a new versioned storage structure containing an attempt ID, mode, bank release, ordered `{questionId, revision, displayedOptionIds}`, selected option IDs, timestamps, completion state, and grading-version information. Snapshot the needed question content or retain the referenced bank release. Save incrementally, resume by exact revision, and mark completion idempotently so refresh/retry cannot count an attempt twice. Provide export/import for local progress and an explicit notice when storage fails. Preserve the original storage value when migrating; validate before switching readers. Test old-key fallback, malformed data, quota errors, interruption, and schema upgrades in isolated storage.

No database migrations, seeders, or Laravel models are needed for this static product. If authenticated, authoritative examination results become a future requirement, that is a separate backend decision: public client code and browser totals cannot provide that guarantee.

**3. Correct the workflow before drawing conclusions from scores.** Hide score, streak, correct-answer flags in the rendered exam interface, and answer explanations until submission; browser source still remains public. Persist or accurately describe answer-saving behavior. Show the original code and the selected answer during missed-item review. Keep shuffled option identities attached to answers. Add focused workflow checks for learn/exam behavior, shuffle mapping, finish-once behavior, refresh/resume if implemented, and review of code questions. Sample exam sets by a declared blueprint and allow at most one item per lesson/duplicate family unless a linked case study is deliberate.

**4. Establish the content contract.** Use validated JSON or plain records imported by `.mjs`; a database is optional and unnecessary here. Distinguish authoring metadata from learner-visible context. A candidate record should include:

| Field group | Required content |
|---|---|
| Identity and lifecycle | Stable ID, revision, status (`draft`, `reviewed`, `pilot`, `approved`, `retired`), original ID mapping, source hash |
| Classification | Primary family, domain, objective ID, cognitive task, framework dependency, secondary tags, duplicate/lesson family |
| Candidate context | Positive and specific stem, assumptions, input/initial state, labelled files or fragment context, exactly one best answer |
| Options | Stable option IDs, concise text, keyed option ID, misconception represented by each distractor |
| Teaching | Item-specific explanation, worked trace or decisive reasoning, distinct rationale for every option |
| Compatibility | PHP range, Laravel/package version if applicable, extensions, SAPI, relevant ini/error policy, database engine and schema assumptions |
| Validation | Fixture ID, expected output/result/diagnostics, execution results per runtime, authoritative references and checked date |
| Review | Author/provenance, independent reviewer, ambiguity and distractor checks, difficulty rationale, pilot statistics |

Use one primary family for counting toward the long-term goal: **engineering reasoning/code review** or **language knowledge/syntax/execution**. Keep “Laravel” as a framework/dependency tag rather than equating it with engineering reasoning. A PHP output-tracing question may assess knowledge even if it contains code. An engineering question must require diagnosis, a constrained tradeoff, an invariant, or a consequence of a proposed change.

Use domains such as language semantics; types/contracts; objects and state; errors/resources; data access/concurrency; security/trust boundaries; HTTP/integrations; testing/diagnosis; performance/runtime; and Laravel/framework behavior. Maintain existing topic strings through an alias mapping so filters and references remain usable. Attach only concepts actually assessed; a roadmap keyword in the tag list is not coverage.

**5. Reclassify difficulty using evidence.** Foundation means one principal semantic rule or a short direct trace. Applied means combining two or more relevant facts to diagnose behavior or select a fix. Advanced means resolving interacting constraints, concurrent execution, lifecycle effects, or a subtle counterexample with credible alternatives. Difficulty must not be assigned from option length, obscure names, or the fourth position in a template.

Store a provisional reasoning rationale and expected time. Pilot on the intended audience, then inspect item facility, discrimination, response time, and distractor selection. Treat negative discrimination as a key/ambiguity review trigger. A distractor selected by fewer than roughly 5% of an adequate pilot sample deserves review; this is an initial screening rule, not a universal acceptance law. Do not infer psychometric validity from the current aggregate browser totals. Use opt-in exported attempts or a deliberately approved analytics mechanism if collecting new pilot evidence.

**6. Repair existing content in reviewed batches.** Start with explicit-ID preservation and the exam feedback fix. Then prepare a first batch of at most 25 revisions covering the confirmed reporting/retry errors, representative invalid integrations, missing premises, and negative-stem explanations. Review the complete family affected by each shared lesson, not just the example ID.

Replace automatic four-question expansion with explicitly authored records. A single lesson can have multiple items only when each assesses a distinct objective. Prefer an honest smaller exam-eligible pool over counting four paraphrases as four skills. Remove answer-length padding from approved revisions and write naturally comparable alternatives; preserve old rendered text in the old revision. Do not globally rewrite the helper and silently change hundreds of existing questions. For mixed tracks, avoid unintended modifications to TypeScript, React, MySQL, or analytics questions.

Review the remaining original 300 scenarios and all generated families in batches of 25. For each item record `retain`, `revise`, `exclude from new exams pending review`, or `retire from new selection`; all decisions preserve IDs and old revisions. Do not count this audit's sampled review as approval of unreviewed items.

**7. Validate each candidate through independent gates.** Structural validation requires stable identity, valid references, four distinct plausible options, exactly one key, complete rationale, objective and version metadata. Semantic validation requires an expert to solve the item before seeing the key and explicitly challenge every alternative. The authoring model's agreement with itself is insufficient evidence.

Executable PHP fixtures must lint and run on the stated runtime matrix, with expected stdout, result types, exit status, warnings/deprecations, and exceptions checked. For code-review questions, tests should demonstrate the defect and proposed correction. Laravel examples require a small, version-locked test project used only for validation; use appropriate model/schema/configuration fixtures, not production data. Concurrency assertions need the intended database engine and controlled competing transactions, not SQLite substitutes. Run unknown/generated code without network access, secrets, or writable host mounts, with time/memory limits. Intentionally invalid-code items should explicitly test the expected error.

Duplicate checks should compare normalized stems, code tokens, answer sets, objectives, and scenario structure within the batch and against the complete existing bank. Similarity flags are review candidates, not automatic deletion rules. Also run a code-blind answer-prediction check for recurring wording, length, positivity, absolutes, and title clues. Any rule comparable to the present 250/250 wording shortcut blocks release of that template family.

All candidate-facing text must be independently sufficient. Where multiple files cooperate, provide filenames and complete relevant contents. Where a method body is a fragment, label the containing class/context. Separate shell, Blade, configuration, and PHP. “Assume normal framework configuration” is insufficient when the answer turns on a particular setting.

**8. Generate 600 only after the repaired pilot and blueprint are approved.** Treat this as 600 accepted new engineering reasoning/code-review items, consistent with the requested next expansion. Drafts rejected for quality do not count. Produce 24 accepted batches of 25: one pilot batch, then 23 further batches. Each batch moves through draft → automated validation → independent technical review → adversarial distractor/ambiguity review → staging preview → acceptance. Do not auto-publish generated output.

An initial allocation to review is:

| Engineering focus | New accepted items |
|---|---:|
| PHP semantics, type boundaries, and data transformations | 150 |
| Object design, state, interfaces, and resource lifetimes | 100 |
| Security, input handling, and trust boundaries | 100 |
| Persistence, transactions, concurrency, and idempotency | 100 |
| Laravel lifecycle and framework code review | 100 |
| Testing, diagnosis, performance, and long-lived runtimes | 50 |
| Total | 600 |

Adjust this allocation after identifying gaps in the approved existing pool. A provisional mix of 20% Foundation, 50% Applied, and 30% Advanced is a planning choice, subject to pilot results. Every item must still have a specific objective and a defensible difficulty rationale.

The arithmetic must be reconciled: retaining 300 engineering questions and accepting 600 more yields 900, leaving 100 to reach the engineering target of 1,000. The additional existing Laravel items may fill part of that gap only after classification, deduplication, and approval. The separate 1,000-item knowledge target needs its own accepted inventory and later authorization; this 600-item plan does not silently add another generation programme.

**9. Release with reversible manifests.** Each approved batch should produce a manifest of added IDs, revised IDs and old/new revisions, retained old hashes, objective/difficulty counts, runtime results, review decisions, and duplicate-family changes. Stage as a preview before the GitHub Pages release. Exclude audit-only artifacts and private review material from the published artifact; the current workflow uploads the entire repository directory. Keep the prior bank release and deployment artifact available. Roll back by selecting the prior release manifest, without deleting new records or rewriting completed attempts.

Release acceptance requires zero unresolved wrong-key, ambiguous-key, unintended syntax/runtime, identity, or progress-preservation defects. Tests must show no existing ID reassignment and no loss of legacy totals. Stop a batch when a systemic template fault appears, fix the cause, and revalidate only the affected families plus shared behavior. The next review decision is whether to authorize phases 1–6 as a small remediation effort; authorization to generate or publish the 600 remains a separate checkpoint.
