# Under the Hood — Engineering Thinking Quiz

A dependency-free browser quiz with exactly 900 scenario-based questions: 300 Laravel, 300 TypeScript, and 300 MySQL. It focuses on architecture, behavior, tradeoffs, data integrity, type-system design, concurrency, security, testing, and production reasoning—not historical facts, syntax recall, or simple name trivia.

## Run it

From this directory:

```bash
python3 -m http.server 8080
```

Then open <http://127.0.0.1:8080>.

On macOS, you can also double-click `start.command` and open the address it prints.

No package installation, database, build step, or internet connection is required.

## What is included

- 900 questions across three learning tracks and 75 domains
- Exactly 300 questions and 25 domains per track
- Four options and one correct answer per question
- Learning mode with immediate explanations
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

Useful official references include the [Laravel documentation](https://laravel.com/docs/13.x), [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [TSConfig reference](https://www.typescriptlang.org/tsconfig/), and [MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/).

## Integrity check

Run:

```bash
node tests.mjs
```

This validates the exact total and per-track counts, IDs, option counts, answer indexes, domain coverage, difficulty coverage, and duplicate prompts.
