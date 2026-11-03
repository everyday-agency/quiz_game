# Editorial pilot — all 20 before/after reviews

These are revisions of existing IDs, not new questions. Original displayed options below include their old padding; [the machine-readable export](pilot-before-after.json) also preserves original core options and all revised metadata. Source option numbers are not fixed display positions: the browser shuffles options by identity.

All 12 PHP pilot fixtures passed on PHP 8.4.17 and 8.5.2. All 8 Laravel items have matching isolated v13.0.0 contract checks on both runtimes. Laravel collaborator limitations are documented in [the fixture notes](../tests/fixtures/README.md). Difficulty remains an editorial judgment awaiting learner calibration.

| ID | Before → after difficulty | Learning objective |
|---|---|---|
| PQ-002 | Applied → Foundation | Determine whether removing strict_types changes a call whose argument already has the required scalar type. |
| PQ-004 | Advanced → Foundation | Recognize the int-to-float exception to strict scalar argument checking. |
| PQ-005 | Foundation → Applied | Apply scalar argument strictness at a call site across an included file. |
| PQ-014 | Applied → Applied | Distinguish arrow capture by value from closure capture by reference. |
| PQ-021 | Foundation → Applied | Trace closure captures and a static local across repeated calls in one valid PHP file. |
| PQ-041 | Foundation → Foundation | Read associative destructuring and a default supplied by null coalescing. |
| PQ-053 | Foundation → Applied | Account for skipped side effects and boolean results under short-circuit evaluation. |
| PQ-061 | Foundation → Foundation | Use match’s strict comparison to distinguish numeric strings from integers. |
| PQ-113 | Foundation → Applied | Distinguish successful CSV parsing from version-specific deprecation diagnostics. |
| PQ-137 | Foundation → Applied | Trace a server-side upload size boundary before choosing a destination extension. |
| PQ-197 | Foundation → Applied | Distinguish a shallow clone’s identity and scalar state from a shared nested object. |
| PQ-281 | Foundation → Applied | Explain why cloning a message to change headers need not isolate its mutable body object. |
| LQ-046 | Advanced → Applied | Choose a normalization hook that changes both validated input and the returned validated payload. |
| LQ-314 | Applied → Applied | Distinguish request input after passedValidation from the validator’s accepted snapshot. |
| LQ-413 | Foundation → Applied | Distinguish route name prefixes, URL path prefixes and absolute URL generation. |
| LQ-453 | Foundation → Applied | Determine attribute dirty and saved-change flags when assigning an unchanged value. |
| LQ-142 | Advanced → Advanced | Coordinate different job classes with a shared overlap key and a lease that covers the critical section. |
| LQ-489 | Foundation → Applied | Resolve the precedence of time-based and count-based queue retry policies. |
| LQ-545 | Foundation → Foundation | Determine default logging behavior after a registered reporting callback returns false. |
| LQ-546 | Applied → Applied | Repair context enrichment without suppressing or recursively invoking default reporting. |


## PQ-002


**Issue:** The generic preserve-the-mechanism answer did not test whether strict typing changes this integer argument at all; obviously nontechnical distractors revealed the key.


### Before


Expression evaluation with strict scalar calls: which review comment best preserves the guarantee demonstrated by this implementation?

**Original displayed snippet**

```php
<?php
declare(strict_types=1);

function twice(int $value): int {
    return $value * 2;
}

$subtotal = 10 + 5;
echo twice($subtotal);
```

1. Keep the relevant mechanism because PHP evaluates expressions before passing their results to functions and strict_types affects scalar calls made from the declaring file. Evidence to inspect: operator semantics and the stated constraints. **[key]**
2. Remove the relevant mechanism because strict_types converts PHP into a globally strict language and prevents every implicit conversion in every included file. Reasoning check: compare this claim with the failure path.
3. Replace the implementation with a comment describing the intended result. Evidence to inspect: the displayed values, lifecycle timing, operator semantics, configuration, the API contract, the data boundary, and the exact input types.
4. Suppress every failure so callers always receive a successful-looking value. Reasoning check: compare this claim with side effects, runtime behavior, operator semantics, lifecycle timing, state changes, the failure path, and the exact input types.

**Original explanation:** The displayed PHP code demonstrates that PHP evaluates expressions before passing their results to functions and strict_types affects scalar calls made from the declaring file. The tempting mistake is to assume that strict_types converts PHP into a globally strict language and prevents every implicit conversion in every included file. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


A reviewer proposes removing declare(strict_types=1) from this file. What changes for the exact invocation shown?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
declare(strict_types=1);
function twice(int $value): int { return $value * 2; }
$subtotal = 10 + 5;
echo twice($subtotal);
```

1. It prints 30 only after removing the declaration.
2. It prints 15 with the declaration and 30 without it.
3. It prints 30 with or without the declaration. **[key]**
4. It prints 30 with the declaration and raises TypeError without it.

**Explanation:** 10 + 5 evaluates to integer 15. The int parameter already accepts it, so both modes return integer 30. This call does not demonstrate a coercion difference.

**Option-by-option reasoning:**


1. The original call already passes an int and does not fail.

2. strict_types does not change multiplication or expression evaluation.

3. Both variants pass the same integer argument and compute 15 * 2.

4. Removing strict scalar checking cannot make this already-valid int argument fail.

**Objective:** Determine whether removing strict_types changes a call whose argument already has the required scalar type.

**Difficulty:** Foundation. One argument-type check after evaluating an integer expression.

**Validation:** Observed stdout "30" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-004


**Issue:** The negative-stem key was a misconception, but generated learning notes presented it as true. The revision uses a positive, executable strict-typing question.


### Before


Expression evaluation with strict scalar calls: which interpretation is the dangerous trap when this code is changed or reused?

**Original displayed snippet**

```php
<?php
declare(strict_types=1);

function twice(int $value): int {
    return $value * 2;
}

$subtotal = 10 + 5;
echo twice($subtotal);
```

1. strict_types converts PHP into a globally strict language and prevents every implicit conversion in every included file. Evidence to inspect: operator semantics, the stated constraints, and lifecycle timing. **[key]**
2. PHP evaluates expressions before passing their results to functions and strict_types affects scalar calls made from the declaring file. Evidence to inspect: the failure path.
3. The exact API contract shown in the snippet continues to apply. Evidence to inspect: the displayed values, lifecycle timing, operator semantics, configuration, and the API contract.
4. A focused test should observe the value, branch, side effect, or rendered output involved. Reasoning check: compare this claim with side effects, runtime behavior, and operator semantics.

**Original explanation:** The unsafe interpretation is that strict_types converts PHP into a globally strict language and prevents every implicit conversion in every included file. In this snippet, PHP evaluates expressions before passing their results to functions and strict_types affects scalar calls made from the declaring file. A reviewer has to follow the actual operator, branch, framework lifecycle, or library contract rather than infer behavior from a familiar-looking name.


### After — revision 2


The caller uses strict scalar typing. What happens when the integer literal is passed to this float parameter?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
declare(strict_types=1);
function half(float $value): float { return $value / 2; }
echo number_format(half(6), 1, '.', '');
```

1. It raises TypeError before half runs.
2. It prints 3.0. **[key]**
3. It prints 6.0.
4. It emits an argument warning, then prints 3.0.

**Explanation:** Strict scalar argument checking permits an int argument for a float parameter. half receives 6.0, divides by two, and number_format prints 3.0 without a diagnostic.

**Option-by-option reasoning:**


1. An int is accepted for a float parameter even in strict mode.

2. The widening conversion is permitted, and the result is formatted with one decimal place.

3. The function divides its input by two.

4. This permitted conversion produces no argument warning.

**Objective:** Recognize the int-to-float exception to strict scalar argument checking.

**Difficulty:** Foundation. Applies one scalar typing exception and reads a numeric output.

**Validation:** Observed stdout "3.0" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-005


**Issue:** The required legacy file and function signature were missing, and a comment gave away the intended call-site rule.


### Before


Included files keep their own call-site rules: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
<?php
declare(strict_types=1);

require __DIR__ . '/legacy.php';

echo formatTotal('12');
// The coercion decision belongs to the file that calls formatTotal().
```

1. PHP evaluates expressions before passing their results to functions and strict_types affects scalar calls made from the declaring file. Reasoning check: compare this claim with configuration and runtime behavior. **[key]**
2. strict_types converts PHP into a globally strict language and prevents every implicit conversion in every included file. Evidence to inspect: the displayed values, the exact input types, configuration, and the failure path.
3. The snippet changes editor hints but cannot affect the executed program. Reasoning check: compare this claim with control flow, state changes, lifecycle timing, and the data boundary.
4. The runtime skips the shown branch and supplies a safe default automatically. Evidence to inspect: configuration, operator semantics, the data boundary, the observable output, the displayed values, state changes, and the API contract.

**Original explanation:** The displayed PHP code demonstrates that PHP evaluates expressions before passing their results to functions and strict_types affects scalar calls made from the declaring file. The tempting mistake is to assume that strict_types converts PHP into a globally strict language and prevents every implicit conversion in every included file. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


Run caller.php. legacy.php has no strict_types declaration. Which text does the caller print?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Both files exist exactly as shown. Execute caller.php only; the required file emits no output when loaded.

**caller.php** (php-file)

```php
<?php
declare(strict_types=1);
require __DIR__ . '/legacy.php';
try {
    echo formatTotal('12');
} catch (TypeError $error) {
    echo 'TypeError';
}
```

**legacy.php** (php-file)

```php
<?php
function formatTotal(int $amount): string {
    return number_format($amount, 2, '.', '');
}
```

1. 12.00
2. 12
3. An empty string
4. TypeError **[key]**

**Explanation:** The strict caller passes a string to an int parameter. The call raises TypeError before the function body executes; the catch prints TypeError. The included file’s coercive mode does not control this call.

**Option-by-option reasoning:**


1. This would be the formatted result if a coercive caller accepted the numeric string.

2. The function is not entered, and its normal return would include two decimal places.

3. The catch branch emits text, so execution is not silent.

4. The caller’s strict mode rejects the string argument and the catch handles that error.

**Objective:** Apply scalar argument strictness at a call site across an included file.

**Difficulty:** Applied. Distinguishes the calling file from the file defining the function.

**Validation:** Observed stdout "TypeError" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-014


**Issue:** The explanation discussed a static local absent from the snippet; comment replacement and failure suppression were trivial distractors.


### Before


Capturing by value versus by reference: which review comment best preserves the guarantee demonstrated by this implementation?

**Original displayed snippet**

```php
<?php
$rate = 2;
$byValue = fn (int $n) => $n * $rate;
$byReference = function (int $n) use (&$rate): int {
    return $n * $rate;
};

$rate = 3;
echo $byValue(4), " ", $byReference(4);
```

1. Keep the relevant mechanism because closures capture variables explicitly and a static local retains its value between calls in the same request. Evidence to inspect: runtime behavior, the observable output, and control flow. **[key]**
2. Remove the relevant mechanism because ordinary local variables are shared globally and closures automatically see every outer variable by reference. Evidence to inspect: operator semantics and control flow.
3. Replace the implementation with a comment describing the intended result. Evidence to inspect: control flow, the data boundary, lifecycle timing, the failure path, state changes, and configuration.
4. Suppress every failure so callers always receive a successful-looking value. Evidence to inspect: operator semantics, runtime behavior, side effects, the exact input types, the displayed values, and lifecycle timing.

**Original explanation:** The displayed PHP code demonstrates that closures capture variables explicitly and a static local retains its value between calls in the same request. The tempting mistake is to assume that ordinary local variables are shared globally and closures automatically see every outer variable by reference. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


After rate changes, what does the program print when it invokes both callables?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
$rate = 2;
$byValue = fn (int $n) => $n * $rate;
$byReference = function (int $n) use (&$rate): int { return $n * $rate; };
$rate = 3;
echo $byValue(4), ' ', $byReference(4);
```

1. 8 8
2. 12 12
3. 8 12 **[key]**
4. 12 8

**Explanation:** The arrow captures the value 2 when created. The explicit reference points to rate, which later becomes 3. Their results are 4 * 2 and 4 * 3.

**Option-by-option reasoning:**


1. This assumes the explicit reference captured a value instead.

2. This assumes the arrow also observes the later variable assignment.

3. The first retains 2 and the second reads 3.

4. This reverses the capture mechanisms.

**Objective:** Distinguish arrow capture by value from closure capture by reference.

**Difficulty:** Applied. Tracks two captures across a later mutation.

**Validation:** Observed stdout "8 12" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-021


**Issue:** Two PHP opening tags were concatenated inside one open block, causing a parse error in a question that assumed normal execution.


### Before


Variables, scope & constants: integration review across two cooperating code paths: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
<?php
$rate = 2;
$byValue = fn (int $n) => $n * $rate;
$byReference = function (int $n) use (&$rate): int {
    return $n * $rate;
};

$rate = 3;
echo $byValue(4), " ", $byReference(4);

// --- cooperating path ---
<?php
function nextSequence(): int {
    static $value = 0;
    return ++$value;
}

echo nextSequence();
echo nextSequence();
echo nextSequence();
```

1. the combined example preserves the shared guarantee across both cooperating paths: closures capture variables explicitly and a static local retains its value between calls in the same request. Reasoning check: compare this claim with control flow. **[key]**
2. either guarantee appears automatically even if its corresponding operator, guard, hook, constraint, or API call is removed. Reasoning check: compare this claim with lifecycle timing, runtime behavior, operator semantics, state changes, side effects, and the observable output.
3. The snippet changes editor hints but cannot affect the executed program. Reasoning check: compare this claim with control flow, configuration, runtime behavior, state changes, the exact input types, side effects, the observable output, the stated constraints, and the failure path.
4. The runtime skips the shown branch and supplies a safe default automatically. Reasoning check: compare this claim with the exact input types, control flow, operator semantics, the observable output, side effects, and lifecycle timing.

**Original explanation:** The displayed PHP code demonstrates that the combined example preserves the shared guarantee across both cooperating paths: closures capture variables explicitly and a static local retains its value between calls in the same request. The tempting mistake is to assume that either guarantee appears automatically even if its corresponding operator, guard, hook, constraint, or API call is removed. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


This is one complete PHP file. What exact output is produced by the two callables and the three sequence calls?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
$rate = 2;
$byValue = fn (int $n) => $n * $rate;
$byReference = function (int $n) use (&$rate): int { return $n * $rate; };
$rate = 3;
echo $byValue(4), ' ', $byReference(4), '|';
function nextSequence(): int {
    static $value = 0;
    return ++$value;
}
echo nextSequence(), nextSequence(), nextSequence();
```

1. 8 8|123
2. 8 12|123 **[key]**
3. 8 12|111
4. 12 12|123

**Explanation:** The two captures produce 8 and 12. The static local initializes once to 0 and retains each increment, so successive calls return 1, 2 and 3.

**Option-by-option reasoning:**


1. The reference capture reads the changed rate, producing 12 rather than 8.

2. Both capture semantics and the retained static local are reflected in this output.

3. A static local is not reinitialized on every call.

4. The arrow keeps its captured value 2 rather than observing the later 3.

**Objective:** Trace closure captures and a static local across repeated calls in one valid PHP file.

**Difficulty:** Applied. Combines capture timing with persistent function-local state.

**Validation:** Observed stdout "8 12|123" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-041


**Issue:** The answer and explanation discussed array_map/filter/values although the snippet used associative destructuring and null coalescing.


### Before


Associative destructuring with defaults: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
<?php
$row = ["id" => 7, "name" => "Ada"];

["id" => $id, "name" => $name] = $row;
$role = $row["role"] ?? "viewer";

$result = compact("id", "name", "role");
print_r($result);
```

1. array_map transforms values, array_filter preserves original keys, and array_values can intentionally reindex the result. Evidence to inspect: control flow, the observable output, the data boundary, and lifecycle timing. **[key]**
2. all PHP array functions preserve identical keys and the spread operator always behaves like array_merge for every key type. Evidence to inspect: operator semantics, lifecycle timing, side effects, the API contract, and configuration.
3. The snippet changes editor hints but cannot affect the executed program. Evidence to inspect: the observable output. Keep the judgment limited to the exact scenario shown; distinguish an explicit guarantee from behavior that merely seems likely.
4. The runtime skips the shown branch and supplies a safe default automatically. Reasoning check: compare this claim with side effects, the API contract, and lifecycle timing.

**Original explanation:** The displayed PHP code demonstrates that array_map transforms values, array_filter preserves original keys, and array_values can intentionally reindex the result. The tempting mistake is to assume that all PHP array functions preserve identical keys and the spread operator always behaves like array_merge for every key type. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


Which values are passed to printf after the row is destructured and role is assigned?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
$row = ['id' => 7, 'name' => 'Ada'];
['id' => $id, 'name' => $name] = $row;
$role = $row['role'] ?? 'viewer';
printf('%d|%s|%s', $id, $name, $role);
```

1. 7|Ada|viewer **[key]**
2. 0|Ada|viewer
3. 7|Ada|
4. 7|viewer|Ada

**Explanation:** Associative destructuring reads the named id and name keys. The absent role triggers the right operand of ??, yielding viewer.

**Option-by-option reasoning:**


1. The named keys produce 7 and Ada; the missing key uses viewer.

2. Destructuring does not replace the supplied id with an array position.

3. Null coalescing supplies viewer rather than an empty value.

4. Destructuring follows explicit key names, not the order of later variable assignments.

**Objective:** Read associative destructuring and a default supplied by null coalescing.

**Difficulty:** Foundation. Directly traces known keys and one missing key.

**Validation:** Observed stdout "7|Ada|viewer" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-053


**Issue:** The shared answer mixed increment behavior from another example into a short-circuiting question; it did not ask the learner to trace calls.


### Before


Short circuiting controls side effects: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
<?php
$calls = 0;
$check = function () use (&$calls): bool {
    $calls++;
    return true;
};

$first = false && $check();
$second = true || $check();
echo $calls;
```

1. pre-increment changes the value before returning it, post-increment returns the old value, and short-circuit operators may skip the right side. Evidence to inspect: the displayed values. **[key]**
2. prefix and postfix increment always return the same value and both sides of boolean expressions are always evaluated. Evidence to inspect: control flow, the displayed values, and state changes.
3. The snippet changes editor hints but cannot affect the executed program. Reasoning check: compare this claim with the displayed values, side effects, state changes, configuration, the exact input types, and the data boundary.
4. The runtime skips the shown branch and supplies a safe default automatically. Reasoning check: compare this claim with lifecycle timing, the exact input types, control flow, the failure path, and runtime behavior.

**Original explanation:** The displayed PHP code demonstrates that pre-increment changes the value before returning it, post-increment returns the old value, and short-circuit operators may skip the right side. The tempting mistake is to assume that prefix and postfix increment always return the same value and both sides of boolean expressions are always evaluated. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


Which JSON array is emitted? Its elements are the first boolean result, the second result, and the number of calls to check.

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
$calls = 0;
$check = function () use (&$calls): bool { $calls++; return true; };
$first = false && $check();
$second = true || $check();
echo json_encode([$first, $second, $calls]);
```

1. [false,true,2]
2. [false,true,1]
3. [true,true,0]
4. [false,true,0] **[key]**

**Explanation:** false determines && without its right operand; true determines || without its right operand. Neither call occurs, so calls remains 0 and the results are false and true.

**Option-by-option reasoning:**


1. This evaluates both right operands despite short-circuiting.

2. Both right operands are skipped, not only one.

3. The first expression remains false; skipping its right operand does not change that result.

4. The boolean values and unchanged counter all follow from short-circuiting.

**Objective:** Account for skipped side effects and boolean results under short-circuit evaluation.

**Difficulty:** Applied. Tracks two branches and a captured mutable counter.

**Validation:** Observed stdout "[false,true,0]" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-061


**Issue:** The shared answer combined match and loop-control facts, instead of discriminating between strict and loose matching in this program.


### Before


Match expressions are strict and non-fallthrough: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
<?php
$status = "1";

$label = match ($status) {
    1 => "integer one",
    "1" => "string one",
    default => "other",
};

echo $label;
```

1. match uses strict comparison and returns a value, while loop control levels decide which enclosing structure is affected. Evidence to inspect: the displayed values. **[key]**
2. match falls through like switch and break without a level always exits every enclosing loop. Reasoning check: compare this claim with control flow and operator semantics.
3. The snippet changes editor hints but cannot affect the executed program. Evidence to inspect: operator semantics, the API contract, the displayed values, and the exact input types.
4. The runtime skips the shown branch and supplies a safe default automatically. Reasoning check: compare this claim with the observable output, state changes, the displayed values, and the failure path.

**Original explanation:** The displayed PHP code demonstrates that match uses strict comparison and returns a value, while loop control levels decide which enclosing structure is affected. The tempting mistake is to assume that match falls through like switch and break without a level always exits every enclosing loop. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


Which label is selected by this match expression for the given status value?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
$status = '1';
echo match ($status) {
    1 => 'integer one',
    '1' => 'string one',
    default => 'other',
};
```

1. integer one
2. string one **[key]**
3. other
4. integer onestring one

**Explanation:** match uses strict identity. The string value does not match integer 1, matches string 1, and returns that arm without fallthrough.

**Option-by-option reasoning:**


1. That arm would match integer 1, not the provided string.

2. Both type and value match the second arm.

3. A matching string arm exists, so the default is not selected.

4. match returns a single matching arm and does not fall through.

**Objective:** Use match’s strict comparison to distinguish numeric strings from integers.

**Difficulty:** Foundation. Applies one comparison rule to explicit match arms.

**Validation:** Observed stdout "string one" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-113


**Issue:** The answer discussed JSON in a CSV snippet, omitted the input fixture and missed the PHP 8.4+ escape-argument deprecation.


### Before


Reading CSV through a stream handle: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
<?php
$handle = fopen(__DIR__ . '/users.csv', 'rb');

try {
    while (($row = fgetcsv($handle)) !== false) {
        [$id, $email] = $row;
        echo "$id:$email
";
    }
} finally { fclose($handle); }
```

1. JSON_THROW_ON_ERROR turns invalid JSON into an exception and stream handles should be closed even when parsing fails. Reasoning check: compare this claim with the displayed values, operator semantics, and side effects. **[key]**
2. json_decode always throws automatically and file_get_contents guarantees valid UTF-8 JSON. Evidence to inspect: state changes, the data boundary, control flow, and side effects.
3. The snippet changes editor hints but cannot affect the executed program. Reasoning check: compare this claim with the displayed values, operator semantics, the API contract, lifecycle timing, runtime behavior, and side effects.
4. The runtime skips the shown branch and supplies a safe default automatically. Evidence to inspect: control flow, runtime behavior, the observable output, the failure path, and the API contract.

**Original explanation:** The displayed PHP code demonstrates that jSON_THROW_ON_ERROR turns invalid JSON into an exception and stream handles should be closed even when parsing fails. The tempting mistake is to assume that json_decode always throws automatically and file_get_contents guarantees valid UTF-8 JSON. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


The stream opens successfully. Which row and diagnostic does the fgetcsv call produce on PHP 8.4 or 8.5 with E_ALL?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
$handle = fopen('php://memory', 'r+');
fwrite($handle, "7,ada@example.test
");
rewind($handle);
$row = fgetcsv($handle);
fclose($handle);
echo json_encode($row);
```

1. ["7","ada@example.test"] with no diagnostic
2. ["7","ada@example.test"] and E_WARNING about the omitted escape argument
3. ["7","ada@example.test"] and E_DEPRECATED about the omitted escape argument **[key]**
4. No row; a TypeError is thrown for the omitted escape argument

**Explanation:** The row parses into two strings. PHP 8.4+ also emits E_DEPRECATED when fgetcsv relies on the default escape argument. Supplying escape: "" explicitly avoids this deprecation for conventional doubled-quote CSV.

**Option-by-option reasoning:**


1. The data result is right, but PHP 8.4+ emits the deprecation under E_ALL.

2. The diagnostic level is E_DEPRECATED, not E_WARNING.

3. The successful row and nonfatal deprecation occur together.

4. The omitted optional argument is deprecated, not a missing-required-argument TypeError.

**Objective:** Distinguish successful CSV parsing from version-specific deprecation diagnostics.

**Difficulty:** Applied. Combines stream state, parsed fields and the PHP 8.4+ escape-argument change.

**Validation:** Observed stdout "[\"7\",\"ada@example.test\"]"; diagnostic: fgetcsv-escape-deprecation on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/function.fgetcsv.php)


## PQ-137


**Issue:** The destination fragment depended on undefined upstream upload variables and its shared guarantee mentioned a size check not present in the code.


### Before


Generating a server-controlled destination name: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
<?php
$extension = match ($mime) {
    "image/png" => "png",
    "image/jpeg" => "jpg",
};

$target = __DIR__ . "/uploads/" . bin2hex(random_bytes(16)) . ".$extension";
if (!move_uploaded_file($file["tmp_name"], $target)) {
    throw new RuntimeException("Move failed");
}
```

1. uploaded files require error, size, MIME, and destination checks before move_uploaded_file stores them. Reasoning check: compare this claim with the API contract, side effects, state changes, and the failure path. **[key]**
2. the browser-provided filename and MIME type are trustworthy enough to use directly as a server path. Evidence to inspect: the displayed values and state changes.
3. The snippet changes editor hints but cannot affect the executed program. Evidence to inspect: the API contract, the exact input types, and side effects.
4. The runtime skips the shown branch and supplies a safe default automatically. Evidence to inspect: configuration, the API contract, operator semantics, the failure path, and state changes.

**Original explanation:** The displayed PHP code demonstrates that uploaded files require error, size, MIME, and destination checks before move_uploaded_file stores them. The tempting mistake is to assume that the browser-provided filename and MIME type are trustworthy enough to use directly as a server path. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


An earlier upload step has established UPLOAD_ERR_OK and obtained MIME and byte count on the server. Which result does this destination decision produce for the supplied values?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. The byte count and MIME are trusted results of server-side checks, not browser metadata. The code chooses an extension only; it neither moves a file nor claims to implement all upload protections.

**main.php** (php-file)

```php
<?php
function chooseExtension(string $detectedMime, int $bytes): string {
    if ($bytes > 2 * 1024 * 1024) {
        throw new LengthException('too large');
    }
    return match ($detectedMime) {
        'image/png' => 'png',
        'image/jpeg' => 'jpg',
        default => throw new InvalidArgumentException('unsupported'),
    };
}
try {
    echo chooseExtension('image/png', 2097152);
} catch (LengthException | InvalidArgumentException $error) {
    echo $error->getMessage();
}
```

1. too large
2. unsupported
3. png **[key]**
4. image/png

**Explanation:** 2 * 1024 * 1024 equals 2097152. The test uses >, so an exactly two-MiB upload is accepted. The PNG MIME arm returns the extension png.

**Option-by-option reasoning:**


1. The boundary value would be rejected by >=, but the shown condition uses >.

2. image/png is explicitly allowed by the match expression.

3. The size passes and the MIME is mapped to png.

4. The function returns an extension, not the input MIME string.

**Objective:** Trace a server-side upload size boundary before choosing a destination extension.

**Difficulty:** Applied. Combines byte units, an exclusive upper-bound check, and MIME-to-extension mapping.

**Validation:** Observed stdout "png" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-197


**Issue:** The generic answer combined constructor promotion and readonly behavior with a clone snippet; it did not test scalar copying versus object aliasing.


### Before


Clone creates a distinct object identity: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
<?php
final class Counter {
    public function __construct(public int $value) {}
}

$first = new Counter(1);
$second = clone $first;
$second->value++;

var_dump($first === $second, $first->value, $second->value);
```

1. constructor promotion initializes typed properties and readonly prevents reassignment after initialization without making referenced objects deeply immutable. Evidence to inspect: configuration, runtime behavior, control flow, the API contract, state changes, and the failure path. **[key]**
2. readonly recursively freezes every object and array reachable from the property and cloning preserves object identity. Reasoning check: compare this claim with side effects, operator semantics, and the exact input types.
3. The snippet changes editor hints but cannot affect the executed program. Reasoning check: compare this claim with runtime behavior, the data boundary, the exact input types, configuration, control flow, and the observable output.
4. The runtime skips the shown branch and supplies a safe default automatically. Reasoning check: compare this claim with the exact input types, operator semantics, side effects, and the failure path.

**Original explanation:** The displayed PHP code demonstrates that constructor promotion initializes typed properties and readonly prevents reassignment after initialization without making referenced objects deeply immutable. The tempting mistake is to assume that readonly recursively freezes every object and array reachable from the property and cloning preserves object identity. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


After cloning the counter and mutating both a scalar and a nested object through the clone, which JSON array is printed?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
final class Counter {
    public function __construct(public int $value, public object $meta) {}
}
$first = new Counter(1, (object) ['label' => 'old']);
$second = clone $first;
$second->value++;
$second->meta->label = 'new';
echo json_encode([$first === $second, $first->value, $first->meta->label]);
```

1. [false,1,"old"]
2. [true,2,"new"]
3. [false,2,"new"]
4. [false,1,"new"] **[key]**

**Explanation:** clone creates a distinct Counter and copies its scalar value. It does not clone the nested meta object, so both counters still refer to the same meta instance.

**Option-by-option reasoning:**


1. This assumes cloning the outer object also clones its nested object.

2. The counters have distinct identity and the original scalar stays 1.

3. The scalar is copied into the clone; incrementing it does not update the first counter.

4. Distinct outer identity, independent scalar, and shared nested object produce this result.

**Objective:** Distinguish a shallow clone’s identity and scalar state from a shared nested object.

**Difficulty:** Applied. Tracks scalar copying and nested-object aliasing in the same operation.

**Validation:** Observed stdout "[false,1,\"new\"]" on both PHP runtimes.

**References:** [Primary reference](https://www.php.net/manual/en/)


## PQ-281


**Issue:** The example blurred immutable message updates and a mutable body stream, with unspecified collaborators and a generic protocol explanation.


### Before


PSR-7 methods return a changed copy: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
<?php
use Psr\Http\Message\ResponseInterface;

function asJson(ResponseInterface $response, array $data): ResponseInterface {
    $response->getBody()->write(json_encode($data, JSON_THROW_ON_ERROR));
    return $response
        ->withHeader("Content-Type", "application/json")
        ->withStatus(200);
}
```

1. HTTP clients must check transport and protocol failures and PSR interfaces let middleware and messages cooperate through stable contracts. Reasoning check: compare this claim with control flow. **[key]**
2. a successful network connection guarantees a successful HTTP response and PSR-7 response objects are mutated in place. Evidence to inspect: the exact input types, state changes, the API contract, and side effects.
3. The snippet changes editor hints but cannot affect the executed program. Reasoning check: compare this claim with configuration, the observable output, and runtime behavior.
4. The runtime skips the shown branch and supplies a safe default automatically. Evidence to inspect: the displayed values, state changes, the API contract, the exact input types, and operator semantics.

**Original explanation:** The displayed PHP code demonstrates that HTTP clients must check transport and protocol failures and PSR interfaces let middleware and messages cooperate through stable contracts. The tempting mistake is to assume that a successful network connection guarantees a successful HTTP response and PSR-7 response objects are mutated in place. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


This minimal model illustrates immutable header updates with a shared mutable body. It is not a complete PSR-7 implementation. What text is printed?

**Version / premises:** PHP 8.4–8.5 CLI; E_ALL; no custom error handler. Execute the complete program once in a fresh process with only the definitions and input shown.

**main.php** (php-file)

```php
<?php
final class Message {
    public function __construct(public array $headers, public object $body) {}
    public function withHeader(string $name, string $value): self {
        $copy = clone $this;
        $copy->headers[$name] = $value;
        return $copy;
    }
}
$original = new Message([], (object) ['text' => 'old']);
$changed = $original->withHeader('X-Trace', 'b');
$changed->body->text .= '!';
echo $original->headers['X-Trace'] ?? 'none';
echo '|', $original->body->text, '|', $changed->headers['X-Trace'];
```

1. none|old!|b **[key]**
2. none|old|b
3. b|old!|b
4. none|old!|none

**Explanation:** The cloned message receives its own changed headers array, so the original has no X-Trace header. Both messages reference the same body object, which now contains old!. Real PSR-7 streams may similarly be mutable; message immutability is not a deep-copy guarantee.

**Option-by-option reasoning:**


1. The headers differ while the aliased body reflects the mutation.

2. This assumes the mutable body was deep-cloned.

3. Changing the clone’s headers does not change the original headers array.

4. The returned message is stored in changed and contains the new header.

**Objective:** Explain why cloning a message to change headers need not isolate its mutable body object.

**Difficulty:** Applied. Combines cloning, copied array state, and a shared object reference.

**Validation:** Observed stdout "none|old!|b" on both PHP runtimes.

**References:** [Primary reference](https://www.php-fig.org/psr/psr-7/#13-streams)


## LQ-046


**Issue:** The stem paraphrased the keyed answer, alternatives were unrelated lifecycle stages, and Advanced difficulty was unjustified.


### Before


A form request normalizes a phone number before rules run. Where does that transformation belong if downstream validation must see the normalized value?

_No code was supplied._

1. Input preparation before validation. Reasoning check: compare this claim with the guarantee actually provided, ownership of the decision, and configuration. **[key]**
2. A response middleware after the controller. Reasoning check: compare this claim with the stated constraints.
3. The migration down method. Evidence to inspect: the stated constraints, configuration, and the scenario’s stated boundary.
4. A queued notification after commit. Reasoning check: compare this claim with the trade-off, the failure mode, and a counterexample.

**Original explanation:** Preparation changes the candidate input before validators inspect it. Response or post-commit work happens far too late.


### After — revision 2


Both the email rule and the controller’s validated() payload must see the trimmed, lowercase address. Which hook should replace NORMALIZE_HERE?

**Version / premises:** Laravel 13.0.0 reference · PHP 8.4–8.5. Authorization succeeds. The email input is the string " ADA@example.test ". No middleware or other hook transforms it. NORMALIZE_HERE is a method-name placeholder.

**StoreUserRequest.php** (laravel-fragment)

```php
final class StoreUserRequest extends FormRequest
{
    public function rules(): array { return ['email' => ['required', 'email']]; }
    protected function NORMALIZE_HERE(): void {
        $this->merge(['email' => strtolower(trim($this->input('email')))]);
    }
}
// Controller: $email = $request->validated('email');
```

1. prepareForValidation **[key]**
2. passedValidation
3. failedValidation
4. An Eloquent saving observer

**Explanation:** prepareForValidation runs before the validator captures the request data. The normalized address therefore participates in validation and is returned by validated(). passedValidation runs after that data has already been validated.

**Option-by-option reasoning:**


1. This hook changes the input before validator construction.

2. A later request merge does not replace the validator’s stored data.

3. This hook handles a failed validation, not preparation for successful validation.

4. An observer runs at persistence time and does not alter the validator’s input.

**Objective:** Choose a normalization hook that changes both validated input and the returned validated payload.

**Difficulty:** Applied. Connects request mutation timing with the validator’s separate data snapshot.

**Validation:** Pinned Laravel contract: prepareForValidation, passing on both PHP runtimes.

**References:** [Primary reference](https://laravel.com/docs/13.x)


## LQ-314


**Issue:** Post-validation merge changed the request but did not change the validator snapshot returned by validated(). The original text implied a normalization guarantee for controller persistence.


### Before


When does passedValidation execute in relation to the rules method?

**Original displayed snippet**

```php
final class StoreProjectRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'budget' => ['required', 'decimal:0,2', 'min:0'],
        ];
    }

    protected function passedValidation(): void
    {
        $this->merge(['name' => $this->string('name')->trim()->toString()]);
    }
}
```

1. After validation succeeds, allowing normalization before controller use. Reasoning check: compare this claim with operator semantics, the exact input types, the observable output, side effects, and runtime behavior. **[key]**
2. Before rules are evaluated, so it decides whether rules exist. Evidence to inspect: the exact input types, operator semantics, and the API contract.
3. Only after the model has been saved. Reasoning check: compare this claim with the API contract and the failure path.
4. Only when validation fails. Reasoning check: compare this claim with operator semantics, control flow, lifecycle timing, the API contract, configuration, side effects, and the data boundary.

**Original explanation:** passedValidation is a post-validation hook. It is suitable for normalizing already accepted values before the request reaches the controller.


### After — revision 2


The request contains name="  Ada  ". After successful resolution, what do input("name") and validated("name") return, in that order?

**Version / premises:** Laravel 13.0.0 reference · PHP 8.4–8.5. Authorization succeeds. TrimStrings is disabled for this request, no earlier normalization occurs, and the ordinary FormRequest validator is used.

**StoreProjectRequest.php** (laravel-fragment)

```php
final class StoreProjectRequest extends FormRequest
{
    public function rules(): array { return ['name' => ['required', 'string', 'max:120']]; }
    protected function passedValidation(): void {
        $this->merge(['name' => trim($this->input('name'))]);
    }
}
```

1. "Ada", "Ada"
2. "  Ada  ", "  Ada  "
3. "  Ada  ", "Ada"
4. "Ada", "  Ada  " **[key]**

**Explanation:** The validator receives the original spaced string. passedValidation subsequently merges a trimmed string into the request, but validated() reads the existing validator data, not the changed request bag.

**Option-by-option reasoning:**


1. This would fit normalization before validation, not the shown post-validation merge.

2. The request bag is changed by merge, so input() is trimmed.

3. This reverses which store is changed by merge.

4. The request is trimmed while the validator retains the originally accepted value.

**Objective:** Distinguish request input after passedValidation from the validator’s accepted snapshot.

**Difficulty:** Applied. Traces two data stores through validation and a later merge.

**Validation:** Pinned Laravel contract: passedValidation, passing on both PHP runtimes.

**References:** [Primary reference](https://laravel.com/docs/13.x)


## LQ-413


**Issue:** route() defaults to an absolute URL; the original answer supplied only a path and no origin premise.


### Before


Named route generation inside a prefixed group: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/reports', ReportController::class)
        ->middleware('throttle:reports')
        ->name('reports');
});

$url = route('admin.reports');
```

1. the generated URL is /admin/reports and the route also carries the reports rate limiter. Evidence to inspect: the displayed values and configuration. **[key]**
2. the name prefix changes the URL path twice or the middleware runs while generating the URL. Evidence to inspect: state changes, the API contract, and lifecycle timing.
3. The snippet changes editor hints but cannot affect the executed program. Reasoning check: compare this claim with operator semantics, configuration, the displayed values, the failure path, and side effects.
4. The runtime skips the shown branch and supplies a safe default automatically. Evidence to inspect: control flow, the API contract, state changes, the stated constraints, and side effects.

**Original explanation:** The displayed Laravel code demonstrates that the generated URL is /admin/reports and the route also carries the reports rate limiter. The tempting mistake is to assume that the name prefix changes the URL path twice or the middleware runs while generating the URL. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


What is assigned to url? The current request origin is https://quiz.example.test and the application has no base-path prefix or forced URL overrides.

**Version / premises:** Laravel 13.0.0 reference · PHP 8.4–8.5. The route is registered as shown and ReportController exists. No URL defaults or missing-route resolver intervene.

**routes/web.php** (laravel-fragment)

```php
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/reports', ReportController::class)->name('reports');
});
$url = route('admin.reports');
```

1. /admin/reports
2. https://quiz.example.test/admin/admin/reports
3. https://quiz.example.test/admin/reports **[key]**
4. https://quiz.example.test/reports

**Explanation:** prefix contributes admin to the path; name contributes admin. only to the route name. route() generates an absolute URL by default using the supplied origin.

**Option-by-option reasoning:**


1. That would be the relative result requested with absolute: false.

2. The name prefix does not add another path segment.

3. The origin and single path prefix are combined.

4. The group’s path prefix must be included.

**Objective:** Distinguish route name prefixes, URL path prefixes and absolute URL generation.

**Difficulty:** Applied. Combines named-route resolution with URL origin behavior.

**Validation:** Pinned Laravel contract: routeAbsolute, passing on both PHP runtimes.

**References:** [Primary reference](https://laravel.com/docs/13.x)


## LQ-453


**Issue:** The dirty-state answer assumed an initial name different from Grace without saying so.


### Before


Dirty-state inspection before and after persistence: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
$user->name = 'Grace';

$before = $user->isDirty('name');
$user->save();
$after = $user->wasChanged('name');
$stillDirty = $user->isDirty('name');

```

1. isDirty is true before save, wasChanged records the persisted change after save, and the saved attribute is no longer dirty. Evidence to inspect: control flow and the observable output. **[key]**
2. wasChanged predicts unsaved changes before persistence and remains identical to isDirty at every point. Evidence to inspect: configuration, lifecycle timing, the API contract, the observable output, and the data boundary.
3. The snippet changes editor hints but cannot affect the executed program. Reasoning check: compare this claim with the failure path, the displayed values, control flow, configuration, runtime behavior, the data boundary, and lifecycle timing.
4. The runtime skips the shown branch and supplies a safe default automatically. Evidence to inspect: the displayed values, configuration, the exact input types, and the API contract.

**Original explanation:** The displayed Laravel code demonstrates that isDirty is true before save, wasChanged records the persisted change after save, and the saved attribute is no longer dirty. The tempting mistake is to assume that wasChanged predicts unsaved changes before persistence and remains identical to isDirty at every point. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


The user was freshly retrieved with name="Grace". What are before, after and stillDirty after this code runs?

**Version / premises:** Laravel 13.0.0 reference · PHP 8.4–8.5. The model has no previous changes, custom name casts/mutators, or observers that change name. The existing row is saved successfully. Timestamp changes do not change name.

**controller.php** (laravel-fragment)

```php
$user->name = 'Grace';
$before = $user->isDirty('name');
$user->save();
$after = $user->wasChanged('name');
$stillDirty = $user->isDirty('name');
```

1. false, false, false **[key]**
2. true, true, false
3. false, true, false
4. true, false, true

**Explanation:** The current name equals the retrieved original name. No name change is dirty or recorded by the save, and it remains clean afterward; timestamps are a different attribute.

**Option-by-option reasoning:**


1. All three name-specific checks are false for this unchanged value.

2. Assignment alone does not make an equal value dirty.

3. A successful save does not imply that this particular attribute changed.

4. There is no unsaved name difference before or after the save.

**Objective:** Determine attribute dirty and saved-change flags when assigning an unchanged value.

**Difficulty:** Applied. Distinguishes current attributes, original values and the most recent save.

**Validation:** Pinned Laravel contract: unchangedAttribute, passing on both PHP runtimes.

**References:** [Primary reference](https://laravel.com/docs/13.x)


## LQ-142


**Issue:** The general lock recommendation lacked the class-scoped key and lease-expiry details needed to assess an actual WithoutOverlapping configuration.


### Before


Two different job types must never update the same project concurrently. Unique-job constraints apply only to one class. What mechanism is more direct?

_No code was supplied._

1. A shared runtime lock/without-overlapping key based on project ID. Reasoning check: compare this claim with the trade-off. **[key]**
2. Give both jobs random IDs. Reasoning check: compare this claim with the failure mode, the data flow, timing, a counterexample, and the scenario’s stated boundary.
3. Put the project name into APP_KEY. Reasoning check: compare this claim with the trade-off, the guarantee actually provided, and the data flow.
4. Disable queue retries globally. Evidence to inspect: a counterexample, the missing guarantee, and the failure mode.

**Original explanation:** A shared lock key can coordinate heterogeneous jobs around the same resource, not just deduplicate one job class.


### After — revision 2


Two different job classes use this middleware to update the same project. Both critical sections finish within 90 seconds. Which replacement coordinates the classes and keeps the lease alive for the full section?

**Version / premises:** Laravel 13.0.0 reference · PHP 8.4–8.5. The jobs use the same project ID and a shared lock-capable cache. No clock jump, cache outage, process pause beyond the stated 90-second bound, or other lock holder is involved.

**Job.php (method fragment)** (laravel-fragment)

```php
public function middleware(): array
{
    return [(new WithoutOverlapping('project:' . $this->projectId))
        ->releaseAfter(5)
        ->expireAfter(30)];
}
```

1. Use shared() and expireAfter(120) in both classes. **[key]**
2. Use shared() and keep expireAfter(30) in both classes.
3. Give both classes the same uniqueId() and use expireAfter(120).
4. Use releaseAfter(120) and keep expireAfter(30) in both classes.

**Explanation:** WithoutOverlapping normally namespaces lock identity by job class. shared() coordinates the two classes, and a 120-second lease covers the bounded 90-second critical section. releaseAfter controls contention delay, not lock ownership duration.

**Option-by-option reasoning:**


1. Both the cross-class lock scope and the too-short lease are corrected.

2. The shared lock can still expire while a 90-second section is running.

3. uniqueId is not the shared-key switch used by WithoutOverlapping.

4. Changing the contention delay fixes neither the class-scoped key nor the short lease.

**Objective:** Coordinate different job classes with a shared overlap key and a lease that covers the critical section.

**Difficulty:** Advanced. Requires resolving both class-scoped lock identity and expiry during a bounded critical section.

**Validation:** Pinned Laravel contract: sharedOverlapLock, passing on both PHP runtimes.

**References:** [Primary reference](https://laravel.com/docs/13.x)


## LQ-489


**Issue:** The key incorrectly combined tries and retryUntil as simultaneous limits; customerId was undeclared in the displayed job.


### Before


Retry policy with backoff and an absolute deadline: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
final class SyncCustomer implements ShouldQueue
{
    public int $tries = 5;
    public function backoff(): array { return [10, 60, 300]; }
    public function retryUntil(): DateTime { return now()->addHour(); }

    public function handle(CrmClient $crm): void {
        $crm->sync($this->customerId);
    }
}
```

1. failed attempts use increasing delays but retries stop when the attempt limit or absolute retry deadline is reached. Evidence to inspect: the exact input types, side effects, and runtime behavior. **[key]**
2. backoff makes the external CRM operation idempotent and guarantees it cannot run twice. Reasoning check: compare this claim with the API contract, the exact input types, side effects, and lifecycle timing.
3. The snippet changes editor hints but cannot affect the executed program. Evidence to inspect: control flow, runtime behavior, side effects, the data boundary, and the failure path.
4. The runtime skips the shown branch and supplies a safe default automatically. Reasoning check: compare this claim with the API contract, configuration, the exact input types, the failure path, and operator semantics.

**Original explanation:** The displayed Laravel code demonstrates that failed attempts use increasing delays but retries stop when the attempt limit or absolute retry deadline is reached. The tempting mistake is to assume that backoff makes the external CRM operation idempotent and guarantees it cannot run twice. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


Five attempts of this job have thrown ordinary exceptions, but its queued retry deadline is still in the future. Which rule governs retry eligibility?

**Version / premises:** Laravel 13.0.0 reference · PHP 8.4–8.5. Laravel aliases and the CRM client are supplied by the application. The job payload contains a future retryUntil timestamp. Only ordinary handler exceptions occur; no maxExceptions, timeout-failure, cancellation or custom middleware limit applies.

**SyncCustomer.php** (laravel-fragment)

```php
final class SyncCustomer implements ShouldQueue
{
    public int $tries = 5;
    public function __construct(public int $customerId) {}
    public function backoff(): array { return [10, 60, 300]; }
    public function retryUntil(): DateTime { return now()->addHour(); }
    public function handle(CrmClient $crm): void {
        $crm->sync($this->customerId);
    }
}
```

1. The tries property stops the job after attempt five.
2. The backoff array stops the job after attempt three.
3. The retryUntil deadline takes precedence over tries. **[key]**
4. The earlier of the tries limit and deadline stops retries.

**Explanation:** When retryUntil is supplied, Laravel uses its deadline instead of the numeric tries limit for these ordinary retries.

**Option-by-option reasoning:**


1. The numeric tries limit does not take precedence when retryUntil is present.

2. The array supplies delays; its length is not an attempt cap.

3. The future retry deadline allows further ordinary attempts under the stated exclusions.

4. This incorrectly treats tries and retryUntil as simultaneous limits.

**Objective:** Resolve the precedence of time-based and count-based queue retry policies.

**Difficulty:** Applied. Distinguishes related APIs whose superficially similar controls have different effects.

**Validation:** Pinned Laravel contract: retryUntilPrecedence, passing on both PHP runtimes.

**References:** [Primary reference](https://laravel.com/docs/13.x/queues#time-based-attempts)


## LQ-545


**Issue:** The key reversed registered reporting callback semantics: false stops default reporting.


### Before


Attaching context while preserving normal exception reporting: after tracing the displayed code, which description of its behavior is accurate?

**Original displayed snippet**

```php
$exceptions->report(function (PaymentFailed $exception) {
    Log::withContext([
        'payment_id' => $exception->paymentId,
        'request_id' => request()->header('X-Request-ID'),
    ]);

    return false;
});
```

1. returning false allows Laravel default reporting to continue while the added context enriches the log record. Reasoning check: compare this claim with operator semantics and the exact input types. **[key]**
2. returning false marks the exception as handled and guarantees it will never reach configured log channels. Reasoning check: compare this claim with control flow, runtime behavior, and the failure path.
3. The snippet changes editor hints but cannot affect the executed program. Evidence to inspect: the exact input types, runtime behavior, side effects, and the failure path.
4. The runtime skips the shown branch and supplies a safe default automatically. Reasoning check: compare this claim with control flow and the data boundary.

**Original explanation:** The displayed Laravel code demonstrates that returning false allows Laravel default reporting to continue while the added context enriches the log record. The tempting mistake is to assume that returning false marks the exception as handled and guarantees it will never reach configured log channels. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


When PaymentFailed is reported through this callback, what happens to Laravel’s default exception logging for this reporting pass?

**Version / premises:** Laravel 13.0.0 reference · PHP 8.4–8.5. This callback is registered through withExceptions. It is the only reporting callback. PaymentFailed has a paymentId and no custom report method. Log::withContext succeeds and does not itself emit a log record. Default exception logging is enabled.

**bootstrap/app.php (withExceptions callback)** (laravel-fragment)

```php
$exceptions->report(function (PaymentFailed $exception) {
    Log::withContext(['payment_id' => $exception->paymentId]);
    return false;
});
```

1. It logs once with payment_id context.
2. It skips default logging after the callback returns. **[key]**
3. It logs once without payment_id because callback context is discarded.
4. It logs twice: once for withContext and once for the exception.

**Explanation:** Returning false from a registered reporting callback stops propagation to the default logging stack. Adding context alone emits no record and does not change response rendering.

**Option-by-option reasoning:**


1. That would occur if propagation were allowed; the explicit false stops it.

2. The registered callback’s false return stops default reporting.

3. withContext is not discarded on callback return; the false result stops the record from being emitted.

4. withContext does not emit a record, and returning false also prevents the normal exception record.

**Objective:** Determine default logging behavior after a registered reporting callback returns false.

**Difficulty:** Foundation. Applies one registered callback contract to an explicit reporting context.

**Validation:** Pinned Laravel contract: reportCallbackFalse, passing on both PHP runtimes.

**References:** [Primary reference](https://laravel.com/docs/13.x/errors#reporting-exceptions)


## LQ-546


**Issue:** The review recommendation preserved the same inverted false-return rule and used generic comment/suppression distractors.


### Before


Attaching context while preserving normal exception reporting: which review comment best preserves the guarantee demonstrated by this implementation?

**Original displayed snippet**

```php
$exceptions->report(function (PaymentFailed $exception) {
    Log::withContext([
        'payment_id' => $exception->paymentId,
        'request_id' => request()->header('X-Request-ID'),
    ]);

    return false;
});
```

1. Keep the relevant mechanism because returning false allows Laravel default reporting to continue while the added context enriches the log record. Reasoning check: compare this claim with operator semantics and the exact input types. **[key]**
2. Remove the relevant mechanism because returning false marks the exception as handled and guarantees it will never reach configured log channels. Evidence to inspect: control flow, runtime behavior, and the failure path.
3. Replace the implementation with a comment describing the intended result. Reasoning check: compare this claim with the exact input types, runtime behavior, side effects, the failure path, and operator semantics.
4. Suppress every failure so callers always receive a successful-looking value. Evidence to inspect: control flow, the data boundary, the exact input types, state changes, and the failure path.

**Original explanation:** The displayed Laravel code demonstrates that returning false allows Laravel default reporting to continue while the added context enriches the log record. The tempting mistake is to assume that returning false marks the exception as handled and guarantees it will never reach configured log channels. The values, control flow, and API contract visible in the snippet are the deciding evidence.


### After — revision 2


The payment ID must enrich the normal exception log. Which smallest edit lets default reporting continue after this callback?

**Version / premises:** Laravel 13.0.0 reference · PHP 8.4–8.5. This callback is registered through withExceptions. It is the only reporting callback. PaymentFailed has a paymentId and no custom report method. Log::withContext succeeds and does not itself emit a log record. Default exception logging is enabled.

**bootstrap/app.php (withExceptions callback)** (laravel-fragment)

```php
$exceptions->report(function (PaymentFailed $exception) {
    Log::withContext(['payment_id' => $exception->paymentId]);
    return false;
});
```

1. Change Log::withContext to Log::info and retain return false.
2. Call report($exception) inside this callback and retain return false.
3. Replace return false with throw $exception.
4. Remove return false so the callback returns null. **[key]**

**Explanation:** A registered callback returning null allows default reporting to continue. Log::withContext adds context for the normal record; there is no need to report the same exception recursively.

**Option-by-option reasoning:**


1. This emits a separate message while still stopping the normal exception log.

2. Reporting the same exception from its reporting callback risks recursion.

3. Throwing disrupts reporting instead of allowing the normal logging path to continue.

4. Without a false result or stop flag, the registered callback permits propagation.

**Objective:** Repair context enrichment without suppressing or recursively invoking default reporting.

**Difficulty:** Applied. Distinguishes related APIs whose superficially similar controls have different effects.

**Validation:** Pinned Laravel contract: reportCallbackNull, passing on both PHP runtimes.

**References:** [Primary reference](https://laravel.com/docs/13.x/errors#reporting-exceptions)
