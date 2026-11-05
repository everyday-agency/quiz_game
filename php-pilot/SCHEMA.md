# PHP question schema proposal

The PHP pilot uses schema version 1 for authored questions and a small PHP-only adapter for the existing quiz renderer. The main 2,500-question bank keeps its current representation. No other technology has been migrated or given an adapter.

The executable contract is [schema.mjs](../js/php-pilot/schema.mjs); the 20 authored records are in [questions.mjs](../js/php-pilot/questions.mjs). [questions.json](questions.json) is a review export of those same records. Question data contains no executable JavaScript callbacks. PHP source is displayed as text in the browser.

## Fields

| Field | Contract and purpose |
|---|---|
| `schemaVersion` | `1`; permits an explicit future authoring-format migration. |
| `id` | Explicit immutable question identity. This isolated collection reserves `PHP-PILOT-001` through `PHP-PILOT-020`; IDs never derive from position. |
| `revision` | Positive integer, separate from identity. Preserve an accepted revision before publishing a replacement. These new candidate records start at 1. |
| `technology` | `php` only. The field leaves room for a future proposal; the current validator rejects other technologies. |
| `collectionId`, `status` | `php-pilot-v1`, `pilot`; distinguish this reviewed experiment from the existing collection and from future approved content. Status does not claim independent approval. |
| `format` | `execution`, `debugging`, `code-review`, `implementation`, `testing`, or `architecture`. Describes the cognitive task, not the rendering widget. |
| `responseType` | `single-choice` for this pilot; exactly four options and one keyed option. No multi-answer or free-text grading has been implemented. |
| `topic` | The primary PHP domain used by filters. |
| `objective.id`, `objective.text` | A named observable skill and a precise statement of what the learner must determine. This pilot requires a distinct primary objective for each item. |
| `difficulty.level` | Foundation, Applied, or Advanced, matching the existing UI vocabulary. |
| `difficulty.audience`, `difficulty.rationale` | Junior/intermediate/advanced audience plus reasoning for the classification. The pilot contains junior and intermediate items only. |
| `prerequisites` | Explicit concepts needed to solve the item; an unfamiliar feature must not be hidden in an otherwise introductory question. |
| `runtime.php` | Tested minor versions, currently `8.4` and `8.5`; actual patch results live in the evidence file. |
| `runtime.sapi`, `extensions`, `errorPolicy` | CLI or an explicitly described CLI model, any required extension, and diagnostic assumptions. HTTP policy examples here are pure helpers, not web-server integration tests. |
| `context.assumptions` | Relevant initial values, collaborator contracts, I/O success conditions, resource ownership, and exclusions that can change the answer. |
| `context.files[]` | Named source units with `path`, `kind`, and `source`. `complete-file` includes the PHP opening tag; `fragment` requires a `scope` describing its containing context. Files are never joined by blindly concatenating opening tags. |
| `stem` | A concrete question or decision tied to the supplied requirements or code. |
| `options[]` | Four records with explicit, stable `id`, learner-facing `text`, `rationale`, and `misconception`. The key has `misconception: null`; each distractor names a realistic mistaken rule. |
| `correctOptionId` | References one of the option IDs. Correctness never depends on the source or displayed position of the option. |
| `explanation.summary`, `explanation.trace` | The decisive rule and its application to actual values, state or control flow. Every option separately explains why it works or fails. |
| `validation.fixtureId`, `validation.kind` | A link to an independently stated executable oracle: observed output, candidate patches, or test cases. Expected outcomes and executable wrappers are development fixtures outside the published site. |
| `references[]` | Precise primary-source links, supplemented by executable evidence. |

## Example identity and option contract

This excerpt is from PHP-PILOT-005. Its full record includes the complete helper, all four options and their rationales.

```json
{
  "schemaVersion": 1,
  "id": "PHP-PILOT-005",
  "revision": 1,
  "technology": "php",
  "collectionId": "php-pilot-v1",
  "status": "pilot",
  "format": "implementation",
  "responseType": "single-choice",
  "correctOptionId": "false-sentinel",
  "options": [
    {"id": "truthiness", "text": "!$quantity"},
    {"id": "null-sentinel", "text": "$quantity === null"},
    {"id": "false-sentinel", "text": "$quantity === false"},
    {"id": "not-set", "text": "!isset($quantity)"}
  ]
}
```

The option can move anywhere in either authoring or display order while retaining identity `PHP-PILOT-005@1:false-sentinel`. Tests exercise all 24 display permutations for every pilot question and separately reverse the authored options.

## Code and fixture boundaries

There are 21 complete source files and one explicitly labelled class-body fragment across the collection. PHP-PILOT-003 has two cooperating files. PHP-PILOT-015 has a complete trait file and a class-body fragment; its fixture supplies the stated concrete `Sender` wrapper and invokes `message()`.

Marked repair/implementation locations are valid question templates or deliberately incomplete code, not claims that the unmodified example already satisfies its requirements. Tests insert each of the four displayed alternatives. Intentional failures, including incompatible method signatures, are checked as expected errors. A successful syntax check alone never establishes the key.

The runtime receives only the adapted display fields needed by the existing application. The authoring schema, explicit option IDs and metadata remain the review source. `gradeSession` and the existing teaching-note renderer are reused without changes. No framework, database, PHP interpreter or server execution is needed to serve the quiz.

## Preservation and future evolution

The default bank still imports exactly the previous 2,500 materialized records/revisions. The pilot is loaded through `?collection=php-pilot-v1` and is not appended to that bank. [baseline.json](baseline.json) captures every pre-task record and teaching-note hash, plus the existing bank/grading-module hashes.

Pilot totals use `underTheHoodPhpPilotV1Stats`. Existing `underTheHoodStats` and `laravelQuizStats` remain unchanged. There was no per-question saved attempt history before this pilot; this change preserves that aggregate-only behavior and does not invent historical attempts. In-memory attempts record the question/revision and selected option identity through the existing exam code.

A future migration of the original 300 PHP questions should accept their existing `PQ-*` identities through an explicit registry, preserve accepted revision snapshots, and add the proposed metadata without renumbering. Future technology adapters, multiple-response grading, persistent attempt snapshots and publication approval records require separate changes. They are not implemented by this experiment.
