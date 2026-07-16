const GUIDES = {
  Laravel: [
    {
      topics: /APIs, resources & Inertia/,
      focus: 'the query-and-serialization boundary: selecting the data up front without letting a resource trigger hidden database work',
      setup: 'An endpoint serializes one hundred projects, and each project may have several related materials.',
      success: 'the query loads the required relation deliberately and the resource includes it only when that data is already available',
      failure: 'each serialized item can still lazy-load its relation and turn one endpoint into hundreds of queries',
      code: {
        language: 'php',
        title: 'Load data deliberately, then serialize it',
        snippet: `$projects = Project::query()
    ->with('materials')
    ->get();

return ProjectResource::collection($projects);

// Inside ProjectResource::toArray():
'materials' => MaterialResource::collection(
    $this->whenLoaded('materials')
),`,
      },
    },
    {
      topics: /Request lifecycle|Routing|Sessions, cookies/,
      focus: 'the request boundary and the order in which Laravel resolves, checks, and transforms a request',
      setup: 'A second request reaches the application through another route or with slightly different input.',
      success: 'The rule is applied at the same dependable request boundary before later code relies on it',
      failure: 'that alternate path can still bypass the intended rule or reach business code in the wrong state',
      code: {
        language: 'php',
        title: 'Put a request-wide rule at the request boundary',
        snippet: `final class EnsureAccountIsActive
{
    public function handle(Request $request, Closure $next)
    {
        abort_if($request->user()->account->suspended, 403);

        return $next($request);
    }
}

Route::middleware(['auth', EnsureAccountIsActive::class])
    ->group(fn () => Route::resource('projects', ProjectController::class));`,
      },
    },
    {
      topics: /Container|Application architecture|Collections/,
      focus: 'the ownership boundary between orchestration, domain behavior, and replaceable dependencies',
      setup: 'A second controller, command, or test needs to perform the same operation with a different dependency.',
      success: 'The behavior remains reusable and the dependency can be replaced without rewriting the caller',
      failure: 'the duplicated or tightly coupled code still behaves differently in another caller',
      code: {
        language: 'php',
        title: 'Depend on a contract and inject the implementation',
        snippet: `$this->app->bind(
    PaymentGateway::class,
    StripeGateway::class,
);

final class Checkout
{
    public function __construct(
        private PaymentGateway $gateway,
    ) {}
}`,
      },
    },
    {
      topics: /Validation & input/,
      focus: 'the input boundary: turning an untrusted payload into a deliberately shaped value before domain behavior uses it',
      setup: 'A client sends a nested payload with one missing field, an extra administrative field, and a value in the wrong format.',
      success: 'only the validated and normalized shape reaches the operation, while invalid combinations return useful errors',
      failure: 'unexpected fields or malformed values can still reach assignment and business logic',
      code: {
        language: 'php',
        title: 'Use the validated shape, not the whole request',
        snippet: `$data = $request->validate([
    'name' => ['required', 'string', 'max:120'],
    'budget' => ['required', 'numeric', 'min:0'],
]);

// admin is ignored because it was not validated.
$project = Project::create($data);`,
      },
    },
    {
      topics: /Authentication|Security & trust/,
      focus: 'the trust boundary: what is known about the input, the actor, and the action being attempted',
      setup: 'An attacker or ordinary user sends well-formed input for a resource they should not be allowed to change.',
      success: 'shape, identity, and permission are checked at the boundary that owns each guarantee',
      failure: 'valid-looking input can still cross the missing authorization or trust check',
      code: {
        language: 'php',
        title: 'Validation and authorization answer different questions',
        snippet: `public function update(UpdateProjectRequest $request, Project $project)
{
    // May this user update this project?
    $this->authorize('update', $project);

    // Does the input have the expected shape?
    $project->update($request->validated());
}`,
      },
    },
    {
      topics: /Migrations|Eloquent|Relationships|Queries|Transactions|Seeders/,
      focus: 'the persistence boundary where data shape, invariants, query count, and concurrent writes become real',
      setup: 'Two requests touch related records while production contains more rows and edge cases than local fixtures.',
      success: 'the database state stays valid and the application performs the intended amount of work',
      failure: 'the same race, invalid relationship, or hidden query cost can still appear under real data',
      code: {
        language: 'php',
        title: 'Protect a read-then-write decision inside one transaction',
        snippet: `DB::transaction(function () use ($seatId) {
    $seat = Seat::query()
        ->whereKey($seatId)
        ->lockForUpdate()
        ->firstOrFail();

    throw_if($seat->reserved, SeatAlreadyReserved::class);

    $seat->update(['reserved' => true]);
});`,
      },
    },
    {
      topics: /Cache & rate limiting/i,
      focus: 'the derived-state boundary: cache identity, freshness, atomic updates, and the real subject being throttled',
      setup: 'Two tenants request the same record ID while several workers refresh an expired cache key at once.',
      success: 'keys include the full security context and concurrent refresh or rate decisions use an atomic shared mechanism',
      failure: 'one tenant can still receive another tenant’s cached value or a burst can bypass or overload the limiter',
      code: {
        language: 'php',
        title: 'Include the tenant and coordinate refreshes',
        snippet: `$key = "tenant:{$tenantId}:project:{$projectId}";

return Cache::lock("refresh:{$key}", 10)->block(
    3,
    fn () => Cache::remember($key, 300, $loadProject),
);`,
      },
    },
    {
      topics: /Events|Queues|Artisan|scheduling|Files, mail|notifications/i,
      focus: 'the side-effect boundary: when work happens, whether it may repeat, and which system owns the durable truth',
      setup: 'A worker retries after a timeout, or the same command is triggered twice while an external service is slow.',
      success: 'retries and delayed execution preserve the intended result without duplicating irreversible effects',
      failure: 'a retry, stale cache entry, or repeated side effect can still produce a different outcome',
      code: {
        language: 'php',
        title: 'Dispatch after commit and make retryable work idempotent',
        snippet: `DB::transaction(function () use ($order) {
    $order->markPaid();

    SendReceipt::dispatch($order->id)->afterCommit();
});

final class SendReceipt implements ShouldQueue, ShouldBeUnique
{
    public function uniqueId(): string { return (string) $this->orderId; }
}`,
      },
    },
    {
      topics: /Testing|Configuration|deployment|Errors|Production performance/i,
      focus: 'the operational boundary where configuration, observability, failure handling, and repeatable verification meet',
      setup: 'The same release runs under production configuration and encounters a failure that did not occur locally.',
      success: 'the behavior can be verified, observed, and recovered without hiding the real failure',
      failure: 'the release can still fail silently, behave differently, or exhaust resources in production',
      code: {
        language: 'php',
        title: 'Make the behavior observable and test its contract',
        snippet: `Log::error('Invoice generation failed', [
    'invoice_id' => $invoice->id,
    'request_id' => request()->header('X-Request-ID'),
]);

$this->postJson('/api/invoices', $payload)
    ->assertUnprocessable()
    ->assertJsonValidationErrors(['customer_id']);`,
      },
    },
  ],
  TypeScript: [
    {
      topics: /TSConfig & compilation/i,
      focus: 'which checks and emitted JavaScript a compiler setting controls, versus runtime APIs it cannot install or validate',
      setup: 'The same source is checked in CI, transformed by a build tool, and then executed by a particular runtime.',
      success: 'the team keeps type checking, emitted syntax, module resolution, available libraries, and runtime capabilities as separate explicit contracts',
      failure: 'one stage can still pass while the loader or runtime lacks what another configuration stage assumed',
      code: {
        language: 'json',
        title: 'Compiler settings describe the build contract',
        snippet: `{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "noEmit": true
  }
}`,
      },
    },
    {
      topics: /inference|Narrowing|Unions|Nullability|Errors, unknown/i,
      focus: 'what the compiler has actually proved about a value at this exact control-flow point',
      setup: 'A caller supplies another allowed member of the union, or a nullable value follows a less common branch.',
      success: 'unsafe operations are rejected until control flow has established the required fact',
      failure: 'another valid input can still reach code that assumes a property or value that was never proved',
      code: {
        language: 'typescript',
        title: 'Narrow the union before using member-specific data',
        snippet: `type Result =
  | { ok: true; value: number }
  | { ok: false; message: string };

function print(result: Result) {
  if (result.ok) {
    console.log(result.value.toFixed(2));
  } else {
    console.error(result.message);
  }
}`,
      },
    },
    {
      topics: /Objects|Functions|Generics|Classes|Arrays|Literals|keyof|Mapped|Conditional/i,
      focus: 'the type contract between producers and consumers, including which relationships the type must preserve',
      setup: 'A new caller uses the API with a different but structurally compatible object or generic argument.',
      success: 'the contract preserves the relationship the implementation needs while rejecting invalid combinations',
      failure: 'the type can still admit a combination that the implementation cannot handle safely',
      code: {
        language: 'typescript',
        title: 'Let the generic preserve the key-to-value relationship',
        snippet: `type User = { id: number; name: string; active: boolean };

function read<K extends keyof User>(user: User, key: K): User[K] {
  return user[key];
}

const name = read(user, "name");   // string
const active = read(user, "active"); // boolean`,
      },
    },
    {
      topics: /Modules|Declaration|Type performance/i,
      focus: 'the project boundary: how modules, compiler settings, declarations, and type complexity agree across packages',
      setup: 'Another package or build target consumes the same code with its own module resolution and compiler context.',
      success: 'all consumers see one accurate contract and the project remains predictable to compile',
      failure: 'another build can still resolve a different shape, hide an error, or become costly to check',
      code: {
        language: 'typescript',
        title: 'Export one public contract for every consumer',
        snippet: `// billing/index.ts — the package boundary
export type { Invoice, InvoiceStatus } from "./types.js";
export { calculateTotal } from "./calculate-total.js";

// consumer.ts
import { calculateTotal } from "@acme/billing";
import type { Invoice } from "@acme/billing";`,
      },
    },
    {
      topics: /Async code|promises/i,
      focus: 'the asynchronous control-flow boundary: completion, rejection, ordering, and ownership of failures',
      setup: 'One promise rejects after another task has started, or two operations complete in the opposite order.',
      success: 'callers can observe completion and failure through an explicit, correctly typed path',
      failure: 'a rejection can still escape, work can finish out of order, or a caller can assume completion too early',
      code: {
        language: 'typescript',
        title: 'Return and await the promise so failure remains observable',
        snippet: `async function loadUser(id: string): Promise<User> {
  const response = await fetch("/api/users/" + id);

  if (!response.ok) {
    throw new Error("User request failed");
  }

  return parseUser(await response.json());
}`,
      },
    },
    {
      topics: /Runtime validation|DOM|React|Node & server/i,
      focus: 'the boundary between TypeScript’s compile-time model and values that arrive from the runtime world',
      setup: 'JSON, a DOM lookup, an environment variable, or a component prop arrives with an unexpected runtime value.',
      success: 'the value is checked or safely narrowed before typed code treats it as trustworthy',
      failure: 'the program can still compile while the unexpected runtime value reaches an unsafe operation',
      code: {
        language: 'typescript',
        title: 'Treat external data as unknown, then prove its shape',
        snippet: `function isUser(value: unknown): value is User {
  return typeof value === "object"
    && value !== null
    && "id" in value
    && typeof value.id === "number";
}

const payload: unknown = await response.json();
if (!isUser(payload)) throw new Error("Invalid user payload");

console.log(payload.id); // safely narrowed to User`,
      },
    },
    {
      topics: /Testing|Refactoring/i,
      focus: 'the evolution boundary: whether behavior and public contracts remain safe as callers and implementations change',
      setup: 'A teammate refactors the implementation or adds a new caller that was not represented by the original examples.',
      success: 'tests and types protect both runtime behavior and the intended public API',
      failure: 'the refactor can still compile or pass shallow tests while breaking a real caller',
      code: {
        language: 'typescript',
        title: 'Inject unstable behavior and test the public result',
        snippet: `interface Clock { now(): Date }

function isExpired(expiresAt: Date, clock: Clock): boolean {
  return expiresAt <= clock.now();
}

const fixedClock: Clock = {
  now: () => new Date("2030-01-01T00:00:00Z"),
};

expect(isExpired(oldDate, fixedClock)).toBe(true);`,
      },
    },
  ],
  MySQL: [
    {
      topics: /Relational modeling|Data types|NULL|Keys|Normalization|JSON/i,
      focus: 'how facts and invariants are represented so the database can distinguish valid state from invalid state',
      setup: 'A row arrives with a missing value, a duplicate relationship, or a document shape that the happy path did not use.',
      success: 'the representation expresses the fact precisely and enforceable invariants reject invalid state',
      failure: 'ambiguous or invalid data can still be stored and discovered only by later application code',
      code: {
        language: 'sql',
        title: 'Represent the rule as an enforceable database invariant',
        snippet: `CREATE TABLE memberships (
  user_id BIGINT NOT NULL,
  team_id BIGINT NOT NULL,
  role VARCHAR(30) NOT NULL,
  PRIMARY KEY (user_id, team_id),
  CONSTRAINT chk_role CHECK (role IN ('member', 'admin')),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);`,
      },
    },
    {
      topics: /Joins|Aggregation|Subqueries|Query correctness|Pagination/i,
      focus: 'the relational meaning of the result set: which rows exist, how they combine, and whether ordering is deterministic',
      setup: 'The data includes an unmatched row, a NULL, a tie, and more than one related record.',
      success: 'the query returns the same logically correct rows for edge cases as it does for the simple example',
      failure: 'rows can still disappear, duplicate, compare as unknown, or move between pages unexpectedly',
      code: {
        language: 'sql',
        title: 'Preserve unmatched rows and aggregate at the intended grain',
        snippet: `SELECT
  c.id,
  c.name,
  COUNT(o.id) AS order_count
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;`,
      },
    },
    {
      topics: /Index design|EXPLAIN|Production performance/i,
      focus: 'the access path and its cost as data distribution, selectivity, and concurrency change',
      setup: 'The table grows by one hundred times and one tenant owns far more rows than the others.',
      success: 'the optimizer can reach the needed rows with bounded work that matches the real workload',
      failure: 'the query can still scan, sort, fetch, or maintain far more entries than its small result suggests',
      code: {
        language: 'sql',
        title: 'Match the composite index to filtering and ordering',
        snippet: `CREATE INDEX idx_orders_tenant_status_created
  ON orders (tenant_id, status, created_at DESC);

EXPLAIN ANALYZE
SELECT id, created_at
FROM orders
WHERE tenant_id = 42
  AND status = 'paid'
ORDER BY created_at DESC
LIMIT 20;`,
      },
    },
    {
      topics: /Transactions|Isolation|Locking|Concurrency/i,
      focus: 'the concurrency boundary: which invariant must remain true when two sessions act at the same time',
      setup: 'Two database sessions read the same initial state and attempt the operation before either one finishes.',
      success: 'the invariant is protected by an atomic statement, constraint, or deliberate locking boundary',
      failure: 'both sessions can still make an individually reasonable decision that is wrong when combined',
      code: {
        language: 'sql',
        title: 'Lock the row before making a read-then-write decision',
        snippet: `START TRANSACTION;

SELECT reserved
FROM seats
WHERE id = 15
FOR UPDATE;

UPDATE seats
SET reserved = TRUE
WHERE id = 15 AND reserved = FALSE;

COMMIT;`,
      },
    },
    {
      topics: /Schema migrations|Partitioning|data lifecycle/i,
      focus: 'the evolution boundary: changing or removing large amounts of live data while old and new code overlap',
      setup: 'A deployment runs while older application instances still serve traffic and late data continues to arrive.',
      success: 'the change remains compatible, observable, and recoverable throughout the transition',
      failure: 'one version can still see an incompatible schema or valid late data can be lost',
      code: {
        language: 'sql',
        title: 'Use an expand-and-contract migration',
        snippet: `-- Expand: safe while old code still runs.
ALTER TABLE customers
  ADD COLUMN display_name VARCHAR(200) NULL;

-- Deploy code that writes both old_name and display_name.
-- Backfill in small batches, then read display_name.

-- Contract only after every old instance is gone.
ALTER TABLE customers
  DROP COLUMN old_name;`,
      },
    },
    {
      topics: /Security & privileges/i,
      focus: 'the security boundary: keeping untrusted values out of SQL structure and limiting what a compromised identity can access',
      setup: 'A user controls one query value while the application account can reach data belonging to many tenants.',
      success: 'values remain data, identifiers come from an allowlist, and the account has only the authority the operation needs',
      failure: 'input can still alter query structure or a compromised account can still reach more data than intended',
      code: {
        language: 'sql',
        title: 'Bind values and keep the tenant predicate explicit',
        snippet: `SELECT id, total, created_at
FROM orders
WHERE tenant_id = ?
  AND customer_email = ?
ORDER BY created_at DESC;

-- The driver binds both ? values as data.
-- The application account also receives only required privileges.`,
      },
    },
    {
      topics: /Backup|Replication/i,
      focus: 'the recovery and freshness boundary: which committed changes exist on each server and which historical points can be restored',
      setup: 'The primary accepts a write just before a failure, while a mistake is also moving through the replication stream.',
      success: 'promotion and recovery use explicit progress coordinates, independent backups, and a tested stopping point',
      failure: 'acknowledged work can still be missing or the same accidental change can still exist on every replica',
      code: {
        language: 'sql',
        title: 'Replication copies mistakes; recovery needs history',
        snippet: `-- This mistake is copied to replicas too:
DELETE FROM invoices WHERE paid_at IS NULL;

-- Recovery is a separate procedure:
-- 1. restore a backup to another server
-- 2. replay binary logs only up to the safe timestamp
-- 3. verify, then copy back the recovered rows`,
      },
    },
    {
      topics: /Connections|configuration/i,
      focus: 'the session and capacity boundary: pooled state, total connection budgets, timeouts, and reproducible server configuration',
      setup: 'Many application instances reconnect together and one reused session still carries state from its previous request.',
      success: 'connection demand remains bounded and every borrower receives the intended clean session contract',
      failure: 'the server can still be overwhelmed or the next request can inherit locks, transactions, or different settings',
      code: {
        language: 'sql',
        title: 'Return pooled connections in a clean session state',
        snippet: `ROLLBACK;
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';

-- Only now should the pool lend this connection
-- to the next request.`,
      },
    },
    {
      topics: /Observability/i,
      focus: 'the evidence boundary: connecting user-visible latency to statement shape, waits, resource pressure, and workload changes',
      setup: 'Users report a slow tail while aggregate averages still look healthy and one tenant has unusually skewed data.',
      success: 'percentiles, query digests, and wait ownership reveal the actual expensive path without exposing sensitive values',
      failure: 'the incident can still hide inside averages or produce logs that show symptoms without identifying the blocker',
      code: {
        language: 'sql',
        title: 'Measure the real execution instead of guessing',
        snippet: `EXPLAIN ANALYZE
SELECT id, created_at
FROM events
WHERE tenant_id = 42
  AND event_type = 'purchase'
ORDER BY created_at DESC
LIMIT 50;

-- Compare estimated rows, actual rows, loops, and time.`,
      },
    },
    {
      topics: /Security|Backup|Replication|Connections|configuration|Observability/i,
      focus: 'the operational boundary: authority, freshness, recovery, resource limits, and evidence about production behavior',
      setup: 'A credential is compromised, a replica lags, a process restarts, or the primary becomes unavailable.',
      success: 'the system has an explicit safety and recovery path rather than relying on the healthy steady state',
      failure: 'the incident can still expose data, lose acknowledged work, amplify load, or remain impossible to diagnose',
    },
  ],
  'Google Analytics': [
    {
      topics: /Collection|Properties|streams|Google tag|Tag Manager|Events & parameters/i,
      focus: 'the collection contract: which real interaction owns the event, which identifiers and parameters describe it, and whether it is emitted exactly once',
      setup: 'A user performs the same business action on web and app while a developer validates the event in DebugView.',
      success: 'the correct stream receives one consistently named event with the expected parameters, identity context, consent state, and no prohibited personal data',
      failure: 'the event can still be missing, duplicated, mis-scoped, or populated with values that make later reporting misleading',
    },
    {
      topics: /Key events|conversions|Attribution|Google Ads|campaign tagging/i,
      focus: 'the outcome-and-credit boundary: separating collected behavior, business importance, advertising conversion use, and the scope that assigns channel credit',
      setup: 'A customer encounters several campaigns, completes one lead, and later returns through another source.',
      success: 'one trustworthy outcome is classified for the intended purpose and analyzed with the matching user, session, or event attribution scope',
      failure: 'the same action can still be double counted, optimized as the wrong goal, or credited to a dimension that answers a different acquisition question',
    },
    {
      topics: /Dimensions|metrics|scope|Users|identity|sessions|Acquisition/i,
      focus: 'the reporting grain: what each field describes, which records it can group, and whether the chosen user, session, event, or item scope answers the stated question',
      setup: 'One person arrives through search, returns through email, views several products, and purchases one item.',
      success: 'dimensions group the intended grain and metrics aggregate compatible records without changing the business claim',
      failure: 'a plausible-looking total can still combine incompatible scopes or be labeled as original acquisition, session acquisition, or key-event credit incorrectly',
    },
    {
      topics: /Realtime|DebugView|data quality|Traffic hygiene|cross-domain|Consent|privacy|retention/i,
      focus: 'the trust-and-quality boundary: validating what was collected, respecting consent, preventing contamination, and distinguishing operational signals from processed reporting',
      setup: 'A release changes tags while employees, test devices, redirects, and consent choices all affect the incoming stream.',
      success: 'the team verifies the payload and identity path, tests irreversible filters, honors consent, and documents every downstream copy',
      failure: 'production data can still be polluted, permanently discarded, split across domains, or collected in violation of the intended privacy contract',
    },
    {
      topics: /Reports workspace|Comparisons|filters|custom reports|Exploration|Funnels|paths|segments|Sampling|thresholds|cardinality|Audiences/i,
      focus: 'the analysis boundary: selecting the surface, scope, subset, and data-quality assumptions that can actually answer the business question',
      setup: 'An analyst compares a routine dashboard with a custom exploration over a large, high-cardinality dataset.',
      success: 'the chosen technique matches the question and its sampling, thresholding, cardinality, membership, and access limitations are made explicit',
      failure: 'a removable filter can be mistaken for security, an audience for a retroactive segment, or a sampled aggregate for raw individual truth',
    },
    {
      topics: /Access|governance|Product integrations|Analytics 360/i,
      focus: 'the governance boundary: who may change or see which dataset, how product links move specific assets, and where enterprise subsets or consolidation are enforced',
      setup: 'Regional teams, an agency, and several linked advertising products need different authority over overlapping data.',
      success: 'least-privilege roles, intentional links, and the appropriate property or subproperty boundary enforce the real ownership model',
      failure: 'a shared login, report filter, or overlapping conversion link can still expose data or activate the same business outcome twice',
    },
    {
      topics: /Measurement Protocol|Data API|Data Import|BigQuery/i,
      focus: 'the data-flow boundary: distinguishing event ingestion, processed reporting queries, query-time enrichment, and raw warehouse export',
      setup: 'A server records an offline order, a dashboard requests a report, and a warehouse joins exported events to CRM data.',
      success: 'each interface owns one deliberate direction of data with stable identifiers, units, deduplication, and documented processing differences',
      failure: 'a reporting API can be mistaken for collection, an export for a reverse sync, or a query-time join for a rewrite of historical raw events',
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
  PHP: {
    focus: 'the exact PHP runtime, type, request, persistence, or object-model rule demonstrated by the displayed code',
    setup: 'The same code runs with a second legal input, another request, or a production configuration that exposes the edge case.',
    success: 'the implementation preserves the stated value, control-flow, security, or resource-management guarantee',
    failure: 'the alternative still assumes behavior that the operator, API, type declaration, or runtime does not provide',
  },
  TypeScript: {
    focus: 'the exact guarantee expressed by the type system and the separate behavior of runtime values',
    setup: 'A second caller supplies a legal edge-case value that the first example did not contain.',
    success: 'the compiler and runtime boundary each enforce the guarantee they actually own',
    failure: 'the program can still compile while an unproved assumption reaches runtime',
  },
  React: {
    focus: 'the React render, identity, state, effect, data-flow, accessibility, or framework boundary visible in the displayed component code',
    setup: 'The component rerenders with another prop, a reordered list, a pending request, or an unmount at the difficult moment.',
    success: 'the component preserves the intended UI and lifecycle behavior through React’s actual render and commit model',
    failure: 'the alternative still relies on lifecycle, identity, cache, or DOM behavior that React and the shown library do not guarantee',
  },
  MySQL: {
    focus: 'the database mechanism that owns the required correctness, access, or recovery guarantee',
    setup: 'Production data grows and two sessions exercise the edge case concurrently.',
    success: 'the database preserves the intended result under realistic data and timing',
    failure: 'the original correctness or performance problem can still occur',
  },
  'Google Analytics': {
    focus: 'the Google Analytics boundary that owns collection, processing, reporting scope, activation, or governance in this scenario',
    setup: 'The same customer journey is measured across another device, campaign, reporting surface, or downstream integration.',
    success: 'the implementation preserves the intended business meaning and makes its scope and data-quality limits explicit',
    failure: 'the report can still look plausible while measuring a different action, grain, identity, or attribution claim',
  },
};

const DISTRACTOR_GUIDES = {
  Laravel: [
    {
      pattern: /check copied into every controller|controller constructor queries|only controllers may create analytics records|billing APIs only work from controllers|only controllers may cache permissions|call the controller method from Artisan|domain code.*extend Controller|route closure\b/i,
      reason: 'A controller or route closure handles one HTTP entry point. It does not protect commands, queued jobs, other controllers, or database writes that reach the same business operation.',
      example: 'A second endpoint can call the operation without the duplicated controller check, so the rule disappears on that path.',
      codeTopics: /Container|Application architecture|Testing|Security/i,
      codeOptions: /check|put|move|only controller|controller action/i,
      code: {
        language: 'php',
        title: 'A controller check protects only that controller',
        snippet: `final class ProjectController
{
    public function publish(Project $project)
    {
        abort_unless(auth()->user()->is_admin, 403);
        $project->publish();
    }
}

// This command calls publish() without the controller check.
$project->publish();`,
      },
    },
    {
      pattern: /\bmiddleware\b/i,
      reason: 'Middleware surrounds HTTP requests. It is useful for request-wide concerns, but a command, queue worker, or direct service call does not pass through that HTTP pipeline.',
      example: 'The web request is blocked correctly, while an Artisan command calls the same service and changes the record because no domain or persistence rule exists there.',
    },
    {
      pattern: /\bvalidat|form request\b/i,
      reason: 'Validation proves that input has an acceptable shape. It does not prove that the signed-in user owns the resource, that a concurrent update is safe, or that an external effect can be rolled back.',
      example: 'The value `project_id: 42` can be a valid integer while project 42 still belongs to another account.',
      codeTopics: /Authentication|authorization|Security|trust/i,
      code: {
        language: 'php',
        title: 'Valid input can still be unauthorized',
        snippet: `$data = $request->validate(['name' => ['required', 'string']]);

// Validation passed, but whose project is this?
$project = Project::findOrFail($request->project_id);
$project->update($data); // unsafe without authorization`,
      },
    },
    {
      pattern: /\bauthoriz|\bpolicy\b|\bgate\b/i,
      reason: 'Authorization answers whether an actor may perform an action. It does not validate payload shape, make several writes atomic, or improve query loading by itself.',
      example: 'A user may be allowed to edit a project, yet a malformed budget still needs validation and two related writes may still need a transaction.',
      codeTopics: /Validation|Transactions|Queries/i,
      codeOptions: /authorization alone|policy alone|gate alone|only authoriz|authorize the input/i,
      code: {
        language: 'php',
        title: 'Permission does not make an unsafe payload valid',
        snippet: `$this->authorize('update', $project);

// The user is allowed, but the payload is still unchecked.
$project->update($request->all());

// Prefer the validated shape:
$project->update($request->validated());`,
      },
    },
    {
      pattern: /\btransaction|lockforupdate|database lock\b/i,
      reason: 'A database transaction coordinates database work on the participating connection. It cannot undo an email, HTTP request, file upload, or other external side effect that already happened.',
      example: 'The database update rolls back after an exception, but the customer has already received the email sent inside the transaction.',
      codeTopics: /Events|Queues|Files|mail|notifications/i,
      code: {
        language: 'php',
        title: 'The database cannot roll back an email',
        snippet: `DB::transaction(function () use ($order) {
    $order->update(['status' => 'paid']);
    Mail::to($order->customer)->send(new Receipt($order));

    throw new RuntimeException('Database will roll back');
    // The email has already left the application.
});`,
      },
    },
    {
      pattern: /\beager load|\bindex|\bcache\b/i,
      reason: 'This primarily changes how quickly data is found or reused. Performance work does not automatically enforce ownership, authorization, uniqueness, atomicity, or side-effect safety.',
      example: 'A cached lookup can become faster and still return another tenant’s value if the tenant is missing from the key.',
      codeTopics: /Cache|Security|Queries|performance/i,
      codeOptions: /cache/i,
      code: {
        language: 'php',
        title: 'A fast cache key can still cross a tenant boundary',
        snippet: `// Wrong: project 42 can exist in several tenant contexts.
$project = Cache::remember("project:{$id}", 300, $load);

// The security context belongs in the identity.
$key = "tenant:{$tenantId}:project:{$id}";
$project = Cache::remember($key, 300, $load);`,
      },
    },
    {
      pattern: /\bqueue|\bjob\b|\bevent\b|\bobserver\b|\blistener\b/i,
      reason: 'Queues and events change timing or coupling. They do not automatically make work unique, order it after a transaction commits, or make a repeated external effect safe.',
      example: 'A worker times out after sending a receipt, retries, and sends the same receipt again unless the job has an idempotency rule.',
      codeTopics: /Events|Queues|Files|mail|notifications|scheduling/i,
      codeOptions: /retry|duplicate|idempoten|unique|after commit|queue automatically/i,
      code: {
        language: 'php',
        title: 'A retry repeats ordinary job code',
        snippet: `public function handle(): void
{
    Mail::to($this->email)->send(new Receipt($this->orderId));

    // If the worker times out here, Laravel may retry handle().
    // Without uniqueness or an idempotency record, a second email is sent.
}`,
      },
    },
    {
      pattern: /\bmigration|foreign key|unique constraint|database constraint\b/i,
      reason: 'A schema constraint protects a persistent data invariant. It does not decide who may issue the write or validate presentation-specific request rules.',
      example: 'A unique email constraint rejects duplicates, but it cannot decide whether the current user may edit that customer.',
    },
    {
      pattern: /model binding|implicit binding/i,
      reason: 'Model binding resolves a route value into a model. Finding a record is not the same as authorizing the current actor to view or change it.',
      example: 'Laravel can successfully bind `/projects/42` even when project 42 belongs to another account, unless scoped binding or authorization adds that rule.',
      codeTopics: /Routing|Authentication|authorization|Security/i,
      codeOptions: /binding authoriz|binding proves ownership|no policy|without authorization/i,
      code: {
        language: 'php',
        title: 'Successful binding still needs an access decision',
        snippet: `public function show(Project $project)
{
    // Binding proved that the project exists.
    // It did not prove that this user may see it.
    $this->authorize('view', $project);

    return new ProjectResource($project);
}`,
      },
    },
  ],
  TypeScript: [
    {
      pattern: /type assertion|\bcast\b|\bassert\w*\b|\bany\b/i,
      reason: 'An assertion or `any` changes what the compiler is willing to believe. It does not inspect, convert, or repair the runtime value.',
      example: 'A string can be asserted as a number and the program still receives a string when it runs.',
      code: {
        language: 'typescript',
        title: 'The assertion compiles, but the value is still wrong',
        snippet: `type User = { age: number };

const payload = JSON.parse('{"age":"old"}') as User;

// Compiles because of the assertion.
payload.age.toFixed(0);
// Runtime error: "old" has no toFixed method.`,
      },
    },
    {
      pattern: /\binterface\b|type alias|\bgeneric\b/i,
      reason: 'Interfaces, type aliases, and generics describe compile-time relationships. They are erased from emitted JavaScript and therefore cannot validate JSON or create missing runtime behavior.',
      example: 'Declaring `interface User` does not make an API response contain a numeric `id`; the response must still be checked.',
      codeTopics: /Runtime validation|DOM|React|Node & server/i,
      code: {
        language: 'typescript',
        title: 'An interface is not a runtime validator',
        snippet: `interface User { id: number }

const value: unknown = await response.json();

// User does not exist at runtime, so this is impossible:
// if (value instanceof User) { ... }

// Use a real validator or type guard instead.`,
      },
    },
    {
      pattern: /\bunion\b/i,
      reason: 'A union lists several allowed possibilities. Code must still narrow the current value before using a property that exists on only one member.',
      example: 'For `Cat | Dog`, both values are legal, so calling a dog-only method before checking the discriminant remains unsafe.',
    },
    {
      pattern: /non-null|optional chaining|undefined|\bnull\b/i,
      reason: 'Optional chaining changes the result to include `undefined`, and a non-null assertion only silences the compiler. Neither operation makes a missing runtime value appear.',
      example: 'If `querySelector` returns `null`, adding `!` compiles but the property access still fails at runtime.',
      codeTopics: /Nullability|DOM|React/i,
      code: {
        language: 'typescript',
        title: 'The exclamation mark does not create the element',
        snippet: `const button = document.querySelector("#save")!;

// Compiles, but crashes if #save is absent.
button.addEventListener("click", save);

// Safer:
const safeButton = document.querySelector("#save");
if (safeButton) safeButton.addEventListener("click", save);`,
      },
    },
    {
      pattern: /\basync\b|\bpromise\b|\bawait\b/i,
      reason: 'Promises model eventual completion or failure. They do not validate the resolved value, guarantee ordering between unrelated tasks, or make a forgotten promise observable.',
      example: 'Calling an async save function without returning or awaiting it lets the caller continue before the save finishes and can hide a later rejection.',
      codeTopics: /Async code|promises/i,
      code: {
        language: 'typescript',
        title: 'Without await, “done” is printed too early',
        snippet: `async function submit() {
  saveInvoice();
  console.log("done"); // runs before saveInvoice finishes
}

async function submitSafely() {
  await saveInvoice();
  console.log("done");
}`,
      },
    },
    {
      pattern: /\breadonly\b|\bprivate\b|\bprotected\b/i,
      reason: 'These modifiers constrain ordinary typed access. They do not validate external data, freeze every nested runtime object, or replace a business invariant.',
      example: 'A readonly array property prevents reassignment through that type, but an aliased mutable array can still be changed elsewhere unless ownership is controlled.',
    },
    {
      pattern: /\btsconfig\b|compiler option|\btarget\b|\blib\b/i,
      reason: 'Compiler configuration controls checking and emitted syntax. It does not install APIs, change the runtime module loader, or make an old environment support a new feature.',
      example: 'Including the DOM library supplies browser type declarations, but Node still does not gain a `document` object at runtime.',
    },
  ],
  MySQL: [
    {
      pattern: /\bindex\b/i,
      reason: 'A normal index is an access path. It may make a lookup faster, but it does not reject duplicates or enforce a business rule unless the index is explicitly UNIQUE and matches that rule.',
      example: 'Two rows with the same email can be inserted through a normal email index because ordinary indexes allow duplicate keys.',
      codeTopics: /Keys|constraints|Relational modeling/i,
      code: {
        language: 'sql',
        title: 'A normal index still allows duplicates',
        snippet: `CREATE INDEX idx_users_email ON users (email);

INSERT INTO users (email) VALUES ('a@example.com');
INSERT INTO users (email) VALUES ('a@example.com');
-- Both inserts are allowed.

-- Use UNIQUE only when duplicate email is truly invalid.`,
      },
    },
    {
      pattern: /\btransaction\b/i,
      reason: 'A transaction groups work atomically, but isolation behavior still depends on the statements, constraints, isolation level, and locks used inside it.',
      example: 'Two transactions can both read “no reservation exists” and both insert unless a unique constraint, atomic statement, or suitable lock protects the decision.',
      codeTopics: /Transactions|Isolation|Locking|Concurrency/i,
      code: {
        language: 'sql',
        title: 'BEGIN alone does not lock a missing business decision',
        snippet: `START TRANSACTION;
SELECT COUNT(*) FROM reservations WHERE seat_id = 15;
-- Another transaction can read the same count here.
INSERT INTO reservations (seat_id, user_id) VALUES (15, 7);
COMMIT;

-- A UNIQUE(seat_id) constraint makes the invariant enforceable.`,
      },
    },
    {
      pattern: /foreign key/i,
      reason: 'A foreign key enforces that a referenced parent exists. It does not enforce uniqueness, ordering, authorization, or every rule about the relationship.',
      example: 'A foreign key can prove that `team_id` exists while still allowing the same user-team membership to be inserted twice.',
    },
    {
      pattern: /unique constraint|unique index|primary key/i,
      reason: 'A unique key protects one uniqueness rule. It does not make reads fresh, choose a query order, prevent every race, or optimize unrelated predicates.',
      example: 'A unique email prevents duplicates, but a replica may still return the old email briefly and a query by status still needs its own access path.',
      codeTopics: /Keys|constraints|Index design|Replication/i,
      code: {
        language: 'sql',
        title: 'One unique key does not optimize a different predicate',
        snippet: `ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);

-- The constraint protects email uniqueness.
-- It does not create an access path for this filter:
SELECT id FROM users
WHERE status = 'trial'
ORDER BY created_at DESC;`,
      },
    },
    {
      pattern: /inner join|left join|\bjoin\b/i,
      reason: 'A join defines which result rows combine. It does not repair source data, and filters placed in the wrong clause can silently remove or multiply rows.',
      example: 'A LEFT JOIN followed by `WHERE orders.status = "paid"` removes customers without orders, behaving like an inner join for that condition.',
      codeTopics: /Joins|Aggregation|Query correctness/i,
      code: {
        language: 'sql',
        title: 'A WHERE filter can cancel the outer-join behavior',
        snippet: `-- Customers without orders disappear:
SELECT c.id
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
WHERE o.status = 'paid';

-- Keep the condition inside ON when unmatched customers matter.`,
      },
    },
    {
      pattern: /\breplica|replication\b/i,
      reason: 'Replication copies changes for availability or read scaling. It can lag, and it also copies accidental updates or deletes, so it is neither guaranteed-fresh reading nor an independent backup.',
      example: 'A DELETE reaches the replica seconds later; both servers then lack the rows, while a retained backup could restore an earlier point.',
      codeTopics: /Backup|Replication|read scaling/i,
      code: {
        language: 'sql',
        title: 'The replica faithfully copies the destructive statement',
        snippet: `-- Executed accidentally on the primary:
DELETE FROM invoices WHERE customer_id = 42;

-- Replication sends the same change to the replica.
-- The replica improves availability; it does not preserve old history.
-- A backup plus binary logs provides a recovery point.`,
      },
    },
    {
      pattern: /\bbackup\b|snapshot/i,
      reason: 'A backup provides a historical recovery source. It does not keep a live service available, make current reads faster, or prove the restore procedure works without testing it.',
      example: 'A nightly backup may restore yesterday’s state, but it cannot serve traffic when the primary fails at noon without a separate failover design.',
      codeTopics: /Backup|Replication|recovery/i,
      code: {
        language: 'sql',
        title: 'A backup is useful only through a tested restore path',
        snippet: `-- Restore into an isolated server first.
-- Then verify expected data before promotion:
SELECT COUNT(*) AS invoices
FROM invoices
WHERE created_at < '2030-01-01 12:00:00';

-- A successful backup file alone does not prove recovery time or correctness.`,
      },
    },
    {
      pattern: /\bpartition/i,
      reason: 'Partitioning organizes a large table and can enable pruning or lifecycle operations. It does not automatically replace useful indexes or improve a query that cannot eliminate partitions.',
      example: 'A query without the partition key can still inspect every partition, sometimes doing more planning work than the unpartitioned table.',
      codeTopics: /Partitioning|Index design|performance/i,
      code: {
        language: 'sql',
        title: 'Without the partition key, pruning cannot help',
        snippet: `-- Assume events is partitioned by occurred_on.
EXPLAIN
SELECT *
FROM events
WHERE user_id = 42;

-- No occurred_on predicate: many partitions may be visited.
-- The user_id access path still needs intentional index design.`,
      },
    },
    {
      pattern: /\bexplain\b/i,
      reason: 'EXPLAIN provides evidence about the chosen plan; it is a diagnostic tool, not a change that fixes the query by itself.',
      example: 'Seeing a full scan explains the cost, but the team must still change the query, statistics, index, or data model and measure again.',
      codeTopics: /EXPLAIN|Observability|performance/i,
      code: {
        language: 'sql',
        title: 'Measure, change one mechanism, then measure again',
        snippet: `EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42;

CREATE INDEX idx_orders_customer ON orders (customer_id);

EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42;
-- Compare actual rows and execution time; EXPLAIN itself changed nothing.`,
      },
    },
    {
      pattern: /\bnull\b/i,
      reason: 'NULL means unknown, so ordinary equality produces UNKNOWN rather than TRUE. SQL needs `IS NULL`, `IS NOT NULL`, or an explicit three-valued-logic design.',
      example: '`WHERE deleted_at = NULL` returns no rows even when deleted_at is NULL.',
      codeTopics: /NULL|Query correctness/i,
      code: {
        language: 'sql',
        title: 'NULL requires IS NULL',
        snippet: `SELECT NULL = NULL;       -- NULL (unknown), not TRUE

SELECT *
FROM users
WHERE deleted_at = NULL; -- returns no matching rows

SELECT *
FROM users
WHERE deleted_at IS NULL; -- correct null check`,
      },
    },
  ],
};

const WRONG_CODE_LESSONS = new Map([
  ['LQ-045::The validation rule alone', {
    language: 'php',
    title: 'Validation can race; the database constraint decides',
    snippet: `// Request A and request B can both pass this check.
$request->validate(['name' => ['unique:materials,name']]);

// The final guarantee belongs in the schema.
Schema::table('materials', function (Blueprint $table) {
    $table->unique('name');
});

// The application must handle a duplicate-key conflict.`,
  }],
  ['LQ-137::The queue name contains “payments”', {
    language: 'php',
    title: 'A queue label does not deduplicate a repeated charge',
    snippet: `$key = "charge-order:{$order->id}";

$gateway->charge(
    amount: $order->total,
    idempotencyKey: $key,
);

// A retry sends the same key, so the provider can return
// the original result instead of charging a second time.`,
  }],
  ['LQ-147::Cache keys must always be numeric', {
    language: 'php',
    title: 'The key needs identity, not a particular data type',
    snippet: `// Wrong: every account shares one value.
Cache::remember('dashboard', 300, $buildDashboard);

// Right: the account is part of the cached value's identity.
$key = "account:{$account->id}:dashboard";
Cache::remember($key, 300, $buildDashboard);`,
  }],
  ['LQ-186::A larger SQL transaction that automatically rolls back S3', {
    language: 'php',
    title: 'A database rollback cannot remove an S3 object',
    snippet: `DB::transaction(function () use ($upload) {
    $file = File::create(['status' => 'pending']);
    Storage::disk('s3')->put($file->path, $upload);

    throw new RuntimeException('DB rolls back');
    // S3 is a different system; its write already happened.
});

// Use explicit states and compensation for cross-system work.`,
  }],
  ['LQ-230::Validate that notes are strings and then render raw', {
    language: 'php',
    title: 'A valid string can still contain executable markup',
    snippet: `$request->validate(['note' => ['required', 'string']]);

// Blade escapes by default:
{{ $project->note }}

// Raw output would execute allowed-looking HTML such as <script>:
{!! $project->note !!}

// Sanitize only when the product intentionally supports HTML.`,
  }],
  ['TQ-006::Assert each push result as boolean', {
    language: 'typescript',
    title: 'Annotate the collection once instead of lying at each push',
    snippet: `const names: string[] = [];

if (user.name) names.push(user.name);
if (team.name) names.push(team.name);

// names.push(true); // compile error at the real mistake

// An assertion would only silence that useful error.`,
  }],
  ['TQ-074::It throws immediately when result is null', {
    language: 'typescript',
    title: 'The non-null assertion adds no runtime check',
    snippet: `const result: Project | null = await findProject(id);

console.log(result!.name);
// If result is null, the property access crashes here.

if (!result) throw new Error('Project not found');
console.log(result.name); // now control flow proved Project`,
  }],
  ['TQ-110::The promise is converted to boolean', {
    language: 'typescript',
    title: 'The promise keeps running unless the caller observes it',
    snippet: `async function submit() {
  saveInvoice();
  showSuccess(); // runs before the save finishes
}

async function submitSafely() {
  await saveInvoice();
  showSuccess();
}

// await also routes rejection into this function's error path.`,
  }],
  ['TQ-182::Cast it immediately to the desired interface', {
    language: 'typescript',
    title: 'Casting JSON does not validate the JSON',
    snippet: `const value: unknown = JSON.parse(input);

if (!isProject(value)) {
  throw new Error('Invalid project JSON');
}

console.log(value.id); // value is Project after the guard

// "as Project" would skip the runtime check entirely.`,
  }],
  ['TQ-270::Any makes runtime values valid', {
    language: 'typescript',
    title: 'Any removes the test’s guardrail; it changes no value',
    snippet: `type Action = { type: 'increment'; amount: number };

const impossible = {
  type: 'increment',
  amount: 'many',
} as any;

reducer(state, impossible);
// Runtime still receives the string "many".`,
  }],
  ['MQ-026::<> converts NULL to an empty string', {
    language: 'sql',
    title: 'Comparisons with NULL produce UNKNOWN',
    snippet: `SELECT NULL <> 'archived'; -- NULL, not TRUE

SELECT *
FROM projects
WHERE status <> 'archived';
-- WHERE keeps TRUE only, so NULL statuses are excluded.

-- Include them deliberately when that is the business rule:
WHERE status <> 'archived' OR status IS NULL;`,
  }],
  ['MQ-030::NULL rows are deleted during joins', {
    language: 'sql',
    title: 'The WHERE clause filters the generated NULL row',
    snippet: `-- This rejects parents whose child columns are NULL:
SELECT p.id
FROM parents AS p
LEFT JOIN children AS c ON c.parent_id = p.id
WHERE c.active = 1;

-- Put the child condition in ON when unmatched parents must remain:
LEFT JOIN children AS c
  ON c.parent_id = p.id AND c.active = 1;`,
  }],
  ['MQ-050::INNER JOIN projects', {
    language: 'sql',
    title: 'INNER JOIN has no output row for an unmatched customer',
    snippet: `SELECT c.id, c.name, p.id AS project_id
FROM customers AS c
LEFT JOIN projects AS p
  ON p.customer_id = c.id;

-- With LEFT JOIN, p.id is NULL for a customer with zero projects.
-- INNER JOIN would remove that customer from the result.`,
  }],
  ['MQ-118::MySQL creates a new server for the inner transaction', {
    language: 'sql',
    title: 'A savepoint is not an independently durable transaction',
    snippet: `START TRANSACTION;
INSERT INTO orders (id) VALUES (10);

SAVEPOINT nested_work;
INSERT INTO order_items (order_id) VALUES (10);
RELEASE SAVEPOINT nested_work;

ROLLBACK;
-- Both inserts roll back because the outer transaction never committed.`,
  }],
  ['MQ-231::Replicas never contain table data', {
    language: 'sql',
    title: 'A replica contains live data—and copies live mistakes',
    snippet: `-- The replica contains copied table data for serving reads.
SELECT COUNT(*) FROM invoices;

-- This accidental primary change is copied too:
DELETE FROM invoices;

-- A backup is separate history that can be restored
-- after the live replication chain has copied the mistake.`,
  }],
]);

function guideFor(question) {
  return GUIDES[question.track]?.find((guide) => guide.topics.test(question.topic))
    || FALLBACK_GUIDES[question.track];
}

function questionNumber(question) {
  return Number(question.id.split('-').at(-1));
}

function shouldShowCorrectCode(question) {
  return ['Laravel', 'TypeScript', 'MySQL'].includes(question.track)
    && questionNumber(question) <= 300
    && (questionNumber(question) - 1) % 3 === 0;
}

function curatedWrongCodeFor(question, option) {
  return WRONG_CODE_LESSONS.get(`${question.id}::${option}`) || null;
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

  const trackDiagnosis = DISTRACTOR_GUIDES[question.track]
    ?.find((diagnosis) => diagnosis.pattern.test(option));
  if (trackDiagnosis) {
    const { codeTopics, codeOptions, ...diagnosis } = trackDiagnosis;
    const codeTopicMismatch = diagnosis.code && codeTopics && !codeTopics.test(question.topic);
    const codeOptionMismatch = diagnosis.code && codeOptions && !codeOptions.test(option);
    if (codeTopicMismatch || codeOptionMismatch) {
      return { ...diagnosis, code: null };
    }
    return diagnosis;
  }

  if (/\b(always|never|every|automatically|impossible|permanently)\b/.test(text)) {
    const absoluteExamples = {
      Laravel: 'A new route or worker can take a path that the assumption did not cover; without an enforced boundary, the next request can still violate the rule.',
      TypeScript: 'A different caller, browser, or runtime value can violate the assumption even though the current example compiles; TypeScript does not make “automatic” runtime behavior appear.',
      PHP: 'Another valid input, request, or process can take a different branch; PHP does not add a missing type check, security boundary, transaction, or cleanup step automatically.',
      React: 'Another render, reordered key, pending request, or unmount can violate the assumption; React only provides the state and lifecycle behavior established by the shown component contract.',
      MySQL: 'A NULL, skewed row set, or second concurrent session is enough to violate the assumption; the database needs an explicit constraint, access path, or protocol.',
      'Google Analytics': 'A second stream, reporting scope, consent state, or processing surface can violate the assumption; GA4 needs an explicit collection and analysis contract.',
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

  if (question.track === 'TypeScript' && /\b(type assertion|cast|assert\w*|any)\b/.test(text)) {
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
  const codeLanguage = question.code?.language === 'php'
    ? 'PHP'
    : question.code?.language === 'tsx'
      ? 'React/TSX'
    : question.code?.language === 'sql'
      ? 'SQL'
      : question.code?.language === 'json'
        ? 'JSON configuration'
        : 'TypeScript';

  const alternatives = options.flatMap((option, index) => {
    if (option === correct) return [];
    const diagnosis = distractorDiagnosis(option, question);
    const fallbackExample = `${guide.setup} If the team instead chooses “${option}”, ${guide.failure}; the original symptom remains possible.`;
    const diagnosedExample = diagnosis.example
      ? `${normalizeSentence(diagnosis.example)} In this scenario, ${guide.failure}; choosing it would leave the core problem unsolved.`
      : fallbackExample;
    const codeReason = `This interpretation gives the displayed code behavior that it does not have. ${normalizeSentence(question.explanation)} The decisive result is “${correct}”, so “${option}” describes a different execution path, type rule, database guarantee, or API contract.`;
    const codeExample = `Trace the displayed ${codeLanguage} in the exact order shown and inspect the value, branch, type, or affected rows named in the prompt. The observable outcome matches “${correct}”. For “${option}” to be true, the code would need an additional operator, guard, constraint, query clause, or API behavior that is not present.`;
    return [{
      number: index + 1,
      option,
      reason: question.code
        ? codeReason
        : `${diagnosis.reason} The decisive issue here is ${guide.focus}. It does not establish “${correct}”.`,
      example: question.code ? codeExample : diagnosedExample,
      code: curatedWrongCodeFor(question, option),
    }];
  });

  return {
    correct,
    whyCorrect: normalizeSentence(question.explanation),
    correctExample: question.code
      ? `Read the displayed ${codeLanguage} from top to bottom and apply “${correct}”. ${normalizeSentence(question.explanation)} The code itself is the concrete example: its operator, API call, branch, constraint, or query clause produces that result.`
      : `${guide.setup} The team applies “${correct}”. ${normalizeSentence(capitalize(guide.success))}`,
    correctCode: shouldShowCorrectCode(question) ? guide.code || null : null,
    alternatives,
  };
}
