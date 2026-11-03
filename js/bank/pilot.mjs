import { LARAVEL_CORRECTIONS } from './laravel-corrections.mjs';

const php = (snippet, name = 'main.php') => ({ language: 'php', title: 'Program to inspect', files: [{ name, kind: 'php-file', snippet }] });
const fragment = (snippet, name = 'application.php', context = '') => ({ language: 'php', title: 'Application code to inspect', files: [{ name, kind: 'laravel-fragment', snippet, context }] });
const phpVersions = { php: '8.4–8.5', label: 'PHP 8.4–8.5 CLI; E_ALL; no custom error handler.' };
const laravelVersions = { php: '8.4–8.5', laravel: '13.0.0', label: 'Laravel 13.0.0 reference · PHP 8.4–8.5.' };
const phpReference = 'https://www.php.net/manual/en/';

const drafts = [
  {
    id: 'PQ-002', difficulty: 'Foundation', family: 'php-scalar-strictness',
    objective: 'Determine whether removing strict_types changes a call whose argument already has the required scalar type.',
    difficultyReason: 'One argument-type check after evaluating an integer expression.',
    prompt: 'A reviewer proposes removing declare(strict_types=1) from this file. What changes for the exact invocation shown?',
    code: php(`<?php
declare(strict_types=1);
function twice(int $value): int { return $value * 2; }
$subtotal = 10 + 5;
echo twice($subtotal);`),
    options: ['It prints 30 only after removing the declaration.', 'It prints 15 with the declaration and 30 without it.', 'It prints 30 with or without the declaration.', 'It prints 30 with the declaration and raises TypeError without it.'], answer: 2,
    explanation: '10 + 5 evaluates to integer 15. The int parameter already accepts it, so both modes return integer 30. This call does not demonstrate a coercion difference.',
    rationales: ['The original call already passes an int and does not fail.', 'strict_types does not change multiplication or expression evaluation.', 'Both variants pass the same integer argument and compute 15 * 2.', 'Removing strict scalar checking cannot make this already-valid int argument fail.'],
    validation: { kind: 'php-output', stdout: '30' },
  },
  {
    id: 'PQ-004', difficulty: 'Foundation', family: 'php-scalar-strictness',
    objective: 'Recognize the int-to-float exception to strict scalar argument checking.',
    difficultyReason: 'Applies one scalar typing exception and reads a numeric output.',
    prompt: 'The caller uses strict scalar typing. What happens when the integer literal is passed to this float parameter?',
    code: php(`<?php
declare(strict_types=1);
function half(float $value): float { return $value / 2; }
echo number_format(half(6), 1, '.', '');`),
    options: ['It raises TypeError before half runs.', 'It prints 3.0.', 'It prints 6.0.', 'It emits an argument warning, then prints 3.0.'], answer: 1,
    explanation: 'Strict scalar argument checking permits an int argument for a float parameter. half receives 6.0, divides by two, and number_format prints 3.0 without a diagnostic.',
    rationales: ['An int is accepted for a float parameter even in strict mode.', 'The widening conversion is permitted, and the result is formatted with one decimal place.', 'The function divides its input by two.', 'This permitted conversion produces no argument warning.'],
    validation: { kind: 'php-output', stdout: '3.0' },
  },
  {
    id: 'PQ-005', difficulty: 'Applied', family: 'php-scalar-strictness',
    objective: 'Apply scalar argument strictness at a call site across an included file.',
    difficultyReason: 'Distinguishes the calling file from the file defining the function.',
    prompt: 'Run caller.php. legacy.php has no strict_types declaration. Which text does the caller print?',
    code: { language: 'php', title: 'Two files in the same directory', files: [
      {name:'caller.php',kind:'php-file',snippet:`<?php
declare(strict_types=1);
require __DIR__ . '/legacy.php';
try {
    echo formatTotal('12');
} catch (TypeError $error) {
    echo 'TypeError';
}`},
      {name:'legacy.php',kind:'php-file',snippet:`<?php
function formatTotal(int $amount): string {
    return number_format($amount, 2, '.', '');
}`},
    ]},
    assumptions: 'Both files exist exactly as shown. Execute caller.php only; the required file emits no output when loaded.',
    options: ['12.00', '12', 'An empty string', 'TypeError'], answer: 3,
    explanation: 'The strict caller passes a string to an int parameter. The call raises TypeError before the function body executes; the catch prints TypeError. The included file’s coercive mode does not control this call.',
    rationales: ['This would be the formatted result if a coercive caller accepted the numeric string.', 'The function is not entered, and its normal return would include two decimal places.', 'The catch branch emits text, so execution is not silent.', 'The caller’s strict mode rejects the string argument and the catch handles that error.'],
    validation: { kind: 'php-output', entryFile: 'caller.php', stdout: 'TypeError' },
  },
  {
    id: 'PQ-014', difficulty: 'Applied', family: 'php-capture-and-static',
    objective: 'Distinguish arrow capture by value from closure capture by reference.',
    difficultyReason: 'Tracks two captures across a later mutation.',
    prompt: 'After rate changes, what does the program print when it invokes both callables?',
    code: php(`<?php
$rate = 2;
$byValue = fn (int $n) => $n * $rate;
$byReference = function (int $n) use (&$rate): int { return $n * $rate; };
$rate = 3;
echo $byValue(4), ' ', $byReference(4);`),
    options: ['8 8', '12 12', '8 12', '12 8'], answer: 2,
    explanation: 'The arrow captures the value 2 when created. The explicit reference points to rate, which later becomes 3. Their results are 4 * 2 and 4 * 3.',
    rationales: ['This assumes the explicit reference captured a value instead.', 'This assumes the arrow also observes the later variable assignment.', 'The first retains 2 and the second reads 3.', 'This reverses the capture mechanisms.'],
    validation: { kind: 'php-output', stdout: '8 12' },
  },
  {
    id: 'PQ-021', difficulty: 'Applied', family: 'php-capture-and-static',
    objective: 'Trace closure captures and a static local across repeated calls in one valid PHP file.',
    difficultyReason: 'Combines capture timing with persistent function-local state.',
    prompt: 'This is one complete PHP file. What exact output is produced by the two callables and the three sequence calls?',
    code: php(`<?php
$rate = 2;
$byValue = fn (int $n) => $n * $rate;
$byReference = function (int $n) use (&$rate): int { return $n * $rate; };
$rate = 3;
echo $byValue(4), ' ', $byReference(4), '|';
function nextSequence(): int {
    static $value = 0;
    return ++$value;
}
echo nextSequence(), nextSequence(), nextSequence();`),
    options: ['8 8|123', '8 12|123', '8 12|111', '12 12|123'], answer: 1,
    explanation: 'The two captures produce 8 and 12. The static local initializes once to 0 and retains each increment, so successive calls return 1, 2 and 3.',
    rationales: ['The reference capture reads the changed rate, producing 12 rather than 8.', 'Both capture semantics and the retained static local are reflected in this output.', 'A static local is not reinitialized on every call.', 'The arrow keeps its captured value 2 rather than observing the later 3.'],
    validation: { kind: 'php-output', stdout: '8 12|123' },
  },
  {
    id: 'PQ-041', difficulty: 'Foundation', family: 'php-destructuring',
    objective: 'Read associative destructuring and a default supplied by null coalescing.',
    difficultyReason: 'Directly traces known keys and one missing key.',
    prompt: 'Which values are passed to printf after the row is destructured and role is assigned?',
    code: php(`<?php
$row = ['id' => 7, 'name' => 'Ada'];
['id' => $id, 'name' => $name] = $row;
$role = $row['role'] ?? 'viewer';
printf('%d|%s|%s', $id, $name, $role);`),
    options: ['7|Ada|viewer', '0|Ada|viewer', '7|Ada|', '7|viewer|Ada'], answer: 0,
    explanation: 'Associative destructuring reads the named id and name keys. The absent role triggers the right operand of ??, yielding viewer.',
    rationales: ['The named keys produce 7 and Ada; the missing key uses viewer.', 'Destructuring does not replace the supplied id with an array position.', 'Null coalescing supplies viewer rather than an empty value.', 'Destructuring follows explicit key names, not the order of later variable assignments.'],
    validation: { kind: 'php-output', stdout: '7|Ada|viewer' },
  },
  {
    id: 'PQ-053', difficulty: 'Applied', family: 'php-short-circuit',
    objective: 'Account for skipped side effects and boolean results under short-circuit evaluation.',
    difficultyReason: 'Tracks two branches and a captured mutable counter.',
    prompt: 'Which JSON array is emitted? Its elements are the first boolean result, the second result, and the number of calls to check.',
    code: php(`<?php
$calls = 0;
$check = function () use (&$calls): bool { $calls++; return true; };
$first = false && $check();
$second = true || $check();
echo json_encode([$first, $second, $calls]);`),
    options: ['[false,true,2]', '[false,true,1]', '[true,true,0]', '[false,true,0]'], answer: 3,
    explanation: 'false determines && without its right operand; true determines || without its right operand. Neither call occurs, so calls remains 0 and the results are false and true.',
    rationales: ['This evaluates both right operands despite short-circuiting.', 'Both right operands are skipped, not only one.', 'The first expression remains false; skipping its right operand does not change that result.', 'The boolean values and unchanged counter all follow from short-circuiting.'],
    validation: { kind: 'php-output', stdout: '[false,true,0]' },
  },
  {
    id: 'PQ-061', difficulty: 'Foundation', family: 'php-match',
    objective: 'Use match’s strict comparison to distinguish numeric strings from integers.',
    difficultyReason: 'Applies one comparison rule to explicit match arms.',
    prompt: 'Which label is selected by this match expression for the given status value?',
    code: php(`<?php
$status = '1';
echo match ($status) {
    1 => 'integer one',
    '1' => 'string one',
    default => 'other',
};`),
    options: ['integer one', 'string one', 'other', 'integer onestring one'], answer: 1,
    explanation: 'match uses strict identity. The string value does not match integer 1, matches string 1, and returns that arm without fallthrough.',
    rationales: ['That arm would match integer 1, not the provided string.', 'Both type and value match the second arm.', 'A matching string arm exists, so the default is not selected.', 'match returns a single matching arm and does not fall through.'],
    validation: { kind: 'php-output', stdout: 'string one' },
  },
  {
    id: 'PQ-113', difficulty: 'Applied', family: 'php-csv',
    objective: 'Distinguish successful CSV parsing from version-specific deprecation diagnostics.',
    difficultyReason: 'Combines stream state, parsed fields and the PHP 8.4+ escape-argument change.',
    prompt: 'The stream opens successfully. Which row and diagnostic does the fgetcsv call produce on PHP 8.4 or 8.5 with E_ALL?',
    code: php(`<?php
$handle = fopen('php://memory', 'r+');
fwrite($handle, "7,ada@example.test\n");
rewind($handle);
$row = fgetcsv($handle);
fclose($handle);
echo json_encode($row);`),
    options: ['["7","ada@example.test"] with no diagnostic', '["7","ada@example.test"] and E_WARNING about the omitted escape argument', '["7","ada@example.test"] and E_DEPRECATED about the omitted escape argument', 'No row; a TypeError is thrown for the omitted escape argument'], answer: 2,
    explanation: 'The row parses into two strings. PHP 8.4+ also emits E_DEPRECATED when fgetcsv relies on the default escape argument. Supplying escape: "" explicitly avoids this deprecation for conventional doubled-quote CSV.',
    rationales: ['The data result is right, but PHP 8.4+ emits the deprecation under E_ALL.', 'The diagnostic level is E_DEPRECATED, not E_WARNING.', 'The successful row and nonfatal deprecation occur together.', 'The omitted optional argument is deprecated, not a missing-required-argument TypeError.'],
    validation: { kind: 'php-output', stdout: '["7","ada@example.test"]', diagnostic: 'fgetcsv-escape-deprecation' },
    references: ['https://www.php.net/manual/en/function.fgetcsv.php'],
  },
  {
    id: 'PQ-137', difficulty: 'Applied', family: 'php-upload-validation',
    objective: 'Trace a server-side upload size boundary before choosing a destination extension.',
    difficultyReason: 'Combines byte units, an exclusive upper-bound check, and MIME-to-extension mapping.',
    prompt: 'An earlier upload step has established UPLOAD_ERR_OK and obtained MIME and byte count on the server. Which result does this destination decision produce for the supplied values?',
    code: php(`<?php
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
}`),
    assumptions: 'The byte count and MIME are trusted results of server-side checks, not browser metadata. The code chooses an extension only; it neither moves a file nor claims to implement all upload protections.',
    options: ['too large', 'unsupported', 'png', 'image/png'], answer: 2,
    explanation: '2 * 1024 * 1024 equals 2097152. The test uses >, so an exactly two-MiB upload is accepted. The PNG MIME arm returns the extension png.',
    rationales: ['The boundary value would be rejected by >=, but the shown condition uses >.', 'image/png is explicitly allowed by the match expression.', 'The size passes and the MIME is mapped to png.', 'The function returns an extension, not the input MIME string.'],
    validation: { kind: 'php-output', stdout: 'png' },
  },
  {
    id: 'PQ-197', difficulty: 'Applied', family: 'php-clone',
    objective: 'Distinguish a shallow clone’s identity and scalar state from a shared nested object.',
    difficultyReason: 'Tracks scalar copying and nested-object aliasing in the same operation.',
    prompt: 'After cloning the counter and mutating both a scalar and a nested object through the clone, which JSON array is printed?',
    code: php(`<?php
final class Counter {
    public function __construct(public int $value, public object $meta) {}
}
$first = new Counter(1, (object) ['label' => 'old']);
$second = clone $first;
$second->value++;
$second->meta->label = 'new';
echo json_encode([$first === $second, $first->value, $first->meta->label]);`),
    options: ['[false,1,"old"]', '[true,2,"new"]', '[false,2,"new"]', '[false,1,"new"]'], answer: 3,
    explanation: 'clone creates a distinct Counter and copies its scalar value. It does not clone the nested meta object, so both counters still refer to the same meta instance.',
    rationales: ['This assumes cloning the outer object also clones its nested object.', 'The counters have distinct identity and the original scalar stays 1.', 'The scalar is copied into the clone; incrementing it does not update the first counter.', 'Distinct outer identity, independent scalar, and shared nested object produce this result.'],
    validation: { kind: 'php-output', stdout: '[false,1,"new"]' },
  },
  {
    id: 'PQ-281', difficulty: 'Applied', family: 'php-message-aliasing',
    objective: 'Explain why cloning a message to change headers need not isolate its mutable body object.',
    difficultyReason: 'Combines cloning, copied array state, and a shared object reference.',
    prompt: 'This minimal model illustrates immutable header updates with a shared mutable body. It is not a complete PSR-7 implementation. What text is printed?',
    code: php(`<?php
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
echo '|', $original->body->text, '|', $changed->headers['X-Trace'];`),
    options: ['none|old!|b', 'none|old|b', 'b|old!|b', 'none|old!|none'], answer: 0,
    explanation: 'The cloned message receives its own changed headers array, so the original has no X-Trace header. Both messages reference the same body object, which now contains old!. Real PSR-7 streams may similarly be mutable; message immutability is not a deep-copy guarantee.',
    rationales: ['The headers differ while the aliased body reflects the mutation.', 'This assumes the mutable body was deep-cloned.', 'Changing the clone’s headers does not change the original headers array.', 'The returned message is stored in changed and contains the new header.'],
    validation: { kind: 'php-output', stdout: 'none|old!|b' },
    references: ['https://www.php-fig.org/psr/psr-7/#13-streams'],
  },
  {
    id: 'LQ-046', difficulty: 'Applied', family: 'laravel-validation-data',
    objective: 'Choose a normalization hook that changes both validated input and the returned validated payload.',
    difficultyReason: 'Connects request mutation timing with the validator’s separate data snapshot.',
    prompt: 'Both the email rule and the controller’s validated() payload must see the trimmed, lowercase address. Which hook should replace NORMALIZE_HERE?',
    code: fragment(`final class StoreUserRequest extends FormRequest
{
    public function rules(): array { return ['email' => ['required', 'email']]; }
    protected function NORMALIZE_HERE(): void {
        $this->merge(['email' => strtolower(trim($this->input('email')))]);
    }
}
// Controller: $email = $request->validated('email');`, 'StoreUserRequest.php'),
    assumptions: 'Authorization succeeds. The email input is the string " ADA@example.test ". No middleware or other hook transforms it. NORMALIZE_HERE is a method-name placeholder.',
    options: ['prepareForValidation', 'passedValidation', 'failedValidation', 'An Eloquent saving observer'], answer: 0,
    explanation: 'prepareForValidation runs before the validator captures the request data. The normalized address therefore participates in validation and is returned by validated(). passedValidation runs after that data has already been validated.',
    rationales: ['This hook changes the input before validator construction.', 'A later request merge does not replace the validator’s stored data.', 'This hook handles a failed validation, not preparation for successful validation.', 'An observer runs at persistence time and does not alter the validator’s input.'],
    validation: { kind: 'laravel-contract', case: 'prepareForValidation' },
  },
  {
    id: 'LQ-314', difficulty: 'Applied', family: 'laravel-validation-data',
    objective: 'Distinguish request input after passedValidation from the validator’s accepted snapshot.',
    difficultyReason: 'Traces two data stores through validation and a later merge.',
    prompt: 'The request contains name="  Ada  ". After successful resolution, what do input("name") and validated("name") return, in that order?',
    code: fragment(`final class StoreProjectRequest extends FormRequest
{
    public function rules(): array { return ['name' => ['required', 'string', 'max:120']]; }
    protected function passedValidation(): void {
        $this->merge(['name' => trim($this->input('name'))]);
    }
}`, 'StoreProjectRequest.php'),
    assumptions: 'Authorization succeeds. TrimStrings is disabled for this request, no earlier normalization occurs, and the ordinary FormRequest validator is used.',
    options: ['"Ada", "Ada"', '"  Ada  ", "  Ada  "', '"  Ada  ", "Ada"', '"Ada", "  Ada  "'], answer: 3,
    explanation: 'The validator receives the original spaced string. passedValidation subsequently merges a trimmed string into the request, but validated() reads the existing validator data, not the changed request bag.',
    rationales: ['This would fit normalization before validation, not the shown post-validation merge.', 'The request bag is changed by merge, so input() is trimmed.', 'This reverses which store is changed by merge.', 'The request is trimmed while the validator retains the originally accepted value.'],
    validation: { kind: 'laravel-contract', case: 'passedValidation' },
  },
  {
    id: 'LQ-413', difficulty: 'Applied', family: 'laravel-route-generation',
    objective: 'Distinguish route name prefixes, URL path prefixes and absolute URL generation.',
    difficultyReason: 'Combines named-route resolution with URL origin behavior.',
    prompt: 'What is assigned to url? The current request origin is https://quiz.example.test and the application has no base-path prefix or forced URL overrides.',
    code: fragment(`Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/reports', ReportController::class)->name('reports');
});
$url = route('admin.reports');`, 'routes/web.php'),
    assumptions: 'The route is registered as shown and ReportController exists. No URL defaults or missing-route resolver intervene.',
    options: ['/admin/reports', 'https://quiz.example.test/admin/admin/reports', 'https://quiz.example.test/admin/reports', 'https://quiz.example.test/reports'], answer: 2,
    explanation: 'prefix contributes admin to the path; name contributes admin. only to the route name. route() generates an absolute URL by default using the supplied origin.',
    rationales: ['That would be the relative result requested with absolute: false.', 'The name prefix does not add another path segment.', 'The origin and single path prefix are combined.', 'The group’s path prefix must be included.'],
    validation: { kind: 'laravel-contract', case: 'routeAbsolute' },
  },
  {
    id: 'LQ-453', difficulty: 'Applied', family: 'laravel-dirty-state',
    objective: 'Determine attribute dirty and saved-change flags when assigning an unchanged value.',
    difficultyReason: 'Distinguishes current attributes, original values and the most recent save.',
    prompt: 'The user was freshly retrieved with name="Grace". What are before, after and stillDirty after this code runs?',
    code: fragment(`$user->name = 'Grace';
$before = $user->isDirty('name');
$user->save();
$after = $user->wasChanged('name');
$stillDirty = $user->isDirty('name');`, 'controller.php'),
    assumptions: 'The model has no previous changes, custom name casts/mutators, or observers that change name. The existing row is saved successfully. Timestamp changes do not change name.',
    options: ['false, false, false', 'true, true, false', 'false, true, false', 'true, false, true'], answer: 0,
    explanation: 'The current name equals the retrieved original name. No name change is dirty or recorded by the save, and it remains clean afterward; timestamps are a different attribute.',
    rationales: ['All three name-specific checks are false for this unchanged value.', 'Assignment alone does not make an equal value dirty.', 'A successful save does not imply that this particular attribute changed.', 'There is no unsaved name difference before or after the save.'],
    validation: { kind: 'laravel-contract', case: 'unchangedAttribute' },
  },
  {
    id: 'LQ-142', difficulty: 'Advanced', family: 'laravel-job-locks',
    objective: 'Coordinate different job classes with a shared overlap key and a lease that covers the critical section.',
    difficultyReason: 'Requires resolving both class-scoped lock identity and expiry during a bounded critical section.',
    prompt: 'Two different job classes use this middleware to update the same project. Both critical sections finish within 90 seconds. Which replacement coordinates the classes and keeps the lease alive for the full section?',
    code: fragment(`public function middleware(): array
{
    return [(new WithoutOverlapping('project:' . $this->projectId))
        ->releaseAfter(5)
        ->expireAfter(30)];
}`, 'Job.php (method fragment)', 'Place this method in each job class. WithoutOverlapping is Laravel’s queue middleware.'),
    assumptions: 'The jobs use the same project ID and a shared lock-capable cache. No clock jump, cache outage, process pause beyond the stated 90-second bound, or other lock holder is involved.',
    options: ['Use shared() and expireAfter(120) in both classes.', 'Use shared() and keep expireAfter(30) in both classes.', 'Give both classes the same uniqueId() and use expireAfter(120).', 'Use releaseAfter(120) and keep expireAfter(30) in both classes.'], answer: 0,
    explanation: 'WithoutOverlapping normally namespaces lock identity by job class. shared() coordinates the two classes, and a 120-second lease covers the bounded 90-second critical section. releaseAfter controls contention delay, not lock ownership duration.',
    rationales: ['Both the cross-class lock scope and the too-short lease are corrected.', 'The shared lock can still expire while a 90-second section is running.', 'uniqueId is not the shared-key switch used by WithoutOverlapping.', 'Changing the contention delay fixes neither the class-scoped key nor the short lease.'],
    validation: { kind: 'laravel-contract', case: 'sharedOverlapLock' },
  },
  ...['LQ-489','LQ-545','LQ-546'].map(id => {
    const correction = LARAVEL_CORRECTIONS.find(question => question.id === id);
    return {
      ...correction,
      objective: ({'LQ-489':'Resolve the precedence of time-based and count-based queue retry policies.', 'LQ-545':'Determine default logging behavior after a registered reporting callback returns false.', 'LQ-546':'Repair context enrichment without suppressing or recursively invoking default reporting.'})[id],
      difficultyReason: id === 'LQ-545' ? 'Applies one registered callback contract to an explicit reporting context.' : 'Distinguishes related APIs whose superficially similar controls have different effects.',
      rationales: correction.learning.rationales,
      validation: { kind: 'laravel-contract', case: ({'LQ-489':'retryUntilPrecedence','LQ-545':'reportCallbackFalse','LQ-546':'reportCallbackNull'})[id] },
    };
  }),
];

export const PILOT_REVISIONS = drafts.map(draft => {
  const { rationales, ...question } = draft;
  return {
    ...question, revision: 2, changeKind: 'editorial-pilot', status: 'pilot',
    versions: draft.versions || (draft.id.startsWith('PQ') ? phpVersions : laravelVersions),
    assumptions: draft.assumptions || 'Execute the complete program once in a fresh process with only the definitions and input shown.',
    learning: { trace: draft.explanation, rationales },
    references: draft.references || [draft.id.startsWith('PQ') ? phpReference : 'https://laravel.com/docs/13.x'],
  };
});

export const PILOT_IDS = PILOT_REVISIONS.map(question => question.id);
