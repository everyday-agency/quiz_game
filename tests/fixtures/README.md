# Reviewed validation fixtures

The production app remains static JavaScript. PHP is used only by the local/CI validation tools.

`execution-allowlist.json` identifies exactly 12 reviewed pilot programs by stable ID, SHA-256 of their named files, keyed option and expected output/diagnostic. `php.test.mjs` refuses to execute them if those hashes change. A fixture change requires technical review and a deliberate allowlist update. All other bank snippets are linted, not executed. External calls, database queries, upload operations and application jobs are never run.

Each PHP pilot runs with a fresh temporary directory, empty environment, `php -n`, 32 MB memory, PHP and host timeouts, disabled command/network functions, disabled URL wrappers and an `open_basedir` limited to that fixture. PHP 8.4/8.5 regex JIT is disabled to support restricted execution environments. These are defense-in-depth controls for reviewed examples, not a general-purpose sandbox for arbitrary hostile PHP. Do not extend the allowlist to unknown code without a separate isolated execution environment and review.

`laravel-13.0.0/methods.json` contains 27 methods extracted from the upstream v13.0.0 tag. The extraction preserves method bodies and makes their visibility public so the test harness can invoke them. `manifest.json` records the source URLs, complete upstream-file hashes, and the extracted-method artifact hash. The upstream MIT license is retained. `extract-methods.php` is the maintenance extractor; normal tests do not download anything or execute it.

The harness executes the actual reporting, queue retry/backoff, validation lifecycle/data retrieval, attribute comparison, route URL generation, and overlap-lock methods. Collaborators are deliberately controlled doubles:

- Logger/context and exception handler collaborators are in memory.
- Queue jobs expose a fixed queued deadline and attempt count; the worker does not contact a queue backend.
- Validation rules are supplied, but their success is a controlled premise. The fixture tests when input is captured and which data `validated()` returns, not Laravel's email-rule implementation.
- The model save double acknowledges a successful save and synchronizes attributes. It does not execute Eloquent SQL or observers. Name comparisons and dirty/change checks use upstream methods.
- The router receives the declared route/origin; route registration collaborators are controlled.
- The overlap-lock fixture uses a simulated clock and in-memory cache, rather than proving distributed cache behavior.

This provides narrower evidence than a full framework integration suite. Future database, middleware, routing-registration, distributed locking, or third-party package questions need corresponding isolated integration fixtures. Never infer those guarantees from a successful lint or this harness.

Primary references are the pinned URLs in [the manifest](laravel-13.0.0/manifest.json), the [Laravel 13 documentation](https://laravel.com/docs/13.x), [PHP strict scalar typing](https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict), [CSV parsing](https://www.php.net/manual/en/function.fgetcsv.php), and [PSR-7 stream semantics](https://www.php-fig.org/psr/psr-7/#13-streams).
