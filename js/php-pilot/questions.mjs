import { PHP_PILOT_COLLECTION, validatePhpQuestions, adaptPhpQuestion } from './schema.mjs';

const file = (source, path='main.php') => ({path,kind:'complete-file',source});
const option = (id,text,misconception,rationale) => ({id,text,misconception,rationale});
const define = ({validationKind, ...q}) => ({
  schemaVersion:1, technology:'php', collectionId:PHP_PILOT_COLLECTION, revision:1, status:'pilot', responseType:'single-choice',
  runtime:{php:['8.4','8.5'],sapi:'CLI',extensions:[],errorPolicy:'E_ALL; no custom error handler.'},
  ...q, validation:{fixtureId:q.id,kind:validationKind || 'observed-output'},
});
const fresh = 'Run once in a fresh PHP process; only the shown definitions and inputs exist.';

export const PHP_PILOT_QUESTIONS = validatePhpQuestions([
  define({
    id:'PHP-PILOT-001', format:'execution', topic:'Arrays and values',
    objective:{id:'array-union-precedence',text:'Resolve duplicate string keys when applying array union to configuration defaults.'},
    difficulty:{level:'Foundation',audience:'junior',rationale:'One array operator determines precedence and retained keys.'},
    prerequisites:['Associative arrays','Array keys'],
    stem:'What JSON does this configuration expression print?',
    context:{assumptions:[fresh],files:[file(String.raw`<?php

$defaults = ['timeout' => 10, 'retries' => 2];
$overrides = ['timeout' => 0];

echo json_encode($overrides + $defaults);
`)]},
    options:[
      option('defaults-win','{"timeout":10,"retries":2}','Treating array union as right-hand overwrite.','Union keeps the left-hand value when both arrays contain the same key.'),
      option('override-only','{"timeout":0}','Treating union as replacement of the whole defaults array.','The retries key is absent on the left, so union adds it from the right.'),
      option('left-precedence','{"timeout":0,"retries":2}',null,'timeout is retained from overrides, including its zero value; retries is added from defaults.'),
      option('accumulate','{"timeout":[0,10],"retries":2}','Confusing union with recursive merging of duplicate keys.','The + operator keeps one value per key; it does not collect the two timeout values.'),
    ], correctOptionId:'left-precedence',
    explanation:{summary:'Array union gives existing keys on the left precedence. Zero is a value, not an instruction to use a default.',trace:'Start with timeout=0. The duplicate timeout from defaults is ignored; retries=2 is added. JSON preserves this insertion order.'},
    references:['https://www.php.net/manual/en/language.operators.array.php'],
  }),
  define({
    id:'PHP-PILOT-002', format:'debugging', topic:'References and iteration',
    objective:{id:'foreach-reference-lifetime',text:'Break the lingering loop-variable reference before reusing that variable by value.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Tracks a reference surviving one loop into assignments performed by another.'},
    prerequisites:['foreach','References','Array mutation'], validationKind:'candidate-patches',
    stem:'The second loop must leave the doubled array unchanged. Which statement inserted at FIX makes the final JSON [2,4,6]?',
    context:{assumptions:[fresh,'The two loops and their variable names must remain as shown.'],files:[file(String.raw`<?php

$numbers = [1, 2, 3];

foreach ($numbers as &$value) {
    $value *= 2;
}

/* FIX */

foreach ($numbers as $value) {
    /* read each value */
}

echo json_encode($numbers);
`)]},
    options:[
      option('assign-null','$value = null;','Assuming assignment clears a reference instead of writing through it.','The assignment writes null into the final element and keeps the reference alive.'),
      option('unset-reference','unset($value);',null,'unset detaches the loop variable from the last array element before the next foreach assigns to it.'),
      option('reset-pointer','reset($numbers);','Confusing an internal array pointer with a reference binding.','Resetting iteration position does not detach value from the final element.'),
      option('reindex','$numbers = array_values($numbers);','Assuming reindexing removes references held by array elements.','Reindexing keeps the referenced element; the reused loop variable still writes through that reference.'),
    ],correctOptionId:'unset-reference',
    explanation:{summary:'A foreach reference remains bound after the loop. Unset the loop variable before using it as a by-value target.',trace:'After doubling, value aliases the last element (6). Without detaching it, the next loop writes 2 and then 4 into that element, ending at [2,4,4].'},
    references:['https://www.php.net/manual/en/control-structures.foreach.php'],
  }),
  define({
    id:'PHP-PILOT-003',format:'code-review',topic:'Function contracts',
    objective:{id:'named-parameter-rename',text:'Assess a parameter rename against positional and named callers of a PHP API.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Separates positional compatibility from name-based argument binding.'},
    prerequisites:['Function parameters','Named arguments','Error handling'],
    stem:'A library renamed its parameter from limit to count without changing its type or behavior. Which compatibility assessment matches the two calls in this existing caller?',
    context:{assumptions:[fresh,'Both files are in the same directory. Execute main.php. No compatibility wrapper is installed.'],files:[
      file(String.raw`<?php

function pageSize(int $count): int
{
    return $count;
}
`,'library.php'),
      file(String.raw`<?php

require __DIR__ . '/library.php';

echo pageSize(3), '|';

try {
    echo pageSize(limit: 3);
} catch (Error $error) {
    echo 'Error';
}
`),
    ]},
    options:[
      option('both-work','Both calls return 3; the unchanged type preserves both call styles.','Assuming parameter names are irrelevant to all callers.','The named caller still requests limit, which is no longer a parameter.'),
      option('named-breaks','The positional call returns 3; the named call raises Error before entering pageSize.',null,'The positional call prints 3; the old named call raises Error and the catch prints Error.'),
      option('both-break','Both calls raise Error before entering pageSize; the rename changes both bindings.','Assuming the rename invalidates positional calls too.','The first call binds its integer by position and succeeds.'),
      option('reversed-contract','The positional call raises Error; the named call returns 3 using the unchanged type.','Treating named arguments as type-bound while assuming positional calls depend on parameter spelling.','Position selects count for the first call. The second call instead requires a parameter actually named limit.'),
    ],correctOptionId:'named-breaks',
    explanation:{summary:'Parameter names are part of the callable contract for named callers. This rename preserves positional calls but breaks the shown named call.',trace:'The first argument occupies count regardless of its old name. limit: 3 cannot bind to count, so PHP raises Error before entering pageSize for the second call.'},
    references:['https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments'],
  }),
  define({
    id:'PHP-PILOT-004',format:'execution',topic:'Function defaults',
    objective:{id:'omitted-versus-null',text:'Distinguish an omitted nullable argument from an explicitly supplied null.'},
    difficulty:{level:'Foundation',audience:'junior',rationale:'Applies the parameter default and then one null-coalescing expression.'},
    prerequisites:['Default arguments','Nullable types','Null coalescing'],
    stem:'What text is printed by the omitted-argument call and the explicit-null call?',
    context:{assumptions:[fresh],files:[file(String.raw`<?php

function displayName(?string $name = 'guest'): string
{
    return $name ?? 'missing';
}

echo displayName(), '|', displayName(null);
`)]},
    options:[
      option('both-default','guest|guest','Assuming null requests the default parameter value.','A supplied null is an argument; only omission selects the default.'),
      option('distinct','guest|missing',null,'Omission supplies guest. Explicit null reaches the function and the ?? expression supplies missing.'),
      option('both-null','missing|missing','Assuming omitted arguments enter the function as null.','The declared default is guest, so the omitted call is not null.'),
      option('type-error','guest followed by an uncaught TypeError','Overlooking that ?string explicitly permits null.','The second call is type-valid and returns missing.'),
    ],correctOptionId:'distinct',
    explanation:{summary:'A default argument applies when the caller omits that argument. Explicit null remains null when the parameter permits it.',trace:'displayName() receives guest. displayName(null) receives null, so only the second call evaluates the right-hand side of ?? .'},
    references:['https://www.php.net/manual/en/functions.arguments.php'],
  }),
  define({
    id:'PHP-PILOT-005',format:'implementation',topic:'HTTP input validation',
    objective:{id:'filter-integer-zero',text:'Reject failed integer validation without rejecting a valid zero-valued query parameter.'},
    difficulty:{level:'Applied',audience:'junior',rationale:'Distinguishes the false failure sentinel from integer zero and checks a range.'},
    prerequisites:['Scalar query input','Strict comparison','filter_var'],validationKind:'candidate-patches',
    runtime:{php:['8.4','8.5'],sapi:'CLI model of query validation',extensions:['filter'],errorPolicy:'E_ALL; no custom error handler.'},
    stem:'An HTTP endpoint accepts quantities from 0 through 9 and rejects every invalid value. Which condition should replace REJECT in this validation helper?',
    context:{assumptions:[fresh,'raw is a scalar string already extracted from the query. The helper returns a decision string; it does not send an HTTP response. No FILTER_NULL_ON_FAILURE flag is used.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('truthiness','!$quantity','Conflating validation failure with a valid falsy integer.','This rejects zero even though the endpoint explicitly accepts it.'),
      option('null-sentinel','$quantity === null','Expecting null without FILTER_NULL_ON_FAILURE.','The default failure sentinel is false, so invalid values would be accepted.'),
      option('false-sentinel','$quantity === false',null,'It rejects the failure sentinel while allowing integer 0 and the other in-range integers.'),
      option('not-set','!isset($quantity)','Treating failed validation as an unset variable.','The variable is set to false on failure; isset is still true for false.'),
    ],correctOptionId:'false-sentinel',
    explanation:{summary:'Use identity with false to detect failed FILTER_VALIDATE_INT validation under these flags.',trace:'The four validation results are integer 0, integer 7, false and false. The required decisions are accept:0, accept:7, reject and reject.'},
    references:['https://www.php.net/manual/en/function.filter-var.php','https://www.php.net/manual/en/filter.constants.php'],
  }),
  define({
    id:'PHP-PILOT-006',format:'implementation',topic:'HTTP media types',
    objective:{id:'media-type-boundary',text:'Compare an HTTP media type independently of parameters without accepting prefix lookalikes.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Combines case normalization, delimiter boundaries and exact matching.'},
    prerequisites:['String functions','HTTP Content-Type'],validationKind:'candidate-patches',
    stem:'Accept only application/json, case-insensitively, with optional semicolon parameters. Reject application/jsonp and application/problem+json. Which expression belongs at ACCEPT?',
    context:{assumptions:[fresh,'header is a single syntactically valid Content-Type field value. This policy check does not parse the body or support structured-suffix media types.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('case-sensitive',"trim(explode(';', $header, 2)[0]) === 'application/json'",'Parsing parameters correctly but comparing the media type case-sensitively.','Application/JSON is a permitted case variation, but this comparison rejects it.'),
      option('prefix',"str_starts_with(strtolower(trim(explode(';', $header, 2)[0])), 'application/json')",'Treating a matching string prefix as a media-type boundary.','application/jsonp shares that prefix and would be incorrectly accepted.'),
      option('contains',"str_contains(strtolower(trim(explode(';', $header, 2)[0])), 'json')",'Treating any JSON-like media type as the exact permitted type.','Both excluded lookalikes contain json and would pass this check.'),
      option('type-only',"strtolower(trim(explode(';', $header, 2)[0])) === 'application/json'",null,'It isolates the media type, normalizes case/outer whitespace, and compares the complete type.'),
    ],correctOptionId:'type-only',
    explanation:{summary:'The permitted token is the part before the first semicolon. Exact matching of that token avoids accidentally broadening the endpoint policy.',trace:'The normalized tokens are application/json, application/json, application/jsonp and application/problem+json. Only the first two satisfy the stated policy.'},
    references:['https://www.php.net/manual/en/function.explode.php','https://www.rfc-editor.org/rfc/rfc9110.html#section-8.3'],
  }),
  define({
    id:'PHP-PILOT-007',format:'testing',topic:'File reading',
    objective:{id:'fgets-false-versus-zero',text:'Choose a file fixture that exposes a truthiness-based read loop dropping a valid line.'},
    difficulty:{level:'Applied',audience:'junior',rationale:'Connects fgets return values to PHP string truthiness at an EOF boundary.'},
    prerequisites:['fgets','Boolean conversion','EOF'],validationKind:'test-cases',
    stem:'readLines must retain every line, including a final line without a newline. Which single-file test exposes a defect in this implementation?',
    context:{assumptions:[fresh,'The stream opens successfully and reads have no I/O errors. The function returns raw lines, including any newline bytes.'],files:[file(String.raw`<?php

function readLines($handle): array
{
    $lines = [];

    while ($line = fgets($handle)) {
        $lines[] = $line;
    }

    return $lines;
}
`)]},
    options:[
      option('empty-file','Empty contents; expect [].','Assuming the ordinary EOF sentinel alone triggers the defect.','The loop correctly stops at false for an empty stream and returns the expected empty array.'),
      option('newline','Contents "0\\n"; expect ["0\\n"].','Assuming any string beginning with zero is falsy.','"0\\n" is not the special falsy string "0"; the line is retained.'),
      option('zero-line','Contents "0" (no newline); expect ["0"].',null,'fgets returns the valid string "0", which is falsy and never enters this loop.'),
      option('ordinary','Contents "A" (no newline); expect ["A"].','Assuming every unterminated final line is dropped.','The nonempty string "A" is truthy, so this example passes.'),
    ],correctOptionId:'zero-line',
    explanation:{summary:'Test a valid final line equal to the string "0". The loop must compare fgets with false using !== rather than use the returned line as a boolean.',trace:'For contents "0", fgets succeeds but the condition becomes false and lines stays empty. Changing the condition to ($line = fgets($handle)) !== false retains that line.'},
    references:['https://www.php.net/manual/en/function.fgets.php','https://www.php.net/manual/en/language.types.boolean.php'],
  }),
  define({
    id:'PHP-PILOT-008',format:'execution',topic:'Stream positions',
    objective:{id:'stream-write-position',text:'Track reads and an overwrite at the current position of a seekable stream.'},
    difficulty:{level:'Applied',audience:'junior',rationale:'Tracks the cursor through a read, write and rewind without confusing overwrite with append.'},
    prerequisites:['Stream handles','fread','fwrite','rewind'],
    stem:'What is printed after reading two bytes, writing X and then reading the stream from the start?',
    context:{assumptions:[fresh,'The memory stream is seekable and all reads/writes succeed. Every displayed character occupies one byte.'],files:[file(String.raw`<?php

$h = fopen('php://memory', 'w+');
fwrite($h, 'abcd');
rewind($h);

fread($h, 2);
fwrite($h, 'X');

rewind($h);
echo stream_get_contents($h);

fclose($h);
`)]},
    options:[
      option('append','abcdX','Treating w+ writes as unconditional appends.','w+ permits reading/writing at the current position; it is not append mode.'),
      option('overwrite','abXd',null,'The read advances to byte offset 2; X overwrites c, while d remains.'),
      option('insert','abXcd','Assuming writing inserts a byte and shifts existing content.','A stream write overwrites bytes at that position instead of inserting into the middle.'),
      option('truncate','abX','Assuming a later write truncates everything after its new endpoint.','Opening w+ initially truncates; this later write does not truncate the remaining d.'),
    ],correctOptionId:'overwrite',
    explanation:{summary:'After fread consumes a and b, the stream position is 2. Writing one byte replaces c with X.',trace:'The initial write leaves abcd. Rewind sets position 0, the read moves it to 2, the write produces abXd, and the final rewind makes the whole content readable.'},
    references:['https://www.php.net/manual/en/function.fopen.php','https://www.php.net/manual/en/function.fwrite.php'],
  }),
  define({
    id:'PHP-PILOT-009',format:'debugging',topic:'Exceptions and errors',
    objective:{id:'throwable-hierarchy',text:'Choose a catch type that handles both a domain exception and an engine type error at a task boundary.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Uses the shared Throwable contract without conflating Error and Exception.'},
    prerequisites:['try/catch','TypeError','Exception hierarchy'],validationKind:'candidate-patches',
    stem:'This worker boundary must record and continue after either demonstrated failure, preserving each failure class in the output. Which type replaces Exception in its catch?',
    context:{assumptions:[fresh,'This boundary intentionally handles both failure categories; it does not turn them into successful task results. No process termination or non-throwable failure is involved.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('exception','Exception','Assuming all throwable engine failures extend Exception.','TypeError extends Error, so it escapes this catch.'),
      option('error','Error','Assuming Error is the root of both exception branches.','RuntimeException extends Exception and is not an Error.'),
      option('throwable','Throwable',null,'Both RuntimeException and TypeError implement Throwable, allowing both task outcomes to be recorded.'),
      option('runtime','RuntimeException','Assuming runtime-generated type failures are RuntimeException subclasses.','The first failure is caught, but TypeError belongs to the Error branch.'),
    ],correctOptionId:'throwable',
    explanation:{summary:'Throwable is the shared interface for Error and Exception. Catching it here records the two intended task failures without misreporting success.',trace:'The first task throws RuntimeException. The second supplies an array to strlen and throws TypeError. Throwable catches both; neither Exception nor Error alone does.'},
    references:['https://www.php.net/manual/en/class.throwable.php','https://www.php.net/manual/en/class.typeerror.php'],
  }),
  define({
    id:'PHP-PILOT-010',format:'code-review',topic:'Exception control flow',
    objective:{id:'finally-return-replaces-throw',text:'Identify how returning from finally changes propagation of a pending exception.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Tracks a pending throw through finally and the caller’s catch.'},
    prerequisites:['try/catch/finally','Function return'],
    stem:'The reviewer wants the caller to observe failed loads. What does this implementation actually print?',
    context:{assumptions:[fresh,'There is no other cleanup or exception in finally.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('caught','caught','Assuming a pending exception always survives a finally return.','The return in finally replaces the pending exception, so the caller’s catch is not entered.'),
      option('closed','closed',null,'The finally block returns closed instead of letting the pending exception propagate.'),
      option('both','closedcaught','Assuming return completes and the same exception then also reaches the caller.','The function has one completed outcome here: its returned string.'),
      option('return-forbidden','An uncaught Error because return is forbidden in finally','Confusing discouraged control flow with syntax prohibited by PHP.','PHP permits the return; its effect on the pending exception is the defect.'),
    ],correctOptionId:'closed',
    explanation:{summary:'Returning from finally discards the pending exception in this example. The caller sees the returned string and does not catch a failure.',trace:'The throw starts exception propagation. finally runs before the function leaves, and its return replaces that outcome. Keep cleanup in finally but remove its return to preserve the original failure.'},
    references:['https://www.php.net/manual/en/control-structures.finally.php'],
  }),
  define({
    id:'PHP-PILOT-011',format:'execution',topic:'Object state',
    objective:{id:'readonly-reference-boundary',text:'Distinguish a readonly object property from immutability of the object it references.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Separates mutation of referenced state from replacement of the property.'},
    prerequisites:['Object properties','readonly','Error handling'],
    stem:'What text is printed when code mutates the settings object and then tries to replace it?',
    context:{assumptions:[fresh,'Settings has no magic methods or property hooks.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('deep-readonly','An uncaught Error before anything is printed','Treating readonly as a recursive object-freezing mechanism.','The nested attempts property is mutable; changing it does not reassign settings.'),
      option('copy-on-read','1|Error','Assuming reading a readonly object property yields a detached copy.','The read yields the same Settings object, whose attempts value becomes 4.'),
      option('same-type-replace','4|','Assuming a readonly property can be replaced by another object of the same class.','The replacement is a second assignment, which is forbidden regardless of matching type.'),
      option('reference-readonly','4|Error',null,'The nested value changes, but replacing the initialized readonly settings property raises Error.'),
    ],correctOptionId:'reference-readonly',
    explanation:{summary:'readonly restricts reassignment of the property, not mutation of an ordinary object stored in it.',trace:'Client initializes settings once. attempts belongs to the referenced mutable Settings instance and becomes 4. Assigning a new Settings to the same readonly property then fails.'},
    references:['https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties'],
  }),
  define({
    id:'PHP-PILOT-012',format:'debugging',topic:'Constructors and inheritance',
    objective:{id:'parent-constructor-initialization',text:'Diagnose an uninitialized inherited property when a child defines its own constructor.'},
    difficulty:{level:'Applied',audience:'junior',rationale:'Follows constructor dispatch and an inherited typed property’s initialization.'},
    prerequisites:['Inheritance','Constructors','Typed properties'],validationKind:'candidate-patches',
    stem:'new Admin("Ada") must retain the supplied name and label itself "Ada:admin". Which constructor statement belongs at INITIALIZE?',
    context:{assumptions:[fresh,'The constructor signatures and label method must remain unchanged.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('parent-init','parent::__construct($name);',null,'The parent constructor initializes the promoted name property with the argument supplied to Admin.'),
      option('local-copy','$name = (string) $name;','Confusing the child’s local parameter with the inherited property.','This only assigns the local variable; the inherited property remains uninitialized.'),
      option('parent-default',"parent::__construct('guest');",'Using a fallback despite having a valid caller-supplied value.','It initializes the property but discards Ada, producing guest:admin.'),
      option('new-parent','new Person($name);','Assuming constructing a parent instance initializes the existing child instance.','That initializes a different object, leaving this Admin’s name uninitialized.'),
    ],correctOptionId:'parent-init',
    explanation:{summary:'Defining a child constructor does not automatically run the parent constructor. The child must initialize the inherited state deliberately.',trace:'Person’s promoted name is initialized in Person::__construct. Calling that method on the current object with Ada supplies the value label needs; constructing a separate Person does not.'},
    references:['https://www.php.net/manual/en/language.oop5.decon.php'],
  }),
  define({
    id:'PHP-PILOT-013',format:'architecture',topic:'Dependency lifetime',
    objective:{id:'clock-dependency-lifetime',text:'Use a controllable clock at each decision rather than caching time when constructing a long-lived object.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Connects dependency injection with the lifetime of an observed value.'},
    prerequisites:['Closure invocation','Object lifetime','Dependency injection'],validationKind:'candidate-patches',
    stem:'A lease must be checked repeatedly using its injected clock, and expire when that clock reaches its deadline. Which return expression satisfies this contract on the same Lease object?',
    context:{assumptions:[fresh,'The injected clock returns integer seconds and may advance between calls. Tests must control time without sleeping or changing the system clock.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('read-clock','($this->clock)() >= $this->deadline',null,'Each decision reads the injected clock; the demonstrated timeline produces false and then true.'),
      option('snapshot','$this->createdAt >= $this->deadline','Assuming an injected time value stays current for the object’s lifetime.','createdAt stays 9, so expiry never reflects the clock advancing to 10.'),
      option('system-clock','time() >= $this->deadline','Keeping a hidden system-clock dependency despite accepting a controllable clock.','This bypasses the injected clock and makes the supplied test timeline irrelevant.'),
      option('cached-first','($this->firstCheck ??= ($this->clock)()) >= $this->deadline','Assuming memoization preserves correctness for a changing dependency.','It caches 9 on the first check and reuses it after the injected clock advances.'),
    ],correctOptionId:'read-clock',
    explanation:{summary:'Injecting a clock is useful only if decisions read it at the required time. A cached timestamp models a past observation, not the current clock.',trace:'The constructor and first check occur at 9. A later check on the same object must observe 10. Calling the injected closure each time produces [false,true].'},
    references:['https://www.php.net/manual/en/class.closure.php','https://www.php.net/manual/en/function.time.php'],
  }),
  define({
    id:'PHP-PILOT-014',format:'execution',topic:'Traits and method selection',
    objective:{id:'trait-method-precedence',text:'Resolve trait methods against inherited methods and methods declared directly in the consuming class.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Applies two method-precedence rules to separate classes.'},
    prerequisites:['Traits','Inheritance','Method overriding'],
    stem:'Which pair of labels is printed by these two classes?',
    context:{assumptions:[fresh,'There is no second trait and no alias adaptation.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('base-own','base|own','Assuming an inherited class method outranks a trait method.','Tagged’s trait method overrides the inherited BaseLabel method.'),
      option('trait-trait','trait|trait','Assuming trait methods outrank methods written in the consuming class.','Custom’s own label method takes precedence over the trait.'),
      option('collision','A fatal method-collision error before output','Treating inheritance or a class override as a conflict between two traits.','These are defined precedence cases; no conflicting pair of imported trait methods exists.'),
      option('trait-own','trait|own',null,'The trait beats the inherited method in Tagged, while Custom’s own method beats the trait.'),
    ],correctOptionId:'trait-own',
    explanation:{summary:'A method declared in the consuming class takes precedence over a trait method, and a trait method takes precedence over an inherited method.',trace:'Tagged supplies no own method, so TagLabel wins over BaseLabel. Custom supplies its own method, so it prints own.'},
    references:['https://www.php.net/manual/en/language.oop5.traits.php#language.oop5.traits.precedence'],
  }),
  define({
    id:'PHP-PILOT-015',format:'implementation',topic:'Trait requirements',
    objective:{id:'trait-abstract-method-contract',text:'Implement a trait’s abstract instance-method contract with a compatible signature.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Checks staticness, required arguments and the return type against an abstract contract.'},
    prerequisites:['Traits','Abstract methods','Method signatures'],validationKind:'candidate-patches',
    stem:'Sender must be concrete and (new Sender())->message() must return "mail:ready". Which method can be added after use PrefixMessage in the class-body fragment?',
    context:{assumptions:[fresh,'Load PrefixMessage.php, then place the second fragment inside class Sender { ... }. There are no other methods or parent classes.'],files:[
      file(String.raw`<?php

trait PrefixMessage
{
    abstract protected function prefix(): string;

    public function message(): string
    {
        return $this->prefix() . ':ready';
    }
}
`,'PrefixMessage.php'),
      {path:'sender-members.php',kind:'fragment',scope:'Class-body fragment inside a concrete Sender class; PrefixMessage is loaded first.',source:String.raw`use PrefixMessage;

/* METHOD */
`},
    ]},
    options:[
      option('instance',"protected function prefix(): string\n{\n    return 'mail';\n}",null,'It implements the required instance method with no arguments and the required string result.'),
      option('static',"protected static function prefix(): string\n{\n    return 'mail';\n}",'Assuming a static method can implement an instance-method requirement.','Staticness is part of compatibility; this cannot implement the trait’s non-static method.'),
      option('required-argument',"protected function prefix(string $kind): string\n{\n    return $kind;\n}",'Assuming the consuming class can add a required argument to the trait contract.','The trait calls prefix with no argument; adding a required parameter violates the contract.'),
      option('return-int',"protected function prefix(): int\n{\n    return 1;\n}",'Assuming concatenation permits changing the method’s declared return contract.','The required return type is string; int is not a compatible implementation.'),
    ],correctOptionId:'instance',
    explanation:{summary:'The concrete class must provide a compatible implementation of the trait’s abstract method. Only the instance method with no required arguments and a string result qualifies.',trace:'message invokes prefix on this instance with no arguments. The compatible method returns mail, which is concatenated with :ready. The other declarations fail compatibility checks.'},
    references:['https://www.php.net/manual/en/language.oop5.traits.php#language.oop5.traits.abstract'],
  }),
  define({
    id:'PHP-PILOT-016',format:'execution',topic:'Static and instance members',
    objective:{id:'class-versus-instance-state',text:'Distinguish shared class state from each instance’s own counter.'},
    difficulty:{level:'Foundation',audience:'junior',rationale:'Counts three calls across two objects while tracking two kinds of property.'},
    prerequisites:['Static properties','Instance properties'],
    stem:'What are the total, the first object’s own count, and the second object’s own count?',
    context:{assumptions:[fresh,'Only these two objects and three hit calls exist.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('all-shared','3|3|3','Treating instance properties as shared just like a static property.','own belongs separately to a and b; neither own counter records all three calls.'),
      option('separate','3|2|1',null,'total records all three calls, a records two, and b records one.'),
      option('last-instance','1|2|1','Treating the static value as the latest instance’s counter.','Constructing b does not replace the class’s static storage; each hit increments the same total.'),
      option('first-instance','2|2|1','Assuming a class-level access selects the first created instance’s state.','Visits::$total is class storage and includes b’s hit too.'),
    ],correctOptionId:'separate',
    explanation:{summary:'The static total has one value for this class; each object has its own own property.',trace:'The two calls on a take total to 2 and a->own to 2. The call on b takes total to 3 and b->own to 1.'},
    references:['https://www.php.net/manual/en/language.oop5.static.php'],
  }),
  define({
    id:'PHP-PILOT-017',format:'execution',topic:'Namespace function resolution',
    objective:{id:'qualified-function-resolution',text:'Distinguish an unqualified namespaced function call from an explicitly global call.'},
    difficulty:{level:'Foundation',audience:'junior',rationale:'Resolves two function names with the relevant namespace supplied.'},
    prerequisites:['Namespaces','Fully qualified names'],
    stem:'Which output is produced by the unqualified call followed by the explicitly global call?',
    context:{assumptions:[fresh,'No use function imports or additional definitions are present.'],files:[file(String.raw`<?php

namespace Metrics;

function strlen(string $value): int
{
    return 99;
}

echo strlen('abc'), '|', \strlen('abc');
`)]},
    options:[
      option('always-global','3|3','Assuming a built-in function always takes precedence over a namespaced function.','The unqualified call finds Metrics\\strlen first.'),
      option('always-local','99|99','Ignoring the leading backslash on the second call.','The backslash explicitly selects the global function, which counts three bytes.'),
      option('local-global','99|3',null,'The first call selects Metrics\\strlen and the second selects the built-in global strlen.'),
      option('redeclaration','A fatal redeclaration error before output','Treating function names in different namespaces as the same symbol.','Metrics\\strlen is distinct from global strlen, so this definition is allowed.'),
    ],correctOptionId:'local-global',
    explanation:{summary:'An unqualified function call can resolve to a function in the current namespace. A leading backslash explicitly chooses the global namespace.',trace:'Metrics\\strlen returns the constant 99. Global strlen receives the three-byte string abc and returns 3.'},
    references:['https://www.php.net/manual/en/language.namespaces.fallback.php'],
  }),
  define({
    id:'PHP-PILOT-018',format:'testing',topic:'Boundary tests',
    objective:{id:'inclusive-boundary-regression',text:'Select a test that distinguishes an inclusive balance limit from an exclusive one.'},
    difficulty:{level:'Foundation',audience:'junior',rationale:'Identifies the single boundary at which the implementation differs from the requirement.'},
    prerequisites:['Comparison operators','Boolean assertions'],validationKind:'test-cases',
    stem:'A customer may spend their entire available balance. Both arguments are positive integer cents. Which test fails against the current function and demonstrates that requirement?',
    context:{assumptions:[fresh,'No fees, credit, floating-point amounts or other constraints apply. Each option states an expected boolean result.'],files:[file(String.raw`<?php

function canSpend(int $balance, int $amount): bool
{
    return $amount < $balance;
}
`)]},
    options:[
      option('below','canSpend(100, 99) should be true','Testing just below the boundary while expecting it to distinguish < from <=.','Both comparisons accept 99, so this assertion passes the buggy implementation.'),
      option('above','canSpend(100, 101) should be false','Testing just above the boundary while expecting it to distinguish < from <=.','Both comparisons reject 101, so this assertion does not expose the defect.'),
      option('well-below','canSpend(100, 1) should be true','Using an ordinary valid amount instead of the changed boundary.','This passes with either operator and does not establish whether the whole balance may be spent.'),
      option('equal','canSpend(100, 100) should be true',null,'The implementation returns false for equality, which contradicts the stated full-balance requirement.'),
    ],correctOptionId:'equal',
    explanation:{summary:'The equality case is the difference between the current < test and the required <= test.',trace:'At balance=100 and amount=100, 100 < 100 is false. Changing the operator to <= makes that regression assertion pass while preserving the other three shown outcomes.'},
    references:['https://www.php.net/manual/en/language.operators.comparison.php'],
  }),
  define({
    id:'PHP-PILOT-019',format:'debugging',topic:'Namespace class resolution',
    objective:{id:'class-name-no-global-fallback',text:'Diagnose an unqualified class name in a namespace when the intended class is global.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Distinguishes class resolution from exception construction and the outer catch.'},
    prerequisites:['Namespaces','Class names','Throwable'],
    stem:'The intention is to throw the built-in RuntimeException. Which class name is actually printed by the catch?',
    context:{assumptions:[fresh,'There is no Jobs\\RuntimeException, no class alias, no use import and no autoloader. The leading backslashes in the catch and get_class call are intentional.'],files:[file(String.raw`<?php

namespace Jobs;

try {
    throw new RuntimeException('failed');
} catch (\Throwable $error) {
    echo \get_class($error);
}
`)]},
    options:[
      option('lookup-error','Error',null,'PHP tries to construct Jobs\\RuntimeException; the missing class raises Error, which Throwable catches.'),
      option('global-exception','RuntimeException','Assuming unqualified class names fall back to global classes.','Classes do not use the global fallback that unqualified function calls can use.'),
      option('namespaced-exception','Jobs\\RuntimeException','Assuming naming an unknown class creates a new namespaced exception type.','No such class exists, so construction fails before that exception could be thrown.'),
      option('catch-type','Throwable','Assuming get_class reports the declared catch type.','Throwable is the interface matched by catch; get_class reports the concrete Error instance.'),
    ],correctOptionId:'lookup-error',
    explanation:{summary:'The unqualified class name resolves within Jobs. With no matching class or import, PHP raises Error before constructing the intended exception.',trace:'Use new \\RuntimeException(...) or import RuntimeException to throw the global class. The catch already names global Throwable, so it catches the lookup Error and prints its concrete class.'},
    references:['https://www.php.net/manual/en/language.namespaces.rules.php','https://www.php.net/manual/en/language.namespaces.fallback.php'],
  }),
  define({
    id:'PHP-PILOT-020',format:'code-review',topic:'Stream ownership',
    objective:{id:'borrowed-stream-ownership',text:'Preserve a borrowed stream and its position so the caller can continue reading.'},
    difficulty:{level:'Applied',audience:'intermediate',rationale:'Combines ownership of a resource with its cursor state at an API boundary.'},
    prerequisites:['Resource handles','fgets','finally'],validationKind:'candidate-patches',
    stem:'readFirst borrows the caller’s handle. After it returns, the caller must read the next line from that same handle. Which statement should replace the entire /* CLEANUP */ comment? Leave every other line unchanged.',
    context:{assumptions:[fresh,'The caller owns and closes the successfully opened stream. Both lines exist and reads succeed. The function must consume exactly its first line and leave the handle usable.'],files:[file(String.raw`<?php

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
`)]},
    options:[
      option('close','fclose($handle);','Assuming every function using a handle should close it.','Closing a borrowed handle makes the caller’s next fgets fail instead of reading beta.'),
      option('detach-local','unset($handle);',null,'This drops the local variable only; the caller still owns the resource at its current position after alpha.'),
      option('rewind','rewind($handle);','Assuming leaving a borrowed resource at the beginning preserves the caller’s intended continuation.','The handle stays open but the caller reads alpha again instead of beta.'),
      option('seek-end','fseek($handle, 0, SEEK_END);','Assuming a reader should leave a shared stream positioned for a later append.','The next read starts at EOF and returns false, violating the next-line contract.'),
    ],correctOptionId:'detach-local',
    explanation:{summary:'The caller owns the handle and needs its advanced cursor. Unsetting the callee’s local variable preserves both the caller’s reference and that position.',trace:'fgets consumes alpha plus its newline. The finally block unsets only the local parameter. The caller’s h still refers to the open stream positioned before beta; the caller closes it afterward. There is no fclose in the finally block to retain or replace. A simpler refactor could omit this finally block entirely, but that is outside this one-statement task.'},
    references:['https://www.php.net/manual/en/function.fclose.php','https://www.php.net/manual/en/function.unset.php','https://www.php.net/manual/en/language.types.resource.php'],
  }),
]);

export const PHP_PILOT_BANK = PHP_PILOT_QUESTIONS.map(adaptPhpQuestion);
