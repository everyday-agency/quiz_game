import {q,file,option as o,ref} from './record.mjs';
export default [
q({id:'PHP-E26-0101',format:'E',level:'F',topic:5,subtopic:'and-versus-double-ampersand-assignment',objective:'Predict how assignment groups with and versus &&.',reason:'Apply two documented precedence levels to otherwise identical boolean expressions.',prerequisites:['Boolean operators','Assignment precedence'],lessons:[2],coverageComplete:true,stem:'What JSON is printed after the two assignments?',files:[file(`$first = true && false;
$second = true and false;

echo json_encode([$first, $second]);`)],options:[o('both-false','[false,false]','and has lower precedence than assignment, so the second assignment happens before the and expression.','Assuming synonymous boolean operators have identical precedence.'),o('different','[false,true]','&& groups before assignment; assignment groups before and.'),o('both-true','[true,true]','The first assignment receives the complete false result of true && false.','Assuming assignment always binds before boolean operators.'),o('reversed','[true,false]','This reverses the precedence relationship of the two operators.','Attributing the lower precedence to && instead of and.')],key:'different',explanation:'The first statement assigns the result of true && false. In the second, true is assigned to second before the and expression is evaluated.',trace:'first becomes false. second becomes true; the false result of the following and expression is unused.',validation:{kind:'output',stdout:'[false,true]'},references:['https://www.php.net/manual/en/language.operators.precedence.php'] }),
q({id:'PHP-E26-0102',format:'E',level:'F',topic:5,subtopic:'exponentiation-before-unary-minus',objective:'Distinguish a negated power from a power of a negative base.',reason:'Use explicit parentheses to identify which operation the unary minus applies to.',prerequisites:['Exponentiation','Unary minus','Parentheses'],lessons:[2],coverageComplete:true,stem:'What pair of integers is printed?',files:[file(`$left = -2 ** 2;
$right = (-2) ** 2;

echo json_encode([$left, $right]);`)],options:[o('both-positive','[4,4]','Without parentheses, exponentiation binds before unary minus.','Assuming the leading minus is always part of the exponentiation base.'),o('both-negative','[-4,-4]','The parenthesized negative base squared produces positive four.','Applying the outer-negation interpretation despite explicit parentheses.'),o('reversed','[4,-4]','This reverses which expression has a negative base and which negates a result.','Reading parentheses as changing the exponent rather than the base.'),o('grouping','[-4,4]','The first expression is -(2 ** 2); the second squares -2.')],key:'grouping',explanation:'Exponentiation has higher precedence than unary minus. Parentheses make the minus part of the base in the second expression.',trace:'left is -4. right multiplies -2 by -2 and is 4.',validation:{kind:'output',stdout:'[-4,4]'},references:['https://www.php.net/manual/en/language.operators.precedence.php'] }),
q({id:'PHP-E26-0103',format:'E',level:'F',topic:6,subtopic:'switch-loose-versus-match-strict-selection',objective:'Compare switch and match selection for a string zero against boolean and integer alternatives.',reason:'Apply the different comparison rules to the same subject and ordered alternatives.',prerequisites:['switch','match','Loose and strict comparisons'],lessons:[1,3],coverageComplete:true,stem:'What JSON pair is printed? Each switch case has an explicit break.',files:[file(`$value = '0';

switch ($value) {
    case false:
        $fromSwitch = 'boolean';
        break;
    case 0:
        $fromSwitch = 'integer';
        break;
    default:
        $fromSwitch = 'string';
}

$fromMatch = match ($value) {
    false => 'boolean',
    0 => 'integer',
    '0' => 'string',
};

echo json_encode([$fromSwitch, $fromMatch]);`)],options:[o('different','["boolean","string"]','switch uses loose comparison and selects false first; match requires the string arm.'),o('integer-string','["integer","string"]','The earlier false case already matches the string zero loosely.','Assuming switch prefers numeric comparison over an earlier matching boolean case.'),o('both-string','["string","string"]','switch does not use match’s strict comparison rule.','Treating switch and match as equivalent selectors.'),o('both-boolean','["boolean","boolean"]','match does not coerce the string zero to a boolean.','Extending switch’s loose comparison rule to match.')],key:'different',explanation:'switch compares cases loosely and stops at the first matching case. match compares both type and value strictly.',trace:'The string zero is falsy for the first switch comparison. In match it is neither false nor integer zero, so the string arm is selected.',validation:{kind:'output',stdout:'["boolean","string"]'},references:['https://www.php.net/manual/en/control-structures.switch.php','https://www.php.net/manual/en/control-structures.match.php'] }),
q({id:'PHP-E26-0104',format:'E',level:'F',topic:4,subtopic:'foreach-value-variable-assignment',objective:'Distinguish assigning the by-value foreach variable from changing array elements.',reason:'Track the iteration variable and source array as separate values.',prerequisites:['foreach by value','Arrays','Assignment'],lessons:[4],coverageComplete:true,stem:'What JSON describes values and the final iteration variable after this loop?',files:[file(`$values = [2, 3];

foreach ($values as $value) {
    $value *= 10;
}

echo json_encode([$values, $value]);`)],options:[o('mutated','[[20,30],30]','The loop does not bind value by reference, so its assignments do not update the array.','Assuming foreach variables are always aliases to source elements.'),o('last-original','[[2,3],3]','The local iteration variable is multiplied during the final iteration and remains 30 afterward.','Assuming the iteration variable reverts to its source value after the body.'),o('separate','[[2,3],30]','The array stays unchanged while the last copied iteration value becomes 30.'),o('last-only','[[2,30],30]','Neither source element is assigned through a reference or an indexed write.','Assuming only the final foreach variable is linked back to the array.')],key:'separate',explanation:'A by-value foreach assigns each element’s value to the loop variable. Modifying that variable changes the copy, and the variable remains defined after the loop.',trace:'The copied values become 20 and then 30 in successive iterations. The original array remains [2,3].',validation:{kind:'output',stdout:'[[2,3],30]'},references:['https://www.php.net/manual/en/control-structures.foreach.php'] }),
q({id:'PHP-E26-0105',format:'E',level:'F',topic:4,subtopic:'keyed-array-destructuring-order',objective:'Read explicitly keyed array destructuring independently of target order.',reason:'Resolve two requested keys rather than consuming successive source positions.',prerequisites:['Array destructuring','Integer keys'],lessons:[4],coverageComplete:true,stem:'What JSON is printed by these explicitly keyed destructuring assignments?',files:[file(`$values = [10, 20, 30];

[2 => $last, 0 => $first] = $values;

echo json_encode([$last, $first]);`)],options:[o('sequential','[10,20]','Explicit keys select positions 2 and 0, not the next two values in sequence.','Ignoring keys on the destructuring side.'),o('selected','[30,10]','last receives key 2 and first receives key 0.'),o('source-order','[10,30]','The echo order is last then first, so selected values are not reordered into source order.','Reordering targets according to source positions.'),o('one-based','[20,null]','PHP’s list keys are zero-based, and key 0 exists with value 10.','Applying one-based indexing to keyed destructuring.')],key:'selected',explanation:'Keys on the left side of destructuring explicitly identify which source entries to assign. Target order does not change those lookups.',trace:'last becomes 30 from key 2, and first becomes 10 from key 0.',validation:{kind:'output',stdout:'[30,10]'},references:['https://www.php.net/manual/en/language.types.array.php#language.types.array.syntax.destructuring'] }),
q({id:'PHP-E26-0106',format:'E',level:'F',topic:7,subtopic:'array-default-independent-function-calls',objective:'Predict independent array default values across ordinary function calls.',reason:'Separate a parameter’s default array from persistent static storage.',prerequisites:['Default arguments','Array value semantics'],lessons:[4,5],coverageComplete:true,stem:'What JSON is printed after the two calls that omit items?',files:[file(`function appendItem(array $items = []): array
{
    $items[] = 'x';

    return $items;
}

echo json_encode([appendItem(), appendItem()]);`)],options:[o('accumulate','[["x"],["x","x"]]','Mutating the first call’s local array does not change the default for later calls.','Importing persistent mutable-default behavior from another language.'),o('both-final','[["x","x"],["x","x"]]','The returned arrays are separate values and no shared reference connects them.','Assuming both calls return aliases to one shared default array.'),o('empty','[[],[]]','Each function call appends x to its own parameter value before returning.','Assuming a default argument cannot be modified inside the function.'),o('fresh','[["x"],["x"]]','Each omitted argument starts from an empty array and each local append produces one element.')],key:'fresh',explanation:'An ordinary array default does not accumulate modifications across calls. Persistent state would need an explicit mechanism such as a static local variable or shared reference.',trace:'Each call receives [], appends x locally and returns [x].',validation:{kind:'output',stdout:'[["x"],["x"]]'},references:['https://www.php.net/manual/en/functions.arguments.php#functions.arguments.default'] }),
q({id:'PHP-E26-0107',format:'E',level:'F',topic:7,subtopic:'func-get-args-named-parameter-order',objective:'Identify the order exposed by func_get_args after named argument binding.',reason:'Distinguish call-site named order from declaration-order parameter binding.',prerequisites:['Named arguments','func_get_args'],lessons:[5],coverageComplete:true,stem:'What JSON does inspect print for this named-argument call?',files:[file(`function inspect(int $first, int $second): void
{
    echo json_encode(func_get_args());
}

inspect(second: 20, first: 10);`)],options:[o('parameters','[10,20]','Named arguments bind to parameters, and func_get_args exposes the resulting declaration order.'),o('call-order','[20,10]','The named call order does not reorder the function’s declared parameters.','Treating func_get_args as a token-level record of call-site order.'),o('named-map','{"second":20,"first":10}','func_get_args returns a positional array here, not the named variadic argument map.','Applying unmatched variadic-key preservation to declared parameters.'),o('declaration-map','{"first":10,"second":20}','The values follow declaration order, but the array uses numeric keys rather than parameter names.','Assuming reflection-style parameter names become func_get_args keys.')],key:'parameters',explanation:'Named arguments are resolved to their declared parameters before the body executes. func_get_args reports the resulting positional argument sequence for these parameters.',trace:'first is bound to 10 and second to 20, producing [10,20].',validation:{kind:'output',stdout:'[10,20]'},references:['https://www.php.net/manual/en/function.func-get-args.php'] }),
q({id:'PHP-E26-0108',format:'E',level:'F',topic:2,subtopic:'constant-visibility-versus-local-variable-scope',objective:'Distinguish a globally declared constant from a same-purpose local variable.',reason:'Track constant lookup, a function-local assignment and the unchanged top-level variable.',prerequisites:['Constants','Function variable scope'],lessons:[2,6],coverageComplete:true,stem:'What JSON is printed? The function has no global declaration.',files:[file(`const LIMIT = 3;
$limit = 7;

function readLimit(): array
{
    $limit = 2;

    return [LIMIT, $limit];
}

echo json_encode([readLimit(), $limit]);`)],options:[o('global-mutated','[[3,2],2]','The function-local limit is not linked to the top-level variable.','Assuming matching variable names share storage across function scope.'),o('global-read','[[3,7],7]','The function explicitly assigns its own local limit to 2.','Ignoring the function-local assignment in favor of a global value.'),o('separate-scopes','[[3,2],7]','LIMIT is accessible as a constant; the function’s local limit is 2 and the global variable stays 7.'),o('constant-local','[[2,2],7]','Assigning limit does not redefine the distinct constant LIMIT.','Treating a variable assignment as modification of a similarly named constant.')],key:'separate-scopes',explanation:'Constants and variables use different lookup rules. The constant is accessible in the function, while its local variable is separate from the top-level variable unless explicitly connected.',trace:'readLimit returns [3,2]. The top-level limit remains 7.',validation:{kind:'output',stdout:'[[3,2],7]'},references:['https://www.php.net/manual/en/language.constants.php','https://www.php.net/manual/en/language.variables.scope.php'] }),
q({id:'PHP-E26-0109',format:'E',level:'M',topic:7,subtopic:'coercive-reference-parameter-updates-caller-type',objective:'Track scalar coercion of a by-reference parameter back into the caller’s variable.',reason:'Combine weak scalar argument conversion with reference aliasing and mutation.',prerequisites:['Scalar type declarations','References','Coercive calls'],lessons:[1,5],coverageComplete:true,stem:'This file does not declare strict_types. What type and value are printed after the call?',files:[file(`function increment(int &$number): void
{
    $number++;
}

$value = '7';
increment($value);

echo get_debug_type($value), '|', $value;`)],options:[o('string-mutated','string|8','The int parameter coerces the numeric string, and the reference makes that coerced value visible to the caller.','Assuming coercion occurs only in a separate local parameter copy.'),o('unchanged','string|7','Both the binding conversion and increment affect the referenced caller variable.','Treating a by-reference parameter as an isolated value.'),o('coerced-reference','int|8','Binding coerces the shared variable to int, and the body increments it to 8.'),o('strict-error','An uncaught TypeError','The call originates in a coercive file and the string is a valid integer representation.','Assuming a scalar type declaration always rejects numeric strings.')],key:'coerced-reference',explanation:'In a coercive call, a numeric string can satisfy an int parameter through conversion. Because the parameter is a reference, the caller’s variable receives the converted integer and subsequent mutation.',trace:'value changes from string 7 to integer 7 during binding, then to integer 8 in the function.',validation:{kind:'output',stdout:'int|8'},references:['https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict','https://www.php.net/manual/en/language.references.pass.php'] }),
q({id:'PHP-E26-0110',format:'E',level:'M',topic:7,subtopic:'reference-return-requires-reference-assignment',objective:'Distinguish copying a reference-returning function’s value from binding to its storage.',reason:'Track a persistent local through ordinary assignment and explicit reference assignment.',prerequisites:['Returning references','Static local variables','Assignment'],lessons:[5,6],coverageComplete:true,stem:'What JSON is printed after assigning through alias?',files:[file(`function &slot(): int
{
    static $value = 1;

    return $value;
}

$copy = slot();
$alias =& slot();
$alias = 5;

echo json_encode([$copy, slot()]);`)],options:[o('both-alias','[5,5]','The ordinary assignment to copy takes a value, not a reference binding.','Assuming a reference-returning function forces every caller to retain an alias.'),o('explicit-alias','[1,5]','copy keeps 1, while alias is bound to slot’s persistent storage and changes it to 5.'),o('neither-alias','[1,1]','The explicit =& assignment does bind to the function’s returned reference.','Ignoring reference binding at the receiving assignment.'),o('copy-only','[5,1]','This reverses which assignment creates an alias and which creates a value copy.','Treating the reference marker as a copy instruction.')],key:'explicit-alias',explanation:'Returning by reference makes storage available for binding, but the caller must also use reference assignment to retain that alias. Ordinary assignment copies the current value.',trace:'copy receives integer 1. alias links to the static value. Assigning 5 through alias changes later slot reads but leaves copy unchanged.',validation:{kind:'output',stdout:'[1,5]'},references:['https://www.php.net/manual/en/language.references.return.php'] }),
q({id:'PHP-E26-0111',format:'E',level:'M',topic:8,subtopic:'closure-static-state-per-closure-instance',objective:'Track static local state shared by aliases of one Closure but separate in another Closure instance.',reason:'Combine closure construction identity, object aliasing and persistent local storage.',prerequisites:['Closures','Static local variables','Object assignment'],lessons:[6,7,23],coverageComplete:true,stem:'What JSON is printed by the three callback invocations?',files:[file(`function counter(): Closure
{
    return function (): int {
        static $count = 0;

        return ++$count;
    };
}

$first = counter();
$alias = $first;
$second = counter();

echo json_encode([$first(), $alias(), $second()]);`)],options:[o('all-shared','[1,2,3]','The separately constructed Closure has its own static local storage.','Assuming every Closure created from one source expression shares one static counter.'),o('all-reset','[1,1,1]','Calls through first and alias target the same Closure, whose static local persists.','Treating static local state as an ordinary per-call local.'),o('construction-count','[2,3,2]','Creating the Closure does not execute its body or increment its counter.','Counting callback construction as callback invocation.'),o('per-instance','[1,2,1]','first and alias share one Closure; second is a distinct Closure with its own counter.')],key:'per-instance',explanation:'Each created Closure has its own static local state. Assigning the Closure object to another variable shares that same Closure rather than creating a new one.',trace:'The first Closure advances to 1 and then 2. The separately created second Closure advances from 0 to 1.',validation:{kind:'output',stdout:'[1,2,1]'},references:['https://www.php.net/manual/en/language.variables.scope.php#language.variables.scope.static','https://www.php.net/manual/en/functions.anonymous.php'] }),
q({id:'PHP-E26-0112',format:'E',level:'M',topic:4,subtopic:'recursive-array-replacement-list-indexes',objective:'Predict recursive replacement of indexed entries and explicit null values.',reason:'Apply replacement by key at multiple nesting levels rather than concatenating or replacing an entire list.',prerequisites:['Nested arrays','array_replace_recursive','Null values'],lessons:[4],coverageComplete:true,stem:'What JSON is printed by this recursive replacement?',files:[file(`$defaults = [
    'ports' => [80, 443],
    'meta' => ['mode' => 'safe', 'tries' => 2],
];
$patch = [
    'ports' => [8080],
    'meta' => ['tries' => null],
];

echo json_encode(array_replace_recursive($defaults, $patch));`)],options:[o('key-replacement','{"ports":[8080,443],"meta":{"mode":"safe","tries":null}}','Index 0 is replaced, index 1 remains, and explicit null replaces tries.'),o('whole-list','{"ports":[8080],"meta":{"mode":"safe","tries":null}}','Recursive replacement operates by keys and leaves the unmatched index 1.','Assuming a nested list is replaced as one indivisible value.'),o('append-list','{"ports":[80,443,8080],"meta":{"mode":"safe","tries":null}}','The numeric index is replaced rather than appended.','Applying array_merge-style numeric appending to replacement.'),o('skip-null','{"ports":[8080,443],"meta":{"mode":"safe","tries":2}}','Explicit null is a replacement value, not a signal to ignore the patch entry.','Treating null as absence during recursive replacement.')],key:'key-replacement',explanation:'array_replace_recursive replaces entries at matching keys and recursively handles arrays. Keys absent from the replacement remain, and null is an explicit value.',trace:'ports[0] becomes 8080 while ports[1] stays 443. meta.mode stays safe and meta.tries becomes null.',validation:{kind:'output',stdout:'{"ports":[8080,443],"meta":{"mode":"safe","tries":null}}'},references:['https://www.php.net/manual/en/function.array-replace-recursive.php'] }),
q({id:'PHP-E26-0113',format:'E',level:'M',topic:4,subtopic:'array-intersect-string-representation-equality',objective:'Apply array_intersect’s string-representation comparison while preserving original values and keys.',reason:'Distinguish this API’s equality rule from strict identity and general loose comparison.',prerequisites:['array_intersect','Scalar string conversion','JSON array keys'],lessons:[1,4],coverageComplete:true,stem:'What JSON is printed? The left array contains an integer, a leading-zero string, a boolean and a float.',files:[file(`$left = [1, '01', true, 1.0];
$right = ['1'];

echo json_encode(array_intersect($left, $right));`)],options:[o('strict','[]','array_intersect does not require the original operand types to be identical.','Applying strict identity to this API.'),o('loose','[1,"01",true,1]','The string 01 does not have the same string representation as 1.','Applying general numeric loose comparison instead of the API’s string comparison rule.'),o('representations','{"0":1,"2":true,"3":1}','Integer 1, true and float 1.0 each convert to the string 1; their original keys and values survive.'),o('converted','{"0":"1","2":"1","3":"1"}','String conversion is used for comparison, but the returned values keep their original types.','Assuming comparison normalization also transforms the returned values.')],key:'representations',explanation:'array_intersect considers values equal when their string representations are identical. It returns the original left-side values under their original keys.',trace:'Keys 0, 2 and 3 match the string 1. Key 1 contains 01 and is excluded, so JSON uses object form for the remaining nonsequential keys.',validation:{kind:'output',stdout:'{"0":1,"2":true,"3":1}'},references:['https://www.php.net/manual/en/function.array-intersect.php'] }),
q({id:'PHP-E26-0114',format:'E',level:'M',topic:8,subtopic:'null-array-map-zips-and-pads',objective:'Predict array_map with a null callback and unequal input lengths.',reason:'Track row-wise grouping and missing-value padding across multiple input arrays.',prerequisites:['array_map','Multiple input arrays','Null callback behavior'],lessons:[4,8],coverageComplete:true,stem:'What JSON is printed by this null-callback mapping?',files:[file(`$letters = ['a', 'b'];
$numbers = [1];

echo json_encode(array_map(null, $letters, $numbers));`)],options:[o('shortest','[["a",1]]','The result continues to the longest input, rather than stopping at the shortest.','Assuming zip truncates to the shortest array.'),o('padded','[["a",1],["b",null]]','A null callback groups corresponding values, padding the missing second number with null.'),o('flat','["a","b",1]','Null callback mapping groups corresponding positions; it does not concatenate the arrays.','Treating a missing callback as a merge request.'),o('repeat','[["a",1],["b",1]]','A shorter input is padded with null, not its final value.','Assuming the last available input value is reused.')],key:'padded',explanation:'With null as callback, array_map groups values at corresponding positions. Multiple-array mapping continues through the longest input and supplies null for missing values.',trace:'The first group is a and 1. The second group is b and a missing number, represented by null.',validation:{kind:'output',stdout:'[["a",1],["b",null]]'},references:['https://www.php.net/manual/en/function.array-map.php'] }),
q({id:"PHP-E26-0115",format:"E",level:"M",topic:4,subtopic:"array-splice-positional-removal-and-reindexing",objective:"Track both the mutated array and removed entries from a positional splice.",reason:"Combine insertion order, positional offsets, replacement-key handling and numeric-key reindexing.",prerequisites:["array_splice","Mixed array keys","Mutation and return values"],lessons:[4],coverageComplete:true,stem:"What JSON does the displayed splice operation print?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$values = ['a' => 1, 5 => 2, 'b' => 3, 9 => 4];
$removed = array_splice($values, 1, 2, ['x' => 8]);

echo json_encode([$values, $removed]);
`}],options:[o("preserve-all","[{\"a\":1,\"x\":8,\"9\":4},{\"5\":2,\"b\":3}]","Numeric keys are reindexed and the replacement’s x key is not preserved.","Assuming splice retains every original and replacement key."),o("remove-by-key","[{\"a\":1,\"5\":2,\"b\":3,\"9\":4},[]]","Offset 1 selects the second position even though key 1 is absent.","Treating the offset as a key lookup."),o("return-mutated","[{\"a\":1,\"0\":8,\"1\":4},{\"a\":1,\"0\":8,\"1\":4}]","The return contains removed entries, not a copy of the updated input.","Confusing the in-place mutation with the function’s return value."),o("splice-rules","[{\"a\":1,\"0\":8,\"1\":4},{\"0\":2,\"b\":3}]","The second and third entries are removed; numeric keys are reindexed and x is discarded.",null)],key:"splice-rules",explanation:"array_splice addresses positions, modifies the input and returns the removed entries. Numeric keys are renumbered, string keys of existing entries are retained, and replacement keys are not preserved.",trace:"Values 2 and 3 are removed. Value 8 is inserted in their place. The remaining numeric values receive keys 0 and 1, and the removed numeric value receives key 0.",validation:{"kind":"output","stdout":"[{\"a\":1,\"0\":8,\"1\":4},{\"0\":2,\"b\":3}]"},references:["https://www.php.net/manual/en/function.array-splice.php"],revision:2}),
q({id:'PHP-E26-0116',format:'E',level:'M',topic:11,subtopic:'parse-str-normalized-name-collision',objective:'Predict query parsing when normalized field names collide and bracket syntax builds a list.',reason:'Combine PHP name normalization, later-value replacement and array input notation.',prerequisites:['Query strings','parse_str','Bracketed field names'],lessons:[13],coverageComplete:false,stem:'What JSON is printed by parsing this fixed query string? No external request data is used.',files:[file(`parse_str('a.b=first&a_b=second&items[]=x&items[]=y', $values);

echo json_encode($values);`)],options:[o('normalized','{"a_b":"second","items":["x","y"]}','The dot normalizes to an underscore, the later scalar replaces the same key, and brackets build a list.'),o('distinct-names','{"a.b":"first","a_b":"second","items":["x","y"]}','parse_str normalizes dots in field names to underscores.','Assuming query field names are preserved byte-for-byte.'),o('scalar-array','{"a_b":["first","second"],"items":["x","y"]}','Repeated scalar keys do not automatically collect into an array without bracket notation.','Applying bracket-array accumulation to ordinary duplicate keys.'),o('last-item','{"a_b":"second","items":"y"}','The explicit [] notation accumulates both item values into an array.','Treating bracketed fields as ordinary repeated scalar fields.')],key:'normalized',explanation:'PHP query parsing normalizes dots and spaces in names to underscores. A later scalar assignment to the normalized key replaces the earlier one, while [] explicitly appends array elements.',trace:'a.b becomes a_b and is then overwritten by second. The two items[] fields append x and y.',validation:{kind:'output',stdout:'{"a_b":"second","items":["x","y"]}'},references:['https://www.php.net/manual/en/function.parse-str.php'] }),
q({id:'PHP-E26-0117',format:'E',level:'M',topic:2,subtopic:'extract-skip-existing-variable-count',objective:'Track EXTR_SKIP imports and extract’s count without overwriting an existing local variable.',reason:'Distinguish imported entries from skipped collisions in the current symbol table.',prerequisites:['Variable scope','extract flags','Import counts'],lessons:[2,6],coverageComplete:false,stem:'What JSON is printed? The array is a fixed local fixture, not untrusted input.',files:[file(`$name = 'local';
$loaded = extract(['name' => 'input', 'other' => 'extra'], EXTR_SKIP);

echo json_encode([$name, $other, $loaded]);`)],options:[o('overwrite','["input","extra",2]','EXTR_SKIP prevents overwriting the existing name variable.','Applying the default overwrite behavior despite the explicit flag.'),o('count-attempts','["local","extra",2]','The count includes successfully imported variables, not skipped input entries.','Counting attempted imports rather than completed imports.'),o('skip-collision','["local","extra",1]','name is skipped, other is imported and the successful import count is 1.'),o('skip-all','["local",null,0]','A collision on one entry does not cancel imports of the other entries.','Treating EXTR_SKIP as an all-or-nothing import policy.')],key:'skip-collision',explanation:'extract with EXTR_SKIP leaves existing variable names unchanged and imports noncolliding names. Its return count reflects successful imports only.',trace:'name remains local. other is created as extra. Exactly one variable was imported.',validation:{kind:'output',stdout:'["local","extra",1]'},references:['https://www.php.net/manual/en/function.extract.php'] }),
q({id:'PHP-E26-0118',format:'E',level:'M',topic:11,subtopic:'http-query-rfc3986-null-boolean-array-encoding',objective:'Predict explicit RFC 3986 query encoding for null, boolean and array values.',reason:'Combine omission, scalar normalization, bracketed indices and percent encoding under stated flags.',prerequisites:['http_build_query','RFC 3986 encoding','PHP arrays'],lessons:[13],coverageComplete:false,stem:'What exact query string is printed? The separator and RFC 3986 encoding mode are supplied explicitly.',files:[file(`$query = [
    'q' => 'a b',
    'flag' => false,
    'missing' => null,
    'tags' => ['x/y'],
];

echo http_build_query($query, '', '&', PHP_QUERY_RFC3986);`)],options:[o('form-space','q=a+b&flag=0&tags%5B0%5D=x%2Fy','RFC 3986 mode encodes spaces as %20, not plus.','Applying the default form-style space encoding despite the explicit mode.'),o('rfc3986','q=a%20b&flag=0&tags%5B0%5D=x%2Fy','The space is %20, false becomes 0, null is omitted and the array index is bracket-encoded.'),o('null-empty','q=a%20b&flag=0&missing=&tags%5B0%5D=x%2Fy','A null value is omitted rather than encoded as an empty string.','Equating null with an explicitly empty query value.'),o('boolean-word','q=a%20b&flag=false&tags%5B0%5D=x%2Fy','The boolean false is normalized to 0, not the word false.','Expecting JSON-like boolean spelling in PHP query construction.')],key:'rfc3986',explanation:'http_build_query omits null entries, normalizes booleans to integers and recursively encodes array indices. RFC 3986 mode uses percent encoding for spaces.',trace:'The retained fields are q, flag and tags[0] in insertion order. Their encoded values are a%20b, 0 and x%2Fy.',validation:{kind:'output',stdout:'q=a%20b&flag=0&tags%5B0%5D=x%2Fy'},references:['https://www.php.net/manual/en/function.http-build-query.php'] }),
q({id:'PHP-E26-0119',format:'E',level:'A',topic:3,subtopic:'reference-binding-incompatible-typed-properties',objective:'Predict rejection of one reference container shared by incompatible typed properties.',reason:'Combine scalar coercion requirements, typed-property references and failure atomicity.',prerequisites:['Typed properties','Reference containers (advanced)','Scalar coercion'],lessons:[1,23,24],coverageComplete:false,stem:'What JSON is printed after attempting to bind the float property to the integer property’s reference?',files:[file(`class Values
{
    public int $integer = 2;
    public float $decimal = 0.0;
}

$values = new Values();
$alias =& $values->integer;
$status = 'linked';

try {
    $values->decimal =& $alias;
} catch (TypeError $error) {
    $status = 'blocked';
}

$alias = 3;

echo json_encode([
    $status,
    get_debug_type($values->integer),
    $values->integer,
    get_debug_type($values->decimal),
    $values->decimal,
]);`)],options:[o('both-int','["linked","int",3,"float",3]','A float property cannot retain the int-typed reference value without a conflicting conversion.','Assuming numeric compatibility permits one reference to violate a property’s concrete stored type.'),o('blocked','["blocked","int",3,"float",0]','The incompatible reference binding fails, leaving decimal unchanged while alias still updates integer.'),o('both-float','["linked","float",3,"float",3]','Converting the shared storage to float would violate the integer property’s type.','Assuming the newest property’s type replaces earlier reference constraints.'),o('rollback-alias','["blocked","int",2,"float",0]','The failed second binding does not remove the existing alias to integer.','Assuming failure rolls back an earlier, already successful reference assignment.')],key:'blocked',explanation:'A reference shared by typed properties must satisfy every attached property constraint. Binding this int storage to a float property would require an incompatible stored value, so PHP rejects the new binding.',trace:'decimal remains 0.0. alias remains bound to integer, and assigning 3 through it changes integer to 3.',validation:{kind:'output',stdout:'["blocked","int",3,"float",0]'},references:['https://www.php.net/manual/en/language.oop5.properties.php','https://www.php.net/manual/en/language.references.php'] }),
q({id:"PHP-E26-0120",format:"E",level:"M",topic:17,subtopic:"anonymous-class-expression-identity",objective:"Distinguish repeated instances of one anonymous-class declaration from distinct anonymous classes.",reason:"Track source-level class identity separately from object identity and shared static state.",prerequisites:["Anonymous classes","Object identity","Static properties"],lessons:[23,30],coverageComplete:false,stem:"What JSON is printed? Both objects come from evaluating the same anonymous-class expression in makeCounter.",files:[{path:"main.php",kind:"complete-file",source:`<?php

function makeCounter(): object
{
    return new class {
        private static int $created = 0;

        public function __construct()
        {
            self::$created++;
        }

        public function created(): int
        {
            return self::$created;
        }
    };
}

$first = makeCounter();
$second = makeCounter();

echo json_encode([
    $first === $second,
    get_class($first) === get_class($second),
    $first->created(),
]);
`}],options:[o("per-evaluation-class","[false,false,1]","Reevaluating the same anonymous-class declaration creates another instance of the same class.","Assuming every evaluation creates a new class identity and static storage."),o("singleton","[true,true,2]","Each new expression execution constructs a distinct object even though the class is shared.","Confusing one anonymous class declaration with one singleton object."),o("instance-counter","[false,true,1]","created is static and is incremented by both constructors.","Treating a static property as per-instance storage."),o("same-class","[false,true,2]","The objects differ, their class is the same and both constructors increment its static count.",null)],key:"same-class",explanation:"An anonymous-class declaration defines a class even without a source-level name. Repeated evaluation of that declaration constructs different instances sharing its static class state.",trace:"The two new operations produce distinct objects. Their runtime class names match, and the shared created count reaches 2.",validation:{"kind":"output","stdout":"[false,true,2]"},references:["https://www.php.net/manual/en/language.oop5.anonymous.php"],revision:2}),
q({id:'PHP-E26-0121',format:'E',level:'A',topic:8,subtopic:'closure-binding-private-property-scope',objective:'Resolve same-named private properties using a bound Closure’s class scope.',reason:'Separate the bound object from the visibility scope controlling private property lookup.',prerequisites:['Closure::bind (advanced)','Private property slots','Inheritance'],lessons:[7,25,26],coverageComplete:false,stem:'What JSON is printed when the same object is read through Closures bound to two different class scopes?',files:[file(`class ParentLabel
{
    private string $label = 'parent';
}

class ChildLabel extends ParentLabel
{
    private string $label = 'child';
}

$object = new ChildLabel();
$read = function (): string {
    return $this->label;
};

$asParent = Closure::bind($read, $object, ParentLabel::class);
$asChild = Closure::bind($read, $object, ChildLabel::class);

echo json_encode([$asParent(), $asChild()]);`)],options:[o('scope-slots','["parent","child"]','Each bound class scope selects its own private property slot on the same object.'),o('runtime-class','["child","child"]','The object’s runtime class does not override the explicit parent visibility scope.','Assuming private property lookup always starts and ends at the most-derived class.'),o('parent-slot','["parent","parent"]','The child class has its own distinct private label slot accessible in child scope.','Assuming a child private declaration overwrites or aliases the parent’s private storage.'),o('outside-error','An uncaught Error for private property access','Closure::bind deliberately establishes the stated class scopes for these user-defined classes.','Ignoring the visibility scope assigned during binding.')],key:'scope-slots',explanation:'Private properties declared separately in parent and child classes occupy distinct slots. Closure binding controls both this and the class scope used for private access.',trace:'The parent-scoped Closure reads ParentLabel’s slot. The child-scoped Closure reads ChildLabel’s slot, although both use the same object.',validation:{kind:'output',stdout:'["parent","child"]'},references:['https://www.php.net/manual/en/closure.bind.php','https://www.php.net/manual/en/language.oop5.visibility.php'] }),
q({id:'PHP-E26-0122',format:'E',level:'A',topic:17,subtopic:'overloaded-property-array-versus-object-mutation',objective:'Distinguish indirect mutation of a by-value overloaded array from mutation of a returned object.',reason:'Combine magic property access, array value semantics, object identity and handled diagnostics.',prerequisites:['__get (advanced)','Indirect modification','Array and object semantics','Error handlers'],lessons:[4,21,23],coverageComplete:false,stem:'What JSON is printed? The explicit handler counts and handles diagnostics; __get does not return by reference.',files:[file(`class Bag
{
    private array $data;

    public function __construct()
    {
        $this->data = [
            'items' => [1],
            'state' => (object) ['value' => 1],
        ];
    }

    public function __get(string $name): mixed
    {
        return $this->data[$name];
    }

    public function snapshot(): array
    {
        return [$this->data['items'], $this->data['state']->value];
    }
}

$diagnostics = 0;
set_error_handler(function () use (&$diagnostics): bool {
    $diagnostics++;

    return true;
});

$bag = new Bag();
$bag->items[] = 2;
$bag->state->value = 2;

restore_error_handler();

echo json_encode([$bag->snapshot(), $diagnostics]);`)],options:[o('both-mutate','[[[1,2],2],0]','The by-value array cannot be indirectly modified through this overloaded property.','Assuming __get automatically provides reference access to stored arrays.'),o('neither-mutate','[[[1],1],2]','The returned object identifier still points to the stored state object, so its property mutation succeeds.','Treating returned objects as deep value copies.'),o('different-values','[[[1],2],1]','The array append has no effect and emits one handled diagnostic; the object mutation succeeds.'),o('array-only','[[[1,2],1],1]','This reverses the effect of array value semantics and object identity.','Assuming arrays are implicitly shared while returned objects are copied.')],key:'different-values',explanation:'A by-value __get result does not provide writable access to the stored array, so the indirect append is ineffective. Returning an object still returns its identifier, allowing mutation of that same object.',trace:'items remains [1], state.value becomes 2 and the attempted indirect array modification contributes one diagnostic.',validation:{kind:'output',stdout:'[[[1],2],1]'},references:['https://www.php.net/manual/en/language.oop5.overloading.php','https://www.php.net/manual/en/language.oop5.references.php'] }),
q({id:'PHP-E26-0123',format:'E',level:'A',topic:18,subtopic:'forwarding-parent-versus-explicit-static-call',objective:'Track late static binding through a forwarding parent call and a non-forwarding explicit class call.',reason:'Follow the called-class context across two inherited static call chains.',prerequisites:['Late static binding (advanced)','Forwarding calls','Inheritance'],lessons:[26,30],coverageComplete:false,stem:'What JSON class-name pair is printed by these inherited calls?',files:[file(`class BaseName
{
    public static function who(): string
    {
        return static::class;
    }
}

class MiddleName extends BaseName
{
    public static function viaParent(): string
    {
        return parent::who();
    }

    public static function viaName(): string
    {
        return BaseName::who();
    }
}

class LeafName extends MiddleName
{
}

echo json_encode([LeafName::viaParent(), LeafName::viaName()]);`)],options:[o('both-leaf','["LeafName","LeafName"]','The explicit BaseName call starts a non-forwarding call context and does not retain LeafName.','Assuming every nested static call forwards the original called class.'),o('forwarded','["LeafName","BaseName"]','parent:: forwards LeafName; naming BaseName explicitly resets the called-class context.'),o('both-base','["BaseName","BaseName"]','parent:: locates the parent method but forwards the current called class for static::.','Confusing method lookup location with late-bound called-class identity.'),o('middle-base','["MiddleName","BaseName"]','The forwarding call retains LeafName, not the class that declares viaParent.','Replacing the called class with the intermediate method’s declaring class.')],key:'forwarded',explanation:'parent:: is a forwarding static call: it selects the parent method while preserving late-bound called-class information. An explicit BaseName:: call is non-forwarding and establishes BaseName.',trace:'who sees LeafName on the first chain and BaseName on the second.',validation:{kind:'output',stdout:'["LeafName","BaseName"]'},references:['https://www.php.net/manual/en/language.oop5.late-static-bindings.php'] }),
q({id:'PHP-E26-0124',format:'E',level:'A',topic:21,subtopic:'lazy-ghost-nonlazy-property-and-initializer',objective:'Trace a non-lazy property write and later initialization of the remaining lazy object.',reason:'Separate property-level laziness from object-level initialization and subsequent explicit writes.',prerequisites:['PHP 8.4 lazy objects (advanced)','ReflectionProperty','Lazy initializer lifecycle'],stem:'What JSON is printed after reading id and then name from this lazy ghost? The initializer is shown in full.',files:[file(`class LazyUser
{
    public int $id;
    public string $name;
}

$runs = 0;
$class = new ReflectionClass(LazyUser::class);
$user = $class->newLazyGhost(function (LazyUser $user) use (&$runs): void {
    $runs++;
    $user->id = 99;
    $user->name = 'Ada';
});

$class->getProperty('id')->setRawValueWithoutLazyInitialization($user, 7);
$before = [$runs, $user->id, $class->isUninitializedLazyObject($user)];
$name = $user->name;

echo json_encode([$before, [$runs, $user->id, $name]]);`)],options:[o('eager-write','[[1,7,false],[1,7,"Ada"]]','The raw write explicitly avoids initialization, so runs is still zero at the first snapshot.','Assuming every property write initializes a lazy object first.'),o('protected-seed','[[0,7,true],[1,7,"Ada"]]','The initializer explicitly assigns id = 99; a non-lazy mutable property is not protected from later writes.','Treating a seeded non-lazy property as immutable during initialization.'),o('uninitialized-error','An uncaught Error when name is read','Reading the still-lazy name triggers the initializer that assigns it.','Assuming making one property non-lazy cancels initialization of all remaining properties.'),o('property-then-object','[[0,7,true],[1,99,"Ada"]]','id is readable without initialization; reading name runs the initializer, which also changes id to 99.')],key:'property-then-object',explanation:'setRawValueWithoutLazyInitialization marks the property non-lazy without initializing the whole object. Accessing another lazy property still runs the initializer, whose ordinary assignments can update mutable properties.',trace:'The first snapshot is 0 runs, id 7, object still lazy. Reading name invokes the initializer once, sets id 99 and name Ada, then returns Ada.',validation:{kind:'output',stdout:'[[0,7,true],[1,99,"Ada"]]'},references:['https://www.php.net/manual/en/reflectionproperty.setrawvaluewithoutlazyinitialization.php','https://www.php.net/manual/en/reflectionclass.newlazyghost.php'] }),
q({id:'PHP-E26-0125',format:'E',level:'A',topic:17,subtopic:'asymmetric-visibility-exported-reference',objective:'Distinguish restricted property writes from mutations through a reference deliberately exported by an authorized method.',reason:'Combine PHP 8.4 setter visibility, reference acquisition scope and later indirect mutation.',prerequisites:['PHP 8.4 asymmetric visibility (advanced)','Returning references','Array mutation'],lessons:[25],coverageComplete:false,stem:'What JSON is printed? The reference is acquired through the class’s public method before an outside direct property write is attempted.',files:[file(`class ListBox
{
    public private(set) array $items = [];

    public function &itemsReference(): array
    {
        return $this->items;
    }
}

$box = new ListBox();
$alias =& $box->itemsReference();
$alias[] = 'via-reference';
$status = 'allowed';

try {
    $box->items[] = 'direct';
} catch (Error $error) {
    $status = 'blocked';
}

echo json_encode([$box->items, $status]);`)],options:[o('exported-alias','[["via-reference"],"blocked"]','The method acquires and exports a writable reference in authorized scope; outside direct modification is still forbidden.'),o('both-writes','[["via-reference","direct"],"allowed"]','Public read visibility does not permit the outside direct array-element modification.','Assuming array-element writes use only get visibility.'),o('copied-return','[[],"blocked"]','Both the method and receiving assignment explicitly use references, so alias is not a value copy.','Assuming private(set) forces all returned values to be detached copies.'),o('reference-error','An uncaught Error when itemsReference returns','The reference is acquired inside ListBox, where private setter access is permitted.','Applying the outside caller’s scope to the internal reference acquisition.')],key:'exported-alias',explanation:'Setter visibility controls direct write and reference acquisition access. A method allowed to acquire a reference can deliberately expose that writable storage; it must preserve its own encapsulation contract.',trace:'The exported alias appends via-reference. The direct outside append fails the private setter check and is caught, leaving only the first item.',validation:{kind:'output',stdout:'[["via-reference"],"blocked"]'},references:['https://www.php.net/manual/en/language.oop5.visibility.php#language.oop5.visibility-members','https://www.php.net/manual/en/language.references.return.php'] }),
q({id:'PHP-E26-0126',format:'D',level:'F',topic:4,subtopic:'nullable-array-count-empty-default',objective:'Repair counting an optional array without counting a placeholder as an element.',reason:'Choose an empty-array fallback for null while preserving real empty and nonempty arrays.',prerequisites:['Nullable parameters','count','Null coalescing'],lessons:[1,4,5],coverageComplete:true,stem:'size must return zero for null or an empty array and the element count otherwise. Which replacement for count($items) repairs the null case without changing the other cases?',files:[file(`function size(?array $items): int
{
    return count($items);
}

echo json_encode([size(null), size([]), size(['x', 'y'])]);`)],options:[o('wrap','count([$items])','Wrapping creates one outer element regardless of the contained value.','Confusing an array containing the input with the input array.'),o('null-element','count($items ?? [null])','The null fallback contains one element, so null returns 1.','Treating a null array element as no element.'),o('empty-default','count($items ?? [])','Null becomes an empty array; existing arrays retain their own elements.'),o('truthy-placeholder','count($items ?: [null])','Both null and an empty array become a one-element placeholder.','Using truthiness fallback with a nonempty sentinel array.')],key:'empty-default',explanation:'count requires an array or Countable here; null is not countable. The empty array is the correct zero-element default.',trace:'The replacement counts [], [] and [x,y], producing 0, 0 and 2.',validation:{kind:'patch',marker:'count($items)',stdout:'[0,0,2]'},references:['https://www.php.net/manual/en/function.count.php'] }),
q({id:'PHP-E26-0127',format:'D',level:'F',topic:3,subtopic:'last-byte-zero-based-string-index',objective:'Repair an off-by-one index when reading the final byte of a nonempty ASCII string.',reason:'Relate byte length to the last valid zero-based offset.',prerequisites:['String offsets','strlen','Zero-based indexing'],lessons:[1,2],coverageComplete:true,stem:'The string is nonempty ASCII. Replace the bracketed offset expression so last receives D rather than reading beyond the string.',files:[file(`$code = 'ABCD';
$last = $code[strlen($code)];

echo $last;`)],options:[o('last-index','strlen($code) - 1','A four-byte string has valid offsets 0 through 3.'),o('length','strlen($code)','The length is one past the final valid offset.','Treating length as a valid last index.'),o('previous','strlen($code) - 2','This selects C, the penultimate byte.','Subtracting twice for zero-based indexing.'),o('first','0','Zero selects A, not the final byte.','Applying the initial offset where the last offset is required.')],key:'last-index',explanation:'String offsets are zero-based. For a nonempty byte string of length n, the final byte is at n − 1.',trace:'strlen returns 4, so the valid final offset is 3 and the result is D.',validation:{kind:'patch',marker:'strlen($code)',stdout:'D',errors:{length:{message:'Uninitialized string offset',exitCode:0}}},references:['https://www.php.net/manual/en/language.types.string.php#language.types.string.substr'] }),
q({id:'PHP-E26-0128',format:'D',level:'F',topic:4,subtopic:'iterate-actual-gapped-array-keys',objective:'Repair iteration that assumes an array’s keys are consecutive positions.',reason:'Distinguish an array’s size, values and actual keys after gaps are introduced.',prerequisites:['Array keys','range','foreach'],lessons:[4],coverageComplete:true,stem:'The loop must visit each stored value once, with no missing entries. Which expression should replace range(0, count($data) - 1)?',files:[file(`$data = [2 => 10, 5 => 20];
$seen = [];

foreach (range(0, count($data) - 1) as $key) {
    $seen[] = $data[$key] ?? 'missing';
}

echo json_encode($seen);`)],options:[o('values','array_values($data)','This iterates 10 and 20 as keys, which are absent.','Confusing data values with the keys used to retrieve them.'),o('key-range','range(min(array_keys($data)), max(array_keys($data)))','The full range includes absent keys 3 and 4.','Assuming every key between the minimum and maximum exists.'),o('one-based','range(1, count($data))','The count does not reveal the actual keys 2 and 5.','Replacing a zero-based positional assumption with a one-based one.'),o('actual-keys','array_keys($data)','This supplies exactly the existing keys, in iteration order.')],key:'actual-keys',explanation:'A PHP array can have gaps or arbitrary keys. count gives the number of entries, not an index range containing those entries.',trace:'array_keys returns [2,5], and those lookups yield 10 and 20.',validation:{kind:'patch',marker:'range(0, count($data) - 1)',stdout:'[10,20]'},references:['https://www.php.net/manual/en/function.array-keys.php'] }),
q({id:'PHP-E26-0129',format:'D',level:'F',topic:7,subtopic:'literal-percent-in-format-string',objective:'Repair a literal percent sign inside a sprintf format string.',reason:'Distinguish formatter escaping from PHP-string and HTML escaping.',prerequisites:['sprintf placeholders','String escaping'],lessons:[5],coverageComplete:false,stem:'The formatter must return exactly Tax: 20% of gross. Replace only the format string with one option. Which choice keeps one %s argument and a literal percent sign?',files:[file(`try {
    echo sprintf('Tax: 20% of %s', 'gross');
} catch (Throwable $error) {
    echo 'format error';
}`)],options:[o('php-backslash',"'Tax: 20\\% of %s'",'A backslash does not escape the percent sign for sprintf.','Applying PHP-string escape conventions to the formatter’s own syntax.'),o('double-percent',"'Tax: 20%% of %s'",'%% emits a literal percent sign without consuming an argument.'),o('html-entity',"'Tax: 20&#37; of %s'",'sprintf returns the entity text literally; it does not render HTML entities.','Using HTML escaping to produce plain text from a formatter.'),o('url-escape',"'Tax: 20%25 of %s'",'%25 is not a URL-decoding instruction to sprintf and is interpreted as format syntax.','Applying percent-encoding syntax inside a printf-style format.')],key:'double-percent',explanation:'sprintf uses %% for a literal percent sign. Its formatting language is separate from both PHP string escaping and HTML or URL encoding.',trace:'%% contributes %, while the single %s consumes gross.',validation:{kind:'patch',marker:"'Tax: 20% of %s'",stdout:'Tax: 20% of gross'},references:['https://www.php.net/manual/en/function.sprintf.php'] }),
q({id:'PHP-E26-0130',format:'D',level:'F',topic:7,subtopic:'validated-input-cast-before-strict-call',objective:'Convert an already validated integer string at a strict function boundary.',reason:'Choose a conversion that produces the parameter’s required runtime type.',prerequisites:['strict_types','Scalar casts','Typed parameters'],lessons:[1,5],coverageComplete:true,assumptions:['An earlier boundary has already verified that input contains only decimal digits and fits in the PHP integer range. This question is about conversion after validation.'],stem:'The strict call currently rejects the string. Which replacement for $input at the call site supplies an integer without changing doubleCount?',files:[file(`declare(strict_types=1);

function doubleCount(int $count): int
{
    return $count * 2;
}

$input = '9';

echo doubleCount($input);`)],options:[o('float','(float) $input','Strict int parameters reject float values even when they have no fractional part.','Assuming a mathematically integral float has runtime type int.'),o('boolean','(bool) $input','The boolean true is not accepted as an int in this strict call.','Relying on boolean-to-integer coercion despite strict_types.'),o('integer','(int) $input','The validated decimal string becomes the integer required by the parameter.'),o('rounded','floor((float) $input)','floor returns a float, so the strict parameter still rejects it.','Assuming rounding changes a float’s runtime type to int.')],key:'integer',explanation:'Validation and conversion are separate steps. Once the integer representation and range are established, an explicit int cast supplies the declared type at a strict call site.',trace:'The cast yields integer 9, and doubleCount returns integer 18.',validation:{kind:'patch',marker:'doubleCount($input)',candidates:{float:'doubleCount((float) $input)',boolean:'doubleCount((bool) $input)',integer:'doubleCount((int) $input)',rounded:'doubleCount(floor((float) $input))'},stdout:'18',errors:{float:'TypeError',boolean:'TypeError',rounded:'TypeError'}},references:['https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict','https://www.php.net/manual/en/function.floor.php'] }),
q({id:'PHP-E26-0131',format:'D',level:'M',topic:14,subtopic:'verify-password-against-stored-salted-hash',objective:'Repair password verification that incorrectly compares newly salted hashes.',reason:'Distinguish hashing a new password from checking a password against an existing encoded hash.',prerequisites:['password_hash','password_verify','Salted password hashes'],stem:'The stored bcrypt hash was created from correct. Which replacement makes valid accept that password and reject wrong? Cost 4 is used only to keep this isolated fixture fast.',files:[file(`function valid(string $input, string $stored): bool
{
    return password_hash($input, PASSWORD_BCRYPT, ['cost' => 4]) === $stored;
}

$stored = password_hash('correct', PASSWORD_BCRYPT, ['cost' => 4]);

echo json_encode([valid('correct', $stored), valid('wrong', $stored)]);`)],options:[o('compare-new',"hash_equals($stored, password_hash($input, PASSWORD_BCRYPT, ['cost' => 4]))",'A newly generated salt produces a different encoded hash; timing-safe comparison does not change that.','Treating the comparison function as the cause of the salted-hash mismatch.'),o('verify','password_verify($input, $stored)','password_verify uses the algorithm, salt and cost encoded in the stored hash.'),o('reversed','password_verify($stored, $input)','The second argument must be the encoded hash, not the plaintext input.','Reversing password_verify’s password and hash arguments.'),o('double-hash',"password_verify(password_hash($input, PASSWORD_BCRYPT, ['cost' => 4]), $stored)",'This verifies an encoded hash string as the password rather than the original input.','Assuming the plaintext must be prehashed with password_hash before verification.')],key:'verify',explanation:'password_hash creates a new encoded hash with its own salt. password_verify checks the original password using the parameters already contained in the stored hash.',trace:'The accepted expression returns true for correct and false for wrong, regardless of the random salt chosen when the fixture hash is created.',validation:{kind:'patch',marker:"password_hash($input, PASSWORD_BCRYPT, ['cost' => 4]) === $stored",stdout:'[true,false]'},references:['https://www.php.net/manual/en/function.password-verify.php','https://www.php.net/manual/en/function.password-hash.php'] }),
q({id:'PHP-E26-0132',format:'D',level:'M',topic:14,subtopic:'base64-reject-invalid-alphabet-not-sanitize',objective:'Reject Base64 input containing foreign alphabet characters instead of silently discarding them.',reason:'Distinguish strict decoding from sanitization and unrelated transport encoding.',prerequisites:['Base64 decoding','Strict failure sentinels','Encoding layers'],stem:'decodeToken must reject an exclamation mark rather than remove it. Empty input is valid and decodes to empty bytes. Which replacement for the decode call meets this policy?',files:[file(`function decodeToken(string $raw): string
{
    $decoded = base64_decode($raw);

    return $decoded === false ? 'invalid' : bin2hex($decoded);
}

echo json_encode(array_map('decodeToken', ['YQ==', 'Y!Q==', '']));`)],options:[o('trim','base64_decode(trim($raw))','Trimming does not remove the embedded exclamation mark, and permissive decoding still ignores it.','Assuming whitespace trimming enables strict decoding.'),o('sanitize',"base64_decode(preg_replace('~[^A-Za-z0-9+/=]~', '', $raw), true)",'This removes the invalid character before checking, accepting input the policy requires rejecting.','Equating sanitizing an invalid token with validating it.'),o('url-first','base64_decode(rawurlencode($raw), true)','URL encoding introduces percent sequences that are not the original Base64 input and rejects the valid padded token.','Applying a transport encoder before a different decoder.'),o('strict','base64_decode($raw, true)','The strict flag returns false when the input contains a character outside the Base64 alphabet.')],key:'strict',explanation:'Permissive base64_decode can ignore foreign characters. Its strict flag rejects them; pre-cleaning would erase the evidence that the input was invalid.',trace:'YQ== decodes to byte 61, Y!Q== is rejected and empty input decodes to an empty string.',validation:{kind:'patch',marker:'base64_decode($raw)',stdout:'["61","invalid",""]'},references:['https://www.php.net/manual/en/function.base64-decode.php'] }),
q({id:"PHP-E26-0133",format:"D",level:"M",topic:10,subtopic:"date-parse-rollover-and-canonical-roundtrip",objective:"Reject calendar rollover and noncanonical date spellings after parsing.",reason:"Distinguish successful object creation from an exact valid calendar representation.",prerequisites:["DateTimeImmutable::createFromFormat","Calendar dates","Date parsing and formatting"],stem:"acceptsDate must accept only real calendar dates written exactly YYYY-MM-DD. Which predicate should replace $date !== false?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function acceptsDate(string $input): bool
{
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $input);

    return $date !== false;
}

echo json_encode(array_map('acceptsDate', [
    '2026-02-28',
    '2026-02-30',
    '2026-2-3',
    '2024-02-29',
]));
`}],options:[o("roundtrip","$date !== false && $date->format('Y-m-d') === $input","A successful parse must reproduce the exact input, rejecting rollover and missing zero padding.",null),o("instance","$date instanceof DateTimeImmutable","The parser can return an object after normalizing an invalid calendar date.","Treating object creation as proof of semantic date validity."),o("errors-only","$date !== false && (DateTimeImmutable::getLastErrors()['error_count'] ?? 0) === 0","Calendar rollover can produce warnings rather than errors, and this also omits canonical spelling validation.","Checking parse errors while ignoring warnings and representation requirements."),o("shape-only","$date !== false && preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $input) === 1","February 30 has the right shape but is not a real date.","Combining lexical shape with permissive parsing without checking normalization.")],key:"roundtrip",explanation:"The parser may normalize out-of-range dates or accept less-padded components. Formatting a successful result back to the exact required format detects both changes.",trace:"February 30 normalizes to a different day, and 2026-2-3 formats with added zeros. The two valid canonical dates reproduce themselves.",validation:{"kind":"patch","marker":"$date !== false","stdout":"[true,false,false,true]"},references:["https://www.php.net/manual/en/datetimeimmutable.createfromformat.php","https://www.php.net/manual/en/datetimeimmutable.getlasterrors.php"],revision:2}),
q({id:'PHP-E26-0134',format:'D',level:'M',topic:11,subtopic:'header-value-reject-each-line-break-byte',objective:'Reject either CR or LF anywhere in a proposed header value.',reason:'Distinguish individual forbidden bytes from a specific two-byte sequence or edge whitespace.',prerequisites:['HTTP header values','CR and LF','String validation'],stem:'This pure validator must accept plain and reject any value containing CR or LF, without modifying it. No HTTP headers are actually sent. Which predicate repairs the current paired-sequence check?',files:[file(`function safeHeader(string $value): bool
{
    return !str_contains($value, "\\r\\n");
}

echo json_encode(array_map('safeHeader', [
    'plain',
    "a\\rb",
    "a\\nb",
    "a\\r\\nb",
]));`)],options:[o('trim','trim($value) === $value','All displayed line breaks are internal, so trimming the edges does not reject them.','Treating trimming as validation of forbidden bytes anywhere in a string.'),o('lf-only','!str_contains($value, "\\n")','A lone CR remains accepted.','Assuming LF is the only line-break byte that matters.'),o('either','strpbrk($value, "\\r\\n") === false','strpbrk searches for either listed byte; false means neither occurs.'),o('remove-pair','$value === str_replace("\\r\\n", "", $value)','Removing the CRLF pair detects paired breaks but still misses lone CR or LF.','Reexpressing the same paired-sequence check as replacement.')],key:'either',explanation:'The policy forbids either byte independently. A character-set search tests that policy directly, unlike substring search for the pair or trimming the ends.',trace:'plain contains neither byte. Each other input contains at least one forbidden byte and is rejected.',validation:{kind:'patch',marker:'!str_contains($value, "\\r\\n")',stdout:'[true,false,false,false]'},references:['https://www.php.net/manual/en/function.strpbrk.php','https://www.rfc-editor.org/rfc/rfc9110.html#section-5.5'] }),
q({id:'PHP-E26-0135',format:'D',level:'M',topic:12,subtopic:'upload-error-codes-are-not-bit-flags',objective:'Classify upload size failures using discrete error codes rather than bitwise membership.',reason:'Distinguish enumerated integer outcomes from combinable permission-style flags.',prerequisites:['PHP upload error constants','Integer equality','Bitwise operators'],lessons:[17],coverageComplete:false,stem:'tooLarge must recognize only UPLOAD_ERR_INI_SIZE and UPLOAD_ERR_FORM_SIZE. Which replacement avoids incorrectly treating UPLOAD_ERR_PARTIAL as a size error?',files:[file(`function tooLarge(int $error): bool
{
    return ($error & UPLOAD_ERR_INI_SIZE) !== 0;
}

echo json_encode(array_map('tooLarge', [
    UPLOAD_ERR_INI_SIZE,
    UPLOAD_ERR_FORM_SIZE,
    UPLOAD_ERR_PARTIAL,
    UPLOAD_ERR_OK,
]));`)],options:[o('any-error','$error > UPLOAD_ERR_OK','This classifies every nonzero error, including a partial upload, as too large.','Treating all failed uploads as size failures.'),o('explicit-set','in_array($error, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)','The predicate tests membership in the two specified discrete outcomes.'),o('combined-mask','($error & (UPLOAD_ERR_INI_SIZE | UPLOAD_ERR_FORM_SIZE)) !== 0','The codes are 1, 2 and 3; the partial-upload code overlaps this invented bit mask.','Assuming upload error constants are independent bit flags.'),o('form-only','$error === UPLOAD_ERR_FORM_SIZE','This misses the server-configured upload size limit.','Handling only the form limit instead of both size-related outcomes.')],key:'explicit-set',explanation:'Upload error values identify distinct outcomes; they are not a set of independent bits. Compare against the specific accepted error codes.',trace:'The two size codes return true. Partial upload and successful upload return false.',validation:{kind:'patch',marker:'($error & UPLOAD_ERR_INI_SIZE) !== 0',stdout:'[true,true,false,false]'},references:['https://www.php.net/manual/en/features.file-upload.errors.php'] }),
q({id:'PHP-E26-0136',format:'D',level:'M',topic:11,subtopic:'json-request-body-versus-form-data',objective:'Decode an application/json request body instead of expecting form-populated POST values.',reason:'Keep the raw representation, media-type-specific parser and decoded shape aligned.',prerequisites:['HTTP request bodies','$_POST form handling','JSON decoding'],lessons:[14],coverageComplete:false,assumptions:['The request Content-Type is application/json. raw contains the complete body read by the boundary, and post is the empty form-data array supplied for that request. The shown JSON is syntactically valid.'],stem:'Which replacement for $data = $post; makes quantity read the integer qty from the JSON body, including zero?',files:[file(`function quantity(string $raw, array $post): ?int
{
    $data = $post;

    return is_array($data) && isset($data['qty']) && is_int($data['qty'])
        ? $data['qty']
        : null;
}

echo json_encode([
    quantity('{"qty":2}', []),
    quantity('{"qty":0}', []),
]);`)],options:[o('form-parser','parse_str($raw, $data);','parse_str interprets form/query syntax, not a JSON object.','Using the form parser for every HTTP body representation.'),o('object-decode','$data = json_decode($raw, false, 512, JSON_THROW_ON_ERROR);','This returns stdClass, while the existing access code explicitly requires an array.','Selecting the right parser but the wrong decoded shape for the caller.'),o('post-roundtrip','$data = json_decode(json_encode($post), true, 512, JSON_THROW_ON_ERROR);','Round-tripping the empty form array never reads the supplied raw JSON body.','Assuming JSON encoding can recover data absent from $_POST.'),o('raw-json','$data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);','This parses the raw JSON and produces the associative array expected by the remaining code.')],key:'raw-json',explanation:'PHP’s POST form array is not a general JSON body decoder. The boundary must parse the raw JSON and choose a decoded representation compatible with its access logic.',trace:'The decoded arrays contain integer qty values 2 and 0; isset accepts both and the integer check preserves zero.',validation:{kind:'patch',marker:'$data = $post;',stdout:'[2,0]'},references:['https://www.php.net/manual/en/reserved.variables.post.php','https://www.php.net/manual/en/function.json-decode.php'] }),
q({id:'PHP-E26-0137',format:'D',level:'M',topic:19,subtopic:'dynamic-constant-name-requires-namespace-string',objective:'Repair a dynamic constant lookup that does not automatically apply lexical namespace resolution.',reason:'Distinguish a constant expression in source from a runtime string naming a constant.',prerequisites:['Namespaces','Constants','constant'],lessons:[2,31],coverageComplete:true,stem:'The lookup must return App’s MODE, not the global MODE. Which expression should replace constant($name)?',files:[file(`namespace App;

const MODE = 'app';
\\define('MODE', 'global');
$name = 'MODE';

try {
    echo constant($name);
} catch (\\Error $error) {
    echo 'Error';
}`)],options:[o('qualified',"constant(__NAMESPACE__ . '\\\\' . $name)",'The runtime name explicitly identifies App\\MODE.'),o('class-separator',"constant(__NAMESPACE__ . '::' . $name)",'The :: separator denotes a class constant, not a namespace constant.','Using class-member syntax to qualify a namespace-level constant.'),o('joined',"constant(__NAMESPACE__ . $name)",'This asks for AppMODE, not App\\MODE.','Concatenating a namespace without its separator.'),o('global-qualified',"constant('\\\\' . $name)",'A leading separator names the global MODE rather than App’s constant.','Assuming a leading backslash means the current namespace.')],key:'qualified',explanation:'constant receives a runtime string. It does not prepend the current namespace as a source-level unqualified constant expression would.',trace:'The qualified string App\\MODE resolves to app. The original plain MODE resolves to the global value.',validation:{kind:'patch',marker:'constant($name)',stdout:'app'},references:['https://www.php.net/manual/en/function.constant.php','https://www.php.net/manual/en/language.namespaces.dynamic.php'] }),
q({id:'PHP-E26-0138',format:'D',level:'M',topic:9,subtopic:'cooperating-autoloaders-unknown-class-return',objective:'Repair an autoloader so unsupported names fall through without disabling future supported loads.',reason:'Trace a loader chain across two class requests and observe loading order.',prerequisites:['spl_autoload_register','Multiple autoloaders','Class loading side effects'],stem:'Each loader should load only its requested supported class. SecondRecord is requested first, then FirstRecord. Replace the unsupported-class branch’s throw so both load in request order and the first loader remains available.',files:[file(`class FirstRecord
{
}

$GLOBALS['trace'][] = 'first';`, 'first.php'),file(`class SecondRecord
{
}

$GLOBALS['trace'][] = 'second';`, 'second.php'),file(`$GLOBALS['trace'] = [];

function loadFirst(string $class): void
{
    if ($class !== FirstRecord::class) {
        throw new RuntimeException('unsupported');
    }

    require __DIR__ . '/first.php';
}

spl_autoload_register('loadFirst');
spl_autoload_register(function (string $class): void {
    if ($class === SecondRecord::class) {
        require __DIR__ . '/second.php';
    }
});

try {
    $second = new SecondRecord();
    $first = new FirstRecord();
    echo json_encode($GLOBALS['trace']);
} catch (Throwable $error) {
    echo get_class($error);
}`)],options:[o('different-exception',"throw new LogicException('unsupported');",'Changing exception type still aborts the loader chain before the later loader can handle the name.','Treating the exception class as the cause of autoload-chain failure.'),o('unregister',"spl_autoload_unregister(__FUNCTION__);\nreturn;",'The second class loads, but the later FirstRecord request has lost its loader.','Removing a loader permanently when it merely does not own one requested class.'),o('fall-through','return;','Returning without defining an unsupported class lets the next loader try while keeping this loader registered.'),o('eager-first',"require __DIR__ . '/first.php';\nreturn;",'This loads FirstRecord during the SecondRecord request, violating the stated ownership and load order.','Using an unrelated eager include as an autoload fallback.')],key:'fall-through',explanation:'Autoloaders cooperate by declining names they do not own. Throwing stops that cooperation, while unregistering discards future supported behavior.',trace:'The first loader declines SecondRecord. The second loads it. The next FirstRecord request is handled by the still-registered first loader.',validation:{kind:'patch',marker:"throw new RuntimeException('unsupported');",stdout:'["second","first"]'},references:['https://www.php.net/manual/en/language.oop5.autoload.php','https://www.php.net/manual/en/function.spl-autoload-register.php'] }),
q({id:'PHP-E26-0139',format:'D',level:'M',topic:9,subtopic:'repeated-config-return-versus-require-once-sentinel',objective:'Repair repeated configuration reads that expect the file’s return value on every call.',reason:'Distinguish include-once suppression from caching a file’s returned data.',prerequisites:['require and require_once','Included-file return values','Typed returns'],lessons:[5],coverageComplete:false,assumptions:['config.php is trusted, contains only the displayed return statement and declares no functions or classes. Re-evaluating it is permitted.'],stem:'loadConfig must return the configuration array on every call. Which replacement for the require_once expression satisfies both calls?',files:[file(`return ['mode' => 'safe'];`, 'config.php'),file(`function loadConfig(): array
{
    return require_once __DIR__ . '/config.php';
}

try {
    echo json_encode([loadConfig(), loadConfig()]);
} catch (TypeError $error) {
    echo 'TypeError';
}`)],options:[o('include-once',"include_once __DIR__ . '/config.php'",'include_once also skips a previously included file and does not replay its returned array.','Assuming only require_once uses a once-only return sentinel.'),o('evaluate',"require __DIR__ . '/config.php'",'Each permitted evaluation executes the return statement and obtains the array.'),o('cast-sentinel',"(array) (require_once __DIR__ . '/config.php')",'The second true sentinel becomes [true], not the required configuration array.','Repairing the declared return type while losing the returned data contract.'),o('read-text',"file_get_contents(__DIR__ . '/config.php')",'This reads PHP source text rather than evaluating its return statement.','Treating an executable configuration file as already decoded data.')],key:'evaluate',explanation:'The once variants prevent repeated evaluation; they do not cache and replay a file’s original return value. This file may safely be evaluated again, so require supplies the array each time.',trace:'Both calls execute return [mode => safe], and both results remain arrays with the same configuration.',validation:{kind:'patch',marker:"require_once __DIR__ . '/config.php'",stdout:'[{"mode":"safe"},{"mode":"safe"}]'},references:['https://www.php.net/manual/en/function.require-once.php','https://www.php.net/manual/en/function.include.php'] }),
q({id:"PHP-E26-0140",format:"D",level:"M",topic:10,subtopic:"json-big-integer-preserve-before-float-conversion",objective:"Preserve a JSON integer identifier exactly when it exceeds the PHP integer range.",reason:"Recognize that formatting or casting after float conversion cannot recover lost precision.",prerequisites:["64-bit integer limits","JSON number decoding","Floating-point precision"],stem:"id must return the exact decimal identifier as a string. Which replacement prevents precision loss for this JSON number on 64-bit PHP?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function id(string $raw): string
{
    return (string) json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id'];
}

echo id('{"id":9223372036854775809}');
`}],options:[o("cast-after","(string) json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id']","The default decode has already converted the out-of-range integer to an imprecise float.","Assuming a later string cast can recover digits lost during decoding."),o("format-after","number_format(json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id'], 0, '.', '')","Formatting removes scientific notation but formats the already rounded value.","Confusing decimal presentation with exact numeric preservation."),o("reencode","json_encode(json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id'])","Re-encoding the float cannot reconstruct the original integer token.","Assuming a decode/encode round trip preserves every numeric representation."),o("preserve-token","json_decode($raw, true, 512, JSON_THROW_ON_ERROR | JSON_BIGINT_AS_STRING)['id']","The decoder retains an out-of-range integer as its exact decimal string before float precision can be lost.",null)],key:"preserve-token",explanation:"JSON_BIGINT_AS_STRING preserves integers that cannot fit in PHP’s integer type. Casting or formatting a float after ordinary decoding is too late to recover the original digits.",trace:"The flag retains 9223372036854775809 as a string. Default decoding rounds the numeric value before any later conversion.",validation:{"kind":"patch","marker":"(string) json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id']","stdout":"9223372036854775809"},references:["https://www.php.net/manual/en/function.json-decode.php","https://www.php.net/manual/en/language.types.float.php"],revision:2}),
q({id:'PHP-E26-0141',format:'D',level:'A',topic:21,subtopic:'attribute-new-argument-repeated-evaluation',objective:'Avoid reevaluating an attribute argument expression when two consumers must share its constructed object.',reason:'Combine lazy attribute argument evaluation, object construction and identity preservation.',prerequisites:['Attributes (advanced)','New expressions in attribute arguments','ReflectionAttribute'],stem:'Both consumers must receive the same Token object, and the argument expression must be evaluated once. Replace the two assignment statements. Which repair yields [1,true]?',files:[file(`class Token
{
    public static int $created = 0;

    public function __construct()
    {
        self::$created++;
    }
}

#[Attribute(Attribute::TARGET_CLASS)]
class Wrap
{
    public function __construct(public Token $token)
    {
    }
}

#[Wrap(new Token())]
class Target
{
}

$attribute = (new ReflectionClass(Target::class))->getAttributes(Wrap::class)[0];
$first = $attribute->getArguments()[0];
$second = $attribute->getArguments()[0];

echo json_encode([Token::$created, $first === $second]);`)],options:[o('twice',`$first = $attribute->getArguments()[0];
$second = $attribute->getArguments()[0];`,'Each getArguments call evaluates the new expression again, creating two Token objects.','Assuming reflected argument objects are automatically memoized.'),o('cache-value',`$arguments = $attribute->getArguments();
$first = $arguments[0];
$second = $arguments[0];`,'One evaluation creates one Token, and both consumers receive its same object identifier.'),o('clone',`$first = $attribute->getArguments()[0];
$second = clone $first;`,'Only one constructor runs, but clone creates a second object identity, violating the sharing requirement.','Equating constructor count with object identity.'),o('instantiate-twice',`$first = $attribute->newInstance()->token;
$second = $attribute->newInstance()->token;`,'Each attribute instantiation evaluates its arguments and constructs another Token.','Assuming newInstance reuses previously evaluated argument objects.')],key:'cache-value',explanation:'Object expressions in attribute arguments are evaluated when Reflection retrieves or instantiates them; repeated retrieval can create fresh objects. Cache the evaluated argument array when identity must be shared.',trace:'One getArguments call increments created to 1. Assigning its object element to both variables preserves identity without cloning.',validation:{kind:'patch',marker:'$first = $attribute->getArguments()[0];\n$second = $attribute->getArguments()[0];',stdout:'[1,true]'},references:['https://www.php.net/manual/en/reflectionattribute.getarguments.php','https://www.php.net/manual/en/language.attributes.syntax.php'] }),
q({id:"PHP-E26-0142",format:"D",level:"M",topic:21,subtopic:"durable-enum-case-identity-key",objective:"Repair enum cache keys that collide across enum types or change with backing-value revisions.",reason:"Separate enum type/case identity from wire values and process-local object identity.",prerequisites:["Backed enums","Durable cache identifiers","Object identity"],assumptions:["Keys persist across PHP processes and application releases. Enum class names and case names remain stable, but backing values may change under a separate data-format migration. Different enum types can use the same case name and backing value."],stem:"The displayed cacheKey collides for two distinct states. Which replacement remains distinct by enum type and case under the stated persistence contract?",files:[{path:"main.php",kind:"complete-file",source:`<?php

enum OrderState: string
{
    case Open = 'open';
}

enum TicketState: string
{
    case Open = 'open';
}

function cacheKey(BackedEnum $state): string
{
    return $state->value;
}

echo json_encode([cacheKey(OrderState::Open), cacheKey(TicketState::Open)]);
`}],options:[o("case-name","$state->name","Both types have a case named Open, so this still collides.","Treating case names as globally unique."),o("class-value","$state::class . '::' . $state->value","Type collisions are avoided, but changing a backing value changes the key despite the stable case identity.","Using a versioned wire value as a durable case identifier."),o("object-id","(string) spl_object_id($state)","Object IDs identify live objects within one process and are not durable across processes.","Treating enum singleton identity as a globally persistent object number."),o("class-case","$state::class . '::' . $state->name","The type and case name distinguish both states and use the two components declared stable.",null)],key:"class-case",explanation:"A durable enum identity should use the enum type and case identifier under this contract. Backing values represent a separately versioned external value, and object IDs are process-local.",trace:"The current output contains open twice. Class/case keys become OrderState::Open and TicketState::Open and remain unchanged when only their backing values change.",validation:{"kind":"contract","stdout":"[\"open\",\"open\"]","keyEvidence":"The declared stable class and case names distinguish all permitted enum identities; the current witness shows the value collision.","counterexamples":{"case-name":"Both cases are named Open","class-value":"A permitted backing-value change changes this key","object-id":"Object IDs are only unique for live objects within a process"}},references:["https://www.php.net/manual/en/language.enumerations.basics.php","https://www.php.net/manual/en/language.enumerations.serialization.php","https://www.php.net/manual/en/function.spl-object-id.php"],revision:2}),
q({id:'PHP-E26-0143',format:'D',level:'A',topic:16,subtopic:'savepoint-rollback-preserve-outer-transaction',objective:'Undo failed inner work while retaining the surrounding transaction and its successful writes.',reason:'Distinguish rollback-to-savepoint, savepoint release and full transaction rollback.',prerequisites:['PDO transactions','SQLite savepoints (advanced)','Nested failure boundaries'],extensions:['PDO','pdo_sqlite'],stem:'The row inserted inside inner must be undone, while the outer rows 1 and 3 must commit together. Which replacement for RELEASE SAVEPOINT inner repairs the catch block?',files:[file(`$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE events (id INTEGER)');
$pdo->beginTransaction();
$pdo->exec('INSERT INTO events VALUES (1)');
$pdo->exec('SAVEPOINT inner');

try {
    $pdo->exec('INSERT INTO events VALUES (2)');
    throw new RuntimeException('inner failed');
} catch (RuntimeException $error) {
    $pdo->exec('RELEASE SAVEPOINT inner');
}

try {
    $pdo->exec('INSERT INTO events VALUES (3)');
    $pdo->commit();
    echo json_encode($pdo->query('SELECT id FROM events ORDER BY id')->fetchAll(PDO::FETCH_COLUMN));
} catch (PDOException $error) {
    echo 'transaction lost';
}`)],options:[o('rollback-inner',`$pdo->exec('ROLLBACK TO SAVEPOINT inner');
$pdo->exec('RELEASE SAVEPOINT inner');`,'Rollback-to undoes inner writes while keeping the outer transaction active; release removes the savepoint.'),o('release-only',"$pdo->exec('RELEASE SAVEPOINT inner');",'Releasing a savepoint retains its changes, so row 2 remains.','Treating release as rollback of the saved scope.'),o('rollback-all','$pdo->rollBack();','Full rollback discards row 1 and ends the transaction, so the later commit is no longer valid.','Using the outer transaction boundary to undo only inner work.'),o('rollback-then-all',`$pdo->exec('ROLLBACK TO SAVEPOINT inner');
$pdo->rollBack();`,'The second operation still discards the outer work and ends the transaction.','Assuming an outer rollback becomes limited after rolling back to a savepoint.')],key:'rollback-inner',explanation:'Rollback-to-savepoint rewinds changes after that savepoint without ending the enclosing transaction. Releasing the savepoint then removes its marker; only the outer commit makes the remaining work durable.',trace:'Row 2 is undone. Rows 1 and 3 remain within the same transaction and commit together.',validation:{kind:'patch',marker:"$pdo->exec('RELEASE SAVEPOINT inner');",stdout:'[1,3]'},references:['https://www.sqlite.org/lang_savepoint.html','https://www.php.net/manual/en/pdo.rollback.php'] }),
q({id:"PHP-E26-0144",format:"D",level:"A",topic:25,subtopic:"fiber-interleaving-output-buffer-stack",objective:"Repair cross-contamination caused by output buffers shared across interleaved Fibers.",reason:"Trace a process-wide buffer stack across suspension and resume in a different order.",prerequisites:["Fibers (advanced)","Output buffer stack","Per-operation output ownership"],assumptions:["The starts and resumes must remain in the shown interleaved order. Each job must independently collect its own two output fragments."],stem:"The buffers collect fragments from the wrong job. Which repair isolates each job’s output without changing the required schedule?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function job(string $label): Fiber
{
    return new Fiber(function () use ($label): string {
        ob_start();
        echo $label . '1';
        Fiber::suspend();
        echo $label . '2';

        return ob_get_clean();
    });
}

$first = job('A');
$second = job('B');
$first->start();
$second->start();
$first->resume();
$second->resume();

echo json_encode([$first->getReturn(), $second->getReturn()]);
`}],options:[o("buffer-level","Record ob_get_level at each start and assume later echo writes to that recorded level.","echo writes to the current top buffer; storing a level does not route output back to it.","Treating an output-buffer level as a selectable destination handle."),o("unique-callback","Give each ob_start a different callback and keep the same echo calls.","Callbacks do not make the global buffer stack Fiber-local; fragments still enter the current top buffer.","Assuming a distinct output handler creates a distinct coroutine output context."),o("local-writer","Replace echo and output buffering with a writer that appends to a string owned by that job’s closure.","Each closure retains its own destination across suspension, avoiding the shared output-buffer stack.",null),o("flush-return","Replace ob_get_clean with ob_get_flush while keeping the other operations.","Flushing also forwards mixed content to the next buffer and does not restore job ownership.","Using a different buffer-closing operation to solve cross-job routing.")],key:"local-writer",explanation:"PHP output buffers form a shared stack. Interleaving Fibers can leave one job’s buffer on top while another job echoes or closes it. An explicit per-job writer avoids that shared routing state.",trace:"B starts the top buffer after A suspends. A then writes A2 into B’s buffer and closes it, receiving B1A2. B later receives A1B2 from the remaining buffer.",validation:{"kind":"contract","stdout":"[\"B1A2\",\"A1B2\"]","keyEvidence":"The witnessed mixed returns follow the shared stack; an explicit closure-local destination has no shared stack edge.","counterexamples":{"buffer-level":"A stored integer does not alter echo routing","unique-callback":"Different callbacks still belong to one active buffer stack","flush-return":"Flush forwards already mixed content rather than separating it"}},references:["https://www.php.net/manual/en/book.outcontrol.php","https://www.php.net/manual/en/language.fibers.php"],revision:2}),
q({id:"PHP-E26-0145",format:"D",level:"A",topic:18,subtopic:"final-trait-alias-with-overridable-original",objective:"Seal a public trait alias while leaving the original method overridable in subclasses.",reason:"Combine trait aliasing, final adaptation and inheritance compatibility.",prerequisites:["Trait adaptation","PHP 8.3+ final trait aliases (advanced)","Method overriding"],lessons:[26,29],coverageComplete:false,stem:"sealed must be a public final alias of the trait implementation, while ChildWorker must still override run. The current adaptation makes the declaration fail. Which replacement satisfies all three requirements?",files:[{path:"main.php",kind:"complete-file",source:`<?php

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
`}],options:[o("nonfinal","run as final; run as sealed;","The first adaptation seals run itself, so ChildWorker cannot override it even though sealed is also created.","Sealing the original method while intending to seal only its alias."),o("final-alias","run as final sealed;","The separate alias is final and retains public visibility; the original run remains overridable.",null),o("original-final","run as sealed; sealed as final;","Trait adaptations resolve methods from the trait; the newly introduced alias is not another trait method to adapt.","Treating alias adaptations as sequential statements that can adapt an earlier alias."),o("protected-alias","run as sealed final;","The final modifier must precede the alias name; this adaptation is a syntax error.","Placing the final modifier after the new alias name.")],key:"final-alias",explanation:"Trait adaptation can create a new final alias without changing the original method’s finality. Omitting a new visibility modifier preserves the trait method’s public visibility.",trace:"ChildWorker::run returns child. sealed retains the trait implementation and returns trait, while Reflection confirms the alias is final.",validation:{"kind":"patch","marker":"run as final;","stdout":"[\"child\",\"trait\",true]","errors":{"nonfinal":"Cannot override final method","original-final":"does not exist","protected-alias":"syntax error"}},references:["https://www.php.net/manual/en/language.oop5.traits.php#language.oop5.traits.final-methods"],revision:2}),
q({id:'PHP-E26-0146',format:'R',level:'F',topic:2,subtopic:'function-name-case-versus-variable-case',objective:'Review case changes without confusing function-name lookup with variable-name identity.',reason:'Apply PHP’s distinct case rules to a function call and two variables.',prerequisites:['Function calls','Variable names','Case sensitivity'],lessons:[2,5],coverageComplete:true,stem:'A reviewer claims the uppercase function call fails and the two variable spellings refer to the same variable. Which assessment is correct?',files:[file(`function label(): string
{
    return 'function';
}

$value = 'lower';
$Value = 'upper';

echo LABEL(), '|', $value, '|', $Value;`)],options:[o('both-sensitive','The function call fails; the two variables are distinct.','User-defined function names are case-insensitive for this lookup.','Applying variable-name case rules to function calls.'),o('both-insensitive','The function call succeeds; both variable reads return upper.','Variable names are case-sensitive, so assigning Value does not overwrite value.','Applying function-name case tolerance to variables.'),o('different-rules','The function call succeeds; the variables retain lower and upper separately.','The function lookup is case-insensitive, while variable names are distinct by case.'),o('reverse-rules','The function call fails; both variable reads return upper.','This reverses both applicable rules.','Assuming function names are stricter than variable names in the wrong direction.')],key:'different-rules',explanation:'PHP function-name lookup is case-insensitive here, but variable names are case-sensitive. These are separate language rules.',trace:'LABEL resolves to label. value remains lower and Value remains upper, producing function|lower|upper.',validation:{kind:'contract',stdout:'function|lower|upper',keyEvidence:'The successful call and both variable values are directly observed.',counterexamples:{'both-sensitive':'The function call succeeds','both-insensitive':'The lowercase variable remains lower','reverse-rules':'Both claims conflict with the observed output'}},references:['https://www.php.net/manual/en/functions.user-defined.php','https://www.php.net/manual/en/language.variables.basics.php'] }),
q({id:"PHP-E26-0147",format:"R",level:"F",topic:1,subtopic:"included-text-outside-php-emits-output",objective:"Review unintended output from literal text after a PHP closing tag in an included helper file.",reason:"Distinguish declaring an unused function from evaluating the file’s non-PHP text.",prerequisites:["PHP opening and closing tags","include output","Function declarations"],stem:"helper.php is intended to provide a function without sending output. Which review finding explains the extra text before body even though message is never called?",files:[{path:"helper.php",kind:"complete-file",source:`<?php

function message(): string
{
    return 'hello';
}
?>
EXTRA
`},{path:"main.php",kind:"complete-file",source:`<?php

require __DIR__ . '/helper.php';

echo 'body';
`}],options:[o("outside-php","EXTRA is outside PHP mode and is emitted when the helper is included.","Literal text after the closing tag is sent as output during file evaluation.",null),o("function-return","Including the file automatically echoes message’s return value.","The function is only declared and never invoked; its return value does not produce EXTRA.","Treating function declaration as invocation."),o("require-value","require echoes the file’s return value before evaluating the main file.","require does not automatically echo a return value; the literal text itself is output.","Confusing include return values with emitted text."),o("ignored-text","The closing ?> delimiter itself is emitted before EXTRA and body.","The delimiter exits PHP mode but is not output; only the following literal text is emitted.","Treating the PHP closing delimiter as literal response text.")],key:"outside-php",explanation:"Including a file evaluates its PHP segments and emits its literal non-PHP segments. A PHP-only helper should avoid unintended content outside PHP mode; omitting its closing tag prevents trailing source text from becoming output.",trace:"The include emits EXTRA followed by the file’s final newline. The main file then emits body.",validation:{"kind":"contract","stdout":"EXTRA\nbody","keyEvidence":"The output contains the literal suffix despite no function invocation.","counterexamples":{"function-return":"message is never called and would return hello, not EXTRA","require-value":"No echo of a require return value exists","ignored-text":"The observed output starts with EXTRA, not the closing delimiter."}},references:["https://www.php.net/manual/en/language.basic-syntax.phptags.php","https://www.php.net/manual/en/function.include.php"],revision:2}),
q({id:'PHP-E26-0148',format:'R',level:'F',topic:8,subtopic:'arrow-counter-update-loses-reference-capture',objective:'Review an arrow-function replacement for a closure that was intended to update an outer counter.',reason:'Distinguish a captured value’s local increment from mutation of the outer variable.',prerequisites:['Arrow functions','Closure capture','Increment'],lessons:[6,7,9],coverageComplete:true,stem:'The required callback increments the outer count. A refactor replaces a closure using use (&$count) with the displayed arrow function. Which assessment matches the replacement?',files:[file(`$count = 0;
$tick = fn (): int => ++$count;
$returned = $tick();

echo json_encode([$returned, $count]);`)],options:[o('shared-update','It returns 1 and leaves outer count at 1, preserving the reference update.','Arrow functions capture this scalar by value, not by reference.','Assuming automatic capture retains the old closure’s explicit reference semantics.'),o('no-increment','It returns 0 and leaves outer count at 0 because captured values cannot change.','The captured local value can be incremented; that does not mutate the outer variable.','Confusing value capture with an immutable local variable.'),o('outer-only','It returns 0 but changes outer count to 1 because increment is a side effect.','Preincrement returns the incremented local value and does not reach outer storage here.','Separating the expression result from the wrong storage location.'),o('local-update','It returns 1 but leaves outer count at 0, breaking the required shared-counter update.','The arrow increments its captured scalar value while the outer variable remains unchanged.')],key:'local-update',explanation:'Arrow functions capture used outer variables by value. Replacing an explicit reference capture therefore changes mutation behavior, even when the expression looks the same.',trace:'The captured zero becomes one inside the invocation and is returned. The outer count remains zero.',validation:{kind:'contract',stdout:'[1,0]',keyEvidence:'Both the returned value and outer state are observed independently.',counterexamples:{'shared-update':'Outer count remains zero','no-increment':'Returned value is one','outer-only':'Both result and mutated-storage claims are reversed'}},references:['https://www.php.net/manual/en/functions.arrow.php'] }),
q({id:'PHP-E26-0149',format:'R',level:'F',topic:11,subtopic:'path-segment-encoding-versus-form-space',objective:'Review encoding of a single URL path segment without applying form-style plus decoding.',reason:'Choose the encoding whose space representation matches the stated path contract.',prerequisites:['URL path segments','urlencode and rawurlencode'],assumptions:['The router percent-decodes this path segment once and treats a literal plus sign as plus, not as a space. The name is one segment, not an entire path.'],stem:'The URL must identify the name Ada Lovelace under this router contract. Which replacement for urlencode($name) repairs the path segment?',files:[file(`$name = 'Ada Lovelace';

$url = '/people/' . urlencode($name);

echo $url;`)],options:[o('html','htmlspecialchars($name, ENT_QUOTES, "UTF-8")','HTML escaping leaves the space unchanged and is not URL-component encoding.','Applying HTML output encoding to URL path bytes.'),o('path','rawurlencode($name)','RFC 3986-style encoding represents the space as %20, which the router decodes to a space.'),o('decode','rawurldecode($name)','The input is an unencoded name; decoding does not encode its space for a URL.','Using the inverse operation at the output boundary.'),o('form','urlencode($name)','This uses plus for a space, but the stated router preserves that plus literally.','Applying form/query-style space encoding to a path segment.')],key:'path',explanation:'The encoding must match the component’s decoding rules. rawurlencode uses %20 for spaces, while urlencode uses the form-style plus representation.',trace:'The repaired URL is /people/Ada%20Lovelace and its decoded segment is the intended name.',validation:{kind:'patch',marker:'urlencode($name)',stdout:'/people/Ada%20Lovelace'},references:['https://www.php.net/manual/en/function.rawurlencode.php','https://www.php.net/manual/en/function.urlencode.php'] }),
q({id:'PHP-E26-0150',format:'R',level:'F',topic:14,subtopic:'htmlspecialchars-text-context-and-nonascii',objective:'Review HTML text escaping without confusing it with tag removal or all-character entity conversion.',reason:'Identify the changed syntax characters and unchanged valid UTF-8 text.',prerequisites:['HTML text context','htmlspecialchars','UTF-8'],stem:'The result will be inserted into an HTML text node. Which statement accurately describes what this PHP call produces?',files:[file(`$input = '<b>café & tea</b>';

echo htmlspecialchars($input, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');`)],options:[o('strip-tags','The b tags are removed, leaving only café & tea as plain text.','htmlspecialchars escapes tag syntax; it does not remove the tags as strip_tags would.','Confusing escaping with tag stripping.'),o('active-tags','The b tags remain active markup because ENT_QUOTES only escapes quote characters.','ENT_QUOTES adds quote handling; angle brackets and ampersands are still escaped.','Treating a quote flag as disabling the function’s other required escapes.'),o('text-escaped','The tag syntax and ampersand are escaped; é remains valid UTF-8 text.','The output contains &lt; and &amp; sequences while leaving the valid non-ASCII character unchanged.'),o('all-entities','The tag syntax is escaped and é is necessarily converted to &eacute;.','htmlspecialchars does not convert every character that has a named HTML entity.','Applying htmlentities-style broad conversion to htmlspecialchars.')],key:'text-escaped',explanation:'htmlspecialchars escapes characters significant to HTML syntax, including angle brackets and ampersands. Valid UTF-8 characters such as é remain ordinary text.',trace:'The emitted bytes are &lt;b&gt;café &amp; tea&lt;/b&gt;. In an HTML text node, the browser displays the tag characters literally instead of creating a b element.',validation:{kind:'contract',stdout:'&lt;b&gt;café &amp; tea&lt;/b&gt;',keyEvidence:'The exact escaped output preserves the UTF-8 accent and escapes markup delimiters.',counterexamples:{'strip-tags':'The tag characters survive as entities','active-tags':'Angle brackets are escaped','all-entities':'The accented character remains UTF-8 rather than a named entity'}},references:['https://www.php.net/manual/en/function.htmlspecialchars.php'] }),
q({id:'PHP-E26-0151',format:'R',level:'M',topic:13,subtopic:'httponly-cookie-does-not-prevent-script-requests',objective:'Review the protection boundary of HttpOnly without treating it as complete XSS or CSRF protection.',reason:'Separate script access to cookie bytes from browser attachment of cookies to requests.',prerequisites:['HttpOnly','Secure','SameSite','Browser request behavior'],lessons:[18],coverageComplete:false,assumptions:['The PHP response sets an authentication cookie with HttpOnly=true, Secure=true and SameSite=None over HTTPS. The browser accepts and sends this cookie under its configured policy. The attacker’s script is executing in the application’s own origin.'],stem:'A review claims HttpOnly prevents the injected script from making authenticated requests. Which assessment is correct?',options:[o('blocks-fetch','HttpOnly blocks both document.cookie reads and all fetch requests that would use the cookie.','HttpOnly restricts script access to cookie bytes, not browser attachment of the cookie to requests.','Treating a cookie-read restriction as a network-request prohibition.'),o('same-origin-protection','SameSite=None blocks the injected same-origin script from using the cookie.','None does not impose that same-site restriction, and the script is already same-origin.','Using SameSite as an isolation boundary for code already executing in the origin.'),o('limited-boundary','HttpOnly prevents direct script reads of the cookie, but the browser can still attach it to authenticated requests.','The script need not read the cookie value to cause the browser to send it.'),o('secure-encryption','Secure encrypts the cookie value against the application’s scripts, so injected requests become anonymous.','Secure limits transport to secure connections; it does not make same-origin requests anonymous.','Confusing secure transport with script isolation or request deauthentication.')],key:'limited-boundary',explanation:'HttpOnly reduces direct cookie theft through script APIs. It does not stop an injected same-origin script from performing actions through requests that the browser authenticates with the cookie.',trace:'The browser owns cookie attachment. An injected script can initiate a same-origin request without ever obtaining the cookie bytes.',validation:{kind:'document-review',rule:'HttpOnly excludes cookie exposure to non-HTTP APIs but does not disable HTTP request cookie attachment; Secure controls transport.',optionAudit:{'blocks-fetch':'Overstates HttpOnly as a request prohibition','same-origin-protection':'Misstates SameSite=None and same-origin execution','limited-boundary':'Separates script reads from browser request attachment','secure-encryption':'Secure does not implement this claimed script isolation'}},references:['https://www.php.net/manual/en/function.setcookie.php','https://www.rfc-editor.org/rfc/rfc6265.html#section-4.1.2.6'] }),
q({id:'PHP-E26-0152',format:'R',level:'M',topic:20,subtopic:'included-parse-error-catch-boundary',objective:'Review catchability of a parse error in a file required after the main script has begun executing.',reason:'Distinguish parsing the main compilation unit from parsing a later included file.',prerequisites:['ParseError','require','Throwable hierarchy'],lessons:[21,22],coverageComplete:false,stem:'broken.php intentionally contains the shown syntax error. Which review statement describes the main file’s behavior on PHP 8.4/8.5?',files:[file(`$value = ;`, 'broken.php'),file(`try {
    require __DIR__ . '/broken.php';
    echo 'loaded';
} catch (ParseError $error) {
    echo 'caught';
}

echo '|after';`)],options:[o('catchable-include','The require raises ParseError, the catch runs, and execution continues to the final echo.','The main file is already executing when PHP parses the required file, so the ParseError crosses this catch boundary.'),o('preparse-all','The main file never starts because PHP parses every future require target before execution.','Ordinary require targets are evaluated and compiled when the statement executes.','Treating require as unconditional precompilation of every dependency.'),o('false-return','The require returns false for the syntax error and loaded is printed.','A parse error in the required file throws ParseError rather than becoming an ordinary false return.','Applying a missing-file-style return model to syntax failure.'),o('catch-then-stop','The catch prints caught, but a caught ParseError always terminates the process before after.','Once caught, this ParseError does not force termination of the enclosing valid script.','Treating a handled Error subtype as unconditionally fatal.')],key:'catchable-include',explanation:'A parse error in the main file prevents it from starting. A parse error encountered while executing require is different: the already-running caller can catch the resulting ParseError.',trace:'The invalid required file never reaches a statement. The caller prints caught, leaves the catch normally and prints |after.',validation:{kind:'contract',stdout:'caught|after',lintErrors:{'broken.php':'syntax error'},keyEvidence:'The bad source has an expected lint failure, while executing the valid main file catches it and continues.',counterexamples:{'preparse-all':'The caller does execute its catch','false-return':'loaded is absent','catch-then-stop':'The after marker is printed'}},references:['https://www.php.net/manual/en/class.parseerror.php','https://www.php.net/manual/en/language.exceptions.php'] }),
q({id:'PHP-E26-0153',format:'R',level:'M',topic:20,subtopic:'returned-object-mutated-by-finally',objective:'Review whether a returned object reflects a mutation made in finally before the caller receives it.',reason:'Combine return-expression evaluation, object identity and finally execution order.',prerequisites:['try/finally','Object identity','Return evaluation'],lessons:[22,23],coverageComplete:true,stem:'A review claims that returning result from try freezes its properties before finally executes. Which assessment matches the returned object?',files:[file(`function build(): object
{
    $result = (object) ['ready' => false];

    try {
        return $result;
    } finally {
        $result->ready = true;
    }
}

echo json_encode(build());`)],options:[o('snapshot','The caller receives ready=false because evaluating return snapshots all object properties.','Return captures the object identifier, not a deep copy of its properties.','Applying scalar snapshot intuition to a returned mutable object.'),o('after-caller','The caller first receives ready=false, and finally mutates it only after the caller finishes.','finally executes before control returns to the caller.','Placing cleanup after completion of the caller’s expression.'),o('return-cancelled','The property assignment in finally cancels the return and makes build return null.','An ordinary assignment in finally does not replace the pending return value.','Confusing any finally statement with a return or throw from finally.'),o('same-object','The caller receives ready=true because finally mutates the same object before the return completes.','The pending return still refers to result, and finally changes that object before the caller observes it.')],key:'same-object',explanation:'PHP evaluates the return expression, executes finally, then completes the return unless finally changes control flow. A returned object identifier continues to refer to the same mutable object.',trace:'The pending result points to the object with ready=false. finally changes that object to ready=true, so JSON encodes true.',validation:{kind:'contract',stdout:'{"ready":true}',keyEvidence:'The returned object exposes the mutation performed before return completion.',counterexamples:{snapshot:'No object clone occurs','after-caller':'finally runs before the caller receives the result','return-cancelled':'The assignment does not alter return control flow'}},references:['https://www.php.net/manual/en/language.exceptions.php#language.exceptions.finally','https://www.php.net/manual/en/language.oop5.references.php'] }),
q({id:"PHP-E26-0154",format:"R",level:"M",topic:18,subtopic:"static-return-factory-construction-mismatch",objective:"Preserve a late-bound factory return contract by constructing the called class.",reason:"Relate a static return type to lexical versus late-bound object construction.",prerequisites:["static return type","Inherited factories","Object construction"],lessons:[26,30],coverageComplete:true,stem:"make must construct exactly the class through which it is called, for current and future subclasses. Which replacement for new self() preserves that factory contract?",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Product
{
    public static function make(): static
    {
        return new self();
    }
}

class SpecialProduct extends Product
{
}

try {
    echo json_encode([get_class(Product::make()), get_class(SpecialProduct::make())]);
} catch (TypeError $error) {
    echo 'TypeError';
}
`}],options:[o("base-explicit","new Product()","This always constructs Product, so SpecialProduct::make still violates its static return contract.","Treating the base class as sufficient for a called-class return type."),o("late-construction","new static()","The construction uses the called class, matching the static return promise.",null),o("always-child","new SpecialProduct()","The Product call would produce SpecialProduct instead of the required exact called class in this factory contract.","Hardcoding one known child instead of preserving the general factory behavior."),o("clone-base","clone (new Product())","Cloning a Product retains its class; it does not turn it into the late-bound subclass.","Using clone as a class conversion operation.")],key:"late-construction",explanation:"A static return type requires a value compatible with the called class; this factory additionally promises the exact called class. new self uses the declaring class, while new static satisfies the stronger construction promise.",trace:"Product::make creates Product, and SpecialProduct::make creates SpecialProduct.",validation:{"kind":"patch","marker":"new self()","stdout":"[\"Product\",\"SpecialProduct\"]"},references:["https://www.php.net/manual/en/language.types.declarations.php","https://www.php.net/manual/en/language.oop5.late-static-bindings.php"],revision:2}),
q({id:'PHP-E26-0155',format:'R',level:'M',topic:7,subtopic:'required-after-optional-named-api-repair',objective:'Repair a required-after-optional declaration while preserving a named-call API with one required argument.',reason:'Combine default-argument rules, named binding and reflection of required arity.',prerequisites:['Default parameters','Named arguments','Required parameter counts'],lessons:[5],coverageComplete:false,stem:'value must remain required and prefix optional with default x. All supported callers use parameter names. Which signature removes the declaration problem and preserves that contract?',files:[file(`function render(string $prefix = 'x', string $value): string
{
    return $prefix . $value;
}

try {
    echo json_encode([
        render(value: 'A'),
        (new ReflectionFunction('render'))->getNumberOfRequiredParameters(),
    ]);
} catch (ArgumentCountError $error) {
    echo 'missing argument';
}`)],options:[o('both-required','function render(string $prefix, string $value): string','This makes prefix required as well, so the shown named caller fails.','Removing the default without preserving optionality.'),o('both-optional',"function render(string $prefix = 'x', string $value = ''): string",'This also makes value optional, violating the one-required-argument contract.','Silencing the declaration issue by weakening the required input.'),o('required-first',"function render(string $value, string $prefix = 'x'): string",'The required parameter comes first; named callers still bind value by name and obtain the default prefix.'),o('reordered-required','function render(string $value, string $prefix): string','Reordering alone does not preserve prefix’s default or optionality.','Treating parameter order as the only part of the public call contract.')],key:'required-first',explanation:'A required parameter after an optional one prevents the earlier parameter from being meaningfully optional and produces a diagnostic here. With named-only callers, moving the required value first preserves names and the intended default.',trace:'The corrected call returns xA and Reflection reports exactly one required parameter.',validation:{kind:'patch',marker:"function render(string $prefix = 'x', string $value): string",stdout:'["xA",1]',original:{stdout:'missing argument',error:{message:'Optional parameter',exitCode:0}}},references:['https://www.php.net/manual/en/functions.arguments.php#functions.arguments.default','https://www.php.net/manual/en/reflectionfunctionabstract.getnumberofrequiredparameters.php'] }),
q({id:"PHP-E26-0156",format:"R",level:"M",topic:14,subtopic:"javascript-value-in-html-script-context",objective:"Choose a PHP encoding that produces a complete JavaScript string literal without exposing an HTML script-closing sequence.",reason:"Satisfy JavaScript string syntax and the surrounding HTML parser while preserving the original value.",prerequisites:["Contextual output encoding","JavaScript string literals","HTML script parsing"],assumptions:["The result is inserted directly after const message = inside an HTML script element, with no additional surrounding quotes. The input is valid UTF-8 and must be recovered as the same string value."],stem:"Which replacement for htmlspecialchars produces the required complete string literal safely for this text?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$text = "</script>\\nO'Reilly";

echo htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
`}],options:[o("json-literal","json_encode($text, JSON_HEX_TAG | JSON_THROW_ON_ERROR)","JSON supplies the complete quoted string literal and escapes the angle brackets that could terminate the HTML script element.",null),o("html-text","htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')","HTML escaping does not produce the required JavaScript string literal, and script raw text does not decode those entities as HTML text would.","Applying HTML text-node encoding inside JavaScript source."),o("slashes","\"'\" . addslashes($text) . \"'\"","addslashes does not remove the literal HTML closing-tag sequence or encode the actual newline as a JavaScript string escape.","Treating backslash quoting as sufficient for both language and HTML parser boundaries."),o("url-string","\"'\" . rawurlencode($text) . \"'\"","The JavaScript value would be percent-encoded text rather than the original string.","Using URL encoding as if JavaScript automatically decodes it.")],key:"json-literal",explanation:"The output crosses two parsers. JSON encoding provides a valid quoted string expression, and JSON_HEX_TAG prevents raw angle brackets from forming an HTML closing tag around that expression.",trace:"The encoded literal contains escaped angle brackets and a newline escape. Decoding the JSON string recovers the original closing-tag text, newline and apostrophe without executing it.",validation:{"kind":"patch","marker":"htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')","stdout":"\"\\u003C\\/script\\u003E\\nO'Reilly\""},references:["https://www.php.net/manual/en/function.json-encode.php","https://www.php.net/manual/en/json.constants.php","https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements"],revision:2}),
q({id:'PHP-E26-0157',format:'R',level:'M',topic:14,subtopic:'email-validation-without-identity-rewrite',objective:'Reject invalid ASCII email input rather than silently rewriting it into a different accepted address.',reason:'Separate validation from sanitization and preserve accepted input bytes.',prerequisites:['FILTER_VALIDATE_EMAIL','FILTER_SANITIZE_EMAIL','Validation contracts'],assumptions:['The accepted syntax is exactly PHP FILTER_VALIDATE_EMAIL for these ASCII inputs. Accepted strings must be returned byte-for-byte unchanged; invalid originals must return false. Deliverability is outside this function’s scope.'],stem:'Which replacement for the filter expression satisfies both the rejection and preservation requirements?',files:[file(`function email(string $raw): string|false
{
    return filter_var($raw, FILTER_SANITIZE_EMAIL);
}

echo json_encode([
    email('bad()@example.com'),
    email('UPPER@example.com'),
]);`)],options:[o('sanitize-validate','filter_var(filter_var($raw, FILTER_SANITIZE_EMAIL), FILTER_VALIDATE_EMAIL)','This validates the rewritten address rather than rejecting the invalid original.','Assuming validation after mutation proves the original input was valid.'),o('lowercase','filter_var(strtolower($raw), FILTER_VALIDATE_EMAIL)','The valid uppercase input is changed, violating byte-for-byte preservation.','Treating normalization as permitted when the contract requires preserving the accepted value.'),o('strip-controls','filter_var($raw, FILTER_SANITIZE_EMAIL, FILTER_FLAG_STRIP_LOW)','This remains a sanitization operation and still rewrites the invalid address.','Expecting an additional sanitization flag to turn sanitization into validation.'),o('validate-original','filter_var($raw, FILTER_VALIDATE_EMAIL)','This rejects the invalid original and returns the valid original string unchanged.')],key:'validate-original',explanation:'Sanitization changes input; validation accepts or rejects it. When an address identifies an account, silently changing an invalid input can select a different identity than the user supplied.',trace:'The invalid parenthesized local part returns false. The valid uppercase address is returned with its original capitalization.',validation:{kind:'patch',marker:'filter_var($raw, FILTER_SANITIZE_EMAIL)',stdout:'[false,"UPPER@example.com"]'},references:['https://www.php.net/manual/en/filter.filters.validate.php','https://www.php.net/manual/en/filter.filters.sanitize.php'] }),
q({id:"PHP-E26-0158",format:"R",level:"M",topic:12,subtopic:"uploaded-mime-client-claim-versus-server-inspection",objective:"Review whether client-supplied upload metadata proves the uploaded file’s content type.",reason:"Distinguish successful upload transport and filename claims from inspection of actual bytes.",prerequisites:["$_FILES metadata","Upload validation","Content inspection"],lessons:[17],coverageComplete:false,assumptions:["An upload handler accepts a file when its $_FILES entry reports type=image/png. The client controls the original filename and declared media type. Upload transport succeeds. The content-type decision must accept actual PNG content and reject other content even when declared image/png. Full image decoding and other upload controls are outside this review."],stem:"Which review change addresses the missing evidence for the content-type decision?",options:[o("extension-agreement","Also require the original filename to end in .png, then trust the reported type.","Both filename and reported type are client-controlled claims.","Treating agreement between two attacker-controlled fields as independent validation."),o("inspect-bytes","Detect the content type from the temporary file bytes on the server.","This obtains evidence from the uploaded contents rather than trusting the client’s declared type.",null),o("upload-success","Require UPLOAD_ERR_OK, then trust the reported type.","That confirms the upload outcome, not that the bytes are PNG.","Equating successful transport with content validation."),o("move-success","Require move_uploaded_file to succeed, then trust the reported type.","The move checks upload provenance and relocation, not the image format.","Treating uploaded-file origin checks as MIME inspection.")],key:"inspect-bytes",explanation:"The type field in $_FILES comes from the client and cannot establish the actual content type. Successful upload and move operations answer different questions from content inspection.",trace:"The server should inspect its temporary file bytes for the required content decision. Format decoding, dimensions and resource limits may be additional requirements, not guarantees supplied by the client type field.",validation:{"kind":"document-review","rule":"PHP upload documentation identifies the type field as client-supplied and not checked by PHP; server content inspection addresses a separate validation requirement.","optionAudit":{"extension-agreement":"Both checked values are client-controlled","inspect-bytes":"Uses the required server-side byte evidence","upload-success":"Checks transport outcome, not format","move-success":"Checks upload provenance/move, not format"}},references:["https://www.php.net/manual/en/features.file-upload.post-method.php","https://www.php.net/manual/en/function.move-uploaded-file.php","https://www.php.net/manual/en/book.fileinfo.php"],revision:2}),
q({id:'PHP-E26-0159',format:'R',level:'M',topic:17,subtopic:'unserialize-bypasses-constructor-validation',objective:'Review whether constructor validation protects objects restored through PHP serialization.',reason:'Distinguish normal construction from property hydration and locate the missing invariant boundary.',prerequisites:['Constructors','Serialization lifecycle','Object invariants'],lessons:[23,24],coverageComplete:false,stem:'This fixed local payload is used only as a test fixture. Which review conclusion follows from restoring Positive with the displayed constructor?',files:[file(`class Positive
{
    public int $amount;

    public function __construct(int $amount)
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException('positive required');
        }

        $this->amount = $amount;
    }
}

$restored = unserialize('O:8:"Positive":1:{s:6:"amount";i:-1;}');

echo $restored->amount;`)],options:[o('constructor-validates','The constructor receives -1 during restoration and throws before any object is returned.','unserialize restores the object without invoking this constructor.','Assuming every object creation path runs __construct.'),o('argument-required','Restoration fails because no constructor argument list was supplied to unserialize.','The serialized representation supplies property state, not constructor arguments.','Treating restoration as a normal new expression with missing parameters.'),o('separate-boundary','The object is restored with amount=-1; constructor checks alone do not enforce the invariant on restoration.','Typed int permits -1, and the constructor is bypassed; a trusted validated restoration strategy is a separate requirement.'),o('stdclass-result','The payload restores as stdClass, so Positive’s invariant cannot apply to this result.','The defined class is permitted under the default options, so the result is Positive.','Assuming default unserialize converts declared class objects to generic objects.')],key:'separate-boundary',explanation:'PHP deserialization is a distinct lifecycle path. It can hydrate typed properties without calling __construct, so constructor-only domain validation is insufficient for restored state.',trace:'The payload’s integer -1 satisfies the int property type. With no restoration hook validating positivity, the returned Positive contains -1.',validation:{kind:'contract',stdout:'-1',keyEvidence:'The invalid domain value is observable in the restored Positive instance without a constructor exception.',counterexamples:{'constructor-validates':'No constructor call occurs','argument-required':'Property hydration does not require constructor arguments','stdclass-result':'The known permitted class is restored as Positive'}},references:['https://www.php.net/manual/en/function.unserialize.php','https://www.php.net/manual/en/language.oop5.magic.php#object.unserialize'] }),
q({id:"PHP-E26-0160",format:"R",level:"M",topic:17,subtopic:"strong-object-identity-registry-choice",objective:"Choose object-keyed storage that retains registered objects until explicit removal.",reason:"Match identity-based metadata storage with a required strong ownership policy.",prerequisites:["Object identity","WeakMap","Collection ownership and reachability"],stem:"The registry must keep each registered object alive until explicit removal and associate metadata with its exact identity. The current WeakMap loses the entry. Which replacement collection design meets the contract?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$registry = new WeakMap();
$object = new stdClass();
$registry[$object] = 'seen';

unset($object);

echo count($registry);
`}],options:[o("strong-storage","Use SplObjectStorage with the object as key and its metadata as associated data.","SplObjectStorage supports identity keys and strongly retains attached objects.",null),o("hash-only","Use an array keyed by spl_object_hash, storing only the metadata string.","The string key and metadata do not retain the object, and object hashes can be reused after destruction.","Treating an identity-derived string as ownership of the original object."),o("weak-references","Store WeakReference objects and metadata in an ordinary array.","WeakReference deliberately does not keep its referent alive.","Assuming retaining a weak-reference wrapper strongly retains its target."),o("array-object","Use ArrayObject and use the original object directly as an array offset.","ArrayObject follows array-style offset constraints and is not an object-identity-keyed map.","Assuming an object wrapper around an array adds object keys.")],key:"strong-storage",explanation:"A registry with explicit lifetime ownership needs strong references. SplObjectStorage directly provides object-identity keys and associated metadata; weak references or string identifiers do not supply that ownership.",trace:"The WeakMap witness becomes empty when the external object variable is unset. Strong object storage would retain the object and its entry until removal.",validation:{"kind":"contract","stdout":"0","keyEvidence":"The current weak lifetime contradicts the stated retention requirement; SplObjectStorage supplies identity-keyed strong storage.","counterexamples":{"hash-only":"No object reference is retained and identifiers can be reused","weak-references":"Weak wrappers do not own their targets","array-object":"Array-style offsets do not accept arbitrary object keys"}},references:["https://www.php.net/manual/en/class.splobjectstorage.php","https://www.php.net/manual/en/class.weakmap.php","https://www.php.net/manual/en/function.spl-object-hash.php"],revision:2}),
q({id:'PHP-E26-0161',format:'R',level:'A',topic:18,subtopic:'trait-static-property-reuse-child-storage',objective:'Review how reusing a trait in a child class affects static property storage on PHP 8.4/8.5.',reason:'Separate inherited static storage from a property contributed again by trait reuse under modern version rules.',prerequisites:['Traits','Static inheritance','PHP 8.3+ trait static-property behavior (advanced)'],lessons:[26,29,30],coverageComplete:false,stem:'A reviewer expects one shared hit count across BaseCounter and ChildCounter. Which assessment explains the result and the effect of removing only the child’s use statement?',files:[file(`trait Hits
{
    public static int $hits = 0;

    public static function increment(): void
    {
        self::$hits++;
    }
}

class BaseCounter
{
    use Hits;
}

class ChildCounter extends BaseCounter
{
    use Hits;
}

BaseCounter::increment();
ChildCounter::increment();

echo json_encode([BaseCounter::$hits, ChildCounter::$hits]);`)],options:[o('trait-global','The trait owns one global counter, so the two classes must both report 2 regardless of the child use statement.','Trait static state belongs to consuming classes under these rules, not a single trait-global storage location.','Treating a trait as a shared runtime instance that owns all imported state.'),o('reuse-ignored','The child use statement is ignored because its parent already uses Hits, so removing it changes nothing.','Reusing the trait in the child contributes distinct static property storage on the stated versions.','Assuming repeated trait use is deduplicated across an inheritance hierarchy.'),o('modern-reuse','The repeated child use creates separate storage; removing it leaves the child using the inherited shared property.','Since PHP 8.3, this child trait reuse produces a distinct static property rather than the inherited shared storage.'),o('inheritance-copy','Inheritance always copies static storage into each child, so removing use still leaves two independent counters.','An inherited static property without a separate declaration can share the parent’s storage.','Assuming class inheritance always duplicates static property storage.')],key:'modern-reuse',explanation:'On PHP 8.3 and later, reusing a trait in a child class gives its static property distinct storage. Without that repeated use, the child inherits the parent’s property and method instead.',trace:'Each class increments its own imported hits property to 1. Removing the child use would make both operations reach the inherited shared counter, reaching 2.',validation:{kind:'contract',stdout:'[1,1]',keyEvidence:'Distinct counts follow the modern trait-reuse rule; inherited-only storage differs from a newly contributed trait property.',counterexamples:{'trait-global':'The current counts are 1 and 1, not 2','reuse-ignored':'The repeated use is semantically significant','inheritance-copy':'Inherited-only static properties can share storage'}},references:['https://www.php.net/manual/en/language.oop5.traits.php#language.oop5.traits.properties'] }),
q({id:"PHP-E26-0162",format:"R",level:"A",topic:18,subtopic:"constructor-signature-not-general-override-contract",objective:"Review a late-bound factory when a child constructor has a different argument contract.",reason:"Combine constructor override rules, strict scalar calls and late-bound construction.",prerequisites:["Constructors and inheritance","new static","strict_types","Factory contracts (advanced)"],lessons:[1,24,26,30],coverageComplete:false,stem:"A review assumes inheritance guarantees that ChildEntity’s constructor accepts the integer passed by make. Which assessment matches the program?",files:[{path:"main.php",kind:"complete-file",source:`<?php

declare(strict_types=1);

class Entity
{
    public function __construct(public int $id)
    {
    }

    public static function make(int $id): static
    {
        return new static($id);
    }
}

class ChildEntity extends Entity
{
    public function __construct(public string $name)
    {
        parent::__construct(0);
    }
}

try {
    ChildEntity::make(7);
    echo 'created';
} catch (TypeError $error) {
    echo 'TypeError';
}
`}],options:[o("constructor-contract","The child declaration is allowed, but the strict factory call passes an int to its string constructor and throws TypeError.","Constructors are exempt from ordinary parent-method signature compatibility in this case; the late-bound call still enforces the actual constructor’s parameter type.",null),o("declaration-rejected","The file must fail at class declaration because all constructor overrides obey ordinary method variance.","This constructor override is allowed; the failure occurs when the factory invokes it.","Applying ordinary method override constraints to a constructor without a separate interface contract."),o("base-constructor","new static creates ChildEntity but always invokes Entity’s constructor because make is declared in Entity.","Late-bound construction invokes the selected class’s constructor, not the factory’s declaring-class constructor.","Separating dynamic class selection from constructor dispatch."),o("return-type-protects","The static return type guarantees constructor compatibility and converts 7 to a string automatically.","A return type neither validates constructor signature substitutability nor changes strict argument binding.","Using a result-type promise as an argument-adaptation mechanism.")],key:"constructor-contract",explanation:"A child may change its constructor signature here, so a base factory cannot infer constructor compatibility solely from inheritance. The factory’s strict call is checked against the late-bound constructor it actually invokes.",trace:"new static selects ChildEntity. Its string parameter rejects integer 7 before its body runs, and the outer catch prints TypeError.",validation:{"kind":"contract","stdout":"TypeError","keyEvidence":"Class loading succeeds, while the actual factory invocation reaches the caught argument TypeError.","counterexamples":{"declaration-rejected":"The catch executes, proving the main program started","base-constructor":"The child constructor signature is checked","return-type-protects":"The argument binding still throws"}},references:["https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.constructor","https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict"],revision:2}),
q({id:"PHP-E26-0163",format:"R",level:"M",topic:14,subtopic:"sensitive-parameter-trace-redaction-not-message-sanitization",objective:"Review the boundary of SensitiveParameter redaction without assuming explicit exception messages are sanitized.",reason:"Distinguish trace argument representation, retained runtime values and manually constructed diagnostic text.",prerequisites:["SensitiveParameter","Exception traces","SensitiveParameterValue"],assumptions:["zend.exception_ignore_args=0 is explicitly set for this isolated fixture so trace arguments are included. demo is a synthetic test value, not a real secret."],stem:"A review claims the attribute prevents the token from appearing anywhere in the exception. Which assessment matches the recorded values?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function fail(#[SensitiveParameter] string $token): never
{
    throw new RuntimeException('token=' . $token);
}

try {
    fail('demo');
} catch (RuntimeException $error) {
    $argument = $error->getTrace()[0]['args'][0];

    echo json_encode([
        get_debug_type($argument),
        $argument->getValue(),
        $error->getMessage(),
    ]);
}
`}],options:[o("message-redacted","The attribute replaces the token in both trace arguments and the explicit message with a redaction marker.","The manually constructed message still contains token=demo.","Assuming trace metadata redaction scans arbitrary strings for sensitive values."),o("value-destroyed","The attribute permanently destroys the original argument value after binding, so getValue cannot recover it.","The wrapper still exposes its contained value through getValue, and the function used that value in its message.","Confusing diagnostic redaction with memory erasure."),o("caller-attribute","No redaction occurs because the attribute must be placed on the caller’s argument expression.","The parameter attribute is the supported declaration that controls trace argument redaction.","Placing parameter metadata at a call-site syntax location."),o("trace-boundary","The trace argument is wrapped, but its runtime value and the explicitly built message still contain demo.","SensitiveParameter changes trace representation; it does not sanitize messages or make the underlying value inaccessible.",null)],key:"trace-boundary",explanation:"SensitiveParameter replaces the trace argument representation with SensitiveParameterValue. It does not rewrite exception messages, erase the argument or prevent deliberate access through the wrapper.",trace:"The trace contains a SensitiveParameterValue object. getValue returns demo, and the message remains token=demo.",validation:{"kind":"contract","ini":{"zend.exception_ignore_args":"0"},"stdout":"[\"SensitiveParameterValue\",\"demo\",\"token=demo\"]","keyEvidence":"All three observed fields distinguish trace wrapping from value retention and explicit message content.","counterexamples":{"message-redacted":"Message remains token=demo","value-destroyed":"getValue returns demo","caller-attribute":"The declared parameter produces the wrapper"}},references:["https://www.php.net/manual/en/class.sensitiveparameter.php","https://www.php.net/manual/en/class.sensitiveparametervalue.php"],revision:2}),
q({id:'PHP-E26-0164',format:'R',level:'A',topic:20,subtopic:'compiled-out-assertion-skips-validation-side-effect',objective:'Review validation placed inside an assertion expression when assertions are compiled out.',reason:'Connect compile-time assertion configuration with skipped function evaluation and the public validation contract.',prerequisites:['zend.assertions (advanced)','assert','Validation side effects'],assumptions:['The PHP process starts with zend.assertions=-1. The fixture sets this before compilation, as a production configuration may do. Every accepted amount must be positive.'],stem:'A review expects requirePositive to reject the negative amount even when assertion checking is disabled. Which assessment is correct for this configuration?',files:[file(`function requirePositive(int $amount): bool
{
    if ($amount <= 0) {
        throw new DomainException('positive required');
    }

    return true;
}

function accept(int $amount): int
{
    assert(requirePositive($amount));

    return $amount;
}

echo accept(-5);`)],options:[o('evaluate-only','PHP still evaluates requirePositive but ignores only the assertion result, so DomainException is thrown.','With zend.assertions=-1, the assertion code is not generated and the expression is not evaluated.','Treating a compiled-out assertion as an ordinary function call whose result is merely ignored.'),o('ordinary-validation','The assertion expression is skipped and -5 is returned; required validation must use ordinary control flow.','Input validation cannot depend on an expression that the runtime configuration permits the compiler to omit.'),o('exception-flag','Enabling assertion exceptions alone would force requirePositive to run despite zend.assertions=-1.','Exception handling settings do not restore assertion code omitted during compilation.','Confusing assertion failure handling with assertion code generation.'),o('int-restriction','The int parameter rejects negative values before assertion evaluation.','PHP int includes negative integers; the positivity rule is a domain condition.','Treating a signed scalar type as a positive-integer constraint.')],key:'ordinary-validation',explanation:'Assertions are suitable for optional development checks, not required input validation with side effects. At zend.assertions=-1, the expression is omitted, so the validation function is never called.',trace:'accept receives -5, skips the assertion expression and returns -5 unchanged.',validation:{kind:'contract',ini:{'zend.assertions':'-1'},stdout:'-5',keyEvidence:'The domain-invalid value reaches the return because no validation call is generated.',counterexamples:{'evaluate-only':'No DomainException is thrown','exception-flag':'Failure-handling flags cannot recover omitted code','int-restriction':'Negative values are valid ints'}},references:['https://www.php.net/manual/en/function.assert.php','https://www.php.net/manual/en/ini.core.php#ini.zend.assertions'] }),
q({id:'PHP-E26-0165',format:'R',level:'A',topic:18,subtopic:'private-helper-not-polymorphic-extension-point',objective:'Review a same-named child method that does not override a parent’s private helper.',reason:'Combine private method scope, signature compatibility exceptions and dispatch from an inherited public method.',prerequisites:['Private methods','Inheritance','Template method dispatch (advanced)'],lessons:[25,26],coverageComplete:false,stem:'A reviewer expects the inherited run method to dispatch to ChildHook::hook and fail because no argument is supplied. Which assessment matches this code?',files:[file(`class BaseHook
{
    final public function run(): string
    {
        return $this->hook();
    }

    private function hook(): string
    {
        return 'base';
    }
}

class ChildHook extends BaseHook
{
    public function hook(int $value): int
    {
        return $value;
    }
}

$object = new ChildHook();

echo json_encode([$object->run(), $object->hook(7)]);`)],options:[o('variance-error','The class declaration fails because the child hook’s parameter and return types violate the parent signature.','The parent private method is not an overridden public/protected contract for the child method.','Applying ordinary override variance to an unrelated same-named private helper.'),o('child-dispatch','run calls the child hook and throws ArgumentCountError for its missing parameter.','The private call from BaseHook resolves to BaseHook’s own private method.','Treating a private helper as a polymorphic extension point.'),o('separate-methods','run uses the parent’s private hook; the direct public child hook call is a separate method and returns 7.','The same name does not make the private parent helper an overridden method.'),o('final-controls-all','Because run is final, even the direct hook(7) call must use the parent’s private hook.','final restricts overriding run; it does not redirect unrelated public calls to private methods.','Extending a method’s finality to all methods it calls.')],key:'separate-methods',explanation:'A private parent method belongs to that class’s scope and is not a child extension point. The child may declare its own same-named method with a different signature, while the parent’s internal private call remains separate.',trace:'The inherited run calls BaseHook’s private hook and returns base. The outside call resolves to ChildHook’s public hook and returns integer 7.',validation:{kind:'contract',stdout:'["base",7]',keyEvidence:'Both observed calls distinguish the parent private dispatch from the separate child public method.',counterexamples:{'variance-error':'The class declarations are accepted','child-dispatch':'run returns base rather than throwing','final-controls-all':'The direct child call returns 7'}},references:['https://www.php.net/manual/en/language.oop5.inheritance.php','https://www.php.net/manual/en/language.oop5.visibility.php'] }),
q({id:'PHP-E26-0166',format:'I',level:'F',topic:3,subtopic:'literal-dollar-label-and-interpolated-value',objective:'Combine a literal variable-name label with the variable’s current value.',reason:'Distinguish single-quoted text, interpolation and concatenation.',prerequisites:['String quoting','Concatenation','Variables'],lessons:[2],coverageComplete:true,stem:'The output must be exactly $total = 7, including the literal dollar sign in the label. Which expression should replace the current string?',files:[file(`$total = 7;

echo '$total = $total';`)],options:[o('interpolate-both','"$total = $total"','This interpolates both occurrences and prints 7 = 7.','Failing to distinguish the literal label from the value slot.'),o('literal-and-value',"'$total = ' . $total",'Single quotes preserve the label, and concatenation appends the numeric value.'),o('literal-both',"'$total = $total'",'Both variable spellings remain literal in a single-quoted string.','Expecting selective interpolation inside single quotes.'),o('single-backslash',"'\\$total = ' . $total",'A backslash before dollar is retained in a single-quoted string, adding an unwanted byte.','Applying double-quoted dollar escaping to a single-quoted string.')],key:'literal-and-value',explanation:'Single-quoted text preserves the literal dollar-name label. The value must be appended separately or interpolated in a correctly escaped double-quoted expression.',trace:'The literal prefix is $total = and the appended value is 7, producing the required line.',validation:{kind:'patch',marker:"'$total = $total'",stdout:'$total = 7'},references:['https://www.php.net/manual/en/language.types.string.php'] }),
q({id:"PHP-E26-0167",format:"I",level:"F",topic:5,subtopic:"page-count-round-up-partial-page",objective:"Count a partial final page without adding a page for an exact multiple.",reason:"Choose ceiling rather than truncation or nearest-integer rounding.",prerequisites:["Division","Rounding","Integer conversion"],lessons:[2],coverageComplete:true,assumptions:["total is a nonnegative integer and pageSize is a positive integer. The fixed test values are small enough to avoid numeric precision concerns."],stem:"A partial page counts as one page, and zero items require zero pages. Which expression implements pages for all displayed cases?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function pages(int $total, int $pageSize): int
{
    return intdiv($total, $pageSize);
}

echo json_encode([pages(0, 10), pages(20, 10), pages(21, 10)]);
`}],options:[o("floor","(int) floor($total / $pageSize)","This drops the fractional final page for 21 items.","Using completed groups instead of required capacity."),o("nearest","(int) round($total / $pageSize)","Rounding 2.1 to the nearest integer gives 2 rather than the required 3.","Using nearest rounding where every positive remainder needs another page."),o("always-plus","intdiv($total, $pageSize) + 1","This adds a page for zero and exact multiples too.","Adding unconditionally instead of only for a remainder."),o("ceiling","(int) ceil($total / $pageSize)","Ceiling preserves exact quotients and rounds any partial page upward.",null)],key:"ceiling",explanation:"The number of pages is the smallest integer whose capacity covers all items. Ceiling expresses that requirement, including zero and exact multiples.",trace:"The quotients 0, 2 and 2.1 become page counts 0, 2 and 3.",validation:{"kind":"patch","marker":"intdiv($total, $pageSize)","stdout":"[0,2,3]"},references:["https://www.php.net/manual/en/function.ceil.php"],revision:2}),
q({id:'PHP-E26-0168',format:'I',level:'F',topic:4,subtopic:'queue-front-removal-versus-pointer-read',objective:'Remove and return the first queued value rather than only reading it or removing the last value.',reason:'Distinguish array mutation from internal-pointer access.',prerequisites:['array_shift','array_pop','Array pointer functions'],lessons:[4],coverageComplete:true,stem:'The queue must return first and retain only second. Which expression performs both operations?',files:[file(`$queue = ['first', 'second'];
$next = array_pop($queue);

echo json_encode([$next, $queue]);`)],options:[o('dequeue','array_shift($queue)','array_shift returns and removes the first element, then reindexes remaining numeric keys.'),o('pop','array_pop($queue)','array_pop removes the last element, so it returns second instead.','Using stack removal for a FIFO queue.'),o('reset','reset($queue)','reset reads the first element but leaves both values in the array.','Confusing pointer movement with removal.'),o('advance','next($queue)','next moves the pointer to second without removing either element.','Treating pointer advancement as consuming the queue entry.')],key:'dequeue',explanation:'A FIFO queue consumes its front. array_shift mutates the array accordingly; pointer functions only change which value a pointer observes.',trace:'first is returned, and the remaining array contains second at numeric key 0.',validation:{kind:'patch',marker:'array_pop($queue)',stdout:'["first",["second"]]'},references:['https://www.php.net/manual/en/function.array-shift.php','https://www.php.net/manual/en/function.next.php'] }),
q({id:"PHP-E26-0169",format:"I",level:"F",topic:4,subtopic:"allowlist-input-fields-by-key",objective:"Select allowed fields by their names while retaining their submitted values.",reason:"Convert a list of allowed names into the key set required by key intersection.",prerequisites:["Associative arrays","Field selection by key","Key sets"],lessons:[4],coverageComplete:true,stem:"Keep only the name and role fields, preserving their values. Which expression should replace the current value intersection?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$input = ['name' => 'Ada', 'role' => 'reader', 'debug' => true];
$allowed = ['name', 'role'];

$selected = array_intersect($input, $allowed);

echo json_encode($selected);
`}],options:[o("values","array_intersect($input, $allowed)","This compares Ada, reader and true against the strings name and role.","Comparing submitted values with allowed field names."),o("numeric-keys","array_intersect_key($input, $allowed)","The allowed list has numeric keys 0 and 1, not name and role.","Using a list as a key set without changing its shape."),o("key-set","array_intersect_key($input, array_flip($allowed))","Flipping makes allowed names into keys, so key intersection retains the requested fields.",null),o("difference","array_diff_key($input, array_flip($allowed))","This retains disallowed fields such as debug instead of the allowed fields.","Reversing an allowlist into an exclusion operation.")],key:"key-set",explanation:"The policy concerns field names, so compare keys. A simple list stores those names as values; array_flip turns them into a suitable key set.",trace:"The accepted key set contains name and role, retaining Ada and reader while removing debug.",validation:{"kind":"patch","marker":"array_intersect($input, $allowed)","stdout":"{\"name\":\"Ada\",\"role\":\"reader\"}"},references:["https://www.php.net/manual/en/function.array-intersect-key.php","https://www.php.net/manual/en/function.array-flip.php"],revision:2}),
q({id:'PHP-E26-0170',format:'I',level:'F',topic:17,subtopic:'initialized-nullable-string-property',objective:'Declare an initialized nullable string property without widening its accepted type.',reason:'Distinguish nullability, initialization and mixed-type acceptance.',prerequisites:['Typed properties','Nullable types','strict_types'],lessons:[1,23,24],coverageComplete:true,stem:'A new Contact must expose name as null, permit strings, and reject an integer assignment under this strict file. Which property declaration meets all three requirements?',files:[file(`declare(strict_types=1);

class Contact
{
    public ?string $name;
}

$contact = new Contact();
$initial = $contact->name;
$rejected = false;

try {
    $contact->name = 7;
} catch (TypeError $error) {
    $rejected = true;
}

echo json_encode([$initial, $rejected]);`)],options:[o('uninitialized','public ?string $name;','A nullable typed property without a default is still uninitialized.','Assuming nullable automatically means initialized to null.'),o('nullable-default','public ?string $name = null;','The property starts at null and its declared type remains string or null.'),o('empty-string',"public string $name = '';",'This starts at an empty string rather than the required null.','Treating empty and absent values as interchangeable defaults.'),o('mixed','public mixed $name = null;','The default is correct, but mixed permits the integer assignment.','Widening the type to solve initialization while losing its input restriction.')],key:'nullable-default',explanation:'Nullability specifies an allowed value, not an automatic initial value. An explicit null default and a nullable string type satisfy both initialization and type restrictions.',trace:'The initial read returns null. Assigning integer 7 from the strict file throws TypeError and sets rejected to true.',validation:{kind:'patch',marker:'public ?string $name;',stdout:'[null,true]',errors:{uninitialized:'must not be accessed before initialization'}},references:['https://www.php.net/manual/en/language.oop5.properties.php'] }),
q({id:'PHP-E26-0171',format:'I',level:'F',topic:7,subtopic:'unpack-array-into-variadic-arguments',objective:'Pass every array value as a separate variadic argument.',reason:'Preserve both the aggregate total and the number of supplied arguments.',prerequisites:['Variadics','Argument unpacking','Arrays'],lessons:[5,11],coverageComplete:true,stem:'summarize must receive all three integers as separate arguments. Which call produces total 6 and argument count 3?',files:[file(`function summarize(int ...$values): array
{
    return [array_sum($values), count($values)];
}

$values = [1, 2, 3];

echo json_encode(summarize($values));`)],options:[o('sum-first','summarize(array_sum($values))','This supplies one argument with value 6, so the count is 1.','Pre-aggregating values when the callee needs each argument.'),o('count-first','summarize(count($values))','This supplies one argument with value 3 rather than the three values.','Passing collection size instead of collection contents.'),o('first-only','summarize($values[0])','Only the first integer reaches the function.','Assuming a first-element argument causes the rest of the array to follow.'),o('unpack','summarize(...$values)','Argument unpacking supplies 1, 2 and 3 as separate variadic arguments.')],key:'unpack',explanation:'A variadic parameter collects separately supplied arguments. The spread operator unpacks the input array into those separate arguments rather than passing the array itself.',trace:'The collected values are [1,2,3], giving sum 6 and count 3.',validation:{kind:'patch',marker:'summarize($values)',stdout:'[6,3]'},references:['https://www.php.net/manual/en/functions.arguments.php#functions.variable-arg-list'] }),
q({id:"PHP-E26-0172",format:"I",level:"F",topic:11,subtopic:"method-membership-needs-two-comparisons",objective:"Accept exactly GET and HEAD without making a nonempty method-name literal a truthy condition.",reason:"Distinguish a comparison against each allowed value from boolean combination of strings.",prerequisites:["HTTP method names","Boolean operators","Set membership"],lessons:[2,12,16],coverageComplete:true,stem:"allowsRead must accept only GET and HEAD. Which predicate should replace the current expression?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function allowsRead(array $server): bool
{
    $method = $server['REQUEST_METHOD'];

    return $method === 'GET' || 'HEAD';
}

echo json_encode([
    allowsRead(['REQUEST_METHOD' => 'GET']),
    allowsRead(['REQUEST_METHOD' => 'HEAD']),
    allowsRead(['REQUEST_METHOD' => 'POST']),
]);
`}],options:[o("membership","in_array($method, ['GET', 'HEAD'], true)","Strict membership accepts either of the two method names and rejects POST.",null),o("truthy-literal","$method === 'GET' || 'HEAD'","The nonempty string HEAD is truthy, so this accepts every method.","Assuming the comparison’s left operand is implicitly reused after ||."),o("both","$method === 'GET' && $method === 'HEAD'","One string cannot equal both distinct method names at once.","Using conjunction for an either-of-two policy."),o("grouped-strings","$method === ('GET' || 'HEAD')","The parenthesized expression is boolean true, which is not identical to a method string.","Combining the allowed strings before comparing instead of testing membership.")],key:"membership",explanation:"Each allowed value must participate in a comparison or membership test. A bare nonempty string in a boolean expression is a truthy value, not a second comparison.",trace:"The repaired predicate returns true for GET and HEAD and false for POST.",validation:{"kind":"patch","marker":"$method === 'GET' || 'HEAD'","stdout":"[true,true,false]"},references:["https://www.php.net/manual/en/language.operators.logical.php","https://www.php.net/manual/en/reserved.variables.server.php"],revision:2}),
q({id:'PHP-E26-0173',format:'I',level:'M',topic:14,subtopic:'parsed-url-authority-exact-host-policy',objective:'Apply an exact HTTPS host policy to parsed URL components rather than the original string prefix.',reason:'Distinguish scheme, host, userinfo and deceptive suffixes in an absolute URL.',prerequisites:['parse_url','URL authority','Exact allowlists'],assumptions:['This is only a syntactic URL policy, not a complete SSRF defense. Inputs are valid absolute ASCII URLs with lowercase scheme and host. The allowed scheme is https and the only allowed host is example.test. No network request is performed.'],stem:'Which predicate accepts only the permitted scheme/host combination for all displayed inputs?',files:[file(`function allowed(string $url): bool
{
    $parts = parse_url($url);

    return str_starts_with($url, 'https://example.test');
}

echo json_encode(array_map('allowed', [
    'https://example.test/path',
    'https://example.test.evil.test/path',
    'https://example.test@evil.test/path',
    'https://notexample.test/path',
    'http://example.test/path',
]));`)],options:[o('raw-prefix',"str_starts_with($url, 'https://example.test')",'A textual prefix can be followed by a different hostname suffix or by userinfo syntax.','Treating URL prefix text as the parsed destination host.'),o('host-only',"$parts['host'] === 'example.test'",'This also accepts the http URL, violating the required scheme.','Checking destination identity while omitting the transport scheme constraint.'),o('parsed-exact',"$parts['scheme'] === 'https' && $parts['host'] === 'example.test'",'Both parsed components match the exact policy, excluding userinfo and hostname lookalikes.'),o('suffix',"$parts['scheme'] === 'https' && str_ends_with($parts['host'], 'example.test')",'notexample.test shares the textual suffix but is not the allowed host.','Using suffix matching for an exact-host policy.')],key:'parsed-exact',explanation:'The URL parser identifies the actual host separately from userinfo and path text. An exact-host policy should compare that component exactly and independently check the scheme.',trace:'Only the first URL has both the allowed scheme and the exact allowed host.',validation:{kind:'patch',marker:"str_starts_with($url, 'https://example.test')",stdout:'[true,false,false,false,false]'},references:['https://www.php.net/manual/en/function.parse-url.php'] }),
q({id:'PHP-E26-0174',format:'I',level:'M',topic:10,subtopic:'csv-disable-proprietary-escape-roundtrip',objective:'Write CSV using enclosure doubling without a proprietary escape character.',reason:'Preserve quotes preceded by different bytes under a reader that uses standard enclosure doubling.',prerequisites:['fputcsv and fgetcsv','CSV enclosure doubling','Escape parameter'],lessons:[20],coverageComplete:false,stem:'The reader uses comma separators, double-quote enclosures and no proprietary escape character. Which writer call preserves every displayed field under that same dialect?',files:[file(`$row = ['x,y', 'a"b', 'c\\\\"d', 'e/"f'];
$stream = fopen('php://memory', 'w+');

fputcsv($stream, $row, ',', '"', '\\\\');
rewind($stream);
$decoded = fgetcsv($stream, 0, ',', '"', '');
fclose($stream);

echo $decoded === $row ? 'same' : 'changed';`)],options:[o('backslash',`fputcsv($stream, $row, ',', '"', '\\\\');`,'Backslash before an enclosure is treated specially by this writer but not by the stated reader.','Assuming PHP’s proprietary backslash escape is identical to enclosure doubling.'),o('none',`fputcsv($stream, $row, ',', '"', '');`,'An empty escape parameter disables the proprietary mechanism and uses doubled enclosures consistently.'),o('slash',`fputcsv($stream, $row, ',', '"', '/');`,'The slash before a quote in the last field becomes a proprietary escape that the reader does not recognize.','Changing the proprietary escape character instead of disabling it.'),o('quote',`fputcsv($stream, $row, ',', '"', '"');`,'Using the enclosure itself as a separate escape character does not express the reader’s empty-escape dialect.','Assuming an escape parameter equal to the enclosure is the way to request quote doubling.')],key:'none',explanation:'The escape argument controls an additional PHP escape mechanism, not the ordinary doubling of CSV enclosures. Setting it to an empty string aligns writer and reader on enclosure doubling alone.',trace:'Commas cause field enclosure and embedded double quotes are doubled. Backslashes and slashes remain ordinary field bytes, so the decoded row equals the original.',validation:{kind:'patch',marker:`fputcsv($stream, $row, ',', '"', '\\\\');`,stdout:'same'},references:['https://www.php.net/manual/en/function.fputcsv.php','https://www.php.net/manual/en/function.fgetcsv.php'] }),
q({id:'PHP-E26-0175',format:'I',level:'M',topic:3,subtopic:'validated-decimal-cents-without-float-roundtrip',objective:'Convert a fixed two-decimal representation to exact integer cents without passing through float.',reason:'Preserve decimal digits across both ordinary and beyond-double-exactness values.',prerequisites:['Integer range','Floating-point precision','Validated numeric representations'],lessons:[1,2],coverageComplete:true,assumptions:['Input has already been validated as nonnegative decimal digits, one dot and exactly two fractional digits. Removing the dot produces a value within the 64-bit PHP integer range.'],stem:'Which expression converts both values to exact integer cents under the stated validated-input contract?',files:[file(`function cents(string $input): int
{
    return (int) ((float) $input * 100);
}

echo json_encode([
    cents('19.99'),
    cents('90071992547409.93'),
]);`)],options:[o('truncate-float','(int) ((float) $input * 100)','Float conversion can lose decimal precision before truncation.','Assuming multiplying a decimal float by 100 always produces an exact integer.'),o('round-float','(int) round((float) $input * 100)','Rounding cannot recover digits already lost when the large input became a float.','Treating rounding as a cure for representation loss at any magnitude.'),o('whole-only','(int) $input * 100','Casting before multiplication discards the two fractional digits.','Converting only the whole-unit portion.'),o('decimal-digits',"(int) str_replace('.', '', $input)",'The validated fixed-scale representation can be converted directly to integer cents without a float intermediary.')],key:'decimal-digits',explanation:'With exactly two fractional digits and a validated integer-range result, removing the single decimal point preserves the cents digits exactly. Float conversion is unnecessary and can lose information.',trace:'The strings become 1999 and 9007199254740993 before integer conversion. Both remain exact 64-bit integers.',validation:{kind:'patch',marker:'(int) ((float) $input * 100)',stdout:'[1999,9007199254740993]'},references:['https://www.php.net/manual/en/language.types.float.php','https://www.php.net/manual/en/language.types.integer.php'] }),
q({id:'PHP-E26-0176',format:'I',level:'M',topic:10,subtopic:'timestamp-constructor-timezone-application',objective:'Apply a display timezone after constructing an instant from an @ timestamp.',reason:'Distinguish an absolute timestamp input from a local wall-clock interpretation.',prerequisites:['DateTimeImmutable','Unix timestamp syntax','Timezones'],stem:'The same timestamp must be displayed in the requested timezone. Which replacement for the DateTimeImmutable construction makes timestamp zero display as 00:00 UTC and 09:00 Asia/Tokyo?',files:[file(`function displayAtZone(int $timestamp, string $zone): string
{
    $date = new DateTimeImmutable('@' . $timestamp, new DateTimeZone($zone));

    return $date->format('H:i');
}

echo json_encode([displayAtZone(0, 'UTC'), displayAtZone(0, 'Asia/Tokyo')]);`)],options:[o('convert-zone',"(new DateTimeImmutable('@' . $timestamp))->setTimezone(new DateTimeZone($zone))",'The timestamp establishes the instant; setTimezone changes how that instant is displayed.'),o('constructor-zone',"new DateTimeImmutable('@' . $timestamp, new DateTimeZone($zone))",'The timezone argument is ignored for the @ timestamp form.','Assuming the timezone argument overrides timezone information inherent in the input form.'),o('format-u',"DateTimeImmutable::createFromFormat('U', (string) $timestamp, new DateTimeZone($zone))",'The U timestamp format also establishes UTC rather than applying this display timezone argument.','Expecting a different timestamp parser to apply the ignored timezone automatically.'),o('local-epoch',"new DateTimeImmutable('1970-01-01 00:00:00', new DateTimeZone($zone))",'This creates local midnight in each zone, which represents different instants rather than converting timestamp zero.','Confusing the epoch instant with the same wall-clock text in every timezone.')],key:'convert-zone',explanation:'An @ timestamp represents an absolute instant with UTC interpretation. Apply setTimezone afterward to display that same instant in another zone.',trace:'Timestamp zero is midnight UTC. The Tokyo representation of that instant is 09:00.',validation:{kind:'patch',marker:"new DateTimeImmutable('@' . $timestamp, new DateTimeZone($zone))",stdout:'["00:00","09:00"]'},references:['https://www.php.net/manual/en/datetimeimmutable.construct.php','https://www.php.net/manual/en/datetimeimmutable.settimezone.php'] }),
q({id:'PHP-E26-0177',format:'I',level:'M',topic:15,subtopic:'pdo-order-identifier-allowlist',objective:'Implement a requested SQL sort identifier without treating a bound value as SQL syntax.',reason:'Distinguish parameterized data from identifiers and preserve a fixed allowlist boundary.',prerequisites:['PDO prepared statements','SQL identifiers versus values','Allowlists'],extensions:['PDO','pdo_sqlite'],assumptions:['The only permitted sort choices are name and id. The application owns the exact SQL identifier text for each choice. User input must never be concatenated as an unchecked identifier.'],stem:'Binding column currently sorts by a constant, so the id tie-breaker determines the order. Which implementation change enables the requested name sort safely?',files:[file(`$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE people (id INTEGER, name TEXT)');
$pdo->exec("INSERT INTO people VALUES (1, 'Z'), (2, 'A')");
$requested = 'name';
$statement = $pdo->prepare('SELECT name FROM people ORDER BY :column, id');
$statement->execute(['column' => $requested]);

echo json_encode($statement->fetchAll(PDO::FETCH_COLUMN));`)],options:[o('bind-type','Bind column with PDO::PARAM_STR explicitly so the database treats it as a column name.','A string parameter remains a data value, regardless of its PDO binding type.','Using a parameter type to request SQL syntax interpretation.'),o('quote-value','Use PDO::quote on the requested name and place the result after ORDER BY.','PDO::quote produces a quoted string value, not an identifier selection.','Confusing string-literal quoting with identifier construction.'),o('allowlisted-syntax','Allowlist the choice to a fixed ORDER BY identifier; reject unknown choices.','Only known SQL syntax is selected by the request; data values elsewhere can remain bound parameters.'),o('positional','Replace :column with a positional placeholder and pass name as its value.','Positional placeholders also represent values rather than identifiers.','Assuming placeholder naming style changes its SQL role.')],key:'allowlisted-syntax',explanation:'A prepared-statement parameter represents a data value. A dynamic identifier must instead be chosen from application-owned syntax through an explicit allowlist.',trace:'The original primary sort expression is the constant name, so id orders Z before A. Selecting the fixed name identifier makes the database sort by the name column.',validation:{kind:'contract',stdout:'["Z","A"]',keyEvidence:'The deterministic id tie-breaker exposes that the bound primary expression is a constant; an allowlisted identifier changes the SQL expression itself.',counterexamples:{'bind-type':'PARAM_STR still binds a value','quote-value':'Quoted name is still a string literal','positional':'A positional placeholder is still a value placeholder'}},references:['https://www.php.net/manual/en/pdo.prepare.php','https://www.php.net/manual/en/pdo.quote.php'] }),
q({id:'PHP-E26-0178',format:'I',level:'A',topic:22,subtopic:'generator-take-avoid-one-item-overfetch',objective:'Stop a limited generator traversal before advancing the source to an unnecessary next item.',reason:'Coordinate yield suspension, consumer resumption and foreach advancement to avoid hidden upstream work.',prerequisites:['Generators (advanced)','foreach advancement','Lazy source side effects'],stem:'take must yield two values while fetching exactly two source items. Replace the foreach body. Which implementation stops before fetching a third item?',files:[file(`function source(int &$fetched): Generator
{
    for ($value = 1; $value <= 4; $value++) {
        $fetched++;
        yield $value;
    }
}

function take(Generator $source, int $limit): Generator
{
    if ($limit <= 0) {
        return;
    }

    $count = 0;

    foreach ($source as $value) {
        if ($count++ >= $limit) {
            return;
        }

        yield $value;
    }
}

$fetched = 0;
$values = iterator_to_array(take(source($fetched), 2), false);

echo json_encode([$values, $fetched]);`)],options:[o('check-before',`if (++$count > $limit) {
    return;
}

yield $value;`,'The third source item has already been fetched before the top-of-body limit check can reject it.','Assuming a foreach body check runs before advancing to the next source item.'),o('stop-after-nth',`yield $value;

if (++$count === $limit) {
    return;
}`,'After the second yield resumes, the function returns before foreach advances the source again.'),o('postincrement',`yield $value;

if ($count++ === $limit) {
    return;
}`,'The zero-based postincrement comparison allows a third value to be yielded.','Mixing the count before increment with a one-based limit.'),o('stop-before-nth',`if (++$count === $limit) {
    return;
}

yield $value;`,'The second item is fetched but never yielded, so only one value reaches the consumer.','Stopping before producing the final allowed item.')],key:'stop-after-nth',explanation:'A foreach iteration fetches the current item before entering its body. To avoid one-item overfetch, stop immediately after the final allowed yield resumes and before the loop advances.',trace:'The source fetches and yields 1, then 2. Resuming after the second yield hits return, leaving fetched equal to 2.',validation:{kind:'patch',marker:'if ($count++ >= $limit) {\n            return;\n        }\n\n        yield $value;',stdout:'[[1,2],2]'},references:['https://www.php.net/manual/en/language.generators.syntax.php','https://www.php.net/manual/en/control-structures.foreach.php'] }),
q({id:"PHP-E26-0179",format:"I",level:"M",topic:21,subtopic:"reflection-zero-argument-construction-eligibility",objective:"Select classes that can actually be instantiated without supplied constructor arguments.",reason:"Combine instantiability, constructor visibility, abstractness and required-versus-total parameter counts.",prerequisites:["ReflectionClass","Constructor visibility","Optional parameters"],lessons:[24,25,28],coverageComplete:false,stem:"The factory may instantiate only classes usable with zero arguments, including constructors whose parameters are all optional. Which predicate selects exactly Simple and OptionalInput?",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Simple
{
}

class NeedsInput
{
    public function __construct(int $id)
    {
    }
}

class PrivateInput
{
    private function __construct()
    {
    }
}

class OptionalInput
{
    public function __construct(int $id = 7)
    {
    }
}

abstract class AbstractInput
{
}

$made = [];

foreach ([Simple::class, NeedsInput::class, PrivateInput::class, OptionalInput::class, AbstractInput::class] as $name) {
    $class = new ReflectionClass($name);
    $constructor = $class->getConstructor();

    if ($class->isInstantiable()) {
        try {
            $made[] = get_class($class->newInstance());
        } catch (Throwable $error) {
            $made[] = 'error:' . $name;
        }
    }
}

echo json_encode($made);
`}],options:[o("instantiable-only","$class->isInstantiable()","NeedsInput is instantiable in principle but still requires an argument.","Treating instantiability as a guarantee of zero-argument construction."),o("no-abstract","!$class->isAbstract() && ($constructor?->getNumberOfRequiredParameters() ?? 0) === 0","PrivateInput is nonabstract with zero required parameters but has an inaccessible constructor.","Ignoring constructor visibility when checking concrete classes."),o("no-parameters","$class->isInstantiable() && ($constructor?->getNumberOfParameters() ?? 0) === 0","This rejects OptionalInput even though its sole parameter has a default.","Counting all parameters instead of only required parameters."),o("zero-required","$class->isInstantiable() && ($constructor?->getNumberOfRequiredParameters() ?? 0) === 0","The class can be instantiated and its constructor requires no supplied arguments.",null)],key:"zero-required",explanation:"isInstantiable rules out abstract classes and inaccessible constructors, but not required constructor arguments. The required-parameter count supplies the remaining zero-argument condition.",trace:"Simple has no constructor. OptionalInput has zero required parameters. The other three classes fail one of the two checks.",validation:{"kind":"patch","marker":"$class->isInstantiable()","stdout":"[\"Simple\",\"OptionalInput\"]"},references:["https://www.php.net/manual/en/reflectionclass.isinstantiable.php","https://www.php.net/manual/en/reflectionfunctionabstract.getnumberofrequiredparameters.php"],revision:2}),
q({id:"PHP-E26-0180",format:"I",level:"M",topic:16,subtopic:"atomic-optimistic-version-conditional-update",objective:"Reject a stale write through an atomic version predicate while advancing the successful version.",reason:"Track two writers sharing an old snapshot and distinguish matched-row evidence from a later overwrite.",prerequisites:["PDO rowCount","Optimistic concurrency","Atomic conditional updates"],extensions:["PDO","pdo_sqlite"],assumptions:["Both writers read version 0 before either save. Each save is one atomic UPDATE. A successful save increments the stored version; a stale save must affect zero rows."],stem:"Which UPDATE statement allows first to win and prevents second, still using expected version 0, from overwriting it?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE documents (id INTEGER PRIMARY KEY, title TEXT, version INTEGER)');
$pdo->exec("INSERT INTO documents VALUES (1, 'old', 0)");
$sql = 'UPDATE documents SET title = :title, version = :expected + 1 WHERE id = :id';
$statement = $pdo->prepare($sql);
$counts = [];

foreach (['first', 'second'] as $title) {
    $statement->execute(['title' => $title, 'expected' => 0, 'id' => 1]);
    $counts[] = $statement->rowCount();
}

$stored = $pdo->query('SELECT title, version FROM documents WHERE id = 1')->fetch(PDO::FETCH_ASSOC);

echo json_encode([$counts, $stored]);
`}],options:[o("compare-version","'UPDATE documents SET title = :title, version = version + 1 WHERE id = :id AND version = :expected'","The first update matches version 0 and advances it; the second no longer matches.",null),o("at-least","'UPDATE documents SET title = :title, version = version + 1 WHERE id = :id AND version >= :expected'","After the first write, version 1 still satisfies >= 0, allowing the stale overwrite.","Treating any newer stored version as compatible with an old snapshot."),o("different-version","'UPDATE documents SET title = :title, version = version + 1 WHERE id = :id AND version <> :expected'","The initial matching snapshot is rejected, reversing the concurrency condition.","Updating only when the stored version differs from the expected version."),o("assign-version","'UPDATE documents SET title = :title, version = :expected + 1 WHERE id = :id'","Assigning a version does not check whether the old version still matches; both writes succeed.","Treating the version field as output metadata rather than part of the atomic precondition.")],key:"compare-version",explanation:"Optimistic concurrency compares the expected version in the same atomic statement that writes and increments it. A separate version assignment without a predicate cannot reject stale snapshots.",trace:"The first update affects one row and stores first/version 1. The second expected-0 update affects zero rows, leaving that state unchanged.",validation:{"kind":"patch","marker":"'UPDATE documents SET title = :title, version = :expected + 1 WHERE id = :id'","stdout":"[[1,0],{\"title\":\"first\",\"version\":1}]"},references:["https://www.php.net/manual/en/pdostatement.rowcount.php","https://www.sqlite.org/lang_update.html"],revision:2}),
q({id:'PHP-E26-0181',format:'T',level:'M',topic:14,subtopic:'csrf-missing-token-regression',objective:'Select a regression case that distinguishes missing-token rejection from equality alone.',reason:'Analyze a security precondition and distinguish it from the comparison primitive.',prerequisites:['CSRF tokens (unmapped curriculum)','hash_equals','Empty strings'],stem:'The token checker must reject an empty stored token or an empty submitted token, even if they compare equal. Which test fails against this implementation? Inputs shown are strings already extracted from the request.',files:[file(`function tokenMatches(string $stored, string $submitted): bool
{
    return hash_equals($stored, $submitted);
}`)],options:[o('match',"tokenMatches('abc', 'abc') === true",'Two identical nonempty tokens satisfy the contract.','Assuming a valid equal pair detects missing-input handling.'),o('different',"tokenMatches('abc', 'xyz') === false",'The comparison already rejects these different tokens.','Testing token inequality without testing absence.'),o('both-empty',"tokenMatches('', '') === false",'Two empty strings compare equal, so the implementation incorrectly returns true.'),o('one-empty',"tokenMatches('abc', '') === false",'Different lengths already produce false.','Assuming one missing token exercises the same path as two missing tokens.')],key:'both-empty',explanation:'Constant-time equality is not a presence check. A missing stored token must be rejected before an equality result can authorize a request.',trace:'hash_equals returns true for two empty strings. The repair adds explicit nonempty checks for both inputs.',validation:{kind:'tests',marker:'return hash_equals($stored, $submitted);',repair:"return $stored !== '' && $submitted !== '' && hash_equals($stored, $submitted);",cases:[{option:'match',probe:"echo json_encode(tokenMatches('abc', 'abc'));",expected:'true'},{option:'different',probe:"echo json_encode(tokenMatches('abc', 'xyz'));",expected:'false'},{option:'both-empty',probe:"echo json_encode(tokenMatches('', ''));",expected:'false'},{option:'one-empty',probe:"echo json_encode(tokenMatches('abc', ''));",expected:'false'}]},references:['https://www.php.net/manual/en/function.hash-equals.php','https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html']}),
q({id:'PHP-E26-0182',format:'T',level:'M',topic:7,subtopic:'recursive-leaf-count-test',objective:'Construct a test that distinguishes immediate child count from recursive scalar leaf count.',reason:'Trace a recursive specification through a tree with unequal branching.',prerequisites:['Recursion','Arrays','is_array'],lessons:[4,10],coverageComplete:true,stem:'A leaf is any non-array value; arrays, including empty arrays, are containers. leafCount must count all leaves at any depth. Which assertion exposes the bug?',files:[file(`function leafCount(array $tree): int
{
    $total = 0;

    foreach ($tree as $child) {
        $total += is_array($child) ? count($child) : 1;
    }

    return $total;
}`)],options:[o('empty','leafCount([]) === 0','No children means zero in both implementations.','Treating a base-case test as evidence for recursive descent.'),o('nested','leafCount([[1, [2, 3]]]) === 3','The implementation counts the two immediate children of the inner array and misses the deeper third leaf.'),o('flat','leafCount([1, 2, 3]) === 3','Each immediate scalar contributes one correctly.','Testing only a tree with no recursive branch.'),o('empty-child','leafCount([[], 7]) === 1','The empty container contributes zero and the scalar contributes one.','Assuming an empty nested array necessarily exposes the missing recursive call.')],key:'nested',explanation:'count on a child array measures its immediate entries. A recursive leaf count must apply leafCount to that child instead.',trace:'The nested example contains scalar leaves 1, 2 and 3; count([1, [2, 3]]) returns only 2.',validation:{kind:'tests',marker:'count($child)',repair:'leafCount($child)',cases:[{option:'empty',probe:'echo leafCount([]);',expected:'0'},{option:'nested',probe:'echo leafCount([[1, [2, 3]]]);',expected:'3'},{option:'flat',probe:'echo leafCount([1, 2, 3]);',expected:'3'},{option:'empty-child',probe:'echo leafCount([[], 7]);',expected:'1'}]},references:[ref.functions,ref.arrays]}),
q({id:'PHP-E26-0183',format:'T',level:'M',topic:11,subtopic:'query-value-delimiter-test',objective:'Choose input that reveals a missing query-component encoding boundary.',reason:'Connect a constructed query string with the receiving parser’s interpretation.',prerequisites:['Query strings','parse_str','rawurlencode'],lessons:[13],coverageComplete:true,stem:'roundTrip must return the original search term after constructing and parsing a query string. Which assertion fails? No HTTP request is made.',files:[file(`function roundTrip(string $term): string
{
    $query = 'q=' . $term;
    parse_str($query, $decoded);

    return $decoded['q'];
}`)],options:[o('word',"roundTrip('books') === 'books'",'Ordinary letters do not introduce query delimiters.','Choosing a value without query syntax characters.'),o('hyphen',"roundTrip('red-blue') === 'red-blue'",'A hyphen is safe in this query component.','Confusing unreserved punctuation with a query separator.'),o('digits',"roundTrip('007') === '007'",'parse_str keeps this value as a string, including its leading zeros.','Assuming the query parser converts digit values to integers.'),o('ampersand',"roundTrip('a&b=2') === 'a&b=2'",'The unencoded ampersand starts a second parameter, so q becomes only a.')],key:'ampersand',explanation:'A value must be encoded as a query component before joining it with query syntax. Otherwise characters inside the value become structural separators.',trace:'The faulty query is q=a&b=2. Encoding the value yields q=a%26b%3D2 and restores the entire original string.',validation:{kind:'tests',marker:"$query = 'q=' . $term;",repair:"$query = 'q=' . rawurlencode($term);",cases:[{option:'word',probe:"echo roundTrip('books');",expected:'books'},{option:'hyphen',probe:"echo roundTrip('red-blue');",expected:'red-blue'},{option:'digits',probe:"echo roundTrip('007');",expected:'007'},{option:'ampersand',probe:"echo roundTrip('a&b=2');",expected:'a&b=2'}]},references:['https://www.php.net/manual/en/function.parse-str.php','https://www.php.net/manual/en/function.rawurlencode.php']}),
q({id:"PHP-E26-0184",format:"T",level:"M",topic:10,subtopic:"append-mode-seek-regression",objective:"Test whether a file mode honors overwriting at a seeked position.",reason:"Distinguish initial cursor placement from append-mode write semantics.",prerequisites:["fopen modes","fseek","File fixtures"],lessons:[20],coverageComplete:true,stem:"writePrefix must replace bytes from offset zero without truncating the remaining suffix. The fixture is a fresh local file, all I/O succeeds, and each call resets its contents. Which assertion fails against the implementation?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function writePrefix(string $initial, string $prefix): string
{
    $path = __DIR__ . '/fixture.txt';
    file_put_contents($path, $initial);
    $handle = fopen($path, 'a+b');
    fseek($handle, 0);
    fwrite($handle, $prefix);
    fclose($handle);

    return file_get_contents($path);
}
`}],options:[o("existing","writePrefix('abcd', 'XY') === 'XYcd'","Append mode writes after abcd despite the seek, producing abcdXY.",null),o("empty-one","writePrefix('', 'X') === 'X'","Appending and overwriting are indistinguishable on an empty file.","Using an empty fixture to verify an overwrite requirement."),o("empty-many","writePrefix('', 'XYZ') === 'XYZ'","Both modes write these bytes into the empty file.","Assuming a longer payload changes append semantics on an empty fixture."),o("empty-write","writePrefix('abcd', '') === 'abcd'","Writing no bytes leaves the file intact in both modes.","Using a no-op write to distinguish cursor behavior.")],key:"existing",explanation:"In append mode, writes go to the end even after fseek. r+b opens an existing file for reading and writing without truncating it and respects the selected position.",trace:"The nonempty fixture exposes abcdXY versus XYcd. The other tests cannot distinguish appending from overwriting.",validation:{"kind":"tests","marker":"fopen($path, 'a+b')","repair":"fopen($path, 'r+b')","cases":[{"option":"existing","probe":"echo writePrefix('abcd', 'XY');","expected":"XYcd"},{"option":"empty-one","probe":"echo writePrefix('', 'X');","expected":"X"},{"option":"empty-many","probe":"echo writePrefix('', 'XYZ');","expected":"XYZ"},{"option":"empty-write","probe":"echo writePrefix('abcd', '');","expected":"abcd"}]},references:["https://www.php.net/manual/en/function.fopen.php"],revision:2}),
q({id:'PHP-E26-0185',format:'T',level:'M',topic:23,subtopic:'instant-versus-wall-clock-test',objective:'Select a timezone-sensitive test of instant equality.',reason:'Separate displayed local clock fields from a timezone-independent instant.',prerequisites:['DateTimeImmutable','UTC offsets','Unix timestamps'],stem:'sameInstant must compare instants to whole-second precision. All inputs below have zero fractional seconds. Which assertion fails?',files:[file(`function sameInstant(string $left, string $right): bool
{
    $a = new DateTimeImmutable($left);
    $b = new DateTimeImmutable($right);

    return $a->format('Y-m-d H:i:s') === $b->format('Y-m-d H:i:s');
}`)],options:[o('identical',"sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T10:00:00+00:00') === true",'Identical clocks and offsets identify the same instant.','Testing only identical representations.'),o('different-clock',"sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T11:00:00+00:00') === false",'Different clock values with the same offset identify different instants.','Testing elapsed time without varying timezone interpretation.'),o('same-clock-offset',"sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T10:00:00+01:00') === false",'The formatted clocks match, but the second instant is one hour earlier.'),o('different-date',"sameInstant('2025-01-01T10:00:00+00:00', '2025-01-02T10:00:00+00:00') === false",'The formatted dates already distinguish these instants.','Using a date change to test omitted timezone information.')],key:'same-clock-offset',explanation:'Formatting without an offset discards information needed to identify an instant. Comparing timestamps meets the stated whole-second contract.',trace:'10:00 at +01:00 is 09:00 UTC, while 10:00 at +00:00 is 10:00 UTC.',validation:{kind:'tests',marker:"$a->format('Y-m-d H:i:s') === $b->format('Y-m-d H:i:s')",repair:'$a->getTimestamp() === $b->getTimestamp()',cases:[{option:'identical',probe:"echo json_encode(sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T10:00:00+00:00'));",expected:'true'},{option:'different-clock',probe:"echo json_encode(sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T11:00:00+00:00'));",expected:'false'},{option:'same-clock-offset',probe:"echo json_encode(sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T10:00:00+01:00'));",expected:'false'},{option:'different-date',probe:"echo json_encode(sameInstant('2025-01-01T10:00:00+00:00', '2025-01-02T10:00:00+00:00'));",expected:'false'}]},references:[ref.datetime]}),
q({id:"PHP-E26-0186",revision:3,format:"T",level:"M",topic:23,subtopic:"regex-optional-capture-null-test",objective:"Select a test that distinguishes an unmatched optional capture from a captured empty string.",reason:"Trace optional named captures and the interaction between match flags and null coalescing.",prerequisites:["preg_match named captures","Optional capture groups","Null coalescing"],stem:"codeOf must return the uppercase code when present, none for a valid body with no code, and invalid for a nonmatching input. Which assertion fails against the implementation?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function codeOf(string $input): string
{
    $pattern = '/\\A(?:(?<code>[A-Z]+):)?(?<body>[a-z]+)\\z/';

    if (preg_match($pattern, $input, $matches) !== 1) {
        return 'invalid';
    }

    return $matches['code'] ?? 'none';
}
`}],options:[o("with-code","codeOf('ABC:note') === 'ABC'","A matched optional group contains its captured code as required.","Testing only inputs where the optional capture participates."),o("without-code","codeOf('note') === 'none'","The unmatched group is an empty string by default, so ?? does not choose none.",null),o("invalid","codeOf('bad!') === 'invalid'","The whole-pattern failure returns invalid before inspecting captures.","Testing overall rejection rather than an unmatched group inside a successful match."),o("short-code","codeOf('X:a') === 'X'","The one-character code is still a participating capture.","Assuming a short capture exercises the same condition as an absent capture.")],key:"without-code",explanation:"A successful preg_match can populate an unmatched optional group with an empty string. Null coalescing does not replace an empty string. PREG_UNMATCHED_AS_NULL gives the absent group the null representation expected by this implementation.",trace:"note matches the body but not code. Without the flag, matches[code] is an empty string; with the flag it is null and the fallback becomes none.",validation:{"kind":"tests","marker":"preg_match($pattern, $input, $matches)","repair":"preg_match($pattern, $input, $matches, PREG_UNMATCHED_AS_NULL)","cases":[{"option":"with-code","probe":"echo codeOf('ABC:note');","expected":"ABC"},{"option":"without-code","probe":"echo codeOf('note');","expected":"none"},{"option":"invalid","probe":"echo codeOf('bad!');","expected":"invalid"},{"option":"short-code","probe":"echo codeOf('X:a');","expected":"X"}]},references:["https://www.php.net/manual/en/function.preg-match.php"]}),
q({id:'PHP-E26-0187',format:'T',level:'M',topic:4,subtopic:'unique-scalar-type-test',objective:'Test type-preserving deduplication rather than string-based uniqueness.',reason:'Find a mixed-type input whose values share a string representation.',prerequisites:['Strict comparison','array_unique','array_values'],lessons:[1,4],coverageComplete:true,stem:'uniqueScalars must retain the first occurrence of each strictly distinct int or string, preserving order and returning a list. Which assertion exposes its defect?',files:[file(`function uniqueScalars(array $values): array
{
    return array_values(array_unique($values));
}`)],options:[o('ints','uniqueScalars([2, 2, 3]) === [2, 3]','Repeated integer values are removed as required.','Testing homogeneous values only.'),o('strings',"uniqueScalars(['a', 'a', 'b']) === ['a', 'b']",'Identical strings are removed as required.','Assuming duplicate text tests type preservation.'),o('leading-zero',"uniqueScalars(['01', '1']) === ['01', '1']",'Default string comparison keeps these distinct representations.','Assuming array_unique defaults to numeric comparison.'),o('mixed',"uniqueScalars([1, '1']) === [1, '1']",'Default string comparison treats integer 1 and string 1 as equal, losing the string.')],key:'mixed',explanation:'array_unique defaults to SORT_STRING. The contract instead requires strict identity, which can be implemented with an explicit strict membership check.',trace:'The integer and string both compare as the string 1 under the current algorithm. Strict in_array keeps both.',validation:{kind:'tests',marker:'return array_values(array_unique($values));',repair:`$result = [];

    foreach ($values as $value) {
        if (!in_array($value, $result, true)) {
            $result[] = $value;
        }
    }

    return $result;`,cases:[{option:'ints',probe:'echo json_encode(uniqueScalars([2, 2, 3]));',expected:'[2,3]'},{option:'strings',probe:"echo json_encode(uniqueScalars(['a', 'a', 'b']));",expected:'["a","b"]'},{option:'leading-zero',probe:"echo json_encode(uniqueScalars(['01', '1']));",expected:'["01","1"]'},{option:'mixed',probe:"echo json_encode(uniqueScalars([1, '1']));",expected:'[1,"1"]'}]},references:['https://www.php.net/manual/en/function.array-unique.php']}),
q({id:'PHP-E26-0188',format:'T',level:'M',topic:10,subtopic:'portable-display-filename-test',objective:'Test filename display extraction under explicitly mixed path separators.',reason:'Distinguish host filesystem path rules from an input-format requirement.',prerequisites:['String replacement','basename','Platform-specific separators'],lessons:[20],coverageComplete:true,assumptions:['The runtime is POSIX. Inputs are display labels, never paths used for opening files. The display format treats both / and backslash as separators.'],stem:'displayName must return the last component using either separator in the input format. Which assertion fails on the stated runtime?',files:[file(`function displayName(string $label): string
{
    return basename($label);
}`)],options:[o('windows',String.raw`displayName('C:\reports\item.txt') === 'item.txt'`,'POSIX basename does not interpret backslash as a directory separator.'),o('posix',"displayName('/reports/item.txt') === 'item.txt'",'A forward slash is a POSIX separator.','Testing only the runtime’s native path format.'),o('plain',"displayName('item.txt') === 'item.txt'",'A label with no separator already is its final component.','Using a separator-free input to test separator normalization.'),o('relative',"displayName('reports/item.txt') === 'item.txt'",'Relative forward-slash paths also work with basename.','Assuming only absolute native paths are recognized.')],key:'windows',explanation:'basename follows platform path rules. This display-only contract explicitly accepts both separators, so the input must normalize backslashes before basename.',trace:'On POSIX the backslashes remain ordinary characters. Replacing them with forward slashes lets basename find item.txt. This is not a filesystem authorization or sanitization algorithm.',validation:{kind:'tests',marker:'basename($label)',repair:String.raw`basename(str_replace('\\', '/', $label))`,cases:[{option:'windows',probe:String.raw`echo displayName('C:\reports\item.txt');`,expected:'item.txt'},{option:'posix',probe:"echo displayName('/reports/item.txt');",expected:'item.txt'},{option:'plain',probe:"echo displayName('item.txt');",expected:'item.txt'},{option:'relative',probe:"echo displayName('reports/item.txt');",expected:'item.txt'}]},references:['https://www.php.net/manual/en/function.basename.php']}),
q({id:'PHP-E26-0189',format:'T',level:'M',topic:10,subtopic:'exact-record-terminator-test',objective:'Distinguish removing one delimiter from trimming a character set.',reason:'Trace loss of meaningful trailing payload bytes at a framing boundary.',prerequisites:['rtrim','substr','Escaped string bytes'],lessons:[2,20],coverageComplete:true,assumptions:['Every record ends with exactly one framing CRLF sequence. Bytes before that sequence are payload and may include CR or LF.'],stem:'payload must remove only the final framing CRLF. Which assertion fails? Escape sequences in the options denote actual bytes.',files:[file(`function payload(string $record): string
{
    return rtrim($record, "\\r\\n");
}`)],options:[o('plain',String.raw`payload("abc\r\n") === 'abc'`,'The plain payload has no trailing trim characters.','Testing only payloads disjoint from the delimiter bytes.'),o('empty',String.raw`payload("\r\n") === ''`,'Removing the only delimiter produces the empty payload in both versions.','Assuming the empty payload distinguishes trimming from fixed-length removal.'),o('payload-lf',String.raw`payload("abc\n\r\n") === "abc\n"`,'rtrim also removes the LF belonging to the payload.'),o('embedded',String.raw`payload("a\nb\r\n") === "a\nb"`,'The embedded LF is protected by the later b byte.','Confusing trailing-character trimming with removal throughout a string.')],key:'payload-lf',explanation:'rtrim interprets its second argument as a set of removable trailing characters, not a single suffix. Given the guaranteed framing, removing exactly two bytes preserves payload line breaks.',trace:'For abc LF CR LF, rtrim removes all three trailing control bytes; substr with length -2 removes only the framing CR LF.',validation:{kind:'tests',marker:String.raw`rtrim($record, "\r\n")`,repair:'substr($record, 0, -2)',cases:[{option:'plain',probe:String.raw`echo json_encode(payload("abc\r\n"));`,expected:'"abc"'},{option:'empty',probe:String.raw`echo json_encode(payload("\r\n"));`,expected:'""'},{option:'payload-lf',probe:String.raw`echo json_encode(payload("abc\n\r\n"));`,expected:'"abc\\n"'},{option:'embedded',probe:String.raw`echo json_encode(payload("a\nb\r\n"));`,expected:'"a\\nb"'}]},references:['https://www.php.net/manual/en/function.rtrim.php']}),
q({id:'PHP-E26-0190',format:'T',level:'M',topic:23,subtopic:'spy-verifies-side-effect-arguments',objective:'Choose a test observation that verifies the payload sent to a dependency.',reason:'Separate return-value correctness from an externally visible collaborator call.',prerequisites:['Dependency injection','Test spies','JSON encoding'],stem:'publish must pass JSON for the supplied data to the sender exactly once and return its receipt. The sender here is a local spy. Which assertion fails after this call?',files:[file(`function publish(array $data, callable $send): string
{
    return $send(json_encode([]));
}

$calls = [];
$receipt = publish(['event' => 'ready'], function (string $body) use (&$calls): string {
    $calls[] = $body;

    return 'receipt-1';
});`)],options:[o('return',"$receipt === 'receipt-1'",'The sender’s receipt is returned even though its argument is wrong.','Treating the returned receipt as evidence that the correct payload was sent.'),o('payload',String.raw`$calls === ['{"event":"ready"}']`,'The spy recorded [] instead of the supplied event object.'),o('count','count($calls) === 1','The defect changes the argument, not the number of calls.','Testing invocation count without observing the transmitted data.'),o('type','is_string($calls[0]) === true','The wrong JSON payload is still a string.','Using a broad type assertion to verify specific payload contents.')],key:'payload',explanation:'A spy exposes collaborator arguments. A return-value assertion or call-count assertion cannot detect sending the wrong JSON body.',trace:'The function encodes an empty array and calls the spy once. Changing json_encode([]) to json_encode($data) preserves the receipt and count while correcting the body.',validation:{kind:'tests',marker:'json_encode([])',repair:'json_encode($data)',cases:[{option:'return',probe:'echo $receipt;',expected:'receipt-1'},{option:'payload',probe:'echo json_encode($calls);',expected:'["{\\"event\\":\\"ready\\"}"]'},{option:'count',probe:'echo count($calls);',expected:'1'},{option:'type',probe:'echo json_encode(is_string($calls[0]));',expected:'true'}]},references:[ref.testing,ref.json]}),
q({id:"PHP-E26-0191",format:"T",level:"M",topic:17,subtopic:"property-hook-assignment-result-test",objective:"Test the distinction between an assignment expression and the value stored by a set hook.",reason:"Combine PHP 8.4 property hooks with expression evaluation and normalization.",prerequisites:["PHP 8.4 property hooks","Assignment expression values"],lessons:[23,25],coverageComplete:false,stem:"renameLabel must return the normalized name that the object now stores. Which assertion exposes the defect? The hook is the only normalization step.",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Label
{
    public string $name = '' {
        set {
            $this->name = trim($value);
        }
    }
}

function renameLabel(string $input): string
{
    $label = new Label();

    return $label->name = $input;
}
`}],options:[o("plain","renameLabel('Ada') === 'Ada'","Already normalized text equals both the input and stored value.","Testing only input unchanged by the hook."),o("empty","renameLabel('') === ''","The empty input is unchanged by trim.","Assuming an empty value exercises a normalization difference."),o("internal","renameLabel('Ada Lovelace') === 'Ada Lovelace'","trim leaves internal spaces intact.","Confusing trim with removal of all spaces."),o("padded","renameLabel(' Ada ') === 'Ada'","The hook stores Ada, but the assignment expression evaluates to the original padded input.",null)],key:"padded",explanation:"A set hook can transform the stored value without changing the result of the assignment expression. Read the property after assignment when the API promises its normalized stored value.",trace:"The hook stores trim($input). The return expression still returns $input; the repair assigns first and then reads $label->name.",validation:{"kind":"tests","marker":"return $label->name = $input;","repair":"$label->name = $input;\n\n    return $label->name;","cases":[{"option":"plain","probe":"echo renameLabel('Ada');","expected":"Ada"},{"option":"empty","probe":"echo renameLabel('');","expected":""},{"option":"internal","probe":"echo renameLabel('Ada Lovelace');","expected":"Ada Lovelace"},{"option":"padded","probe":"echo renameLabel(' Ada ');","expected":"Ada"}]},references:["https://www.php.net/manual/en/language.oop5.property-hooks.php"],revision:2}),
q({id:"PHP-E26-0192",format:"T",level:"M",topic:20,subtopic:"retry-classification-permanent-cause-barrier",objective:"Test outward failure-policy overrides while retaining an exception’s diagnostic cause chain.",reason:"Separate causal history from retry authority across infrastructure and domain exception layers.",prerequisites:["Exception chaining","Retry classification","Infrastructure versus domain failure policy"],lessons:[22],coverageComplete:false,assumptions:["The explicit policy is to scan from the outermost exception inward. A PermanentFailure means the operation must not be retried, even if its cause was transient. A TransientFailure permits retry only if no outer PermanentFailure was encountered. Generic wrappers defer to their causes; no recognized classification means no retry."],stem:"Which assertion fails against the implementation and the stated retry policy? Constructors accept message, code and previous in the standard RuntimeException order.",files:[{path:"main.php",kind:"complete-file",source:`<?php

class TransientFailure extends RuntimeException
{
}

class PermanentFailure extends RuntimeException
{
}

function shouldRetry(Throwable $error): bool
{
    do {
        // Classification boundary goes here.
        if ($error instanceof TransientFailure) {
            return true;
        }

        $error = $error->getPrevious();
    } while ($error !== null);

    return false;
}
`}],options:[o("transient","shouldRetry(new TransientFailure('timeout')) === true","An outer transient classification permits retry in both implementations.","Testing the positive infrastructure signal without a domain override."),o("permanent-wrap","shouldRetry(new PermanentFailure('cancelled', 0, new TransientFailure('timeout'))) === false","The current loop passes through the permanent override and incorrectly accepts its transient cause.",null),o("generic-wrap","shouldRetry(new RuntimeException('adapter', 0, new TransientFailure('timeout'))) === true","A generic wrapper is explicitly allowed to defer to its cause.","Treating every wrapper as a permanent retry barrier."),o("unclassified","shouldRetry(new RuntimeException('unknown')) === false","The loop finds no transient signal and already returns false.","Using an unclassified failure to test precedence between conflicting classifications.")],key:"permanent-wrap",explanation:"A diagnostic cause explains how an operation failed; it does not necessarily authorize retrying the outer operation. The stated domain policy makes an outer PermanentFailure a barrier before inner transient causes are examined.",trace:"The failing case currently skips PermanentFailure and reaches TransientFailure, returning true. Checking for PermanentFailure before the transient test returns false at the outer layer without deleting the cause chain.",validation:{"kind":"tests","marker":"// Classification boundary goes here.","repair":"if ($error instanceof PermanentFailure) {\n            return false;\n        }\n","cases":[{"option":"transient","probe":"echo json_encode(shouldRetry(new TransientFailure('timeout')));","expected":"true"},{"option":"permanent-wrap","probe":"echo json_encode(shouldRetry(new PermanentFailure('cancelled', 0, new TransientFailure('timeout'))));","expected":"false"},{"option":"generic-wrap","probe":"echo json_encode(shouldRetry(new RuntimeException('adapter', 0, new TransientFailure('timeout'))));","expected":"true"},{"option":"unclassified","probe":"echo json_encode(shouldRetry(new RuntimeException('unknown')));","expected":"false"}]},references:["https://www.php.net/manual/en/exception.getprevious.php","https://www.php.net/manual/en/language.exceptions.php"],revision:2}),
q({id:'PHP-E26-0193',revision:3,format:'A',level:'M',topic:24,subtopic:'domain-outcome-transport-specific-mapping',objective:'Keep business outcomes reusable while HTTP and CLI adapters choose different transport representations.',reason:'Separate a domain decision from protocol status and process exit conventions.',prerequisites:['PHP service boundaries','HTTP response status','CLI exit codes'],assumptions:['A validation use case is shared by HTTP and CLI entry points. Invalid input must become HTTP status 422 in the HTTP adapter and process exit code 2 in the CLI adapter. The domain API must contain no HTTP or CLI concepts, and adding another transport must not change it.'],stem:'Which responsibility split preserves these boundaries while letting both entry points reuse the same validation decision?',options:[o('http-domain','Return an HTTP status from the domain use case and make every adapter interpret that status.','This makes the domain API and non-HTTP adapters depend on HTTP semantics.','Using one transport’s status vocabulary as the shared business result.'),o('sapi-branch','Have the domain use case inspect PHP_SAPI and choose the HTTP status or CLI exit code itself.','The domain now knows both transports and needs changes when another transport is added.','Treating runtime detection as separation of domain and transport concerns.'),o('domain-outcome','Return a transport-neutral validation outcome; each adapter maps it to its own status or exit code.','The domain decision stays unchanged while each adapter owns its transport representation.'),o('paired-statuses','Return both an HTTP status and a CLI exit code from the domain result object.','The domain result explicitly contains transport concepts and must expand for a new transport.','Assuming packaging multiple transport details in a DTO removes the coupling.')],key:'domain-outcome',explanation:'The validation decision is shared business information; HTTP response status and CLI exit status are adapter responsibilities. A neutral result lets those mappings differ without embedding transport policy in the domain API.',trace:'The HTTP adapter maps an invalid result to 422; the CLI adapter maps it to exit code 2. A later adapter adds its own mapping without changing the validation decision or its domain representation.',validation:{"kind": "document-review", "rule": "The stated domain API must express only the shared validation decision. Each entry point owns the required HTTP status or CLI exit code; adding a transport must not alter the domain API.", "optionAudit": {"http-domain": "HTTP status 422 becomes part of the shared API, making the CLI depend on HTTP semantics.", "sapi-branch": "Transport detection and per-transport branches move into the shared validation service.", "domain-outcome": "A neutral validation result is reusable; the entry points separately map it to 422 or 2.", "paired-statuses": "The domain result carries transport-specific fields and needs extension for another transport."}},references:[ref.enums,'https://www.php.net/manual/en/function.http-response-code.php','https://www.php.net/manual/en/function.exit.php']}),
q({id:'PHP-E26-0194',format:'A',level:'M',topic:19,subtopic:'composer-function-autoload-registration',objective:'Choose an autoload mechanism for a package exposing standalone PHP functions.',reason:'Distinguish function availability from class-name-triggered autoloading.',prerequisites:['Composer autoload configuration (unmapped curriculum)','Namespaced functions','PSR-4'],lessons:[31],coverageComplete:false,assumptions:['Composer 2 generates vendor/autoload.php. The package exposes function Acme\\Text\\slug in src/functions.php. That file only declares functions and has no I/O or other initialization side effects. Consumers must be able to call the function immediately after requiring vendor/autoload.php.'],stem:'Which package configuration satisfies this function API without requiring consumers to instantiate a helper class first?',options:[o('files','List src/functions.php under autoload.files.','Composer includes files entries when its autoloader is included, making the functions available.'),o('psr4','Map Acme\\Text\\ to src/ under autoload.psr-4.','PSR-4 class lookup does not trigger when an undefined function is called.','Assuming namespace-based function calls invoke the class autoloader.'),o('classmap','Add src/functions.php to autoload.classmap.','Classmap generation discovers classes, not a callable function-name loading map.','Treating classmaps as general symbol tables for functions.'),o('dev-files','List src/functions.php only under autoload-dev.files.','Root-only development autoload rules do not provide a dependency package’s public runtime API.','Making a required runtime function depend on development-only root configuration.')],key:'files',explanation:'PHP class autoloading is not function autoloading. Composer files entries load function declarations eagerly when vendor/autoload.php is required.',trace:'A consumer requires the generated autoloader. Its files loader includes functions.php before the consumer calls Acme\\Text\\slug.',validation:{kind:'document-review',rule:'Composer files autoloading includes declared files on autoloader inclusion; autoload-dev is root-only.',optionAudit:{files:'Includes the required declaration before the first function call.',psr4:'No class lookup occurs at the function call.',classmap:'Does not make standalone function calls trigger loading.','dev-files':'A dependency cannot export its required API through its own root-only development configuration.'}},references:['https://getcomposer.org/doc/04-schema.md#files','https://getcomposer.org/doc/04-schema.md#autoload-dev']}),
q({id:'PHP-E26-0195',format:'A',level:'M',topic:11,subtopic:'request-input-provenance-contract',objective:'Preserve a body-only field contract across PHP request-order configurations.',reason:'Separate input provenance from merged request convenience data.',prerequisites:['$_POST','$_GET','$_REQUEST','Input validation'],lessons:[13,14,15],coverageComplete:true,assumptions:['The endpoint accepts only POST requests with application/x-www-form-urlencoded bodies. An action field is permitted only in that body. Query strings and cookies may contain an action key but must never supply or override the body value. PHP request_order may differ between deployments.'],stem:'Where should the request adapter obtain action before validating that it is one allowed scalar string?',options:[o('request','Read $_REQUEST[\'action\']; request_order already defines one consistent source.','The merged source and precedence depend on configuration and do not establish body-only provenance.','Using deployment merge precedence as an API source contract.'),o('merge','Merge $_GET and $_POST with body values last, then read action.','When the body omits action, the query value still supplies it.','Treating body precedence as equivalent to requiring body presence.'),o('fallback','Read $_POST[\'action\'] and fall back to $_REQUEST when it is absent.','The fallback explicitly admits a non-body value for a required body field.','Applying a convenience fallback across a trust or provenance boundary.'),o('post','Read action directly from $_POST and reject a missing or non-scalar value.','This enforces the stated body source independently of merged request configuration.')],key:'post',explanation:'The adapter should enforce the API’s source contract before value validation. $_POST represents parsed form body fields under the stated content type; $_REQUEST is a configurable merge.',trace:'If only ?action=delete is present, a body-only endpoint must reject the missing body field. Both merging and fallback would incorrectly admit it.',validation:{kind:'document-review',rule:'$_REQUEST contents and ordering depend on request_order/variables_order; a body-only form contract must use the body source.',optionAudit:{request:'Cannot guarantee provenance across configuration changes.',merge:'Admits query-only action when the body omits it.',fallback:'Admits an alternate source precisely when the body field is missing.',post:'Keeps body presence and scalar validation explicit.'}},references:['https://www.php.net/manual/en/reserved.variables.request.php','https://www.php.net/manual/en/reserved.variables.post.php']}),
q({id:"PHP-E26-0196",format:"A",level:"M",topic:25,subtopic:"cache-miss-coalescing-lock-recheck",objective:"Design cache regeneration that avoids duplicate work by waiting contenders.",reason:"Trace two workers through a cache miss and serialized lock acquisition.",prerequisites:["Shared cache","Mutual exclusion","Waiting worker schedules"],assumptions:["Two PHP workers share a cache and a reliable per-key exclusive mutex. Cache writes become visible before unlock. Values do not expire during this scenario. Loading the source is expensive but has no side effects. Both workers initially observe a miss."],stem:"Worker A acquires the mutex, loads the value, writes the cache and releases the mutex. Worker B then acquires it. Which miss-handling design prevents B from needlessly loading the same source again while still returning a value?",options:[o("lock-load","On an initial miss, acquire the mutex, load the source, cache it, and unlock.","B serializes behind A but still loads unconditionally after acquiring the lock.","Assuming serialization alone coalesces repeated work."),o("recheck","On an initial miss, acquire the mutex, re-read the cache, load only if still absent, and unlock.","B observes A’s cached result after waiting and skips the duplicate load.",null),o("preload","On an initial miss, load the source first, then acquire the mutex only for the cache write.","Both workers perform the expensive load before the write is serialized.","Protecting publication while leaving the expensive work duplicated."),o("skip-wait","On an initial miss, try the mutex once and return null if another worker holds it.","A contender receives no value, contrary to the requirement that it return the result.","Trading away the response contract instead of waiting for shared work.")],key:"recheck",explanation:"The initial miss may become stale while a worker waits for the mutex. Rechecking under the lock distinguishes a still-missing value from work completed by the previous holder.",trace:"A publishes the value before unlock. B’s second cache read sees it and returns it without loading again, then releases the mutex.",validation:{"kind":"document-review","rule":"Apply the explicit mutex and visibility assumptions to the stated two-worker schedule.","optionAudit":{"lock-load":"B always reloads after A.","recheck":"B reads the newly published value under the lock.","preload":"Both loads precede serialized writes.","skip-wait":"A waiting contender can return null instead of a value."}},references:["https://www.php.net/manual/en/language.exceptions.php","https://www.php.net/manual/en/function.flock.php"],revision:2}),
q({id:"PHP-E26-0197",format:"A",level:"M",topic:24,subtopic:"configuration-composition-boundary",objective:"Place deployment configuration parsing outside reusable domain services.",reason:"Choose a boundary that supports per-instance policy values and early validation.",prerequisites:["Service configuration","Object lifetime","Value validation"],lessons:[23,24],coverageComplete:false,assumptions:["A PHP service calculates shipping using a nonnegative integer free-shipping threshold. HTTP and CLI entry points share it. One process may use two service instances with different thresholds. Invalid deployment configuration must fail before either instance handles an order."],stem:"Which design satisfies these lifecycle requirements?",options:[o("method-env","Read and validate the environment variable inside calculate() for each order.","Invalid configuration is discovered while handling an order, and both instances read the same process setting.","Treating request-time configuration access as startup validation and instance isolation."),o("static-cache","Parse the environment variable on the first calculation and cache it in a static property.","The first order triggers validation, and the cached value is shared across instances.","Using lazy global caching for an instance-specific policy."),o("constructor-value","Parse configuration in each entry point’s composition code, then pass a validated threshold into each service constructor.","Configuration fails before use and each service receives its own explicit policy value.",null),o("global-constant","Define one process-wide threshold constant in the bootstrap and have every service read it.","Startup validation is possible, but two instances cannot use different thresholds.","Confusing immutable process configuration with independently configurable instances.")],key:"constructor-value",explanation:"Composition code adapts deployment configuration into validated service inputs. The domain service then depends on an explicit per-instance value, not a process-wide lookup.",trace:"Bootstrap parsing rejects invalid values before constructing services. Two constructor calls can supply distinct validated thresholds within the same process.",validation:{"kind":"document-review","rule":"Evaluate each design against both early failure and two simultaneous instance values.","optionAudit":{"method-env":"Fails the pre-order validation and independent-instance requirements.","static-cache":"Fails early validation and shares one value.","constructor-value":"Meets both requirements through explicit validated construction.","global-constant":"Meets early validation but cannot represent two instance values."}},references:["https://www.php.net/manual/en/language.oop5.php","https://www.php.net/manual/en/language.constants.php"],revision:2}),
q({id:"PHP-E26-0198",format:"A",level:"A",topic:25,subtopic:"expired-lease-fencing-writes",objective:"Reject writes from a resumed worker whose exclusive lease has expired.",reason:"Distinguish lease ownership at acquisition from authority at a later external write.",prerequisites:["Distributed leases (advanced)","Increasing lease tokens","Atomic storage preconditions"],assumptions:["A PHP worker A obtains lease token 7 and pauses. Its lease expires; worker B obtains token 8 and writes successfully. A then resumes and sends its old write. Tokens are strictly increasing. The protected storage supports atomic conditional writes and per-resource metadata."],stem:"Which design prevents A’s delayed write from overwriting B’s result even if A cannot detect that it was paused?",options:[o("fence","Send the lease token with every write; storage rejects tokens lower than the largest accepted token.","After accepting token 8, storage rejects A’s token 7 regardless of A’s local state.",null),o("long-lease","Increase the lease duration so ordinary source reads finish before expiry.","The stated pause can still outlast the lease; duration does not reject the delayed write.","Treating a timing estimate as a correctness guarantee."),o("local-check","Check lease expiry immediately before building the outgoing write request.","The worker can pause again between the check and the storage applying the write.","Assuming a local check and remote mutation form one atomic operation."),o("unlock-check","Verify ownership before releasing the lease after the write.","The stale overwrite has already happened before this check.","Applying ownership validation only to cleanup after the protected action.")],key:"fence",explanation:"The protected resource must reject stale authority at the point of mutation. A monotonic fencing token lets storage make that decision atomically even when the worker is delayed.",trace:"Storage records token 8 with B’s successful write. A later submits token 7, which is lower and is rejected without altering B’s result.",validation:{"kind":"document-review","rule":"Use the stated monotonic token and atomic storage comparison contract; no real distributed service is contacted.","optionAudit":{"fence":"Token 7 is rejected after token 8.","long-lease":"A longer finite pause still defeats the timing assumption.","local-check":"A pause after the check preserves the race.","unlock-check":"The check occurs after the harmful mutation."}},references:["https://www.usenix.org/legacy/event/osdi06/tech/full_papers/burrows/burrows_html/"],revision:2}),
q({id:"PHP-E26-0199",format:"A",level:"A",topic:24,subtopic:"ordered-event-gap-recovery",objective:"Preserve per-entity transition order when an at-least-once transport delivers events out of order.",reason:"Combine duplicate suppression, sequence validation and recovery of missing transitions.",prerequisites:["At-least-once delivery (advanced)","Per-entity versions","Transactional consumer state"],assumptions:["A PHP projection has applied entity version 4. Events carry consecutive versions and noncommutative transitions; applying 6 before 5 is invalid. Version 6 arrives first, then 5, and any event may be redelivered. A durable store can atomically update the projection and applied version. Missing events can be fetched from an authoritative log."],stem:"Which consumer strategy preserves the required order without permanently losing version 6?",options:[o("id-only","Deduplicate event IDs and apply unseen events in arrival order in one projection transaction; acknowledge after commit.","Unique event IDs do not make version 6 valid before version 5.","Treating duplicate suppression as an ordering guarantee."),o("highest","Atomically apply any newer version and store its number; acknowledge after commit and acknowledge older deliveries without applying them.","Applying 6 skips transition 5 and later discards it as older.","Treating a high-water mark as proof that all earlier transitions were applied."),o("drop-gap","Atomically apply only the next version; acknowledge other deliveries without retaining them, relying on redelivery after a gap is filled.","Version 6 is lost when first acknowledged, even if version 5 arrives later.","Checking order without preserving or recovering deferred work."),o("recover-gap","Apply stored version + 1 atomically; ignore already applied versions, and durably defer gaps while recovering missing versions.","The gap is retained or recovered, so 5 can be applied before 6 while redeliveries remain harmless.",null)],key:"recover-gap",explanation:"Sequence checks prevent invalid transitions, but gaps also require a recovery path. Atomic projection/version updates distinguish already applied events from the next event and from future events.",trace:"Version 6 is deferred when the stored version is 4. After version 5 is applied, version 6 becomes the next admissible transition; repeated versions at or below the applied version do not apply again.",validation:{"kind":"document-review","rule":"Evaluate the provided 6-before-5 schedule with atomic applied-version updates and durable gap recovery.","optionAudit":{"id-only":"Applies a distinct but premature version 6.","highest":"Skips version 5 permanently.","drop-gap":"Acknowledges version 6 without preserving it.","recover-gap":"Preserves order and retains a route to eventual application."}},references:["https://www.enterpriseintegrationpatterns.com/patterns/messaging/Resequencer.html"],revision:2}),
q({id:"PHP-E26-0200",format:"A",level:"A",topic:15,subtopic:"pooled-tenant-setting-transaction-scope",objective:"Scope tenant context to a transaction when PHP workers reuse database connections.",reason:"Connect persistent session state, transaction boundaries and a row-security policy.",prerequisites:["PDO connection reuse (advanced)","PostgreSQL session and transaction settings","Row-level security","Transactions"],extensions:["PDO","pdo_pgsql (scenario only; not executed)"],assumptions:["A long-lived PHP worker must reuse a PostgreSQL 18 connection across tenants. The reusable connection starts with no session-level app.tenant_id value. An existing row-security policy reads a custom app.tenant_id setting; unset or empty context denies all rows. The worker has no row-security bypass privilege. Each job’s queries must run in one explicit transaction, and failed rollback makes the connection unusable and discarded."],stem:"Which context design prevents a completed job’s tenant setting from becoming the next job’s context while preserving the required connection reuse?",options:[o("session-once","Use session-level SET app.tenant_id once when the reusable connection is created.","The setting persists across later jobs, which may belong to different tenants.","Assigning per-job identity at connection lifetime scope."),o("local-every-job","Begin each job transaction, set app.tenant_id locally for that transaction, then commit or roll back before reuse.","SET LOCAL ends with the transaction, so tenant context does not persist into the next job.",null),o("set-if-empty","Before a job, set app.tenant_id only if the session currently has no value.","A prior tenant’s nonempty session value would be reused for a different tenant.","Treating existing context as valid without binding it to the current job."),o("after-success","Before BEGIN, use session-level SET for each job; clear it only after a successful commit.","The SET made before BEGIN survives rollback, and failure skips the success-only cleanup.","Limiting context cleanup to the success path.")],key:"local-every-job",explanation:"A tenant identity is job-scoped state. PostgreSQL SET LOCAL ties it to the current transaction rather than the reusable connection session; the stated transaction completion and discard rules close the failure path.",trace:"The job begins a transaction and installs its local tenant value before queries. Commit or rollback ends that local setting. The next job must install its own context in a new transaction.",validation:{"kind":"document-review","rule":"PostgreSQL SET LOCAL lasts only for the current transaction; apply the explicit connection lifecycle and fail-closed policy premises.","optionAudit":{"session-once":"Leaks connection-lifetime identity into later tenants.","local-every-job":"Context expires with each successfully ended transaction.","set-if-empty":"Reuses another tenant’s nonempty setting.","after-success":"The session SET occurs before BEGIN, so rollback does not undo it and failure skips cleanup."}},references:["https://www.postgresql.org/docs/18/sql-set.html","https://www.php.net/manual/en/features.persistent-connections.php"],revision:2}),
];
