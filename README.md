# Under the Hood — Engineering Thinking Quiz

A dependency-free browser quiz with exactly 2,500 scenario-based questions across Laravel, PHP, TypeScript, React, MySQL, and Google Analytics. It focuses on executable behavior, code reading, APIs, architecture, data integrity, state and lifecycle reasoning, measurement design, security, testing, and production tradeoffs—not historical facts or simple name trivia.

## Run it

From this directory:

```bash
python3 -m http.server 8080
```

Then open <http://127.0.0.1:8080>.

On macOS, you can also double-click `start.command` and open the address it prints.

No package installation, database, build step, or internet connection is required.

## What is included

- 2,500 questions across six learning tracks and 150 track-specific domains
- 600 Laravel, 600 TypeScript, 400 MySQL, and 300 each for PHP, React, and Google Analytics
- 1,300 code-reading questions across Laravel, PHP, TypeScript, React, and MySQL
- Exactly 200 direct roadmap questions in each of Laravel, TypeScript, PHP, and React
- Four options and one correct answer per question
- Learning mode with immediate explanations
- A concrete walkthrough for every correct answer
- A reason and counterexample for all 7,500 wrong choices
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
- PHP: syntax, types, arrays, functions, HTTP and forms, security, PDO, object-oriented design, Composer, testing, APIs, performance, and server runtimes
- TypeScript 6: inference, narrowing, structural typing, generics, modules, async behavior, runtime trust boundaries, TSConfig, declarations, testing, and maintainable type design
- React: components, JSX, state, effects, hooks, routing, state management, data fetching, testing, frameworks, forms, accessibility, Suspense, animation, and React Native
- MySQL 8.4 LTS: relational modeling, indexes, optimizer reasoning, transactions, MVCC, locking, migrations, query semantics, security, recovery, replication, observability, and capacity
- Google Analytics 4: collection, streams, events, dimensions and metrics, reporting scope, acquisition, explorations, audiences, attribution, consent, product links, APIs, BigQuery, and Analytics 360 governance

Useful official references include the [Laravel documentation](https://laravel.com/docs/13.x), [PHP manual](https://www.php.net/manual/en/langref.php), [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [TSConfig reference](https://www.typescriptlang.org/tsconfig/), [React documentation](https://react.dev/learn), [MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/), [Google Analytics Help](https://support.google.com/analytics/), and [Google Analytics developer documentation](https://developers.google.com/analytics).

## Integrity check

Run:

```bash
node tests.mjs
```

This validates the exact total and per-track counts, IDs, option counts, answer indexes, domain coverage, difficulty coverage, duplicate prompts, correct-answer examples, and complete wrong-answer teaching notes.
