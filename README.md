# Under the Hood — PHP Engineer & Laravel Specialist

A static examination app with exactly **1,220 active questions**:

- **PHP Engineer:** 620 questions (`PHP-E26-0001`–`0600` and 20 retained `PHP-PILOT` records).
- **Laravel Specialist (Beta):** 600 questions (`LAR-S26-0001`–`0600`), targeting Laravel 13 and validated against 13.40.0.

PHP is the default. The subject selector uses the same Learn, Exam and question-bank interface for both subjects. Exam correctness appears only after submission. Stable answer identities survive shuffling. Laravel's Beta release is user-authorized after two independent editorial samples; this does not constitute full-bank certification or measured difficulty calibration.

## Run locally

```sh
node tools/build-site.mjs
python3 -m http.server 8080 --directory _site
```

Open <http://127.0.0.1:8080/>. Laravel can also be selected with `?subject=laravel`. The website needs no backend, database, Composer installation or PHP runtime. Advanced questions remain opt-in in session setup; all questions are browsable.

## Progress and archives

Completed PHP totals still use `underTheHoodPhpEngineerV1Stats`, with no migration or reset. Laravel Beta uses `underTheHoodLaravelSpecialistBetaV1Stats`. Historical main, Laravel, pilot and isolated review keys remain untouched. Switching subjects and reloading never merges those totals. Storage holds completed aggregate results; unfinished sessions are not persisted.

All discontinued banks, including the legacy Laravel 600 and original PHP 300, remain inactive. Recovery sources include [the outgoing archive](release/archive/pre-php-only/manifest.json), [original PHP archive](php-expansion/archive/original-php-300.json), [pre-Beta snapshot](release/laravel-beta/archive/pre-beta), and [Beta manifest](release/laravel-beta/manifest.json). The original [PHP manifest](release/manifest.json) still fixes its unchanged 620 records.

The deployable artifact contains **15 explicitly allowed files**. Archives, authoring data, PHP fixtures, Composer dependencies, internal reports and credentials are excluded. `release.json` identifies the deployed commit, counts and bank hash.

## Validation

```sh
node tests.mjs
node tools/build-site.mjs
node tests/release-artifact.mjs
node tests/laravel-specialist/integration.mjs
node tests/laravel-specialist/acceptance.mjs
composer install --working-dir=laravel-specialist/validation/harness --no-interaction --prefer-dist --no-scripts
for batch in 1 2 3 4 5 6; do
  BATCH="$batch" node tests/php-expansion/runtime.mjs
  BATCH="$batch" node tests/laravel-specialist/runtime.mjs
  BATCH="$batch" node tools/laravel-specialist-check.mjs
done
node tests/laravel-specialist/focused-technical.mjs
node tests/laravel-specialist/focused-editorial.mjs
QUIZ_SITE_DIR=_site node tests/browser.mjs
QUIZ_SITE_DIR=_site node tests/php-pilot/browser.mjs
QUIZ_SITE_DIR=_site node tests/code-viewer/browser.mjs
QUIZ_SITE_DIR=_site node tests/php-expansion/browser.mjs
QUIZ_SITE_DIR=_site node tests/laravel-specialist/browser.mjs
```

Local defaults use the available PHP 8.4/8.5 binaries. Set `PHP_BINARIES` to an OS-path-delimited list of absolute binary paths when needed. The matrix CI runs one version per job and sets `REQUIRED_PHP_VERSIONS` accordingly.

PHP snippets execute only in temporary isolated fixtures with network functions disabled. The pinned development harness is never shipped. Laravel has 556 runtime fixtures and 44 documented-contract questions per PHP version; contract checks do not imply real Redis, broker, Nginx, cloud or concurrent production testing.

Both complete-bank Chrome suites use temporary profiles, desktop and mobile viewports, shuffled Learn answers, neutral Exam submission, code copying, scrolling, explanations and missed-question review. The Laravel suite also seeds existing PHP/legacy/review totals and verifies switching/reload isolation. Historical tests retain their frozen snapshots; current integration tests enforce the authorized Beta changes.

## Release

The existing [Pages workflow](.github/workflows/deploy-pages.yml) validates both PHP versions before deploying `main`. See [Beta authorization](release/laravel-beta/AUTHORIZATION.txt) and [release report](release/laravel-beta/REPORT.md). No build command generates questions.

The previous public release commit is `7c166faa7f3dbc374a7ea49731568a72ec371d61`. If rollback is needed, restore that release through the deployment workflow after review; keep browser storage untouched. PHP uses the same key in both releases, and an older PHP-only release simply leaves Beta totals unused. Future question changes must preserve IDs, archive previous revisions and refresh validation evidence.
