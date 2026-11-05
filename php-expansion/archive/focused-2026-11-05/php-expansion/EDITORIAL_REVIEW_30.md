# PHP editorial review — 30 complete questions

All records below remain pending independent approval. This export contains existing questions only. Read each student section before consulting its answer and review notes. The sample intentionally includes unresolved cases; inclusion is not an endorsement.

Selection: 20 targeted cases and 10 deterministic random selections. Seed: `php-editorial-remediation-2026-11-05-review-30-v1`. Random selection uses the ten lowest SHA-256 hashes of seed + newline + ID among the remaining 580 records, without rerolls. This is not a statistical certification of the bank.

## Student-visible questions

### PHP-E26-0022 · revision 2

**Inheritance, interfaces & traits · execution · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Traits; Method aliases; Visibility.

What text is printed by the call outside the class?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

trait Greeting
{
    public function hello(): string
    {
        return 'hello';
    }
}

final class Greeter
{
    use Greeting {
        hello as private hiddenHello;
    }
}

echo (new Greeter())->hello();
```

**A.**

```text
An uncaught Error because hello was renamed
```

**B.**

```text
An uncaught Error because hello became private
```

**C.**

```text
An uncaught Error because a trait alias cannot narrow the original method’s visibility
```

**D.**

```text
hello
```

### PHP-E26-0050 · revision 2

**Errors & exceptions · code-review · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Exceptions; Boolean returns; API contracts.

lookup returns true for an active account, false for an inactive account, and throws RuntimeException when storage is unavailable. Callers must distinguish all three outcomes. Which change repairs safeLookup without treating storage failure as an account status?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

function lookup(string $id): bool
{
    if ($id === 'offline') {
        throw new RuntimeException('storage unavailable');
    }

    return $id === 'active';
}

function safeLookup(string $id): bool
{
    try {
        return lookup($id);
    } catch (RuntimeException $error) {
        return false;
    }
}

echo json_encode([safeLookup('active'), safeLookup('inactive'), safeLookup('offline')]);
```

**A.**

```text
Log the storage exception in catch, then keep returning false.
```

**B.**

```text
Let the storage exception propagate while returning the account booleans normally.
```

**C.**

```text
Return true from catch so false remains reserved for inactive accounts.
```

**D.**

```text
Retry lookup once; return false if the retry also throws.
```

### PHP-E26-0056 · revision 2

**Validation & web security · code-review · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: String comparison; Authentication tokens; Timing side channels.

These are fixed test strings, not real credentials. Production tokens are equal-length hexadecimal strings. The comparison must reject different contents and use PHP’s timing-safe comparison API. Which replacement satisfies both requirements?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

$stored = '0e123456789';
$provided = '0e987654321';

$accepted = $stored == $provided;

echo json_encode($accepted);
```

**A.**

```text
(string) $stored == (string) $provided
```

**B.**

```text
$stored === $provided
```

**C.**

```text
strcmp($stored, $provided) === 0
```

**D.**

```text
hash_equals($stored, $provided)
```

### PHP-E26-0078 · revision 2

**Validation & web security · implementation · Advanced**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: MAC input framing (advanced); Binary strings; Field boundaries and ordering.

Different ordered field pairs must never produce the same encoded bytes. Which return expression gives an unambiguous framing for these bounded fields?

- Run in a fresh PHP process using only the displayed files and inputs.
- Each input is an arbitrary byte string shorter than 2^32 bytes. Field order matters. The chosen encoding will be authenticated with HMAC afterward; this question tests the encoding, not hash collision resistance.

**main.php** (complete-file)

```php
<?php

function frame(string $first, string $second): string
{
    return $first . $second;
}

$pairs = [
    [['ab', 'c'], ['a', 'bc']],
    [["a\nb", 'c'], ['a', "b\nc"]],
    [['x', 'y'], ['y', 'x']],
    [["\xFF", 'x'], ["\xFE", 'x']],
];

$collisions = [];

foreach ($pairs as [$left, $right]) {
    $collisions[] = frame(...$left) === frame(...$right);
}

echo json_encode($collisions);
```

**A.**

```text
pack('N', strlen($first)) . $first . pack('N', strlen($second)) . $second
```

**B.**

```text
json_encode([$first, $second], JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR)
```

**C.**

```text
$first . "\n" . $second
```

**D.**

```text
min($first, $second) . ':' . max($first, $second)
```

### PHP-E26-0079 · revision 2

**Transactions, migrations & ORM · implementation · Advanced**

PHP 8.4 / 8.5. Requirements scenario; no executable PHP source. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: PDO transactions; Database/broker crash recovery (advanced); Idempotent consumers.

A committed order must eventually be notified to the broker after recovery, and an order that rolls back must never be notified. Which implementation preserves both requirements across a process crash?

- The PHP service uses one transactional database and a separate broker, with no distributed transaction. One database transaction can write multiple tables. An independent worker can read committed database records and retry broker operations. Consumers deduplicate repeated event IDs. Either the request process or worker can crash between operations.

Requirements scenario; no executable source.

**A.**

```text
Publish to the broker first, then begin and commit the order transaction.
```

**B.**

```text
Commit the order, then publish synchronously before returning the HTTP response.
```

**C.**

```text
Write the order and outbox event in one transaction; let a retrying worker publish the event.
```

**D.**

```text
Commit the order and register a shutdown callback that publishes the event.
```

### PHP-E26-0098 · revision 2

**Validation & web security · architecture · Intermediate**

PHP 8.4 / 8.5. Requirements scenario; no executable PHP source. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Authorization caching; Tenant isolation; Versioned invalidation.

Which four-component key permits safe reuse under these assumptions?

- The cached action is always view. Resource IDs may repeat across tenants. Within a tenant, users sharing a role may have different overrides, and two resources of the same type may have different permissions. Every permission change increments a policy revision before further checks. Decisions are reused across requests, including requests using different HTTP methods.

Requirements scenario; no executable source.

**A.**

```text
[tenantId, roleName, resourceId, policyRevision]
```

**B.**

```text
[tenantId, userId, resourceType, policyRevision]
```

**C.**

```text
[tenantId, userId, resourceId, requestMethod]
```

**D.**

```text
[tenantId, userId, resourceId, policyRevision]
```

### PHP-E26-0145 · revision 2

**Inheritance, interfaces & traits · debugging · Advanced**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Trait adaptation; PHP 8.3+ final trait aliases (advanced); Method overriding.

sealed must be a public final alias of the trait implementation, while ChildWorker must still override run. The current adaptation makes the declaration fail. Which replacement satisfies all three requirements?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

trait Work
{
    public function run(): string
    {
        return 'trait';
    }
}

class BaseWorker
{
    use Work {
        run as final;
    }
}

class ChildWorker extends BaseWorker
{
    public function run(): string
    {
        return 'child';
    }
}

$worker = new ChildWorker();

echo json_encode([
    $worker->run(),
    $worker->sealed(),
    (new ReflectionMethod(BaseWorker::class, 'sealed'))->isFinal(),
]);
```

**A.**

```text
run as final; run as sealed;
```

**B.**

```text
run as final sealed;
```

**C.**

```text
run as sealed; sealed as final;
```

**D.**

```text
run as sealed final;
```

### PHP-E26-0193 · revision 3

**APIs, integrations & PSRs · architecture · Intermediate**

PHP 8.4 / 8.5. Requirements scenario; no executable PHP source. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: PHP service boundaries; HTTP response status; CLI exit codes.

Which responsibility split preserves these boundaries while letting both entry points reuse the same validation decision?

- A validation use case is shared by HTTP and CLI entry points. Invalid input must become HTTP status 422 in the HTTP adapter and process exit code 2 in the CLI adapter. The domain API must contain no HTTP or CLI concepts, and adding another transport must not change it.

Requirements scenario; no executable source.

**A.**

```text
Return an HTTP status from the domain use case and make every adapter interpret that status.
```

**B.**

```text
Have the domain use case inspect PHP_SAPI and choose the HTTP status or CLI exit code itself.
```

**C.**

```text
Return a transport-neutral validation outcome; each adapter maps it to its own status or exit code.
```

**D.**

```text
Return both an HTTP status and a CLI exit code from the domain result object.
```

### PHP-E26-0199 · revision 2

**APIs, integrations & PSRs · architecture · Advanced**

PHP 8.4 / 8.5. Requirements scenario; no executable PHP source. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: At-least-once delivery (advanced); Per-entity versions; Transactional consumer state.

Which consumer strategy preserves the required order without permanently losing version 6?

- A PHP projection has applied entity version 4. Events carry consecutive versions and noncommutative transitions; applying 6 before 5 is invalid. Version 6 arrives first, then 5, and any event may be redelivered. A durable store can atomically update the projection and applied version. Missing events can be fetched from an authoritative log.

Requirements scenario; no executable source.

**A.**

```text
Deduplicate event IDs and apply unseen events in arrival order in one projection transaction; acknowledge after commit.
```

**B.**

```text
Atomically apply any newer version and store its number; acknowledge after commit and acknowledge older deliveries without applying them.
```

**C.**

```text
Atomically apply only the next version; acknowledge other deliveries without retaining them, relying on redelivery after a gap is filled.
```

**D.**

```text
Apply stored version + 1 atomically; ignore already applied versions, and durably defer gaps while recovering missing versions.
```

### PHP-E26-0300 · revision 2

**Files & structured data · architecture · Advanced**

PHP 8.4 / 8.5. Requirements scenario; no executable PHP source. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: flock advisory locking (advanced); Atomic rename; File identity versus pathname; Read-modify-write critical sections.

Workers replace state.json by writing a temporary file and renaming it over state.json. Which locking protocol keeps all writers in one critical section?

- On the stated local POSIX filesystem, same-directory rename atomically replaces the data pathname. All writers cooperate, all I/O succeeds, and crash durability is outside scope. Writers must serialize the entire read-modify-replace operation. A separate lock file is available and is never renamed or deleted.

Requirements scenario; no executable source.

**A.**

```text
Open and lock state.json, then read, write a temporary file and rename it over state.json.
```

**B.**

```text
Lock each worker’s temporary file before writing and renaming it over state.json.
```

**C.**

```text
Read and replace state.json, then lock the newly opened state.json before returning.
```

**D.**

```text
Lock the permanent lock file before reading state.json; release it after replacement.
```

### PHP-E26-0343 · revision 2

**Validation & web security · debugging · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: HMAC verification; Raw HTTP request bodies; JSON representation; hash_equals.

This valid fixture fails verification because the receiver transforms the body. Which bytes should replace the signedBytes assignment to respect the sender’s stated protocol?

- Run in a fresh PHP process using only the displayed files and inputs.
- The sender signs the exact UTF-8 body bytes, including surrounding whitespace, using HMAC-SHA-256. The shared key and received MAC are trusted fixture values; replay and key-management policy are outside this question. No real HTTP request or external secret is used.

**main.php** (complete-file)

```php
<?php

$key = 'local-fixture-key';
$raw = ' {"b":2, "a":1}' . chr(10);
$receivedMac = 'ca0cf89004a76ddb5ab3e01512049e368838d28cf0c1bbf898e60b6f54711877';

$signedBytes = json_encode(json_decode($raw, true, 512, JSON_THROW_ON_ERROR), JSON_THROW_ON_ERROR);
$computedMac = hash_hmac('sha256', $signedBytes, $key);

echo json_encode(hash_equals($receivedMac, $computedMac));
```

**A.**

```text
The raw body after trimming its leading and trailing whitespace bytes.
```

**B.**

```text
The exact raw body as received, including its surrounding whitespace.
```

**C.**

```text
The decoded JSON value encoded again with PHP’s default compact formatting.
```

**D.**

```text
The decoded JSON value converted to PHP’s native serialized representation.
```

### PHP-E26-0355 · revision 1

**HTTP & superglobals · code-review · Intermediate**

PHP 8.4 / 8.5. Requirements scenario; no executable PHP source. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: HTTP 303 and 307; Location header; POST/Redirect/GET.

A review calls 307 a safe implementation of the intended redirect flow. Which assessment follows the status-code semantics?

- A PHP endpoint has successfully processed a POST. It sends Location: /receipt with status 307. The browser follows redirects normally. The intended follow-up is retrieval of the receipt, not repeating the POST and its body at /receipt. No HTTP response is sent during question validation.

Requirements scenario; no executable source.

**A.**

```text
307 converts POST to GET, so the receipt receives a retrieval request.
```

**B.**

```text
307 preserves POST; use 303 See Other for the intended retrieval of the receipt.
```

**C.**

```text
307 keeps the POST method but removes its body, which is equivalent to GET for this flow.
```

**D.**

```text
Changing 307 to 308 would convert the follow-up to GET while preserving the same target.
```

### PHP-E26-0432 · revision 2

**Files & structured data · debugging · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: JSON object and array shapes; PHP object casting; JSON_FORCE_OBJECT.

JSON_FORCE_OBJECT changes the nested items list into an object. Which return expression makes the displayed calls produce exactly [{},{"items":[1,2]}]?

- Run in a fresh PHP process using only the displayed files and inputs.
- The input is a map with string field names, or an empty map represented by an empty PHP array. Nested numeric lists must remain JSON arrays.

**main.php** (complete-file)

```php
<?php

function wire(array $payload): string
{
    return json_encode($payload, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT);
}

echo '[' . wire([]) . ',' . wire(['items' => [1, 2]]) . ']';
```

**A.**

```text
json_encode((object) $payload, JSON_THROW_ON_ERROR)
```

**B.**

```text
json_encode($payload, JSON_THROW_ON_ERROR)
```

**C.**

```text
json_encode($payload, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT)
```

**D.**

```text
json_encode(array_values($payload), JSON_THROW_ON_ERROR)
```

### PHP-E26-0447 · revision 2

**Functions & arguments · code-review · Foundation**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Nullable return types; Control-flow paths; TypeError.

A review says the false path automatically returns null because the declaration is nullable. Which assessment is correct?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

function label(bool $enabled): ?string
{
    if ($enabled) {
        return 'yes';
    }
}

$results = [label(true)];

try {
    $results[] = label(false);
} catch (TypeError $failure) {
    $results[] = 'TypeError';
}

echo json_encode($results);
```

**A.**

```text
The false path returns null, so the declaration already covers both paths.
```

**B.**

```text
The false path raises TypeError; add an explicit return null on that path.
```

**C.**

```text
Add a bare return on the false path; it is equivalent to returning null for this declaration.
```

**D.**

```text
The missing return becomes null in weak mode and fails only with strict_types enabled.
```

### PHP-E26-0489 · revision 2

**Iterators, generators & fibers · testing · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Generator laziness; current and next; Exceptions during iteration.

For positiveRows([1, -1]), which action must an exception expectation cover to verify rejection of the negative element?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

function positiveRows(array $values): Generator
{
    foreach ($values as $value) {
        if ($value < 0) {
            throw new DomainException('negative row');
        }

        yield $value;
    }
}

try {
    $rows = positiveRows([1, -1]);
    echo 'created';
} catch (DomainException $failure) {
    echo 'rejected';
}
```

**A.**

```text
Call positiveRows([1, -1]) and stop before inspecting the returned generator.
```

**B.**

```text
Call current on the fresh generator and assert that it throws.
```

**C.**

```text
Assert that the returned object implements Traversable.
```

**D.**

```text
Read the first yield, then expect DomainException around the next advance.
```

### PHP-E26-0549 · revision 1

**Functions & arguments · code-review · Foundation**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: min; Empty arrays; ValueError; Nullable return types.

The helper promises null for an empty score list. Which review correctly evaluates its current implementation?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

function lowestScore(array $scores): ?int
{
    return min($scores);
}

try {
    echo json_encode(lowestScore([]));
} catch (ValueError $error) {
    echo 'empty-error';
}
```

**A.**

```text
The nullable return type converts min’s empty-input error into null.
```

**B.**

```text
min returns zero for an empty array, so change the return type to int.
```

**C.**

```text
Return null explicitly for an empty list before calling min.
```

**D.**

```text
Cast scores to array before min so an empty list becomes an accepted value.
```

### PHP-E26-0557 · revision 1

**Cookies & sessions · code-review · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Session files handler; session_write_close; Session persistence versus local state.

A refactor moves the final assignment after session_write_close. Which review is correct?

- Run in a fresh PHP process using only the displayed files and inputs.
- All session operations succeed using the isolated files handler. Cookies and cache-limiter headers are disabled for this CLI fixture. Reopening reloads the saved session record.

**main.php** (complete-file)

```php
<?php

$options = [
    'save_handler' => 'files',
    'save_path' => __DIR__,
    'use_cookies' => 0,
    'cache_limiter' => '',
];
session_id('review557');
session_start($options);
$_SESSION['stage'] = 'saved';
session_write_close();

$_SESSION['stage'] = 'local-only';
session_start($options);
$result = $_SESSION['stage'];
session_destroy();
echo $result;
```

**A.**

```text
The assignment persists because SESSION remains available as an array.
```

**B.**

```text
The assignment fails because closing the session destroys the SESSION variable.
```

**C.**

```text
Reopening first saves all local changes made while the session was closed.
```

**D.**

```text
Make persistent changes before closing, or reopen before changing them; this assignment is only local.
```

### PHP-E26-0591 · revision 2

**Validation & web security · testing · Advanced**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Base64 encoding (advanced); PHP string functions; Boolean test assertions.

Which test has the required expected result but fails for the displayed implementation?

- Run in a fresh PHP process using only the displayed files and inputs.
- The protocol requires canonical padded standard Base64 as defined by RFC 4648, with no whitespace. Empty bytes are represented by the empty string. The function must return true exactly for encodings allowed by that protocol.

**main.php** (complete-file)

```php
<?php

function canonicalBase64(string $text): bool
{
    return base64_decode($text, true) !== false;
}
```

**A.**

```text
canonicalBase64("Zg==") must be true.
```

**B.**

```text
canonicalBase64("@@") must be false.
```

**C.**

```text
canonicalBase64("Zh==") must be false.
```

**D.**

```text
canonicalBase64("") must be true.
```

### PHP-E26-0599 · revision 2

**Performance, processes & servers · architecture · Intermediate**

PHP 8.4 / 8.5. Requirements scenario; no executable PHP source. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: PHP-FPM request lifecycle; Queue publisher confirmations; Timeout handling.

Which publish-and-response policy satisfies the acceptance guarantee, including when a confirmation times out?

- A PHP-FPM endpoint returns 202 only for work that remains recoverable after that FPM process is killed. A separate worker consumes a durable queue. No database mutation is paired with publication.
- The queue client publish call can return after buffering or writing bytes, before the broker stores the task. A positive publisher confirmation for this task means it is persistently stored in the intended queue. A confirmation timeout leaves the outcome unknown. Routing errors are reported as failures.
- The FPM process may be killed between any two steps, including after fastcgi_finish_request. A caller may retry when no 202 is received; duplicate deliveries are acceptable and the worker handles them safely.

Requirements scenario; no executable source.

**A.**

```text
Publish to the durable queue, return 202 and finish the response, then wait for confirmation.
```

**B.**

```text
Publish and wait for confirmation; on timeout return 202 and register a shutdown callback to retry.
```

**C.**

```text
Publish and wait for confirmation; return 202 only on confirmation, otherwise return a retryable non-202 response.
```

**D.**

```text
Publish to the durable queue, wait for the client socket to flush, then return 202 and finish the response.
```

### PHP-E26-0600 · revision 2

**Validation & web security · architecture · Intermediate**

PHP 8.4 / 8.5. Requirements scenario; no executable PHP source. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: HMAC input bytes; Raw HTTP body; JSON representation differences; Constant-time verification; Bounded reads.

Which pipeline preserves the provider’s authentication contract before dispatching parsed data?

- The trusted provider signs the exact raw body bytes using HMAC-SHA256 and a shared secret. A reviewed verifier already validates signature encoding and compares MACs safely. The body is bounded by an enforced size limit. Middleware can read and retain the original bytes once. The provider does not define JSON canonicalization; whitespace and member order can vary. Replay handling is a separate completed layer.

Requirements scenario; no executable source.

**A.**

```text
Decode JSON, sort its members, re-encode compactly, then verify that text before dispatch.
```

**B.**

```text
Retain the bounded original bytes, verify their MAC, then parse and dispatch only after verification succeeds.
```

**C.**

```text
Normalize line endings and trim surrounding whitespace before verifying and parsing.
```

**D.**

```text
Parse and dispatch the body first, then verify the MAC of the retained original bytes before returning success.
```

### PHP-E26-0113 · revision 1

**Arrays & destructuring · execution · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: array_intersect; Scalar string conversion; JSON array keys.

What JSON is printed? The left array contains an integer, a leading-zero string, a boolean and a float.

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

$left = [1, '01', true, 1.0];
$right = ['1'];

echo json_encode(array_intersect($left, $right));
```

**A.**

```text
[]
```

**B.**

```text
[1,"01",true,1]
```

**C.**

```text
{"0":1,"2":true,"3":1}
```

**D.**

```text
{"0":"1","2":"1","3":"1"}
```

### PHP-E26-0508 · revision 1

**Variables, scope & constants · execution · Foundation**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: const declarations; defined; constant name strings.

What JSON is printed by these constant lookups? Only the displayed user constant is declared.

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

const Mode = 'safe';

echo json_encode([defined('Mode'), defined('MODE'), constant('Mode')]);
```

**A.**

```text
[true,true,"safe"]
```

**B.**

```text
[false,true,"safe"]
```

**C.**

```text
An Error before any JSON output
```

**D.**

```text
[true,false,"safe"]
```

### PHP-E26-0358 · revision 1

**PDO & database access · code-review · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PDO, pdo_sqlite.

Prerequisites: PDO::PARAM_INT; Input validation versus coercion; SQLite bound parameters.

A review claims PARAM_INT rejects the invalid submitted text automatically. Which assessment matches this query?

- Run in a fresh PHP process using only the displayed files and inputs.
- The fixture uses PDO SQLite with the two displayed rows. The submitted identifier is required to be decimal integer text; not-an-id is invalid and should be rejected before querying. No external database is accessed.

**main.php** (complete-file)

```php
<?php

$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY, label TEXT NOT NULL)');
$pdo->exec("INSERT INTO users VALUES (0, 'zero-record'), (1, 'one-record')");

$input = 'not-an-id';
$statement = $pdo->prepare('SELECT label FROM users WHERE id = :id');
$statement->bindValue(':id', $input, PDO::PARAM_INT);
$statement->execute();

echo json_encode($statement->fetchColumn());
```

**A.**

```text
bindValue throws TypeError because its value argument must already be an integer.
```

**B.**

```text
execute rejects the input as invalid decimal text before SQL evaluation.
```

**C.**

```text
The query searches for the original string not-an-id and therefore returns false.
```

**D.**

```text
The query finds zero-record; validate the original text separately before integer binding.
```

### PHP-E26-0226 · revision 1

**Functions & arguments · debugging · Foundation**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: max; Empty arrays; Conditional expressions.

largest must return null for an empty list and otherwise return its greatest integer, including when all integers are negative. Which return expression satisfies the three displayed calls?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

function largest(array $numbers): ?int
{
    return max($numbers);
}

try {
    echo json_encode([largest([]), largest([-7, -2]), largest([0])]);
} catch (ValueError $error) {
    echo 'ValueError';
}
```

**A.**

```text
max([0, ...$numbers])
```

**B.**

```text
max($numbers) ?? null
```

**C.**

```text
$numbers === [] ? null : max($numbers)
```

**D.**

```text
$numbers === [] ? null : (max($numbers) ?: null)
```

### PHP-E26-0519 · revision 2

**Inheritance, interfaces & traits · execution · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Readonly properties; Inherited property initialization; Inheritance scope; Uninitialized versus initialized properties.

What JSON records the inherited property value and whether the second child-method write failed?

- Run in a fresh PHP process using only the displayed files and inputs.
- Use PHP 8.4 or 8.5 as specified. The property has no explicit private(set) modifier and no initial value. This question does not use cloning or reflection.

**main.php** (complete-file)

```php
<?php

class BaseRecord
{
    public readonly int $id;
}

class ChildRecord extends BaseRecord
{
    public function __construct()
    {
        $this->id = 7;
    }

    public function replaceId(): void
    {
        $this->id = 8;
    }
}

$record = new ChildRecord();
$failed = false;

try {
    $record->replaceId();
} catch (Error $failure) {
    $failed = true;
}

echo json_encode([$record->id, $failed]);
```

**A.**

```text
An uncaught Error during construction, before JSON output
```

**B.**

```text
[8,false]
```

**C.**

```text
[7,true]
```

**D.**

```text
[8,true]
```

### PHP-E26-0471 · revision 2

**Types, casting & comparisons · implementation · Foundation**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Arrays; Traversable; Countable; Runtime type predicates.

The API accepts arrays and Traversable objects only. Which predicate yields [true,true,false,false] for the displayed values?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

class CountOnly implements Countable
{
    public function count(): int
    {
        return 0;
    }
}

function accepted(mixed $value): bool
{
    return is_object($value);
}

$values = [[], new ArrayIterator([]), new CountOnly(), new stdClass()];
echo json_encode(array_map('accepted', $values));
```

**A.**

```text
is_array($value)
```

**B.**

```text
is_object($value)
```

**C.**

```text
is_iterable($value)
```

**D.**

```text
is_countable($value)
```

### PHP-E26-0570 · revision 2

**Files & structured data · implementation · Foundation**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: CSV enclosures; Record boundaries; Delimited fields.

Which expression parses this record into exactly the required two fields?

- Run in a fresh PHP process using only the displayed files and inputs.
- This is one valid CSV record with comma delimiter, double-quote enclosure and no proprietary escape character. The required fields are Ada, Lin as one field and 7 as the second.

**main.php** (complete-file)

```php
<?php

$record = '"Ada, Lin",7';
$fields = [];
echo json_encode($fields);
```

**A.**

```text
explode(',', $record)
```

**B.**

```text
str_getcsv($record, ',', '"', '')
```

**C.**

```text
explode(',', str_replace('"', '', $record))
```

**D.**

```text
explode(',', $record, 2)
```

### PHP-E26-0006 · revision 1

**Variables, scope & constants · execution · Foundation**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Variables; Variable variables.

What text is printed? All variables shown are in the same scope.

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

$name = 'count';
$$name = 3;
$name = 'limit';
$$name = 8;

echo $count, '|', $limit;
```

**A.**

```text
8|8
```

**B.**

```text
count|limit
```

**C.**

```text
3|8
```

**D.**

```text
3|3
```

### PHP-E26-0427 · revision 1

**Arrays & destructuring · debugging · Foundation**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: Associative arrays; foreach key/value syntax; String concatenation.

The required labels are ["A:2","B:4"], but the loop reverses each pair. Which replacement loop header fixes the result?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

$weights = ['A' => 2, 'B' => 4];
$labels = [];

foreach ($weights as $weight => $name) {
    $labels[] = $name . ':' . $weight;
}

echo json_encode($labels);
```

**A.**

```text
foreach (array_keys($weights) as $name => $weight)
```

**B.**

```text
foreach ($weights as $name => $weight)
```

**C.**

```text
foreach (array_values($weights) as $name => $weight)
```

**D.**

```text
foreach ($weights as $weight => $name)
```

### PHP-E26-0314 · revision 2

**Functions & arguments · execution · Intermediate**

PHP 8.4 / 8.5. CLI unless the stated context specifies otherwise. E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale.
Required extensions: PHP core only.

Prerequisites: strtok initial and continuation forms; Function-level parsing state.

What JSON array is printed?

- Run in a fresh PHP process using only the displayed files and inputs.

**main.php** (complete-file)

```php
<?php

$first = strtok('red,green', ',');
$other = strtok('up:down', ':');
$next = strtok(',');
$last = strtok(':');

echo json_encode([$first, $other, $next, $last]);
```

**A.**

```text
["red","up","green","down"]
```

**B.**

```text
["red","up","up:down",false]
```

**C.**

```text
["red","up","down",false]
```

**D.**

```text
["red","up",false,"down"]
```

## Answer keys, explanations and validation evidence

### PHP-E26-0022

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (trait-alias-keeps-original-method): Distinguish creating a private trait alias from changing the original method’s visibility.

Difficulty rationale: Resolve a trait adaptation and the visibility of the unchanged original name.

Working lesson mapping: 25, 29; complete coverage: true.

**Correct: D (original)**

A trait alias adds another method name. Giving that alias private visibility leaves the original public method unchanged.

Trace: Greeter has public hello and private hiddenHello. The shown call uses public hello once.

- **A:** The as clause adds an alias and does not remove the original name. Misunderstanding: Treating trait aliasing as destructive renaming.
- **B:** The private visibility applies to hiddenHello, the new alias. Misunderstanding: Applying an alias’s visibility modifier to the original method.
- **C:** Trait alias visibility can differ from the original method; this declaration is valid. Misunderstanding: Confusing alias visibility adaptation with an incompatible inherited-method override.
- **D:** The original public hello remains available alongside its private alias.

Audit note: hellohello implies two invocations although only one call exists. Replace with a plausible trait-alias declaration error misconception.

Validation kind: output. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0022",
      "kind": "output",
      "key": "original",
      "observations": [
        {
          "stdout": "hello",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0022",
      "kind": "output",
      "key": "original",
      "observations": [
        {
          "stdout": "hello",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/language.oop5.traits.php)

### PHP-E26-0050

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (exception-sentinel-domain-collision): Review a failure sentinel that collides with a successful domain result.

Difficulty rationale: Distinguish a valid negative answer from infrastructure failure across an API boundary.

Working lesson mapping: 5, 22; complete coverage: true.

**Correct: B (propagate)**

The catch converts an infrastructure failure into the same value used for a successful domain answer. Keeping the exception preserves the distinction without changing the meaning of false.

Trace: The calls return true, false and false. The last false hides a storage exception. Removing the catch preserves the first two booleans and propagates the original failure for the third call.

- **A:** Logging can aid diagnosis but leaves callers unable to distinguish an inactive account from failed storage. Misunderstanding: Treating a diagnostic side effect as a distinct return-channel outcome.
- **B:** A successful lookup returns an account status; storage failure remains on the exception channel.
- **C:** This makes storage failure indistinguishable from a successful active-account result. Misunderstanding: Moving the failure collision to the other successful boolean value.
- **D:** A persistent outage still becomes an inactive-account result after the retry. Misunderstanding: Assuming a retry removes the need for an unambiguous final failure channel.

Audit note: Distinct runtime types for two false values and casting an already boolean result are weak alternatives. Use realistic logging/retry/error-sentinel proposals with an explicit active/inactive/error outcome contract.

Validation kind: contract. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0050",
      "kind": "contract",
      "key": "propagate",
      "observations": [
        {
          "stdout": "[true,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "propagate",
          "stdout": "",
          "exitCode": 255,
          "expectedError": "storage unavailable"
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0050",
      "kind": "contract",
      "key": "propagate",
      "observations": [
        {
          "stdout": "[true,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "propagate",
          "stdout": "",
          "exitCode": 255,
          "expectedError": "storage unavailable"
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/language.exceptions.php)

### PHP-E26-0056

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (constant-time-token-comparison): Review a secret comparison for strict equality and timing-resistant comparison.

Difficulty rationale: Separate type-juggling prevention from the additional timing requirement.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: D (hash-equals)**

Loose comparison can treat numeric-looking strings as numbers. Strict comparison fixes that issue, but hash_equals additionally satisfies the explicit timing-safe API requirement.

Trace: The displayed loose comparison returns true because both strings represent zero in scientific notation. hash_equals compares their different bytes and returns false.

- **A:** Both operands are already strings; loose numeric-string comparison still treats both as zero. Misunderstanding: Assuming string casts disable numeric-string comparison.
- **B:** Identity rejects these values, but does not provide the requested timing-safe API contract. Misunderstanding: Treating strict equality as a timing guarantee.
- **C:** This compares contents correctly but is not the requested timing-safe comparison API. Misunderstanding: Assuming all string comparison functions are timing resistant.
- **D:** hash_equals compares the known string with the user-supplied string using the intended timing-safe API.

Audit note: Strict equality and strcmp fix content comparison but fail the separate timing-safe requirement. Cross-cutting review: hash_equals uniquely names the correct option in prerequisites; replace with neutral comparison and token concepts.

Validation kind: contract. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0056",
      "kind": "contract",
      "key": "hash-equals",
      "observations": [
        {
          "stdout": "true",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0056",
      "kind": "contract",
      "key": "hash-equals",
      "observations": [
        {
          "stdout": "true",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.hash-equals.php)
- [Primary reference](https://www.php.net/manual/en/language.operators.comparison.php)

### PHP-E26-0078

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (unambiguous-binary-field-signing-frame): Encode two ordered byte-string fields unambiguously before computing a message authentication code.

Difficulty rationale: Reject ambiguous concatenation, delimiter collision and order erasure in a signing protocol.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: A (lengths)**

An unambiguous MAC input must preserve field boundaries and order. A fixed-width length prefix followed by that many bytes provides a unique parse for each bounded field.

Trace: The witnesses include ambiguous raw boundaries, embedded delimiters, reversed fields and distinct invalid UTF-8 bytes. The delimiter, sorting and substitution alternatives each lose a required distinction; binary length prefixes preserve all four pairs.

- **A:** Fixed-width byte lengths identify each boundary, and the original field order is retained.
- **B:** Distinct invalid UTF-8 bytes can both become U+FFFD, so this loses byte identity. Misunderstanding: Assuming JSON with UTF-8 substitution preserves arbitrary binary fields.
- **C:** A newline within a field can collide with the separator, as the second pair demonstrates. Misunderstanding: Using a delimiter without escaping or restricting field contents.
- **D:** Sorting erases the required field order; x/y and y/x collide. Misunderstanding: Confusing canonical ordering of an unordered set with encoding an ordered tuple.

Audit note: Arbitrary bytes, delimiter ambiguity, order and malformed UTF-8 defeat plausible encodings; longest key expression necessary, not filler. Cross-cutting review: pack and strlen in prerequisites identify the only correct framing recipe; retain byte boundaries, field ordering and binary encoding concepts.

Validation kind: patch. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0078",
      "kind": "patch",
      "key": "lengths",
      "observations": [
        {
          "option": "lengths",
          "meets": true,
          "stdout": "[false,false,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "json-substitute",
          "meets": false,
          "stdout": "[false,false,false,true]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "newline",
          "meets": false,
          "stdout": "[false,true,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "sorted",
          "meets": false,
          "stdout": "[false,false,true,false]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0078",
      "kind": "patch",
      "key": "lengths",
      "observations": [
        {
          "option": "lengths",
          "meets": true,
          "stdout": "[false,false,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "json-substitute",
          "meets": false,
          "stdout": "[false,false,false,true]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "newline",
          "meets": false,
          "stdout": "[false,true,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "sorted",
          "meets": false,
          "stdout": "[false,false,true,false]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.pack.php)
- [Primary reference](https://www.php.net/manual/en/function.hash-hmac.php)

### PHP-E26-0079

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (transactional-outbox-durable-intent): Choose a PHP persistence workflow that atomically records business changes and a durable publication intent.

Difficulty rationale: Account for crash windows across a database transaction and a separate message broker without a distributed transaction.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: C (outbox)**

The database transaction can make the order and publication intent atomic. The worker bridges to the broker with retries, while event IDs and consumer deduplication handle duplicate delivery.

Trace: Before commit, neither record is durable. After commit, both exist. A crash before or after publishing leaves enough durable state for retry; duplicate publication is within the stated contract.

- **A:** A later database failure can leave a notification for an order that never committed. Misunderstanding: Assuming broker success can be rolled back with an unrelated database transaction.
- **B:** A crash after commit but before publish loses the notification intent. Misunderstanding: Treating request sequencing as durable atomic coordination.
- **C:** The committed outbox record durably retains the publication intent across process crashes.
- **D:** A callback in process memory is not durable and may not run after a crash. Misunderstanding: Treating a shutdown hook as a persistent job queue.

Audit note: Visible prerequisite and assumptions already name outbox and describe its atomic write plus retry worker. State neutral database/broker capabilities and crash/recovery requirements instead. The original publish-before-commit option also satisfied the one-way post-commit liveness requirement; add the missing prohibition on notifying rolled-back orders.

Validation kind: document-review. Documentation and stated-contract reasoning only; no external service or real browser/HTTP/FPM/queue behavior was executed for this question.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0079",
      "kind": "document-review",
      "key": "outbox",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Atomic order/outbox commit closes the lost-intent crash window; broker publication remains at least once, not exactly once.",
          "optionAudit": {
            "publish-before": "Can publish an event for rolled-back work",
            "commit-publish": "Crash gap after commit loses intent",
            "outbox": "Durable same-transaction intent plus retry meets the stated contract",
            "shutdown": "Process-memory callback is not crash-durable"
          }
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0079",
      "kind": "document-review",
      "key": "outbox",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Atomic order/outbox commit closes the lost-intent crash window; broker publication remains at least once, not exactly once.",
          "optionAudit": {
            "publish-before": "Can publish an event for rolled-back work",
            "commit-publish": "Crash gap after commit loses intent",
            "outbox": "Durable same-transaction intent plus retry meets the stated contract",
            "shutdown": "Process-memory callback is not crash-durable"
          }
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/pdo.transactions.php)
- [Primary reference](https://microservices.io/patterns/data/transactional-outbox.html)

### PHP-E26-0098

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (authorization-cache-complete-decision-key): Choose a cache key that identifies every input to a tenant-scoped authorization decision.

Difficulty rationale: Derive cache identity from per-tenant, per-user and per-resource policy differences and revision invalidation.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: D (complete-key)**

A cached decision is valid only for the same authorization inputs. Tenant, user, resource and policy revision each distinguish cases that may legitimately have different outcomes.

Trace: Cross-tenant IDs remain separate; user overrides remain separate; resources remain separate; new policy revisions bypass earlier decisions.

- **A:** Users sharing a role may have different overrides, so their decisions cannot share this key. Misunderstanding: Treating roles as complete user authorization identity.
- **B:** Different resources of the same type may have different access decisions. Misunderstanding: Replacing resource identity with its category.
- **C:** Permission changes can reuse an old cached decision because the revision is absent. Misunderstanding: Using request context as a substitute for authorization invalidation state.
- **D:** The key includes each stated decision input and changes when any of them changes.

Audit note: Assumptions enumerate the exact four components later repeated verbatim by the key. Replace with behavior/race constraints from which dependencies must be derived; classify Intermediate.

Validation kind: document-review. Documentation and stated-contract reasoning only; no external service or real browser/HTTP/FPM/queue behavior was executed for this question.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0098",
      "kind": "document-review",
      "key": "complete-key",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Cache correctness requires identical keys to imply identical relevant inputs under the stated decision function.",
          "optionAudit": {
            "role-key": "Conflates users with different overrides",
            "type-key": "Conflates distinct resources",
            "method-key": "Conflates old and new policies",
            "complete-key": "Preserves all declared decision dimensions"
          }
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0098",
      "kind": "document-review",
      "key": "complete-key",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Cache correctness requires identical keys to imply identical relevant inputs under the stated decision function.",
          "optionAudit": {
            "role-key": "Conflates users with different overrides",
            "type-key": "Conflates distinct resources",
            "method-key": "Conflates old and new policies",
            "complete-key": "Preserves all declared decision dimensions"
          }
        }
      ]
    }
  }
]
```

- [Primary reference](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

### PHP-E26-0145

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (final-trait-alias-with-overridable-original): Seal a public trait alias while leaving the original method overridable in subclasses.

Difficulty rationale: Combine trait aliasing, final adaptation and inheritance compatibility.

Working lesson mapping: 26, 29; complete coverage: false.

**Correct: B (final-alias)**

Trait adaptation can create a new final alias without changing the original method’s finality. Omitting a new visibility modifier preserves the trait method’s public visibility.

Trace: ChildWorker::run returns child. sealed retains the trait implementation and returns trait, while Reflection confirms the alias is final.

- **A:** The first adaptation seals run itself, so ChildWorker cannot override it even though sealed is also created. Misunderstanding: Sealing the original method while intending to seal only its alias.
- **B:** The separate alias is final and retains public visibility; the original run remains overridable.
- **C:** Trait adaptations resolve methods from the trait; the newly introduced alias is not another trait method to adapt. Misunderstanding: Treating alias adaptations as sequential statements that can adapt an earlier alias.
- **D:** The final modifier must precede the alias name; this adaptation is a syntax error. Misunderstanding: Placing the final modifier after the new alias name.

Audit note: Only the key contains both required words final and sealed. Use plausible complete adaptations that all attempt both requirements, including original/alias confusion and adaptation grammar errors.

Validation kind: patch. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "ff536595be770f7b649735390102e456f03bb34a7b766c1c44eea5f9792eef42",
    "result": {
      "id": "PHP-E26-0145",
      "kind": "patch",
      "key": "final-alias",
      "observations": [
        {
          "option": "nonfinal",
          "meets": false,
          "stdout": "",
          "exitCode": 255,
          "expectedError": "Cannot override final method"
        },
        {
          "option": "final-alias",
          "meets": true,
          "stdout": "[\"child\",\"trait\",true]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "original-final",
          "meets": false,
          "stdout": "",
          "exitCode": 255,
          "expectedError": "does not exist"
        },
        {
          "option": "protected-alias",
          "meets": false,
          "stdout": "",
          "exitCode": 255,
          "expectedError": "syntax error"
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "ff536595be770f7b649735390102e456f03bb34a7b766c1c44eea5f9792eef42",
    "result": {
      "id": "PHP-E26-0145",
      "kind": "patch",
      "key": "final-alias",
      "observations": [
        {
          "option": "nonfinal",
          "meets": false,
          "stdout": "",
          "exitCode": 255,
          "expectedError": "Cannot override final method"
        },
        {
          "option": "final-alias",
          "meets": true,
          "stdout": "[\"child\",\"trait\",true]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "original-final",
          "meets": false,
          "stdout": "",
          "exitCode": 255,
          "expectedError": "does not exist"
        },
        {
          "option": "protected-alias",
          "meets": false,
          "stdout": "",
          "exitCode": 255,
          "expectedError": "syntax error"
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/language.oop5.traits.php#language.oop5.traits.final-methods)

### PHP-E26-0193

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (domain-outcome-transport-specific-mapping): Keep business outcomes reusable while HTTP and CLI adapters choose different transport representations.

Difficulty rationale: Separate a domain decision from protocol status and process exit conventions.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: C (domain-outcome)**

The validation decision is shared business information; HTTP response status and CLI exit status are adapter responsibilities. A neutral result lets those mappings differ without embedding transport policy in the domain API.

Trace: The HTTP adapter maps an invalid result to 422; the CLI adapter maps it to exit code 2. A later adapter adds its own mapping without changing the validation decision or its domain representation.

- **A:** This makes the domain API and non-HTTP adapters depend on HTTP semantics. Misunderstanding: Using one transport’s status vocabulary as the shared business result.
- **B:** The domain now knows both transports and needs changes when another transport is added. Misunderstanding: Treating runtime detection as separation of domain and transport concerns.
- **C:** The domain decision stays unchanged while each adapter owns its transport representation.
- **D:** The domain result explicitly contains transport concepts and must expand for a new transport. Misunderstanding: Assuming packaging multiple transport details in a DTO removes the coupling.

Audit note: Externally flagged: supplied enum/adapters implement the exact proposed answer. Remove solution witness from student content and use a requirement-only scenario; original objective preserved.

Validation kind: document-review. Documentation and stated-contract reasoning only; no external service or real browser/HTTP/FPM/queue behavior was executed for this question.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "ff536595be770f7b649735390102e456f03bb34a7b766c1c44eea5f9792eef42",
    "result": {
      "id": "PHP-E26-0193",
      "kind": "document-review",
      "key": "domain-outcome",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "The stated domain API must express only the shared validation decision. Each entry point owns the required HTTP status or CLI exit code; adding a transport must not alter the domain API.",
          "optionAudit": {
            "http-domain": "HTTP status 422 becomes part of the shared API, making the CLI depend on HTTP semantics.",
            "sapi-branch": "Transport detection and per-transport branches move into the shared validation service.",
            "domain-outcome": "A neutral validation result is reusable; the entry points separately map it to 422 or 2.",
            "paired-statuses": "The domain result carries transport-specific fields and needs extension for another transport."
          }
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "ff536595be770f7b649735390102e456f03bb34a7b766c1c44eea5f9792eef42",
    "result": {
      "id": "PHP-E26-0193",
      "kind": "document-review",
      "key": "domain-outcome",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "The stated domain API must express only the shared validation decision. Each entry point owns the required HTTP status or CLI exit code; adding a transport must not alter the domain API.",
          "optionAudit": {
            "http-domain": "HTTP status 422 becomes part of the shared API, making the CLI depend on HTTP semantics.",
            "sapi-branch": "Transport detection and per-transport branches move into the shared validation service.",
            "domain-outcome": "A neutral validation result is reusable; the entry points separately map it to 422 or 2.",
            "paired-statuses": "The domain result carries transport-specific fields and needs extension for another transport."
          }
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/language.enumerations.php)
- [Primary reference](https://www.php.net/manual/en/function.http-response-code.php)
- [Primary reference](https://www.php.net/manual/en/function.exit.php)

### PHP-E26-0199

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (ordered-event-gap-recovery): Preserve per-entity transition order when an at-least-once transport delivers events out of order.

Difficulty rationale: Combine duplicate suppression, sequence validation and recovery of missing transitions.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: D (recover-gap)**

Sequence checks prevent invalid transitions, but gaps also require a recovery path. Atomic projection/version updates distinguish already applied events from the next event and from future events.

Trace: Version 6 is deferred when the stored version is 4. After version 5 is applied, version 6 becomes the next admissible transition; repeated versions at or below the applied version do not apply again.

- **A:** Unique event IDs do not make version 6 valid before version 5. Misunderstanding: Treating duplicate suppression as an ordering guarantee.
- **B:** Applying 6 skips transition 5 and later discards it as older. Misunderstanding: Treating a high-water mark as proof that all earlier transitions were applied.
- **C:** Version 6 is lost when first acknowledged, even if version 5 arrives later. Misunderstanding: Checking order without preserving or recovering deferred work.
- **D:** The gap is retained or recovered, so 5 can be applied before 6 while redeliveries remain harmless.

Audit note: Only the key specifies a complete apply/acknowledge/recovery policy. Make all alternatives realistic complete consumer policies while preserving their ordering/gap mistakes; no filler quota.

Validation kind: document-review. Documentation and stated-contract reasoning only; no external service or real browser/HTTP/FPM/queue behavior was executed for this question.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "ff536595be770f7b649735390102e456f03bb34a7b766c1c44eea5f9792eef42",
    "result": {
      "id": "PHP-E26-0199",
      "kind": "document-review",
      "key": "recover-gap",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Evaluate the provided 6-before-5 schedule with atomic applied-version updates and durable gap recovery.",
          "optionAudit": {
            "id-only": "Applies a distinct but premature version 6.",
            "highest": "Skips version 5 permanently.",
            "drop-gap": "Acknowledges version 6 without preserving it.",
            "recover-gap": "Preserves order and retains a route to eventual application."
          }
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "ff536595be770f7b649735390102e456f03bb34a7b766c1c44eea5f9792eef42",
    "result": {
      "id": "PHP-E26-0199",
      "kind": "document-review",
      "key": "recover-gap",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Evaluate the provided 6-before-5 schedule with atomic applied-version updates and durable gap recovery.",
          "optionAudit": {
            "id-only": "Applies a distinct but premature version 6.",
            "highest": "Skips version 5 permanently.",
            "drop-gap": "Acknowledges version 6 without preserving it.",
            "recover-gap": "Preserves order and retains a route to eventual application."
          }
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Resequencer.html)

### PHP-E26-0300

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (rename-stable-lock-identity): Choose a lock identity that remains shared when data files are atomically replaced.

Difficulty rationale: Trace coordination across pathname replacement and already-open file handles.

Working lesson mapping: 20; complete coverage: false.

**Correct: D (stable-lock)**

The synchronization object must outlive each replaceable data-file instance. A separate stable lock file gives every cooperating writer the same lock throughout the complete operation.

Trace: Writer B blocks on the permanent lock while A reads and replaces state.json. Once A releases it, B opens the current data file and performs the next update.

- **A:** After replacement, another worker can open and lock the new file while the first still holds a lock on the old file. Misunderstanding: Assuming a lock follows a pathname through replacement.
- **B:** Different temporary files have different locks, so writers do not contend. Misunderstanding: Treating exclusive locks on different resources as shared coordination.
- **C:** The read-modify-replace sequence has already run without mutual exclusion. Misunderstanding: Acquiring a lock after the operation it must protect.
- **D:** Every writer contends on one unchanged file identity across data-file replacements.

Audit note: Assumptions teach file-object locking and nontransfer on rename, and advertise a permanent lock identity. Retain POSIX/atomic-rename/cooperating-writer capabilities but remove the explanation of lock identity behavior so learners must derive the stable-lock protocol.

Validation kind: document-review. Documentation and stated-contract reasoning only; no external service or real browser/HTTP/FPM/queue behavior was executed for this question.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "0f0e297f238aa2059e11df5ac44b7db8f642413d8f7b7614575150065c16dae2",
    "result": {
      "id": "PHP-E26-0300",
      "kind": "document-review",
      "key": "stable-lock",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Under the stated POSIX identity model, replacement changes the data file object but not a separate permanent lock object.",
          "optionAudit": {
            "data-lock": "Old and new data objects can be locked independently.",
            "temp-lock": "Each writer locks its own unrelated object.",
            "after-rename": "The protected work occurs before acquisition.",
            "stable-lock": "All writers share an invariant lock identity for the full critical section."
          }
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "0f0e297f238aa2059e11df5ac44b7db8f642413d8f7b7614575150065c16dae2",
    "result": {
      "id": "PHP-E26-0300",
      "kind": "document-review",
      "key": "stable-lock",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Under the stated POSIX identity model, replacement changes the data file object but not a separate permanent lock object.",
          "optionAudit": {
            "data-lock": "Old and new data objects can be locked independently.",
            "temp-lock": "Each writer locks its own unrelated object.",
            "after-rename": "The protected work occurs before acquisition.",
            "stable-lock": "All writers share an invariant lock identity for the full critical section."
          }
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.flock.php)
- [Primary reference](https://www.php.net/manual/en/function.rename.php)

### PHP-E26-0343

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (webhook-mac-exact-body-representation): Repair signature verification that changes a request body before authenticating its bytes.

Difficulty rationale: Distinguish semantic JSON equivalence from the exact byte sequence covered by a message authentication code.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: B (raw)**

A MAC authenticates bytes, not an abstract JSON value. Verification must use the sender’s exact representation; parsing may occur afterward for application processing.

Trace: The fixture body contains a leading space, an internal space and a terminal newline. Passing raw unchanged verifies; trimming or serializing changes the authenticated bytes.

- **A:** Those bytes are explicitly covered by the sender’s MAC and cannot be removed. Misunderstanding: Assuming JSON-insignificant surrounding whitespace is also insignificant to HMAC.
- **B:** This is the same byte sequence the sender authenticated.
- **C:** Re-encoding changes spacing and may change other representational details while retaining the same data. Misunderstanding: Assuming semantically equivalent JSON necessarily has an identical MAC.
- **D:** PHP serialization is a different wire representation from the sender’s JSON body. Misunderstanding: Treating an unambiguous local serialization as interchangeable with the signed protocol bytes.

Audit note: Source computes the sender MAC directly from $raw, demonstrating the byte selection being asked. Replace it with the corresponding fixed fixture MAC and preserve protocol context. Change Advanced to Intermediate for raw-byte versus parsed-value authentication.

Validation kind: patch. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "2c32877e3dd1df895e0861848166f14be46cfe0472b8fd6bd75614a12c80c3cf",
    "result": {
      "id": "PHP-E26-0343",
      "kind": "patch",
      "key": "raw",
      "observations": [
        {
          "original": true,
          "stdout": "false",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "trimmed",
          "meets": false,
          "stdout": "false",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "raw",
          "meets": true,
          "stdout": "true",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "json",
          "meets": false,
          "stdout": "false",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "serialized",
          "meets": false,
          "stdout": "false",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "2c32877e3dd1df895e0861848166f14be46cfe0472b8fd6bd75614a12c80c3cf",
    "result": {
      "id": "PHP-E26-0343",
      "kind": "patch",
      "key": "raw",
      "observations": [
        {
          "original": true,
          "stdout": "false",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "trimmed",
          "meets": false,
          "stdout": "false",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "raw",
          "meets": true,
          "stdout": "true",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "json",
          "meets": false,
          "stdout": "false",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "serialized",
          "meets": false,
          "stdout": "false",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.hash-hmac.php)
- [Primary reference](https://www.php.net/manual/en/function.hash-equals.php)

### PHP-E26-0355

Selection: targeted. Audit: unresolved. Independent approval: pending.

Objective (redirect-method-preservation-review): Review a redirect status against a requirement to preserve the original POST method and body.

Difficulty rationale: Distinguish preserving a request’s method and body from redirecting to retrieval of a result resource.

Working lesson mapping: 12; complete coverage: false.

**Correct: B (see-other)**

307 is a method-preserving redirect. A successful POST that should lead to viewing a separate receipt uses the retrieval semantics of 303 See Other.

Trace: With 307, the follow-up remains POST /receipt with its body. With the intended 303 flow, the browser retrieves /receipt instead.

- **A:** 307 preserves the request method and body on automatic redirection. Misunderstanding: Treating every redirect as a method-changing redirect.
- **B:** 303 directs the client to retrieve another resource instead of replaying the original POST.
- **C:** 307 does not define that body-dropping conversion, and POST without a body is still POST. Misunderstanding: Equating an empty body with safe-method semantics.
- **D:** 308 also preserves the method; its permanent status does not supply the desired method change. Misunderstanding: Confusing permanence with request-method conversion.

Audit note: Redirect method semantics, not the mere presence of 303 in metadata, distinguish all four status interpretations; no real redirect execution is claimed. Stored objective says preserve the original POST method/body, contradicting the scenario, key and explanations requiring retrieval via 303. Changing the objective or reversing the scenario requires an editorial intent decision; preserve this record and surface it for independent review.

Validation kind: document-review. Documentation and stated-contract reasoning only; no external service or real browser/HTTP/FPM/queue behavior was executed for this question.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "2c32877e3dd1df895e0861848166f14be46cfe0472b8fd6bd75614a12c80c3cf",
    "result": {
      "id": "PHP-E26-0355",
      "kind": "document-review",
      "key": "see-other",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "RFC 9110 defines 307 method preservation and 303 retrieval of another resource following the original request.",
          "optionAudit": {
            "always-get": "Contradicts 307 method preservation.",
            "see-other": "Selects the retrieval redirect semantics required by the scenario.",
            "drop-body": "Invents a body-dropping POST conversion.",
            "permanent": "308 does not change POST into GET."
          }
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "2c32877e3dd1df895e0861848166f14be46cfe0472b8fd6bd75614a12c80c3cf",
    "result": {
      "id": "PHP-E26-0355",
      "kind": "document-review",
      "key": "see-other",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "RFC 9110 defines 307 method preservation and 303 retrieval of another resource following the original request.",
          "optionAudit": {
            "always-get": "Contradicts 307 method preservation.",
            "see-other": "Selects the retrieval redirect semantics required by the scenario.",
            "drop-body": "Invents a body-dropping POST conversion.",
            "permanent": "308 does not change POST into GET."
          }
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.4.4)
- [Primary reference](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.4.8)

### PHP-E26-0432

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (json-top-level-object-with-nested-lists): Force only the top-level JSON value to be an object while preserving nested arrays as lists.

Difficulty rationale: Distinguish a shallow PHP object cast from a recursive JSON encoding flag.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: A (cast-root)**

Casting the outer array to object changes that one container. JSON_FORCE_OBJECT instead applies to arrays encountered throughout the encoded value, including nested lists.

Trace: The empty input becomes {}. The map becomes {"items":[1,2]}, preserving items as a list.

- **A:** The cast makes the root an object without converting the nested PHP list.
- **B:** The nonempty map has the desired shape, but an empty PHP array encodes as [] instead of {}. Misunderstanding: Fixing the nested list while overlooking the empty-root contract.
- **C:** The flag also changes nested numeric arrays into objects. Misunderstanding: Treating an encoding flag as limited to the root value.
- **D:** This removes the map’s field names and produces a list at the root. Misunderstanding: Normalizing list indexes when the root contract requires a named object.

Audit note: Stem refers to both required response shapes without printing them or explicitly requiring an empty top-level object. Add the exact expected output [{},{"items":[1,2]}] so plain json_encode cannot be defended from an inferred map convention.

Validation kind: patch. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0432",
      "kind": "patch",
      "key": "cast-root",
      "observations": [
        {
          "option": "cast-root",
          "meets": true,
          "stdout": "[{},{\"items\":[1,2]}]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "no-root-conversion",
          "meets": false,
          "stdout": "[[],{\"items\":[1,2]}]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "recursive-flag",
          "meets": false,
          "stdout": "[{},{\"items\":{\"0\":1,\"1\":2}}]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "values-list",
          "meets": false,
          "stdout": "[[],[[1,2]]]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0432",
      "kind": "patch",
      "key": "cast-root",
      "observations": [
        {
          "option": "cast-root",
          "meets": true,
          "stdout": "[{},{\"items\":[1,2]}]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "no-root-conversion",
          "meets": false,
          "stdout": "[[],{\"items\":[1,2]}]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "recursive-flag",
          "meets": false,
          "stdout": "[{},{\"items\":{\"0\":1,\"1\":2}}]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "values-list",
          "meets": false,
          "stdout": "[[],[[1,2]]]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/json.constants.php)
- [Primary reference](https://www.php.net/manual/en/language.types.object.php#language.types.object.casting)

### PHP-E26-0447

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (nullable-return-fallthrough-requires-explicit-null): Review the assumption that a nullable return declaration permits falling off the end without returning.

Difficulty rationale: Distinguish an allowed null value from the absence of a return value under a declared return contract.

Working lesson mapping: 1, 5; complete coverage: true.

**Correct: B (explicit-return)**

A nullable type describes values the function may return. It does not turn a missing return into an explicit null return for a function with this declared return type.

Trace: The true path returns yes. The false path raises TypeError and the catch records that label.

- **A:** Falling off this declared-return function raises TypeError; an explicit return null is needed. Misunderstanding: Equating an allowed null value with no return statement.
- **B:** The nullable declaration permits returning null, but the function must actually return it.
- **C:** A bare return is invalid in this nullable typed function. The permitted null value must be returned explicitly. Misunderstanding: Treating an absent return expression as a returned null value in a typed function.
- **D:** This missing-return violation occurs in weak mode too; scalar coercion does not supply a return value. Misunderstanding: Applying scalar coercion rules to a function that returns no value.

Audit note: Nullable return types not allowed is an implausible PHP 8 option. Replace it with the real misconception that a bare return is equivalent to explicit return null for a nullable typed function, and validate the compile-time distinction.

Validation kind: contract. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0447",
      "kind": "contract",
      "key": "explicit-return",
      "observations": [
        {
          "stdout": "[\"yes\",\"TypeError\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "explicit-null-return",
          "stdout": "[\"yes\",null]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "bare-return-is-invalid",
          "stdout": "",
          "exitCode": 255,
          "expectedError": "must return a value"
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0447",
      "kind": "contract",
      "key": "explicit-return",
      "observations": [
        {
          "stdout": "[\"yes\",\"TypeError\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "explicit-null-return",
          "stdout": "[\"yes\",null]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "bare-return-is-invalid",
          "stdout": "",
          "exitCode": 255,
          "expectedError": "must return a value"
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/functions.returning-values.php)
- [Primary reference](https://www.php.net/manual/en/language.types.declarations.php)

### PHP-E26-0489

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (generator-error-test-advances-to-failing-element): Place a generator error assertion around the traversal that actually reaches the invalid element.

Difficulty rationale: Distinguish creating a lazy computation, observing its first yield and advancing into a later failure.

Working lesson mapping: 22; complete coverage: false.

**Correct: D (reach-negative)**

Generator code executes as it is consumed. The negative row is not reached at construction or at the first current call, so the error assertion must cover the subsequent advance.

Trace: The displayed creation-only check prints created. Reading current would yield 1; the next advance resumes at -1 and throws DomainException to the consumer.

- **A:** Creating the generator does not run its body, so the negative element is not examined. Misunderstanding: Expecting validation inside a generator to run at function-call time.
- **B:** The first element is positive and is yielded normally. Misunderstanding: Assuming starting a generator eagerly validates every remaining input.
- **C:** The type check says nothing about whether traversal rejects a negative row. Misunderstanding: Substituting a container-interface assertion for behavior during consumption.
- **D:** Advancing past the first yield reaches -1 and executes the rejection branch.

Audit note: Displayed code already reads current and catches next, exactly demonstrating the correct test strategy. Replace observation harness with a flawed creation-only catch; retain generator and objective, update runtime witness and explanatory trace.

Validation kind: contract. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0489",
      "kind": "contract",
      "key": "reach-negative",
      "observations": [
        {
          "stdout": "created",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "advance-to-negative",
          "stdout": "rejected",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0489",
      "kind": "contract",
      "key": "reach-negative",
      "observations": [
        {
          "stdout": "created",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "advance-to-negative",
          "stdout": "rejected",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/language.generators.overview.php)
- [Primary reference](https://www.php.net/manual/en/generator.next.php)

### PHP-E26-0549

Selection: targeted. Audit: unresolved. Independent approval: pending.

Objective (empty-minimum-array-raises-valueerror): Review an empty-input path that assumes min returns a nullable sentinel.

Difficulty rationale: Apply the built-in function’s empty-array failure contract to a nullable return declaration.

Working lesson mapping: 4, 5, 22; complete coverage: true.

**Correct: C (guard-empty)**

min on an empty array raises ValueError. A nullable return declaration permits returning null but does not manufacture it when evaluation fails.

Trace: The current call prints empty-error. An explicit empty-list guard returns null instead.

- **A:** A return type does not catch or translate an exception raised while evaluating the return expression. Misunderstanding: Treating a nullable declaration as automatic failure recovery.
- **B:** There is no zero identity for min over an empty PHP array; it raises ValueError. Misunderstanding: Borrowing an empty-sum identity for a minimum operation.
- **C:** The guard implements the promised empty-input behavior and leaves nonempty minima unchanged.
- **D:** The value is already an array; its lack of elements remains the problem. Misunderstanding: Confusing accepted argument type with a valid value within that type.

Audit note: Strong reasoning duplicate of 0226: nullable aggregate helper calls min/max on empty input and must guard before invocation. 0226 already covers the empty rule plus zero/negative preservation. Changing min to max or switching execution to review adds insufficient new reasoning; preserve both IDs/objectives and request independent retain/retarget decision rather than silently replace 0549.

Validation kind: contract. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0549",
      "kind": "contract",
      "key": "guard-empty",
      "observations": [
        {
          "stdout": "empty-error",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "empty-contract",
          "stdout": "null",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0549",
      "kind": "contract",
      "key": "guard-empty",
      "observations": [
        {
          "stdout": "empty-error",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "contrast": "empty-contract",
          "stdout": "null",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.min.php)

### PHP-E26-0557

Selection: targeted. Audit: unresolved. Independent approval: pending.

Objective (session-array-writes-after-close-not-persisted): Review mutations of the in-memory session array after session_write_close has ended the persistence lifecycle.

Difficulty rationale: Distinguish retained PHP variables from an active session write operation.

Working lesson mapping: 19; complete coverage: true.

**Correct: D (move-before-close)**

session_write_close saves the active session and releases it. Subsequent array changes are ordinary local mutations until an active session lifecycle is established; reopening reloads the stored state.

Trace: saved is written at close. local-only changes memory after close. Reopening loads saved, which is printed.

- **A:** The variable remains accessible, but the session write lifecycle has ended. Misunderstanding: Equating an existing array with an active persistence channel.
- **B:** Closing writes and releases the session; it does not make the array assignment invalid. Misunderstanding: Confusing closing persistence with deleting local variables.
- **C:** Reopening reads persisted data; it is not a flush of the inactive local array. Misunderstanding: Treating start as an implicit commit of unsaved local changes.
- **D:** The saved record remains saved, which is loaded when the session starts again.

Audit note: Strong duplicate of 0431: session_write_close followed by local SESSION mutation and reopen loses that mutation; same required repair before-close or reopen-before-write, with only labels and format changed. Preserve objective and IDs; independent review must decide whether to retain both or authorize retargeting.

Validation kind: contract. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0557",
      "kind": "contract",
      "key": "move-before-close",
      "observations": [
        {
          "stdout": "saved",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0557",
      "kind": "contract",
      "key": "move-before-close",
      "observations": [
        {
          "stdout": "saved",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.session-write-close.php)
- [Primary reference](https://www.php.net/manual/en/function.session-start.php)

### PHP-E26-0591

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (base64-canonical-pad-bits-roundtrip-test): Test canonical Base64 spelling rather than only successful strict-mode decoding.

Difficulty rationale: Distinguish alphabet validation from nonzero unused pad bits that can decode to the same bytes.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: C (noncanonical-pad-bits)**

Strict decoding checks decodability and alphabet rules but does not guarantee one canonical spelling. Re-encoding decoded bytes and comparing exact text detects the alternate pad-bit representation.

Trace: Zh== decodes to f; encoding f produces Zg==, so exact canonical comparison rejects Zh==.

- **A:** Both checks accept the canonical spelling. Misunderstanding: Testing only the standard representation.
- **B:** Strict decoding already rejects these foreign alphabet characters. Misunderstanding: Testing alphabet rejection rather than canonical pad bits.
- **C:** PHP decodes it successfully, but re-encoding the bytes yields Zg==, exposing the noncanonical spelling.
- **D:** The stated protocol accepts empty bytes and both implementations do so. Misunderstanding: Choosing an empty boundary case unrelated to canonical ambiguity.

Audit note: External finding confirmed: assumptions decode both exact candidates and explain unused pad bits; prerequisites also name decode/re-encode validation. Remove those solutions, retain canonical protocol contract, and recheck strict decoder behavior on both runtimes. Draft revision 2 already prepared.

Validation kind: tests. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0591",
      "kind": "tests",
      "key": "noncanonical-pad-bits",
      "observations": [
        {
          "option": "canonical-f",
          "exposes": false,
          "expected": "true",
          "original": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          },
          "repaired": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          }
        },
        {
          "option": "invalid-alphabet",
          "exposes": false,
          "expected": "false",
          "original": {
            "stdout": "false",
            "exitCode": 0,
            "expectedError": null
          },
          "repaired": {
            "stdout": "false",
            "exitCode": 0,
            "expectedError": null
          }
        },
        {
          "option": "noncanonical-pad-bits",
          "exposes": true,
          "expected": "false",
          "original": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          },
          "repaired": {
            "stdout": "false",
            "exitCode": 0,
            "expectedError": null
          }
        },
        {
          "option": "empty-message",
          "exposes": false,
          "expected": "true",
          "original": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          },
          "repaired": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          }
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0591",
      "kind": "tests",
      "key": "noncanonical-pad-bits",
      "observations": [
        {
          "option": "canonical-f",
          "exposes": false,
          "expected": "true",
          "original": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          },
          "repaired": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          }
        },
        {
          "option": "invalid-alphabet",
          "exposes": false,
          "expected": "false",
          "original": {
            "stdout": "false",
            "exitCode": 0,
            "expectedError": null
          },
          "repaired": {
            "stdout": "false",
            "exitCode": 0,
            "expectedError": null
          }
        },
        {
          "option": "noncanonical-pad-bits",
          "exposes": true,
          "expected": "false",
          "original": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          },
          "repaired": {
            "stdout": "false",
            "exitCode": 0,
            "expectedError": null
          }
        },
        {
          "option": "empty-message",
          "exposes": false,
          "expected": "true",
          "original": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          },
          "repaired": {
            "stdout": "true",
            "exitCode": 0,
            "expectedError": null
          }
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.rfc-editor.org/rfc/rfc4648.html#section-3.5)
- [Primary reference](https://www.php.net/manual/en/function.base64-decode.php)

### PHP-E26-0599

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (fpm-response-finish-does-not-detach-durable-background-job): Separate finishing an HTTP response from transferring work to a durable execution owner.

Difficulty rationale: Compare publish, persistence confirmation and HTTP acknowledgement ordering across process termination and an unknown publish outcome; no broker internals are required.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: C (durable-handoff)**

A successful HTTP acceptance must follow the task’s positive persistence confirmation. Before that confirmation, buffering, socket completion and a timeout do not establish recoverable handoff. Finishing the response leaves subsequent PHP work in the request process.

Trace: If the broker stores a task but its confirmation is lost, the non-202 path can cause a safe duplicate retry. If the process dies before storage, no 202 has been sent. After a confirmed 202, the queue owns the recoverable task.

- **A:** Termination after the response but before persistence can lose work already reported as accepted. Finishing the response does not move the pending publication out of the FPM process. Misunderstanding: Treating a completed HTTP response as protection for a pending queue publication.
- **B:** A timeout does not prove persistence, and forced termination can prevent the callback. Returning 202 on that path can acknowledge a task that never reached storage. Misunderstanding: Treating an unknown publish outcome and an in-process retry as confirmed durable acceptance.
- **C:** Every observed 202 follows confirmation for this task. An unknown outcome may cause a retry and duplicate delivery, which the stated worker permits.
- **D:** A completed socket write is not the stated broker persistence confirmation. The FPM process can disappear before the task is durably accepted. Misunderstanding: Confusing transport-level write completion with application-level durable confirmation.

Audit note: External finding confirmed: only key mentions durable queue and FPM-independent recovery, while other options cannot survive termination. Draft revision 2 uses four real queue handoff sequences, publisher-confirmation versus socket flush/timeout/early HTTP response, and Intermediate difficulty.

Validation kind: document-review. Documentation and stated-contract reasoning only; no external service or real browser/HTTP/FPM/queue behavior was executed for this question.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0599",
      "kind": "document-review",
      "key": "durable-handoff",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Apply the stated client confirmation contract and crash schedule. PHP response finishing is not a durable handoff; a confirmation timeout is not confirmation of persistence.",
          "optionAudit": {
            "early-response": "A kill after 202 and before persistence leaves acknowledged work absent.",
            "timeout-accept": "The timeout path sends 202 without confirmation; a kill can suppress the in-process retry.",
            "durable-handoff": "Only positive confirmation permits 202; uncertainty produces a retryable response and duplicate handling is an explicit premise.",
            "socket-flush": "Socket flush can precede durable broker acceptance, leaving an acknowledged-loss window."
          }
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0599",
      "kind": "document-review",
      "key": "durable-handoff",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "Apply the stated client confirmation contract and crash schedule. PHP response finishing is not a durable handoff; a confirmation timeout is not confirmation of persistence.",
          "optionAudit": {
            "early-response": "A kill after 202 and before persistence leaves acknowledged work absent.",
            "timeout-accept": "The timeout path sends 202 without confirmation; a kill can suppress the in-process retry.",
            "durable-handoff": "Only positive confirmation permits 202; uncertainty produces a retryable response and duplicate handling is an explicit premise.",
            "socket-flush": "Socket flush can precede durable broker acceptance, leaving an acknowledged-loss window."
          }
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.fastcgi-finish-request.php)
- [Primary reference](https://www.rabbitmq.com/docs/confirms#when-will-published-messages-be-confirmed-by-the-broker)

### PHP-E26-0600

Selection: targeted. Audit: revise. Independent approval: pending.

Objective (webhook-mac-authenticates-exact-raw-body-before-parsing): Place webhook authentication before body transformations when the sender signs the exact request bytes.

Difficulty rationale: Combine stream ownership, authenticated byte identity and parser boundaries without substituting semantic JSON equivalence.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: B (verify-original)**

A MAC authenticates bytes, not an abstract JSON value. The exact original body must reach the verifier before any transformation; successful verification then permits parsing and dispatch.

Trace: Whitespace or member-order differences remain part of the retained byte string. The verifier checks that exact string; only a verified body becomes application data. Verifying the original bytes only after dispatch cannot undo effects of unauthenticated data.

- **A:** Semantically equivalent JSON can have different bytes, so this verifies a message the provider did not sign. Misunderstanding: Assuming semantic normalization is part of an unspecified signing protocol.
- **B:** The verifier receives exactly the signed byte sequence, and unverified parsed data cannot reach dispatch.
- **C:** Those transformations can change signed bytes even when JSON meaning remains the same. Misunderstanding: Treating transport-looking whitespace as outside the authenticated message.
- **D:** The MAC uses the right bytes, but dispatch has already accepted unauthenticated data and may cause effects before rejection. Misunderstanding: Treating final response authentication as equivalent to authorization before dispatch.

Audit note: Current alternatives largely repeat 0343's raw bytes versus transformed JSON distinction. Preserve pipeline objective but replace D with parsing/dispatching before verifying the retained raw bytes, testing the explicit pre-dispatch authorization boundary as well. Change Advanced to Intermediate because bounded reads and safe MAC verification are supplied helpers.

Validation kind: document-review. Documentation and stated-contract reasoning only; no external service or real browser/HTTP/FPM/queue behavior was executed for this question.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0600",
      "kind": "document-review",
      "key": "verify-original",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "The explicitly stated webhook protocol signs raw body bytes; transformation or projection changes the authenticated message.",
          "optionAudit": {
            "canonicalize-first": "Introduces an undefined canonicalization protocol.",
            "verify-original": "Preserves exact authenticated bytes and dispatch order.",
            "normalize-lines": "Changes potentially signed bytes.",
            "verify-fields": "Uses exact bytes but dispatches before their authenticity is established."
          }
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0600",
      "kind": "document-review",
      "key": "verify-original",
      "observations": [
        {
          "execution": "not-applicable",
          "rule": "The explicitly stated webhook protocol signs raw body bytes; transformation or projection changes the authenticated message.",
          "optionAudit": {
            "canonicalize-first": "Introduces an undefined canonicalization protocol.",
            "verify-original": "Preserves exact authenticated bytes and dispatch order.",
            "normalize-lines": "Changes potentially signed bytes.",
            "verify-fields": "Uses exact bytes but dispatches before their authenticity is established."
          }
        }
      ]
    }
  }
]
```

- [Primary reference](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries)
- [Primary reference](https://www.php.net/manual/en/function.hash-hmac.php)

### PHP-E26-0113

Selection: deterministic random. Audit: retain. Independent approval: pending.

Objective (array-intersect-string-representation-equality): Apply array_intersect’s string-representation comparison while preserving original values and keys.

Difficulty rationale: Distinguish this API’s equality rule from strict identity and general loose comparison.

Working lesson mapping: 1, 4; complete coverage: true.

**Correct: C (representations)**

array_intersect considers values equal when their string representations are identical. It returns the original left-side values under their original keys.

Trace: Keys 0, 2 and 3 match the string 1. Key 1 contains 01 and is excluded, so JSON uses object form for the remaining nonsequential keys.

- **A:** array_intersect does not require the original operand types to be identical. Misunderstanding: Applying strict identity to this API.
- **B:** The string 01 does not have the same string representation as 1. Misunderstanding: Applying general numeric loose comparison instead of the API’s string comparison rule.
- **C:** Integer 1, true and float 1.0 each convert to the string 1; their original keys and values survive.
- **D:** String conversion is used for comparison, but the returned values keep their original types. Misunderstanding: Assuming comparison normalization also transforms the returned values.

Audit note: String-form intersection equality differs from strict and loose comparison and preserves original values/keys.

Validation kind: output. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "ff536595be770f7b649735390102e456f03bb34a7b766c1c44eea5f9792eef42",
    "result": {
      "id": "PHP-E26-0113",
      "kind": "output",
      "key": "representations",
      "observations": [
        {
          "stdout": "{\"0\":1,\"2\":true,\"3\":1}",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "ff536595be770f7b649735390102e456f03bb34a7b766c1c44eea5f9792eef42",
    "result": {
      "id": "PHP-E26-0113",
      "kind": "output",
      "key": "representations",
      "observations": [
        {
          "stdout": "{\"0\":1,\"2\":true,\"3\":1}",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.array-intersect.php)

### PHP-E26-0508

Selection: deterministic random. Audit: retain. Independent approval: pending.

Objective (constant-name-case-sensitive-lookup): Apply case-sensitive lookup to a user-defined constant name.

Difficulty rationale: Keep constant-name identity separate from PHP’s case-insensitive function and class-name lookup rules.

Working lesson mapping: 2; complete coverage: true.

**Correct: D (exact-name)**

PHP retains the declared constant name and looks it up case-sensitively. A style convention such as uppercase constants does not change the language’s valid names or lookup behavior.

Trace: defined reports true for Mode and false for MODE; constant("Mode") retrieves the stored string.

- **A:** User-defined constant names are case-sensitive, so MODE is not the declared Mode. Misunderstanding: Applying function-name case insensitivity to constants.
- **B:** Uppercase spelling is a convention, not an automatic renaming performed by const. Misunderstanding: Assuming PHP normalizes constant declarations to uppercase.
- **C:** The mixed-case constant name is valid, and the actual value lookup uses that exact spelling. Misunderstanding: Treating an uppercase style convention as a syntax or runtime requirement.
- **D:** Mode exists, MODE does not, and the exact-name constant lookup returns safe.

Audit note: Case-sensitive constant names and value lookup are foundational and current-version appropriate.

Validation kind: output. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0508",
      "kind": "output",
      "key": "exact-name",
      "observations": [
        {
          "stdout": "[true,false,\"safe\"]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0508",
      "kind": "output",
      "key": "exact-name",
      "observations": [
        {
          "stdout": "[true,false,\"safe\"]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/language.constants.php)
- [Primary reference](https://www.php.net/manual/en/function.constant.php)

### PHP-E26-0358

Selection: deterministic random. Audit: retain. Independent approval: pending.

Objective (pdo-integer-binding-not-input-validation): Review integer parameter binding that is mistaken for validation of the original submitted text.

Difficulty rationale: Trace coercion at a database binding boundary separately from SQL syntax safety.

Working lesson mapping: unmapped; complete coverage: false.

**Correct: D (coerced)**

Parameterized SQL protects the syntax boundary, but a binding type does not prove the original input meets a business format. Here conversion loses the invalid-text distinction.

Trace: not-an-id becomes integer zero for this binding, so the row with ID zero is returned rather than a validation error.

- **A:** The API accepts a mixed value and the selected binding type can convert it. Misunderstanding: Assuming a PDO binding flag is a PHP parameter type declaration.
- **B:** The integer binding converts this value to zero rather than enforcing the application’s textual format. Misunderstanding: Treating binding type selection as an input-validation policy.
- **C:** PARAM_INT causes integer conversion in the stated driver instead of binding the original text. Misunderstanding: Ignoring the effect of the selected binding type.
- **D:** The invalid string is bound as zero, which matches the displayed row.

Audit note: Binding type is not original-text validation; explicit id zero makes the coercion consequence observable and driver-specific.

Validation kind: contract. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "2c32877e3dd1df895e0861848166f14be46cfe0472b8fd6bd75614a12c80c3cf",
    "result": {
      "id": "PHP-E26-0358",
      "kind": "contract",
      "key": "coerced",
      "observations": [
        {
          "stdout": "\"zero-record\"",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "2c32877e3dd1df895e0861848166f14be46cfe0472b8fd6bd75614a12c80c3cf",
    "result": {
      "id": "PHP-E26-0358",
      "kind": "contract",
      "key": "coerced",
      "observations": [
        {
          "stdout": "\"zero-record\"",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/pdostatement.bindvalue.php)
- [Primary reference](https://www.php.net/manual/en/pdo.constants.php)

### PHP-E26-0226

Selection: deterministic random. Audit: retain. Independent approval: pending.

Objective (empty-max-input-contract): Handle an empty numeric collection before invoking max.

Difficulty rationale: Apply one explicit empty-input rule while preserving ordinary maximum behavior.

Working lesson mapping: 3, 4, 5; complete coverage: true.

**Correct: C (guard-empty)**

max requires a nonempty array. Guard the input before calling it and preserve every valid integer result, including zero and negative maxima.

Trace: The empty list returns null, [-7, -2] returns -2, and [0] returns 0.

- **A:** Adding zero changes an all-negative maximum and returns zero for an empty input. Misunderstanding: Treating zero as a neutral identity for every integer maximum.
- **B:** max throws on an empty array before null coalescing can choose a fallback. Misunderstanding: Assuming ?? catches errors from evaluating its left operand.
- **C:** The empty input is handled before max, and nonempty lists retain their true maximum.
- **D:** The valid maximum zero becomes null under the truthiness fallback. Misunderstanding: Treating a zero result as absence.

Audit note: Empty input, negative values and zero independently disprove the three flawed maximum expressions.

Validation kind: patch. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "0f0e297f238aa2059e11df5ac44b7db8f642413d8f7b7614575150065c16dae2",
    "result": {
      "id": "PHP-E26-0226",
      "kind": "patch",
      "key": "guard-empty",
      "observations": [
        {
          "option": "zero-default",
          "meets": false,
          "stdout": "[0,0,0]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "coalesce-after",
          "meets": false,
          "stdout": "ValueError",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "guard-empty",
          "meets": true,
          "stdout": "[null,-2,0]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "falsy-fallback",
          "meets": false,
          "stdout": "[null,-2,null]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "0f0e297f238aa2059e11df5ac44b7db8f642413d8f7b7614575150065c16dae2",
    "result": {
      "id": "PHP-E26-0226",
      "kind": "patch",
      "key": "guard-empty",
      "observations": [
        {
          "option": "zero-default",
          "meets": false,
          "stdout": "[0,0,0]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "coalesce-after",
          "meets": false,
          "stdout": "ValueError",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "guard-empty",
          "meets": true,
          "stdout": "[null,-2,0]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "falsy-fallback",
          "meets": false,
          "stdout": "[null,-2,null]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.max.php)

### PHP-E26-0519

Selection: deterministic random. Audit: revise. Independent approval: pending.

Objective (php84-readonly-child-initialization-versus-second-write): Trace inherited readonly initialization under PHP 8.4’s default protected setter scope while retaining the one-assignment rule.

Difficulty rationale: Combine the version-specific initialization scope with readonly state after initialization.

Working lesson mapping: 24, 25, 26; complete coverage: false.

**Correct: C (initializer-only)**

Since PHP 8.4, readonly properties have protected setter scope by default, allowing child initialization. The readonly one-assignment constraint still applies after initialization.

Trace: The constructor stores 7. replaceId attempts a second write, which throws Error; the catch records failure and the value remains 7.

- **A:** In PHP 8.4 and 8.5, the default readonly setter scope permits this child-scope initialization. Misunderstanding: Applying the earlier declaring-class-only initialization rule to the stated versions.
- **B:** Permitted initialization scope does not permit a second assignment to an initialized readonly property. Misunderstanding: Treating readonly as only a restriction on callers outside the class hierarchy.
- **C:** The child initializes the property once; the later attempted reassignment raises Error and leaves 7 stored.
- **D:** The prohibited second assignment fails before replacing the stored value. Misunderstanding: Assuming readonly detects a write only after committing the replacement.

Audit note: Prerequisite explicitly supplies PHP 8.4 readonly protected(set) default, eliminating the inherited-initialization issue. Replace with neutral inherited readonly initialization; change Advanced to Intermediate for initialization versus prohibited second write.

Validation kind: output. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0519",
      "kind": "output",
      "key": "initializer-only",
      "observations": [
        {
          "stdout": "[7,true]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0519",
      "kind": "output",
      "key": "initializer-only",
      "observations": [
        {
          "stdout": "[7,true]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties)

### PHP-E26-0471

Selection: deterministic random. Audit: revise. Independent approval: pending.

Objective (iterable-admission-not-countable-or-object): Accept arrays and Traversable objects without accepting every object that can be counted.

Difficulty rationale: Separate traversal capability from object identity and Countable membership.

Working lesson mapping: 1, 4, 27; complete coverage: false.

**Correct: C (iterable)**

is_iterable recognizes the PHP iterable type set: arrays and Traversable objects. Countable is a separate capability, and being an object alone is not sufficient for this contract.

Trace: The array and ArrayIterator pass. CountOnly and stdClass do not implement Traversable and therefore fail.

- **A:** This rejects the ArrayIterator even though it implements traversal. Misunderstanding: Restricting an iterable contract to arrays alone.
- **B:** This rejects arrays and accepts the two non-Traversable objects. Misunderstanding: Using object type as a proxy for the requested traversal capability.
- **C:** This accepts arrays and Traversable instances, matching the stated API type set.
- **D:** CountOnly is countable but does not implement Traversable. Misunderstanding: Assuming the ability to count implies the requested iteration interface.

Audit note: is_iterable prerequisite uniquely names the correct predicate. Retain arrays, Traversable and Countable as neutral categories students must distinguish.

Validation kind: patch. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0471",
      "kind": "patch",
      "key": "iterable",
      "observations": [
        {
          "option": "arrays-only",
          "meets": false,
          "stdout": "[true,false,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "objects-only",
          "meets": false,
          "stdout": "[false,true,true,true]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "iterable",
          "meets": true,
          "stdout": "[true,true,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "countable",
          "meets": false,
          "stdout": "[true,true,true,false]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0471",
      "kind": "patch",
      "key": "iterable",
      "observations": [
        {
          "option": "arrays-only",
          "meets": false,
          "stdout": "[true,false,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "objects-only",
          "meets": false,
          "stdout": "[false,true,true,true]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "iterable",
          "meets": true,
          "stdout": "[true,true,false,false]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "countable",
          "meets": false,
          "stdout": "[true,true,true,false]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.is-iterable.php)
- [Primary reference](https://www.php.net/manual/en/class.countable.php)

### PHP-E26-0570

Selection: deterministic random. Audit: revise. Independent approval: pending.

Objective (csv-quoted-delimiter-requires-csv-parser): Parse a quoted comma inside a CSV field without splitting that field into separate values.

Difficulty rationale: Distinguish structured CSV syntax from literal delimiter splitting.

Working lesson mapping: 20; complete coverage: false.

**Correct: B (csv-parser)**

CSV enclosure rules determine which commas are separators. A CSV parser consumes the quotes as syntax while retaining the comma inside the first field.

Trace: The first field is Ada, Lin and the second is the string 7.

- **A:** Literal splitting treats the enclosed comma as another separator. Misunderstanding: Ignoring enclosure syntax when splitting structured data.
- **B:** The CSV parser recognizes the enclosure and retains the internal comma as field data.
- **C:** Removing quotes erases the information that distinguishes the embedded comma. Misunderstanding: Discarding syntax before interpreting its grouping role.
- **D:** A split limit keeps two pieces but splits at the wrong comma inside the first field. Misunderstanding: Assuming the required field count guarantees correct field boundaries.

Audit note: str_getcsv prerequisite names the only grammar-aware parser among options. Keep CSV enclosures and record boundaries without the answer call name.

Validation kind: patch. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0570",
      "kind": "patch",
      "key": "csv-parser",
      "observations": [
        {
          "option": "literal-split",
          "meets": false,
          "stdout": "[\"\\\"Ada\",\" Lin\\\"\",\"7\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "csv-parser",
          "meets": true,
          "stdout": "[\"Ada, Lin\",\"7\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "strip-then-split",
          "meets": false,
          "stdout": "[\"Ada\",\" Lin\",\"7\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "split-limit",
          "meets": false,
          "stdout": "[\"\\\"Ada\",\" Lin\\\",7\"]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "1d9e2733945ce772e69802d77054271ed9b7f9b03b7195ef0942427f087c2e20",
    "result": {
      "id": "PHP-E26-0570",
      "kind": "patch",
      "key": "csv-parser",
      "observations": [
        {
          "option": "literal-split",
          "meets": false,
          "stdout": "[\"\\\"Ada\",\" Lin\\\"\",\"7\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "csv-parser",
          "meets": true,
          "stdout": "[\"Ada, Lin\",\"7\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "strip-then-split",
          "meets": false,
          "stdout": "[\"Ada\",\" Lin\",\"7\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "split-limit",
          "meets": false,
          "stdout": "[\"\\\"Ada\",\" Lin\\\",7\"]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.str-getcsv.php)

### PHP-E26-0006

Selection: deterministic random. Audit: retain. Independent approval: pending.

Objective (variable-variable-target): Resolve a variable variable using the current name string.

Difficulty rationale: Resolve two simple indirect assignments without introducing reference semantics.

Working lesson mapping: 2; complete coverage: true.

**Correct: C (distinct)**

$$name selects a variable by the current string in name. It does not establish a reference that follows future changes to name.

Trace: The first assignment creates count=3. After changing name, the second creates limit=8.

- **A:** Changing name redirects later indirect assignment; it does not change count. Misunderstanding: Treating the earlier target as a permanent binding.
- **B:** The assignments store integers in the named variables. Misunderstanding: Confusing the target variable names with their assigned values.
- **C:** The first assignment targets count and the second targets limit.
- **D:** The two indirect assignments neither alias each other nor share one value. Misunderstanding: Reading variable-variable syntax as a reference binding.

Audit note: Two variable-variable assignments require tracing the changing name.

Validation kind: output. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0006",
      "kind": "output",
      "key": "distinct",
      "observations": [
        {
          "stdout": "3|8",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "37a0152fb3534d182a222dc11e2c998b12029f01ce993e362a8373e14d4e67e0",
    "result": {
      "id": "PHP-E26-0006",
      "kind": "output",
      "key": "distinct",
      "observations": [
        {
          "stdout": "3|8",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/language.variables.variable.php)

### PHP-E26-0427

Selection: deterministic random. Audit: retain. Independent approval: pending.

Objective (foreach-key-value-target-order-repair): Repair reversed foreach key and value targets while retaining named map entries.

Difficulty rationale: Identify the two assignment roles in foreach instead of discarding keys to make the loop run.

Working lesson mapping: 3, 4; complete coverage: true.

**Correct: B (correct-targets)**

In foreach (array as key => value), the target before the arrow receives the key and the target after it receives the associated value.

Trace: The first iteration assigns name A and weight 2; the second assigns name B and weight 4.

- **A:** The loop sees numeric list indexes and name strings rather than each name’s weight. Misunderstanding: Replacing the map with its key list loses the values needed for the labels.
- **B:** The key is assigned to name and its associated value to weight.
- **C:** The values remain, but name becomes a numeric index instead of A or B. Misunderstanding: Reindexing the map to avoid a target-order error.
- **D:** This preserves the original reversal and produces 2:A and 4:B. Misunderstanding: Reading the target after the arrow as the key.

Audit note: Key/value position in foreach is the actual beginner syntax objective; array_keys/array_values change the collection and preserve plausible confusion.

Validation kind: patch. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0427",
      "kind": "patch",
      "key": "correct-targets",
      "observations": [
        {
          "option": "keys-only",
          "meets": false,
          "stdout": "[\"0:A\",\"1:B\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "correct-targets",
          "meets": true,
          "stdout": "[\"A:2\",\"B:4\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "values-only",
          "meets": false,
          "stdout": "[\"0:2\",\"1:4\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "reversed-targets",
          "meets": false,
          "stdout": "[\"2:A\",\"4:B\"]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "324787f22a128183b5bf93c4b3680cb1453cd59b786c8fe64ebd51b422223db2",
    "result": {
      "id": "PHP-E26-0427",
      "kind": "patch",
      "key": "correct-targets",
      "observations": [
        {
          "option": "keys-only",
          "meets": false,
          "stdout": "[\"0:A\",\"1:B\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "correct-targets",
          "meets": true,
          "stdout": "[\"A:2\",\"B:4\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "values-only",
          "meets": false,
          "stdout": "[\"0:2\",\"1:4\"]",
          "exitCode": 0,
          "expectedError": null
        },
        {
          "option": "reversed-targets",
          "meets": false,
          "stdout": "[\"2:A\",\"4:B\"]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/control-structures.foreach.php)

### PHP-E26-0314

Selection: deterministic random. Audit: revise. Independent approval: pending.

Objective (strtok-shared-parser-state): Track the shared continuation state of interleaved strtok calls.

Difficulty rationale: Recognize that a second initial call replaces the continuation source used by the first parser.

Working lesson mapping: 5; complete coverage: false.

**Correct: C (shared)**

strtok stores one continuation position for its active string. A new two-argument call resets that state; subsequent one-argument calls do not know about the earlier string.

Trace: The second initialization consumes up. The comma continuation sees the remaining down as one token, leaving no token for the final call.

- **A:** strtok does not maintain a separate continuation cursor for each delimiter or caller. Misunderstanding: Assuming delimiter choice identifies an independent parser session.
- **B:** The second initial call has already consumed up and its separator. Misunderstanding: Assuming continuation restarts from the beginning of the most recent string.
- **C:** The up:down initialization replaces the earlier state; the next call consumes its remaining down.
- **D:** A continuation may use a new delimiter and still reads the remaining source. Misunderstanding: Assuming a changed delimiter rejects or pauses the stored sequence.

Audit note: Stem directly states that continuation uses the most recently initialized strtok sequence, the central rule being tested. Remove that explanation while retaining the complete four-call trace.

Validation kind: output. Isolated PHP files, host-file patches and/or contract contrasts; expected diagnostics are recorded explicitly.

```json
[
  {
    "php": "8.5.2",
    "sourceHash": "2c32877e3dd1df895e0861848166f14be46cfe0472b8fd6bd75614a12c80c3cf",
    "result": {
      "id": "PHP-E26-0314",
      "kind": "output",
      "key": "shared",
      "observations": [
        {
          "stdout": "[\"red\",\"up\",\"down\",false]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  },
  {
    "php": "8.4.17",
    "sourceHash": "2c32877e3dd1df895e0861848166f14be46cfe0472b8fd6bd75614a12c80c3cf",
    "result": {
      "id": "PHP-E26-0314",
      "kind": "output",
      "key": "shared",
      "observations": [
        {
          "stdout": "[\"red\",\"up\",\"down\",false]",
          "exitCode": 0,
          "expectedError": null
        }
      ]
    }
  }
]
```

- [Primary reference](https://www.php.net/manual/en/function.strtok.php)

