# Review drafts for existing questions

These proposals illustrate corrections; they have not been installed in the question bank and do not create new question IDs. The complete original records for the examples below are preserved in [original-examples.json](original-examples.json), including all four core and displayed options, code, keys, and explanations. Excerpts below omit the mechanically appended “Reasoning check / Evidence to inspect” padding. Draft Laravel replacements still require the version-locked execution fixtures proposed in the implementation plan.

**1. LQ-545: the answer reverses exception reporting.** The original stem is “Attaching context while preserving normal exception reporting: after tracing the displayed code, which description of its behavior is accurate?” The shared code for LQ-545–548 is:

```php
$exceptions->report(function (PaymentFailed $exception) {
    Log::withContext([
        'payment_id' => $exception->paymentId,
        'request_id' => request()->header('X-Request-ID'),
    ]);

    return false;
});
```

The keyed answer says “returning false allows Laravel default reporting to continue while the added context enriches the log record.” This is incorrect: returning false from this registered reporting callback stops propagation to the default logging stack. It must not be confused with returning false from an exception class's own `report()` method. The alternative claiming it can *never* reach configured channels is also too absolute, since separate explicit logging remains possible. [Laravel error-handling documentation](https://laravel.com/docs/13.x/errors#reporting-exceptions).

**Proposed revision, same ID:** “In Laravel 13, assume this is the only registered reporting callback, `PaymentFailed` has no custom reporting method, and the callback itself does not write a log entry. What happens to default reporting for this exception?” Retain the code above with a neutral title, “Registered exception reporting callback.”

| Option | Text |
|---|---|
| A | The callback adds context, then default exception logging continues. |
| B — correct | The callback adds context, then stops default exception logging for this reporting pass. |
| C | The callback clears the context, then default exception logging continues. |
| D | The callback adds context and changes the exception's HTTP response to status 200. |

The explanation should distinguish reporting from rendering, and callback return semantics from the exception object's reporting method. The callback's return handling is visible in Laravel's [ReportableHandler source](https://raw.githubusercontent.com/laravel/framework/13.x/src/Illuminate/Foundation/Exceptions/ReportableHandler.php). Review all four siblings; changing only LQ-545 would leave contradictory teaching elsewhere.

**2. LQ-489: retry limits are not combined as claimed.** Original stem: “Retry policy with backoff and an absolute deadline: after tracing the displayed code, which description of its behavior is accurate?”

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

The keyed answer says retries stop “when the attempt limit or absolute retry deadline is reached.” Laravel instead gives `retryUntil` precedence when both are present. The snippet also omits the declaration/initialization of `customerId`. [Laravel time-based attempts](https://laravel.com/docs/13.x/queues#time-based-attempts).

**Proposed revision, same ID:** Provide a complete job with `customerId` initialized through its constructor. Ask: “This Laravel 13 job has a future retry deadline in its queued payload. Five ordinary attempts have failed. No max-exception, timeout-failure, cancellation, or custom middleware limit applies. Which rule governs whether another retry is permitted?”

| Option | Text |
|---|---|
| A | `$tries = 5` stops retries even while the deadline remains in the future. |
| B | Both rules apply, and whichever is reached first stops retries. |
| C — correct | The retry deadline takes precedence over the numeric tries limit. |
| D | The three backoff entries cap the job at three total attempts. |

Explain the distinction between retry timing, retry eligibility, and idempotency. LQ-490–492 require corresponding review. Keep the explanation specific; it should not promise that a future deadline overrides every other reason a job can fail.

**3. PQ-014: an answer can be selected without tracing PHP.** The original stem asks which review comment preserves the guarantee. Its code is:

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

Original options:

1. **Keyed:** “Keep the relevant mechanism because closures capture variables explicitly and a static local retains its value between calls in the same request.”
2. “Remove the relevant mechanism because ordinary local variables are shared globally and closures automatically see every outer variable by reference.”
3. “Replace the implementation with a comment describing the intended result.”
4. “Suppress every failure so callers always receive a successful-looking value.”

There is no static local in this snippet. Arrow functions capture used outer variables implicitly by value, making the broad “explicitly” wording unhelpful as well. The actual observable behavior is much more precise than the generic answer.

**Proposed revision, same ID:** Retain the code and ask: “On PHP 8.4 or 8.5, what does this program print?” Use four plausible outcomes: A `8 8`, B `12 12`, **C `8 12`**, D `12 8`. The explanation should trace the arrow function's captured value of 2, the closure's reference to the variable later set to 3, and multiplication by 4. A assumes both capture by value; B assumes both use the changed value; D reverses the capture rules. This is Foundation or low Applied, subject to calibration. The unchanged snippet printed `8 12` in the audit probe.

**4. PQ-021: combined code is syntactically invalid.** The original stem is “Variables, scope & constants: integration review across two cooperating code paths: after tracing the displayed code, which description of its behavior is accurate?” It displays the preceding closure example followed by:

```php
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

The first PHP block was never closed. Lint reports `unexpected token "<"`. The key nonetheless says the combined example preserves the closure and static-local guarantees. All 25 integration lessons have this construction error, each affecting four questions. Some combinations also need more than removal of the extra tag: later strict declarations, namespaces, missing files, and disconnected control flows require individual review.

**Proposed revision, same ID:** Keep both computations in one valid file with only one opening tag. Add `echo "|";` between the closure output and the three sequence calls to make the boundary explicit. Ask for the exact output, with A `8 8|123`, **B `8 12|123`**, C `8 12|111`, D `12 12|123`. Explain the separate capture rules and the static local's increment across three calls. Classify as Applied because it combines two concrete mechanisms. Do not include both this item and PQ-014 in a short exam that would allow one to reveal the other.

**5. PQ-005: a required file and function contract are missing.** Original stem: “Included files keep their own call-site rules: after tracing the displayed code, which description of its behavior is accurate?”

```php
<?php
declare(strict_types=1);

require __DIR__ . '/legacy.php';

echo formatTotal('12');
// The coercion decision belongs to the file that calls formatTotal().
```

The key gives a general rule about scalar call-site strictness. The item does not specify whether the file exists, what `formatTotal` accepts, or whether it performs additional calls. It cannot support a concrete execution answer, and the comment gives away the intended rule.

**Proposed revision, same ID:** Show two complete files, state that they are the only relevant files, and remove the answer-revealing comment. Preserve the caller above; define `legacy.php` as:

```php
<?php
function formatTotal(int $amount): string {
    return number_format($amount, 2, '.', '');
}
```

Ask: “Run the caller on PHP 8.4 or 8.5. Which result occurs?” A `12.00`, B `12`, **C a `TypeError` before the function body executes**, D an argument warning followed by `12.00`. The caller enables strict scalar argument checking; a numeric string is not an integer argument here. The included file's absence of a strict declaration does not change that call. [PHP scalar strict typing](https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict).

**6. LQ-453: the original model value changes the answer.** Original stem: “Dirty-state inspection before and after persistence: after tracing the displayed code, which description of its behavior is accurate?”

```php
$user->name = 'Grace';

$before = $user->isDirty('name');
$user->save();
$after = $user->wasChanged('name');
$stillDirty = $user->isDirty('name');
```

The key says `isDirty` is true before save. It may be false if the original name already equals `Grace`. Prior model changes, custom mutators, and observer behavior are also unstated. [Eloquent attribute-change semantics](https://laravel.com/docs/13.x/eloquent#examining-attribute-changes).

**Proposed revision, same ID:** “In Laravel 13, `$user` was freshly retrieved from an existing row whose name is `Grace`. It has no previous unsaved changes, custom name casts/mutators, or observers changing name; saving succeeds. After the displayed code, what are `$before`, `$after`, and `$stillDirty`?” Options: **A `(false, false, false)`**, B `(true, true, false)`, C `(false, true, false)`, D `(true, false, true)`. Explain that assigning the same name does not change that attribute. Timestamp changes, if any, are irrelevant to the named attribute checks. For a changed-value variant, specify the original name and keep it in the same duplicate family.

**7. PQ-113: irrelevant explanation, missing fixture, and a PHP deprecation.** Original stem: “Reading CSV through a stream handle: after tracing the displayed code, which description of its behavior is accurate?” The snippet opens `users.csv`, calls `fgetcsv($handle)` in a loop, destructures two fields, and closes the handle in `finally`.

The key describes `JSON_THROW_ON_ERROR` despite there being no JSON code. Neither the CSV contents nor successful opening is specified. On PHP 8.4 onward, relying on the default escape argument is deprecated; the audit reproduced that diagnostic on PHP 8.5.2. [PHP fgetcsv reference](https://www.php.net/manual/en/function.fgetcsv.php).

**Proposed revision, same ID:** State PHP 8.4/8.5, `E_ALL`, no custom error handler, and a successfully opened in-memory stream containing exactly `7,ada@example.test\n`, positioned at the start. Show `$row = fgetcsv($handle);`. Ask which result and diagnostic occur: A a two-field array with no diagnostic; **B a two-field array plus `E_DEPRECATED` for the omitted escape argument**; C a two-field array plus `E_WARNING` for the same omission; D a `TypeError` with no row returned. Explain the versioned diagnostic and the repair `fgetcsv($handle, escape: '')` for conventional doubled-quote CSV. In production-style examples also check opening and row shape explicitly. Do not turn the current JSON explanation into a longer generic paragraph.

**8. LQ-046: the stem repeats the answer and inflates difficulty.** Original, classified Advanced:

> A form request normalizes a phone number before rules run. Where does that transformation belong if downstream validation must see the normalized value?

The options are **“Input preparation before validation”**, “A response middleware after the controller,” “The migration down method,” and “A queued notification after commit.” The key is sound but the alternatives do not require Laravel reasoning.

**Proposed revision, same ID:** “A Laravel 13 Form Request receives an email with surrounding spaces and uppercase letters. The email rules and the controller's `validated()` payload must both use the trimmed, lowercase value. Where should the request merge that normalized value?” Options: **A `prepareForValidation()`**, B `passedValidation()`, C the controller immediately after `validated()`, D an Eloquent saving observer. Explain why B updates the request too late to change the validator's input snapshot, C is after validation, and D affects persistence rather than the validator. This is Applied at most, not automatically Advanced. The conclusion follows from the [validation lifecycle](https://raw.githubusercontent.com/laravel/framework/13.x/src/Illuminate/Validation/ValidatesWhenResolvedTrait.php) and [FormRequest's validator construction and validated accessor](https://raw.githubusercontent.com/laravel/framework/13.x/src/Illuminate/Foundation/Http/FormRequest.php).

**9. PQ-004: selecting a false proposition does not make it true.** Original stem: “Expression evaluation with strict scalar calls: which interpretation is the dangerous trap when this code is changed or reused?” The keyed misconception is “strict_types converts PHP into a globally strict language and prevents every implicit conversion in every included file.”

The original main explanation correctly calls it unsafe. Generated notes then say to “apply” that claim and that the displayed code “produces that result.” They also tell the learner that the true call-site rule describes behavior the code does not have. This is an explanation-generation defect, not proof that the selected option is wrong for the negative stem.

**Proposed revision, same ID:** Prefer a positive, concrete stem in a later revision. If this misconception question is retained, write its notes explicitly: “This option is the answer because it is the false assumption the question asks you to identify. Scalar argument strictness depends on the calling file; the declaration does not globally change included files. The ordinary expression evaluation shown still produces 30.” Explain that the true call-site alternative is rejected because it is not a misconception. Review the 125 scoped negative-stem questions, rather than repairing this one paragraph alone.

**Additional targeted corrections.** These examples should enter the review queue without claiming that every omitted framework definition makes every conceptual item invalid.

| Existing item / family | Original issue | Proposed improvement |
|---|---|---|
| LQ-413–416 | Says `$url = route('admin.reports')` is `/admin/reports`. The generator defaults to an absolute URL. | Ask for the path component, supply an origin, or explicitly call `route('admin.reports', [], false)`. [Laravel URL generator](https://raw.githubusercontent.com/laravel/framework/13.x/src/Illuminate/Routing/UrlGenerator.php). |
| LQ-313–316 | Code normalizes via `passedValidation()->merge`, while recommending `validated()` for persistence. A merge there does not update the validator's captured data. The timing answer itself is correct, but the example suggests a guarantee it does not provide. | Normalize in `prepareForValidation` if normalized data must be validated and persisted; test request input and validated output separately. [FormRequest](https://raw.githubusercontent.com/laravel/framework/13.x/src/Illuminate/Foundation/Http/FormRequest.php), [Validator](https://raw.githubusercontent.com/laravel/framework/13.x/src/Illuminate/Validation/Validator.php). |
| PQ-041–044 | Associative destructuring snippet inherits an answer about `array_map`, `array_filter`, and `array_values`, none of which it calls. | Ask for the resulting `id`, `name`, and default `role`, and explain destructuring plus null coalescing. |
| PQ-133–140 | Upload snippets claim error, size, MIME, and destination checks but omit size checks; the second snippet relies on undefined `$mime` and `$file`. | Supply the exact validated upload fixture and constraints, or ask which checks are still missing. Do not describe unshown protection as guaranteed. |
| PQ-281–284 | PSR-7 example writes to the existing response body before returning a response with changed headers/status; title and generic pitfall blur message immutability with mutable streams. | Specify the original body/stream and ask separately which operations return a message and which mutate its body. Use a new stream if the requirement is to preserve the original body. [PSR-7 stream semantics](https://www.php-fig.org/psr/psr-7/#13-streams). |
| LQ-521–524 | `storePublicly` is combined with a temporary URL. A signed URL's expiry is not a guarantee that the publicly accessible object becomes inaccessible. | If time-bounded authorization is the objective, state private disk/object permissions and use private storage. Otherwise explicitly ask what the signed URL does and does not restrict. [Laravel file visibility](https://laravel.com/docs/13.x/filesystem#file-visibility). |
| LQ-537–540 | One displayed snippet returns a configuration array, then shows application code after that top-level `return`. | Show separately labelled `config/services.php` and application files; do not imply sequential execution of both in one file. |
| LQ-541–544 | Artisan shell commands are labelled as PHP code. | Mark as shell, declare deployment assumptions, and validate shell commands separately from PHP parsing. |

All replacements should preserve their existing question identity and record a new revision. The examples demonstrate the editorial standard; they are not an approved replacement batch.
