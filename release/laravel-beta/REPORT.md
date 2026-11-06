# Laravel Specialist Beta release

Local pre-deployment validation completed on 6 November 2026. Authorized destination: [the existing GitHub Pages quiz](https://everyday-agency.github.io/quiz_game/). GitHub validation and deployment results will be recorded below after the workflow finishes.

Exactly **1,220 active questions**: **PHP Engineer — 620**, **Laravel Specialist (Beta) — 600**. PHP remains the default. No archived subject is active, and no question was generated.

**Final correction:** LAR-S26-0437 revision **2 → 3**. Student-visible prerequisite is now “HTTP transport failures; HTTP response status handling.” Its stable ID, learning objective, answer, options and explanations are unchanged. The [previous record](../../laravel-specialist/archive/revisions/LAR-S26-0437-r2.json) is archived. Its fixture prints `connection` on PHP **8.4.17** and **8.5.2**, using Laravel **13.40.0**. The [correction record](evidence/0437-correction.json) and batch-5 technical evidence document the change. The other **599 Laravel records** and every PHP record are unchanged from the pre-Beta baseline.

**Application changes:** one subject selector serves the existing Learn, Exam and question-bank screens. Code highlighting, exact sources, rationales, answer randomization, grading and missed-question review use the existing implementations. Laravel has no extra review filters or separate interface. Its progress key is `underTheHoodLaravelSpecialistBetaV1Stats`; PHP retains `underTheHoodPhpEngineerV1Stats`. Historical Laravel and isolated review keys are neither read into Beta totals nor migrated, overwritten or merged.

**Validation passed locally:**

- Existing `node tests.mjs` regressions; full six-batch PHP runtime validation on both versions.
- All six Laravel batches on both versions: **556 runtime fixtures + 44 documented contracts per version**, with fresh source/harness/lock hashes. All six schema/identity/layout checks and the supplementary outbox test passed.
- Current integration: **29,280 answer permutations**, **87,840 distractor mappings**, 1,220 unique stable IDs, exact PHP preservation, exactly one prerequisite-only Laravel revision, and separate progress keys. [Evidence](evidence/integration.json).
- Historical focused correction/archive checks and repeated-acceptance guards passed.
- Five actual Chrome suites: **39 workflow checks**, no JavaScript exceptions. All 620 PHP and 600 Laravel questions rendered on desktop and 390px mobile; **3,660 distractor explanations** matched their options. Learn, neutral-until-submission Exam, copy, touch scrolling, source injection protection, missed review, storage/reload and subject switching passed. See [Laravel browser evidence](evidence/browser-laravel/browser-results.json) and [PHP browser evidence](evidence/browser-php/browser-results.json).
- The static build contains exactly **15 allowed runtime files**. No archives, reports, authoring sources, Composer dependencies, PHP fixtures or development configuration are included. Duplicate/retired IDs and private-key/token patterns were checked.
- Obsolete PHP-only tests now assert the authorized two-subject composition while retaining exact PHP content hashes. Blade/configuration files retain exact-text checks without incorrectly requiring PHP syntax tokens. Linux CI loads only required trusted PHP extensions while retaining `-n` and snippet isolation.

[Desktop screenshot](evidence/browser-laravel/review-home-desktop.png) · [Mobile screenshot](evidence/browser-laravel/review-home-mobile.png) · [Frozen release manifest](manifest.json)

**Release scope and limits:** the user approved Beta publication after two independent editorial samples; no new full editorial audit or full-bank independent certification is claimed. Documented-contract checks do not simulate real broker, Redis, Nginx or cloud infrastructure. Difficulty and distractor performance have not been calibrated against learner data. Progress remains browser-local aggregate history, as before.

**Deployment:** pending the existing GitHub Actions validation and Pages workflow. The previous public commit is `7c166faa7f3dbc374a7ea49731568a72ec371d61`. Rollback should restore that release through the workflow without clearing browser storage: PHP keeps its existing key, and Beta totals can remain stored but unused.
