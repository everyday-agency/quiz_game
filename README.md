# Under the Hood — Engineering Thinking Quiz

A dependency-free browser quiz with exactly 1,500 scenario-based questions: 400 each for Laravel, TypeScript, and MySQL, plus 300 for Google Analytics. It focuses on architecture, behavior, code reading, APIs, tradeoffs, data integrity, type-system design, measurement design, attribution, privacy, security, testing, and production reasoning—not historical facts or simple name trivia.

## Run it

From this directory:

```bash
python3 -m http.server 8080
```

Then open <http://127.0.0.1:8080>.

On macOS, you can also double-click `start.command` and open the address it prints.

No package installation, database, build step, or internet connection is required.

## What is included

- 1,500 questions across four learning tracks and 100 domains
- 400 Laravel, 400 TypeScript, 400 MySQL, and 300 Google Analytics questions
- Exactly 100 code-reading questions in each programming/database track
- Four options and one correct answer per question
- Learning mode with immediate explanations
- A concrete walkthrough for every correct answer
- A reason and counterexample for all 3,600 wrong choices
- Exam mode with feedback at the end
- Mixed-track or single-track practice sessions
- Randomized questions and answer order
- Configurable session length, domains, and difficulty
- Track-aware domain breakdown and missed-question review
- Searchable question bank with track, domain, and difficulty filters
- Local progress saved in the browser
- Keyboard and mobile support

## Curriculum target

The curriculum follows modern, stable concepts from:

- Laravel 13: request lifecycle, service container, validation, authorization, Eloquent, transactions, queues, testing, deployment, and production operations
- TypeScript 6: inference, narrowing, structural typing, generics, modules, async behavior, runtime trust boundaries, TSConfig, declarations, testing, and maintainable type design
- MySQL 8.4 LTS: relational modeling, indexes, optimizer reasoning, transactions, MVCC, locking, migrations, query semantics, security, recovery, replication, observability, and capacity
- Google Analytics 4: collection, streams, events, dimensions and metrics, reporting scope, acquisition, explorations, audiences, attribution, consent, product links, APIs, BigQuery, and Analytics 360 governance

Useful official references include the [Laravel documentation](https://laravel.com/docs/13.x), [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [TSConfig reference](https://www.typescriptlang.org/tsconfig/), [MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/), [Google Analytics Help](https://support.google.com/analytics/), and [Google Analytics developer documentation](https://developers.google.com/analytics).

## Integrity check

Run:

```bash
node tests.mjs
```

This validates the exact total and per-track counts, IDs, option counts, answer indexes, domain coverage, difficulty coverage, duplicate prompts, correct-answer examples, and complete wrong-answer teaching notes.
