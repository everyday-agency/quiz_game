const GUIDES = {
  Laravel: [
    {
      topics: /Request lifecycle|Routing|APIs, resources|Sessions, cookies/,
      focus: 'the request boundary and the order in which Laravel resolves, checks, and transforms a request',
      setup: 'A second request reaches the application through another route or with slightly different input.',
      success: 'The rule is applied at the same dependable request boundary before later code relies on it',
      failure: 'that alternate path can still bypass the intended rule or reach business code in the wrong state',
    },
    {
      topics: /Container|Application architecture|Collections/,
      focus: 'the ownership boundary between orchestration, domain behavior, and replaceable dependencies',
      setup: 'A second controller, command, or test needs to perform the same operation with a different dependency.',
      success: 'The behavior remains reusable and the dependency can be replaced without rewriting the caller',
      failure: 'the duplicated or tightly coupled code still behaves differently in another caller',
    },
    {
      topics: /Validation|Authentication|Security & trust/,
      focus: 'the trust boundary: what is known about the input, the actor, and the action being attempted',
      setup: 'An attacker or ordinary user sends well-formed input for a resource they should not be allowed to change.',
      success: 'shape, identity, and permission are checked at the boundary that owns each guarantee',
      failure: 'valid-looking input can still cross the missing authorization or trust check',
    },
    {
      topics: /Migrations|Eloquent|Relationships|Queries|Transactions|Seeders/,
      focus: 'the persistence boundary where data shape, invariants, query count, and concurrent writes become real',
      setup: 'Two requests touch related records while production contains more rows and edge cases than local fixtures.',
      success: 'the database state stays valid and the application performs the intended amount of work',
      failure: 'the same race, invalid relationship, or hidden query cost can still appear under real data',
    },
    {
      topics: /Events|Queues|Cache|Artisan|scheduling|Files, mail|notifications/i,
      focus: 'the side-effect boundary: when work happens, whether it may repeat, and which system owns the durable truth',
      setup: 'A worker retries after a timeout, or the same command is triggered twice while an external service is slow.',
      success: 'retries and delayed execution preserve the intended result without duplicating irreversible effects',
      failure: 'a retry, stale cache entry, or repeated side effect can still produce a different outcome',
    },
    {
      topics: /Testing|Configuration|deployment|Errors|Production performance/i,
      focus: 'the operational boundary where configuration, observability, failure handling, and repeatable verification meet',
      setup: 'The same release runs under production configuration and encounters a failure that did not occur locally.',
      success: 'the behavior can be verified, observed, and recovered without hiding the real failure',
      failure: 'the release can still fail silently, behave differently, or exhaust resources in production',
    },
  ],
  TypeScript: [
    {
      topics: /TSConfig & compilation/i,
      focus: 'which checks and emitted JavaScript a compiler setting controls, versus runtime APIs it cannot install or validate',
      setup: 'The same source is checked in CI, transformed by a build tool, and then executed by a particular runtime.',
      success: 'the team keeps type checking, emitted syntax, module resolution, available libraries, and runtime capabilities as separate explicit contracts',
      failure: 'one stage can still pass while the loader or runtime lacks what another configuration stage assumed',
    },
    {
      topics: /inference|Narrowing|Unions|Nullability|Errors, unknown/i,
      focus: 'what the compiler has actually proved about a value at this exact control-flow point',
      setup: 'A caller supplies another allowed member of the union, or a nullable value follows a less common branch.',
      success: 'unsafe operations are rejected until control flow has established the required fact',
      failure: 'another valid input can still reach code that assumes a property or value that was never proved',
    },
    {
      topics: /Objects|Functions|Generics|Classes|Arrays|Literals|keyof|Mapped|Conditional/i,
      focus: 'the type contract between producers and consumers, including which relationships the type must preserve',
      setup: 'A new caller uses the API with a different but structurally compatible object or generic argument.',
      success: 'the contract preserves the relationship the implementation needs while rejecting invalid combinations',
      failure: 'the type can still admit a combination that the implementation cannot handle safely',
    },
    {
      topics: /Modules|Declaration|Type performance/i,
      focus: 'the project boundary: how modules, compiler settings, declarations, and type complexity agree across packages',
      setup: 'Another package or build target consumes the same code with its own module resolution and compiler context.',
      success: 'all consumers see one accurate contract and the project remains predictable to compile',
      failure: 'another build can still resolve a different shape, hide an error, or become costly to check',
    },
    {
      topics: /Async code|promises/i,
      focus: 'the asynchronous control-flow boundary: completion, rejection, ordering, and ownership of failures',
      setup: 'One promise rejects after another task has started, or two operations complete in the opposite order.',
      success: 'callers can observe completion and failure through an explicit, correctly typed path',
      failure: 'a rejection can still escape, work can finish out of order, or a caller can assume completion too early',
    },
    {
      topics: /Runtime validation|DOM|React|Node & server/i,
      focus: 'the boundary between TypeScript’s compile-time model and values that arrive from the runtime world',
      setup: 'JSON, a DOM lookup, an environment variable, or a component prop arrives with an unexpected runtime value.',
      success: 'the value is checked or safely narrowed before typed code treats it as trustworthy',
      failure: 'the program can still compile while the unexpected runtime value reaches an unsafe operation',
    },
    {
      topics: /Testing|Refactoring/i,
      focus: 'the evolution boundary: whether behavior and public contracts remain safe as callers and implementations change',
      setup: 'A teammate refactors the implementation or adds a new caller that was not represented by the original examples.',
      success: 'tests and types protect both runtime behavior and the intended public API',
      failure: 'the refactor can still compile or pass shallow tests while breaking a real caller',
    },
  ],
  MySQL: [
    {
      topics: /Relational modeling|Data types|NULL|Keys|Normalization|JSON/i,
      focus: 'how facts and invariants are represented so the database can distinguish valid state from invalid state',
      setup: 'A row arrives with a missing value, a duplicate relationship, or a document shape that the happy path did not use.',
      success: 'the representation expresses the fact precisely and enforceable invariants reject invalid state',
      failure: 'ambiguous or invalid data can still be stored and discovered only by later application code',
    },
    {
      topics: /Joins|Aggregation|Subqueries|Query correctness|Pagination/i,
      focus: 'the relational meaning of the result set: which rows exist, how they combine, and whether ordering is deterministic',
      setup: 'The data includes an unmatched row, a NULL, a tie, and more than one related record.',
      success: 'the query returns the same logically correct rows for edge cases as it does for the simple example',
      failure: 'rows can still disappear, duplicate, compare as unknown, or move between pages unexpectedly',
    },
    {
      topics: /Index design|EXPLAIN|Production performance/i,
      focus: 'the access path and its cost as data distribution, selectivity, and concurrency change',
      setup: 'The table grows by one hundred times and one tenant owns far more rows than the others.',
      success: 'the optimizer can reach the needed rows with bounded work that matches the real workload',
      failure: 'the query can still scan, sort, fetch, or maintain far more entries than its small result suggests',
    },
    {
      topics: /Transactions|Isolation|Locking|Concurrency/i,
      focus: 'the concurrency boundary: which invariant must remain true when two sessions act at the same time',
      setup: 'Two database sessions read the same initial state and attempt the operation before either one finishes.',
      success: 'the invariant is protected by an atomic statement, constraint, or deliberate locking boundary',
      failure: 'both sessions can still make a individually reasonable decision that is wrong when combined',
    },
    {
      topics: /Schema migrations|Partitioning|data lifecycle/i,
      focus: 'the evolution boundary: changing or removing large amounts of live data while old and new code overlap',
      setup: 'A deployment runs while older application instances still serve traffic and late data continues to arrive.',
      success: 'the change remains compatible, observable, and recoverable throughout the transition',
      failure: 'one version can still see an incompatible schema or valid late data can be lost',
    },
    {
      topics: /Security & privileges/i,
      focus: 'the security boundary: keeping untrusted values out of SQL structure and limiting what a compromised identity can access',
      setup: 'A user controls one query value while the application account can reach data belonging to many tenants.',
      success: 'values remain data, identifiers come from an allowlist, and the account has only the authority the operation needs',
      failure: 'input can still alter query structure or a compromised account can still reach more data than intended',
    },
    {
      topics: /Backup|Replication/i,
      focus: 'the recovery and freshness boundary: which committed changes exist on each server and which historical points can be restored',
      setup: 'The primary accepts a write just before a failure, while a mistake is also moving through the replication stream.',
      success: 'promotion and recovery use explicit progress coordinates, independent backups, and a tested stopping point',
      failure: 'acknowledged work can still be missing or the same accidental change can still exist on every replica',
    },
    {
      topics: /Connections|configuration/i,
      focus: 'the session and capacity boundary: pooled state, total connection budgets, timeouts, and reproducible server configuration',
      setup: 'Many application instances reconnect together and one reused session still carries state from its previous request.',
      success: 'connection demand remains bounded and every borrower receives the intended clean session contract',
      failure: 'the server can still be overwhelmed or the next request can inherit locks, transactions, or different settings',
    },
    {
      topics: /Observability/i,
      focus: 'the evidence boundary: connecting user-visible latency to statement shape, waits, resource pressure, and workload changes',
      setup: 'Users report a slow tail while aggregate averages still look healthy and one tenant has unusually skewed data.',
      success: 'percentiles, query digests, and wait ownership reveal the actual expensive path without exposing sensitive values',
      failure: 'the incident can still hide inside averages or produce logs that show symptoms without identifying the blocker',
    },
    {
      topics: /Security|Backup|Replication|Connections|configuration|Observability/i,
      focus: 'the operational boundary: authority, freshness, recovery, resource limits, and evidence about production behavior',
      setup: 'A credential is compromised, a replica lags, a process restarts, or the primary becomes unavailable.',
      success: 'the system has an explicit safety and recovery path rather than relying on the healthy steady state',
      failure: 'the incident can still expose data, lose acknowledged work, amplify load, or remain impossible to diagnose',
    },
  ],
};

const FALLBACK_GUIDES = {
  Laravel: {
    focus: 'the Laravel boundary that owns the behavior instead of a nearby but unrelated layer',
    setup: 'The same operation is invoked from another request, command, or background worker.',
    success: 'the framework and application preserve the intended rule on every path',
    failure: 'another execution path can still reproduce the original problem',
  },
  TypeScript: {
    focus: 'the exact guarantee expressed by the type system and the separate behavior of runtime values',
    setup: 'A second caller supplies a legal edge-case value that the first example did not contain.',
    success: 'the compiler and runtime boundary each enforce the guarantee they actually own',
    failure: 'the program can still compile while an unproved assumption reaches runtime',
  },
  MySQL: {
    focus: 'the database mechanism that owns the required correctness, access, or recovery guarantee',
    setup: 'Production data grows and two sessions exercise the edge case concurrently.',
    success: 'the database preserves the intended result under realistic data and timing',
    failure: 'the original correctness or performance problem can still occur',
  },
};

function guideFor(question) {
  return GUIDES[question.track]?.find((guide) => guide.topics.test(question.topic))
    || FALLBACK_GUIDES[question.track];
}

function normalizeSentence(text) {
  const trimmed = text.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function distractorDiagnosis(option, question) {
  const text = option.toLowerCase();
  const topic = question.topic.toLowerCase();

  if (/\b(always|never|every|automatically|impossible|permanently)\b/.test(text)) {
    const absoluteExamples = {
      Laravel: 'A new route or worker can take a path that the assumption did not cover; without an enforced boundary, the next request can still violate the rule.',
      TypeScript: 'A different caller, browser, or runtime value can violate the assumption even though the current example compiles; TypeScript does not make “automatic” runtime behavior appear.',
      MySQL: 'A NULL, skewed row set, or second concurrent session is enough to violate the assumption; the database needs an explicit constraint, access path, or protocol.',
    };
    return {
      reason: 'This relies on an absolute assumption instead of a mechanism that enforces the behavior.',
      example: absoluteExamples[question.track],
    };
  }

  if (/\b(disable|skip|ignore|bypass|remove all|grant all|catch every|global boolean|sleep between)\b/.test(text)) {
    return {
      reason: 'This removes or bypasses a guardrail instead of modeling the required boundary.',
      example: 'The happy path may appear simpler, but the next invalid or concurrent case now has fewer protections and can pass through unnoticed.',
    };
  }

  if (/\b(retry|sleep|wait and try|increase the timeout)\b/.test(text)) {
    return {
      reason: 'Retrying changes timing, not the correctness rule that the scenario needs.',
      example: 'Two workers can retry or wake at the same moment and reproduce the same race or duplicate side effect.',
    };
  }

  if (/\b(cache|buffer pool|more memory|larger hardware|compression|faster server)\b/.test(text) && !/cache|performance|capacity/.test(topic)) {
    return {
      reason: 'This is a performance technique, while the question requires a correctness or ownership guarantee.',
      example: 'The operation might become faster, but it can still return the wrong data, cross the wrong boundary, or repeat the same unsafe action.',
    };
  }

  if (/\b(rename|alphabet|pretty-print|lowercase keyword|column comment|shorter username|color)\b/.test(text)) {
    return {
      reason: 'This changes presentation or naming without changing the system behavior being tested.',
      example: 'After the rename or formatting change, the same request, runtime value, or SQL operation follows exactly the old unsafe path.',
    };
  }

  if (question.track === 'TypeScript' && /\b(type assertion|cast|\bas\s|\bany\b)/.test(text)) {
    return {
      reason: 'A TypeScript assertion or escape hatch changes what the compiler believes; it does not inspect or repair the runtime value.',
      example: 'JSON containing `{ "count": "many" }` can be asserted as `{ count: number }` and still produce incorrect behavior when the code uses `count` numerically.',
    };
  }

  if (question.track === 'Laravel' && /\bvalidation|validated\b/.test(text) && /authorization|security|trust/.test(topic)) {
    return {
      reason: 'Validation proves input shape, not whether this authenticated actor may perform the action.',
      example: 'A perfectly valid project ID can still refer to another customer’s project, so validated input alone must not authorize the update.',
    };
  }

  if (question.track === 'Laravel' && /\btransaction\b/.test(text) && /events|queues|mail|notifications|files/.test(topic)) {
    return {
      reason: 'A database transaction coordinates database changes; it cannot atomically control an external side effect.',
      example: 'The database can roll back while an email, uploaded file, or remote API call has already happened and cannot be rolled back with it.',
    };
  }

  if (question.track === 'MySQL' && /\bindex|primary key\b/.test(text) && !/index|explain|performance|keys/.test(topic)) {
    return {
      reason: 'An index is primarily an access path; it does not automatically express the business invariant or recovery behavior in this question.',
      example: 'A lookup may become faster while two sessions can still write an invalid combination or a stale replica can still return old data.',
    };
  }

  if (question.track === 'MySQL' && /\breplica|replication\b/.test(text) && /backup|recovery/.test(topic)) {
    return {
      reason: 'Replication copies the live change stream, including mistakes; it is not an independent historical recovery point.',
      example: 'An accidental DELETE can reach the replica seconds later, leaving both servers without the rows that a retained backup could restore.',
    };
  }

  return {
    reason: 'This describes a different mechanism or an effect the tool does not guarantee in this situation.',
    example: null,
  };
}

export function buildLearningNotes(question, orderedOptions = question.options) {
  const guide = guideFor(question);
  const options = orderedOptions.map((option) => typeof option === 'string' ? option : option.text);
  const correct = question.options[question.answer];

  const alternatives = options.flatMap((option, index) => {
    if (option === correct) return [];
    const diagnosis = distractorDiagnosis(option, question);
    const fallbackExample = `${guide.setup} If the team instead chooses “${option}”, ${guide.failure}; the original symptom remains possible.`;
    return [{
      number: index + 1,
      option,
      reason: `${diagnosis.reason} The decisive issue here is ${guide.focus}. It does not establish “${correct}”.`,
      example: diagnosis.example || fallbackExample,
    }];
  });

  return {
    correct,
    whyCorrect: normalizeSentence(question.explanation),
    correctExample: `${guide.setup} The team applies “${correct}”. ${normalizeSentence(capitalize(guide.success))}`,
    alternatives,
  };
}
