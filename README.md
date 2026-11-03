# Under the Hood — Engineering Thinking Quiz

A static, dependency-free browser quiz for GitHub Pages. The bank contains 2,500 existing questions: 600 Laravel, 600 TypeScript, 400 MySQL, and 300 each for PHP, React and Google Analytics. There is no Laravel application, database or server-side grading.

The remediation branch preserves all existing IDs and original records, repairs verified defects, and contains a 20-question editorial pilot. The full bank is **not** certified for factual or assessment quality. See [the remediation report](remediation/REPORT.md), [all 20 before/after reviews](remediation/PILOT_REVIEW.md), and [the original audit](audit/REPORT.md).

## Run locally

```sh
python3 -m http.server 8080
```

Open <http://127.0.0.1:8080>. `start.command` provides the same local workflow on macOS. Running the quiz requires no PHP runtime, package installation or network connection.

Learn mode reveals the answer and explanations after each check. Exam mode keeps only neutral answered-count progress until the final **Submit exam** action. All answer keys remain public in this static learning application; this is not an authoritative, tamper-resistant assessment service.

Local storage contains aggregate totals only. Both `underTheHoodStats` and the historical `laravelQuizStats` key remain readable. Completed sessions update the current key without rewriting the old key. Unfinished sessions are kept in memory and are lost on refresh. There is no historical per-question attempt data to migrate or regrade.

## Question identity and editing

- `js/bank/legacy-v1.mjs` is the immutable original materialized bank, with explicit existing IDs. Do not edit it.
- `remediation/baseline/manifest.json` records every original record hash; the compressed notes archive preserves the original generated teaching notes.
- `js/bank/revisions.mjs` selects explicit revisions by ID. The assembler rejects missing IDs, duplicate IDs, duplicate revisions and unknown revision targets. Question identity never depends on array position.
- Revisions use the existing ID and a separate revision number. Options have IDs scoped to that revision. Grading follows option identity after display shuffling.
- `php-repairs.mjs`, `laravel-corrections.mjs` and `laravel-companions.mjs` contain correctness repairs. `pilot.mjs` contains exactly 20 editorial revisions, with objectives, version assumptions, difficulty reasoning and per-option explanations.
- Earlier top-level authoring/generator modules are retained as historical source; `js/questions.mjs` no longer imports them. Editing them does not edit the active bank.

For a later approved change, retain the current revision in an archive before replacing it. Do not reuse IDs, rewrite the original baseline hashes, or silently edit a released revision. Add a reviewed change manifest and validation evidence. Existing aggregate scores must remain historical totals.

Use named `code.files` for multiple files. `php-file` denotes a complete source file; `php-fragment` and `laravel-fragment` require explicit surrounding assumptions. Revised options are unpadded; do not restore the old answer-length equalizer. The old equal-length checks now apply only to the preserved original archive, not to newly reviewed content.

## Verification

Node 22+, PHP 8.4/8.5 CLI, and Chrome are development/test requirements only.

```sh
node tests.mjs
node tools/build-site.mjs
QUIZ_SITE_DIR=_site node tests/browser.mjs
```

`PHP_BIN` selects a PHP executable; `PHP_BINARIES` accepts a path-delimited runtime list. By default the tests use PATH PHP and, if present, the local MAMP PHP 8.4.17 binary. `CHROME_BIN` overrides Chrome discovery. Set `WRITE_TEST_REPORT=1` when running the automated suite to refresh `remediation/php-results.json`.

The automated suite verifies archive hashes, all 2,500 identities, insertion/reordering invariance, shuffled grading and explanations, revision scope and pilot structure. PHP checks lint all current PHP question code and revised Laravel fragments, execute only 12 reviewed hash-allowlisted PHP fixtures, and probe pinned Laravel 13.0.0 methods with controlled doubles. The snippets have no application data or external service access. These contract probes are not a full Laravel integration suite. See [fixture provenance and boundaries](tests/fixtures/README.md).

The Chrome workflow drives real mouse/keyboard controls in an isolated profile and local origin. It covers exam submission, scoring after shuffle, legacy/current storage, Learn feedback, mode switching, all pilot renderings, named files and a mobile viewport. It writes a result JSON and screenshots under `remediation/`; it does not use or modify the user's normal browser profile.

## Build and release

`node tools/build-site.mjs` prepares `_site/` from the static runtime files only. Audit reports, tests, PHP fixtures, screenshots and development tools are excluded. This command does not publish anything.

The remediation/PR workflow validates PHP 8.4 and 8.5 and runs Chrome against the prepared artifact. The existing Pages workflow is gated on those checks and uploads `_site`, rather than the entire repository. No deployment has been run as part of remediation. Review and approval are required before merging this pilot or expanding the question bank.
