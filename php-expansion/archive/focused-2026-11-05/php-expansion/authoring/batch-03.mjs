import {q,file,option as o,ref} from './record.mjs';
export default [
q({id:'PHP-E26-0201',format:'E',level:'F',topic:5,subtopic:'concatenation-arithmetic-precedence-php8',objective:'Apply PHP 8 precedence between arithmetic addition and string concatenation.',reason:'Group a single expression using the current language precedence rules.',prerequisites:['Addition','String concatenation','PHP 8 operator precedence'],lessons:[2],coverageComplete:true,stem:'What text is printed on the stated PHP 8.4/8.5 runtimes?',files:[file(`$left = 2;
$right = 3;

echo 'total=' . $left + $right;`)],options:[o('sum','total=5','Addition binds more tightly than concatenation, so the numeric sum is concatenated.'),o('append','total=23','The plus operator still performs arithmetic rather than string concatenation.','Treating both operators as concatenation because the expression begins with a string.'),o('type-error','An uncaught TypeError','PHP 8 groups the addition before concatenating the label, so no nonnumeric string reaches +.','Applying the pre-PHP-8 left-associative grouping of concatenation and addition.'),o('numeric-only','5','The label is concatenated after the addition and is not discarded.','Assuming arithmetic determines the type of the entire unparenthesized expression.')],key:'sum',explanation:'Since PHP 8, concatenation has lower precedence than addition. The expression groups as the label concatenated with ($left + $right).',trace:'2 + 3 produces integer 5. Concatenating it with total= produces total=5.',validation:{kind:'output',stdout:'total=5'},references:['https://www.php.net/manual/en/language.operators.precedence.php']}),
q({id:'PHP-E26-0202',format:'E',level:'F',topic:6,subtopic:'do-while-first-iteration',objective:'Distinguish postcondition loops from precondition loops.',reason:'Compare where two loop forms perform their first condition check.',prerequisites:['while','do while','Increment','Comparison'],lessons:[3],coverageComplete:true,stem:'What JSON pair is printed by these loops with the same continuation condition?',files:[file(`$before = 0;
$after = 0;

while ($before < 0) {
    $before++;
}

do {
    $after++;
} while ($after < 0);

echo json_encode([$before, $after]);`)],options:[o('both-check-first','[0,0]','The do-while body runs before its first condition check.','Treating both forms as precondition loops.'),o('both-run-first','[1,1]','The while loop checks 0 < 0 before running and skips its body.','Assuming every loop executes at least once.'),o('different','[0,1]','while checks first and skips; do-while runs once and then stops.'),o('reversed','[1,0]','The condition-check timing of the two loop forms is reversed in this result.','Confusing which loop places its condition before the body.')],key:'different',explanation:'while evaluates its condition before the body. do-while evaluates after the body, so it executes once even when the continuation condition is initially false.',trace:'before remains 0 because 0 < 0 is false. after increments to 1 before 1 < 0 is tested and rejected.',validation:{kind:'output',stdout:'[0,1]'},references:['https://www.php.net/manual/en/control-structures.do.while.php','https://www.php.net/manual/en/control-structures.while.php']}),
q({id:'PHP-E26-0203',format:'E',level:'F',topic:6,subtopic:'switch-fallthrough-after-selected-case',objective:'Trace switch fallthrough until a break statement.',reason:'Follow source-order execution after one exact matching case.',prerequisites:['switch','break','String concatenation'],lessons:[3],coverageComplete:true,stem:'Which text is printed? The missing break after case 1 is intentional.',files:[file(`$code = 1;
$result = '';

switch ($code) {
    case 1:
        $result .= 'A';
    case 2:
        $result .= 'B';
        break;
    default:
        $result .= 'D';
}

echo $result;`)],options:[o('selected-only','A','Execution continues into case 2 because case 1 has no break.','Assuming each switch case ends implicitly.'),o('fallthrough','AB','Case 1 appends A, then execution falls through to B and stops at break.'),o('through-default','ABD','The break after B prevents execution of default.','Ignoring break after a fallthrough path.'),o('second-only','B','The initially selected case 1 executes before falling through.','Treating fallthrough as replacing the selected branch rather than continuing it.')],key:'fallthrough',explanation:'After selecting a switch case, PHP executes subsequent statements until a break or the end of the switch. Later case labels do not re-test the subject during fallthrough.',trace:'The subject matches case 1. A is appended, then B; break exits before default.',validation:{kind:'output',stdout:'AB'},references:['https://www.php.net/manual/en/control-structures.switch.php']}),
q({id:'PHP-E26-0204',format:'E',level:'F',topic:4,subtopic:'array-list-requires-key-iteration-order',objective:'Determine whether integer keys form a list in iteration order rather than merely as a set.',reason:'Apply the list-key definition before and after reordering existing keys.',prerequisites:['Array iteration order','array_is_list','ksort'],lessons:[4],coverageComplete:true,stem:'What JSON is printed? The two integer keys are 0 and 1, but their initial insertion order is shown explicitly.',files:[file(`$items = [1 => 'second', 0 => 'first'];
$before = array_is_list($items);
ksort($items);
$after = array_is_list($items);

echo json_encode([$before, $after]);`)],options:[o('key-set-only','[true,true]','Before sorting, the first iterated key is 1 rather than 0, so the array is not a list.','Checking only the set of integer keys and ignoring their order.'),o('no-reindex','[false,false]','ksort puts existing keys 0 and 1 in the required order; no renumbering is needed here.','Assuming only array_values can produce a list.'),o('reversed','[true,false]','Sorting these integer keys repairs their order rather than breaking a list.','Confusing insertion order with the permanent identity of a list.'),o('ordered-keys','[false,true]','The initial key order is 1,0; sorting changes it to the required 0,1.')],key:'ordered-keys',explanation:'array_is_list requires keys to occur as consecutive integers beginning at zero in iteration order. Merely containing the same key set is insufficient.',trace:'The initial first key is 1, so before is false. ksort orders keys as 0 then 1, making after true without changing their values.',validation:{kind:'output',stdout:'[false,true]'},references:['https://www.php.net/manual/en/function.array-is-list.php','https://www.php.net/manual/en/function.ksort.php']}),
q({id:"PHP-E26-0205",format:"E",level:"F",topic:17,subtopic:"object-parameter-local-rebinding",objective:"Distinguish mutating an object parameter from rebinding the local parameter variable.",reason:"Track one shared object followed by a local variable reassignment.",prerequisites:["Object handles","Function parameters by value","new"],lessons:[5,23],coverageComplete:true,stem:"What value remains in the caller’s object after updateBox returns?",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Box
{
    public int $value = 1;
}

function updateBox(Box $box): void
{
    $box->value = 2;
    $box = new Box();
    $box->value = 3;
}

$original = new Box();
updateBox($original);

echo $original->value;
`}],options:[o("original-default","1","The first property write mutates the shared original object.","Assuming a by-value object parameter automatically clones the object."),o("shared-write","2","The first write affects the original; later rebinding changes only the local parameter.",null),o("new-value","3","The final write targets the new object held only by the local parameter.","Assuming parameter rebinding also rebinds the caller’s variable."),o("lost-object","An uncaught Error when the function assigns a new Box to its by-value parameter","A parameter variable may be reassigned to another compatible object. Passing by value limits which variable is rebound; it does not prohibit local assignment.","Confusing by-value argument passing with a read-only parameter binding.")],key:"shared-write",explanation:"Passing an object by value copies its handle, so property mutation reaches the original. Assigning a different object to the local parameter does not assign the caller’s variable.",trace:"The original reaches value 2. The local box then points to a new object whose value becomes 3; original still points to the first object.",validation:{"kind":"output","stdout":"2"},references:["https://www.php.net/manual/en/language.oop5.references.php"],revision:2}),
q({id:'PHP-E26-0206',format:'E',level:'F',topic:4,subtopic:'unshift-renumbers-integer-keys',objective:'Predict integer-key renumbering and string-key preservation when prepending.',reason:'Apply the documented key rules of one array_unshift operation.',prerequisites:['Integer and string array keys','array_unshift'],lessons:[4],coverageComplete:true,stem:'What JSON is printed after prepending new?',files:[file(`$items = [5 => 'old', 'tag' => 'keep'];
array_unshift($items, 'new');

echo json_encode($items);`)],options:[o('preserved-number','{"0":"new","5":"old","tag":"keep"}','array_unshift renumbers existing numeric keys rather than preserving key 5.','Applying string-key preservation to integer keys.'),o('all-list','["new","old","keep"]','The string key tag is retained rather than converted to a numeric index.','Assuming prepending reindexes every kind of key.'),o('key-rules','{"0":"new","1":"old","tag":"keep"}','The new numeric entry and old numeric entry become 0 and 1; tag stays a string key.'),o('append','{"5":"old","tag":"keep","6":"new"}','array_unshift prepends, whereas this result resembles an ordinary append.','Confusing insertion at the front with adding the next integer key.')],key:'key-rules',explanation:'array_unshift prepends values and renumbers numeric keys from zero. Existing string keys remain unchanged.',trace:'new becomes key 0, old is reindexed from 5 to 1, and tag remains associated with keep.',validation:{kind:'output',stdout:'{"0":"new","1":"old","tag":"keep"}'},references:['https://www.php.net/manual/en/function.array-unshift.php']}),
q({id:'PHP-E26-0207',format:'E',level:'F',topic:3,subtopic:'contains-empty-needle-case-sensitive',objective:'Apply str_contains semantics for an empty needle and case-sensitive text.',reason:'Evaluate two documented string-search cases without relying on truthiness of a position.',prerequisites:['str_contains','Empty strings','Case sensitivity'],lessons:[1,2],coverageComplete:true,stem:'What JSON pair is printed by these string containment checks?',files:[file(`echo json_encode([
    str_contains('PHP', ''),
    str_contains('PHP', 'php'),
]);`)],options:[o('rules','[true,false]','Every string contains the empty string; the second search differs in case.'),o('empty-false','[false,false]','An empty needle is considered contained, not an invalid or absent match.','Assuming an empty search term always means no match.'),o('case-insensitive','[true,true]','str_contains performs a case-sensitive search.','Applying case-insensitive behavior without requesting it.'),o('inverted','[false,true]','Both the empty-needle and case-sensitivity assumptions are reversed.','Treating an empty term as absent and ordinary text matching as case-insensitive.')],key:'rules',explanation:'str_contains returns a boolean and uses case-sensitive matching. The empty string is contained in any string.',trace:'The empty needle succeeds. Lowercase php is not present in uppercase PHP.',validation:{kind:'output',stdout:'[true,false]'},references:['https://www.php.net/manual/en/function.str-contains.php']}),
q({id:'PHP-E26-0208',format:'E',level:'F',topic:18,subtopic:'interface-instanceof-versus-exact-class',objective:'Distinguish interface membership from an object’s concrete class name.',reason:'Apply one declared interface relationship to two introspection operations.',prerequisites:['Interfaces','implements','instanceof','get_class'],lessons:[23,27],coverageComplete:true,stem:'What JSON is printed for the concrete object?',files:[file(`interface PrintableValue
{
    public function text(): string;
}

class Ticket implements PrintableValue
{
    public function text(): string
    {
        return 'ticket';
    }
}

$value = new Ticket();

echo json_encode([$value instanceof PrintableValue, get_class($value)]);`)],options:[o('interface-name','[true,"PrintableValue"]','get_class reports the concrete class, not an implemented interface.','Treating an interface as the runtime class name.'),o('exact-only','[false,"Ticket"]','instanceof accepts implemented interfaces, not only exact concrete class names.','Restricting instanceof to exact class equality.'),o('interface-both','[false,"PrintableValue"]','The object implements the interface and remains an instance of concrete class Ticket.','Confusing the declared contract with concrete identity in both checks.'),o('membership','[true,"Ticket"]','The object implements PrintableValue and its concrete class is Ticket.')],key:'membership',explanation:'An interface defines a contract that an implementing object satisfies. It does not replace the object’s concrete class identity.',trace:'Ticket declares implements PrintableValue, so instanceof is true. get_class returns Ticket.',validation:{kind:'output',stdout:'[true,"Ticket"]'},references:['https://www.php.net/manual/en/language.oop5.interfaces.php','https://www.php.net/manual/en/function.get-class.php']}),
q({id:'PHP-E26-0209',format:'E',level:'M',topic:7,subtopic:'recursive-unwind-output-order',objective:'Trace output before a recursive call separately from output during unwinding.',reason:'Maintain the local argument of each active call while following entry and return order.',prerequisites:['Recursion','Base cases','Per-call local variables'],lessons:[5,10],coverageComplete:true,stem:'What exact text is printed by the recursive call, including both sides of each recursive step?',files:[file(`function visit(int $depth): void
{
    if ($depth === 0) {
        echo 'X';

        return;
    }

    echo $depth;
    visit($depth - 1);
    echo $depth;
}

visit(2);`)],options:[o('same-order','21X21','After the base case, the innermost pending call resumes first.','Replaying entry order rather than unwinding the call stack.'),o('base-first','X1221','The pre-call echo statements execute before reaching the base case.','Moving all output until after recursion finishes.'),o('entry-only','21X','Returning from the base case resumes the pending callers and their final echo statements.','Treating return from one recursive call as return from the entire recursion.'),o('unwind','21X12','Calls print 2 then 1 on entry, X at the base, then 1 and 2 while unwinding.')],key:'unwind',explanation:'Each recursive invocation keeps its own depth. The second echo runs only after that invocation’s recursive child returns.',trace:'visit(2) prints 2, visit(1) prints 1, and visit(0) prints X. Returning resumes visit(1)’s final echo, then visit(2)’s.',validation:{kind:'output',stdout:'21X12'},references:[ref.functions]}),
q({id:'PHP-E26-0210',format:'E',level:'M',topic:3,subtopic:'sequential-replacement-versus-translation',objective:'Distinguish cascading str_replace passes from strtr’s nonrecursive replacement.',reason:'Track whether replacement output becomes input to a later replacement rule.',prerequisites:['str_replace','strtr with an associative map'],lessons:[2],coverageComplete:true,stem:'What JSON pair is printed? The replacement rule order is exactly as displayed.',files:[file(`$text = 'ab';

$sequential = str_replace(['a', 'b'], ['b', 'c'], $text);
$translated = strtr($text, ['a' => 'b', 'b' => 'c']);

echo json_encode([$sequential, $translated]);`)],options:[o('both-once','["bc","bc"]','str_replace applies the b-to-c pass to the output of the a-to-b pass.','Assuming every replacement API processes only original characters.'),o('different','["cc","bc"]','str_replace cascades to cc; strtr does not reprocess inserted b and produces bc.'),o('both-cascade','["cc","cc"]','strtr does not recursively translate its own replacement output.','Applying sequential-pass behavior to strtr’s map.'),o('reverse','["bc","cc"]','The cascading and nonrecursive API behaviors are assigned to the wrong functions.','Reversing the two replacement models.')],key:'different',explanation:'str_replace processes search entries sequentially, allowing a later pass to replace text inserted by an earlier pass. strtr with a map does not search its replacement text again.',trace:'str_replace changes ab to bb and then cc. strtr replaces original a with b and original b with c, producing bc.',validation:{kind:'output',stdout:'["cc","bc"]'},references:['https://www.php.net/manual/en/function.str-replace.php','https://www.php.net/manual/en/function.strtr.php']}),
q({id:'PHP-E26-0211',format:'E',level:'M',topic:4,subtopic:'foreach-independent-internal-array-pointer',objective:'Distinguish foreach iteration state from an array’s internal pointer.',reason:'Track a deliberately moved internal pointer alongside a complete foreach traversal.',prerequisites:['end','current','foreach'],lessons:[4],coverageComplete:true,stem:'What JSON is printed? No reset or next call occurs after end.',files:[file(`$values = ['a', 'b', 'c'];
end($values);
$visited = '';

foreach ($values as $value) {
    $visited .= $value;
}

echo json_encode([$visited, current($values)]);`)],options:[o('shared-start','["c",false]','foreach neither starts from the internal pointer nor advances it beyond the end.','Assuming foreach consumes the current/next pointer.'),o('foreach-exhausts','["abc",false]','The foreach traversal does not move the internal pointer from c.','Assuming foreach resets the pointer and then exhausts it.'),o('independent','["abc","c"]','foreach visits every entry while the internal pointer stays on c.'),o('foreach-resets','["abc","a"]','foreach does not reset the internal pointer to a.','Assuming iteration resets the pointer but leaves it at the beginning.')],key:'independent',explanation:'foreach maintains its own iteration state. It does not modify the internal pointer used by current, next and end.',trace:'end selects c for current. foreach independently builds abc, and current still returns c afterward.',validation:{kind:'output',stdout:'["abc","c"]'},references:['https://www.php.net/manual/en/control-structures.foreach.php','https://www.php.net/manual/en/function.current.php']}),
q({id:'PHP-E26-0212',format:'E',level:'M',topic:4,subtopic:'multisort-secondary-array-order',objective:'Trace primary and secondary sort criteria across parallel arrays.',reason:'Follow aligned rows through a primary tie and a secondary comparison.',prerequisites:['array_multisort','SORT_ASC','Parallel arrays'],lessons:[4],coverageComplete:true,stem:'What JSON pair is printed after sorting these aligned rows? All keys are ordinary consecutive integers.',files:[file(`$priority = [2, 1, 1];
$name = ['Z', 'B', 'A'];

array_multisort($priority, SORT_ASC, $name, SORT_ASC);

echo json_encode([$priority, $name]);`)],options:[o('secondary','[[1,1,2],["A","B","Z"]]','Priority sorts first; the tied priority-1 rows are ordered by name.'),o('stable-primary','[[1,1,2],["B","A","Z"]]','The second array supplies a secondary comparison, not merely a payload reordered stably by priority.','Ignoring the secondary sort criterion.'),o('independent-priority','[[2,1,1],["A","B","Z"]]','Both arrays are reordered together; priority does not stay in original order.','Sorting only the final supplied array.'),o('priority-only','[[1,1,2],["Z","B","A"]]','The name entries move with their aligned priority rows.','Sorting one parallel array without carrying the others along.')],key:'secondary',explanation:'array_multisort treats the arrays as aligned row columns. Later arrays break ties in earlier arrays, and all supplied arrays are reordered together.',trace:'The priority-1 rows move before priority 2. Within that tie, A precedes B, leaving Z aligned with priority 2.',validation:{kind:'output',stdout:'[[1,1,2],["A","B","Z"]]'},references:['https://www.php.net/manual/en/function.array-multisort.php']}),
q({id:'PHP-E26-0213',format:'E',level:'M',topic:14,subtopic:'boolean-filter-failure-null-distinction',objective:'Distinguish parsed false values from invalid boolean text using FILTER_NULL_ON_FAILURE.',reason:'Apply parser vocabulary and preserve a separate validation-failure result.',prerequisites:['filter_var','FILTER_VALIDATE_BOOLEAN','null versus false'],lessons:[1],coverageComplete:false,stem:'What JSON is printed? This code parses boolean text rather than casting strings to bool.',files:[file(`$inputs = ['false', '0', 'yes', 'maybe'];
$result = [];

foreach ($inputs as $input) {
    $result[] = filter_var($input, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
}

echo json_encode($result);`)],options:[o('casts','[true,false,true,true]','Validation parses recognized words and rejects maybe, rather than applying PHP string truthiness.','Confusing filter parsing with a bool cast.'),o('false-on-invalid','[false,false,true,false]','FILTER_NULL_ON_FAILURE makes unrecognized text null rather than false.','Ignoring the flag that separates invalid input from a valid false value.'),o('only-digits','[null,false,null,null]','The boolean filter recognizes words such as false and yes.','Assuming only numeric boolean spellings are accepted.'),o('parsed','[false,false,true,null]','false and 0 parse as false, yes as true, and maybe is invalid.')],key:'parsed',explanation:'The boolean validation filter recognizes a documented set of textual values. FILTER_NULL_ON_FAILURE reserves null for text outside that set, preserving false as a valid parsed value.',trace:'false and 0 are recognized false values, yes is recognized true, and maybe has no boolean meaning in this parser.',validation:{kind:'output',stdout:'[false,false,true,null]'},references:['https://www.php.net/manual/en/filter.constants.php']}),
q({id:'PHP-E26-0214',format:'E',level:'M',topic:7,subtopic:'default-constant-evaluated-at-call',objective:'Determine when a constant used as a default argument must be defined.',reason:'Separate function declaration from evaluation of an omitted argument’s default expression.',prerequisites:['Default arguments','define','Function declaration and invocation'],lessons:[2,5],coverageComplete:true,stem:'What text is printed? The function is declared before define, but called afterward.',files:[file(`function pageSize(int $size = DEFAULT_PAGE_SIZE): int
{
    return $size;
}

define('DEFAULT_PAGE_SIZE', 25);

echo pageSize();`)],options:[o('declaration-error','An uncaught Error when the function is declared','The default constant is resolved when the default value is needed for the call, after define has run.','Requiring a default-expression constant to exist at function declaration time.'),o('defined-value','25','The omitted argument uses the constant value available when pageSize is called.'),o('literal-name','DEFAULT_PAGE_SIZE','An unquoted constant reference resolves a value; it is not a string literal name.','Applying legacy undefined-constant string fallback instead of resolving a defined constant.'),o('null-type-error','An uncaught TypeError because the default became null','PHP does not snapshot an unresolved default as null at declaration.','Treating an unavailable declaration-time value as a permanently stored null.')],key:'defined-value',explanation:'A default argument expression is evaluated when the omitted argument needs that default. By the time this call occurs, the constant has been defined.',trace:'Declaring pageSize does not invoke it. define installs 25, then pageSize() evaluates the default constant and returns 25.',validation:{kind:'output',stdout:'25'},references:['https://www.php.net/manual/en/functions.arguments.php']}),
q({id:'PHP-E26-0215',format:'E',level:'M',topic:6,subtopic:'match-condition-and-result-laziness',objective:'Trace evaluated match conditions separately from selected result expressions.',reason:'Follow side effects until the first identity match and skip later conditions and unused results.',prerequisites:['match','Function side effects','Strict arm comparison'],lessons:[3,5],coverageComplete:true,stem:'What exact text is printed? mark writes its label before returning the supplied value.',files:[file(`function mark(string $label, int $value): int
{
    echo $label;

    return $value;
}

$result = match (2) {
    mark('a', 1) => mark('x', 10),
    mark('b', 2) => mark('y', 20),
    mark('c', 3) => mark('z', 30),
};

echo '|', $result;`)],options:[o('all-results','axbycz|20','Results of unmatched arms are never evaluated.','Evaluating every condition and result before selecting an arm.'),o('all-conditions','abcy|20','Condition c is not evaluated after b matches.','Eagerly evaluating all arm conditions before choosing the first match.'),o('short-circuit','aby|20','Conditions a and b run; b matches, so only its result y runs.'),o('selected-only','by|20','The first condition a must be evaluated to determine that it does not match.','Skipping unsuccessful conditions as if PHP knew their returned values without calling them.')],key:'short-circuit',explanation:'match evaluates conditions in order until one matches identically. It evaluates only that arm’s result, then stops.',trace:'a returns 1 and fails. b returns 2 and matches. y returns 20. Neither x, c nor z is evaluated.',validation:{kind:'output',stdout:'aby|20'},references:['https://www.php.net/manual/en/control-structures.match.php']}),
q({id:'PHP-E26-0216',format:'E',level:'M',topic:8,subtopic:'invokable-object-state-across-callbacks',objective:'Trace state retained by an invokable object passed as a callable.',reason:'Combine __invoke dispatch with reuse of one stateful object across callback invocations.',prerequisites:['__invoke','callable','Object properties','array_map'],lessons:[8,23],coverageComplete:true,stem:'What JSON is printed after array_map uses the same callable object for both entries?',files:[file(`class RunningTotal
{
    private int $total = 0;

    public function __invoke(int $value): int
    {
        $this->total += $value;

        return $this->total;
    }
}

$sum = new RunningTotal();
$mapped = array_map($sum, [2, 3]);

echo json_encode([$mapped, $sum(4)]);`)],options:[o('stateful','[[2,5],9]','Both map calls and the later direct invocation use one object’s total.'),o('cloned-callback','[[2,3],4]','array_map does not clone or reconstruct the callable object for each element.','Assuming callback invocations receive independent object state.'),o('map-only-state','[[2,5],4]','The object retains the total accumulated during array_map for the later call.','Assuming a callback API restores the object’s state when it returns.'),o('argument-array','[[5],9]','array_map invokes the callable once per element, not once with the whole array.','Treating an invokable object as a reducer automatically.')],key:'stateful',explanation:'An object with __invoke can be used as a callable. Passing it to array_map reuses that object; method calls mutate its retained properties normally.',trace:'The first call stores 2, the second stores 5, and the later direct call adds 4 to reach 9.',validation:{kind:'output',stdout:'[[2,5],9]'},references:['https://www.php.net/manual/en/language.oop5.magic.php#object.invoke','https://www.php.net/manual/en/function.array-map.php']}),
q({id:'PHP-E26-0217',format:'E',level:'M',topic:3,subtopic:'strict-string-parameter-versus-explicit-cast',objective:'Distinguish explicit Stringable conversion from a strict string parameter requirement.',reason:'Separate a legal explicit cast from implicit argument coercion under strict_types.',prerequisites:['strict_types','__toString','Stringable','TypeError'],lessons:[1,5,23],coverageComplete:true,stem:'What text is printed? The string cast and the function call are separate expressions.',files:[file(`declare(strict_types=1);

class Label
{
    public function __toString(): string
    {
        return 'ready';
    }
}

function show(string $text): string
{
    return $text;
}

$label = new Label();
echo (string) $label, '|';

try {
    echo show($label);
} catch (TypeError $error) {
    echo 'TypeError';
}`)],options:[o('coerced','ready|ready','Strict argument checking does not implicitly accept a Stringable object for a string-only parameter.','Assuming __toString overrides strict scalar parameter checking.'),o('cast-rejected','TypeError before any output','An explicit string cast can invoke __toString even under strict_types.','Treating strict_types as a ban on explicit conversions.'),o('class-name','Label|TypeError','The explicit cast invokes __toString rather than printing the class name.','Confusing object class identity with its declared string representation.'),o('explicit-only','ready|TypeError','The cast succeeds, then the strict string parameter rejects the object.')],key:'explicit-only',explanation:'strict_types controls scalar argument coercion at the call site. It does not prevent explicit casts. Accepting Stringable objects in the API would require a suitable parameter type or an explicit cast before this call.',trace:'The cast calls __toString and prints ready. show receives an object rather than a string, so its strict call throws TypeError.',validation:{kind:'output',stdout:'ready|TypeError'},references:['https://www.php.net/manual/en/class.stringable.php','https://www.php.net/manual/en/language.types.declarations.php']}),
q({id:'PHP-E26-0218',format:'E',level:'M',topic:17,subtopic:'arrayaccess-coalescing-dispatch-trace',objective:'Trace ArrayAccess existence and read hooks used by null coalescing.',reason:'Apply the explicitly implemented offsetExists contract before deciding whether offsetGet runs.',prerequisites:['ArrayAccess (unmapped curriculum)','Null coalescing','Method dispatch'],lessons:[23,27],coverageComplete:false,stem:'What JSON is printed? The custom offsetExists deliberately reports false even though offsetGet could return a value.',files:[file(`class Bag implements ArrayAccess
{
    public array $calls = [];

    public function offsetExists(mixed $offset): bool
    {
        $this->calls[] = 'exists';

        return false;
    }

    public function offsetGet(mixed $offset): mixed
    {
        $this->calls[] = 'get';

        return 'stored';
    }

    public function offsetSet(mixed $offset, mixed $value): void
    {
    }

    public function offsetUnset(mixed $offset): void
    {
    }
}

$bag = new Bag();
$value = $bag['key'] ?? 'fallback';

echo json_encode([$value, $bag->calls]);`)],options:[o('get-first','["stored",["get"]]','Null coalescing checks existence through offsetExists before reading an overloaded offset.','Treating ?? as an unconditional offsetGet followed by a null test.'),o('exists-only','["fallback",["exists"]]','The false existence result selects the fallback without calling offsetGet.'),o('both-fallback','["fallback",["exists","get"]]','offsetGet is skipped when offsetExists reports false.','Assuming PHP still reads a value after deciding the offset is absent.'),o('both-stored','["stored",["exists","get"]]','The false existence result prevents reading and returning stored.','Treating offsetExists as advisory rather than controlling the coalescing read.')],key:'exists-only',explanation:'For ArrayAccess, the null-coalescing existence check uses offsetExists. A false result selects the fallback without invoking offsetGet.',trace:'offsetExists appends exists and returns false. The fallback is chosen, leaving the call log with exactly one entry.',validation:{kind:'output',stdout:'["fallback",["exists"]]'},references:['https://www.php.net/manual/en/arrayaccess.offsetexists.php','https://www.php.net/manual/en/language.operators.comparison.php']}),
q({id:"PHP-E26-0219",format:"E",level:"M",topic:22,subtopic:"generator-send-implicit-start-and-return-channel",objective:"Trace send on an unstarted generator and distinguish yielded values from its return value.",reason:"Coordinate implicit startup, injection at the first yield, termination and the separate return channel.",prerequisites:["Generators","Generator::send","Generator::getReturn"],stem:"What JSON is printed? No current, next or rewind call occurs before send.",files:[{path:"main.php",kind:"complete-file",source:`<?php

function exchange(): Generator
{
    $received = yield 'ready';

    return strtoupper($received);
}

$generator = exchange();
$sentResult = $generator->send('go');

echo json_encode([$sentResult, $generator->valid(), $generator->getReturn()]);
`}],options:[o("first-yield","[\"ready\",true,null]","send first advances to the initial yield and sends into it; it does not merely report that initial yielded value.","Treating send on a new generator as current without value injection."),o("return-from-send","[\"GO\",false,\"GO\"]","send returns the next yielded value or null on termination, not the generator’s return value.","Conflating the yield channel with the final return channel."),o("auto-start","[null,false,\"GO\"]","send starts the generator, injects go at the yield, and runs to return; getReturn retrieves GO.",null),o("missing-start","An uncaught Error because the generator was not started","send is allowed on an unstarted generator and performs the startup itself.","Requiring an explicit current call before every send.")],key:"auto-start",explanation:"send on an unstarted generator first advances it to the initial yield, then supplies the sent value to that yield expression. This generator immediately returns afterward, so no next yielded value exists.",trace:"received becomes go. strtoupper produces GO as the generator return value. send returns null, valid is false, and getReturn yields GO.",validation:{"kind":"output","stdout":"[null,false,\"GO\"]"},references:["https://www.php.net/manual/en/generator.send.php","https://www.php.net/manual/en/generator.getreturn.php"],revision:2}),
q({id:'PHP-E26-0220',format:'E',level:'A',topic:22,subtopic:'yield-from-exception-delegation-and-recovery',objective:'Trace an exception injected through yield from into an inner generator that recovers by yielding.',reason:'Follow delegated suspension, injected exception handling, resumption and inner return propagation.',prerequisites:['Generator::throw (advanced)','yield from','catch and finally','Generator return values'],lessons:[22],coverageComplete:false,stem:'What exact text is printed? The exception is injected through the outer generator while it delegates to inner.',files:[file(`function inner(): Generator
{
    try {
        yield 'ready';
    } catch (RuntimeException $error) {
        yield 'recovered';
    } finally {
        echo 'F';
    }

    return 'done';
}

function outer(): Generator
{
    return yield from inner();
}

$generator = outer();
echo $generator->current(), '|';
echo $generator->throw(new RuntimeException('retry')), '|';
$generator->next();
echo '|', $generator->getReturn();`)],options:[o('delegated','ready|recovered|F|done','The injected exception reaches inner’s catch, which yields recovered; the next resume runs finally and returns done.'),o('finally-before-yield','ready|Frecovered||done','The catch suspends at its yield before control reaches finally.','Assuming entering catch immediately runs the associated finally before a yielded recovery value.'),o('outer-only','ready| followed by an uncaught RuntimeException','yield from forwards the injected exception into the delegated generator at its suspension point.','Assuming Generator::throw affects only the outer frame and cannot reach the inner catch.'),o('return-lost','ready|recovered|F|null','The return yield from expression forwards the delegated generator’s return value.','Assuming yield from transmits yielded values but always discards the inner return value.')],key:'delegated',explanation:'yield from delegates both yielded values and generator control operations. The inner generator catches the injected exception and suspends again at its recovery yield; cleanup waits until it resumes.',trace:'current returns ready. throw reaches inner’s catch and returns recovered. next resumes after that yield, prints F in finally, and propagates done through return yield from.',validation:{kind:'output',stdout:'ready|recovered|F|done'},references:['https://www.php.net/manual/en/generator.throw.php','https://www.php.net/manual/en/language.generators.syntax.php']}),
q({id:"PHP-E26-0221",format:"E",level:"M",topic:17,subtopic:"lazy-proxy-distinct-identity-shared-backing-state",objective:"Distinguish a lazy proxy’s identity from the backing object whose state it forwards.",reason:"Combine deferred factory initialization, proxy identity and writes through both object handles.",prerequisites:["PHP 8.4 lazy proxies","ReflectionClass::newLazyProxy","Strict object identity"],stem:"What JSON is printed after the first proxy write initializes it? The factory returns the already created backing object.",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Meter
{
    public int $value = 1;
}

$backing = new Meter();
$reflection = new ReflectionClass(Meter::class);
$proxy = $reflection->newLazyProxy(fn (Meter $unused): Meter => $backing);

$proxy->value = 7;
$backing->value++;

echo json_encode([$proxy === $backing, $proxy->value, $backing->value]);
`}],options:[o("same-object","[true,8,8]","The proxy forwards state but remains a distinct object identity from its backing instance.","Equating transparent state forwarding with strict object identity."),o("proxy-copy","[false,7,2]","Initialization does not copy the backing state into an independent ordinary object.","Treating a lazy proxy factory result as a one-time snapshot."),o("backing-only","[false,1,8]","Reading the initialized proxy forwards to the backing state rather than its original default.","Assuming proxy reads still use an independent default property slot."),o("forwarded-state","[false,8,8]","The identities differ, but both handles observe the backing value after the write and increment.",null)],key:"forwarded-state",explanation:"A lazy proxy initializes by obtaining a backing object. Its property operations forward to that object, while strict identity still distinguishes the proxy from the backing instance.",trace:"The first proxy write initializes and sets backing.value to 7. Incrementing backing makes it 8, which the proxy also reads. The === comparison remains false.",validation:{"kind":"output","stdout":"[false,8,8]"},references:["https://www.php.net/manual/en/reflectionclass.newlazyproxy.php"],revision:2}),
q({id:"PHP-E26-0222",format:"E",level:"M",topic:18,subtopic:"inherited-method-static-local-shared-storage",objective:"Track method-local static storage across inherited calls and a distinct overriding method.",reason:"Separate called-class identity from the identity of the method body that owns a static local.",prerequisites:["Static local variables","Method inheritance","PHP 8.1+ inherited static-local behavior"],lessons:[6,26,30],coverageComplete:false,stem:"What JSON is printed? Shared inherits the method unchanged; Separate declares a different method body.",files:[{path:"main.php",kind:"complete-file",source:`<?php

class BaseCounter
{
    public static function next(): int
    {
        static $value = 0;

        return ++$value;
    }
}

class Shared extends BaseCounter
{
}

class Separate extends BaseCounter
{
    public static function next(): int
    {
        static $value = 0;

        return ++$value;
    }
}

echo json_encode([
    BaseCounter::next(),
    Shared::next(),
    Separate::next(),
    BaseCounter::next(),
    Shared::next(),
]);
`}],options:[o("per-class","[1,1,1,2,2]","Shared uses the inherited method’s static local storage on these PHP versions.","Allocating a separate method-local static for each called class."),o("method-owned","[1,2,1,3,4]","BaseCounter and Shared execute one inherited method body; Separate owns a separate static local.",null),o("all-shared","[1,2,3,4,5]","Separate redeclares the method and therefore has its own local static.","Sharing same-named static locals across distinct overriding method bodies."),o("all-reset","[1,1,1,1,1]","Static locals persist between calls instead of resetting on every invocation.","Treating a static local like an ordinary initialized local variable.")],key:"method-owned",explanation:"On PHP 8.4 and 8.5, an inherited method that is not overridden shares its static local with the parent method. A separately declared override has a different static local.",trace:"BaseCounter and Shared advance the shared counter through 1, 2, 3 and 4. Separate advances its own counter from 0 to 1.",validation:{"kind":"output","stdout":"[1,2,1,3,4]"},references:["https://www.php.net/manual/en/language.variables.scope.php"],revision:2}),
q({id:'PHP-E26-0223',format:'E',level:'A',topic:21,subtopic:'serialization-cycle-and-enum-singleton-identity',objective:'Distinguish reconstructed object-graph identity from enum case identity after serialization.',reason:'Track an ordinary object, a self-reference and a singleton enum case through one round trip.',prerequisites:['PHP serialization (advanced)','Cyclic object graphs','Enum case singleton identity'],stem:'What JSON is printed? The payload is produced locally from the displayed object; no external serialized data is read.',files:[file(`enum State
{
    case Ready;
}

class Node
{
    public ?Node $next = null;
    public State $state = State::Ready;
}

$original = new Node();
$original->next = $original;
$restored = unserialize(serialize($original));

echo json_encode([
    $restored !== $original,
    $restored->next === $restored,
    $restored->state === $original->state,
]);`)],options:[o('enum-copied','[true,true,false]','An enum case is a singleton; unserialization restores the existing case rather than creating a new one.','Applying ordinary object reconstruction identity to enum cases.'),o('cycle-original','[true,false,true]','The serialized self-reference resolves inside the reconstructed graph, not back to the original object.','Assuming a serialized reference retains a live pointer into the original graph.'),o('identity-rules','[true,true,true]','Node is reconstructed, its self-loop points to the reconstruction, and State::Ready remains the same enum case.'),o('all-original','[false,true,true]','An ordinary Node is reconstructed as a new object rather than returning the original instance.','Treating serialization as an identity-preserving in-process alias operation.')],key:'identity-rules',explanation:'PHP serialization represents repeated object references within the serialized graph, allowing the self-loop to be restored. Ordinary objects are reconstructed, while enum cases resolve to their singleton case objects.',trace:'restored is a new Node. Its next reference targets that same new Node. Both state properties refer to State::Ready.',validation:{kind:'output',stdout:'[true,true,true]'},references:['https://www.php.net/manual/en/function.serialize.php','https://www.php.net/manual/en/language.enumerations.serialization.php']}),
q({id:"PHP-E26-0224",format:"E",level:"M",topic:21,subtopic:"reflection-raw-property-hook-bypass",objective:"Trace raw reflection writes that bypass set hooks while ordinary reads still invoke get hooks.",reason:"Separate backed storage from transformed access and identify which operations bypass invariants.",prerequisites:["PHP 8.4 property hooks","ReflectionProperty::setRawValue","ReflectionProperty::getRawValue"],stem:"What JSON is printed? The property is backed, and the reflected write intentionally uses the raw-value API.",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Gauge
{
    public int $level = 0 {
        get {
            return $this->level * 2;
        }
        set {
            $this->level = max(0, $value);
        }
    }
}

$gauge = new Gauge();
$gauge->level = 5;
$before = $gauge->level;
$property = new ReflectionProperty(Gauge::class, 'level');
$property->setRawValue($gauge, -3);

echo json_encode([$before, $gauge->level, $property->getRawValue($gauge)]);
`}],options:[o("raw-bypass","[10,-6,-3]","The ordinary read doubles stored 5; the raw write stores -3 without clamping, and only the ordinary later read doubles it.",null),o("setter-runs","[10,0,0]","setRawValue bypasses the set hook, so max(0, -3) is not applied.","Assuming reflection raw writes enforce the same normalization as ordinary assignment."),o("getter-bypassed-everywhere","[5,-3,-3]","Ordinary property reads still invoke the get hook and double the backed value.","Assuming raw reflection access disables hooks for all later accesses."),o("raw-read-transformed","[10,-6,-6]","getRawValue reads backed storage without invoking the get hook.","Treating a raw read as ordinary transformed property access.")],key:"raw-bypass",explanation:"Raw reflection APIs operate on backed storage without invoking the corresponding property hooks. Ordinary reads and writes retain their normal hook behavior.",trace:"Normal assignment stores max(0, 5) = 5, then a normal read returns 10. The raw write stores -3; a normal read returns -6 while the raw read returns -3.",validation:{"kind":"output","stdout":"[10,-6,-3]"},references:["https://www.php.net/manual/en/reflectionproperty.setrawvalue.php","https://www.php.net/manual/en/reflectionproperty.getrawvalue.php"],revision:2}),
q({id:'PHP-E26-0225',format:'E',level:'A',topic:7,subtopic:'dynamic-static-initializer-failure-retry',objective:'Trace a dynamic static initializer that throws before successfully initializing persistent local state.',reason:'Combine failed initialization, retried expression evaluation and later persistent mutation.',prerequisites:['PHP 8.3 dynamic static initializers (advanced)','Exceptions','Static local lifetime'],lessons:[5,6,22],coverageComplete:false,stem:'What JSON is printed after three calls? The seed function fails only on its first invocation.',files:[file(`$attempts = 0;

function seed(): int
{
    global $attempts;
    $attempts++;

    if ($attempts === 1) {
        throw new RuntimeException('not ready');
    }

    return 5;
}

function nextValue(): int
{
    static $value = seed();

    return ++$value;
}

$results = [];

for ($i = 0; $i < 3; $i++) {
    try {
        $results[] = nextValue();
    } catch (RuntimeException $error) {
        $results[] = 'retry';
    }
}

echo json_encode([$results, $attempts]);`)],options:[o('every-call','[["retry",6,6],3]','After the initializer succeeds, later calls reuse the static local rather than invoking seed again.','Treating a dynamic static initializer as an ordinary assignment on every call.'),o('failure-cached','[["retry","retry","retry"],1]','A thrown initializer does not cache the exception as the static variable’s value.','Assuming failed initialization permanently memoizes the failure.'),o('null-after-failure','[["retry",1,2],1]','The failed initializer is retried rather than leaving a successfully initialized null value.','Treating an aborted initializer as completed initialization to null.'),o('retry-then-persist','[["retry",6,7],2]','The first initializer throws, the second succeeds with 5, and the third call increments the retained 6 to 7.')],key:'retry-then-persist',explanation:'A static variable is not successfully initialized when evaluating its initializer throws. A later call retries initialization; once it succeeds, subsequent calls reuse the stored local value.',trace:'Call one invokes seed and records retry. Call two invokes seed again, initializes 5 and returns 6. Call three skips seed and returns 7. attempts is 2.',validation:{kind:'output',stdout:'[["retry",6,7],2]'},references:['https://www.php.net/manual/en/language.variables.scope.php','https://wiki.php.net/rfc/arbitrary_static_variable_initializers']}),
q({id:'PHP-E26-0226',format:'D',level:'F',topic:7,subtopic:'empty-max-input-contract',objective:'Handle an empty numeric collection before invoking max.',reason:'Apply one explicit empty-input rule while preserving ordinary maximum behavior.',prerequisites:['max','Empty arrays','Conditional expressions'],lessons:[3,4,5],coverageComplete:true,stem:'largest must return null for an empty list and otherwise return its greatest integer, including when all integers are negative. Which return expression satisfies the three displayed calls?',files:[file(`function largest(array $numbers): ?int
{
    return max($numbers);
}

try {
    echo json_encode([largest([]), largest([-7, -2]), largest([0])]);
} catch (ValueError $error) {
    echo 'ValueError';
}`)],options:[o('zero-default','max([0, ...$numbers])','Adding zero changes an all-negative maximum and returns zero for an empty input.','Treating zero as a neutral identity for every integer maximum.'),o('coalesce-after','max($numbers) ?? null','max throws on an empty array before null coalescing can choose a fallback.','Assuming ?? catches errors from evaluating its left operand.'),o('guard-empty','$numbers === [] ? null : max($numbers)','The empty input is handled before max, and nonempty lists retain their true maximum.'),o('falsy-fallback','$numbers === [] ? null : (max($numbers) ?: null)','The valid maximum zero becomes null under the truthiness fallback.','Treating a zero result as absence.')],key:'guard-empty',explanation:'max requires a nonempty array. Guard the input before calling it and preserve every valid integer result, including zero and negative maxima.',trace:'The empty list returns null, [-7, -2] returns -2, and [0] returns 0.',validation:{kind:'patch',marker:'max($numbers)',stdout:'[null,-2,0]'},references:['https://www.php.net/manual/en/function.max.php']}),
q({id:'PHP-E26-0227',format:'D',level:'F',topic:3,subtopic:'strict-value-whitelist-membership',objective:'Reject a numeric-looking string when an allowlist admits only listed integer values.',reason:'Distinguish type-sensitive membership from coercive equality.',prerequisites:['in_array','Strict comparison','String and integer types'],lessons:[1,4],coverageComplete:true,stem:'allowed must accept integer 0 but reject string "0" and integer 2. Which replacement enforces membership without coercing the input?',files:[file(`function allowed(mixed $value): bool
{
    return in_array($value, [0, 1]);
}

echo json_encode([allowed(0), allowed('0'), allowed(2)]);`)],options:[o('strict','in_array($value, [0, 1], true)','The strict flag compares both value and type.'),o('loose','in_array($value, [0, 1], false)','The string 0 loosely matches integer 0.','Assuming the default comparison already preserves scalar types.'),o('cast-first','in_array((int) $value, [0, 1], true)','Casting changes the forbidden string into an allowed integer before comparison.','Using normalization when the requirement is to reject a different input type.'),o('key-presence','array_key_exists($value, [0, 1])','The numeric string 0 is accepted as an integer array key.','Confusing value membership with key lookup and its key-conversion rules.')],key:'strict',explanation:'The third argument of in_array selects strict comparison. An explicit strict flag checks the original input type instead of normalizing it.',trace:'Integer 0 matches integer 0, string 0 does not, and integer 2 is absent.',validation:{kind:'patch',marker:'in_array($value, [0, 1])',stdout:'[true,false,false]'},references:['https://www.php.net/manual/en/function.in-array.php']}),
q({id:'PHP-E26-0228',format:'D',level:'F',topic:3,subtopic:'literal-prefix-removal-not-character-mask',objective:'Remove exactly one leading prefix without trimming a set of characters.',reason:'Distinguish a literal substring boundary from ltrim’s character-mask semantics.',prerequisites:['ltrim','str_starts_with','substr','strlen'],lessons:[2,3],coverageComplete:true,stem:'stripPrefix must remove one leading copy of the nonempty prefix and otherwise leave the value unchanged. Which replacement returns the stated results without removing interior occurrences?',files:[file(`function stripPrefix(string $value, string $prefix): string
{
    return ltrim($value, $prefix);
}

echo json_encode([
    stripPrefix('prepress', 'pre'),
    stripPrefix('xpre', 'pre'),
    stripPrefix('plain', 'pre'),
]);`)],options:[o('replace-all',"str_starts_with($value, $prefix) ? str_replace($prefix, '', $value) : $value",'For prepress, global replacement removes both copies of pre rather than only the leading copy.','Treating a guarded global replacement as removal of one occurrence.'),o('trim-mask','str_starts_with($value, $prefix) ? ltrim($value, $prefix) : $value','Even after verifying the prefix, ltrim consumes the whole leading run of p, r and e characters.','Assuming the prefix guard changes ltrim’s character-mask semantics.'),o('contains-check','str_contains($value, $prefix) ? substr($value, strlen($prefix)) : $value','xpre contains the prefix internally, so this incorrectly removes bytes from its beginning.','Checking substring presence instead of a leading-prefix boundary.'),o('prefix-check','str_starts_with($value, $prefix) ? substr($value, strlen($prefix)) : $value','The prefix is checked literally and exactly one prefix-length segment is removed.')],key:'prefix-check',explanation:'ltrim treats its second argument as a set of removable characters. Literal prefix removal requires checking the prefix and then slicing off exactly its byte length.',trace:'prepress becomes press after removing one pre. xpre and plain do not start with pre and remain unchanged.',validation:{kind:'patch',marker:'ltrim($value, $prefix)',stdout:'["press","xpre","plain"]'},references:['https://www.php.net/manual/en/function.ltrim.php','https://www.php.net/manual/en/function.str-starts-with.php']}),
q({id:'PHP-E26-0229',format:'D',level:'F',topic:7,subtopic:'implode-separator-argument-order',objective:'Use implode’s current signature to join text labels with the required separator.',reason:'Match argument roles to the supported PHP 8 signature and exact output format.',prerequisites:['implode','Arrays of strings','TypeError'],lessons:[4,5],coverageComplete:true,stem:'The result must be exactly Ada, Lin, using comma-space between the two names. Which replacement fixes this PHP 8 call?',files:[file(`$names = ['Ada', 'Lin'];

try {
    echo implode($names, ', ');
} catch (TypeError $error) {
    echo 'TypeError';
}`)],options:[o('no-separator',"implode('', $names)",'This joins the names without the required comma-space.','Correcting argument types while dropping the output separator.'),o('separator-first',"implode(', ', $names)",'The separator precedes the array in the supported two-argument signature.'),o('old-order',"implode($names, ', ')",'The historical reversed order is not supported on PHP 8.','Assuming the legacy argument order is still accepted.'),o('json','json_encode($names)','JSON adds brackets and quotes rather than producing the requested joined label.','Using structured serialization when a plain separator-joined string is required.')],key:'separator-first',explanation:'The two-argument implode signature takes the separator first and the array second. PHP 8 no longer accepts the legacy reversed order.',trace:'implode inserts comma-space between Ada and Lin without adding quotes or brackets.',validation:{kind:'patch',marker:"implode($names, ', ')",stdout:'Ada, Lin'},references:['https://www.php.net/manual/en/function.implode.php']}),
q({id:'PHP-E26-0230',format:'D',level:'F',topic:2,subtopic:'global-variable-explicit-function-binding',objective:'Bind a function’s local name to an existing global counter when that is the stated contract.',reason:'Distinguish local assignment from explicitly importing global storage.',prerequisites:['Function scope','global','Increment'],lessons:[6],coverageComplete:true,stem:'This legacy function is required to increment the displayed global counter. Replace only its first statement so two calls leave that counter at 12. Which statement supplies the missing binding?',files:[file(`$count = 10;

function countOne(): void
{
    $count = 0;
    $count++;
}

countOne();
countOne();

echo $count;`)],options:[o('copy-global',"$count = $GLOBALS['count'];",'This copies the global value into a local variable; incrementing that local does not update global storage.','Equating a value copy with importing the global variable binding.'),o('static-local','static $count = 10;','The static local persists between calls but is still separate from the displayed global counter.','Confusing persistent local lifetime with global scope.'),o('global-binding','global $count;','global binds the local name to the existing global variable, so both increments affect it.'),o('unset-local','unset($count);\n$count = 10;','The subsequent assignment creates a local variable, which remains separate from the global.','Assuming removing a local variable makes later assignment resolve to global scope.')],key:'global-binding',explanation:'Functions have their own variable scope. global explicitly binds the function’s local name to the global variable, allowing the following increment to update that storage.',trace:'The first call changes global count from 10 to 11 and the second changes it to 12. This answers the explicit legacy contract, not a recommendation to prefer globals for new designs.',validation:{kind:'patch',marker:'$count = 0;',stdout:'12'},references:['https://www.php.net/manual/en/language.variables.scope.php']}),
q({id:'PHP-E26-0231',format:'D',level:'M',topic:13,subtopic:'cookie-deletion-path-identity',objective:'Repair an expired deletion cookie so it targets the original cookie’s path.',reason:'Separate a cookie’s stored identity from attributes that only govern transport or script access.',prerequisites:['setcookie','Cookie path and domain','Expiration'],lessons:[18],coverageComplete:true,assumptions:['The browser stores one cookie named preference with Domain=example.test and Path=/account. An HTTPS response from example.test sends an expired cookie with the same name and domain but Path=/. No browser policy blocks this response. The original /account cookie remains.'],stem:'Which change to the expired setcookie response targets the cookie that the application intended to delete?',options:[o('earlier-expiry','Keep Path=/ and use an expiration date further in the past.','The deletion is already expired; an earlier date does not change which stored path it targets.','Treating expiration strength as a substitute for matching cookie identity.'),o('match-path','Change the expired cookie’s path option from / to /account.','The name, domain and path then match the stored cookie that must be expired.'),o('clear-httponly','Keep Path=/ and set the httponly option to false.','HttpOnly controls script access, not the path component of the cookie’s identity.','Assuming access flags determine which stored cookie a deletion replaces.'),o('clear-secure','Keep Path=/ and set the secure option to false.','Changing transport restrictions does not target the /account cookie instead of /.','Assuming transport flags override cookie path matching.')],key:'match-path',explanation:'A deletion response expires the cookie identified by its name, domain and path. Expiring the same name at a different path leaves the original cookie untouched.',trace:'The current response targets preference at /, while the stored cookie is preference at /account. Matching /account directs the expired replacement to the intended cookie.',validation:{kind:'document-review',rule:'RFC 6265 cookie storage/replacement uses matching name, domain and path; PHP setcookie exposes those attributes.',optionAudit:{'earlier-expiry':'Still targets the wrong path.','match-path':'Matches the stored cookie identity.','clear-httponly':'Changes access policy but not path identity.','clear-secure':'Changes transport policy but not path identity.'}},references:['https://www.php.net/manual/en/function.setcookie.php','https://www.rfc-editor.org/rfc/rfc6265#section-5.3']}),
q({id:'PHP-E26-0232',format:'D',level:'M',topic:13,subtopic:'session-destroy-current-memory-clear',objective:'Clear current-request session variables after destroying their persisted session data.',reason:'Distinguish session storage destruction, session identifier and the already populated superglobal.',prerequisites:['session_start','session_destroy','$_SESSION','Request-local state'],lessons:[19],coverageComplete:true,assumptions:['This CLI fixture disables cookies and uses an isolated writable temporary directory as its session store. All session operations succeed. The required observation concerns only current-process $_SESSION, not browser cookie deletion.'],stem:'After session_destroy, the program must print an empty session array. Replace the marked statement. Which operation clears the in-memory variables at this point?',files:[file(`session_save_path(__DIR__);
session_id('fixture-session');
session_start(['use_cookies' => false, 'cache_limiter' => '']);
$_SESSION['user'] = 'Ada';
session_destroy();

// Clear current-request session data here.

echo json_encode($_SESSION);`)],options:[o('unset-session','session_unset();','session_unset operates on an active session; the session has already been destroyed.','Assuming the active-session clearing helper still clears data after the session is inactive.'),o('empty-id',"session_id('');",'Changing the identifier does not empty the already populated $_SESSION array.','Equating the session identifier with the request’s session variable storage.'),o('cookie-only','unset($_COOKIE[session_name()]);','Changing the cookie superglobal does not change $_SESSION.','Treating the session cookie and loaded session data as the same storage.'),o('empty-array','$_SESSION = [];','Explicitly replacing the request-local array clears its remaining values.')],key:'empty-array',explanation:'session_destroy removes persisted session data but does not unset current-request session variables. After destruction, explicitly clearing $_SESSION removes the values that remain in memory.',trace:'The user entry remains after session_destroy. Assigning an empty array makes the final JSON []; the other operations address inactive session helpers, identifiers or cookies.',validation:{kind:'patch',marker:'// Clear current-request session data here.',stdout:'[]'},references:['https://www.php.net/manual/en/function.session-destroy.php','https://www.php.net/manual/en/function.session-unset.php']}),
q({id:'PHP-E26-0233',format:'D',level:'M',topic:12,subtopic:'multiple-upload-parallel-array-indexing',objective:'Select successful upload names using matching indices across PHP’s parallel upload metadata arrays.',reason:'Separate each file’s error code from its array index and retain metadata alignment.',prerequisites:['$_FILES multiple uploads','UPLOAD_ERR_OK','foreach key/value pairs'],lessons:[4,17],coverageComplete:true,stem:'acceptedNames must contain only the original names whose corresponding error is UPLOAD_ERR_OK. The supplied array is a fixed fixture; no file is opened or uploaded. Which expression repairs the name lookup?',files:[file(`$uploads = [
    'name' => ['first.txt', 'missing.txt', 'third.txt'],
    'error' => [UPLOAD_ERR_OK, UPLOAD_ERR_NO_FILE, UPLOAD_ERR_OK],
];
$acceptedNames = [];

foreach ($uploads['error'] as $index => $error) {
    if ($error === UPLOAD_ERR_OK) {
        $acceptedNames[] = $uploads['name'][0];
    }
}

echo json_encode($acceptedNames);`)],options:[o('matching-index',"$uploads['name'][$index]",'The index identifies the same file across the name and error arrays.'),o('error-index',"$uploads['name'][$error]",'Successful error codes are all zero, so both successes select first.txt.','Using an outcome code as though it identified the file’s position.'),o('accepted-count',"$uploads['name'][count($acceptedNames)]",'After skipping the failed upload, the number accepted no longer equals the current file index.','Using filtered output position to index the original unfiltered metadata.'),o('current-pointer',"current($uploads['name'])",'Nothing advances the name array’s internal pointer, so it keeps returning first.txt.','Assuming iteration over the error array advances the name array’s pointer.')],key:'matching-index',explanation:'Multiple upload metadata is arranged in parallel arrays under each metadata field. A file’s original index connects its name, error and other fields even when some uploads are skipped.',trace:'Indices 0 and 2 succeed and select first.txt and third.txt. The failed index 1 is skipped without renumbering the source arrays.',validation:{kind:'patch',marker:"$uploads['name'][0]",stdout:'["first.txt","third.txt"]'},references:['https://www.php.net/manual/en/features.file-upload.multiple.php']}),
q({id:'PHP-E26-0234',format:'D',level:'M',topic:10,subtopic:'csv-blank-line-versus-empty-field',objective:'Skip a physical blank CSV line while retaining an explicitly quoted empty field.',reason:'Distinguish fgetcsv’s blank-line representation from a valid one-field empty record and string zero.',prerequisites:['fgetcsv','Strict array comparison','Stream loops'],lessons:[4,20],coverageComplete:true,assumptions:['The CSV dialect uses comma, double-quote enclosure and an empty escape parameter. The fixture contains a zero field, a physical blank line and a quoted empty field, in that order.'],stem:'Keep the zero and quoted-empty records but skip the physical blank line. Which replacement for the if condition produces the required JSON?',files:[file(`$handle = fopen('php://memory', 'w+');
fwrite($handle, "0\\n\\n\\"\\"\\n");
rewind($handle);
$rows = [];

while (($row = fgetcsv($handle, null, ',', '"', '')) !== false) {
    if (empty($row[0])) {
        continue;
    }

    $rows[] = $row;
}

fclose($handle);
echo json_encode($rows);`)],options:[o('empty-field',"$row === ['']",'This skips the explicitly quoted empty record while retaining the physical blank line.','Equating an empty parsed string field with a physical blank line.'),o('empty-value','empty($row[0])','This also rejects the valid string zero and the quoted empty field.','Using PHP truthiness to classify physical CSV line structure.'),o('null-record','$row === [null]','fgetcsv represents a physical blank line as a one-element array containing null.'),o('false-record','$row === false','The while condition already excludes false; a blank line is an array, so it would remain.','Treating a blank line as the same sentinel as end of file.')],key:'null-record',explanation:'fgetcsv returns [null] for a blank line. A quoted empty field is an empty string, and a zero field is the string 0; both must remain under this contract.',trace:'The three parsed records are ["0"], [null] and [""]. Strict comparison to [null] removes only the middle record.',validation:{kind:'patch',marker:'empty($row[0])',stdout:'[["0"],[""]]'},references:['https://www.php.net/manual/en/function.fgetcsv.php']}),
q({id:'PHP-E26-0235',format:'D',level:'M',topic:10,subtopic:'nonblocking-empty-read-not-eof',objective:'Repair premature termination when a nonblocking stream has no data available yet.',reason:'Distinguish temporary lack of bytes from end-of-stream and avoid a busy retry loop.',prerequisites:['Nonblocking streams (unmapped curriculum)','fread','feof','Readiness notification'],lessons:[20],coverageComplete:false,assumptions:['A PHP event-loop client reads from an already-open nonblocking stream. fread returns an empty string, feof is false, and no read error occurred. More data may arrive later. The client has a working readiness notifier and a fixed deadline. It must preserve accumulated bytes and must not busy-spin.'],stem:'The client currently treats every empty fread result as completion and returns a truncated message. Which state transition repairs this case?',options:[o('complete','Return the accumulated bytes as a complete message because fread returned no bytes.','An empty nonblocking read with feof false does not establish stream completion.','Equating temporarily unavailable data with end-of-stream.'),o('spin','Retry fread immediately until it returns a nonempty string, without yielding to the event loop.','This can busy-spin while the peer has not sent more data.','Treating retry as sufficient without waiting for readiness.'),o('wait','Keep the partial buffer and wait for readability or the existing deadline before another read.','This preserves progress and distinguishes readiness from EOF without spinning.'),o('reconnect','Discard the partial buffer and reopen the connection before reading the remaining message.','Reconnecting loses the current stream position and may restart a different message exchange.','Treating temporary unavailability as a broken connection requiring a fresh stream.')],key:'wait',explanation:'A nonblocking read may return an empty string because no bytes are currently available. With EOF and errors explicitly excluded, the reader should keep its state and wait through its event-loop readiness mechanism.',trace:'The empty read supplies no new bytes but does not complete the message. Readiness resumes reading; the deadline supplies the separate timeout path.',validation:{kind:'document-review',rule:'Apply nonblocking stream behavior together with the explicit no-EOF/no-error and no-busy-spin requirements.',optionAudit:{complete:'Prematurely marks an incomplete stream as complete.',spin:'Violates the no-busy-spin requirement.',wait:'Retains partial state and uses readiness/deadline control.',reconnect:'Discards the existing stream’s progress without evidence of a broken connection.'}},references:['https://www.php.net/manual/en/function.stream-set-blocking.php','https://www.php.net/manual/en/function.fread.php']}),
q({id:'PHP-E26-0236',format:'D',level:'M',topic:3,subtopic:'regex-replacement-backreference-followed-digit',objective:'Disambiguate a capture backreference followed by a literal digit in preg_replace.',reason:'Separate PHP string concatenation from the regex replacement parser’s later group-number interpretation.',prerequisites:['preg_replace','Capture groups','Single-quoted strings'],stem:'The replacement must emit capture group 1 followed by the literal digit 0, producing ab0. Which replacement expression prevents the digit from becoming part of the backreference number?',files:[file(`$text = 'ab';

echo preg_replace('/(ab)/', '$10', $text);`)],options:[o('group-ten',"'$10'",'The replacement parser reads this as group 10, which does not exist in the pattern.','Assuming a backreference consumes only one digit.'),o('braced-group',"'${1}0'",'Braces delimit group 1, leaving the following 0 as literal output.'),o('php-concatenation',"'$1' . '0'",'PHP concatenates these strings into $10 before preg_replace parses the replacement.','Assuming PHP string-expression boundaries remain visible to the replacement parser.'),o('whole-match-one',"'$0' . '1'",'This becomes $01, which refers to group 1 rather than appending the required literal 0.','Swapping group-zero and literal-one roles instead of delimiting group 1.')],key:'braced-group',explanation:'The replacement string has its own backreference syntax. When a literal digit follows a capture reference, the braced form ${1} separates the reference from that digit.',trace:'The correct string is ${1}0, so group 1 contributes ab and the final character contributes 0. Concatenating PHP strings $1 and 0 still produces the ambiguous replacement $10.',validation:{kind:'patch',marker:"'$10'",stdout:'ab0'},references:['https://www.php.net/manual/en/function.preg-replace.php']}),
q({id:"PHP-E26-0237",format:"D",level:"M",topic:4,subtopic:"value-sort-preserve-business-identifiers",objective:"Sort values ascending while preserving their original integer identifiers.",reason:"Satisfy both ordering and key-retention requirements rather than checking sorted values alone.",prerequisites:["Array value sorting","Key preservation","Integer array keys","Comparison callbacks"],lessons:[4,8],coverageComplete:true,stem:"The integer keys are business identifiers, not list positions. Sort the scores ascending while retaining each identifier. Which complete sorting statement repairs the output?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$scores = [10 => 3, 20 => 1, 30 => 2];
usort($scores, fn (int $a, int $b): int => $a <=> $b);

echo json_encode($scores);
`}],options:[o("key-sort","ksort($scores);","This orders identifiers 10, 20, 30 rather than scores 1, 2, 3.","Sorting the business key instead of the associated score."),o("descending","arsort($scores);","Keys remain attached, but scores are ordered descending.","Meeting key preservation while reversing the requested value order."),o("reindex","usort($scores, fn (int $a, int $b): int => $a <=> $b);","usort discards the original keys and reindexes the sorted values.","Assuming a custom comparator implies preservation of original identifiers."),o("preserve","uasort($scores, fn (int $a, int $b): int => $a <=> $b);","uasort applies the value comparator and preserves the original key associations.",null)],key:"preserve",explanation:"usort sorts values but reindexes their keys. uasort performs a user-defined value sort while keeping key-to-value associations intact.",trace:"Score 1 with identifier 20 comes first, then score 2 with identifier 30, then score 3 with identifier 10.",validation:{"kind":"patch","marker":"usort($scores, fn (int $a, int $b): int => $a <=> $b);","stdout":"{\"20\":1,\"30\":2,\"10\":3}"},references:["https://www.php.net/manual/en/function.uasort.php","https://www.php.net/manual/en/function.usort.php"],revision:2}),
q({id:'PHP-E26-0238',format:'D',level:'M',topic:18,subtopic:'trait-conflict-resolution-and-secondary-alias',objective:'Resolve a trait method collision while retaining the excluded implementation under an alias.',reason:'Coordinate conflict selection with aliasing rather than treating aliases as conflict resolution.',prerequisites:['Traits','insteadof','Trait aliases'],lessons:[29],coverageComplete:true,stem:'Both traits define send. Use FirstTransport for send and retain SecondTransport as sendBackup. Which two adaptations replace the current alias and make the final JSON ["first","second"]?',files:[file(`trait FirstTransport
{
    public function send(): string
    {
        return 'first';
    }
}

trait SecondTransport
{
    public function send(): string
    {
        return 'second';
    }
}

class Sender
{
    use FirstTransport, SecondTransport {
        FirstTransport::send as sendBackup;
    }
}

$sender = new Sender();

echo json_encode([$sender->send(), $sender->sendBackup()]);`)],options:[o('select-and-alias',`FirstTransport::send insteadof SecondTransport;
SecondTransport::send as sendBackup;`,'insteadof selects the primary method, while as adds an alias for the other implementation.'),o('alias-only',`FirstTransport::send as sendPrimary;
SecondTransport::send as sendBackup;`,'Both original send methods still collide; aliases do not remove their original names.','Assuming assigning aliases automatically resolves an original method-name collision.'),o('reverse-selection',`SecondTransport::send insteadof FirstTransport;
FirstTransport::send as sendBackup;`,'This produces second as the primary and first as the backup, reversing the requirement.','Resolving the collision but selecting the wrong trait for each role.'),o('same-implementation',`FirstTransport::send insteadof SecondTransport;
FirstTransport::send as sendBackup;`,'Both exposed methods execute FirstTransport, so the second implementation is not retained.','Assuming an alias name alone implies the alternate trait implementation.')],key:'select-and-alias',explanation:'insteadof resolves the collision for the original method name. An as adaptation can still expose the excluded trait method under another name.',trace:'send resolves to FirstTransport::send and returns first. sendBackup aliases SecondTransport::send and returns second.',validation:{kind:'patch',marker:'FirstTransport::send as sendBackup;',stdout:'["first","second"]',errors:{'alias-only':'has not been applied'}},references:['https://www.php.net/manual/en/language.oop5.traits.php']}),
q({id:'PHP-E26-0239',format:'D',level:'M',topic:19,subtopic:'import-alias-class-string-resolution',objective:'Construct a class-name string using a lexical import alias rather than assuming runtime string rewriting.',reason:'Distinguish compile-time name resolution from dynamic class instantiation.',prerequisites:['Namespaces','use aliases','::class','Dynamic new'],lessons:[23,31],coverageComplete:true,stem:'The dynamic instantiation must create Vendor\\Widget using the imported LocalWidget alias. Which expression should replace the assigned class-name string?',files:[file(String.raw`namespace Vendor {
    class Widget
    {
    }
}

namespace App {
    use Vendor\Widget as LocalWidget;

    try {
        $class = 'LocalWidget';
        echo get_class(new $class());
    } catch (\Throwable $error) {
        echo get_class($error);
    }
}`)],options:[o('literal-alias',"'LocalWidget'",'A runtime string is not resolved through the file’s use alias table.','Assuming import aliases rewrite arbitrary class-name strings.'),o('current-namespace',String.raw`__NAMESPACE__ . '\LocalWidget'`,'This names App\\LocalWidget, a class that was never declared.','Treating an imported alias as a class declared in the importing namespace.'),o('resolved-class','LocalWidget::class','The class-name constant resolves the import alias to Vendor\\Widget at compile time.'),o('get-class-string','get_class(LocalWidget::class)','get_class expects an object here, while ::class already returns the needed string.','Applying object introspection to an already resolved class-name string.')],key:'resolved-class',explanation:'use aliases participate in lexical name resolution. The ::class expression produces the resolved class-name string; a quoted alias remains just that literal text at runtime.',trace:'LocalWidget::class resolves to Vendor\\Widget. Dynamic new uses that string to create the declared class, which get_class reports.',validation:{kind:'patch',marker:"'LocalWidget'",stdout:String.raw`Vendor\Widget`},references:['https://www.php.net/manual/en/language.namespaces.dynamic.php','https://www.php.net/manual/en/language.namespaces.importing.php']}),
q({id:'PHP-E26-0240',format:'D',level:'M',topic:21,subtopic:'backed-enum-invalid-input-fallback',objective:'Use tryFrom’s nullable result to apply a fallback for an unknown backing value.',reason:'Distinguish a throwing conversion from a nullable conversion before coalescing.',prerequisites:['String-backed enums','from versus tryFrom','Null coalescing'],stem:'Known backing values must retain their case; unknown strings must map to Draft. Which expression repairs the conversion so the two names are ["Live","Draft"]?',files:[file(`enum Mode: string
{
    case Live = 'live';
    case Draft = 'draft';
}

$names = [];

foreach (['live', 'unknown'] as $value) {
    try {
        $mode = Mode::from($value) ?? Mode::Draft;
        $names[] = $mode?->name;
    } catch (ValueError $error) {
        $names[] = 'ValueError';
    }
}

echo json_encode($names);`)],options:[o('throwing-coalesce','Mode::from($value) ?? Mode::Draft','from throws for unknown instead of returning null, so the fallback is not reached.','Assuming null coalescing handles a failed throwing conversion.'),o('nullable-fallback','Mode::tryFrom($value) ?? Mode::Draft','Known values return their case; null from an unknown value selects Draft.'),o('nullable-only','Mode::tryFrom($value)','Unknown values remain null, producing a null name rather than Draft.','Fixing the exception without implementing the required fallback.'),o('reversed-test','Mode::tryFrom($value) ? Mode::Draft : Mode::Live','A known case selects Draft while an unknown value selects Live, reversing the intended behavior.','Using the nullable result as a condition but assigning the branches backward.')],key:'nullable-fallback',explanation:'from reports an unknown backing value by throwing ValueError. tryFrom returns null instead, allowing ?? to supply the specified fallback without changing valid cases.',trace:'live resolves to Mode::Live. unknown yields null from tryFrom and is replaced by Mode::Draft.',validation:{kind:'patch',marker:'Mode::from($value) ?? Mode::Draft',stdout:'["Live","Draft"]'},references:['https://www.php.net/manual/en/language.enumerations.backed.php']}),
q({id:"PHP-E26-0241",format:"D",level:"M",topic:19,subtopic:"authoritative-classmap-runtime-generated-class",objective:"Restore PSR-4 discovery for classes generated after Composer’s optimized class map is built.",reason:"Distinguish optimized class-map acceleration from authoritative exclusion of unmapped classes.",prerequisites:["Composer 2 autoload optimization","PSR-4","Runtime code generation"],assumptions:["Composer 2 has an existing correct PSR-4 mapping for Generated\\. At build time an authoritative optimized class map is produced. Before a fresh PHP worker starts, a new Generated\\Report class file is created at its correct mapped path. It was absent during the build. No APCu autoloader is enabled and no lookup has yet occurred in that worker. The build pipeline must retain an optimized map while allowing these later files."],stem:"The fresh worker cannot autoload Report even though its PSR-4 path is correct. Which build configuration change addresses the reason for this failure?",options:[o("more-classmap","Keep classmap-authoritative enabled and add the Generated directory to the build-time classmap scan.","A build-time scan still cannot include a file that does not exist until after that scan.","Assuming broader build-time scanning discovers future files."),o("apcu-plus-authority","Keep classmap-authoritative enabled and enable APCu autoload caching.","APCu does not restore PSR-4 fallback that authoritative mode has disabled.","Treating a cache layer as an override for authoritative negative decisions."),o("optimized-fallback","Disable classmap-authoritative, retain optimize-autoloader, and rebuild the generated autoloader configuration.","The optimized map handles known classes while absent entries may fall back to the existing PSR-4 mapping.",null),o("repeat-authoritative-build","Run another authoritative dump during the same build stage, before Report is generated.","Repeating the scan before the file exists produces the same missing class-map entry.","Treating regeneration timing as irrelevant to class discovery.")],key:"optimized-fallback",explanation:"An optimized map can coexist with PSR-4 fallback. Authoritative mode instead declares classes absent from the map nonexistent, which conflicts with the stated post-build generation lifecycle.",trace:"Report is not in the build-time map. With authority disabled, its first lookup in the fresh worker falls back to the correct Generated mapping and finds the later file.",validation:{"kind":"document-review","rule":"Composer optimized class maps allow PSR-4 fallback for misses; authoritative maps do not. The file is explicitly created after every stated build-time scan.","optionAudit":{"more-classmap":"The future file remains absent from the scan.","apcu-plus-authority":"Caching does not reverse authoritative class-map semantics.","optimized-fallback":"Keeps level-one optimization and restores the required fallback.","repeat-authoritative-build":"The repeated scan still occurs too early."}},references:["https://getcomposer.org/doc/articles/autoloader-optimization.md"],revision:2}),
q({id:"PHP-E26-0242",format:"D",level:"M",topic:21,subtopic:"enum-jsonserializable-recursive-self-reference",objective:"Repair recursive JSON serialization of a backed enum that overrides its default representation.",reason:"Combine enum backing values, JsonSerializable precedence and recursion through the serializer’s own result.",prerequisites:["Backed enums","JsonSerializable","JSON_THROW_ON_ERROR","Recursive object graphs"],stem:"The enum must encode as an object containing its lowercase wire value: {\"state\":\"ready\"}. Which return expression in jsonSerialize removes the recursion and meets that exact contract?",files:[{path:"main.php",kind:"complete-file",source:`<?php

enum DeliveryState: string implements JsonSerializable
{
    case Ready = 'ready';

    public function jsonSerialize(): mixed
    {
        return ['state' => $this];
    }
}

try {
    echo json_encode(DeliveryState::Ready, JSON_THROW_ON_ERROR);
} catch (JsonException $error) {
    echo 'JsonException';
}
`}],options:[o("case-name","['state' => $this->name]","This encodes Ready rather than the required lowercase backing value ready.","Using the PHP case identifier as the external wire value."),o("lookup-case","['state' => self::from($this->value)]","from returns the same enum case, so the result still refers recursively to the object being serialized.","Assuming a backing-value lookup returns a scalar rather than an enum object."),o("self-value","['state' => $this]","JsonSerializable overrides default backed-enum encoding; returning the case inside its own representation creates recursion.","Assuming nested enum values bypass the enum’s custom serializer."),o("backing-scalar","['state' => $this->value]","The backing scalar completes the required object shape without reintroducing the enum instance.",null)],key:"backing-scalar",explanation:"A JsonSerializable implementation controls an enum’s JSON representation. Its returned structure must not recursively contain the same custom-serialized case; the backing scalar provides the required wire value.",trace:"The correct return value is an ordinary array with state mapped to ready. The encoder produces the required JSON object without invoking jsonSerialize recursively.",validation:{"kind":"patch","marker":"['state' => $this]","stdout":"{\"state\":\"ready\"}"},references:["https://www.php.net/manual/en/language.enumerations.serialization.php","https://www.php.net/manual/en/jsonserializable.jsonserialize.php"],revision:2}),
q({id:"PHP-E26-0243",format:"D",level:"M",topic:16,subtopic:"deferred-constraint-failed-commit-rollback",objective:"Restore a PDO SQLite connection to a clean transaction state after a deferred constraint rejects commit.",reason:"Distinguish a failed commit attempt from an ended transaction and remove its pending writes.",prerequisites:["PDO exception mode","SQLite deferred foreign keys","inTransaction","Rollback"],extensions:["PDO","pdo_sqlite"],assumptions:["SQLite supports foreign keys and the PRAGMA succeeds. No external connection or application data is used. The failed unit of work must be discarded, not repaired by creating a missing parent."],stem:"The insert succeeds initially, but commit fails because the foreign key is deferred. Which catch-body replacement leaves no transaction active and no child row, producing [false,0]?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec('PRAGMA foreign_keys = ON');
$pdo->exec('CREATE TABLE parents (id INTEGER PRIMARY KEY)');
$pdo->exec('CREATE TABLE children (
    id INTEGER PRIMARY KEY,
    parent_id INTEGER REFERENCES parents(id) DEFERRABLE INITIALLY DEFERRED
)');
$pdo->beginTransaction();
$pdo->exec('INSERT INTO children VALUES (1, 99)');

try {
    $pdo->commit();
} catch (PDOException $error) {
    // Discard the failed unit of work here.
}

echo json_encode([
    $pdo->inTransaction(),
    (int) $pdo->query('SELECT COUNT(*) FROM children')->fetchColumn(),
]);
`}],options:[o("rollback","if ($pdo->inTransaction()) {\n    $pdo->rollBack();\n}","The deferred failure leaves the transaction active; rollback removes its pending child insert.",null),o("wrong-state","if (!$pdo->inTransaction()) {\n    $pdo->rollBack();\n}","The transaction is still active, so the inverted guard skips the required rollback.","Assuming a failed commit means rollback should run only after the connection reports no active transaction."),o("retry-commit","$pdo->commit();","The missing parent still makes the deferred constraint fail.","Retrying a deterministic constraint failure without changing or discarding the unit of work."),o("delete-only","$pdo->exec('DELETE FROM children');","This removes the row inside the still-active transaction but does not end that transaction.","Equating undoing a visible row with completing the transaction boundary.")],key:"rollback",explanation:"For this SQLite deferred foreign-key failure, COMMIT is rejected while the transaction remains open. Discarding the unit of work requires rollback, not merely catching the PDO exception.",trace:"Before cleanup, the current transaction still contains the invalid child. rollback ends it and removes the insert; inTransaction is false and the child count is zero.",validation:{"kind":"patch","marker":"// Discard the failed unit of work here.","stdout":"[false,0]","errors":{"retry-commit":"FOREIGN KEY constraint failed"}},references:["https://www.sqlite.org/foreignkeys.html#fk_deferred","https://www.php.net/manual/en/pdo.intransaction.php"],revision:2}),
q({id:"PHP-E26-0244",format:"D",level:"M",topic:8,subtopic:"cloned-object-bound-closure-rebinding",objective:"Rebind a stored closure when cloning an object so the clone reads its own private state.",reason:"Track a shallow-copied closure’s bound this separately from the cloned owner’s identity.",prerequisites:["Object cloning","Stored closure binding","Private property scope","Stored arrow functions"],lessons:[7,9,23,25],coverageComplete:false,stem:"After cloning, each object’s stored reader must observe that object’s private value. Replace the clone-hook assignment so the final JSON is [1,2]. Which repair preserves the closure body and rebinds it to the clone?",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Reader
{
    private Closure $read;

    public function __construct(private int $value)
    {
        $this->read = fn (): int => $this->value;
    }

    public function __clone(): void
    {
        $this->read = clone $this->read;
    }

    public function set(int $value): void
    {
        $this->value = $value;
    }

    public function get(): int
    {
        return ($this->read)();
    }
}

$original = new Reader(1);
$copy = clone $original;
$copy->set(2);

echo json_encode([$original->get(), $copy->get()]);
`}],options:[o("clone-closure","$this->read = clone $this->read;","Cloning a Closure object preserves its existing bound object, which is the original Reader.","Assuming cloning the closure automatically rebinds this to the new owner."),o("rebind","$this->read = $this->read->bindTo($this, self::class);","The new closure binds this to the cloned Reader and retains access to Reader’s private property.",null),o("call-once","$this->read = $this->read->call($this);","call executes the closure and returns an integer, which cannot be stored in the Closure-typed property.","Confusing temporary invocation binding with creation of a rebound closure."),o("capture-original","$this->read = Closure::fromCallable($this->read);","Converting the already-callable closure does not substitute a new bound object.","Assuming callable normalization changes closure ownership.")],key:"rebind",explanation:"Object cloning is shallow, so the stored closure still has the original bound this. Cloning or normalizing the closure does not rebind it; bindTo creates the needed closure bound to the clone.",trace:"The original reader remains bound to original and reads 1. The clone hook creates a reader bound to copy, which reads its later value 2.",validation:{"kind":"patch","marker":"$this->read = clone $this->read;","stdout":"[1,2]","errors":{"call-once":"Cannot assign int to property Reader::$read of type Closure"}},references:["https://www.php.net/manual/en/closure.bindto.php","https://www.php.net/manual/en/language.oop5.cloning.php"],revision:2}),
q({id:"PHP-E26-0245",format:"D",level:"M",topic:15,subtopic:"pdo-class-constructor-before-hydration",objective:"Select PDO class hydration that constructs each row object before assigning database columns.",reason:"Coordinate constructor timing, per-row identity and preservation of fetched values.",prerequisites:["PDO::FETCH_CLASS","Hydration order","Object construction"],extensions:["PDO","pdo_sqlite"],stem:"Each row must create a fresh Row, run its constructor while quantity is still its default 0, and then assign the fetched quantity. Which setFetchMode statement yields [true,[10,20],[0,0]]?",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Row
{
    public static array $seen = [];
    public int $quantity = 0;

    public function __construct()
    {
        self::$seen[] = $this->quantity;
        $this->quantity = 99;
    }
}

$pdo = new PDO('sqlite::memory:');
$statement = $pdo->query('SELECT 10 AS quantity UNION ALL SELECT 20 AS quantity');
$statement->setFetchMode(PDO::FETCH_CLASS, Row::class);
$rows = [];

while (($row = $statement->fetch()) !== false) {
    $rows[] = $row;
}

echo json_encode([
    $rows[0] instanceof Row && $rows[1] instanceof Row && $rows[0] !== $rows[1],
    [$rows[0]->quantity, $rows[1]->quantity],
    Row::$seen,
]);
`}],options:[o("default-class","$statement->setFetchMode(PDO::FETCH_CLASS, Row::class);","Default FETCH_CLASS assigns fetched properties before invoking the constructor, so it sees 10 and 20 and overwrites both with 99.","Assuming class hydration always follows ordinary constructor-first ordering."),o("generic-objects","$statement->setFetchMode(PDO::FETCH_OBJ);","This produces stdClass objects without Row construction or its required initialization trace.","Treating object-shaped rows as equivalent to instances of the specified class."),o("reuse-instance","$statement->setFetchMode(PDO::FETCH_INTO, new Row());","Both fetches populate the same Row instance; it is constructed only once and both retained references end at quantity 20.","Using FETCH_INTO when distinct per-row objects are required."),o("props-late","$statement->setFetchMode(PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, Row::class);","The constructor runs before properties are assigned, and FETCH_CLASS creates a separate object for each row.",null)],key:"props-late",explanation:"PDO::FETCH_PROPS_LATE changes FETCH_CLASS ordering so construction occurs before assigning fetched properties. FETCH_INTO instead reuses an existing object and cannot satisfy per-row identity.",trace:"Each constructor records default quantity 0 and temporarily stores 99. Hydration then writes 10 or 20 into its distinct Row, leaving the constructor log [0,0].",validation:{"kind":"patch","marker":"$statement->setFetchMode(PDO::FETCH_CLASS, Row::class);","stdout":"[true,[10,20],[0,0]]"},references:["https://www.php.net/manual/en/pdostatement.fetch.php","https://www.php.net/manual/en/pdostatement.setfetchmode.php"],revision:2}),
q({id:'PHP-E26-0246',format:'R',level:'F',topic:6,subtopic:'early-loop-stop-retain-function-footer',objective:'Refactor a function-level early return into a loop-level stop while retaining accumulated work.',reason:'Distinguish the control-flow boundaries of return, break and continue.',prerequisites:['foreach','return','break','continue'],lessons:[3,5],coverageComplete:true,stem:'A review adds a requirement: stop at the first false flag, retain the count already accumulated, and always append finished afterward. Which replacement for the early return meets that requirement?',files:[file(`function countAllowed(array $flags, array &$log): int
{
    $count = 0;

    foreach ($flags as $flag) {
        if (!$flag) {
            return $count;
        }

        $count++;
    }

    $log[] = 'finished';

    return $count;
}

$log = [];
$result = countAllowed([true, false, true], $log);

echo json_encode([$result, $log]);`)],options:[o('skip-item','continue;','This skips only the false item and counts the later true item, producing 2.','Treating continue as termination of the whole loop.'),o('return-unchanged','return $count;','This exits the function before its logging footer.','Treating function return as a loop-only control operation.'),o('discard-count',`$count = 0;
break;`,'The footer runs, but resetting count discards the already accepted first item.','Interpreting the first false flag as invalidating prior work rather than stopping further work.'),o('stop-loop','break;','The loop stops with count 1; the footer runs before the final return.')],key:'stop-loop',explanation:'break exits the current loop while leaving the function active. The accumulated count remains intact and the function continues into its footer.',trace:'The first true flag makes count 1. The false flag breaks the loop, finished is appended, and the final return yields 1.',validation:{kind:'patch',marker:'            return $count;',candidates:{'skip-item':'            continue;','return-unchanged':'            return $count;','discard-count':'            $count = 0;\n            break;','stop-loop':'            break;'},stdout:'[1,["finished"]]'},references:['https://www.php.net/manual/en/control-structures.break.php','https://www.php.net/manual/en/function.return.php']}),
q({id:"PHP-E26-0247",format:"R",level:"M",topic:9,subtopic:"require-versus-include-missing-file-flow",objective:"Review how changing require to include changes missing-file control flow.",reason:"Separate handled warnings from the Error raised by a failed required inclusion.",prerequisites:["include","require","Error","Custom error handlers"],lessons:[21,22],coverageComplete:false,assumptions:["missing.php does not exist in the isolated directory. The displayed error handler handles warnings and produces no output; it does not convert them into exceptions."],stem:"A reviewer proposes replacing require with include because the same Error catch surrounds both. Which assessment matches these two paths?",files:[{path:"main.php",kind:"complete-file",source:`<?php

set_error_handler(static fn (): bool => true);

function loadMissing(bool $required): string
{
    try {
        if ($required) {
            require __DIR__ . '/missing.php';
        } else {
            include __DIR__ . '/missing.php';
        }

        return 'after';
    } catch (Error $error) {
        return 'caught';
    }
}

$result = [loadMissing(true), loadMissing(false)];
restore_error_handler();

echo json_encode($result);
`}],options:[o("same-caught","Both paths return caught because the handler converts every warning into Error.","The handler returns true; it does not throw. include does not produce the require-specific Error.","Assuming any custom error handler automatically converts warnings to exceptions."),o("different-flow","require returns caught; include returns after, so the replacement changes failure control flow.","Failed require raises Error, while handled include warnings allow execution to continue.",null),o("same-after","Both paths return after because the warning handler suppresses the require failure too.","Handling warnings does not prevent the additional Error raised by a failed require.","Treating warning handling as suppression of an engine Error."),o("reverse-flow","require returns after; include returns caught because include is the stricter operation.","The stricter missing-file behavior belongs to require.","Reversing the guarantees of the two inclusion constructs.")],key:"different-flow",explanation:"A missing include warns and evaluates to false, allowing later statements to run if execution is not otherwise interrupted. A failed require raises Error in addition to its warning behavior on these PHP versions.",trace:"The handler consumes the warnings in both paths. require reaches the Error catch; include reaches the after return.",validation:{"kind":"contract","stdout":"[\"caught\",\"after\"]","keyEvidence":"The same handler and catch surround both constructs, isolating their different failure behavior.","counterexamples":{"same-caught":"The include result is after; no warning-to-exception conversion exists.","same-after":"The require result is caught despite the warning handler.","reverse-flow":"Observed order is caught,after rather than after,caught."}},references:["https://www.php.net/manual/en/function.require.php","https://www.php.net/manual/en/function.include.php"],revision:2}),
q({id:'PHP-E26-0248',format:'R',level:'F',topic:11,subtopic:'http-safe-method-versus-idempotent-mutation',objective:'Distinguish a safe GET operation from an idempotent state-changing action.',reason:'Apply HTTP method semantics to a deliberate business mutation rather than infer safety from repeatability.',prerequisites:['HTTP GET','Safe methods','Idempotency'],lessons:[12],coverageComplete:true,assumptions:['A PHP route GET /archive?id=7 deliberately marks record 7 archived. Repeating it leaves the same archived state. The route is authenticated and performs no other operation. Archiving is the requested business effect, not incidental access logging.'],stem:'A review calls this GET route safe because repeated requests do not change the final state again. Which assessment is correct?',options:[o('repeat-safe','The route is safe because an idempotent effect also satisfies GET’s read-only semantics.','Idempotency concerns repeated effects; safety concerns whether the client requested a state change at all.','Equating idempotency with safety.'),o('query-decides','The route is safe because id appears in the query string instead of a request body.','Parameter placement does not make a deliberate archival mutation read-only.','Deriving method safety from where inputs are carried.'),o('unsafe-action','The action is idempotent but not safe; deliberate archiving does not fit GET’s safe semantics.','A repeated mutation can be idempotent while still being a requested state change.'),o('auth-decides','The route is safe because authentication limits who can request the archival change.','Authentication controls callers, not the semantic meaning of a safe method.','Treating authorized state changes as read-only operations.')],key:'unsafe-action',explanation:'Safe HTTP methods are intended for essentially read-only requested actions. Idempotency is a separate property: repeating an operation has the same intended effect as performing it once.',trace:'The first request deliberately changes record 7 from active to archived. Later identical requests add no further change, making the action idempotent but still unsafe in the HTTP sense.',validation:{kind:'document-review',rule:'RFC 9110 distinguishes safe methods from idempotent methods; GET is safe while a deliberate archival mutation is not.',optionAudit:{'repeat-safe':'Conflates two independent method properties.','query-decides':'Input placement does not determine safety.','unsafe-action':'Preserves the distinction between requested mutation and repeated effect.','auth-decides':'Authorization does not change method semantics.'}},references:['https://www.rfc-editor.org/rfc/rfc9110#section-9.2.1','https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2']}),
q({id:'PHP-E26-0249',format:'R',level:'F',topic:10,subtopic:'append-and-lock-independent-write-flags',objective:'Combine append behavior with an exclusive lock when reviewing file_put_contents flags.',reason:'Distinguish write placement from locking and combine independent bit flags correctly.',prerequisites:['file_put_contents','FILE_APPEND','LOCK_EX','Bitwise OR'],lessons:[2,20],coverageComplete:true,assumptions:['The owned local file is writable and all I/O succeeds. Cooperating writers use the same locking protocol. The requirement is to append without truncating and request LOCK_EX in this call; crash durability is outside this question.'],stem:'The current LOCK_EX call still replaces the old content. Which flags assignment preserves first, appends second, and requests the exclusive lock?',files:[file(`$path = __DIR__ . '/log.txt';
file_put_contents($path, "first\\n");
$flags = LOCK_EX;
file_put_contents($path, "second\\n", $flags);

echo json_encode([
    file_get_contents($path),
    ($flags & LOCK_EX) === LOCK_EX,
]);`)],options:[o('lock-only','$flags = LOCK_EX;','An exclusive lock does not itself request append behavior.','Assuming locking implies preservation of previous file contents.'),o('combined','$flags = FILE_APPEND | LOCK_EX;','Bitwise OR enables both independent flags.'),o('append-only','$flags = FILE_APPEND;','This preserves content but does not request the required exclusive lock.','Treating append mode as an implicit locking guarantee.'),o('intersection','$flags = FILE_APPEND & LOCK_EX;','The distinct flag bits have no shared bit, so their AND does not enable either behavior.','Using bitwise intersection to combine independent options.')],key:'combined',explanation:'FILE_APPEND controls whether new bytes are appended rather than replacing content. LOCK_EX separately requests an exclusive lock during the write. Bitwise OR enables both.',trace:'The resulting file contains first followed by second on separate lines, and the flags contain the LOCK_EX bit.',validation:{kind:'patch',marker:'$flags = LOCK_EX;',stdout:'["first\\nsecond\\n",true]'},references:['https://www.php.net/manual/en/function.file-put-contents.php']}),
q({id:'PHP-E26-0250',format:'R',level:'F',topic:4,subtopic:'missing-key-destructuring-warning-and-null',objective:'Review the diagnostic and assigned value when keyed destructuring requests a missing entry.',reason:'Separate a missing-key warning from the null value assigned after the handled warning.',prerequisites:['Keyed array destructuring','E_WARNING','Custom error handlers'],lessons:[4,21],coverageComplete:true,stem:'A review says keyed destructuring silently supplies null for a missing email field. Which assessment matches this program with its explicit warning handler?',files:[file(`$warnings = 0;
set_error_handler(function (int $severity) use (&$warnings): bool {
    if ($severity === E_WARNING) {
        $warnings++;
    }

    return true;
});

['email' => $email] = ['name' => 'Ada'];
restore_error_handler();

echo json_encode([$email, $warnings]);`)],options:[o('silent-null','email becomes null and the warning count stays zero.','The missing key produces E_WARNING even though the resulting assigned value is null.','Treating the assigned fallback value as evidence that no diagnostic occurred.'),o('positional-name','email becomes Ada and the warning count stays zero.','The email key is explicit; destructuring does not substitute the first available array entry.','Ignoring named destructuring keys and selecting by position.'),o('fatal-missing','An uncaught Error prevents email from being assigned.','The missing key produces a handled warning, not an uncaught Error in this example.','Treating every missing array key as a fatal engine failure.'),o('warn-and-null','email becomes null and the warning count becomes one.','PHP reports the missing key and then assigns null; the handler records the warning.')],key:'warn-and-null',explanation:'Requesting an undefined array key during destructuring raises a warning on PHP 8 and assigns null. The explicit handler handles that warning but does not make the original operation diagnostically silent.',trace:'The array has name but no email. The handler records one E_WARNING, email receives null, and the final JSON is [null,1].',validation:{kind:'contract',stdout:'[null,1]',keyEvidence:'The program observes both the assigned value and the warning count.',counterexamples:{'silent-null':'The observed warning count is one.','positional-name':'The assigned value is null, not Ada.','fatal-missing':'Execution reaches the final JSON after the handler handles the warning.'}},references:['https://www.php.net/manual/en/language.types.array.php','https://www.php.net/manual/en/function.set-error-handler.php']}),
q({id:'PHP-E26-0251',format:'R',level:'M',topic:17,subtopic:'unset-typed-property-magic-lazy-initialization',objective:'Review explicit unsetting of a typed property used to trigger magic lazy initialization.',reason:'Distinguish the ordinary uninitialized typed-property state from an explicitly unset property with a getter.',prerequisites:['Typed properties','unset','__get','Property initialization'],lessons:[23,24,25],coverageComplete:true,stem:'A reviewer removes unset from the constructor because the typed property already has no default. Which assessment describes the effect on the first read?',files:[file(`class LazyNumber
{
    public int $number;
    public int $loads = 0;

    public function __construct()
    {
        unset($this->number);
    }

    public function __get(string $name): mixed
    {
        if ($name !== 'number') {
            throw new LogicException('unknown property');
        }

        $this->loads++;
        $this->number = 42;

        return $this->number;
    }
}

$value = new LazyNumber();
echo json_encode([$value->number, $value->number, $value->loads]);`)],options:[o('equivalent','Removing unset preserves both reads and the one-time load because all uninitialized typed properties invoke __get.','An ordinary uninitialized typed property raises Error on read; explicit unsetting enables this magic-access pattern.','Equating the two property states for magic dispatch.'),o('repeat-load','Keeping unset makes every later read invoke __get, even after the getter assigns number.','The getter assigns the declared property, so the second read accesses its initialized value directly.','Assuming unsetting permanently redirects every access through magic.'),o('required-unset','Keeping unset permits the first magic load; removing it makes the first read fail before the lazy getter can initialize number.','The explicit unset is what establishes the magic lazy-access behavior; the getter’s assignment then initializes the property.'),o('dynamic-property','The getter creates an unrelated dynamic property, so the declared typed number remains unreadable.','Assigning the declared name initializes that declared property, not a new dynamic property.','Treating magic getter assignment as creation of separate storage.')],key:'required-unset',explanation:'An explicitly unset typed property can invoke __get, supporting lazy initialization. Simply leaving a declared typed property uninitialized does not provide the same access behavior.',trace:'With unset, the first read calls __get, stores 42 and increments loads. The second read uses the initialized property, giving [42,42,1]. Without unset, the initial typed-property read raises Error.',validation:{kind:'contract',stdout:'[42,42,1]',contrasts:[{name:'remove-unset',marker:'unset($this->number);',replacement:'',stdout:'',error:'Typed property LazyNumber::$number must not be accessed before initialization'}],keyEvidence:'The original witness proves one magic load followed by a direct read; the removal is separately checked as a reviewed contrast.',counterexamples:{equivalent:'Removing unset leaves an ordinary uninitialized typed property; a direct read raises Error.','repeat-load':'The observed loads count is one across two reads.','dynamic-property':'The declared property is initialized and both reads return 42.'}},references:['https://wiki.php.net/rfc/typed_properties_v2#overloaded_properties','https://www.php.net/manual/en/language.oop5.overloading.php']}),
q({id:'PHP-E26-0252',format:'R',level:'M',topic:10,subtopic:'json-throw-mode-does-not-reset-legacy-error-state',objective:'Review stale json_last_error state when JSON_THROW_ON_ERROR is used for a later operation.',reason:'Separate exception-based error reporting from the legacy process-local JSON error status.',prerequisites:['json_decode','JSON_THROW_ON_ERROR','json_last_error'],stem:'A review interprets the final true flag as evidence that the second decode failed. Which assessment matches this code?',files:[file(`json_decode('{broken');
$value = json_decode('{"ok":true}', true, 512, JSON_THROW_ON_ERROR);
$legacyStillReportsSyntax = json_last_error() === JSON_ERROR_SYNTAX;

echo json_encode([$value, $legacyStillReportsSyntax]);`)],options:[o('stale-status','The second decode succeeds; the true flag is the legacy error left by the first decode.','Throwing-mode operations do not update the legacy global JSON error state.'),o('second-failed','The second decode returns null because an earlier JSON error prevents later decoding.','The successful second result is the decoded ok field; earlier errors do not poison future decodes.','Treating the legacy error flag as a sticky execution-failure state.'),o('must-clear','The second decode throws JsonException until json_last_error is explicitly cleared.','JSON_THROW_ON_ERROR reacts to the current operation’s errors, not a prior legacy status.','Assuming stale status itself triggers a new exception.'),o('flag-false','The final flag must be false because every successful JSON operation resets legacy error state.','The second operation uses JSON_THROW_ON_ERROR, which leaves that legacy state unchanged.','Applying non-throwing API error-state behavior to throwing mode.')],key:'stale-status',explanation:'JSON_THROW_ON_ERROR reports errors through exceptions and does not alter json_last_error’s legacy state. Inspecting that state after a throwing-mode call can therefore report an unrelated earlier operation.',trace:'The first decode sets JSON_ERROR_SYNTAX. The second valid decode returns an array without changing that status. The saved boolean is true before the final output encoding.',validation:{kind:'contract',stdout:'[{"ok":true},true]',keyEvidence:'Both the successfully decoded data and the retained legacy flag are observed before output encoding.',counterexamples:{'second-failed':'The observed value contains ok=true, not null.','must-clear':'No JsonException interrupts the successful second decode.','flag-false':'The saved legacy-status comparison is true.'}},references:['https://www.php.net/manual/en/function.json-last-error.php','https://www.php.net/manual/en/json.constants.php']}),
q({id:'PHP-E26-0253',format:'R',level:'M',topic:20,subtopic:'restore-error-handler-stack-not-reinstall',objective:'Restore the previous error-handler stack state rather than push another copy of a prior handler.',reason:'Trace nested installations and a later caller restoration to expose stack imbalance.',prerequisites:['set_error_handler','restore_error_handler','Nested cleanup ownership'],lessons:[7,21],coverageComplete:true,stem:'A library is done with its inner handler. Its cleanup must restore the caller’s handler and leave the stack balanced for the caller’s later restoration. Which replacement produces ["inner","outer","base"]?',files:[file(`$log = [];
$base = function () use (&$log): bool {
    $log[] = 'base';

    return true;
};
$outer = function () use (&$log): bool {
    $log[] = 'outer';

    return true;
};
$inner = function () use (&$log): bool {
    $log[] = 'inner';

    return true;
};

set_error_handler($base);
set_error_handler($outer);
set_error_handler($inner);
trigger_error('inside library', E_USER_WARNING);

// Restore the library caller here.

trigger_error('inside caller', E_USER_WARNING);
restore_error_handler();
trigger_error('after caller', E_USER_WARNING);
restore_error_handler();
restore_error_handler();

echo json_encode($log);`)],options:[o('push-outer','set_error_handler($outer);','The next warning reaches outer, but the caller’s restore pops back to inner rather than base.','Equating reinstallation of the same callback with removal of the current stack frame.'),o('push-base','set_error_handler($base);','This skips the caller’s outer handler and also adds another stack entry.','Restoring the bottom handler instead of the immediate caller’s handler.'),o('keep-inner','set_error_handler($inner);','This installs another inner handler, so the caller’s warning is still handled by inner.','Assuming installing the current handler clears the nested registration.'),o('pop-inner','restore_error_handler();','This pops the library’s handler, allowing the caller’s later pop to reach base.')],key:'pop-inner',explanation:'set_error_handler installs a handler and changes the restoration stack. restore_error_handler removes the most recent installation, preserving the nesting expected by callers.',trace:'The first warning reaches inner. Popping once restores outer; the caller’s next pop restores base. Reinstalling outer would leave inner underneath it.',validation:{kind:'patch',marker:'// Restore the library caller here.',stdout:'["inner","outer","base"]'},references:['https://www.php.net/manual/en/function.restore-error-handler.php','https://www.php.net/manual/en/function.set-error-handler.php']}),
q({id:'PHP-E26-0254',format:'R',level:'M',topic:3,subtopic:'calendar-day-versus-elapsed-day-dst',objective:'Review calendar-day arithmetic separately from adding an elapsed 24-hour interval.',reason:'Account for a stated timezone offset change while comparing two date arithmetic APIs.',prerequisites:['DateTimeImmutable','DateInterval','Timezone offsets','Calendar versus elapsed duration'],assumptions:['Europe/Zurich changes from UTC+01:00 to UTC+02:00 during the displayed interval in March 2025. The starting local time is noon on the day before that change.'],stem:'A review claims that modify("+1 day") and add(new DateInterval("PT24H")) are interchangeable here. Which assessment matches the resulting local times?',files:[file(`$zone = new DateTimeZone('Europe/Zurich');
$start = new DateTimeImmutable('2025-03-29 12:00:00', $zone);
$calendar = $start->modify('+1 day');
$elapsed = $start->add(new DateInterval('PT24H'));

echo json_encode([
    $calendar->format('H:i'),
    $elapsed->format('H:i'),
    $calendar->getTimestamp() - $start->getTimestamp(),
    $elapsed->getTimestamp() - $start->getTimestamp(),
]);`)],options:[o('both-noon','Both results are 12:00 because every day interval preserves local clock time.','The elapsed PT24H interval crosses the offset increase and lands at 13:00.','Treating elapsed hours as a calendar-day adjustment.'),o('calendar-versus-elapsed','The calendar result is 12:00 after 23 elapsed hours; the PT24H result is 13:00 after 24 hours.','The offset increase shortens the local calendar day while the elapsed interval remains 86400 seconds.'),o('both-thirteen','Both results are 13:00 because +1 day always means exactly 86400 seconds.','The calendar-day modification preserves the local noon across this transition.','Treating every calendar day as a fixed elapsed duration.'),o('reversed','The calendar result is 13:00 and the PT24H result is 12:00.','This assigns elapsed-hour behavior to the calendar modification and vice versa.','Reversing the semantics of the two arithmetic operations.')],key:'calendar-versus-elapsed',explanation:'Calendar arithmetic follows local date transitions, which can span fewer or more than 24 elapsed hours. An elapsed 24-hour interval advances the instant by 86400 seconds even when the local offset changes.',trace:'Next-day noon is 23 elapsed hours later because the offset increases by one hour. Adding 24 elapsed hours therefore reaches 13:00 local time.',validation:{kind:'contract',stdout:'["12:00","13:00",82800,86400]',keyEvidence:'The witness observes both local clock values and timestamp differences.',counterexamples:{'both-noon':'The elapsed result is 13:00.','both-thirteen':'The calendar result is 12:00 with an 82800-second difference.','reversed':'The observed order is 12:00 then 13:00.'}},references:['https://www.php.net/manual/en/datetime.examples-arithmetic.php']}),
q({id:'PHP-E26-0255',format:'R',level:'M',topic:14,subtopic:'password-rehash-only-after-verification',objective:'Identify authentication bypass caused by replacing a stored hash before checking the supplied password.',reason:'Trace credential state mutation across a rehash policy check and subsequent verification.',prerequisites:['password_verify','password_needs_rehash','Password hash migration'],stem:'A review proposes upgrading old bcrypt cost settings during login using this code. The supplied password is wrong. Which assessment identifies the resulting authentication behavior?',files:[file(`$stored = password_hash('correct-password', PASSWORD_BCRYPT, ['cost' => 4]);
$before = $stored;
$input = 'wrong-password';

if (password_needs_rehash($stored, PASSWORD_BCRYPT, ['cost' => 5])) {
    $stored = password_hash($input, PASSWORD_BCRYPT, ['cost' => 5]);
}

$accepted = password_verify($input, $stored);

echo json_encode([$accepted, $stored === $before]);`)],options:[o('old-secret-preserved','The cost changes but the original password remains the verification secret, so the wrong password is rejected.','password_hash hashes the supplied input, not the secret associated with the previous stored hash.','Assuming rehashing a new input automatically preserves the old credential’s secret.'),o('snapshot-verification','The stored hash changes, but password_verify still compares against its earlier value and rejects the input.','The variable now contains the new hash when password_verify is called.','Assuming password verification uses an implicit snapshot of the old stored hash.'),o('salt-dependent','The wrong password is accepted only if the new random salt happens to match the old salt.','The new hash contains its own salt, and verification checks the input against that new hash.','Treating agreement with an earlier hash’s salt as necessary for verifying a newly generated hash.'),o('bypass','The wrong password is accepted when rehashing occurs; verify against the old hash before changing it.','The code first hashes the wrong input and then successfully verifies that same input against its new hash.')],key:'bypass',explanation:'A rehash policy check says the stored hash uses outdated parameters; it does not authenticate the supplied password. Replacing the hash first makes the later verification compare the candidate with a hash of itself.',trace:'The cost-4 hash needs a cost-5 upgrade. The code replaces it with a hash of wrong-password, then accepts wrong-password. Verifying first would reject it and leave the original hash intact.',validation:{kind:'contract',stdout:'[true,false]',contrasts:[{name:'verify-before-rehash',marker:`if (password_needs_rehash($stored, PASSWORD_BCRYPT, ['cost' => 5])) {
    $stored = password_hash($input, PASSWORD_BCRYPT, ['cost' => 5]);
}

$accepted = password_verify($input, $stored);`,replacement:`$accepted = password_verify($input, $stored);

if ($accepted && password_needs_rehash($stored, PASSWORD_BCRYPT, ['cost' => 5])) {
    $stored = password_hash($input, PASSWORD_BCRYPT, ['cost' => 5]);
}`,stdout:'[false,true]'}],keyEvidence:'The original accepts the wrong input and changes the hash; the repaired ordering rejects it and retains the old hash.',counterexamples:{'old-secret-preserved':'The replacement hashes input, not the previous secret.','snapshot-verification':'The call reads the reassigned stored variable.','salt-dependent':'Verification succeeds using the salt embedded in the newly generated hash.'}},references:['https://www.php.net/manual/en/function.password-needs-rehash.php','https://www.php.net/manual/en/function.password-verify.php']}),
q({id:"PHP-E26-0256",format:"R",level:"M",topic:14,subtopic:"hashing-unique-id-does-not-create-entropy",objective:"Review whether hashing a uniqueness-oriented identifier provides an unpredictable authentication token.",reason:"Distinguish output formatting and apparent complexity from cryptographically secure input entropy.",prerequisites:["uniqid","Hash functions","Entropy sources and encoding","Bearer-token unpredictability"],assumptions:["A PHP application uses md5(uniqid(\"\", true)) as a 32-character password-reset token. Tokens must be unpredictable to an attacker who can estimate request timing. The application already stores only a token hash and enforces expiration; this review concerns token generation alone."],stem:"Which review assessment addresses the missing generation guarantee?",options:[o("hash-hardness","MD5 makes the timed identifier unpredictable because reversing a hash is harder than reading a timestamp.","An attacker can enumerate plausible inputs and hash them; hashing does not create missing entropy.","Confusing one-way hashing with unpredictability of a small or predictable input space."),o("secure-source","Use bin2hex(random_bytes(16)); the random source supplies unpredictability and hex supplies the 32-character representation.","random_bytes is intended for cryptographically secure random bytes, unlike uniqid.",null),o("longer-hash","Replace MD5 with SHA-256 and truncate to 32 characters; changing the hash alone supplies the missing randomness.","A stronger hash still receives the same predictability-limited input.","Treating a stronger digest algorithm as a source of fresh entropy."),o("unique-guarantee","The more_entropy argument makes uniqid suitable because a sufficiently unique token must also be unpredictable.","Uniqueness and unpredictability are separate properties; uniqid is not a cryptographic random generator.","Equating low collision risk with resistance to prediction.")],key:"secure-source",explanation:"Hashing changes the representation of an input but cannot make a predictable input source cryptographically random. Token generation should obtain entropy from a cryptographically secure generator before encoding it for transport.",trace:"Sixteen random bytes contain 128 random bits; hex encoding represents them as 32 characters without adding or removing those bits. Expiration and hashed storage remain separate controls.",validation:{"kind":"document-review","rule":"PHP documents uniqid as unsuitable for cryptographic purposes and random_bytes as a cryptographically secure byte source.","optionAudit":{"hash-hardness":"Candidate inputs can be generated and hashed without inverting a digest.","secure-source":"Uses the documented cryptographic source and a reversible textual encoding.","longer-hash":"Digest choice does not improve input entropy.","unique-guarantee":"Uniqueness does not imply unpredictability."}},references:["https://www.php.net/manual/en/function.uniqid.php","https://www.php.net/manual/en/function.random-bytes.php"],revision:2}),
q({id:'PHP-E26-0257',format:'R',level:'M',topic:11,subtopic:'redirect-helper-return-does-not-stop-caller',objective:'Review request control flow when a redirect helper returns to a caller that continues rendering.',reason:'Separate response headers, a helper’s return boundary and termination of the request handler.',prerequisites:['header','Location response header','Function return','Request control flow'],lessons:[5,16],coverageComplete:true,assumptions:['No output precedes header. In an HTTP request the response can accept the Location header. The CLI validation observes only PHP control flow; the literal private-view is a harmless fixture string.'],stem:'A reviewer claims that returning from redirectToLogin prevents the caller from rendering afterward. Which assessment matches this program?',files:[file(`function redirectToLogin(): void
{
    header('Location: /login', true, 302);

    return;
}

redirectToLogin();
echo 'private-view';`)],options:[o('caller-continues','The caller still prints private-view; the helper’s return and Location header do not terminate the caller.','return exits only redirectToLogin, and header does not stop PHP execution.'),o('header-stops','The caller prints nothing because setting Location immediately ends PHP execution.','header changes response metadata; execution continues unless code explicitly stops it.','Treating a redirect header as an execution-control statement.'),o('return-stops','The caller prints nothing because any return after header ends the entire request.','A return inside a function returns to its caller regardless of previously set headers.','Expanding a helper’s return boundary to the whole request.'),o('body-replaced','The caller prints /login because Location replaces all later response-body output.','The header specifies a redirect target; it does not rewrite echo arguments.','Confusing a response header value with the response body.')],key:'caller-continues',explanation:'A redirect header and PHP execution are separate concerns. A helper return resumes its caller, so the request handler must explicitly stop rendering or the helper must deliberately terminate execution according to the application’s design.',trace:'header sets response metadata, return exits the helper, and the caller reaches echo. The local control-flow witness prints private-view.',validation:{kind:'contract',stdout:'private-view',keyEvidence:'The literal output proves that control reaches the caller’s echo after the helper returns; HTTP header delivery is not claimed by the CLI test.',counterexamples:{'header-stops':'The observed echo still runs.','return-stops':'The helper returns to the calling script.','body-replaced':'The observed body literal remains private-view rather than the Location target.'}},references:['https://www.php.net/manual/en/function.header.php','https://www.php.net/manual/en/function.return.php']}),
q({id:'PHP-E26-0258',format:'R',level:'M',topic:17,subtopic:'public-property-bypasses-magic-setter',objective:'Review whether __set enforces a range invariant on an accessible declared property.',reason:'Distinguish magic access interception from ordinary typed-property assignment.',prerequisites:['Public and private visibility','__set','Typed properties','Range validation'],lessons:[23,25],coverageComplete:true,stem:'A reviewer claims __set guarantees that age cannot become negative. Which assessment matches this assignment and the relevant dispatch rule?',files:[file(`class Person
{
    public int $age = 0;
    public int $setterCalls = 0;

    public function __set(string $name, mixed $value): void
    {
        $this->setterCalls++;

        if ($name !== 'age' || !is_int($value) || $value < 0) {
            throw new InvalidArgumentException('invalid age');
        }

        $this->age = $value;
    }

    public function getAge(): int
    {
        return $this->age;
    }
}

$person = new Person();
$caught = false;

try {
    $person->age = -1;
} catch (InvalidArgumentException $error) {
    $caught = true;
}

echo json_encode([$person->getAge(), $person->setterCalls, $caught]);`)],options:[o('always-before','__set runs before every property write, so it rejects -1 before changing age.','Accessible declared properties are written directly without invoking __set.','Treating __set as a universal before-write interceptor.'),o('type-fallback','__set is skipped here only because -1 already has type int; an invalid scalar type would be routed to __set.','Public typed-property type failures do not route writes through __set either.','Treating __set as a fallback for typed-property conversion errors.'),o('accessible-bypass','The public property is assigned directly, bypassing __set; its int type permits negative integers.','Visibility makes the property directly writable, so the custom range check never runs.'),o('always-after','__set runs after the write, so age becomes -1 and then the range exception is thrown.','The method is not invoked at all for this accessible property assignment.','Treating __set as an after-write observer rather than inaccessible-property handling.')],key:'accessible-bypass',explanation:'__set handles writes to inaccessible or nonexistent properties. It does not intercept ordinary assignments to a public declared property, and an int type alone has no nonnegative-range constraint.',trace:'The direct write stores -1, setterCalls remains 0 and no exception is caught. Making age private routes the outside write through __set, which rejects it before changing the stored value.',validation:{kind:'contract',stdout:'[-1,0,false]',contrasts:[{name:'private-property-guard',marker:'public int $age = 0;',replacement:'private int $age = 0;',stdout:'[0,1,true]'}],keyEvidence:'The public witness bypasses the setter; the private contrast invokes it and preserves the valid initial value.',counterexamples:{'always-before':'The public witness records zero setter calls.','type-fallback':'Magic setter dispatch depends on accessibility/existence, not recovery from type failure.','always-after':'No setter call or caught range exception occurs.'}},references:['https://www.php.net/manual/en/language.oop5.overloading.php','https://www.php.net/manual/en/language.oop5.properties.php']}),
q({id:"PHP-E26-0259",format:"R",level:"M",topic:11,subtopic:"filter-input-original-sapi-snapshot",objective:"Review whether filter_input validates a value subsequently assigned into $_GET by application code.",reason:"Separate the original SAPI input snapshot from mutations to a superglobal array.",prerequisites:["$_GET","filter_input","SAPI input handling","Validation of mutable input arrays"],lessons:[13],coverageComplete:false,assumptions:["In a web request, the original query string is page=1. Application code then assigns the string 2 to $_GET[\"page\"]. No other input mutation occurs. The review concerns PHP 8.4/8.5 filter_input behavior, not a CLI request simulation."],stem:"The next statement calls filter_input(INPUT_GET, \"page\", FILTER_VALIDATE_INT). A review claims it validates the newly assigned 2. Which assessment is correct?",options:[o("current-array","It returns integer 2 because filter_input reads the current contents of $_GET.","filter_input reads the original SAPI-provided value, not the later superglobal mutation.","Treating filter_input as shorthand for filter_var on the current array entry."),o("input-removed","It returns null because changing $_GET removes that field from the SAPI input snapshot.","Changing the userland array does not delete the original SAPI input value.","Assuming writes to a superglobal rewrite the original request snapshot."),o("untrusted-mutation","It returns false because filter_input detects that application code modified the field.","There is no mutation-detection rejection here; the original valid integer text is still available.","Assuming input filtering tracks a tamper flag on userland assignments."),o("original-snapshot","It returns integer 1; use filter_var on the current array entry to validate the assigned 2.","The API reads original input, whereas filter_var can validate the supplied current value.",null)],key:"original-snapshot",explanation:"filter_input accesses the original input supplied by the SAPI, independently of later changes to $_GET. To validate a normalized or replaced userland value, pass that value to filter_var.",trace:"The original request snapshot contains page=1. The array now contains page=2, but filter_input still parses the snapshot’s 1. This is document-backed web behavior and is not claimed as a CLI execution test.",validation:{"kind":"document-review","rule":"PHP documents filter_input as reading original raw input supplied by the SAPI before userland changes to superglobals.","optionAudit":{"current-array":"Confuses original request data with the current userland array.","input-removed":"Array assignment does not remove the original input.","untrusted-mutation":"No such mutation-detection failure is specified.","original-snapshot":"Uses the original 1; filter_var is the appropriate API for the current 2."}},references:["https://www.php.net/manual/en/function.filter-input.php"],revision:2}),
q({id:'PHP-E26-0260',format:'R',level:'M',topic:11,subtopic:'server-http-host-reset-link-origin-trust',objective:'Review the provenance of HTTP_HOST when constructing a security-sensitive absolute URL.',reason:'Distinguish server-created container variables from client-originated values stored inside that container.',prerequisites:['$_SERVER','HTTP Host header','Absolute URLs','Configured application origin'],lessons:[16],coverageComplete:false,assumptions:['A PHP endpoint builds emailed password-reset links using "https://" . $_SERVER["HTTP_HOST"] as the origin. The web-server configuration does not reject unrecognized Host values or replace the header with one canonical configured host. The application has a trusted configured public origin available.'],stem:'A review says the generated origin is trustworthy because the value is inside $_SERVER. Which assessment identifies the missing boundary?',options:[o('server-container','The value is trustworthy because PHP populated $_SERVER rather than reading a form field.','The container name does not make every entry server-authored; HTTP_HOST derives from the request Host header.','Treating all $_SERVER entries as trusted server configuration.'),o('host-provenance','HTTP_HOST reflects request input; use the trusted configured origin or an explicit allowed-origin mapping for reset links.','The origin needs application-level trust, not merely placement in the server superglobal.'),o('tls-guarantee','HTTPS makes every Host value received by the endpoint a verified application origin.','TLS does not supply the missing application Host allowlist in the stated server configuration.','Assuming transport security authorizes arbitrary request-host values for generated links.'),o('syntax-sufficient','A syntactically valid hostname is sufficient because hostname validation also proves application ownership.','Syntax validation does not prove that a host is an authorized public origin for this application.','Equating valid hostname syntax with origin authorization.')],key:'host-provenance',explanation:'$_SERVER contains both server information and values derived from request headers. HTTP_HOST is not a substitute for a configured trusted origin when generating security-sensitive absolute links.',trace:'An unrecognized Host can reach the endpoint under the stated configuration and be copied into a reset URL. A configured origin or explicit trusted mapping prevents that header from choosing the link destination.',validation:{kind:'document-review',rule:'PHP identifies HTTP_ entries as request-header-derived server variables; the scenario explicitly lacks a server Host allowlist.',optionAudit:{'server-container':'Provenance depends on the entry, not the superglobal name.','host-provenance':'Uses an application-trusted origin boundary.','tls-guarantee':'TLS does not provide the absent application Host policy.','syntax-sufficient':'A well-formed attacker-selected hostname remains unauthorized.'}},references:['https://www.php.net/manual/en/reserved.variables.server.php','https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html']}),
q({id:'PHP-E26-0261',format:'R',level:'A',topic:14,subtopic:'gcm-tag-length-protocol-validation',objective:'Review whether successful GCM decryption proves compliance with a protocol’s required authentication-tag length.',reason:'Separate cryptographic API acceptance from a stricter framing and tag-length contract.',prerequisites:['Authenticated encryption (advanced)','AES-GCM tags','openssl_decrypt','Binary byte lengths'],extensions:['openssl'],assumptions:['The application protocol requires exactly 16 tag bytes. This is one deterministic local test vector with fixed dummy key and IV, not a production nonce-generation example. The tag passed to decryption is intentionally shortened to its first 8 bytes.'],stem:'A review claims openssl_decrypt will reject every tag shorter than the protocol’s 16-byte requirement. Which assessment matches this fixture and the API boundary?',files:[file(`$key = str_repeat('K', 16);
$iv = str_repeat('I', 12);
$plaintext = 'fixture';
$tag = '';
$ciphertext = openssl_encrypt(
    $plaintext,
    'aes-128-gcm',
    $key,
    OPENSSL_RAW_DATA,
    $iv,
    $tag,
    '',
    16,
);
$shortTag = substr($tag, 0, 8);
$decoded = openssl_decrypt(
    $ciphertext,
    'aes-128-gcm',
    $key,
    OPENSSL_RAW_DATA,
    $iv,
    $shortTag,
);

echo json_encode([strlen($tag), strlen($shortTag), $decoded === $plaintext]);`)],options:[o('fixed-api-length','The API always requires 16 tag bytes, so decryption returns false before authenticating this input.','The API does not enforce the application’s original tag length; this matching shorter prefix can be accepted.','Assuming the API remembers or enforces the sender’s protocol tag length.'),o('ciphertext-length','The ciphertext encodes the tag length, so the shorter argument is automatically expanded back to 16 bytes.','The GCM tag is passed separately and the omitted bytes are not recovered from this ciphertext.','Assuming authentication metadata is embedded in the raw ciphertext automatically.'),o('caller-length-check','This shortened matching tag can decrypt successfully; the caller must enforce the required 16-byte length before decryption.','Successful API authentication with the supplied tag does not establish compliance with the stricter protocol length.'),o('ignored-tag','The plaintext is returned because OPENSSL_RAW_DATA disables authentication and ignores the supplied tag.','OPENSSL_RAW_DATA controls data encoding, not GCM authentication.','Confusing raw binary output with unauthenticated decryption.')],key:'caller-length-check',explanation:'The PHP API does not enforce that a supplied GCM tag has the same length as the tag originally generated. The application must validate its required tag length explicitly; raw-data mode does not disable authentication.',trace:'The original tag is 16 bytes. Its matching 8-byte prefix is accepted in this fixture, yielding [16,8,true]. A protocol requiring 16 bytes should reject that framing before calling decrypt.',validation:{kind:'contract',stdout:'[16,8,true]',keyEvidence:'The local test demonstrates acceptance of a matching short tag, while the documented API assigns length validation to the caller.',counterexamples:{'fixed-api-length':'The fixture successfully decrypts with 8 supplied tag bytes.','ciphertext-length':'strlen(shortTag) remains 8 and the omitted bytes are not supplied.','ignored-tag':'RAW_DATA affects encoding; GCM still verifies the supplied tag.'}},references:['https://www.php.net/manual/en/function.openssl-decrypt.php']}),
q({id:"PHP-E26-0262",format:"R",level:"M",topic:10,subtopic:"duplicate-json-members-parser-disagreement",objective:"Detect authorization-relevant disagreement between a first-match text scan and PHP JSON decoding.",reason:"Trace two interpretations of duplicate object members and distinguish syntax validation from unambiguous application semantics.",prerequisites:["JSON object member names","preg_match first match","JSON_THROW_ON_ERROR","Parser disagreement"],stem:"A review claims JSON_THROW_ON_ERROR makes this first-role gate agree with the later decoded role. Which assessment matches the fixed local payload?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$body = '{"role":"user","role":"admin"}';
preg_match('/"role":"([^"]+)"/', $body, $match);
$gateAllows = $match[1] === 'user';
$decoded = json_decode($body, true, 512, JSON_THROW_ON_ERROR);

echo json_encode([$gateAllows, $decoded['role']]);
`}],options:[o("throw-duplicates","Decoding throws JsonException because JSON_THROW_ON_ERROR rejects duplicate member names.","PHP accepts this JSON and keeps the later value; the flag does not add duplicate-name rejection.","Treating exception-based reporting as a stricter semantic uniqueness validator."),o("different-roles","The gate allows user while PHP decodes admin; the two stages disagree despite the throwing flag.","The regex finds the first role occurrence, while decoding retains the later value.",null),o("first-wins","Both stages use user because PHP keeps the first value of a duplicate member.","PHP’s decoded array contains the later admin value for role.","Assuming the decoder uses first-wins semantics matching the text scan."),o("regex-last","Both stages use admin because preg_match returns the last occurrence of the capture.","A single preg_match finds the first matching occurrence in this payload.","Confusing one match with collection of all matches followed by selection of the last.")],key:"different-roles",explanation:"Duplicate JSON member names are not rejected by JSON_THROW_ON_ERROR in PHP. A text scan and the JSON parser can therefore select different values; authorization should operate on one deliberately validated representation instead of an independent regex interpretation.",trace:"preg_match captures user and the gate allows it. json_decode stores the later role value admin, so the final JSON is [true,\"admin\"].",validation:{"kind":"contract","stdout":"[true,\"admin\"]","keyEvidence":"Both stages consume the identical fixed string and visibly select different role values.","counterexamples":{"throw-duplicates":"The program completes rather than throwing JsonException.","first-wins":"The decoded role is admin.","regex-last":"The gate is true because the regex captured user."}},references:["https://www.php.net/manual/en/function.json-decode.php","https://www.rfc-editor.org/rfc/rfc8259#section-4"],revision:2}),
q({id:"PHP-E26-0263",format:"R",level:"M",topic:16,subtopic:"fiber-shared-pdo-transaction-ownership",objective:"Review transaction isolation assumptions when two Fibers reuse the same PDO connection.",reason:"Follow connection-owned transaction state across cooperative suspension and another task’s write.",prerequisites:["Fibers","PDO connection lifetime","Transaction ownership","Rollback"],extensions:["PDO","pdo_sqlite"],stem:"A review claims B’s insert is independent because B never called beginTransaction. What does this shared-connection schedule imply?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE events (label TEXT)');

$a = new Fiber(function () use ($pdo): void {
    $pdo->beginTransaction();
    $pdo->exec("INSERT INTO events VALUES ('A')");
    Fiber::suspend();
    $pdo->rollBack();
});
$b = new Fiber(function () use ($pdo): void {
    $pdo->exec("INSERT INTO events VALUES ('B')");
});

$a->start();
$b->start();
$a->resume();

echo json_encode($pdo->query('SELECT label FROM events ORDER BY label')->fetchAll(PDO::FETCH_COLUMN));
`}],options:[o("fiber-local","B remains because each Fiber automatically receives a separate transaction on a shared PDO object.","Fiber scheduling does not create another database connection or transaction context.","Treating execution context as automatic database isolation."),o("implicit-commit","B remains because executing a statement outside B’s own beginTransaction call automatically commits it.","The connection is already inside A’s transaction when B executes.","Determining transaction membership from the current callback’s call history rather than connection state."),o("fiber-rejected","B’s start throws FiberError because PDO forbids access while another Fiber has an open transaction.","PDO does not enforce this per-Fiber ownership rule in the shown SQLite fixture.","Assuming the driver supplies a scheduler-aware ownership guard."),o("connection-owned","Neither row remains; B used the same connection’s active transaction and A rolled both writes back.","Transaction state belongs to the shared connection, so B’s insert joins the active transaction.",null)],key:"connection-owned",explanation:"A PDO transaction belongs to its connection, not to the Fiber that started it. Sharing that connection across overlapping task lifetimes allows one task’s writes to enter another task’s transaction.",trace:"A begins and inserts A, then suspends. B inserts using the still-active connection transaction. A resumes and rolls back both inserts, leaving an empty result.",validation:{"kind":"contract","stdout":"[]","keyEvidence":"The deterministic Fiber schedule leaves no rows after the shared connection rollback.","counterexamples":{"fiber-local":"Both Fibers close over the exact same PDO object.","implicit-commit":"The connection remains in the transaction until A rolls it back.","fiber-rejected":"Both starts and resume complete without FiberError."}},references:["https://www.php.net/manual/en/pdo.transactions.php","https://www.php.net/manual/en/language.fibers.php"],revision:2}),
q({id:"PHP-E26-0264",format:"R",level:"M",topic:14,subtopic:"decode-after-validation-reintroduces-traversal",objective:"Review a validation boundary that is invalidated by a second URL-decoding step.",reason:"Track representation changes across validation and later path consumption without performing filesystem access.",prerequisites:["rawurldecode","Percent encoding","Canonical representation","Path traversal validation"],assumptions:["The fixed string is a local test fixture. No path is opened. The application’s intended rule rejects any decoded parent-directory segment, and the shown downstream consumer performs the second decode before using a path."],stem:"A review says the parent-directory check is sufficient because it runs after decoding. Which assessment matches the two-stage pipeline?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$input = '%252e%252e%252fprivate.txt';
$checked = rawurldecode($input);
$passes = !str_contains($checked, '..');
$used = rawurldecode($checked);

echo json_encode([$passes, $used], JSON_UNESCAPED_SLASHES);
`}],options:[o("representation-gap","The check passes, but the later decode creates ../private.txt; validation must cover the representation actually consumed.","The first decode leaves encoded dot and slash sequences that the second decode turns into traversal syntax.",null),o("recursive-first","The first rawurldecode resolves every encoding layer, so the check already rejects the parent segment.","rawurldecode performs one decoding pass, not recursive decoding until no escapes remain.","Assuming one call fully canonicalizes arbitrarily repeated encoding."),o("idempotent-decode","The second rawurldecode cannot change the checked value because URL decoding is always idempotent.","The first pass can create new percent-encoded sequences, making a second pass change the string again.","Treating decoding as idempotent for all inputs."),o("slash-preserved","The check passes, but rawurldecode never decodes an encoded slash, so no parent-directory path appears.","rawurldecode decodes %2f to slash along with the encoded dots.","Assuming path separators are excluded from ordinary raw URL decoding.")],key:"representation-gap",explanation:"Validating one representation does not validate a different representation created afterward. The decoding policy and the consumer must agree, and traversal checks must apply to the exact form used for path lookup.",trace:"The first pass produces %2e%2e%2fprivate.txt, which contains no literal double dot. The second pass produces ../private.txt, after the check has already passed.",validation:{"kind":"contract","stdout":"[true,\"../private.txt\"]","keyEvidence":"The fixture observes both the validation result and the later decoded representation without accessing any file.","counterexamples":{"recursive-first":"passes is true after only one decoding pass.","idempotent-decode":"The checked and used representations differ.","slash-preserved":"The final string contains a literal slash following the parent segment."}},references:["https://www.php.net/manual/en/function.rawurldecode.php","https://owasp.org/www-community/Double_Encoding"],revision:2}),
q({id:'PHP-E26-0265',format:'R',level:'A',topic:22,subtopic:'by-reference-generator-yield-contract',objective:'Review the declaration required for a generator to expose references during foreach iteration.',reason:'Coordinate a referenced source array, by-reference generator yields and the consumer’s reference iteration.',prerequisites:['By-reference generators (advanced)','Reference parameters','foreach by reference','Generator return type'],lessons:[4,5],coverageComplete:false,stem:'A reviewer proposes removing the ampersand before slots because the function returns a Generator object. Which assessment matches the existing code and that proposed change?',files:[file(`function &slots(array &$values): Generator
{
    foreach ($values as &$value) {
        yield $value;
    }
}

$values = [2, 3];
$generator = slots($values);

foreach ($generator as &$slot) {
    $slot *= 2;
}

unset($slot);
echo json_encode($values);`)],options:[o('object-reference-only','The ampersand affects only the Generator object returned, so the yielded integers stay copies and values remains unchanged.','For a generator declaration, the ampersand enables reference yielding; the consumer changes the referenced source elements.','Applying ordinary return-reference intuition without the generator’s yield contract.'),o('silent-copy-fallback','The current code doubles values; removing the declaration ampersand silently changes the foreach to value copies.','PHP rejects by-reference iteration of a generator not declared to yield by reference; it does not silently downgrade the loop.','Assuming incompatible iteration mode is converted into a copy operation.'),o('required-yield-reference','The current code doubles values; removing that ampersand makes this by-reference foreach throw an exception.','The declaration enables reference yielding, which the consumer explicitly requires.'),o('automatic-object-support','The current code doubles values and remains equivalent without the ampersand because all Generator objects allow reference iteration.','Generator reference iteration depends on the generator function’s declaration.','Assuming the common Generator object type alone guarantees reference-yield capability.')],key:'required-yield-reference',explanation:'A generator function declared with & can yield references. The consumer’s by-reference foreach requires that capability; returning a Generator object does not provide it automatically.',trace:'The source parameter refers to values, the producer loops over its elements by reference, and the consumer doubles those yielded references to [4,6]. Removing the function’s & causes reference iteration to fail.',validation:{kind:'contract',stdout:'[4,6]',contrasts:[{name:'remove-reference-yield-declaration',marker:'function &slots(',replacement:'function slots(',stdout:'',error:'You can only iterate a generator by-reference if it declared that it yields by-reference'}],keyEvidence:'The original mutates the source array; the declaration-removal contrast produces the documented reference-iteration exception.',counterexamples:{'object-reference-only':'The observed source array changes to [4,6].','silent-copy-fallback':'The contrast throws instead of copying silently.','automatic-object-support':'The same Generator return type remains, yet the contrast fails without &.'}},references:['https://www.php.net/manual/en/language.generators.syntax.php#control-structures.yield.byref']}),
q({id:'PHP-E26-0266',format:'I',level:'F',topic:7,subtopic:'named-argument-skip-defaulted-parameters',objective:'Set a later optional parameter while leaving earlier optional parameters at their declared defaults.',reason:'Use named binding rather than positional placement or placeholder values.',prerequisites:['Named arguments','Default parameters','strict_types'],lessons:[1,5],coverageComplete:true,stem:'The call must enable urgent while keeping target and retries at their declared defaults, producing ["all",3,true]. Which call should replace the current one?',files:[file(`declare(strict_types=1);

function settings(string $target = 'all', int $retries = 3, bool $urgent = false): array
{
    return [$target, $retries, $urgent];
}

try {
    echo json_encode(settings());
} catch (TypeError $error) {
    echo 'TypeError';
}`)],options:[o('first-position','settings(true)','The first positional argument binds to target, which requires a string under strict types.','Assuming a boolean argument automatically selects the boolean parameter.'),o('zero-placeholder',"settings('all', 0, true)",'Zero explicitly replaces the retries default; it does not mean skip this parameter.','Using a zero placeholder to request a default value.'),o('named-later','settings(urgent: true)','The named argument binds directly to urgent and omitted earlier parameters retain their defaults.'),o('second-position',"settings('all', true)",'The boolean is supplied for retries, not urgent, and is rejected by the strict integer parameter.','Skipping an optional positional parameter based on the argument’s type.')],key:'named-later',explanation:'Named arguments bind by parameter name, allowing earlier optional parameters to be omitted. Positional arguments cannot skip a parameter merely because another parameter has a matching type.',trace:'urgent is explicitly true. target and retries are omitted, so their defaults all and 3 are used.',validation:{kind:'patch',marker:'json_encode(settings())',candidates:{'first-position':'json_encode(settings(true))','zero-placeholder':"json_encode(settings('all', 0, true))",'named-later':'json_encode(settings(urgent: true))','second-position':"json_encode(settings('all', true))"},stdout:'["all",3,true]'},references:['https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments']}),
q({id:"PHP-E26-0267",format:"I",level:"F",topic:4,subtopic:"first-array-key-independent-of-pointer",objective:"Retrieve the first key without confusing it with a value or the current internal pointer position.",reason:"Choose a key API that handles an empty array with the required null sentinel.",prerequisites:["Array keys","Internal pointer","Iteration order","Empty arrays"],lessons:[4],coverageComplete:true,stem:"firstId must return the first key in iteration order, regardless of the internal pointer, and null for an empty array. Which expression meets all three displayed cases?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function firstId(array $items): mixed
{
    return key($items);
}

$jobs = [7 => 'first', 2 => 'second'];
end($jobs);

echo json_encode([firstId($jobs), firstId([]), firstId(['alpha' => false])]);
`}],options:[o("first-key","array_key_first($items)","This returns the first key without depending on the pointer and returns null for an empty array.",null),o("current-key","key($items)","The jobs pointer was moved to key 2, so current key is not the first key.","Equating the first array entry with the internal pointer’s current position."),o("first-value","reset($items)","reset returns the first value, not its key; it also uses false for an empty array.","Using a pointer-reset function as a key lookup."),o("search-first-value","array_search(reset($items), $items, true)","The empty array produces false from array_search rather than the required null.","Building a key lookup through a value search without handling its empty-result sentinel.")],key:"first-key",explanation:"array_key_first reports the first key directly and does not consult or change the internal pointer. Its empty-array result is null.",trace:"The first jobs key is 7 despite the pointer being at 2. The empty array yields null, and the false-valued entry still has key alpha.",validation:{"kind":"patch","marker":"key($items)","stdout":"[7,null,\"alpha\"]"},references:["https://www.php.net/manual/en/function.array-key-first.php","https://www.php.net/manual/en/function.key.php"],revision:2}),
q({id:'PHP-E26-0268',format:'I',level:'F',topic:4,subtopic:'tail-slice-preserve-keys-and-source',objective:'Select the last entries while preserving their keys and leaving the source array intact.',reason:'Combine a negative slice offset with explicit key preservation and a nonmutating operation.',prerequisites:['array_slice','array_splice','Negative offsets','Array keys'],lessons:[4],coverageComplete:true,stem:'tail must contain the last two entries with keys 4 and 7, and items must keep all three entries. Which expression should replace the current slice?',files:[file(`$items = [9 => 'a', 4 => 'b', 7 => 'c'];
$tail = array_slice($items, 2);

echo json_encode([$tail, $items]);`)],options:[o('positive-offset','array_slice($items, 2, null, true)','Offset 2 starts at the third entry, returning only c.','Reading a positive offset as a count measured backward from the end.'),o('splice-tail','array_splice($items, -2)','This removes the tail from items and renumbers the returned numeric keys.','Using a destructive extraction operation for a nonmutating selection.'),o('reindexed-tail','array_slice($items, -2)','The last two values are selected, but their numeric keys are reindexed.','Assuming slicing preserves integer keys without its preserve_keys argument.'),o('preserved-tail','array_slice($items, -2, null, true)','The negative offset selects the last two entries, true preserves keys, and slicing leaves items unchanged.')],key:'preserved-tail',explanation:'array_slice selects entries without changing its input. A negative offset counts from the end, and preserve_keys=true retains numeric identifiers.',trace:'The result tail is {4:b,7:c}; the source still contains keys 9,4,7 and their original values.',validation:{kind:'patch',marker:'array_slice($items, 2)',stdout:'[{"4":"b","7":"c"},{"9":"a","4":"b","7":"c"}]'},references:['https://www.php.net/manual/en/function.array-slice.php','https://www.php.net/manual/en/function.array-splice.php']}),
q({id:'PHP-E26-0269',format:'I',level:'F',topic:5,subtopic:'clear-bit-idempotently-with-complement',objective:'Clear one permission bit without toggling it on when it was already absent.',reason:'Choose a bit operation that preserves unrelated flags and is idempotent.',prerequisites:['Bitwise AND','Bitwise complement','Bit masks'],lessons:[2],coverageComplete:true,stem:'disableWrite must remove WRITE while preserving all other bits. It must also leave a mask unchanged when WRITE is already absent. Which expression satisfies both calls?',files:[file(`const WRITE = 2;

function disableWrite(int $flags): int
{
    return $flags ^ WRITE;
}

echo json_encode([disableWrite(7), disableWrite(5)]);`)],options:[o('toggle','$flags ^ WRITE','XOR clears a present bit but sets an absent bit, changing 5 into 7.','Using a toggle when the operation must always clear a bit.'),o('clear','$flags & ~WRITE','Complementing the target mask and ANDing preserves every other bit while clearing WRITE.'),o('set','$flags | WRITE','OR enables WRITE, including when it was absent.','Using a set operation for a removal requirement.'),o('retain-only','$flags & WRITE','This keeps only WRITE and discards the unrelated flags.','Confusing extracting a bit with removing that bit.')],key:'clear',explanation:'AND with the complement of WRITE forces that bit to zero and leaves other bits unchanged. Applying it again has no additional effect.',trace:'7 has WRITE set and becomes 5. 5 already lacks WRITE and remains 5.',validation:{kind:'patch',marker:'$flags ^ WRITE',stdout:'[5,5]'},references:['https://www.php.net/manual/en/language.operators.bitwise.php']}),
q({id:'PHP-E26-0270',format:'I',level:'F',topic:6,subtopic:'match-true-range-predicates',objective:'Select the match subject appropriate for boolean range conditions.',reason:'Use match identity comparisons with conditions that evaluate to booleans rather than age values.',prerequisites:['match','Boolean comparisons','Strict identity'],lessons:[1,3],coverageComplete:true,stem:'group must classify nonnegative ages as minor below 18, adult below 65, and senior otherwise. Which subject should replace age in match for the displayed range predicates?',files:[file(`function group(int $age): string
{
    return match ($age) {
        $age < 18 => 'minor',
        $age < 65 => 'adult',
        default => 'senior',
    };
}

echo json_encode([group(0), group(18), group(65)]);`)],options:[o('age','$age','An integer age does not strictly match boolean arm conditions.','Assuming match performs loose comparison between an integer subject and boolean conditions.'),o('one','1','Integer 1 is not identical to boolean true.','Treating a truthy integer as interchangeable with true in match.'),o('boolean-age','(bool) $age','Age zero becomes false and can match a false condition rather than the first true range predicate.','Deriving the desired predicate truth value from the input’s truthiness.'),o('true','true','The first condition that evaluates to true selects the intended range.')],key:'true',explanation:'These arm conditions return booleans. Matching the literal true selects the first satisfied predicate; matching an integer or the input’s own truthiness does not implement that rule.',trace:'At age 0 the first predicate is true; at 18 only the second is true; at 65 neither is true and default selects senior.',validation:{kind:'patch',marker:'match ($age)',candidates:{age:'match ($age)',one:'match (1)','boolean-age':'match ((bool) $age)',true:'match (true)'},stdout:'["minor","adult","senior"]'},references:['https://www.php.net/manual/en/control-structures.match.php']}),
q({id:'PHP-E26-0271',format:'I',level:'F',topic:8,subtopic:'first-class-callable-creation-versus-invocation',objective:'Create a Closure for a named function without invoking that function immediately.',reason:'Distinguish first-class callable syntax from argument unpacking, ordinary invocation and a callable string.',prerequisites:['Closure','First-class callable syntax','Argument unpacking'],lessons:[5,8],coverageComplete:true,stem:'build must return a Closure that uppercases a later input. Which return expression supplies it? The three dots in the options are literal PHP syntax, not omitted code.',files:[file(`function build(): Closure
{
    return strtoupper(...['php']);
}

try {
    $callback = build();
    echo $callback('php');
} catch (Throwable $error) {
    echo get_class($error);
}`)],options:[o('callable-syntax','strtoupper(...)','The standalone ellipsis creates a first-class callable Closure without invoking strtoupper.'),o('callable-string',"'strtoupper'",'The string can be callable in suitable contexts but is not a Closure object satisfying this return type.','Equating every callable representation with the concrete Closure type.'),o('empty-call','strtoupper()','This invokes the function immediately without its required string argument.','Treating empty parentheses as creation of a deferred function reference.'),o('unpacked-call',"strtoupper(...['php'])",'An ellipsis followed by an argument array unpacks and invokes the function, returning a string.','Confusing first-class callable syntax with argument unpacking.')],key:'callable-syntax',explanation:'A function name followed by (...) creates a Closure in PHP’s first-class callable syntax. An ellipsis followed by an expression instead unpacks arguments into a call.',trace:'build returns the Closure without transforming any input. The later callback invocation uppercases php and prints PHP.',validation:{kind:'patch',marker:"strtoupper(...['php'])",stdout:'PHP'},references:['https://www.php.net/manual/en/functions.first_class_callable_syntax.php']}),
q({id:'PHP-E26-0272',format:'I',level:'F',topic:18,subtopic:'explicit-parent-implementation-call',objective:'Invoke an overridden parent method’s implementation from the child class.',reason:'Distinguish choosing the parent method body from normal dispatch to the child override.',prerequisites:['Inheritance','Protected methods','parent::','Method overriding'],lessons:[25,26],coverageComplete:true,stem:'render must deliberately use the parent label implementation and return base, even though this class overrides label. Which call should replace the current expression?',files:[file(`class BaseRenderer
{
    protected function label(): string
    {
        return 'base';
    }
}

class Renderer extends BaseRenderer
{
    protected function label(): string
    {
        return 'custom';
    }

    public function render(): string
    {
        return $this->label();
    }
}

echo (new Renderer())->render();`)],options:[o('self','self::label()','self refers to Renderer here, whose label method is the override.','Assuming self means the parent implementation when used inside a child class.'),o('late-static','static::label()','The called class is Renderer, so late-static lookup selects its override.','Using late-static dispatch to bypass an override.'),o('parent','parent::label()','parent explicitly selects BaseRenderer’s implementation, which is accessible from the child.'),o('instance','$this->label()','Normal instance dispatch selects Renderer’s overridden label.','Expecting a call from render to ignore the receiver’s override.')],key:'parent',explanation:'parent:: explicitly accesses an inherited parent implementation from child scope. self, static and ordinary instance dispatch in this example all resolve to the child’s label method.',trace:'The parent implementation returns base. Its protected visibility permits the call from Renderer.',validation:{kind:'patch',marker:'$this->label()',stdout:'base'},references:['https://www.php.net/manual/en/language.oop5.paamayim-nekudotayim.php','https://www.php.net/manual/en/language.oop5.inheritance.php']}),
q({id:'PHP-E26-0273',format:'I',level:'M',topic:15,subtopic:'like-literal-prefix-escape-metacharacters',objective:'Construct a bound SQL LIKE pattern that treats user prefix characters literally.',reason:'Separate SQL parameterization from the pattern language interpreted inside a bound value.',prerequisites:['PDO parameters','SQL LIKE wildcards','Explicit ESCAPE character','strtr'],extensions:['PDO','pdo_sqlite'],stem:'Each search must match a literal prefix: user_, user%, or user!. The query uses ! as its LIKE escape character. Which assignment preserves those literal characters and adds only the final prefix wildcard?',files:[file(`$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE tags (name TEXT)');
$insert = $pdo->prepare('INSERT INTO tags VALUES (?)');

foreach (['user_one', 'user%two', 'user!three', 'userXfour'] as $name) {
    $insert->execute([$name]);
}

$search = $pdo->prepare("SELECT name FROM tags WHERE name LIKE :pattern ESCAPE '!' ORDER BY name");
$results = [];

foreach (['user_', 'user%', 'user!'] as $prefix) {
    $pattern = $prefix . '%';
    $search->execute(['pattern' => $pattern]);
    $results[] = $search->fetchAll(PDO::FETCH_COLUMN);
}

echo json_encode($results);`)],options:[o('sql-quotes',"$pattern = addslashes($prefix) . '%';",'SQL string quoting is not LIKE-pattern escaping, and parameter binding already separates the value from SQL syntax.','Assuming escaping quotes also neutralizes wildcard metacharacters.'),o('escape-introduced-last',"$pattern = str_replace(['%', '_', '!'], ['!%', '!_', '!!'], $prefix) . '%';",'The final replacement doubles escape markers inserted by earlier replacements, changing their intended meaning.','Escaping the escape character after introducing new escape markers.'),o('literal-prefix',"$pattern = strtr($prefix, ['!' => '!!', '%' => '!%', '_' => '!_']) . '%';",'The map escapes each original special character without reprocessing inserted markers, then adds the one intended wildcard.'),o('suffix-pattern',"$pattern = '%' . strtr($prefix, ['!' => '!!', '%' => '!%', '_' => '!_']);",'This places the wildcard before the literal text and searches for a suffix rather than a prefix.','Reversing the placement of the intentional wildcard.')],key:'literal-prefix',explanation:'A bound parameter is still interpreted as a LIKE pattern. Escape the pattern’s %, _ and escape character itself, then append the single wildcard required for prefix matching.',trace:'The patterns user!_%, user!%% and user!!% match only user_one, user%two and user!three respectively.',validation:{kind:'patch',marker:"$pattern = $prefix . '%';",stdout:'[["user_one"],["user%two"],["user!three"]]'},references:['https://www.sqlite.org/lang_expr.html#like','https://www.php.net/manual/en/pdo.prepare.php','https://www.php.net/manual/en/function.strtr.php']}),
q({id:'PHP-E26-0274',format:'I',level:'M',topic:10,subtopic:'csv-logical-record-spans-physical-lines',objective:'Read CSV records whose quoted fields contain embedded newlines.',reason:'Choose a stream-aware record parser instead of splitting input into physical lines before parsing.',prerequisites:['CSV quoting','fgetcsv','fgets','str_getcsv'],lessons:[20],coverageComplete:true,stem:'The first CSV record contains a newline inside its quoted second field. Which reader expression returns the two complete logical records in the two loop iterations?',files:[file(`$handle = fopen('php://memory', 'w+');
fwrite($handle, "1,\\"two\\nlines\\"\\n2,plain\\n");
rewind($handle);
$rows = [];

for ($i = 0; $i < 2; $i++) {
    $rows[] = str_getcsv(fgets($handle), ',', '"', '');
}

fclose($handle);
echo json_encode($rows);`)],options:[o('stream-parser',"fgetcsv($handle, null, ',', '\"', '')",'The stream parser continues through quoted newlines until the logical CSV record is complete.'),o('line-then-parse',"str_getcsv(fgets($handle), ',', '\"', '')",'fgets stops at the embedded newline before str_getcsv receives the complete record.','Assuming one physical line always equals one CSV record.'),o('line-split',"explode(',', fgets($handle))",'This ignores both quote semantics and the embedded newline boundary.','Treating CSV as delimiter-separated physical lines without a quoting grammar.'),o('wrong-delimiter',"fgetcsv($handle, null, ';', '\"', '')",'The fixture is comma-delimited, so this does not produce the required two-field records.','Choosing the stream parser but configuring the wrong CSV dialect.')],key:'stream-parser',explanation:'CSV quoting can place a newline inside one field. fgetcsv reads from the stream until it has a complete logical record, while fgets truncates the input at a physical line boundary before str_getcsv can parse the rest.',trace:'The first call returns [1, "two newline lines"] as two string fields. The second returns [2, "plain"]. The newline remains inside the first record’s second field.',validation:{kind:'patch',marker:"str_getcsv(fgets($handle), ',', '\"', '')",stdout:'[["1","two\\nlines"],["2","plain"]]'},references:['https://www.php.net/manual/en/function.fgetcsv.php','https://www.php.net/manual/en/function.str-getcsv.php']}),
q({id:"PHP-E26-0275",format:"I",level:"M",topic:13,subtopic:"cross-site-cookie-samesite-none-secure",objective:"Choose cookie attributes that permit an HTTPS cross-site subresource request while withholding script access.",reason:"Combine SameSite delivery rules with Secure and HttpOnly under explicit browser policy assumptions.",prerequisites:["setcookie options","SameSite","Secure","HttpOnly"],lessons:[18],coverageComplete:true,assumptions:["A modern browser permits third-party cookies for this test and implements standard SameSite handling. The cookie is set over HTTPS and is later needed on an HTTPS cross-site subresource request, not a top-level navigation. Domain and path already match. JavaScript must not read the cookie. Other cookie options are identical and valid."],stem:"Which setcookie options satisfy the required cross-site delivery and script-access restrictions under these assumptions?",options:[o("lax","['samesite' => 'Lax', 'secure' => true, 'httponly' => true]","Lax does not admit this cross-site subresource request, even though it may allow certain top-level navigations.","Applying a top-level-navigation exception to a subresource request."),o("strict","['samesite' => 'Strict', 'secure' => true, 'httponly' => true]","Strict excludes cross-site delivery for the stated request.","Assuming stronger SameSite isolation can still satisfy required cross-site use."),o("none-insecure","['samesite' => 'None', 'secure' => false, 'httponly' => true]","The assumed browser requires Secure with SameSite=None and would reject this configuration.","Treating an HTTPS setting response as a substitute for the cookie’s Secure attribute."),o("none-secure","['samesite' => 'None', 'secure' => true, 'httponly' => true]","None permits the stated cross-site context, Secure meets its browser requirement, and HttpOnly restricts script access.",null)],key:"none-secure",explanation:"SameSite=None permits cross-site cookie use subject to browser policy, and modern implementations require Secure with it. HttpOnly separately prevents ordinary script access. The premise explicitly excludes a third-party-cookie policy block.",trace:"The request is a cross-site subresource, so Lax and Strict are unsuitable. None with Secure is admissible under the stated policy, while HttpOnly remains enabled.",validation:{"kind":"document-review","rule":"Apply the stated modern-browser SameSite policy and PHP setcookie attribute meanings; no real cookie is sent.","optionAudit":{"lax":"Top-level exceptions do not cover this subresource request.","strict":"Blocks the required cross-site context.","none-insecure":"Fails the required Secure attribute rule.","none-secure":"Meets all stated delivery and script-access requirements."}},references:["https://www.php.net/manual/en/function.setcookie.php","https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value"],revision:2}),
q({id:'PHP-E26-0276',format:'I',level:'M',topic:14,subtopic:'literal-regex-input-delimiter-aware-quoting',objective:'Quote a literal search value for both regex metacharacters and the chosen pattern delimiter.',reason:'Separate regex-language escaping from SQL-style slash escaping and delimiter-only handling.',prerequisites:['preg_quote','Regex delimiters','Literal versus pattern input'],stem:'The pattern must match the exact needle and reject the lookalike, with no warnings. Which quoting expression supplies a literal-safe fragment for this slash-delimited regex?',files:[file(String.raw`$needle = 'foo/bar.c+';
$quoted = preg_quote($needle);
$pattern = '/\A' . $quoted . '\z/';
$warnings = 0;

set_error_handler(function () use (&$warnings): bool {
    $warnings++;

    return true;
});

$matches = [
    preg_match($pattern, $needle),
    preg_match($pattern, 'foo/barXccc'),
];
restore_error_handler();

echo json_encode([$matches, $warnings]);`)],options:[o('default-quote','preg_quote($needle)','Without the delimiter argument, the slash inside the needle remains unescaped for this pattern delimiter.','Assuming preg_quote guesses the delimiter used by the surrounding pattern.'),o('generic-slashes','addslashes($needle)','This does not quote the slash delimiter, dot or plus for the regex grammar.','Treating generic quote/backslash escaping as context-specific regex quoting.'),o('delimiter-only',String.raw`str_replace('/', '\/', $needle)`,'Escaping only slash leaves dot and plus active as regex metacharacters.','Handling the enclosing delimiter but not the pattern language inside it.'),o('delimiter-aware',"preg_quote($needle, '/')",'preg_quote escapes regex metacharacters and the explicitly supplied slash delimiter.')],key:'delimiter-aware',explanation:'A literal inserted into a regex must be quoted for that regex grammar and its delimiter. preg_quote’s second argument supplies the delimiter that must also be escaped.',trace:'The quoted dot and plus match literal characters, and the escaped slash stays inside the pattern. The exact needle matches, the lookalike does not, and no warning occurs.',validation:{kind:'patch',marker:'preg_quote($needle)',stdout:'[[1,0],0]'},references:['https://www.php.net/manual/en/function.preg-quote.php']}),
q({id:'PHP-E26-0277',format:'I',level:'M',topic:8,subtopic:'static-arrow-avoid-implicit-owner-retention',objective:'Create a callback that captures a scalar prefix without retaining its creating object.',reason:'Distinguish scalar capture from the implicit this binding of a nonstatic closure created in a method.',prerequisites:['Arrow functions','Static closures','Object lifetime','WeakReference fixture: get returns null after collection'],lessons:[7,9,23],coverageComplete:false,stem:'The callback must still return Xa after the owner is unset, while allowing that owner to be collected. Which return expression makes the output ["Xa",true]?',files:[file(`class Prefixer
{
    public function __construct(private string $prefix)
    {
    }

    public function format(string $value): string
    {
        return $this->prefix . $value;
    }

    public function build(): Closure
    {
        $prefix = $this->prefix;

        return fn (string $value): string => $prefix . $value;
    }
}

$owner = new Prefixer('X');
$weak = WeakReference::create($owner);
$callback = $owner->build();
unset($owner);

try {
    $result = $callback('a');
} catch (Error $error) {
    $result = 'Error';
}

echo json_encode([$result, $weak->get() === null]);`)],options:[o('static-capture','static fn (string $value): string => $prefix . $value','The static arrow captures the scalar prefix but has no bound this retaining the owner.'),o('implicit-owner','fn (string $value): string => $prefix . $value','Created in an instance method without static, the closure retains a bound this even though its body only uses prefix.','Assuming an unused this binding is absent from every nonstatic closure.'),o('static-this','static fn (string $value): string => $this->prefix . $value','A static closure has no this, so invoking this expression raises Error.','Removing object binding while still reading an instance property through this.'),o('bound-method','$this->format(...)','The first-class instance-method callable remains bound to the owner.','Assuming a first-class callable drops the target instance after creation.')],key:'static-capture',explanation:'A nonstatic closure created in instance context can retain its bound object. A static arrow avoids that binding while still automatically capturing the local scalar prefix by value.',trace:'The static arrow keeps X independently. Unsetting owner removes its last strong reference, so the weak reference becomes null, while the callback still produces Xa.',validation:{kind:'patch',marker:'fn (string $value): string => $prefix . $value',stdout:'["Xa",true]'},references:['https://www.php.net/manual/en/functions.anonymous.php','https://www.php.net/manual/en/functions.arrow.php','https://www.php.net/manual/en/class.weakreference.php']}),
q({id:"PHP-E26-0278",format:"I",level:"A",topic:11,subtopic:"trusted-proxy-chain-rightmost-untrusted-peer",objective:"Select the client-facing untrusted peer from a forwarding chain with a trusted proxy suffix.",reason:"Apply deployment trust boundaries rather than accept a client-supplied leftmost forwarding value.",prerequisites:["Reverse proxy forwarding (advanced)","$_SERVER remote peer","Trusted proxy allowlist","Ordered header chains"],lessons:[16],coverageComplete:false,assumptions:["Exactly two trusted proxies, 10.0.0.1 and 10.0.0.2, append their observed peer address to any existing X-Forwarded-For list. They preserve a client-supplied prefix. The application’s immediate peer is 10.0.0.2. The trusted list is complete. Addresses are already parsed as valid IP strings; malformed headers are outside this fixture."],stem:"The current selection can accept a spoofed client-supplied prefix. Which algorithm attributes the request to a client through the stated trusted proxies?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$trusted = ['10.0.0.1', '10.0.0.2'];
$forwarded = ['203.0.113.99', '198.51.100.7', '10.0.0.1'];
$remote = '10.0.0.2';
$hops = [...$forwarded, $remote];
$selected = $hops[0];

echo $selected;
`}],options:[o("left-untrusted","Walk left to right and choose the first address outside the trusted proxy list.","This chooses the preserved client-supplied prefix 203.0.113.99 before reaching the observed peer.","Trusting the left edge of a header that can contain a spoofed prefix."),o("right-boundary","Walk right to left through the combined chain, skip trusted proxies, and select the first untrusted address.","This removes the trusted suffix and stops at the peer observed by the earliest trusted proxy.",null),o("header-rightmost","Choose the rightmost X-Forwarded-For entry because it was most recently appended by a trusted proxy.","That entry is 10.0.0.1, another trusted proxy rather than its untrusted peer.","Confusing a trustworthy report of a proxy hop with the desired client-facing hop."),o("remote-only","Choose REMOTE_ADDR after verifying that it is in the trusted proxy list.","The verified immediate peer is 10.0.0.2, which is still a proxy.","Using the trust check as the final client-address selection instead of permission to inspect the chain.")],key:"right-boundary",explanation:"Under the stated append-only proxy contract, the right-hand suffix consists of trusted infrastructure. Walking left from the immediate peer and stopping at the first untrusted address identifies the boundary without trusting earlier client-supplied entries.",trace:"Skip remote 10.0.0.2, then 10.0.0.1. Stop at 198.51.100.7; the earlier 203.0.113.99 is beyond the trusted observation boundary and is not used.",validation:{"kind":"contract","stdout":"203.0.113.99","contrasts":[{"name":"trusted-suffix-selection","marker":"$selected = $hops[0];","replacement":"$selected = 'unknown';\n\nfor ($i = count($hops) - 1; $i >= 0; $i--) {\n    if (!in_array($hops[$i], $trusted, true)) {\n        $selected = $hops[$i];\n        break;\n    }\n}","stdout":"198.51.100.7"}],"keyEvidence":"The original selects the spoofable prefix; the reviewed contrast walks the explicitly trusted suffix and produces the required peer.","counterexamples":{"left-untrusted":"Selects 203.0.113.99 from the untrusted prefix.","header-rightmost":"Selects trusted proxy 10.0.0.1.","remote-only":"Selects trusted proxy 10.0.0.2."}},references:["https://www.rfc-editor.org/rfc/rfc7239#section-8.1","https://www.php.net/manual/en/reserved.variables.server.php"],revision:2}),
q({id:"PHP-E26-0279",format:"I",level:"M",topic:16,subtopic:"idempotency-claim-rowcount-in-transaction",objective:"Apply a database effect only when an atomic unique-key claim was newly inserted.",reason:"Combine duplicate detection, statement outcome and transaction ownership so a replay does not apply the effect twice.",prerequisites:["Idempotency keys","SQLite ON CONFLICT DO NOTHING","PDO rowCount","Atomic claim and effect transaction"],extensions:["PDO","pdo_sqlite"],assumptions:["Each operation always increments the same counter by 10; there is no varying payload. The unique operation key identifies retries of that operation. Every commit in the fixture succeeds. The claim and counter update must remain in the same transaction."],stem:"The first key occurrence must return applied and its replay duplicate, leaving value 10. Which condition identifies a newly inserted claim rather than merely a successful SQL execution?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function applyOnce(PDO $pdo, string $key): string
{
    $pdo->beginTransaction();

    try {
        $claim = $pdo->prepare('INSERT INTO claims (operation_key) VALUES (?) ON CONFLICT DO NOTHING');
        $claim->execute([$key]);

        if ($claim->errorCode() === '00000') {
            $pdo->exec('UPDATE counters SET value = value + 10 WHERE id = 1');
            $result = 'applied';
        } else {
            $result = 'duplicate';
        }

        $pdo->commit();

        return $result;
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        throw $error;
    }
}

$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE claims (id INTEGER PRIMARY KEY, operation_key TEXT UNIQUE)');
$pdo->exec('CREATE TABLE counters (id INTEGER PRIMARY KEY, value INTEGER)');
$pdo->exec('INSERT INTO counters VALUES (1, 0)');
$results = [applyOnce($pdo, 'request-1'), applyOnce($pdo, 'request-1')];

echo json_encode([$results, (int) $pdo->query('SELECT value FROM counters WHERE id = 1')->fetchColumn()]);
`}],options:[o("sql-success","$claim->errorCode() === '00000'","A conflict handled by DO NOTHING is also successful SQL, so both calls would apply the effect.","Equating successful execution with insertion of a new claim."),o("last-id","$pdo->lastInsertId() !== '0'","The connection can retain the previous inserted ID when the duplicate inserts no row.","Using connection-level last-insert state as a per-statement insertion indicator."),o("new-row","$claim->rowCount() === 1","A new claim inserts one row; a duplicate handled by DO NOTHING inserts zero.",null),o("no-row","$claim->rowCount() === 0","This applies the effect on the replay instead of on the first claim.","Reversing the meaning of the affected-row count.")],key:"new-row",explanation:"The unique constraint makes claiming atomic. DO NOTHING can complete successfully without inserting, so the affected-row count distinguishes a new claim from a replay. Keeping the effect in the same transaction avoids committing a claim without its effect.",trace:"The first insert affects one row and increments the counter. The replay affects zero rows and returns duplicate. The counter remains 10.",validation:{"kind":"patch","marker":"$claim->errorCode() === '00000'","stdout":"[[\"applied\",\"duplicate\"],10]"},references:["https://www.sqlite.org/lang_upsert.html","https://www.php.net/manual/en/pdostatement.rowcount.php","https://www.php.net/manual/en/pdo.transactions.php"],revision:2}),
q({id:"PHP-E26-0280",format:"I",level:"M",topic:3,subtopic:"weak-caller-union-coercion-before-callee-guard",objective:"Preserve original input types at a numeric API boundary even when the caller uses weak scalar coercion.",reason:"Separate call-site coercion from callee strictness and validate original input before it can be normalized by a union parameter.",prerequisites:["strict_types call-site rule","Scalar union coercion","mixed parameters","Explicit type predicates"],lessons:[1,5],coverageComplete:false,stem:"amount must return integers and floats unchanged, and throw InvalidArgumentException for strings or booleans. The caller is intentionally weak even though types.php is strict. Which complete replacement function preserves this contract?",files:[{path:"main.php",kind:"complete-file",source:`<?php

require __DIR__ . '/types.php';
$results = [];

foreach ([7, 2.5, '7', true] as $input) {
    try {
        $value = amount($input);
        $results[] = [get_debug_type($value), $value];
    } catch (InvalidArgumentException $error) {
        $results[] = 'rejected';
    } catch (TypeError $error) {
        $results[] = 'TypeError';
    }
}

echo json_encode($results);
`},{path:"types.php",kind:"complete-file",source:`<?php

declare(strict_types=1);

function amount(int|float $value): int|float
{
    if (!is_int($value) && !is_float($value)) {
        throw new InvalidArgumentException('numeric type required');
    }

    return $value;
}
`}],options:[o("guard-after-union","function amount(int|float $value): int|float\n{\n    if (!is_int($value) && !is_float($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return $value;\n}","The weak caller can coerce a string or boolean before the body sees it, so the guard cannot recover the original type.","Assuming strict_types in the defining file prevents weak caller argument coercion."),o("numeric-text","function amount(mixed $value): int|float\n{\n    if (!is_numeric($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return +$value;\n}","is_numeric accepts the string 7, and unary plus converts it into an accepted number.","Using numeric-text validation when only existing numeric PHP types are permitted."),o("float-only","function amount(mixed $value): int|float\n{\n    if (!is_float($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return $value;\n}","This rejects the valid integer input 7 as well as the forbidden types.","Treating a numeric API as float-only despite its integer requirement."),o("preserve-input","function amount(mixed $value): int|float\n{\n    if (!is_int($value) && !is_float($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return $value;\n}","mixed preserves the original argument type, allowing the explicit guard to reject strings and booleans before returning the numeric value.",null)],key:"preserve-input",explanation:"Scalar argument coercion is determined by the caller’s strictness. A union parameter can therefore receive an already-coerced value before the strict callee body runs. mixed avoids that conversion, so explicit type predicates can enforce the API’s original-type contract.",trace:"The accepted inputs remain integer 7 and float 2.5. String 7 and boolean true reach the mixed parameter unchanged and are rejected with the required exception.",validation:{"kind":"patch","marker":"function amount(int|float $value): int|float\n{\n    if (!is_int($value) && !is_float($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return $value;\n}","stdout":"[[\"int\",7],[\"float\",2.5],\"rejected\",\"rejected\"]"},references:["https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict"],revision:2}),
q({id:'PHP-E26-0281',format:'T',level:'M',topic:14,subtopic:'regex-absolute-end-regression',objective:'Test complete input consumption rather than a regex end anchor that permits a final newline.',reason:'Choose an input that separates two plausible interpretations of end-of-string.',prerequisites:['preg_match','PCRE anchors','Escaped newline bytes'],stem:'validCode must accept exactly three uppercase ASCII letters and no other bytes. Which assertion exposes the defect? The double-quoted escape in an option denotes an actual newline.',files:[file(String.raw`function validCode(string $input): bool
{
    return preg_match('/^[A-Z]{3}$/', $input) === 1;
}`)],options:[o('lower',"validCode('AbC') === false",'The character class already excludes lowercase letters.','Testing case rules instead of complete input consumption.'),o('newline','validCode("ABC\\n") === false','The $ anchor permits a position before a final newline, so this invalid four-byte input matches.'),o('four',"validCode('ABCD') === false",'The extra letter prevents the end anchor from matching.','Assuming an arbitrary fourth byte behaves like a terminal newline.'),o('three',"validCode('ABC') === true",'The valid three-letter input matches both the faulty and repaired patterns.','Using a valid example to test rejection at the boundary.')],key:'newline',explanation:'PCRE $ normally matches at the end or immediately before a final newline. The absolute end anchor \\z enforces the stated byte-level contract.',trace:'ABC followed by LF matches the faulty pattern; replacing $ with \\z rejects it while retaining the three-letter case.',validation:{kind:'tests',marker:"'/^[A-Z]{3}$/'",repair:String.raw`'/\A[A-Z]{3}\z/'`,cases:[{option:'lower',probe:"echo json_encode(validCode('AbC'));",expected:'false'},{option:'newline',probe:'echo json_encode(validCode("ABC\\n"));',expected:'false'},{option:'four',probe:"echo json_encode(validCode('ABCD'));",expected:'false'},{option:'three',probe:"echo json_encode(validCode('ABC'));",expected:'true'}]},references:['https://www.php.net/manual/en/regexp.reference.anchors.php']}),
q({id:"PHP-E26-0282",format:"T",level:"F",topic:10,subtopic:"bounded-fgets-record-truncation-test",objective:"Select a file fixture that exposes a byte limit mistaken for a complete line read.",reason:"Relate fgets length minus one to a record that exceeds the chosen buffer size.",prerequisites:["fgets","Memory streams","Line terminators"],lessons:[20],coverageComplete:true,assumptions:["Each input is one newline-terminated record. All memory-stream operations succeed; the function owns the stream."],stem:"firstRecord must return all bytes of the first record, including its newline. Which assertion fails?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function firstRecord(string $input): string
{
    $stream = fopen('php://memory', 'w+b');
    fwrite($stream, $input);
    rewind($stream);
    $record = fgets($stream, 5);
    fclose($stream);

    return $record;
}
`}],options:[o("empty","firstRecord(\"\\n\") === \"\\n\"","The newline fits within the four-byte read limit.","Treating an empty record as a zero-byte read."),o("one","firstRecord(\"A\\n\") === \"A\\n\"","Both bytes fit and the read stops at the newline.","Assuming a length argument always adds padding."),o("edge","firstRecord(\"ABC\\n\") === \"ABC\\n\"","The four-byte record exactly fits length minus one.","Treating the length parameter as a count of data bytes excluding the newline."),o("beyond","firstRecord(\"ABCD\\n\") === \"ABCD\\n\"","Only ABCD is returned; the newline remains unread.",null)],key:"beyond",explanation:"fgets stops after at most length minus one bytes, at a newline, or at EOF. Removing the length bound allows this function to read the entire record.",trace:"The five-byte record is split after four bytes by fgets($stream, 5). The repaired unbounded call includes its newline.",validation:{"kind":"tests","marker":"fgets($stream, 5)","repair":"fgets($stream)","cases":[{"option":"empty","probe":"echo json_encode(firstRecord(\"\\n\"));","expected":"\"\\n\""},{"option":"one","probe":"echo json_encode(firstRecord(\"A\\n\"));","expected":"\"A\\n\""},{"option":"edge","probe":"echo json_encode(firstRecord(\"ABC\\n\"));","expected":"\"ABC\\n\""},{"option":"beyond","probe":"echo json_encode(firstRecord(\"ABCD\\n\"));","expected":"\"ABCD\\n\""}]},references:["https://www.php.net/manual/en/function.fgets.php"],revision:2}),
q({id:"PHP-E26-0283",format:"T",level:"F",topic:18,subtopic:"base-class-admission-regression",objective:"Test whether a type admission check accepts the base class itself as well as descendants.",reason:"Distinguish strict subclass membership from an is-a relationship.",prerequisites:["Class inheritance","is_subclass_of","is_a"],lessons:[23,26],coverageComplete:true,stem:"accepts must return true for any Message instance, including an instance of Message itself. Which assertion fails?",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Message
{
}

class Email extends Message
{
}

class Sms extends Message
{
}

function accepts(object $value): bool
{
    return is_subclass_of($value, Message::class);
}
`}],options:[o("base","accepts(new Message()) === true","An object of the named class is not a subclass of that same class.",null),o("email","accepts(new Email()) === true","Email is a proper subclass and is already accepted.","Checking only a derived class misses exact-type rejection."),o("sms","accepts(new Sms()) === true","Sms has the same valid inheritance relation as Email.","Assuming a second descendant exercises the base-class boundary."),o("unrelated","accepts(new stdClass()) === false","The unrelated object is rejected by both predicates.","Testing exclusion without testing all permitted members.")],key:"base",explanation:"is_subclass_of excludes the named class itself. is_a, or instanceof with Message, includes both the base type and its descendants.",trace:"The direct Message instance yields false with is_subclass_of and true with is_a. Both descendants and the unrelated object retain their expected results.",validation:{"kind":"tests","marker":"is_subclass_of($value, Message::class)","repair":"is_a($value, Message::class)","cases":[{"option":"base","probe":"echo json_encode(accepts(new Message()));","expected":"true"},{"option":"email","probe":"echo json_encode(accepts(new Email()));","expected":"true"},{"option":"sms","probe":"echo json_encode(accepts(new Sms()));","expected":"true"},{"option":"unrelated","probe":"echo json_encode(accepts(new stdClass()));","expected":"false"}]},references:["https://www.php.net/manual/en/function.is-subclass-of.php","https://www.php.net/manual/en/function.is-a.php"],revision:2}),
q({id:"PHP-E26-0284",format:"T",level:"M",topic:10,subtopic:"json-integral-float-wire-test",objective:"Select an exact-wire assertion that detects loss of a float’s fractional marker.",reason:"Distinguish numerically equivalent JSON values from an explicit serialization-format contract.",prerequisites:["JSON encoding","Integer versus float","Exact string assertions"],assumptions:["The protocol requires PHP floats with integral value to retain a .0 fractional marker. Integer values must remain integers in the JSON text. This is an exact wire-format requirement, not a claim that JSON has separate integer and float types."],stem:"Which assertion fails against the displayed serializer?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function wireNumber(int|float $number): string
{
    return json_encode($number, JSON_THROW_ON_ERROR);
}
`}],options:[o("fraction","wireNumber(2.5) === '2.5'","A nonzero fractional part is preserved without the extra flag.","Using a fractional value to test integral-float formatting."),o("integer","wireNumber(2) === '2'","An integer should remain 2, and already does.","Assuming the repair must append .0 to every numeric value."),o("whole-float","wireNumber(2.0) === '2.0'","The current flags produce 2, omitting the required fractional marker.",null),o("negative","wireNumber(-3.5) === '-3.5'","The sign does not cause loss of the nonzero fractional part.","Treating negative numbers as the missing serialization boundary.")],key:"whole-float",explanation:"JSON_PRESERVE_ZERO_FRACTION retains a fractional marker for integral PHP floats. It does not convert integer arguments into floats.",trace:"2.0 is a PHP float but normally encodes as 2. Adding the flag changes that result to 2.0 and leaves the other three expectations unchanged.",validation:{"kind":"tests","marker":"JSON_THROW_ON_ERROR","repair":"JSON_THROW_ON_ERROR | JSON_PRESERVE_ZERO_FRACTION","cases":[{"option":"fraction","probe":"echo wireNumber(2.5);","expected":"2.5"},{"option":"integer","probe":"echo wireNumber(2);","expected":"2"},{"option":"whole-float","probe":"echo wireNumber(2.0);","expected":"2.0"},{"option":"negative","probe":"echo wireNumber(-3.5);","expected":"-3.5"}]},references:["https://www.php.net/manual/en/json.constants.php"],revision:2}),
q({id:"PHP-E26-0285",format:"T",level:"M",topic:23,subtopic:"date-difference-direction-regression",objective:"Test the sign of a calendar-date difference instead of only its magnitude.",reason:"Use a reversed date pair to exercise DateInterval direction metadata.",prerequisites:["DateTimeImmutable::diff","DateInterval::days","DateInterval::invert"],assumptions:["Inputs are valid YYYY-MM-DD dates at midnight UTC. signedDays must be positive when the second date is later and negative when it is earlier."],stem:"Which assertion fails against the displayed implementation?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function signedDays(string $from, string $to): int
{
    $interval = (new DateTimeImmutable($from))->diff(new DateTimeImmutable($to));

    return $interval->days;
}
`}],options:[o("same","signedDays('2025-04-02', '2025-04-02') === 0","The magnitude of a zero interval already matches its signed value.","Expecting an equal-date case to exercise direction."),o("backwards","signedDays('2025-04-02', '2025-04-01') === -1","days is 1 and invert is 1; the implementation ignores invert.",null),o("forward","signedDays('2025-04-01', '2025-04-02') === 1","The positive magnitude is already the required answer.","Checking only forward movement cannot reveal a lost sign."),o("leap","signedDays('2024-02-28', '2024-03-01') === 2","The date library correctly includes leap day in the positive magnitude.","Choosing calendar complexity that does not test the missing direction bit.")],key:"backwards",explanation:"For an interval returned by diff, days is the total day magnitude and invert indicates reversed direction. Applying that direction produces a signed result.",trace:"The backwards interval has days=1 and invert=1, so the repaired expression returns -1.",validation:{"kind":"tests","marker":"return $interval->days;","repair":"return $interval->invert ? -$interval->days : $interval->days;","cases":[{"option":"same","probe":"echo signedDays('2025-04-02', '2025-04-02');","expected":"0"},{"option":"backwards","probe":"echo signedDays('2025-04-02', '2025-04-01');","expected":"-1"},{"option":"forward","probe":"echo signedDays('2025-04-01', '2025-04-02');","expected":"1"},{"option":"leap","probe":"echo signedDays('2024-02-28', '2024-03-01');","expected":"2"}]},references:["https://www.php.net/manual/en/class.dateinterval.php"],revision:2}),
q({id:'PHP-E26-0286',format:'T',level:'M',topic:18,subtopic:'external-method-callability-test',objective:'Test method availability from the caller’s visibility scope.',reason:'Distinguish declaring a method from allowing an external call to it.',prerequisites:['Public and private methods','method_exists','is_callable'],lessons:[8,25],coverageComplete:true,stem:'canRun is called outside these classes and must report whether $worker->run() is callable there. None of the classes implements __call. Which assertion fails?',files:[file(`class PublicWorker
{
    public function run(): void
    {
    }
}

class PrivateWorker
{
    private function run(): void
    {
    }
}

class ChildWorker extends PublicWorker
{
}

function canRun(object $worker): bool
{
    return method_exists($worker, 'run');
}`)],options:[o('inherited','canRun(new ChildWorker()) === true','The inherited public method is visible and exists.','Assuming inherited methods are absent from method_exists.'),o('missing','canRun(new stdClass()) === false','There is no run method or magic dispatcher.','Testing method absence rather than visibility.'),o('private','canRun(new PrivateWorker()) === false','method_exists sees the private declaration even though this external caller cannot invoke it.'),o('public','canRun(new PublicWorker()) === true','The public declaration is callable and already accepted.','Using only a public method cannot expose the visibility defect.')],key:'private',explanation:'method_exists answers a declaration question. is_callable checks whether this scope can call the method, including its visibility.',trace:'The private method exists but the external [object, run] callable is invalid. The other three cases have the same result under both checks.',validation:{kind:'tests',marker:"method_exists($worker, 'run')",repair:"is_callable([$worker, 'run'])",cases:[{option:'inherited',probe:'echo json_encode(canRun(new ChildWorker()));',expected:'true'},{option:'missing',probe:'echo json_encode(canRun(new stdClass()));',expected:'false'},{option:'private',probe:'echo json_encode(canRun(new PrivateWorker()));',expected:'false'},{option:'public',probe:'echo json_encode(canRun(new PublicWorker()));',expected:'true'}]},references:['https://www.php.net/manual/en/function.method-exists.php','https://www.php.net/manual/en/function.is-callable.php']}),
q({id:"PHP-E26-0287",format:"T",level:"F",topic:11,subtopic:"http-field-name-case-test",objective:"Test HTTP field-name case insensitivity in a PHP associative-array adapter.",reason:"Separate protocol name equivalence from PHP’s case-sensitive string keys.",prerequisites:["HTTP fields","PHP array keys","array_change_key_case"],lessons:[12],coverageComplete:false,assumptions:["The input is an already parsed map with at most one spelling of each HTTP field name. Names contain ASCII characters only. Values must remain byte-for-byte unchanged."],stem:"contentType must find the field regardless of its name’s letter case, or return null if absent. Which assertion fails?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function contentType(array $fields): ?string
{
    return $fields['Content-Type'] ?? null;
}
`}],options:[o("absent","contentType([]) === null","The missing key already produces null.","Testing absence without name normalization."),o("lower","contentType(['content-type' => 'Text/Plain']) === 'Text/Plain'","The lowercase key is a valid spelling of the field but the current lookup misses it.",null),o("canonical","contentType(['Content-Type' => 'Text/Plain']) === 'Text/Plain'","This is the one spelling the implementation already recognizes.","Assuming a canonical-spelling test establishes case insensitivity."),o("unrelated","contentType(['Accept' => 'text/plain']) === null","Accept is a different field, regardless of its value.","Confusing media-type values with the name of the field being requested.")],key:"lower",explanation:"HTTP field names are case-insensitive, whereas string array keys are not. Normalizing names permits a lowercase lookup without altering field values.",trace:"array_change_key_case with CASE_LOWER changes Content-Type to content-type but leaves Text/Plain untouched.",validation:{"kind":"tests","marker":"return $fields['Content-Type'] ?? null;","repair":"return array_change_key_case($fields, CASE_LOWER)['content-type'] ?? null;","cases":[{"option":"absent","probe":"echo json_encode(contentType([]));","expected":"null"},{"option":"lower","probe":"echo json_encode(contentType(['content-type' => 'Text/Plain']), JSON_UNESCAPED_SLASHES);","expected":"\"Text/Plain\""},{"option":"canonical","probe":"echo json_encode(contentType(['Content-Type' => 'Text/Plain']), JSON_UNESCAPED_SLASHES);","expected":"\"Text/Plain\""},{"option":"unrelated","probe":"echo json_encode(contentType(['Accept' => 'text/plain']));","expected":"null"}]},references:["https://www.rfc-editor.org/rfc/rfc9110.html#section-5.1","https://www.php.net/manual/en/function.array-change-key-case.php"],revision:2}),
q({id:"PHP-E26-0288",format:"T",level:"F",topic:20,subtopic:"exception-rethrow-identity-test",objective:"Verify that a pass-through boundary preserves the original exception object.",reason:"Choose an assertion that detects reconstruction despite matching class and message.",prerequisites:["Exception identity","Catch and throw","Object comparison"],lessons:[22,23],coverageComplete:true,stem:"passThrough must rethrow the same exception object it receives. The test creates a RuntimeException with message failure and default code 0. Which assertion fails for the caught result?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function passThrough(RuntimeException $failure): never
{
    try {
        throw $failure;
    } catch (RuntimeException $caught) {
        throw new RuntimeException($caught->getMessage());
    }
}

$original = new RuntimeException('failure');

try {
    passThrough($original);
} catch (RuntimeException $caught) {
    $result = $caught;
}
`}],options:[o("identity","$result === $original","Reconstructing a RuntimeException creates a different object, violating the explicit identity contract.",null),o("message","$result->getMessage() === 'failure'","The new exception copies the message.","Equating matching diagnostic text with preserved object identity."),o("type","$result instanceof RuntimeException","The replacement has the same class as the original.","Checking type alone cannot distinguish replacement from rethrow."),o("code","$result->getCode() === 0","Both constructors use the default zero code in this fixture.","Relying on a default metadata value to detect reconstruction.")],key:"identity",explanation:"throw $caught preserves the object that crossed the boundary. Constructing another exception, even with the same message and type, does not.",trace:"The faulty boundary produces a new object with matching message, class and code. The repair rethrows $caught, making strict object identity true.",validation:{"kind":"tests","marker":"throw new RuntimeException($caught->getMessage());","repair":"throw $caught;","cases":[{"option":"identity","probe":"echo json_encode($result === $original);","expected":"true"},{"option":"message","probe":"echo json_encode($result->getMessage() === 'failure');","expected":"true"},{"option":"type","probe":"echo json_encode($result instanceof RuntimeException);","expected":"true"},{"option":"code","probe":"echo json_encode($result->getCode() === 0);","expected":"true"}]},references:["https://www.php.net/manual/en/language.exceptions.php","https://www.php.net/manual/en/language.oop5.object-comparison.php"],revision:2}),
q({id:"PHP-E26-0289",format:"T",level:"M",topic:17,subtopic:"derived-cache-invalidation-test",objective:"Choose an operation sequence that tests invalidation of cached derived state.",reason:"The failure requires a read before a mutation and another read afterward.",prerequisites:["Private object state","Null coalescing assignment","Cache invalidation"],lessons:[23,25],coverageComplete:false,assumptions:["The shown assertions run with zend.assertions=1 and assert.exception=1."],stem:"Basket::total must always equal the sum of all added prices. Which test sequence fails against the implementation? Each option starts with a fresh Basket.",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Basket
{
    private array $prices = [];
    private ?int $cachedTotal = null;

    public function add(int $price): void
    {
        $this->prices[] = $price;
    }

    public function total(): int
    {
        return $this->cachedTotal ??= array_sum($this->prices);
    }
}
`}],options:[o("before-read","$basket->add(4);\n$basket->add(3);\nassert($basket->total() === 7);","The first total is computed after both mutations.","Testing mutations only before the cache is populated."),o("empty","assert($basket->total() === 0);\nassert($basket->total() === 0);","Repeated reads without a mutation legitimately reuse zero.","Treating cache reuse itself as the defect."),o("repeat","$basket->add(4);\nassert($basket->total() === 4);\nassert($basket->total() === 4);","The underlying prices do not change between reads.","Checking repeated reads without invalidating state."),o("read-mutate-read","$basket->add(4);\n$basket->total();\n$basket->add(3);\nassert($basket->total() === 7);","The first read caches 4; add(3) fails to clear it, so the final read still returns 4.",null)],key:"read-mutate-read",explanation:"A cached value derived from mutable state must be invalidated when that state changes. The decisive sequence primes the cache before changing a dependency.",trace:"Clearing cachedTotal in add forces the next total call to recompute 4 + 3.",validation:{"kind":"tests","ini":{"zend.assertions":1},"marker":"$this->prices[] = $price;","repair":"$this->prices[] = $price;\n        $this->cachedTotal = null;","cases":[{"option":"before-read","probe":"$basket = new Basket();\n$basket->add(4);\n$basket->add(3);\necho $basket->total();","expected":"7"},{"option":"empty","probe":"$basket = new Basket();\n$basket->total();\necho $basket->total();","expected":"0"},{"option":"repeat","probe":"$basket = new Basket();\n$basket->add(4);\n$basket->total();\necho $basket->total();","expected":"4"},{"option":"read-mutate-read","probe":"$basket = new Basket();\n$basket->add(4);\n$basket->total();\n$basket->add(3);\necho $basket->total();","expected":"7"}]},references:["https://www.php.net/manual/en/language.oop5.php","https://www.php.net/manual/en/language.operators.assignment.php"],revision:2}),
q({id:"PHP-E26-0290",format:"T",level:"F",topic:4,subtopic:"multiset-removal-regression",objective:"Distinguish removing one occurrence from removing every matching value.",reason:"Use a repeated-value input to test multiplicity, not just membership.",prerequisites:["array_diff","array_search","array_splice"],lessons:[4],coverageComplete:true,assumptions:["Inputs are lists of integers. removeOne must remove only the first occurrence of the requested integer, preserve the other values in order and return a list."],stem:"Which assertion fails against the displayed implementation?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function removeOne(array $items, int $value): array
{
    return array_values(array_diff($items, [$value]));
}
`}],options:[o("once","removeOne([2, 3], 2) === [3]","Only one matching occurrence exists, so removing all matches has the same result.","Testing only a unique value hides multiplicity."),o("absent","removeOne([2, 3], 4) === [2, 3]","No occurrence is removed under either algorithm.","Testing absence cannot distinguish one removal from all removals."),o("repeated","removeOne([2, 3, 2], 2) === [3, 2]","array_diff removes both 2 values, returning only [3].",null),o("empty","removeOne([], 2) === []","The empty list remains empty.","Treating a base case as evidence for duplicate handling.")],key:"repeated",explanation:"array_diff excludes every element whose value occurs in the comparison array. A one-occurrence operation instead finds a position and removes just that entry.",trace:"Finding the first 2 at index 0 and splicing one entry leaves [3, 2]. The other three cases produce the same output as the original.",validation:{"kind":"tests","marker":"return array_values(array_diff($items, [$value]));","repair":"$index = array_search($value, $items, true);\n\n    if ($index !== false) {\n        array_splice($items, $index, 1);\n    }\n\n    return $items;","cases":[{"option":"once","probe":"echo json_encode(removeOne([2, 3], 2));","expected":"[3]"},{"option":"absent","probe":"echo json_encode(removeOne([2, 3], 4));","expected":"[2,3]"},{"option":"repeated","probe":"echo json_encode(removeOne([2, 3, 2], 2));","expected":"[3,2]"},{"option":"empty","probe":"echo json_encode(removeOne([], 2));","expected":"[]"}]},references:["https://www.php.net/manual/en/function.array-diff.php","https://www.php.net/manual/en/function.array-splice.php"],revision:2}),
q({id:"PHP-E26-0291",format:"T",level:"M",topic:10,subtopic:"partial-json-overrides-throw-test",objective:"Test interacting JSON error flags when data loss must abort serialization.",reason:"The presence of JSON_THROW_ON_ERROR is insufficient when a higher-priority flag permits substitution.",prerequisites:["JSON encoder error flags","Non-finite floats","Exception-based failure contracts"],assumptions:["The serializer must return exact valid JSON for supported values and return rejected if any value cannot be represented. Substituting a different value is forbidden."],stem:"Which assertion fails against the displayed serializer?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function encodeStrictly(mixed $value): string
{
    try {
        return json_encode($value, JSON_THROW_ON_ERROR | JSON_PARTIAL_OUTPUT_ON_ERROR);
    } catch (JsonException $failure) {
        return 'rejected';
    }
}
`}],options:[o("finite","encodeStrictly([1.5]) === '[1.5]'","Finite numbers encode normally with either flag configuration.","Using a supported number does not exercise substitution."),o("null","encodeStrictly([null]) === '[null]'","An explicit null is valid JSON data, not an encoding error.","Confusing an original null with a substituted error marker."),o("empty","encodeStrictly([]) === '[]'","An empty list is supported and requires no replacement.","Treating an empty collection as an encoding failure."),o("infinite","encodeStrictly([INF]) === 'rejected'","Partial output takes precedence and replaces INF with 0, returning [0] instead of throwing.",null)],key:"infinite",explanation:"JSON_PARTIAL_OUTPUT_ON_ERROR takes precedence over JSON_THROW_ON_ERROR. For INF it permits a numeric zero replacement, violating the no-substitution contract.",trace:"Removing the partial-output flag causes JsonException for INF and reaches the rejection path. All supported fixtures keep their exact output.",validation:{"kind":"tests","marker":"JSON_THROW_ON_ERROR | JSON_PARTIAL_OUTPUT_ON_ERROR","repair":"JSON_THROW_ON_ERROR","cases":[{"option":"finite","probe":"echo encodeStrictly([1.5]);","expected":"[1.5]"},{"option":"null","probe":"echo encodeStrictly([null]);","expected":"[null]"},{"option":"empty","probe":"echo encodeStrictly([]);","expected":"[]"},{"option":"infinite","probe":"echo encodeStrictly([INF]);","expected":"rejected"}]},references:["https://www.php.net/manual/en/json.constants.php"],revision:2}),
q({id:"PHP-E26-0292",format:"T",level:"M",topic:21,subtopic:"reflection-union-string-membership-test",objective:"Test union-aware reflection without treating every return type as ReflectionNamedType.",reason:"Combine nullable named types, union metadata and a tool’s failure fallback.",prerequisites:["ReflectionFunction","ReflectionNamedType and ReflectionUnionType","Nullable types"],assumptions:["The fixtures have either a named return type or a union of named return types. acceptsString reports whether string is explicitly admitted; mixed, intersections and untyped functions are outside this tool’s current contract."],stem:"Which assertion fails against the displayed reflection helper?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function acceptsString(Closure $callable): bool
{
    $type = (new ReflectionFunction($callable))->getReturnType();

    try {
        return $type->getName() === 'string';
    } catch (Error $failure) {
        return false;
    }
}
`}],options:[o("plain","acceptsString(fn (): string => 'x') === true","A named string return type exposes getName and is accepted.","Testing only a named type misses union metadata."),o("union","acceptsString(fn (): int|string => 1) === true","ReflectionUnionType has no getName method; the caught Error incorrectly becomes false.",null),o("nullable","acceptsString(fn (): ?string => null) === true","A nullable string is represented as a named string type with allowsNull, so this case already passes.","Assuming every nullable declaration is represented as a union object."),o("integer","acceptsString(fn (): int => 1) === false","The named integer type does not admit strings.","Selecting a correctly rejected named type cannot expose the fallback defect.")],key:"union",explanation:"ReflectionType has multiple concrete forms. Union members must be inspected through getTypes; named types can be inspected directly. Catching a method-call Error obscures that distinction.",trace:"The union fixture fails only because the helper calls a named-type method on a union. The repair checks every named member and accepts the string member.",validation:{"kind":"tests","marker":"return $type->getName() === 'string';","repair":"$members = $type instanceof ReflectionUnionType ? $type->getTypes() : [$type];\n\n        foreach ($members as $member) {\n            if ($member->getName() === 'string') {\n                return true;\n            }\n        }\n\n        return false;","cases":[{"option":"plain","probe":"echo json_encode(acceptsString(fn (): string => 'x'));","expected":"true"},{"option":"union","probe":"echo json_encode(acceptsString(fn (): int|string => 1));","expected":"true"},{"option":"nullable","probe":"echo json_encode(acceptsString(fn (): ?string => null));","expected":"true"},{"option":"integer","probe":"echo json_encode(acceptsString(fn (): int => 1));","expected":"false"}]},references:["https://www.php.net/manual/en/reflectionuniontype.gettypes.php","https://www.php.net/manual/en/reflectionnamedtype.getname.php"],revision:2}),
q({id:'PHP-E26-0293',format:'A',level:'M',topic:12,subtopic:'upload-quarantine-publication-boundary',objective:'Place an upload’s public availability after its required validation decision.',reason:'Identify a race between publication and asynchronous scanning rather than only choosing a file check.',prerequisites:['PHP upload handling','Public web roots','Asynchronous scanning'],lessons:[17],coverageComplete:false,assumptions:['A PHP service accepts PDFs. A trusted asynchronous scanner may take several minutes and can reject a file. Files must never be downloadable before that scanner accepts them. A private storage area is inaccessible through both static hosting and download routes; public storage is immediately accessible. File type checks alone do not satisfy the scanner policy.'],stem:'Which storage lifecycle satisfies the publication requirement?',options:[o('publish-delete','Store in public storage with a random name; delete it if scanning rejects it.','The file is public during the scan, even if the name is difficult to guess.','Treating an unpredictable URL as an authorization boundary.'),o('quarantine','Store privately; publish only after the scanner records acceptance.','The unaccepted file never enters the public serving path.'),o('extension','Store publicly with a .pending extension; rename after acceptance.','The stated public storage serves the pending filename too.','Assuming a filename suffix prevents downloads.'),o('mime-first','Check the PDF signature; publish immediately and scan in the background.','The signature check does not replace the required scanner decision.','Substituting a preliminary format check for a later mandatory acceptance gate.')],key:'quarantine',explanation:'The decisive boundary is whether the serving path can reach unaccepted bytes. Private quarantine makes scan acceptance a prerequisite for publication.',trace:'Before acceptance the private file is unreachable. A rejection leaves it private or deletes it; only acceptance moves or copies it into public serving storage.',validation:{kind:'document-review',rule:'Unaccepted bytes must have no public serving path; scanning is asynchronous and mandatory.',optionAudit:{'publish-delete':'Has an exposure window before rejection.','quarantine':'No public path exists until acceptance.','extension':'Public storage serves the pending filename.','mime-first':'Format checking is not scanner acceptance.'}},references:['https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html']}),
q({id:'PHP-E26-0294',format:'A',level:'M',topic:19,subtopic:'composer-runtime-dependency-scope',objective:'Declare a package used by production code in Composer’s runtime dependency set.',reason:'Trace a clean --no-dev installation rather than relying on a developer’s populated vendor directory.',prerequisites:['Composer require versus require-dev','Dependency locks','Clean production installs'],assumptions:['Composer 2 installs the application root with composer install --no-dev. A newly added runtime adapter directly instantiates Acme\\Codec\\Decoder from package acme/codec. No other required package depends on acme/codec. The application and its lock file must declare everything needed at runtime.'],stem:'Where should acme/codec be declared so a clean production installation provides the adapter’s dependency?',options:[o('dev','In require-dev, because tests also exercise the adapter.','--no-dev omits the only dependency path that would install the package.','Classifying a runtime dependency by its use in tests.'),o('suggest','In suggest, because the adapter can describe the missing package.','Suggestions are informational and do not install required runtime code.','Treating suggested packages as automatically installed dependencies.'),o('autoload','In autoload.psr-4, with a path under vendor/acme/codec.','An autoload rule does not download or resolve a package dependency.','Confusing class discovery with dependency installation.'),o('require','In require, followed by a matching reviewed lock-file update.','The package becomes part of the production dependency graph and reproducible installation.')],key:'require',explanation:'require declares runtime dependencies. require-dev is reserved for development-only requirements and is excluded by --no-dev; autoload settings solve a different problem.',trace:'A clean production install resolves the locked require graph, installs acme/codec and generates its autoload rules.',validation:{kind:'document-review',rule:'Composer --no-dev skips require-dev; require dependencies remain installed.',optionAudit:{dev:'Excluded by the specified install mode.',suggest:'Not an installation requirement.',autoload:'Does not acquire the package.',require:'Declares and locks the runtime dependency.'}},references:['https://getcomposer.org/doc/04-schema.md#require','https://getcomposer.org/doc/03-cli.md#install-i']}),
q({id:'PHP-E26-0295',format:'A',level:'M',topic:25,subtopic:'bounded-memory-export-pipeline',objective:'Keep an export pipeline’s retained data independent of total row count.',reason:'Evaluate where apparently streaming code still materializes the complete result.',prerequisites:['PDO fetch loops','Generators','Memory complexity','Synchronous stream writes'],assumptions:['A PDO driver is configured for unbuffered row retrieval. Each row is at most 4 KB, the output sink writes synchronously without retaining prior writes, and all writes succeed. The export contains millions of rows. The application must retain only a bounded number of rows and emit them in query order.'],stem:'Which pipeline meets the stated memory constraint?',options:[o('incremental','Fetch one row, encode it, write it, then fetch the next row.','With the stated driver and sink, only the current row and its encoding need to remain live.'),o('fetch-all','Call fetchAll, then yield each fetched row from a generator.','The generator wraps an already materialized array containing every row.','Assuming a generator can undo memory already retained by fetchAll.'),o('collect-lines','Fetch rows individually, append encoded lines to an array, then write the array.','The accumulated output grows with the total row count.','Measuring input buffering while ignoring retained output.'),o('materialize-generator','Yield rows directly from PDO, then call iterator_to_array before writing.','Materialization retains the complete generated sequence.','Treating a lazy source as sufficient even when its consumer eagerly collects it.')],key:'incremental',explanation:'Bounded memory is an end-to-end property of the pipeline. A streaming producer does not help if an intermediate or consumer retains all rows or encoded output.',trace:'The incremental pipeline releases each row before the next iteration; the other pipelines contain an explicit collection proportional to total records.',validation:{kind:'document-review',rule:'Unbuffered input and a nonretaining synchronous sink permit bounded retention only if intermediate stages do not collect the whole export.',optionAudit:{incremental:'At most current row and encoding are retained.','fetch-all':'The complete input array remains retained.','collect-lines':'The complete encoded output array grows.','materialize-generator':'iterator_to_array stores every yielded row.'}},references:['https://www.php.net/manual/en/pdostatement.fetch.php','https://www.php.net/manual/en/pdostatement.fetchall.php','https://www.php.net/manual/en/function.iterator-to-array.php']}),
q({id:'PHP-E26-0296',format:'A',level:'M',topic:20,subtopic:'request-log-allowlist-boundary',objective:'Design request logging that excludes credentials even when new request fields are introduced.',reason:'Evaluate default inclusion versus default exclusion at a sensitive data boundary.',prerequisites:['Structured logging','Request metadata','Allowlist versus denylist'],lessons:[21],coverageComplete:false,assumptions:['The service may receive passwords, cookies and bearer tokens in headers or bodies. Request schemas can gain new sensitive fields without a logging-code update. Logs need only a server-generated request ID, the validated HTTP method and a router-owned static route template. These three values contain no request credentials.'],stem:'Which logging policy meets that requirement as request schemas evolve?',options:[o('blacklist','Serialize the request after deleting password, Cookie and Authorization fields.','A newly introduced credential field will still be included by default.','Assuming a fixed list of current secret names covers future request schemas.'),o('digest','Serialize the request but replace every scalar value with its SHA-256 digest.','This still records credential-derived data and permits guessing low-entropy values.','Treating unsalted hashing of all request values as equivalent to excluding credentials.'),o('allowlist','Construct a log record from request ID, method and route template only.','Only the three explicitly permitted metadata values enter the log.'),o('failure-only','Serialize full requests only when the response status is 400 or greater.','Failed authentication and validation requests can contain the same secrets.','Treating an error response as permission to log sensitive inputs.')],key:'allowlist',explanation:'Building a separate metadata record prevents new request fields from entering logs automatically. A denylist must anticipate every new sensitive field, which the requirements explicitly do not allow.',trace:'The logging input contains only the server-owned identifier and the two approved routing values; headers and bodies never cross that boundary.',validation:{kind:'document-review',rule:'Only the three specified nonsensitive metadata values are required; future request fields must be excluded by default.',optionAudit:{blacklist:'New sensitive fields remain included.',digest:'Credential-derived values are still recorded and may be guessable.',allowlist:'Only permitted metadata is constructed.', 'failure-only':'Failure status does not remove secrets.'}},references:['https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html']}),
q({id:'PHP-E26-0297',format:'A',level:'M',topic:15,subtopic:'append-only-keyset-pagination',objective:'Continue descending pagination without duplicates when new rows are prepended.',reason:'Use a stable key boundary instead of a position that moves as records are inserted.',prerequisites:['SQL ORDER BY and WHERE','Pagination cursors','PDO parameters'],assumptions:['An append-only table has unique increasing integer IDs; existing rows are never updated or deleted. Pages are ordered by id DESC. New inserts always have IDs greater than every existing ID. A client should continue through the rows present on its first page without repeats; newer rows can wait for a fresh traversal. All query parameters are safely bound.'],stem:'After a page ends at ID 120, which continuation rule remains correct if new rows are inserted before the next request?',options:[o('offset','Keep the same ORDER BY and use OFFSET equal to the number already returned.','New higher IDs shift old rows to later positions, so the offset can repeat them.','Assuming row positions remain fixed when rows are prepended.'),o('keyset','Use WHERE id < 120, ORDER BY id DESC, and the same page limit.','The strict boundary excludes the prior page and new higher IDs while preserving the remaining order.'),o('inclusive','Use WHERE id <= 120, ORDER BY id DESC, and the same page limit.','The final row of the previous page is included again.','Using an inclusive cursor boundary when the cursor row has already been delivered.'),o('newest','Use WHERE id > 120, ORDER BY id DESC, and the same page limit.','This selects previously seen higher IDs and newer inserts instead of the remaining older rows.','Reversing the cursor direction for a descending traversal.')],key:'keyset',explanation:'A cursor based on the last delivered immutable key is stable under the stated append-only model. Offset pagination tracks positions, which change when new high IDs appear.',trace:'Every remaining old row has id below 120. Newly inserted rows have larger IDs, so they cannot enter the continuation query.',validation:{kind:'document-review',rule:'Unique immutable IDs ordered descending; new rows receive only higher IDs; continuation must exclude the delivered cursor row.',optionAudit:{offset:'Prepending shifts offsets and repeats old rows.',keyset:'Strictly smaller IDs are exactly the remaining range.',inclusive:'Repeats ID 120.',newest:'Selects the wrong side of the cursor.'}},references:['https://www.sqlite.org/lang_select.html','https://www.php.net/manual/en/pdo.prepare.php']}),
q({id:'PHP-E26-0298',format:'A',level:'A',topic:14,subtopic:'jwt-algorithm-policy-key-binding',objective:'Separate untrusted token metadata from the verifier’s trusted algorithm and key policy.',reason:'Analyze a verifier boundary where the attacker controls algorithm claims but must not control verification policy.',prerequisites:['JWT signature verification (advanced)','Asymmetric versus symmetric keys','Issuer and audience validation'],assumptions:['A PHP API accepts JWTs from one configured issuer, using RS256 and a pinned RSA public key. A maintained JWT library supports many algorithms, including HS256. The token header is untrusted until verified. Issuer, audience and expiry checks are already mandatory; the question concerns signature configuration only.'],stem:'Which verifier configuration preserves the issuer’s signature policy?',options:[o('header-select','Select any library-supported algorithm from the token header and pass the pinned key.','The token would choose a verification mode outside the issuer policy, including a different key interpretation.','Equating library support with permission for this issuer.'),o('decode-first','Decode the payload; require the configured issuer before accepting the token as signed.','An unverified payload can claim the configured issuer without a valid signature.','Treating a signed-looking claim as evidence that its signature was checked.'),o('fixed-policy','Require RS256 and an RSA verification key bound to the configured issuer.','The trusted configuration controls the permitted algorithm and matching key type.'),o('family','Allow RS256 or HS256 when the header names the same configured key ID.','A key ID does not authorize changing an RSA verification key into an HMAC secret.','Treating key identification as an algorithm authorization decision.')],key:'fixed-policy',explanation:'The verifier must enforce a trusted algorithm allowlist and compatible keys for the issuer. Token metadata may identify a permitted configuration, but cannot expand that policy.',trace:'A header requesting HS256 is rejected before it can cause reinterpretation of the pinned RSA key. Payload claim checks follow successful signature verification.',validation:{kind:'document-review',rule:'RFC 8725 requires algorithm verification and appropriate key use; this issuer permits only RS256 with its pinned RSA verification key.',optionAudit:{'header-select':'Lets an attacker expand the permitted algorithms.','decode-first':'Does not verify the signature.','fixed-policy':'Enforces the configured algorithm and key association.',family:'Key ID equality does not make a different algorithm valid.'}},references:['https://www.rfc-editor.org/rfc/rfc8725.html#section-3.1']}),
q({id:"PHP-E26-0299",format:"A",level:"M",topic:25,subtopic:"long-running-worker-code-replacement",objective:"Separate bytecode cache invalidation from replacing class definitions in a running worker.",reason:"Account for process lifetime, existing objects and safe job boundaries during code rollout.",prerequisites:["Long-running PHP CLI workers","Class declaration lifetime","OPcache"],assumptions:["A worker loads Processor once, constructs one instance and handles many jobs in the same PHP process. A new release changes Processor methods without changing its fully qualified class name. No runtime class-patching extension is installed. In-flight jobs must finish on their original release; later jobs must use the new release. Immutable release directories are available."],stem:"Which rollout mechanism satisfies those process-lifetime requirements?",options:[o("replace-workers","Drain old workers after their current jobs; start new workers from the new release.","Fresh processes load the new class definitions while old jobs finish with their existing code.",null),o("invalidate","Call opcache_invalidate for Processor.php and keep dispatching through the existing object.","Invalidating cached bytecode does not replace methods of an already loaded class or existing object.","Treating the bytecode cache as the running process’s mutable class table."),o("require-again","Require the new Processor.php after each job in the same worker process.","Redeclaring the same class name is not a supported replacement mechanism.","Assuming require can overwrite an existing class declaration."),o("reconstruct","Unset the Processor instance and instantiate Processor again in the same process.","The class definition remains loaded even after its instances are released.","Confusing object lifetime with class-definition lifetime.")],key:"replace-workers",explanation:"A loaded class definition belongs to the running process. Replacing processes at job boundaries changes code without attempting to redefine classes underneath in-flight work.",trace:"Old processes finish and exit. New processes load the new release’s Processor definition before constructing their instances.",validation:{"kind":"document-review","rule":"Without a class-patching extension, loading the same fully qualified class again does not replace it; OPcache invalidation concerns cached script bytecode.","optionAudit":{"replace-workers":"New process obtains new definitions at a safe boundary.","invalidate":"Existing objects and loaded definitions are unchanged.","require-again":"Attempts a duplicate class declaration.","reconstruct":"Creates an object of the still-loaded old definition."}},references:["https://www.php.net/manual/en/function.opcache-invalidate.php","https://www.php.net/manual/en/language.oop5.basic.php"],revision:2}),
q({id:"PHP-E26-0300",format:"A",level:"A",topic:10,subtopic:"rename-stable-lock-identity",objective:"Choose a lock identity that remains shared when data files are atomically replaced.",reason:"Trace coordination across pathname replacement and already-open file handles.",prerequisites:["flock advisory locking (advanced)","Atomic rename","File identity versus pathname","Read-modify-write critical sections"],lessons:[20],coverageComplete:false,assumptions:["On the stated local POSIX filesystem, same-directory rename atomically replaces the data pathname. All writers cooperate, all I/O succeeds, and crash durability is outside scope. Writers must serialize the entire read-modify-replace operation. A separate lock file is available and is never renamed or deleted."],stem:"Workers replace state.json by writing a temporary file and renaming it over state.json. Which locking protocol keeps all writers in one critical section?",options:[o("data-lock","Open and lock state.json, then read, write a temporary file and rename it over state.json.","After replacement, another worker can open and lock the new file while the first still holds a lock on the old file.","Assuming a lock follows a pathname through replacement."),o("temp-lock","Lock each worker’s temporary file before writing and renaming it over state.json.","Different temporary files have different locks, so writers do not contend.","Treating exclusive locks on different resources as shared coordination."),o("after-rename","Read and replace state.json, then lock the newly opened state.json before returning.","The read-modify-replace sequence has already run without mutual exclusion.","Acquiring a lock after the operation it must protect."),o("stable-lock","Lock the permanent lock file before reading state.json; release it after replacement.","Every writer contends on one unchanged file identity across data-file replacements.",null)],key:"stable-lock",explanation:"The synchronization object must outlive each replaceable data-file instance. A separate stable lock file gives every cooperating writer the same lock throughout the complete operation.",trace:"Writer B blocks on the permanent lock while A reads and replaces state.json. Once A releases it, B opens the current data file and performs the next update.",validation:{"kind":"document-review","rule":"Under the stated POSIX identity model, replacement changes the data file object but not a separate permanent lock object.","optionAudit":{"data-lock":"Old and new data objects can be locked independently.","temp-lock":"Each writer locks its own unrelated object.","after-rename":"The protected work occurs before acquisition.","stable-lock":"All writers share an invariant lock identity for the full critical section."}},references:["https://www.php.net/manual/en/function.flock.php","https://www.php.net/manual/en/function.rename.php"],revision:2}),
];
