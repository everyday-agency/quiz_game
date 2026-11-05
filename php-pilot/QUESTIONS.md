# Twenty new PHP pilot questions

These are the exact records in the separate local PHP pilot. Source option order below is for review only; the application shuffles options by stable identity. Each item has one correct answer. None replaces an existing question.

| ID | Format | Difficulty / audience | Objective |
|---|---|---|---|
| PHP-PILOT-001 | execution | Foundation / junior | Resolve duplicate string keys when applying array union to configuration defaults. |
| PHP-PILOT-002 | debugging | Applied / intermediate | Break the lingering loop-variable reference before reusing that variable by value. |
| PHP-PILOT-003 | code-review | Applied / intermediate | Assess a parameter rename against positional and named callers of a PHP API. |
| PHP-PILOT-004 | execution | Foundation / junior | Distinguish an omitted nullable argument from an explicitly supplied null. |
| PHP-PILOT-005 | implementation | Applied / junior | Reject failed integer validation without rejecting a valid zero-valued query parameter. |
| PHP-PILOT-006 | implementation | Applied / intermediate | Compare an HTTP media type independently of parameters without accepting prefix lookalikes. |
| PHP-PILOT-007 | testing | Applied / junior | Choose a file fixture that exposes a truthiness-based read loop dropping a valid line. |
| PHP-PILOT-008 | execution | Applied / junior | Track reads and an overwrite at the current position of a seekable stream. |
| PHP-PILOT-009 | debugging | Applied / intermediate | Choose a catch type that handles both a domain exception and an engine type error at a task boundary. |
| PHP-PILOT-010 | code-review | Applied / intermediate | Identify how returning from finally changes propagation of a pending exception. |
| PHP-PILOT-011 | execution | Applied / intermediate | Distinguish a readonly object property from immutability of the object it references. |
| PHP-PILOT-012 | debugging | Applied / junior | Diagnose an uninitialized inherited property when a child defines its own constructor. |
| PHP-PILOT-013 | architecture | Applied / intermediate | Use a controllable clock at each decision rather than caching time when constructing a long-lived object. |
| PHP-PILOT-014 | execution | Applied / intermediate | Resolve trait methods against inherited methods and methods declared directly in the consuming class. |
| PHP-PILOT-015 | implementation | Applied / intermediate | Implement a trait’s abstract instance-method contract with a compatible signature. |
| PHP-PILOT-016 | execution | Foundation / junior | Distinguish shared class state from each instance’s own counter. |
| PHP-PILOT-017 | execution | Foundation / junior | Distinguish an unqualified namespaced function call from an explicitly global call. |
| PHP-PILOT-018 | testing | Foundation / junior | Select a test that distinguishes an inclusive balance limit from an exclusive one. |
| PHP-PILOT-019 | debugging | Applied / intermediate | Diagnose an unqualified class name in a namespace when the intended class is global. |
| PHP-PILOT-020 | code-review | Applied / intermediate | Preserve a borrowed stream and its position so the caller can continue reading. |

## PHP-PILOT-001

What JSON does this configuration expression print?

**Objective:** Resolve duplicate string keys when applying array union to configuration defaults.

**Format:** execution. **Difficulty:** Foundation (junior). One array operator determines precedence and retained keys.

**Prerequisites:** Associative arrays; Array keys.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist.

**main.php — complete-file**

```php
<?php

$defaults = ['timeout' => 10, 'retries' => 2];
$overrides = ['timeout' => 0];

echo json_encode($overrides + $defaults);
```

1. {"timeout":10,"retries":2}
2. {"timeout":0}
3. {"timeout":0,"retries":2}
4. {"timeout":[0,10],"retries":2}

**Correct:** 3 (left-precedence). Array union gives existing keys on the left precedence. Zero is a value, not an instruction to use a default.

**Trace:** Start with timeout=0. The duplicate timeout from defaults is ignored; retries=2 is added. JSON preserves this insertion order.

**Each option:**

1. Union keeps the left-hand value when both arrays contain the same key. Misunderstanding: Treating array union as right-hand overwrite.
2. The retries key is absent on the left, so union adds it from the right. Misunderstanding: Treating union as replacement of the whole defaults array.
3. timeout is retained from overrides, including its zero value; retries is added from defaults.
4. The + operator keeps one value per key; it does not collect the two timeout values. Misunderstanding: Confusing union with recursive merging of duplicate keys.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "{\"timeout\":0,\"retries\":2}".

**Originality and wording review:** Array union precedence and retaining zero differ from null-coalescing defaults and filter/reindex operations. The four outputs model overwrite, replacement and recursive-merge misunderstandings. No positivity or generic action cue; solving requires the union rule.

**References:** [Primary reference 1](https://www.php.net/manual/en/language.operators.array.php)

## PHP-PILOT-002

The second loop must leave the doubled array unchanged. Which statement inserted at FIX makes the final JSON [2,4,6]?

**Objective:** Break the lingering loop-variable reference before reusing that variable by value.

**Format:** debugging. **Difficulty:** Applied (intermediate). Tracks a reference surviving one loop into assignments performed by another.

**Prerequisites:** foreach; References; Array mutation.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. The two loops and their variable names must remain as shown.

**main.php — complete-file**

```php
<?php

$numbers = [1, 2, 3];

foreach ($numbers as &$value) {
    $value *= 2;
}

/* FIX */

foreach ($numbers as $value) {
    /* read each value */
}

echo json_encode($numbers);
```

1. $value = null;
2. unset($value);
3. reset($numbers);
4. $numbers = array_values($numbers);

**Correct:** 2 (unset-reference). A foreach reference remains bound after the loop. Unset the loop variable before using it as a by-value target.

**Trace:** After doubling, value aliases the last element (6). Without detaching it, the next loop writes 2 and then 4 into that element, ending at [2,4,4].

**Each option:**

1. The assignment writes null into the final element and keeps the reference alive. Misunderstanding: Assuming assignment clears a reference instead of writing through it.
2. unset detaches the loop variable from the last array element before the next foreach assigns to it.
3. Resetting iteration position does not detach value from the final element. Misunderstanding: Confusing an internal array pointer with a reference binding.
4. Reindexing keeps the referenced element; the reused loop variable still writes through that reference. Misunderstanding: Assuming reindexing removes references held by array elements.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four candidate implementations were exercised; only the keyed candidate meets the requirement.

**Originality and wording review:** A foreach reference escaping its loop is different from closure capture or static-local retention. Every candidate is an actual PHP operation, and all four are executed. The short key is an operation that detaches a variable; shorter wording alone is not a reliable collection-wide cue.

**References:** [Primary reference 1](https://www.php.net/manual/en/control-structures.foreach.php)

## PHP-PILOT-003

A library renamed its parameter from limit to count without changing its type or behavior. Which compatibility assessment matches the two calls in this existing caller?

**Objective:** Assess a parameter rename against positional and named callers of a PHP API.

**Format:** code-review. **Difficulty:** Applied (intermediate). Separates positional compatibility from name-based argument binding.

**Prerequisites:** Function parameters; Named arguments; Error handling.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. Both files are in the same directory. Execute main.php. No compatibility wrapper is installed.

**library.php — complete-file**

```php
<?php

function pageSize(int $count): int
{
    return $count;
}
```

**main.php — complete-file**

```php
<?php

require __DIR__ . '/library.php';

echo pageSize(3), '|';

try {
    echo pageSize(limit: 3);
} catch (Error $error) {
    echo 'Error';
}
```

1. Both calls return 3; the unchanged type preserves both call styles.
2. The positional call returns 3; the named call raises Error before entering pageSize.
3. Both calls raise Error before entering pageSize; the rename changes both bindings.
4. The positional call raises Error; the named call returns 3 using the unchanged type.

**Correct:** 2 (named-breaks). Parameter names are part of the callable contract for named callers. This rename preserves positional calls but breaks the shown named call.

**Trace:** The first argument occupies count regardless of its old name. limit: 3 cannot bind to count, so PHP raises Error before entering pageSize for the second call.

**Each option:**

1. The named caller still requests limit, which is no longer a parameter. Misunderstanding: Assuming parameter names are irrelevant to all callers.
2. The positional call prints 3; the old named call raises Error and the catch prints Error.
3. The first call binds its integer by position and succeeds. Misunderstanding: Assuming the rename invalidates positional calls too.
4. Position selects count for the first call. The second call instead requires a parameter actually named limit. Misunderstanding: Treating named arguments as type-bound while assuming positional calls depend on parameter spelling.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "3|Error".

**Originality and wording review:** An API parameter rename breaks a named caller while preserving a positional caller. This differs from reordered named arguments and strict scalar calls across files. Compatibility alternatives separate both-working, both-breaking and the two possible mixed outcomes.

**References:** [Primary reference 1](https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments)

## PHP-PILOT-004

What text is printed by the omitted-argument call and the explicit-null call?

**Objective:** Distinguish an omitted nullable argument from an explicitly supplied null.

**Format:** execution. **Difficulty:** Foundation (junior). Applies the parameter default and then one null-coalescing expression.

**Prerequisites:** Default arguments; Nullable types; Null coalescing.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist.

**main.php — complete-file**

```php
<?php

function displayName(?string $name = 'guest'): string
{
    return $name ?? 'missing';
}

echo displayName(), '|', displayName(null);
```

1. guest|guest
2. guest|missing
3. missing|missing
4. guest followed by an uncaught TypeError

**Correct:** 2 (distinct). A default argument applies when the caller omits that argument. Explicit null remains null when the parameter permits it.

**Trace:** displayName() receives guest. displayName(null) receives null, so only the second call evaluates the right-hand side of ?? .

**Each option:**

1. A supplied null is an argument; only omission selects the default. Misunderstanding: Assuming null requests the default parameter value.
2. Omission supplies guest. Explicit null reaches the function and the ?? expression supplies missing.
3. The declared default is guest, so the omitted call is not null. Misunderstanding: Assuming omitted arguments enter the function as null.
4. The second call is type-valid and returns missing. Misunderstanding: Overlooking that ?string explicitly permits null.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "guest|missing".

**Originality and wording review:** Omitted versus explicit-null function arguments are distinct from an absent array key or a falsy stored value. The four outcomes diagnose default selection, nullable acceptance and null coalescing.

**References:** [Primary reference 1](https://www.php.net/manual/en/functions.arguments.php)

## PHP-PILOT-005

An HTTP endpoint accepts quantities from 0 through 9 and rejects every invalid value. Which condition should replace REJECT in this validation helper?

**Objective:** Reject failed integer validation without rejecting a valid zero-valued query parameter.

**Format:** implementation. **Difficulty:** Applied (junior). Distinguishes the false failure sentinel from integer zero and checks a range.

**Prerequisites:** Scalar query input; Strict comparison; filter_var.

**Runtime:** PHP 8.4 / 8.5, CLI model of query validation; E_ALL; no custom error handler. Required extensions: filter.

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. raw is a scalar string already extracted from the query. The helper returns a decision string; it does not send an HTTP response. No FILTER_NULL_ON_FAILURE flag is used.

**main.php — complete-file**

```php
<?php

function decide(string $raw): string
{
    $quantity = filter_var(
        $raw,
        FILTER_VALIDATE_INT,
        ['options' => ['min_range' => 0, 'max_range' => 9]]
    );

    if (/* REJECT */ false) {
        return 'reject';
    }

    return 'accept:' . $quantity;
}

echo json_encode(array_map('decide', ['0', '7', 'no', '10']));
```

1. !$quantity
2. $quantity === null
3. $quantity === false
4. !isset($quantity)

**Correct:** 3 (false-sentinel). Use identity with false to detect failed FILTER_VALIDATE_INT validation under these flags.

**Trace:** The four validation results are integer 0, integer 7, false and false. The required decisions are accept:0, accept:7, reject and reject.

**Each option:**

1. This rejects zero even though the endpoint explicitly accepts it. Misunderstanding: Conflating validation failure with a valid falsy integer.
2. The default failure sentinel is false, so invalid values would be accepted. Misunderstanding: Expecting null without FILTER_NULL_ON_FAILURE.
3. It rejects the failure sentinel while allowing integer 0 and the other in-range integers.
4. The variable is set to false on failure; isset is still true for false. Misunderstanding: Treating failed validation as an unset variable.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four candidate implementations were exercised; only the keyed candidate meets the requirement.

**Originality and wording review:** A valid zero quantity changes the contract from an existing positive-page check; the task is choosing the failure predicate rather than repeating that input is untrusted. All choices are common PHP validation idioms. The long-key screen flags this short expression; no padding is added.

**References:** [Primary reference 1](https://www.php.net/manual/en/function.filter-var.php), [Primary reference 2](https://www.php.net/manual/en/filter.constants.php)

## PHP-PILOT-006

Accept only application/json, case-insensitively, with optional semicolon parameters. Reject application/jsonp and application/problem+json. Which expression belongs at ACCEPT?

**Objective:** Compare an HTTP media type independently of parameters without accepting prefix lookalikes.

**Format:** implementation. **Difficulty:** Applied (intermediate). Combines case normalization, delimiter boundaries and exact matching.

**Prerequisites:** String functions; HTTP Content-Type.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. header is a single syntactically valid Content-Type field value. This policy check does not parse the body or support structured-suffix media types.

**main.php — complete-file**

```php
<?php

function accepts(string $header): bool
{
    return /* ACCEPT */ false;
}

$headers = [
    'application/json',
    'Application/JSON; charset=utf-8',
    'application/jsonp',
    'application/problem+json'
];

echo json_encode(array_map('accepts', $headers));
```

1. trim(explode(';', $header, 2)[0]) === 'application/json'
2. str_starts_with(strtolower(trim(explode(';', $header, 2)[0])), 'application/json')
3. str_contains(strtolower(trim(explode(';', $header, 2)[0])), 'json')
4. strtolower(trim(explode(';', $header, 2)[0])) === 'application/json'

**Correct:** 4 (type-only). The permitted token is the part before the first semicolon. Exact matching of that token avoids accidentally broadening the endpoint policy.

**Trace:** The normalized tokens are application/json, application/json, application/jsonp and application/problem+json. Only the first two satisfy the stated policy.

**Each option:**

1. Application/JSON is a permitted case variation, but this comparison rejects it. Misunderstanding: Parsing parameters correctly but comparing the media type case-sensitively.
2. application/jsonp shares that prefix and would be incorrectly accepted. Misunderstanding: Treating a matching string prefix as a media-type boundary.
3. Both excluded lookalikes contain json and would pass this check. Misunderstanding: Treating any JSON-like media type as the exact permitted type.
4. It isolates the media type, normalizes case/outer whitespace, and compares the complete type.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four candidate implementations were exercised; only the keyed candidate meets the requirement.

**Originality and wording review:** Request media-type token parsing differs from emitting a JSON response header. Both prefix and suffix lookalikes have concrete counterexamples. All four alternatives parse semicolon parameters. The remaining differences require understanding case handling, prefix/substring checks and exact matching; selecting the only delimiter parser is no longer a shortcut.

**References:** [Primary reference 1](https://www.php.net/manual/en/function.explode.php), [Primary reference 2](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.3)

## PHP-PILOT-007

readLines must retain every line, including a final line without a newline. Which single-file test exposes a defect in this implementation?

**Objective:** Choose a file fixture that exposes a truthiness-based read loop dropping a valid line.

**Format:** testing. **Difficulty:** Applied (junior). Connects fgets return values to PHP string truthiness at an EOF boundary.

**Prerequisites:** fgets; Boolean conversion; EOF.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. The stream opens successfully and reads have no I/O errors. The function returns raw lines, including any newline bytes.

**main.php — complete-file**

```php
<?php

function readLines($handle): array
{
    $lines = [];

    while ($line = fgets($handle)) {
        $lines[] = $line;
    }

    return $lines;
}
```

1. Empty contents; expect [].
2. Contents "0\n"; expect ["0\n"].
3. Contents "0" (no newline); expect ["0"].
4. Contents "A" (no newline); expect ["A"].

**Correct:** 3 (zero-line). Test a valid final line equal to the string "0". The loop must compare fgets with false using !== rather than use the returned line as a boolean.

**Trace:** For contents "0", fgets succeeds but the condition becomes false and lines stays empty. Changing the condition to ($line = fgets($handle)) !== false retains that line.

**Each option:**

1. The loop correctly stops at false for an empty stream and returns the expected empty array. Misunderstanding: Assuming the ordinary EOF sentinel alone triggers the defect.
2. "0\n" is not the special falsy string "0"; the line is retained. Misunderstanding: Assuming any string beginning with zero is falsy.
3. fgets returns the valid string "0", which is falsy and never enters this loop.
4. The nonempty string "A" is truthy, so this example passes. Misunderstanding: Assuming every unterminated final line is dropped.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four tests were run against the buggy and repaired implementations; only the keyed test fails before the repair.

**Originality and wording review:** A test exposing a falsy valid line differs from generator cleanup and CSV field parsing. Newline bytes are explicit and all four test fixtures are run. The requirement alone does not establish why the string 0 differs from 0 plus newline; PHP truthiness determines the revealing test.

**References:** [Primary reference 1](https://www.php.net/manual/en/function.fgets.php), [Primary reference 2](https://www.php.net/manual/en/language.types.boolean.php)

## PHP-PILOT-008

What is printed after reading two bytes, writing X and then reading the stream from the start?

**Objective:** Track reads and an overwrite at the current position of a seekable stream.

**Format:** execution. **Difficulty:** Applied (junior). Tracks the cursor through a read, write and rewind without confusing overwrite with append.

**Prerequisites:** Stream handles; fread; fwrite; rewind.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. The memory stream is seekable and all reads/writes succeed. Every displayed character occupies one byte.

**main.php — complete-file**

```php
<?php

$h = fopen('php://memory', 'w+');
fwrite($h, 'abcd');
rewind($h);

fread($h, 2);
fwrite($h, 'X');

rewind($h);
echo stream_get_contents($h);

fclose($h);
```

1. abcdX
2. abXd
3. abXcd
4. abX

**Correct:** 2 (overwrite). After fread consumes a and b, the stream position is 2. Writing one byte replaces c with X.

**Trace:** The initial write leaves abcd. Rewind sets position 0, the read moves it to 2, the write produces abXd, and the final rewind makes the whole content readable.

**Each option:**

1. w+ permits reading/writing at the current position; it is not append mode. Misunderstanding: Treating w+ writes as unconditional appends.
2. The read advances to byte offset 2; X overwrites c, while d remains.
3. A stream write overwrites bytes at that position instead of inserting into the middle. Misunderstanding: Assuming writing inserts a byte and shifts existing content.
4. Opening w+ initially truncates; this later write does not truncate the remaining d. Misunderstanding: Assuming a later write truncates everything after its new endpoint.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "abXd".

**Originality and wording review:** The cursor overwrite after a read is a different behavior from CSV parsing and a missing escape argument. All four outputs map to concrete stream models: append, overwrite, insertion and truncation.

**References:** [Primary reference 1](https://www.php.net/manual/en/function.fopen.php), [Primary reference 2](https://www.php.net/manual/en/function.fwrite.php)

## PHP-PILOT-009

This worker boundary must record and continue after either demonstrated failure, preserving each failure class in the output. Which type replaces Exception in its catch?

**Objective:** Choose a catch type that handles both a domain exception and an engine type error at a task boundary.

**Format:** debugging. **Difficulty:** Applied (intermediate). Uses the shared Throwable contract without conflating Error and Exception.

**Prerequisites:** try/catch; TypeError; Exception hierarchy.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. This boundary intentionally handles both failure categories; it does not turn them into successful task results. No process termination or non-throwable failure is involved.

**main.php — complete-file**

```php
<?php

$tasks = [
    fn () => throw new RuntimeException('domain'),
    fn () => strlen([]),
];
$failures = [];

foreach ($tasks as $task) {
    try {
        $task();
    } catch (/* CATCH */ Exception $error) {
        $failures[] = get_class($error);
    }
}

echo json_encode($failures);
```

1. Exception
2. Error
3. Throwable
4. RuntimeException

**Correct:** 3 (throwable). Throwable is the shared interface for Error and Exception. Catching it here records the two intended task failures without misreporting success.

**Trace:** The first task throws RuntimeException. The second supplies an array to strlen and throws TypeError. Throwable catches both; neither Exception nor Error alone does.

**Each option:**

1. TypeError extends Error, so it escapes this catch. Misunderstanding: Assuming all throwable engine failures extend Exception.
2. RuntimeException extends Exception and is not an Error. Misunderstanding: Assuming Error is the root of both exception branches.
3. Both RuntimeException and TypeError implement Throwable, allowing both task outcomes to be recorded.
4. The first failure is caught, but TypeError belongs to the Error branch. Misunderstanding: Assuming runtime-generated type failures are RuntimeException subclasses.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four candidate implementations were exercised; only the keyed candidate meets the requirement.

**Originality and wording review:** The shared catch type at an intentionally broad worker boundary differs from translating a domain exception into an HTTP response. Every option is a real PHP exception/error type. Each wrong candidate is executed and fails on a particular task.

**References:** [Primary reference 1](https://www.php.net/manual/en/class.throwable.php), [Primary reference 2](https://www.php.net/manual/en/class.typeerror.php)

## PHP-PILOT-010

The reviewer wants the caller to observe failed loads. What does this implementation actually print?

**Objective:** Identify how returning from finally changes propagation of a pending exception.

**Format:** code-review. **Difficulty:** Applied (intermediate). Tracks a pending throw through finally and the caller’s catch.

**Prerequisites:** try/catch/finally; Function return.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. There is no other cleanup or exception in finally.

**main.php — complete-file**

```php
<?php

function loadValue(): string
{
    try {
        throw new RuntimeException('load failed');
    } finally {
        return 'closed';
    }
}

try {
    echo loadValue();
} catch (RuntimeException $error) {
    echo 'caught';
}
```

1. caught
2. closed
3. closedcaught
4. An uncaught Error because return is forbidden in finally

**Correct:** 2 (closed). Returning from finally discards the pending exception in this example. The caller sees the returned string and does not catch a failure.

**Trace:** The throw starts exception propagation. finally runs before the function leaves, and its return replaces that outcome. Keep cleanup in finally but remove its return to preserve the original failure.

**Each option:**

1. The return in finally replaces the pending exception, so the caller’s catch is not entered. Misunderstanding: Assuming a pending exception always survives a finally return.
2. The finally block returns closed instead of letting the pending exception propagate.
3. The function has one completed outcome here: its returned string. Misunderstanding: Assuming return completes and the same exception then also reaches the caller.
4. PHP permits the return; its effect on the pending exception is the defect. Misunderstanding: Confusing discouraged control flow with syntax prohibited by PHP.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "closed".

**Originality and wording review:** Returning from finally replaces a pending throw; the previous lock example teaches cleanup without changing the pending outcome. Options distinguish catch propagation, replacement, dual outcomes and a supposed language prohibition.

**References:** [Primary reference 1](https://www.php.net/manual/en/control-structures.finally.php)

## PHP-PILOT-011

What text is printed when code mutates the settings object and then tries to replace it?

**Objective:** Distinguish a readonly object property from immutability of the object it references.

**Format:** execution. **Difficulty:** Applied (intermediate). Separates mutation of referenced state from replacement of the property.

**Prerequisites:** Object properties; readonly; Error handling.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. Settings has no magic methods or property hooks.

**main.php — complete-file**

```php
<?php

final class Settings
{
    public int $attempts = 1;
}

final class Client
{
    public function __construct(public readonly Settings $settings)
    {
    }
}

$client = new Client(new Settings());
$client->settings->attempts = 4;

echo $client->settings->attempts, '|';

try {
    $client->settings = new Settings();
} catch (Error $error) {
    echo 'Error';
}
```

1. An uncaught Error before anything is printed
2. 1|Error
3. 4|
4. 4|Error

**Correct:** 4 (reference-readonly). readonly restricts reassignment of the property, not mutation of an ordinary object stored in it.

**Trace:** Client initializes settings once. attempts belongs to the referenced mutable Settings instance and becomes 4. Assigning a new Settings to the same readonly property then fails.

**Each option:**

1. The nested attempts property is mutable; changing it does not reassign settings. Misunderstanding: Treating readonly as a recursive object-freezing mechanism.
2. The read yields the same Settings object, whose attempts value becomes 4. Misunderstanding: Assuming reading a readonly object property yields a detached copy.
3. The replacement is a second assignment, which is forbidden regardless of matching type. Misunderstanding: Assuming a readonly property can be replaced by another object of the same class.
4. The nested value changes, but replacing the initialized readonly settings property raises Error.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "4|Error".

**Originality and wording review:** Readonly reference replacement and mutation of the referenced object differ from scalar Money construction and shallow cloning. The four outcomes require knowing which object/property is written; no generic immutability slogan identifies the key.

**References:** [Primary reference 1](https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties)

## PHP-PILOT-012

new Admin("Ada") must retain the supplied name and label itself "Ada:admin". Which constructor statement belongs at INITIALIZE?

**Objective:** Diagnose an uninitialized inherited property when a child defines its own constructor.

**Format:** debugging. **Difficulty:** Applied (junior). Follows constructor dispatch and an inherited typed property’s initialization.

**Prerequisites:** Inheritance; Constructors; Typed properties.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. The constructor signatures and label method must remain unchanged.

**main.php — complete-file**

```php
<?php

class Person
{
    public function __construct(public string $name)
    {
    }
}

final class Admin extends Person
{
    private string $role = 'admin';

    public function __construct(string $name)
    {
        /* INITIALIZE */
    }

    public function label(): string
    {
        return $this->name . ':' . $this->role;
    }
}

echo (new Admin('Ada'))->label();
```

1. parent::__construct($name);
2. $name = (string) $name;
3. parent::__construct('guest');
4. new Person($name);

**Correct:** 1 (parent-init). Defining a child constructor does not automatically run the parent constructor. The child must initialize the inherited state deliberately.

**Trace:** Person’s promoted name is initialized in Person::__construct. Calling that method on the current object with Ada supplies the value label needs; constructing a separate Person does not.

**Each option:**

1. The parent constructor initializes the promoted name property with the argument supplied to Admin.
2. This only assigns the local variable; the inherited property remains uninitialized. Misunderstanding: Confusing the child’s local parameter with the inherited property.
3. It initializes the property but discards Ada, producing guest:admin. Misunderstanding: Using a fallback despite having a valid caller-supplied value.
4. That initializes a different object, leaving this Admin’s name uninitialized. Misunderstanding: Assuming constructing a parent instance initializes the existing child instance.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four candidate implementations were exercised; only the keyed candidate meets the requirement.

**Originality and wording review:** An explicitly declared child constructor skipping parent initialization differs from ordinary constructor promotion in one class. A local assignment, a fallback parent call and a separate parent instance are runnable but violate different parts of the contract.

**References:** [Primary reference 1](https://www.php.net/manual/en/language.oop5.decon.php)

## PHP-PILOT-013

A lease must be checked repeatedly using its injected clock, and expire when that clock reaches its deadline. Which return expression satisfies this contract on the same Lease object?

**Objective:** Use a controllable clock at each decision rather than caching time when constructing a long-lived object.

**Format:** architecture. **Difficulty:** Applied (intermediate). Connects dependency injection with the lifetime of an observed value.

**Prerequisites:** Closure invocation; Object lifetime; Dependency injection.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. The injected clock returns integer seconds and may advance between calls. Tests must control time without sleeping or changing the system clock.

**main.php — complete-file**

```php
<?php

final class Lease
{
    private int $createdAt;
    private ?int $firstCheck = null;

    public function __construct(private Closure $clock, private int $deadline)
    {
        $this->createdAt = ($clock)();
    }

    public function expired(): bool
    {
        return /* EXPIRED */ false;
    }
}

$tick = 9;
$clock = function () use (&$tick): int {
    return $tick;
};

$lease = new Lease($clock, 10);
$before = $lease->expired();

$tick = 10;
echo json_encode([$before, $lease->expired()]);
```

1. ($this->clock)() >= $this->deadline
2. $this->createdAt >= $this->deadline
3. time() >= $this->deadline
4. ($this->firstCheck ??= ($this->clock)()) >= $this->deadline

**Correct:** 1 (read-clock). Injecting a clock is useful only if decisions read it at the required time. A cached timestamp models a past observation, not the current clock.

**Trace:** The constructor and first check occur at 9. A later check on the same object must observe 10. Calling the injected closure each time produces [false,true].

**Each option:**

1. Each decision reads the injected clock; the demonstrated timeline produces false and then true.
2. createdAt stays 9, so expiry never reflects the clock advancing to 10. Misunderstanding: Assuming an injected time value stays current for the object’s lifetime.
3. This bypasses the injected clock and makes the supplied test timeline irrelevant. Misunderstanding: Keeping a hidden system-clock dependency despite accepting a controllable clock.
4. It caches 9 on the first check and reuses it after the injected clock advances. Misunderstanding: Assuming memoization preserves correctness for a changing dependency.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four candidate implementations were exercised; only the keyed candidate meets the requirement.

**Originality and wording review:** Reading an injected clock on every decision differs from merely implementing a Clock interface or producing a timestamp once. Caching is plausible for a long-lived object but wrong for this changing dependency; every alternative is exercised.

**References:** [Primary reference 1](https://www.php.net/manual/en/class.closure.php), [Primary reference 2](https://www.php.net/manual/en/function.time.php)

## PHP-PILOT-014

Which pair of labels is printed by these two classes?

**Objective:** Resolve trait methods against inherited methods and methods declared directly in the consuming class.

**Format:** execution. **Difficulty:** Applied (intermediate). Applies two method-precedence rules to separate classes.

**Prerequisites:** Traits; Inheritance; Method overriding.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. There is no second trait and no alias adaptation.

**main.php — complete-file**

```php
<?php

class BaseLabel
{
    public function label(): string
    {
        return 'base';
    }
}

trait TagLabel
{
    public function label(): string
    {
        return 'trait';
    }
}

class Tagged extends BaseLabel
{
    use TagLabel;
}

class Custom extends BaseLabel
{
    use TagLabel;

    public function label(): string
    {
        return 'own';
    }
}

echo (new Tagged())->label(), '|', (new Custom())->label();
```

1. base|own
2. trait|trait
3. A fatal method-collision error before output
4. trait|own

**Correct:** 4 (trait-own). A method declared in the consuming class takes precedence over a trait method, and a trait method takes precedence over an inherited method.

**Trace:** Tagged supplies no own method, so TagLabel wins over BaseLabel. Custom supplies its own method, so it prints own.

**Each option:**

1. Tagged’s trait method overrides the inherited BaseLabel method. Misunderstanding: Assuming an inherited class method outranks a trait method.
2. Custom’s own label method takes precedence over the trait. Misunderstanding: Assuming trait methods outrank methods written in the consuming class.
3. These are defined precedence cases; no conflicting pair of imported trait methods exists. Misunderstanding: Treating inheritance or a class override as a conflict between two traits.
4. The trait beats the inherited method in Tagged, while Custom’s own method beats the trait.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "trait|own".

**Originality and wording review:** Precedence between a trait, a parent method and an own method differs from resolving two imported traits with insteadof/as. The collision distractor targets confusion with the old two-trait case; the other pairs reverse one precedence rule each.

**References:** [Primary reference 1](https://www.php.net/manual/en/language.oop5.traits.php#language.oop5.traits.precedence)

## PHP-PILOT-015

Sender must be concrete and (new Sender())->message() must return "mail:ready". Which method can be added after use PrefixMessage in the class-body fragment?

**Objective:** Implement a trait’s abstract instance-method contract with a compatible signature.

**Format:** implementation. **Difficulty:** Applied (intermediate). Checks staticness, required arguments and the return type against an abstract contract.

**Prerequisites:** Traits; Abstract methods; Method signatures.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. Load PrefixMessage.php, then place the second fragment inside class Sender { ... }. There are no other methods or parent classes.

**PrefixMessage.php — complete-file**

```php
<?php

trait PrefixMessage
{
    abstract protected function prefix(): string;

    public function message(): string
    {
        return $this->prefix() . ':ready';
    }
}
```

**sender-members.php — fragment**

Class-body fragment inside a concrete Sender class; PrefixMessage is loaded first.

```php
use PrefixMessage;

/* METHOD */
```

1.

    ```php
    protected function prefix(): string
    {
        return 'mail';
    }
    ```
2.

    ```php
    protected static function prefix(): string
    {
        return 'mail';
    }
    ```
3.

    ```php
    protected function prefix(string $kind): string
    {
        return $kind;
    }
    ```
4.

    ```php
    protected function prefix(): int
    {
        return 1;
    }
    ```

**Correct:** 1 (instance). The concrete class must provide a compatible implementation of the trait’s abstract method. Only the instance method with no required arguments and a string result qualifies.

**Trace:** message invokes prefix on this instance with no arguments. The compatible method returns mail, which is concatenated with :ready. The other declarations fail compatibility checks.

**Each option:**

1. It implements the required instance method with no arguments and the required string result.
2. Staticness is part of compatibility; this cannot implement the trait’s non-static method. Misunderstanding: Assuming a static method can implement an instance-method requirement.
3. The trait calls prefix with no argument; adding a required parameter violates the contract. Misunderstanding: Assuming the consuming class can add a required argument to the trait contract.
4. The required return type is string; int is not a compatible implementation. Misunderstanding: Assuming concatenation permits changing the method’s declared return contract.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four candidate implementations were exercised; only the keyed candidate meets the requirement.

**Originality and wording review:** Implementing an abstract trait method differs from interface usage and trait conflict resolution. The fragment wrapper is explicit. All alternatives look like plausible method declarations; only one is compatible. The three rejection diagnostics are observed.

**References:** [Primary reference 1](https://www.php.net/manual/en/language.oop5.traits.php#language.oop5.traits.abstract)

## PHP-PILOT-016

What are the total, the first object’s own count, and the second object’s own count?

**Objective:** Distinguish shared class state from each instance’s own counter.

**Format:** execution. **Difficulty:** Foundation (junior). Counts three calls across two objects while tracking two kinds of property.

**Prerequisites:** Static properties; Instance properties.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. Only these two objects and three hit calls exist.

**main.php — complete-file**

```php
<?php

final class Visits
{
    public static int $total = 0;
    public int $own = 0;

    public function hit(): void
    {
        self::$total++;
        $this->own++;
    }
}

$a = new Visits();
$b = new Visits();

$a->hit();
$a->hit();
$b->hit();

echo Visits::$total, '|', $a->own, '|', $b->own;
```

1. 3|3|3
2. 3|2|1
3. 1|2|1
4. 2|2|1

**Correct:** 2 (separate). The static total has one value for this class; each object has its own own property.

**Trace:** The two calls on a take total to 2 and a->own to 2. The call on b takes total to 3 and b->own to 1.

**Each option:**

1. own belongs separately to a and b; neither own counter records all three calls. Misunderstanding: Treating instance properties as shared just like a static property.
2. total records all three calls, a records two, and b records one.
3. Constructing b does not replace the class’s static storage; each hit increments the same total. Misunderstanding: Treating the static value as the latest instance’s counter.
4. Visits::$total is class storage and includes b’s hit too. Misunderstanding: Assuming a class-level access selects the first created instance’s state.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "3|2|1".

**Originality and wording review:** Shared static class storage across instances differs from a function static local or a cloned scalar property. The four triples represent separate storage models rather than unrelated errors.

**References:** [Primary reference 1](https://www.php.net/manual/en/language.oop5.static.php)

## PHP-PILOT-017

Which output is produced by the unqualified call followed by the explicitly global call?

**Objective:** Distinguish an unqualified namespaced function call from an explicitly global call.

**Format:** execution. **Difficulty:** Foundation (junior). Resolves two function names with the relevant namespace supplied.

**Prerequisites:** Namespaces; Fully qualified names.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. No use function imports or additional definitions are present.

**main.php — complete-file**

```php
<?php

namespace Metrics;

function strlen(string $value): int
{
    return 99;
}

echo strlen('abc'), '|', \strlen('abc');
```

1. 3|3
2. 99|99
3. 99|3
4. A fatal redeclaration error before output

**Correct:** 3 (local-global). An unqualified function call can resolve to a function in the current namespace. A leading backslash explicitly chooses the global namespace.

**Trace:** Metrics\strlen returns the constant 99. Global strlen receives the three-byte string abc and returns 3.

**Each option:**

1. The unqualified call finds Metrics\strlen first. Misunderstanding: Assuming a built-in function always takes precedence over a namespaced function.
2. The backslash explicitly selects the global function, which counts three bytes. Misunderstanding: Ignoring the leading backslash on the second call.
3. The first call selects Metrics\strlen and the second selects the built-in global strlen.
4. Metrics\strlen is distinct from global strlen, so this definition is allowed. Misunderstanding: Treating function names in different namespaces as the same symbol.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "99|3".

**Originality and wording review:** Function lookup in a namespace differs from class import aliases. The explicit global call makes the lookup boundary observable. The two same-namespace and mixed-output choices require namespace knowledge; the redeclaration alternative reflects global built-in restrictions.

**References:** [Primary reference 1](https://www.php.net/manual/en/language.namespaces.fallback.php)

## PHP-PILOT-018

A customer may spend their entire available balance. Both arguments are positive integer cents. Which test fails against the current function and demonstrates that requirement?

**Objective:** Select a test that distinguishes an inclusive balance limit from an exclusive one.

**Format:** testing. **Difficulty:** Foundation (junior). Identifies the single boundary at which the implementation differs from the requirement.

**Prerequisites:** Comparison operators; Boolean assertions.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. No fees, credit, floating-point amounts or other constraints apply. Each option states an expected boolean result.

**main.php — complete-file**

```php
<?php

function canSpend(int $balance, int $amount): bool
{
    return $amount < $balance;
}
```

1. canSpend(100, 99) should be true
2. canSpend(100, 101) should be false
3. canSpend(100, 1) should be true
4. canSpend(100, 100) should be true

**Correct:** 4 (equal). The equality case is the difference between the current < test and the required <= test.

**Trace:** At balance=100 and amount=100, 100 < 100 is false. Changing the operator to <= makes that regression assertion pass while preserving the other three shown outcomes.

**Each option:**

1. Both comparisons accept 99, so this assertion passes the buggy implementation. Misunderstanding: Testing just below the boundary while expecting it to distinguish < from <=.
2. Both comparisons reject 101, so this assertion does not expose the defect. Misunderstanding: Testing just above the boundary while expecting it to distinguish < from <=.
3. This passes with either operator and does not establish whether the whole balance may be spent. Misunderstanding: Using an ordinary valid amount instead of the changed boundary.
4. The implementation returns false for equality, which contradicts the stated full-balance requirement.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four tests were run against the buggy and repaired implementations; only the keyed test fails before the repair.

**Originality and wording review:** Selecting the equality regression case differs from a general assertion using a stubbed price collaborator. All four tests have valid expectations under the contract. A learner can select the boundary using requirements and testing knowledge; that is the intended skill, not a wording shortcut.

**References:** [Primary reference 1](https://www.php.net/manual/en/language.operators.comparison.php)

## PHP-PILOT-019

The intention is to throw the built-in RuntimeException. Which class name is actually printed by the catch?

**Objective:** Diagnose an unqualified class name in a namespace when the intended class is global.

**Format:** debugging. **Difficulty:** Applied (intermediate). Distinguishes class resolution from exception construction and the outer catch.

**Prerequisites:** Namespaces; Class names; Throwable.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. There is no Jobs\RuntimeException, no class alias, no use import and no autoloader. The leading backslashes in the catch and get_class call are intentional.

**main.php — complete-file**

```php
<?php

namespace Jobs;

try {
    throw new RuntimeException('failed');
} catch (\Throwable $error) {
    echo \get_class($error);
}
```

1. Error
2. RuntimeException
3. Jobs\RuntimeException
4. Throwable

**Correct:** 1 (lookup-error). The unqualified class name resolves within Jobs. With no matching class or import, PHP raises Error before constructing the intended exception.

**Trace:** Use new \RuntimeException(...) or import RuntimeException to throw the global class. The catch already names global Throwable, so it catches the lookup Error and prints its concrete class.

**Each option:**

1. PHP tries to construct Jobs\RuntimeException; the missing class raises Error, which Throwable catches.
2. Classes do not use the global fallback that unqualified function calls can use. Misunderstanding: Assuming unqualified class names fall back to global classes.
3. No such class exists, so construction fails before that exception could be thrown. Misunderstanding: Assuming naming an unknown class creates a new namespaced exception type.
4. Throwable is the interface matched by catch; get_class reports the concrete Error instance. Misunderstanding: Assuming get_class reports the declared catch type.

**Validation:** PHP 8.5.2: 1 recorded case; PHP 8.4.17: 1 recorded case. Observed stdout: "Error".

**Originality and wording review:** Class names lack the global fallback available to functions. Unlike item 017, the decisive event is construction failure caught through Throwable. The choices distinguish the intended class, missing namespaced class, concrete lookup Error and catch interface. Shared namespace vocabulary is intentional, not a renamed scenario.

**References:** [Primary reference 1](https://www.php.net/manual/en/language.namespaces.rules.php), [Primary reference 2](https://www.php.net/manual/en/language.namespaces.fallback.php)

## PHP-PILOT-020

readFirst borrows the caller’s handle. After it returns, the caller must read the next line from that same handle. Which statement should replace the entire /* CLEANUP */ comment? Leave every other line unchanged.

**Objective:** Preserve a borrowed stream and its position so the caller can continue reading.

**Format:** code-review. **Difficulty:** Applied (intermediate). Combines ownership of a resource with its cursor state at an API boundary.

**Prerequisites:** Resource handles; fgets; finally.

**Runtime:** PHP 8.4 / 8.5, CLI; E_ALL; no custom error handler. 

**Assumptions:** Run once in a fresh PHP process; only the shown definitions and inputs exist. The caller owns and closes the successfully opened stream. Both lines exist and reads succeed. The function must consume exactly its first line and leave the handle usable.

**main.php — complete-file**

```php
<?php

function readFirst($handle): string
{
    try {
        return fgets($handle);
    } finally {
        /* CLEANUP */
    }
}

$h = fopen('php://memory', 'w+');
fwrite($h, "alpha\nbeta\n");
rewind($h);

$first = readFirst($h);
$second = fgets($h);

echo json_encode([$first, $second]);

fclose($h);
```

1. fclose($handle);
2. unset($handle);
3. rewind($handle);
4. fseek($handle, 0, SEEK_END);

**Correct:** 2 (detach-local). The caller owns the handle and needs its advanced cursor. Unsetting the callee’s local variable preserves both the caller’s reference and that position.

**Trace:** fgets consumes alpha plus its newline. The finally block unsets only the local parameter. The caller’s h still refers to the open stream positioned before beta; the caller closes it afterward. There is no fclose in the finally block to retain or replace. A simpler refactor could omit this finally block entirely, but that is outside this one-statement task.

**Each option:**

1. Closing a borrowed handle makes the caller’s next fgets fail instead of reading beta. Misunderstanding: Assuming every function using a handle should close it.
2. This drops the local variable only; the caller still owns the resource at its current position after alpha.
3. The handle stays open but the caller reads alpha again instead of beta. Misunderstanding: Assuming leaving a borrowed resource at the beginning preserves the caller’s intended continuation.
4. The next read starts at EOF and returns false, violating the next-line contract. Misunderstanding: Assuming a reader should leave a shared stream positioned for a later append.

**Validation:** PHP 8.5.2: 4 recorded cases; PHP 8.4.17: 4 recorded cases. All four candidate implementations were exercised; only the keyed candidate meets the requirement.

**Originality and wording review:** Ownership of a borrowed handle differs from closing a handle acquired by the helper, and from an ordinary overwrite. Both openness and position are requirements. Every alternative is a resource/variable operation. The key preserves the caller’s reference; other operations violate openness or the next-line position.

**References:** [Primary reference 1](https://www.php.net/manual/en/function.fclose.php), [Primary reference 2](https://www.php.net/manual/en/function.unset.php), [Primary reference 3](https://www.php.net/manual/en/language.types.resource.php)
