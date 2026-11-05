import {q,file,option as o,ref} from './record.mjs';
export default [
q({id:'PHP-E26-0001',format:'E',level:'F',topic:5,subtopic:'signed-integer-division',objective:'Predict truncation and remainder signs for integer division.',reason:'Apply the definitions of two integer operators to one pair of operands.',prerequisites:['Integer arithmetic'],lessons:[2],coverageComplete:true,stem:'What exact text does this program print?',files:[file(`echo intdiv(-7, 3), '|', -7 % 3;`)],options:[o('floor','-3|2','intdiv truncates toward zero, rather than toward negative infinity.','Treating division and remainder as Euclidean floor division.'),o('truncate','-2|-1','The quotient truncates toward zero; the remainder has the dividend’s sign.'),o('positive-remainder','-2|1','The negative dividend produces remainder -1, not +1.','Assuming every remainder is nonnegative.'),o('fraction','-2.3333333333333|-1','intdiv returns an integer quotient, not a floating-point quotient.','Confusing intdiv with the / operator.')],key:'truncate',explanation:'PHP integer division truncates toward zero. The remainder is consistent with -7 = (-2 × 3) + (-1).',trace:'intdiv(-7, 3) is -2 and -7 % 3 is -1; the literal separator is printed between them.',validation:{kind:'output',stdout:'-2|-1'},references:['https://www.php.net/manual/en/function.intdiv.php','https://www.php.net/manual/en/language.operators.arithmetic.php']}),
q({id:'PHP-E26-0002',format:'E',level:'F',topic:4,subtopic:'numeric-string-array-keys',objective:'Distinguish canonical integer-string keys from strings with a leading zero.',reason:'Follow one key conversion and one replacement in an array literal.',prerequisites:['Associative array keys'],lessons:[4],coverageComplete:true,stem:'Which JSON array of keys is printed?',files:[file(`$values = ['8' => 'first', '08' => 'second', 8 => 'third'];

echo json_encode(array_keys($values));`)],options:[o('three','["8","08",8]','The key "8" is converted to integer 8 before the later entry is assigned.','Assuming all written key types remain distinct.'),o('one','[8]','The leading-zero key "08" stays a string, so it is a separate entry.','Converting every digit string to an integer key.'),o('two','[8,"08"]','The last entry replaces integer key 8; the string key "08" remains.'),o('reordered','["08",8]','Replacing an existing key does not move it to the end of iteration order.','Treating replacement as removal followed by insertion.')],key:'two',explanation:'PHP converts the canonical integer string "8" to an integer array key. The leading-zero string "08" stays distinct.',trace:'The first key becomes 8. The second is "08". Assigning key 8 again changes its value without changing its position.',validation:{kind:'output',stdout:'[8,"08"]'},references:['https://www.php.net/manual/en/language.types.array.php']}),
q({id:'PHP-E26-0003',format:'E',level:'F',topic:5,subtopic:'nullsafe-argument-evaluation',objective:'Determine whether a nullsafe call evaluates its argument expressions.',reason:'Apply the short-circuit rule of a single nullsafe call.',prerequisites:['Null','Method-call arguments','Nullsafe operator'],lessons:[1,23],coverageComplete:true,stem:'What does this program print, or which error escapes? Only the displayed variables are defined.',files:[file(`$receiver = null;
$calls = 0;

$receiver?->save(++$calls);

echo $calls;`)],options:[o('one','1','The call short-circuits before evaluating ++$calls.','Evaluating arguments before checking the null receiver.'),o('type-error','An uncaught TypeError','A null receiver is explicitly permitted by ?->.','Treating a nullsafe call like an ordinary method call.'),o('method-error','An uncaught Error for an unknown save method','Method lookup is skipped when the receiver is null.','Resolving the method even though the call short-circuits.'),o('zero','0','The null receiver skips both the call and its argument expression.')],key:'zero',explanation:'The nullsafe operator short-circuits the call when its receiver is null, including evaluation of the call’s arguments.',trace:'receiver is null, so ++$calls is never evaluated and calls remains zero.',validation:{kind:'output',stdout:'0'},references:['https://www.php.net/manual/en/language.oop5.basic.php#language.oop5.basic.nullsafe']}),
q({id:'PHP-E26-0004',format:'E',level:'F',topic:4,subtopic:'null-valued-key-presence',objective:'Choose the correct presence semantics for a null-valued array entry.',reason:'Compare two defined key-presence APIs on one stored null.',prerequisites:['Associative arrays','null','isset'],lessons:[1,4],coverageComplete:true,stem:'What JSON is printed for the explicitly stored email entry?',files:[file(`$profile = ['email' => null];

echo json_encode([
    isset($profile['email']),
    array_key_exists('email', $profile),
]);`)],options:[o('both-true','[true,true]','isset returns false for a value of null even when the key exists.','Treating isset as a pure key-existence test.'),o('distinct','[false,true]','isset rejects null; array_key_exists still finds the stored key.'),o('both-false','[false,false]','A stored null does not remove the key from the array.','Equating a null-valued entry with an absent key.'),o('reversed','[true,false]','The two functions have the opposite behaviors from this proposed pair.','Assigning null rejection to array_key_exists instead of isset.')],key:'distinct',explanation:'isset checks that the value exists and is not null. array_key_exists checks the key independently of its value.',trace:'email is a real key whose value is null, so the first predicate is false and the second true.',validation:{kind:'output',stdout:'[false,true]'},references:['https://www.php.net/manual/en/function.isset.php','https://www.php.net/manual/en/function.array-key-exists.php']}),
q({id:'PHP-E26-0005',format:'E',level:'F',topic:17,subtopic:'object-assignment-alias',objective:'Recognize that assigning an object variable does not clone the object.',reason:'Trace one assignment and one property mutation through two object variables.',prerequisites:['Objects','Property access'],lessons:[23],coverageComplete:true,stem:'What JSON is printed after modifying the second variable?',files:[file(`$first = (object) ['count' => 1];
$second = $first;
$second->count = 4;

echo json_encode([$first->count, $first === $second]);`)],options:[o('same','[4,true]','Both variables identify the same object, whose count is now 4.'),o('copied','[1,false]','Assignment alone does not create a distinct object.','Applying array-style value copying to object assignment.'),o('equal-copy','[1,true]','Identical object variables cannot expose two different values for this property.','Assuming identity comparison means matching initial contents.'),o('mutated-copy','[4,false]','No clone or new object appears between the two assignments.','Assuming property mutation separates the object automatically.')],key:'same',explanation:'Object assignment copies the object identifier. Mutating that object through either variable is observable through the other.',trace:'first and second both identify one object. Setting second->count changes that object, and === confirms identity.',validation:{kind:'output',stdout:'[4,true]'},references:['https://www.php.net/manual/en/language.oop5.references.php']}),
q({id:'PHP-E26-0006',format:'E',level:'F',topic:2,subtopic:'variable-variable-target',objective:'Resolve a variable variable using the current name string.',reason:'Resolve two simple indirect assignments without introducing reference semantics.',prerequisites:['Variables','Variable variables'],lessons:[2],coverageComplete:true,stem:'What text is printed? All variables shown are in the same scope.',files:[file(`$name = 'count';
$$name = 3;
$name = 'limit';
$$name = 8;

echo $count, '|', $limit;`)],options:[o('same-target','8|8','Changing name redirects later indirect assignment; it does not change count.','Treating the earlier target as a permanent binding.'),o('name-values','count|limit','The assignments store integers in the named variables.','Confusing the target variable names with their assigned values.'),o('distinct','3|8','The first assignment targets count and the second targets limit.'),o('reference','3|3','The two indirect assignments neither alias each other nor share one value.','Reading variable-variable syntax as a reference binding.')],key:'distinct',explanation:'$$name selects a variable by the current string in name. It does not establish a reference that follows future changes to name.',trace:'The first assignment creates count=3. After changing name, the second creates limit=8.',validation:{kind:'output',stdout:'3|8'},references:['https://www.php.net/manual/en/language.variables.variable.php']}),
q({id:'PHP-E26-0007',format:'E',level:'F',topic:3,subtopic:'byte-length-utf8-string',objective:'Distinguish PHP byte-string length from character count.',reason:'Apply strlen’s byte-count contract to one specified UTF-8 character.',prerequisites:['Strings','UTF-8 bytes'],lessons:[1],coverageComplete:true,stem:'What integer is printed? The source is UTF-8, and the string contains only the character é, encoded as bytes C3 A9.',files:[file(`echo strlen('é');`)],options:[o('character','1','strlen counts the two encoded bytes, not one Unicode character.','Treating strlen as a Unicode character counter.'),o('bytes','2','The explicitly specified UTF-8 encoding contains two bytes.'),o('terminator','3','PHP string length does not count a trailing C-style null terminator.','Adding a storage terminator to the visible byte length.'),o('bits','16','strlen reports bytes, not the number of bits in those bytes.','Converting byte length into bit length.')],key:'bytes',explanation:'PHP strings are byte sequences, and strlen reports their byte length.',trace:'The specified encoding is C3 A9, exactly two bytes. No multibyte-string function is called.',validation:{kind:'output',stdout:'2'},references:['https://www.php.net/manual/en/function.strlen.php']}),
q({id:'PHP-E26-0008',format:'E',level:'F',topic:4,subtopic:'append-after-unset-index',objective:'Track the next integer append index after removing the last element.',reason:'Follow one unset and one append while distinguishing array keys from positions.',prerequisites:['Integer array keys','unset','Array append'],lessons:[4],coverageComplete:true,stem:'What JSON is printed? No reindexing function is called.',files:[file(`$items = [10, 20];
unset($items[1]);
$items[] = 30;

echo json_encode($items);`)],options:[o('list','[10,30]','Removing key 1 does not reset the array’s next append index to 1.','Assuming append always fills the most recent hole.'),o('null-hole','[10,null,30]','An absent key is not stored as an explicit null array element.','Treating a missing PHP array key as a null list slot.'),o('sparse','{"0":10,"2":30}','The appended entry uses key 2; the non-list keys encode as a JSON object.'),o('overwrite','[30]','Append does not overwrite the remaining entry at key 0.','Using the current element count as the existing key to replace.')],key:'sparse',explanation:'unset removes an entry without reindexing or rewinding the array’s next integer append index.',trace:'Keys start at 0 and 1. Removing 1 leaves next append index 2. The resulting keys 0 and 2 are not a JSON list.',validation:{kind:'output',stdout:'{"0":10,"2":30}'},references:['https://www.php.net/manual/en/language.types.array.php','https://www.php.net/manual/en/function.json-encode.php']}),
q({id:'PHP-E26-0009',format:'E',level:'F',topic:3,subtopic:'boolean-string-conversion',objective:'Apply PHP’s boolean conversion rules to nonempty strings.',reason:'Classify three literal strings using one conversion rule.',prerequisites:['Boolean casts','Strings'],lessons:[1],coverageComplete:true,stem:'What JSON is produced by these explicit boolean casts?',files:[file(`$values = ['false', '0', '00'];
$flags = array_map(fn ($value) => (bool) $value, $values);

echo json_encode($flags);`)],options:[o('word-parsing','[false,false,false]','A boolean cast does not parse English boolean words or arbitrary zero-like strings.','Treating casts as semantic parsing of form text.'),o('all-nonempty','[true,true,true]','The exact string "0" is a special falsy string.','Assuming every nonempty string is truthy.'),o('numeric-only','[true,false,false]','The two-character string "00" is truthy.','Applying numeric comparison with zero during a boolean cast.'),o('php-rules','[true,false,true]','Only the exact string "0" among these values is falsy.')],key:'php-rules',explanation:'For strings, the empty string and the exact string "0" are falsy. Other nonempty strings are truthy.',trace:'"false" is a nonempty ordinary string, "0" is the special falsy string, and "00" is a different nonempty string.',validation:{kind:'output',stdout:'[true,false,true]'},references:['https://www.php.net/manual/en/language.types.boolean.php']}),
q({id:'PHP-E26-0010',format:'E',level:'F',topic:6,subtopic:'unhandled-match-without-default',objective:'Identify the outcome of a match expression with no matching arm.',reason:'Recognize one defined control-flow failure rather than infer an implicit default.',prerequisites:['match','Throwable','get_class'],lessons:[3,22],coverageComplete:true,stem:'Which class name is printed by the catch block?',files:[file(`try {
    $label = match (3) {
        1 => 'one',
        2 => 'two',
    };
} catch (Throwable $error) {
    echo get_class($error);
}`)],options:[o('unhandled','UnhandledMatchError','No arm matches and there is no default, so PHP raises UnhandledMatchError.'),o('type','TypeError','The subject and arm conditions are type-valid integers.','Mistaking absence of a matching arm for an argument type failure.'),o('value','ValueError','match has its own defined error type for this situation.','Applying the error category used by invalid built-in argument values.'),o('exception','Exception','get_class reports the concrete thrown object, not a generic exception category.','Assuming control-flow failures instantiate the base Exception class.')],key:'unhandled',explanation:'A match expression must select an arm. With no matching condition and no default, it throws UnhandledMatchError.',trace:'The subject 3 matches neither integer 1 nor integer 2. Throwable catches the resulting error and get_class reveals its concrete class.',validation:{kind:'output',stdout:'UnhandledMatchError'},references:['https://www.php.net/manual/en/control-structures.match.php']}),
q({id:'PHP-E26-0011',format:'E',level:'F',topic:21,subtopic:'enum-case-name-versus-value',objective:'Distinguish a backed enum case’s name from its scalar value.',reason:'Read two explicitly declared enum properties without conversion or lookup.',prerequisites:['Backed enums (unmapped curriculum)'],stem:'What text is printed from the selected enum case?',files:[file(`enum State: string
{
    case Open = 'open';
}

$state = State::Open;

echo $state->name, '|', $state->value;`)],options:[o('values','open|open','The name is the declared identifier Open, including its capitalization.','Assuming name is an alias for the backing value.'),o('names','Open|Open','The value is the declared string "open", not the identifier.','Using the case identifier as the backing value.'),o('distinct','Open|open','name exposes Open; value exposes the declared string open.'),o('qualified','State::Open|open','The name property does not include the enum’s qualified class name.','Treating the case name property as a fully qualified expression.')],key:'distinct',explanation:'A backed enum case exposes its declared case identifier as name and its explicitly assigned scalar as value.',trace:'The declaration names the case Open and assigns the string open. No conversion function is involved.',validation:{kind:'output',stdout:'Open|open'},references:['https://www.php.net/manual/en/language.enumerations.basics.php','https://www.php.net/manual/en/language.enumerations.backed.php']}),
q({id:'PHP-E26-0012',format:'E',level:'F',topic:15,subtopic:'empty-pdo-fetch-results',objective:'Distinguish a single-row fetch failure from an empty fetched result set.',reason:'Apply the two fetch methods’ documented empty-result return values.',prerequisites:['PDO statements (unmapped curriculum)','Arrays and false'],extensions:['PDO','pdo_sqlite'],stem:'What JSON is printed? SQLite is in memory and both queries produce zero rows.',files:[file(`$pdo = new PDO('sqlite::memory:');
$one = $pdo->query('SELECT 1 WHERE 0');
$all = $pdo->query('SELECT 1 WHERE 0');

echo json_encode([
    $one->fetch(PDO::FETCH_ASSOC),
    $all->fetchAll(PDO::FETCH_ASSOC),
]);`)],options:[o('both-arrays','[[],[]]','fetch returns false when no next row exists.','Assuming every fetching method returns an array on an empty result.'),o('distinct','[false,[]]','fetch signals no row with false; fetchAll returns an empty result array.'),o('both-false','[false,false]','fetchAll returns an array containing all remaining rows, even when there are none.','Using the single-row sentinel for the whole result set.'),o('nulls','[null,null]','Neither successful empty query uses null for these method results.','Treating absent SQL rows as SQL NULL values.')],key:'distinct',explanation:'fetch returns one row or false when exhausted. fetchAll returns an array of rows; zero rows is an empty array.',trace:'Both statements execute successfully. The first has no next row, and the second has no rows to collect.',validation:{kind:'output',stdout:'[false,[]]'},references:['https://www.php.net/manual/en/pdostatement.fetch.php','https://www.php.net/manual/en/pdostatement.fetchall.php']}),
q({id:'PHP-E26-0013',format:'E',level:'F',topic:4,subtopic:'merge-numeric-and-string-keys',objective:'Predict array_merge behavior for numeric keys and duplicate string keys.',reason:'Apply the documented merge rules to two small arrays.',prerequisites:['Numeric and string array keys','array_merge'],lessons:[4],coverageComplete:true,stem:'What JSON does this merge print? Preserve the result’s iteration order in your answer.',files:[file(`$left = [2 => 'a', 'tag' => 'old'];
$right = [5 => 'b', 'tag' => 'new'];

echo json_encode(array_merge($left, $right));`)],options:[o('preserve-all','{"2":"a","tag":"new","5":"b"}','array_merge renumbers numeric keys instead of preserving 2 and 5.','Applying string-key replacement rules to numeric keys.'),o('left-wins','{"0":"a","tag":"old","1":"b"}','For duplicate string keys, the later value replaces the earlier value.','Confusing array_merge with left-biased array union.'),o('move-tag','{"0":"a","1":"b","tag":"new"}','Replacing the tag value does not move its original position.','Treating string-key replacement as a new insertion at the end.'),o('merge-rules','{"0":"a","tag":"new","1":"b"}','Numeric entries are renumbered; the later tag value replaces old in place.')],key:'merge-rules',explanation:'array_merge appends and renumbers numeric-keyed entries, while later values replace duplicate string-keyed entries.',trace:'The left numeric entry becomes key 0. tag is inserted next. The right numeric entry becomes key 1, and tag is then replaced without moving.',validation:{kind:'output',stdout:'{"0":"a","tag":"new","1":"b"}'},references:['https://www.php.net/manual/en/function.array-merge.php']}),
q({id:'PHP-E26-0014',format:'E',level:'F',topic:20,subtopic:'first-matching-catch',objective:'Select the first matching catch clause rather than the most specific type.',reason:'Use inheritance and source order to select one handler.',prerequisites:['Exception inheritance','catch'],lessons:[22,26],coverageComplete:true,stem:'Which word is printed when the exception is thrown?',files:[file(`try {
    throw new RuntimeException('failed');
} catch (Exception $error) {
    echo 'parent';
} catch (RuntimeException $error) {
    echo 'specific';
}`)],options:[o('specific','specific','PHP does not skip an earlier matching parent-type catch to seek a more specific clause.','Assuming catch selection chooses the narrowest available type.'),o('both','parentspecific','After one catch handles the throwable, later catches are not executed.','Treating matching catch clauses as independent if statements.'),o('parent','parent','RuntimeException extends Exception, so the first catch matches.'),o('rejected','No word; the catch order is a syntax error','This ordering is legal even though the later catch is unreachable for this throwable.','Confusing an unreachable handler with a parse-time prohibition.')],key:'parent',explanation:'Catch clauses are checked in order, and the first compatible type handles the throwable.',trace:'RuntimeException is an Exception, so the first catch executes and the second is skipped.',validation:{kind:'output',stdout:'parent'},references:['https://www.php.net/manual/en/language.exceptions.php']}),
q({id:'PHP-E26-0015',format:'E',level:'F',topic:19,subtopic:'class-name-resolution-without-loading',objective:'Resolve ::class without assuming the referenced class must already exist.',reason:'Apply namespace name resolution to a class-name string expression.',prerequisites:['Namespaces','::class'],lessons:[23,31],coverageComplete:true,stem:'What is printed? No App\\Missing class is defined, and no autoloader is registered.',files:[file(`namespace App;

echo Missing::class;`)],options:[o('qualified','App\\Missing','::class resolves the class-name string without creating or loading the class.'),o('short','Missing','An unqualified name in this namespace resolves relative to App.','Assuming ::class returns the source spelling before namespace resolution.'),o('error','An uncaught Error for a missing class','Producing the name string does not require that class to exist.','Confusing ::class with constructing an instance.'),o('leading-separator','\\App\\Missing','The resolved class-name string omits the leading qualification separator.','Including a source-level leading backslash in the resolved class-name string.')],key:'qualified',explanation:'The ::class form produces a resolved class-name string; it does not instantiate or require the class.',trace:'Missing is an unqualified name inside App, so its resolved spelling is App\\Missing.',validation:{kind:'output',stdout:'App\\Missing'},references:['https://www.php.net/manual/en/language.oop5.basic.php#language.oop5.basic.class.class','https://www.php.net/manual/en/language.namespaces.rules.php']}),
q({id:'PHP-E26-0016',format:'E',level:'M',topic:7,subtopic:'named-variadic-keys',objective:'Track positional and named values collected by an untyped variadic parameter.',reason:'Combine argument binding rules with the resulting array-key types.',prerequisites:['Variadics','Named arguments','JSON list versus object encoding'],lessons:[4,5,11],coverageComplete:true,stem:'What JSON does the function print for this call?',files:[file(`function collect(...$arguments): void
{
    echo json_encode($arguments);
}

collect(7, debug: true);`)],options:[o('list','[7,true]','An unmatched named argument keeps its string key in the variadic array.','Assuming variadics discard every argument name.'),o('named-only','{"debug":true}','The positional value is collected as well, under integer key 0.','Assuming a named argument replaces already collected positional arguments.'),o('mixed-keys','{"0":7,"debug":true}','The positional argument gets key 0 and the named one keeps debug.'),o('rejected-name','An uncaught Error for an unknown debug parameter','A variadic parameter can collect unmatched named arguments.','Applying non-variadic unknown-name rejection to variadic collection.')],key:'mixed-keys',explanation:'Variadics collect positional values with numeric keys and unmatched named values with their argument names.',trace:'The array is [0 => 7, "debug" => true]. Its mixed key structure encodes as a JSON object.',validation:{kind:'output',stdout:'{"0":7,"debug":true}'},references:['https://www.php.net/manual/en/functions.arguments.php#functions.variable-arg-list','https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments']}),
q({id:'PHP-E26-0017',format:'E',level:'M',topic:8,subtopic:'arrow-captured-object-rebinding',objective:'Separate mutation of a captured object from rebinding the outer variable.',reason:'Track the captured object identifier through mutation and later assignment of a different object.',prerequisites:['Arrow functions','Object identity','Variable assignment'],lessons:[9,23],coverageComplete:true,stem:'Which integer does the closure return when it is finally called?',files:[file(`$config = (object) ['value' => 1];
$read = fn () => $config->value;

$config->value = 2;
$config = (object) ['value' => 3];

echo $read();`)],options:[o('initial-property','1','Capturing an object by value does not snapshot its properties.','Treating by-value capture as a deep copy of the object.'),o('mutated-object','2','The captured identifier still points to the first object, which was mutated to 2.'),o('new-object','3','The arrow function did not capture the outer variable by reference.','Following the outer variable’s later rebinding.'),o('unbound','An uncaught Error because config is not imported with use','Arrow functions automatically capture the outer values they use.','Applying the explicit use requirement of ordinary closures to arrow functions.')],key:'mutated-object',explanation:'An arrow function captures the object identifier by value. Mutating that object is visible, while assigning a different object to the outer variable does not redirect the capture.',trace:'read retains the first object. Its value changes from 1 to 2. The later assignment changes only the outer config variable.',validation:{kind:'output',stdout:'2'},references:[ref.arrows,'https://www.php.net/manual/en/language.oop5.references.php']}),
q({id:'PHP-E26-0018',format:'E',level:'M',topic:17,subtopic:'destructor-last-strong-reference',objective:'Predict when a destructor runs as two aliases to the same object are unset.',reason:'Track object lifetime separately from the lifetime of each variable naming it.',prerequisites:['Object identity','unset','Destructors'],lessons:[6,23],coverageComplete:true,stem:'What JSON trace is printed? No other references to the Box object are created.',files:[file(`class Box
{
    public static array $trace = [];

    public function __destruct()
    {
        self::$trace[] = 'released';
    }
}

$first = new Box();
$second = $first;

unset($first);
Box::$trace[] = 'after-first';

unset($second);
Box::$trace[] = 'after-second';

echo json_encode(Box::$trace);`)],options:[o('first-unset','["released","after-first","after-second"]','The second variable still retains the object after first is unset.','Assuming the first unset destroys an object regardless of remaining aliases.'),o('last-unset','["after-first","released","after-second"]','The last strong reference is removed by unsetting second, so destruction occurs between the two markers.'),o('shutdown-only','["after-first","after-second"]','This acyclic object is destroyed when its last strong reference is removed, before the final echo.','Assuming every destructor waits until process shutdown.'),o('each-variable','["released","after-first","released","after-second"]','There is one object and one destructor call, not one per variable name.','Treating object assignment as creating a second object with its own lifetime.')],key:'last-unset',explanation:'Object assignment creates another reference to the same object. Unsetting a variable removes that reference; destruction occurs when the final strong reference to this acyclic object is removed.',trace:'second keeps the object alive after first is unset. Unsetting second invokes __destruct before the after-second marker is appended.',validation:{kind:'output',stdout:'["after-first","released","after-second"]'},references:['https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.destructor','https://www.php.net/manual/en/language.oop5.references.php'] }),
q({id:'PHP-E26-0019',format:'E',level:'M',topic:8,subtopic:'array-walk-mutation-and-return',objective:'Separate a by-reference callback mutation from array_walk’s own return value.',reason:'Track the callback’s parameter binding and distinguish two different return values.',prerequisites:['Callbacks','References','array_walk'],lessons:[4,5,8],coverageComplete:true,stem:'What JSON is printed? The callback’s return statement is intentional.',files:[file(`$values = [2, 3];
$result = array_walk($values, function (&$value): int {
    $value *= 2;

    return 99;
});

echo json_encode([$values, $result]);`)],options:[o('mapped-returns','[[99,99],true]','array_walk ignores callback return values rather than using them as replacement elements.','Applying array_map’s return-value transformation model.'),o('mutation','[[4,6],true]','The reference parameter mutates each value, while array_walk returns true.'),o('new-array','[[2,3],[4,6]]','The original array is mutated and array_walk does not return a transformed array.','Treating array_walk as a non-mutating mapping function.'),o('callback-result','[[4,6],99]','array_walk does not return the last callback result.','Propagating the callback’s return value through the outer API.')],key:'mutation',explanation:'array_walk passes each element to the callback, and a reference parameter can mutate it. Callback return values are discarded; the walk returns true.',trace:'The two reference writes change 2 to 4 and 3 to 6. Returning 99 has no effect on either the elements or the successful walk result.',validation:{kind:'output',stdout:'[[4,6],true]'},references:['https://www.php.net/manual/en/function.array-walk.php']}),
q({id:'PHP-E26-0020',format:'E',level:'M',topic:17,subtopic:'immutable-timezone-date-boundary',objective:'Preserve the original immutable instant while interpreting its date in another offset.',reason:'Combine immutable-return semantics with an explicit offset crossing midnight.',prerequisites:['DateTimeImmutable (unmapped curriculum)','Timezone offsets','Object methods'],stem:'What text is printed? The second zone is a fixed +02:00 offset, with no daylight-saving transition.',files:[file(`$utc = new DateTimeImmutable('2024-01-31 23:30:00', new DateTimeZone('UTC'));
$local = $utc->setTimezone(new DateTimeZone('+02:00'));

echo $utc->format('m-d H:i'), '|', $local->format('m-d H:i');`)],options:[o('mutated','02-01 01:30|02-01 01:30','setTimezone returns a new DateTimeImmutable and does not change utc.','Applying mutable DateTime behavior to DateTimeImmutable.'),o('unchanged-clock','01-31 23:30|01-31 23:30','The instant is preserved, but its displayed wall-clock time changes with the offset.','Confusing an unchanged instant with an unchanged local time.'),o('converted','01-31 23:30|02-01 01:30','utc remains unchanged; adding the display offset crosses into February.'),o('same-date','01-31 23:30|01-31 01:30','Moving two hours forward from 23:30 crosses the date boundary.','Adjusting the hour while failing to carry the day.')],key:'converted',explanation:'DateTimeImmutable returns a new value for a timezone change. The same instant appears two hours later in +02:00.',trace:'The original remains January 31 at 23:30 UTC. The returned value displays February 1 at 01:30 with the fixed offset.',validation:{kind:'output',stdout:'01-31 23:30|02-01 01:30'},references:['https://www.php.net/manual/en/datetimeimmutable.settimezone.php']}),
q({id:'PHP-E26-0021',format:'E',level:'M',topic:10,subtopic:'json-object-to-php-list-roundtrip',objective:'Recognize loss of JSON object shape when decoding numeric keys into an associative PHP array.',reason:'Trace key conversion during decode and list detection during encode.',prerequisites:['JSON objects','Associative decoding','Integer array keys'],lessons:[4],coverageComplete:false,stem:'What JSON is emitted by this decode/encode round trip?',files:[file(`$data = json_decode('{"0":"a","1":"b"}', true, flags: JSON_THROW_ON_ERROR);

echo json_encode($data, JSON_THROW_ON_ERROR);`)],options:[o('object-shape','{"0":"a","1":"b"}','Associative decoding produces consecutive integer array keys, which encode as a list.','Assuming the original JSON object shape is retained as metadata.'),o('list-shape','["a","b"]','Keys 0 and 1 form a PHP list after decoding, so encoding emits an array.'),o('empty','[]','Both string values survive decoding; only the container shape changes.','Assuming numeric property names are discarded during associative decoding.'),o('exception','An uncaught JsonException','The input is valid JSON and both operations support these keys.','Treating numeric object property names as invalid JSON.')],key:'list-shape',explanation:'Associative JSON decoding uses PHP array keys. Consecutive integer keys starting at zero make the resulting PHP array a list when it is encoded again.',trace:'The decoded keys become integers 0 and 1. json_encode therefore writes ["a","b"], without the original object syntax.',validation:{kind:'output',stdout:'["a","b"]'},references:['https://www.php.net/manual/en/function.json-decode.php','https://www.php.net/manual/en/function.json-encode.php']}),
q({id:'PHP-E26-0022',revision:2,format:'E',level:'M',topic:18,subtopic:'trait-alias-keeps-original-method',objective:'Distinguish creating a private trait alias from changing the original method’s visibility.',reason:'Resolve a trait adaptation and the visibility of the unchanged original name.',prerequisites:['Traits','Method aliases','Visibility'],lessons:[25,29],coverageComplete:true,stem:'What text is printed by the call outside the class?',files:[file(`trait Greeting
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

echo (new Greeter())->hello();`)],options:[o('renamed','An uncaught Error because hello was renamed','The as clause adds an alias and does not remove the original name.','Treating trait aliasing as destructive renaming.'),o('private','An uncaught Error because hello became private','The private visibility applies to hiddenHello, the new alias.','Applying an alias’s visibility modifier to the original method.'),o('visibility-conflict','An uncaught Error because a trait alias cannot narrow the original method’s visibility','Trait alias visibility can differ from the original method; this declaration is valid.','Confusing alias visibility adaptation with an incompatible inherited-method override.'),o('original','hello','The original public hello remains available alongside its private alias.')],key:'original',explanation:'A trait alias adds another method name. Giving that alias private visibility leaves the original public method unchanged.',trace:'Greeter has public hello and private hiddenHello. The shown call uses public hello once.',validation:{kind:'output',stdout:'hello'},references:[ref.traits]}),
q({id:'PHP-E26-0023',format:'E',level:'M',topic:17,subtopic:'readonly-null-coalescing-assignment',objective:'Distinguish a null readonly property from an uninitialized readonly property.',reason:'Combine the null test of ??= with the one-write rule of readonly properties.',prerequisites:['Readonly properties','Constructor promotion','Null coalescing assignment'],lessons:[1,2,24],coverageComplete:true,stem:'What text is printed? The readonly property is deliberately initialized to null by construction.',files:[file(`final class Record
{
    public function __construct(public readonly ?string $label)
    {
    }
}

$record = new Record(null);

try {
    $record->label ??= 'fallback';
} catch (Error $error) {
    echo 'blocked';
}

echo '|', json_encode($record->label);`)],options:[o('fallback','|"fallback"','The null value is already initialized; the attempted second write is not permitted.','Treating a null readonly property as uninitialized.'),o('skip','|null','??= attempts assignment when the current value is null.','Assuming ??= checks initialization rather than nullness.'),o('blocked','blocked|null','??= attempts a prohibited write, so Error is caught and the null remains.'),o('write-then-error','blocked|"fallback"','The prohibited write does not commit the fallback value before raising Error.','Assuming readonly enforcement occurs after mutation.')],key:'blocked',explanation:'A readonly property initialized to null has already consumed its initialization write. ??= still attempts to assign because its value is null.',trace:'Construction initializes label. The coalescing assignment raises Error before changing it, and the final encoding prints null.',validation:{kind:'output',stdout:'blocked|null'},references:['https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties','https://www.php.net/manual/en/language.operators.assignment.php']}),
q({id:'PHP-E26-0024',format:'E',level:'A',topic:22,subtopic:'generator-suspension-and-final-reference',objective:'Locate generator cleanup relative to lazy start, early loop termination and destruction.',reason:'Track generator creation, suspension at yield and finalization after the last reference is released.',prerequisites:['Generators (unmapped advanced curriculum)','finally','Object lifetime'],lessons:[22],coverageComplete:false,stem:'What JSON trace is printed? The shown variable is the only surviving reference to the generator after the loop.',files:[file(`$events = [];

function sequence(array &$events): Generator
{
    try {
        $events[] = 'start';
        yield 1;
        $events[] = 'continued';
    } finally {
        $events[] = 'cleanup';
    }
}

$generator = sequence($events);
$events[] = 'created';

foreach ($generator as $value) {
    break;
}

$events[] = 'after-loop';
unset($generator);

echo json_encode($events);`)],options:[o('eager','["start","created","after-loop","cleanup"]','Calling the generator function creates the generator without starting its body.','Assuming generator function bodies execute before the first yield immediately on creation.'),o('close-on-break','["created","start","cleanup","after-loop"]','The generator remains referenced and suspended after break, so cleanup has not run yet.','Treating break as closing a still-referenced generator.'),o('resume-to-end','["created","start","after-loop","continued","cleanup"]','Finalization runs finally without resuming ordinary statements after the yield.','Assuming destruction drains the remaining generator body.'),o('last-reference','["created","start","after-loop","cleanup"]','Iteration starts the body; break leaves it suspended; releasing the last reference runs finally.')],key:'last-reference',explanation:'A generator starts lazily and can remain suspended after a consumer breaks. Releasing its final reference finalizes it and executes finally without executing the remaining ordinary body.',trace:'created is appended before iteration starts. The first iteration appends start and yields. break leaves the generator alive. after-loop is appended, and unset then triggers cleanup.',validation:{kind:'output',stdout:'["created","start","after-loop","cleanup"]'},references:['https://www.php.net/manual/en/language.generators.overview.php','https://www.php.net/manual/en/language.generators.syntax.php']}),
q({id:'PHP-E26-0025',format:'E',level:'A',topic:4,subtopic:'copied-array-shared-reference-element',objective:'Track a referenced element shared by value-copied arrays after an external alias is unset.',reason:'Combine array value copying, embedded reference containers and removal of only one reference binding.',prerequisites:['References','Array copy-on-write','unset'],lessons:[2,4,5],coverageComplete:true,stem:'What JSON is printed for the two arrays? Track the referenced first element separately from the ordinary second element.',files:[file(`$first = [1, 2];
$alias =& $first[0];
$second = $first;

$second[0] = 9;
$second[1] = 8;
unset($alias);
$second[0] = 7;

echo json_encode([$first, $second]);`)],options:[o('isolated','[[1,2],[7,8]]','The referenced first element remains shared across the copied arrays.','Assuming copying an array deep-copies its reference containers.'),o('shared-all','[[7,8],[7,8]]','The ordinary second element is not a reference and separates on modification.','Treating one referenced element as making the entire array an alias.'),o('detached-after-unset','[[9,2],[7,8]]','Unsetting alias removes only that binding; both arrays still share the reference container.','Assuming removing an external alias detaches the arrays from each other.'),o('element-reference','[[7,2],[7,8]]','Only the referenced first element propagates both writes across the copied arrays.')],key:'element-reference',explanation:'An array copy can retain references stored in its elements. Removing one variable that points at a reference does not break the bindings still held by both arrays.',trace:'The first elements share a reference container, so 9 and then 7 reach both arrays. The second element has value semantics, so writing 8 affects only second.',validation:{kind:'output',stdout:'[[7,2],[7,8]]'},references:['https://www.php.net/manual/en/language.references.whatdo.php','https://www.php.net/manual/en/language.references.unset.php']}),
q({id:'PHP-E26-0026',format:'D',level:'F',topic:3,subtopic:'strpos-zero-position-repair',objective:'Repair a presence check that rejects a match at byte offset zero.',reason:'Separate the false sentinel from a valid integer position.',prerequisites:['strpos','Strict comparison'],lessons:[1,3],coverageComplete:true,stem:'containsCat incorrectly rejects a match at the start. Which replacement for its return statement reports matches anywhere and rejects a missing substring?',files:[file(`function containsCat(string $text): bool
{
    $position = strpos($text, 'cat');

    return (bool) $position;
}

echo json_encode(array_map('containsCat', ['catnap', 'a cat', 'dog']));`)],options:[o('strict','return $position !== false;','This accepts integer zero and other positions while rejecting the failure sentinel.'),o('positive','return $position > 0;','A valid match at offset zero still fails this check.','Assuming successful positions must be strictly positive.'),o('nonnegative','return $position >= 0;','A false result compares as zero here, so a missing substring is accepted.','Applying a numeric range check to the false sentinel.'),o('loose','return $position != false;','Loose comparison still equates integer zero with false.','Assuming inequality automatically distinguishes the return types.')],key:'strict',explanation:'strpos returns an integer position or false. A strict comparison with false is needed to retain a position of zero.',trace:'The three return values are 0, 2 and false. Only the strict-sentinel predicate produces true, true and false.',validation:{kind:'patch',marker:'return (bool) $position;',stdout:'[true,true,false]'},references:['https://www.php.net/manual/en/function.strpos.php']}),
q({id:'PHP-E26-0027',format:'D',level:'F',topic:7,subtopic:'array-parameter-writeback',objective:'Repair an array-mutating function whose caller observes no change.',reason:'Choose the parameter binding needed for the stated in-place API.',prerequisites:['Array value semantics','Reference parameters'],lessons:[4,5],coverageComplete:true,stem:'appendItem must modify the caller’s array in place. Replace only the parameter declaration array $items; keep the body and call unchanged. Which declaration repairs the lost update?',files:[file(`function appendItem(array $items): void
{
    $items[] = 'next';
}

$items = ['seed'];
appendItem($items);

echo json_encode($items);`)],options:[o('optional','array $items = []','A default affects omitted arguments, not whether a supplied array is copied.','Treating a default parameter as shared caller storage.'),o('reference','array &$items','The reference parameter binds writes to the caller’s array.'),o('variadic','array ...$items','The variadic array collects arguments into a local array and does not write back.','Confusing variadic collection with reference passing.'),o('nullable','?array $items','Allowing null does not change the parameter’s value semantics.','Expecting a broader type declaration to change mutation propagation.')],key:'reference',explanation:'The existing parameter receives an array value. An ampersand on the parameter makes the documented in-place mutation reach the caller.',trace:'With array &$items, appending next changes the caller’s array to ["seed","next"]. The other declarations leave it as ["seed"].',validation:{kind:'patch',marker:'array $items',stdout:'["seed","next"]'},references:['https://www.php.net/manual/en/functions.arguments.php#functions.arguments.by-reference']}),
q({id:'PHP-E26-0028',format:'D',level:'F',topic:4,subtopic:'filter-only-null-values',objective:'Repair a default filter that discards valid falsy values.',reason:'Use one explicit predicate to distinguish null from other values.',prerequisites:['array_filter','Strict comparison','Arrow functions'],lessons:[1,4,9],coverageComplete:true,stem:'The current filter loses valid values. Replace the array_filter call so it removes only null and preserves all remaining keys, including entries whose values are 0, false or an empty string.',files:[file(`$values = [null, 0, false, '', 5];
$result = array_filter($values);

echo json_encode($result);`)],options:[o('strict-null','array_filter($values, fn ($value) => $value !== null)','The identity check removes only null and array_filter preserves the surviving keys.'),o('loose-null','array_filter($values, fn ($value) => $value != null)','Loose comparison also treats the required falsy values as equal to null.','Using loose comparison when distinct falsy values must survive.'),o('boolean','array_filter($values, fn ($value) => (bool) $value)','Explicitly converting to bool repeats the original filter’s unwanted behavior.','Assuming an explicit callback automatically fixes default truthiness filtering.'),o('strict-false','array_filter($values, fn ($value) => $value !== false)','This removes the false value and keeps null, reversing the requested sentinel.','Confusing false and null as the rejected value.')],key:'strict-null',explanation:'array_filter without a callback removes all falsy values. A strict null predicate expresses the narrower requirement.',trace:'Only key 0 is removed. Keys 1, 2, 3 and 4 keep 0, false, the empty string and 5 respectively.',validation:{kind:'patch',marker:'array_filter($values)',stdout:'{"1":0,"2":false,"3":"","4":5}'},references:['https://www.php.net/manual/en/function.array-filter.php']}),
q({id:'PHP-E26-0029',format:'D',level:'F',topic:7,subtopic:'formatting-return-versus-output',objective:'Repair a formatting helper that prints prematurely and returns a character count.',reason:'Distinguish the return and output contracts of related formatting functions.',prerequisites:['Function return values','Formatted strings'],lessons:[5],coverageComplete:true,stem:'greeting must return the formatted string without printing during the call. Replace only printf in the helper with one function name. Which change repairs both the output leak and the returned value?',files:[file(`function greeting(string $name): string
{
    return printf('Hi %s', $name);
}

echo json_encode(greeting('Ada'));`)],options:[o('vector','vprintf','vprintf expects an array of values and still prints its result.','Confusing the vector-argument formatter with a string-returning formatter.'),o('stream','fprintf','fprintf expects a stream resource as its first argument.','Treating a destination-oriented formatter as a return-value variant.'),o('string','sprintf','sprintf returns the formatted string without emitting it.'),o('vector-string','vsprintf','vsprintf returns a string but requires an argument array; name is a string here.','Choosing the string-returning family while overlooking its argument shape.')],key:'string',explanation:'printf emits text and returns a count. sprintf accepts the same formatting arguments but returns the produced string.',trace:'The repaired helper returns Hi Ada; only the outer json_encode/echo prints it. The vector and stream variants do not match this call’s arguments.',validation:{kind:'patch',marker:'printf',stdout:'"Hi Ada"',errors:{vector:'TypeError',stream:'TypeError','vector-string':'TypeError'}},references:['https://www.php.net/manual/en/function.printf.php','https://www.php.net/manual/en/function.sprintf.php']}),
q({id:'PHP-E26-0030',format:'D',level:'F',topic:4,subtopic:'in-place-sort-return-assignment',objective:'Repair replacement of an array by a sorting function’s success flag.',reason:'Separate an in-place operation from its return value.',prerequisites:['sort','Array mutation'],lessons:[4],coverageComplete:true,stem:'The sort currently replaces scores with a boolean. Which replacement for the assignment produces the required ascending numeric list?',files:[file(`$scores = [3, 1, 2];
$scores = sort($scores);

echo json_encode($scores);`)],options:[o('reverse-copy','$scores = array_reverse($scores);','Reversing this unsorted input produces [2,1,3], not ascending order.','Treating reversal as sorting.'),o('associative-sort','$scores = asort($scores);','asort also sorts in place and returns a boolean, so the assignment still loses the array.','Assuming the associative sorting variant returns a sorted array.'),o('in-place','sort($scores);','The sort mutates scores; leaving its boolean return unassigned preserves the sorted array.'),o('descending-return','$scores = rsort($scores);','rsort returns a boolean too and requests the wrong ordering direction.','Expecting a different sort variant to return the modified array.')],key:'in-place',explanation:'sort modifies its array argument. Its success flag is not a replacement array and must not overwrite the variable.',trace:'Calling sort without assigning its return leaves scores equal to [1,2,3].',validation:{kind:'patch',marker:'$scores = sort($scores);',stdout:'[1,2,3]'},references:['https://www.php.net/manual/en/function.sort.php']}),
q({id:'PHP-E26-0031',format:'D',level:'M',topic:5,subtopic:'assignment-comparison-parentheses',objective:'Repair a loop that assigns a comparison result instead of the fetched value.',reason:'Trace assignment precedence while preserving a valid zero-valued item.',prerequisites:['Operator precedence','Assignment expressions','while'],lessons:[2,3,4],coverageComplete:true,stem:'The loop currently collects booleans. Replace the complete parenthesized while condition so it collects every integer, including zero, and stops only when array_shift returns null.',files:[file(`$queue = [1, 0, 2];
$seen = [];

while ($item = array_shift($queue) !== null) {
    $seen[] = $item;
}

echo json_encode($seen);`)],options:[o('group-comparison','($item = (array_shift($queue) !== null))','This still assigns the comparison’s boolean result.','Adding parentheses around the comparison rather than the assignment.'),o('loose-stop','(($item = array_shift($queue)) != null)','Zero compares equal to null loosely, so the loop stops too soon.','Fixing assignment precedence while introducing a loose sentinel comparison.'),o('truthy-stop','($item = array_shift($queue))','The integer zero becomes false as a loop condition and terminates iteration.','Treating all valid queue values as truthy.'),o('group-assignment','(($item = array_shift($queue)) !== null)','The fetched value is assigned first and then compared strictly with the sentinel.')],key:'group-assignment',explanation:'The comparison binds more tightly than assignment in the original condition. Group the assignment, then compare its result with null using identity.',trace:'The repaired loop assigns and retains 1, 0 and 2; the subsequent empty shift returns null and stops it.',validation:{kind:'patch',marker:'($item = array_shift($queue) !== null)',stdout:'[1,0,2]'},references:['https://www.php.net/manual/en/language.operators.precedence.php','https://www.php.net/manual/en/function.array-shift.php']}),
q({id:'PHP-E26-0032',format:'D',level:'M',topic:8,subtopic:'three-way-numeric-comparator',objective:'Repair a deprecated boolean comparator without changing numeric sort order.',reason:'Distinguish numeric three-way ordering from boolean, lexical and reversed comparisons.',prerequisites:['usort','Comparator contracts','Spaceship operator'],lessons:[2,4,8],coverageComplete:true,stem:'The comparator produces a deprecation diagnostic. Replace its return statement so the integers sort numerically ascending with no diagnostics.',files:[file(`$values = [10, 2, 3];

usort($values, function (int $left, int $right) {
    return $left > $right;
});

echo json_encode($values);`)],options:[o('numeric','return $left <=> $right;','The spaceship operator returns negative, zero or positive according to numeric order.'),o('lexical','return strcmp((string) $left, (string) $right);','String comparison places "10" before "2", violating numeric order.','Treating lexical numeric-string order as numeric order.'),o('reversed','return $right <=> $left;','Reversing operands requests descending order.','Reversing the meaning of a negative comparator result.'),o('boolean','return $left >= $right;','This still returns bool and still violates the comparator contract.','Assuming adding equality makes a boolean comparator a three-way comparator.')],key:'numeric',explanation:'A comparator must express less than, equal to and greater than using a signed integer result. Numeric spaceship comparison supplies that contract.',trace:'The accepted comparator orders 2, 3, 10. strcmp orders the numeric strings lexically, and a boolean result remains deprecated.',validation:{kind:'patch',marker:'return $left > $right;',stdout:'[2,3,10]',errors:{boolean:{message:'Returning bool from comparison function is deprecated',exitCode:0}}},references:['https://www.php.net/manual/en/function.usort.php']}),
q({id:'PHP-E26-0033',format:'D',level:'M',topic:17,subtopic:'json-serialization-private-field-leak',objective:'Repair explicit serialization that leaks a private credential field.',reason:'Distinguish language visibility from a serializer’s deliberate access to private state.',prerequisites:['Private properties','JsonSerializable','Array field selection'],lessons:[23,25],coverageComplete:false,stem:'The API response leaks password even though that property is private. Replace jsonSerialize’s return statement so the output contains exactly id and no password key.',files:[file(`final class User implements JsonSerializable
{
    public function __construct(private int $id, private string $password)
    {
    }

    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }
}

echo json_encode(new User(7, 'demo-only'));`)],options:[o('cast','return (array) $this;','Casting includes private properties with mangled keys, rather than omitting the secret.','Assuming an array cast applies public-property visibility.'),o('redact-null',"return ['id' => $this->id, 'password' => null];",'The contract excludes the password key altogether, not merely its current value.','Equating null redaction with field omission.'),o('explicit-fields',"return ['id' => $this->id];",'The serializer deliberately selects only the public response field.'),o('mangled','return get_mangled_object_vars($this);','This explicitly returns non-public properties as well.','Mistaking mangled property names for exclusion of private state.')],key:'explicit-fields',explanation:'Visibility does not stop a method of the class from reading private properties and returning them. A response serializer should select the permitted fields explicitly.',trace:'get_object_vars called inside User sees both properties. The replacement returns only id, so the encoded object is {"id":7}.',validation:{kind:'patch',marker:'return get_object_vars($this);',stdout:'{"id":7}'},references:['https://www.php.net/manual/en/jsonserializable.jsonserialize.php','https://www.php.net/manual/en/function.get-object-vars.php']}),
q({id:'PHP-E26-0034',format:'D',level:'M',topic:20,subtopic:'exception-translation-cause-chain',objective:'Repair exception translation that loses its original cause.',reason:'Preserve both the public exception type and its previous throwable through nested catches.',prerequisites:['Exception constructors','Previous exceptions','Rethrowing'],lessons:[22],coverageComplete:true,stem:'The public boundary must throw DomainException while retaining the original RuntimeException as previous. Replace the throw statement in translate; which choice repairs the missing cause?',files:[file(`function translate(): void
{
    try {
        throw new RuntimeException('low-level failure');
    } catch (RuntimeException $error) {
        throw new DomainException('operation failed');
    }
}

try {
    translate();
} catch (Throwable $error) {
    echo json_encode([
        get_class($error),
        $error->getPrevious()?->getMessage(),
    ]);
}`)],options:[o('rethrow','throw $error;','Rethrowing preserves the original throwable but fails to expose the required DomainException type.','Treating preservation of the original object as equivalent to exception translation.'),o('message-only','throw new DomainException($error->getMessage());','Copying the message does not populate the previous throwable.','Assuming a copied message establishes a causal link.'),o('second-argument',"throw new DomainException('operation failed', $error);",'The second constructor argument is the integer code, not previous.','Using the code argument position for the cause.'),o('previous',"throw new DomainException('operation failed', 0, $error);",'The third argument records the original throwable while the outer type remains DomainException.')],key:'previous',explanation:'Exception’s constructor takes the message, integer code and previous throwable in that order. Translation and cause preservation are separate requirements.',trace:'The accepted replacement creates a DomainException whose previous message is low-level failure. The outer catch can inspect both.',validation:{kind:'patch',marker:"throw new DomainException('operation failed');",stdout:'["DomainException","low-level failure"]'},references:['https://www.php.net/manual/en/exception.construct.php']}),
q({id:'PHP-E26-0035',format:'D',level:'M',topic:15,subtopic:'deferred-pdo-bound-reference',objective:'Repair delayed executions that all observe a loop variable’s final value.',reason:'Track reference binding across prepared statements and a later execution phase.',prerequisites:['PDO binding (unmapped curriculum)','References','Loop variables'],extensions:['PDO','pdo_sqlite'],stem:'Both deferred inserts currently use the final id. Replace the binding statement so each prepared statement retains the id from its own loop iteration. Execution must remain deferred until the second loop.',files:[file(`$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE events (id INTEGER)');
$pending = [];

foreach ([1, 2] as $id) {
    $statement = $pdo->prepare('INSERT INTO events (id) VALUES (:id)');
    $statement->bindParam(':id', $id, PDO::PARAM_INT);
    $pending[] = $statement;
}

foreach ($pending as $statement) {
    $statement->execute();
}

echo json_encode($pdo->query('SELECT id FROM events ORDER BY rowid')->fetchAll(PDO::FETCH_COLUMN));`)],options:[o('value',"$statement->bindValue(':id', $id, PDO::PARAM_INT);",'bindValue captures the current integer rather than following the loop variable.'),o('string-reference',"$statement->bindParam(':id', $id, PDO::PARAM_STR);",'Changing the parameter type does not remove the reference binding.','Assuming string binding snapshots a referenced value.'),o('zero-position',"$statement->bindValue(0, $id, PDO::PARAM_INT);",'PDO positional parameter numbers begin at 1, not 0.','Using zero-based PHP array indexing for PDO parameter positions.'),o('null-type',"$statement->bindValue(':id', $id, PDO::PARAM_NULL);",'PARAM_NULL binds SQL NULL rather than the supplied integer.','Treating PARAM_NULL as a request to infer a parameter type.')],key:'value',explanation:'bindParam keeps a reference to a variable until execution. All statements therefore observe the reused id variable after the first loop. bindValue takes a snapshot instead.',trace:'The accepted bindings retain 1 and 2 separately. Later execution inserts those two integers in order.',validation:{kind:'patch',marker:"$statement->bindParam(':id', $id, PDO::PARAM_INT);",stdout:'[1,2]',errors:{'zero-position':'must be greater than or equal to 1'}},references:['https://www.php.net/manual/en/pdostatement.bindparam.php','https://www.php.net/manual/en/pdostatement.bindvalue.php']}),
q({id:'PHP-E26-0036',format:'D',level:'M',topic:19,subtopic:'import-function-symbol-kind',objective:'Repair a namespace import that targets the wrong symbol category.',reason:'Follow a function call across two namespaces and distinguish class, function and constant imports.',prerequisites:['Namespaces','Function imports','require'],lessons:[5,31],coverageComplete:true,stem:'Both files are present as shown. Calling slug currently fails. Which replacement for the use declaration makes the call print a-b without changing either function?',files:[file(`namespace Formatter;

function slug(string $text): string
{
    return strtolower(str_replace(' ', '-', $text));
}`, 'formatter.php'),file(`namespace App;

require __DIR__ . '/formatter.php';

use Formatter\\slug;

try {
    echo slug('A B');
} catch (\\Error $error) {
    echo 'Error';
}`)],options:[o('class-alias','use Formatter\\slug as slug;','This still imports a class-like name rather than a function.','Assuming an alias changes the imported symbol category.'),o('function','use function Formatter\\slug;','The function import binds the unqualified call slug to Formatter\\slug.'),o('constant','use const Formatter\\slug;','A constant import cannot resolve a function call.','Treating all namespace symbols as one import category.'),o('different-alias','use function Formatter\\slug as makeSlug;','This imports the function under makeSlug, while the unchanged call uses slug.','Ignoring the local name introduced by an alias.')],key:'function',explanation:'Plain use imports class-like names. Functions require use function, and the local imported name must match the call.',trace:'The required file defines Formatter\\slug. The accepted declaration resolves App’s unqualified slug call to that function.',validation:{kind:'patch',marker:'use Formatter\\slug;',stdout:'a-b'},references:['https://www.php.net/manual/en/language.namespaces.importing.php'] }),
q({id:'PHP-E26-0037',format:'D',level:'M',topic:10,subtopic:'invalid-utf8-json-substitution',objective:'Repair JSON encoding with an explicit invalid UTF-8 replacement policy.',reason:'Distinguish substitution, omission, partial output and encoding presentation flags.',prerequisites:['JSON encoding flags','UTF-8','JsonException'],stem:'The payload contains the byte FF, which is invalid by itself in UTF-8. Replace JSON_THROW_ON_ERROR in the encode call so valid bytes are retained and the invalid byte becomes U+FFFD. Other encoding failures must still throw. Which flag expression meets that policy?',files:[file(`$payload = ['text' => "A\\xFFB"];

try {
    echo json_encode($payload, JSON_THROW_ON_ERROR);
} catch (JsonException $error) {
    echo 'error';
}`)],options:[o('ignore','JSON_THROW_ON_ERROR | JSON_INVALID_UTF8_IGNORE','IGNORE drops the invalid byte, producing AB rather than a replacement character.','Equating omission with substitution.'),o('partial','JSON_THROW_ON_ERROR | JSON_PARTIAL_OUTPUT_ON_ERROR','Partial output substitutes null for the invalid string and takes precedence over throwing.','Assuming partial output repairs individual bytes.'),o('unescaped','JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE','UNESCAPED_UNICODE changes representation of valid Unicode; it does not repair invalid UTF-8.','Treating escaping policy as input validation.'),o('substitute','JSON_THROW_ON_ERROR | JSON_INVALID_UTF8_SUBSTITUTE','SUBSTITUTE replaces invalid UTF-8 with U+FFFD while THROW remains for other failures.')],key:'substitute',explanation:'JSON_INVALID_UTF8_SUBSTITUTE is the encoding policy that retains valid text and substitutes the Unicode replacement character for malformed sequences.',trace:'A and B remain. FF becomes U+FFFD, represented by the default JSON escape \\ufffd.',validation:{kind:'patch',marker:'JSON_THROW_ON_ERROR',stdout:'{"text":"A\\ufffdB"}'},references:['https://www.php.net/manual/en/json.constants.php'] }),
q({id:'PHP-E26-0038',format:'D',level:'M',topic:18,subtopic:'late-static-table-selection',objective:'Repair an inherited factory’s lookup of an overridden class constant.',reason:'Compare lexical scope, parent scope and late static binding across two calls.',prerequisites:['Inheritance','Class constants','Late static binding'],lessons:[2,26,30],coverageComplete:true,stem:'table must return each called class’s TABLE constant. Replace only self::TABLE so the two calls print ["base","users"]. Which expression repairs the inherited method?',files:[file(`class RootModel
{
    public const TABLE = 'root';
}

class Model extends RootModel
{
    public const TABLE = 'base';

    public static function table(): string
    {
        return self::TABLE;
    }
}

class Users extends Model
{
    public const TABLE = 'users';
}

echo json_encode([Model::table(), Users::table()]);`)],options:[o('parent','parent::TABLE','parent refers to RootModel from this method’s declaring scope, so both results are root.','Treating parent as the parent of the dynamically called class.'),o('class-name','get_called_class()','This returns class names Model and Users, not their TABLE values.','Confusing the called class name with a class constant lookup.'),o('late','static::TABLE','static selects the constant using the called class, retaining late static binding.'),o('explicit','Model::TABLE','Naming Model explicitly fixes both lookups to base.','Assuming inherited calls rewrite an explicit class name.')],key:'late',explanation:'self binds to the method’s declaring class. static retains the class through which the method was called and sees an override in Users.',trace:'Model::table resolves Model::TABLE. Users::table resolves Users::TABLE with the accepted expression.',validation:{kind:'patch',marker:'self::TABLE',stdout:'["base","users"]'},references:['https://www.php.net/manual/en/language.oop5.late-static-bindings.php'] }),
q({id:'PHP-E26-0039',format:'D',level:'M',topic:7,subtopic:'unpack-positional-after-named',objective:'Repair mixed-key argument unpacking without reversing parameter values.',reason:'Track array insertion order, named binding and positional argument restrictions.',prerequisites:['Named arguments','Argument unpacking','Array order'],lessons:[4,5],coverageComplete:true,stem:'The unpacked array puts a positional argument after a named one, so the call fails. Replace the complete joinParts(...$arguments) expression so a receives A and b receives B. Which repair prints AB?',files:[file(`function joinParts(string $a, string $b): string
{
    return $a . $b;
}

$arguments = ['b' => 'B', 0 => 'A'];

try {
    echo joinParts(...$arguments);
} catch (Error $error) {
    echo 'Error';
}`)],options:[o('values','joinParts(...array_values($arguments))','array_values preserves insertion order, so the arguments become B then A.','Assuming dropping keys sorts positional arguments.'),o('ordered',"joinParts(...[$arguments[0], 'b' => $arguments['b']])",'The positional A precedes named b, binding both parameters correctly.'),o('named-first',"joinParts(...['b' => $arguments['b'], $arguments[0]])",'This still places a positional argument after a named argument.','Assuming rebuilding the array changes the ordering rule.'),o('duplicate',"joinParts(...array_values($arguments), b: $arguments['b'])",'The unpacked values already fill b, so the named argument tries to overwrite it.','Assuming named arguments override parameters filled positionally.')],key:'ordered',explanation:'Integer-keyed unpacked values bind positionally, string-keyed values by name. Positional values must precede named values, and a parameter cannot be supplied twice.',trace:'The accepted array is [0 => A, b => B]. The first value fills a and the named value fills b.',validation:{kind:'patch',marker:'joinParts(...$arguments)',stdout:'AB'},references:['https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments'] }),
q({id:'PHP-E26-0040',format:'D',level:'M',topic:17,subtopic:'uninitialized-typed-property-guard',objective:'Repair a property reader while preserving initialized zero.',reason:'Separate declared existence, initialization and truthiness of a typed property.',prerequisites:['Typed properties','isset','empty'],lessons:[23,24],coverageComplete:true,stem:'readId must return null for an uninitialized id and preserve zero when it is initialized. Replace the if condition’s property_exists call. Which predicate prevents the Error and satisfies both cases?',files:[file(`class Item
{
    public int $id;
}

function readId(Item $item): ?int
{
    if (property_exists($item, 'id')) {
        return $item->id;
    }

    return null;
}

$empty = new Item();
$zero = new Item();
$zero->id = 0;

try {
    echo json_encode([readId($empty), readId($zero)]);
} catch (Error $error) {
    echo 'Error';
}`)],options:[o('nonempty','!empty($item->id)','empty treats initialized zero as empty, losing a valid id.','Using truthiness to test initialization.'),o('class-declaration',"property_exists(get_class($item), 'id')",'This still checks declaration, which is true even when the property is uninitialized.','Expecting a class-level existence check to inspect instance initialization.'),o('object-set','isset($item)','The parameter itself is a present object in both cases; its property may still be uninitialized.','Guarding the container instead of its typed property.'),o('property-set','isset($item->id)','isset safely returns false for the uninitialized property and true for initialized zero.')],key:'property-set',explanation:'A declared typed property can exist without having a value. isset can guard that read without rejecting an initialized integer zero.',trace:'The first object fails isset and returns null. The second passes it and returns 0.',validation:{kind:'patch',marker:"property_exists($item, 'id')",stdout:'[null,0]'},references:['https://www.php.net/manual/en/language.oop5.properties.php','https://www.php.net/manual/en/function.isset.php'] }),
q({id:'PHP-E26-0041',revision:2,format:'D',level:"M",topic:22,subtopic:'delegated-generator-return-lifecycle',objective:'Repair premature retrieval of a delegated generator’s return value.',reason:"Trace a started generator through exhaustion before reading its return; no concurrent lifetime or recursive generator reasoning is required.",prerequisites:['Generators','yield from','Generator::getReturn'],stem:'The driver wants the outer generator’s final return value, 10, after discarding its yielded values. Replace $generator->next(); so the subsequent getReturn is valid. Which driver change works for the shown generator?',files:[file(`function inner(): Generator
{
    yield 1;
    yield 2;

    return 9;
}

function outer(): Generator
{
    $result = yield from inner();

    return $result + 1;
}

$generator = outer();
$generator->current();
$generator->next();

echo $generator->getReturn();`)],options:[o('single-if',`if ($generator->valid()) {
    $generator->next();
}`,'One advance reaches the second yield but does not finish the generator.','Assuming one next call exhausts a delegated generator.'),o('drain',`while ($generator->valid()) {
    $generator->next();
}`,'Advancing while valid reaches completion, allowing outer to return 10.'),o('inverted',`while (!$generator->valid()) {
    $generator->next();
}`,'The generator is already valid at its first yield, so the loop never advances.','Reversing the active-state condition.'),o('container',`foreach ([$generator] as $iterator) {
    $iterator->next();
}`,'This iterates a one-element array, not the yielded values, so it advances only once.','Confusing iteration over a generator object’s container with iteration over the generator.')],key:'drain',explanation:'getReturn is available only after completion. yield from forwards both inner yields and evaluates to inner’s final return value; outer then adds one.',trace:'current starts the first yield. The accepted loop advances to the second yield, then through inner’s return 9 and outer’s return 10.',validation:{kind:'patch',marker:'$generator->next();',stdout:'10',errors:{'single-if':'Cannot get return value',inverted:'Cannot get return value',container:'Cannot get return value'}},references:['https://www.php.net/manual/en/generator.getreturn.php','https://www.php.net/manual/en/language.generators.syntax.php'] }),
q({id:'PHP-E26-0042',format:'D',level:'A',topic:22,subtopic:'fiber-resumption-driver-state',objective:'Repair a Fiber driver that must feed each suspension’s requested value back into the computation.',reason:'Coordinate suspension results, resume arguments and termination across two rounds.',prerequisites:['Fibers (advanced)','Cooperative suspension','Loop state'],stem:'Each suspend requests an integer; the driver must resume with twice that integer. Replace the loop so the final return is 14. start has already received the first request. Which driver correctly handles both suspensions?',files:[file(`$fiber = new Fiber(function (): int {
    $first = Fiber::suspend(3);
    $second = Fiber::suspend(4);

    return $first + $second;
});

$request = $fiber->start();

while (!$fiber->isTerminated()) {
    $fiber->resume($request * 2);
}

echo $fiber->getReturn();`)],options:[o('update',`while (!$fiber->isTerminated()) {
    $request = $fiber->resume($request * 2);
}`,'Each resume result supplies the next request, and termination stops before another resume.'),o('constant',`while (!$fiber->isTerminated()) {
    $request = $fiber->resume(6);
}`,'Both resumes send 6, so the return is 12 rather than 14.','Reusing the first response instead of calculating from each request.'),o('stale',`while (!$fiber->isTerminated()) {
    $fiber->resume($request * 2);
}`,'request remains 3, so both resumes again send 6.','Assuming resume updates the caller’s request variable implicitly.'),o('single',`if ($fiber->isSuspended()) {
    $request = $fiber->resume($request * 2);
}`,'One resume reaches the second suspension, leaving getReturn invalid.','Treating a Fiber as having at most one suspension.')],key:'update',explanation:'start and resume return the next suspension value. The driver must store each new request and check for termination before resuming again.',trace:'start returns 3; resume(6) returns 4; resume(8) completes the Fiber; getReturn yields 6 + 8.',validation:{kind:'patch',marker:'while (!$fiber->isTerminated()) {\n    $fiber->resume($request * 2);\n}',stdout:'14',errors:{single:'Cannot get fiber return value'}},references:['https://www.php.net/manual/en/fiber.resume.php','https://www.php.net/manual/en/fiber.getreturn.php'] }),
q({id:'PHP-E26-0043',revision:2,format:'D',level:'A',topic:21,subtopic:'attribute-subtype-instantiation-validation',objective:'Repair an attribute scanner that must validate derived rule constructors without instantiating unrelated attributes.',reason:'Combine subtype filtering, lazy attribute construction and side-effect isolation.',prerequisites:['Attributes (advanced)','ReflectionAttribute','Inheritance'],stem:'scan must instantiate every Rule attribute, including subclasses, and no unrelated attribute. A negative rule must throw InvalidArgumentException; Audit must remain unconstructed. Replace the foreach block. Which scanner yields ["ok","invalid",0]?',files:[file(`#[Attribute(Attribute::TARGET_CLASS)]
class Rule
{
    public function __construct(public int $limit)
    {
        if ($limit < 0) {
            throw new InvalidArgumentException('negative');
        }
    }
}

#[Attribute(Attribute::TARGET_CLASS)]
class PositiveRule extends Rule
{
}

#[Attribute(Attribute::TARGET_CLASS)]
class Audit
{
    public static int $created = 0;

    public function __construct()
    {
        self::$created++;
    }
}

#[PositiveRule(1), Audit]
class Good
{
}

#[PositiveRule(-1), Audit]
class Bad
{
}

function scan(string $class): string
{
    $reflection = new ReflectionClass($class);

    try {
        foreach ($reflection->getAttributes(Rule::class) as $attribute) {
            $attribute->getArguments();
        }

        return 'ok';
    } catch (InvalidArgumentException $error) {
        return 'invalid';
    }
}

echo json_encode([scan(Good::class), scan(Bad::class), Audit::$created]);`)],options:[o('exact',`foreach ($reflection->getAttributes(Rule::class) as $attribute) {
    $attribute->newInstance();
}`,'Exact-name filtering misses PositiveRule, so neither constructor validates its limit.','Assuming getAttributes includes subclasses without its subtype flag.'),o('arguments',`foreach ($reflection->getAttributes(Rule::class, ReflectionAttribute::IS_INSTANCEOF) as $attribute) {
    $attribute->getArguments();
}`,'Reading argument values does not run the attribute constructor, so the negative limit is not rejected.','Treating metadata retrieval as object construction.'),o('all',`foreach ($reflection->getAttributes() as $attribute) {
    $attribute->newInstance();
}`,'This validates the rules but also instantiates Audit on Good, incrementing created.','Assuming all class attributes share the scanner’s intended contract.'),o('filtered-instance',`foreach ($reflection->getAttributes(Rule::class, ReflectionAttribute::IS_INSTANCEOF) as $attribute) {
    $attribute->newInstance();
}`,'The subtype filter selects PositiveRule and newInstance invokes the validation constructor.')],key:'filtered-instance',explanation:'getAttributes can select a class and its descendants with IS_INSTANCEOF. Reflection metadata is lazy; newInstance, not getArguments, invokes the constructor.',trace:'Good constructs a valid PositiveRule. Bad throws on -1. Neither scan selects Audit, so its counter remains zero.',validation:{kind:'patch',marker:'foreach ($reflection->getAttributes(Rule::class) as $attribute) {\n            $attribute->getArguments();\n        }',stdout:'["ok","invalid",0]'},references:['https://www.php.net/manual/en/reflectionclass.getattributes.php','https://www.php.net/manual/en/reflectionattribute.newinstance.php'] }),
q({id:'PHP-E26-0044',format:'D',level:'A',topic:17,subtopic:'virtual-hook-reference-writeback',objective:'Repair a reference-based operation on a virtual hooked property without losing the updated value.',reason:'Distinguish reference access from get/set transformations and explicit write-back.',prerequisites:['PHP 8.4 property hooks (advanced)','References','Floating-point arithmetic'],stem:'celsius is a virtual property computed from fahrenheit; it provides no reference-returning get hook. addOne must remain unchanged. Replace the failing addOne call so the object’s temperature increases by one Celsius degree.',files:[file(`class Temperature
{
    private float $fahrenheit = 32.0;

    public float $celsius {
        get => ($this->fahrenheit - 32) / 1.8;
        set => $this->fahrenheit = $value * 1.8 + 32;
    }
}

function addOne(float &$value): void
{
    $value += 1;
}

$temperature = new Temperature();
addOne($temperature->celsius);

echo round($temperature->celsius, 6);`)],options:[o('local-only',`$value = $temperature->celsius;
addOne($value);`,'The local value changes, but no set hook writes it back to the object.','Assuming a normal assignment retains a live property link.'),o('early-write',`$value = $temperature->celsius;
$temperature->celsius = $value;
addOne($value);`,'The write occurs before the local increment, so the object retains zero.','Writing back the snapshot before applying the mutation.'),o('writeback',`$value = $temperature->celsius;
addOne($value);
$temperature->celsius = $value;`,'The get hook supplies a value, the local variable supports reference mutation, and the set hook stores the result.'),o('reference',`$value =& $temperature->celsius;
addOne($value);`,'A virtual property without a reference-returning getter cannot be aliased this way.','Assuming an intermediate reference bypasses property reference restrictions.')],key:'writeback',explanation:'The property transforms stored Fahrenheit into Celsius and back. A by-reference function needs a variable it can mutate, so use a local value and then invoke the property setter with the result.',trace:'The getter returns 0. addOne changes the local to 1. Writing 1 invokes the setter and stores 33.8 Fahrenheit, which the getter converts back to 1.',validation:{kind:'patch',marker:'addOne($temperature->celsius);',stdout:'1',errors:{reference:'Indirect modification of Temperature::$celsius is not allowed'}},references:['https://www.php.net/manual/en/language.oop5.property-hooks.php'] }),
q({id:'PHP-E26-0045',format:'D',level:'A',topic:18,subtopic:'intersection-parameter-covariant-return',objective:'Repair interface compatibility using contravariant parameters and covariant return types.',reason:'Compare an intersection parameter with broader accepted input types and narrower output guarantees.',prerequisites:['Intersection types (advanced)','Variance','Traversable and Iterator'],stem:'The implementation’s narrow parameter makes this declaration fail. Replace only the public copy signature, retaining its body. Which signature satisfies Copier and successfully copies the shown source?',files:[file(`interface Copier
{
    public function copy(Iterator&Countable $source): Iterator;
}

class Snapshot implements Copier
{
    public function copy(ArrayIterator $source): Iterator
    {
        return new ArrayIterator(iterator_to_array($source));
    }
}

$copy = (new Snapshot())->copy(new ArrayIterator([1, 2]));

echo json_encode(iterator_to_array($copy));`)],options:[o('broad-input','public function copy(Traversable $source): ArrayIterator','Traversable accepts every Iterator&Countable, while ArrayIterator is a narrower Iterator return type.'),o('extra-constraint','public function copy(Iterator&Countable&ArrayAccess $source): ArrayIterator','Adding ArrayAccess excludes some values allowed by the interface.','Treating an added input requirement as harmless precision.'),o('broad-output','public function copy(Traversable $source): Traversable','Traversable is a broader output promise than Iterator and could allow a non-Iterator result.','Applying input contravariance rules to return types.'),o('narrow-input','public function copy(ArrayIterator $source): ArrayIterator','ArrayIterator is only one possible Iterator&Countable implementation, so the parameter remains too narrow.','Assuming the specific example argument defines the interface’s entire input domain.')],key:'broad-input',explanation:'An implementation may accept more inputs and promise more specific outputs. It may not require extra input capabilities or weaken the declared output guarantee.',trace:'Traversable broadens the accepted domain. ArrayIterator implements Iterator, so the return type strengthens the promise and the body returns a compatible value.',validation:{kind:'patch',marker:'public function copy(ArrayIterator $source): Iterator',stdout:'[1,2]',errors:{'extra-constraint':'must be compatible','broad-output':'must be compatible','narrow-input':'must be compatible'}},references:['https://www.php.net/manual/en/language.oop5.variance.php'] }),
q({id:'PHP-E26-0046',format:'R',level:'F',topic:5,subtopic:'coalescing-versus-truthy-default',objective:'Review whether replacing null coalescing with a truthiness default preserves valid configuration values.',reason:'Compare two defaulting operators for an explicit zero value.',prerequisites:['Null coalescing','Ternary expressions'],lessons:[2],coverageComplete:true,stem:'Zero is a valid retry limit. A reviewer proposes replacing the first assignment with the second. Which assessment is correct for this input?',files:[file(`$config = ['retries' => 0];

$before = $config['retries'] ?? 5;
$after = $config['retries'] ?: 5;

echo json_encode([$before, $after]);`)],options:[o('equivalent','Both preserve zero because the retries key exists.','The shorthand ternary tests truthiness, not key existence.','Confusing a truthiness check with an existence check.'),o('reverse','The first uses 5; the second preserves zero.','This reverses the two operators’ conditions.','Attributing truthiness fallback to null coalescing.'),o('changed','The first preserves zero; the second substitutes 5.','Zero is non-null but falsy, so the two operators produce different results.'),o('both-default','Both substitute 5 because zero is an empty value.','Null coalescing does not reject zero.','Applying empty-style rules to both defaulting operators.')],key:'changed',explanation:'Null coalescing falls back for absent or null values. The shorthand ternary falls back for any falsy value, including integer zero.',trace:'before is 0; after is 5. The refactor violates the stated configuration contract.',validation:{kind:'contract',stdout:'[0,5]',keyEvidence:'Observed distinct values match the stated zero-valid contract.',counterexamples:{equivalent:'after is 5',reverse:'before is 0','both-default':'before is 0'}},references:['https://www.php.net/manual/en/language.operators.comparison.php'] }),
q({id:'PHP-E26-0047',revision:2,format:'R',level:'F',topic:9,subtopic:'include-inherits-local-scope',objective:'Review the variable scope of an included configuration file inside a function.',reason:'Apply include scope rules to a local assignment and a separate global variable.',prerequisites:['Function scope','include'],lessons:[6],coverageComplete:false,stem:'A review claims that config.php overwrites the global mode even though it is included inside loadMode. Which assessment matches this two-file program?',files:[file(`$mode = 'local';`, 'config.php'),file(`$mode = 'global';

function loadMode(): string
{
    include __DIR__ . '/config.php';

    return $mode;
}

echo loadMode(), '|', $mode;`)],options:[o('local','The include sets loadMode’s local variable; the global value stays global.','Included code inherits the scope of the include statement, here the function scope.'),o('global','The include runs in global scope and changes both observed values to local.','A filesystem include does not automatically switch to global scope.','Assuming file boundaries determine variable scope.'),o('isolated','The included assignment is isolated, so loadMode cannot read mode.','Included code shares the including scope rather than a separate file-local namespace.','Assuming each PHP file has its own variable scope.'),o('include-result','The include causes a TypeError because config.php returns 1 inside a function declared to return string.','The return type checks return $mode, not the discarded result of the include statement.','Confusing the result of an include expression with the return value of the containing function.')],key:'local',explanation:'The include statement evaluates the file in its surrounding scope. The assignment becomes local to loadMode, with no global declaration connecting it to the top-level variable.',trace:'loadMode returns local. The later top-level read still returns global.',validation:{kind:'contract',stdout:'local|global',keyEvidence:'The two output components expose both scopes.',counterexamples:{global:'Global output remains global',isolated:'The local read succeeds',namespace:'The bare include result is discarded; loadMode returns the local string without a TypeError'}},references:['https://www.php.net/manual/en/function.include.php'] }),
q({id:'PHP-E26-0048',format:'R',level:'M',topic:4,subtopic:'map-difference-key-value-contract',objective:'Review a map-difference implementation that must compare key/value associations.',reason:'Distinguish value-set differences from differences between mappings.',prerequisites:['Associative arrays','array_diff','array_diff_assoc'],lessons:[4],coverageComplete:true,stem:'changed should list entries whose key/value pair differs from before. A value moving to a different key counts as a change. Replace the array_diff call while preserving keys. Which review change meets that requirement?',files:[file(`$before = ['read' => 'yes', 'write' => 'no'];
$after = ['read' => 'no', 'write' => 'yes'];

$changed = array_diff($after, $before);

echo json_encode($changed);`)],options:[o('keys','array_diff_key($after, $before)','Both keys already exist, so this reports no changes.','Comparing only key membership while ignoring associated values.'),o('reverse','array_diff($before, $after)','Reversing value-only difference still finds both values present.','Assuming direction fixes a comparison that ignores keys.'),o('intersect','array_intersect_assoc($after, $before)','This selects unchanged pairs, the opposite of the requested result.','Confusing equality filtering with change detection.'),o('associations','array_diff_assoc($after, $before)','This compares each value at its corresponding key and preserves changed entries.')],key:'associations',explanation:'array_diff compares values without requiring the same key. array_diff_assoc also compares keys, which is necessary when the association carries meaning.',trace:'Both string values exist in both arrays, but neither remains at its original key. The accepted result includes both after entries.',validation:{kind:'patch',marker:'array_diff($after, $before)',stdout:'{"read":"no","write":"yes"}'},references:['https://www.php.net/manual/en/function.array-diff-assoc.php'] }),
q({id:'PHP-E26-0049',format:'R',level:'M',topic:17,subtopic:'mutable-date-window-alias',objective:'Review a fluent date calculation that unintentionally changes a retained start time.',reason:'Track mutation and object identity through a fluent method return.',prerequisites:['DateTime','Object identity','clone'],lessons:[23],coverageComplete:false,stem:'The returned window must retain start at 2026-01-01 and end at 2026-01-02. The constructor type must remain DateTime. Which replacement for the end assignment fixes the review finding?',files:[file(`$start = new DateTime('2026-01-01', new DateTimeZone('UTC'));
$end = $start->modify('+1 day');

echo json_encode([$start->format('Y-m-d'), $end->format('Y-m-d')]);`)],options:[o('clone-before',"$end = (clone $start)->modify('+1 day');",'Cloning before the mutating call gives end its own DateTime object.'),o('clone-after',"$end = clone $start->modify('+1 day');",'The original is already modified before its returned object is cloned.','Assuming a later clone reverses an earlier mutation.'),o('assign-first',"$end = $start;\n$end->modify('+1 day');",'The assignment shares the same object, so modifying end also changes start.','Treating object assignment as cloning.'),o('new-interval',"$end = $start->add(new DateInterval('P1D'));",'DateTime::add also mutates the original object.','Assuming a different fluent date method is immutable.')],key:'clone-before',explanation:'DateTime::modify mutates its receiver and returns that object. Create the independent object before applying the mutation.',trace:'The original keeps January 1. The clone advances to January 2 and is assigned to end.',validation:{kind:'patch',marker:"$end = $start->modify('+1 day');",stdout:'["2026-01-01","2026-01-02"]'},references:['https://www.php.net/manual/en/datetime.modify.php','https://www.php.net/manual/en/language.oop5.cloning.php'] }),
q({id:'PHP-E26-0050',revision:2,format:'R',level:'M',topic:20,subtopic:'exception-sentinel-domain-collision',objective:'Review a failure sentinel that collides with a successful domain result.',reason:'Distinguish a valid negative answer from infrastructure failure across an API boundary.',prerequisites:['Exceptions','Boolean returns','API contracts'],lessons:[5,22],coverageComplete:true,stem:"lookup returns true for an active account, false for an inactive account, and throws RuntimeException when storage is unavailable. Callers must distinguish all three outcomes. Which change repairs safeLookup without treating storage failure as an account status?",files:[file(`function lookup(string $id): bool
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

echo json_encode([safeLookup('active'), safeLookup('inactive'), safeLookup('offline')]);`)],options:[o("log-and-false","Log the storage exception in catch, then keep returning false.","Logging can aid diagnosis but leaves callers unable to distinguish an inactive account from failed storage.","Treating a diagnostic side effect as a distinct return-channel outcome."),o("propagate","Let the storage exception propagate while returning the account booleans normally.","A successful lookup returns an account status; storage failure remains on the exception channel."),o("true-on-error","Return true from catch so false remains reserved for inactive accounts.","This makes storage failure indistinguishable from a successful active-account result.","Moving the failure collision to the other successful boolean value."),o("retry-and-false","Retry lookup once; return false if the retry also throws.","A persistent outage still becomes an inactive-account result after the retry.","Assuming a retry removes the need for an unambiguous final failure channel.")],key:'propagate',explanation:'The catch converts an infrastructure failure into the same value used for a successful domain answer. Keeping the exception preserves the distinction without changing the meaning of false.',trace:"The calls return true, false and false. The last false hides a storage exception. Removing the catch preserves the first two booleans and propagates the original failure for the third call.",validation:{"kind": "contract", "stdout": "[true,false,false]", "keyEvidence": "The active/inactive results differ, but the failed lookup collides with inactive. Propagating the exception keeps three distinguishable outcomes.", "counterexamples": {"log-and-false": "A logged failure still returns false like an inactive account.", "true-on-error": "Returning true on error collides with the active-account result.", "retry-and-false": "Repeated storage failure is still converted to false."}, "contrasts": [{"name": "propagate", "marker": "    try {\n        return lookup($id);\n    } catch (RuntimeException $error) {\n        return false;\n    }", "replacement": "    return lookup($id);", "stdout": "", "error": "storage unavailable"}]},references:['https://www.php.net/manual/en/language.exceptions.php'] }),
q({id:'PHP-E26-0051',format:'R',level:'M',topic:16,subtopic:'pdo-nested-transaction-ownership',objective:'Review transaction ownership when a helper is invoked inside an existing PDO transaction.',reason:'Separate a helper’s reusable work from ownership of the outer atomic unit.',prerequisites:['PDO transactions','Exception flow'],extensions:['PDO','pdo_sqlite'],stem:'The caller must commit its two inserts together. insertSecond is also used by callers that manage their own transaction; its contract is to perform work inside the caller’s transaction. Which review change satisfies that contract?',files:[file(`function insertSecond(PDO $pdo): void
{
    $pdo->beginTransaction();
    $pdo->exec('INSERT INTO events VALUES (2)');
    $pdo->commit();
}

$pdo = new PDO('sqlite::memory:');
$pdo->exec('CREATE TABLE events (id INTEGER)');
$pdo->beginTransaction();
$pdo->exec('INSERT INTO events VALUES (1)');

try {
    insertSecond($pdo);
    $pdo->commit();
} catch (PDOException $error) {
    $pdo->rollBack();
    echo 'rolled back';
}`)],options:[o('commit-first','Commit in the caller immediately before invoking insertSecond.','This makes the first insert durable separately, violating the required joint atomic unit.','Solving nesting by splitting the transaction boundary.'),o('nested-native','Keep both calls: PDO automatically maps nested beginTransaction calls to savepoints.','PDO::beginTransaction throws when a transaction is already active.','Assuming PDO provides automatic nested transactions.'),o('helper-work','Remove beginTransaction and commit from insertSecond; let its caller own the transaction.','The helper’s stated contract is to participate in the existing unit without committing it.'),o('conditional-commit','Skip the helper’s beginTransaction when inTransaction is true, but always call its commit.','The helper would commit its caller’s transaction before the caller finishes its unit.','Checking transaction existence without preserving ownership.')],key:'helper-work',explanation:'A transaction boundary must have an owner. This helper promises to join the caller’s unit, so it should not start or finish that unit itself.',trace:'The nested begin currently throws. The outer catch rolls back the first insert. Removing both helper boundary calls allows the caller to commit both writes together.',validation:{kind:'contract',stdout:'rolled back',keyEvidence:'The nested begin produces the observed rollback; caller ownership satisfies the stated atomicity requirement.',counterexamples:{'commit-first':'The first write can persist without the second','nested-native':'PDO throws on nested begin','conditional-commit':'The helper prematurely commits the outer transaction'}},references:['https://www.php.net/manual/en/pdo.begintransaction.php'] }),
q({id:'PHP-E26-0052',format:'R',level:'M',topic:23,subtopic:'preg-match-zero-is-not-failure',objective:'Review error handling that confuses a valid non-match with a regex engine failure.',reason:'Distinguish the three result states of preg_match and their exception policy.',prerequisites:['preg_match','Strict comparisons','Exceptions'],stem:'A valid pattern that does not match should return false from accepts. Only regex engine failure should throw. Which replacement for !$result preserves this policy?',files:[file(`function accepts(string $text): bool
{
    $result = preg_match('/^[A-Z]+$/', $text);

    if (!$result) {
        throw new RuntimeException('regex failed');
    }

    return $result === 1;
}

try {
    echo json_encode([accepts('ABC'), accepts('123')]);
} catch (RuntimeException $error) {
    echo 'error';
}`)],options:[o('zero','$result === 0','Zero is a valid non-match, so this still throws on ordinary rejected input.','Treating the non-match sentinel as engine failure.'),o('loose-false','$result == false','Both zero and false compare equal to false loosely.','Using loose equality for a three-state API.'),o('not-one','$result !== 1','This combines non-match and engine failure into the same branch.','Assuming every unsuccessful match indicates an engine problem.'),o('strict-false','$result === false','Only the boolean false signals an engine failure; integer zero remains a normal non-match.')],key:'strict-false',explanation:'preg_match returns 1 for a match, 0 for no match and false on failure. Strict comparison is necessary to keep those states separate.',trace:'ABC produces 1 and true. 123 produces 0 and false without an exception.',validation:{kind:'patch',marker:'!$result',stdout:'[true,false]'},references:['https://www.php.net/manual/en/function.preg-match.php'] }),
q({id:'PHP-E26-0053',format:'R',level:'M',topic:4,subtopic:'reduce-empty-identity-value',objective:'Review a reduction’s identity value for empty input and typed callbacks.',reason:'Trace the initial accumulator and the no-callback case of an empty reduction.',prerequisites:['array_reduce','Array callbacks','Typed parameters'],lessons:[4,8],coverageComplete:true,stem:'flatten must return an array for every list of arrays, including an empty list. Which replacement for the return call preserves that contract and supports the typed accumulator?',files:[file(`function flatten(array $groups): array
{
    $append = function (array $all, array $group): array {
        return array_merge($all, $group);
    };

    return array_reduce($groups, $append);
}

try {
    echo json_encode([flatten([]), flatten([[1], [2]])]);
} catch (TypeError $error) {
    echo 'TypeError';
}`)],options:[o('identity','array_reduce($groups, $append, [])','An empty array is the merge identity and the correctly typed initial accumulator.'),o('cast-result','(array) array_reduce($groups, $append)','Casting the result helps empty input but cannot prevent the callback from first receiving null on nonempty input.','Repairing only the reduction’s final value.'),o('first-group','$groups[0] ?? []','This discards every group after the first, so it is not an equivalent reduction.','Replacing the fold with a seed value without processing the remainder.'),o('scalar-seed','array_reduce($groups, $append, 0)','Zero is neither an array nor the identity for this array-merging callback.','Applying the numeric sum identity to an array operation.')],key:'identity',explanation:'Without an explicit initial value, array_reduce starts with null and returns null for empty input. Supplying [] meets both the callback type and the empty-result contract.',trace:'The empty reduction returns []. The nonempty reduction merges [1] and then [2] into the array accumulator.',validation:{kind:'patch',marker:'array_reduce($groups, $append)',stdout:'[[],[1,2]]'},references:['https://www.php.net/manual/en/function.array-reduce.php'] }),
q({id:'PHP-E26-0054',format:'R',level:'M',topic:22,subtopic:'generator-materialization-duplicate-keys',objective:'Review materialization of an event stream whose keys are not unique.',reason:'Distinguish iteration over all yields from insertion into a keyed PHP array.',prerequisites:['Generators','iterator_to_array','Array keys'],stem:'Both events must remain in a positional list, even though their source keys repeat. Which replacement for iterator_to_array($events) meets that requirement?',files:[file(`function events(): Generator
{
    yield 'same' => 'created';
    yield 'same' => 'updated';
}

$events = events();

$output = iterator_to_array($events);

echo json_encode($output);`)],options:[o('values-after','array_values(iterator_to_array($events))','The first event is already overwritten before array_values removes keys.','Trying to repair information loss after keyed materialization.'),o('discard-keys','iterator_to_array($events, false)','Disabling key preservation appends both yields under consecutive numeric keys.'),o('preserve-keys','iterator_to_array($events, true)','Preserved duplicate keys cause the later event to replace the earlier one.','Assuming an array can retain multiple entries with the same key.'),o('unique-after','array_unique(iterator_to_array($events))','The keyed conversion already loses created; uniqueness filtering cannot restore it.','Using duplicate-value filtering to address duplicate keys.')],key:'discard-keys',explanation:'A generator may yield a key repeatedly. A PHP array cannot store duplicate keys, so preserving those keys during conversion overwrites earlier entries.',trace:'With key preservation disabled, created and updated are appended in yield order and both survive.',validation:{kind:'patch',marker:'iterator_to_array($events)',stdout:'["created","updated"]'},references:['https://www.php.net/manual/en/function.iterator-to-array.php'] }),
q({id:'PHP-E26-0055',format:'R',level:'M',topic:8,subtopic:'multi-array-map-key-reindexing',objective:'Review an array_map refactor that loses associative keys when a second input array is added.',reason:'Compare key behavior between single-array and multiple-array mapping.',prerequisites:['array_map','Associative arrays','Callbacks'],lessons:[4,8],coverageComplete:true,stem:'A refactor adds an offsets array to an existing array_map call. The caller requires the output keys left and right. Which review statement accurately explains the displayed result?',files:[file(`$values = ['left' => 10, 'right' => 20];
$offsets = [1, 2];

$before = array_map(fn ($value) => $value + 1, $values);
$after = array_map(fn ($value, $offset) => $value + $offset, $values, $offsets);

echo json_encode([array_keys($before), array_keys($after)]);`)],options:[o('values-keys','The numeric offsets are added to the string keys, so PHP converts the keys to integers.','The callback receives values, and array_map does not add keys.','Attributing key changes to callback arithmetic.'),o('both-preserve','Both calls retain the first array’s keys, regardless of additional arrays.','Key preservation applies only when exactly one array is supplied.','Extending single-array behavior to multi-array mapping.'),o('multi-reindexes','The second call receives multiple arrays and produces sequential numeric keys.','The multi-array form reindexes its result; preserving keys requires an explicit mapping strategy.'),o('arrow-reindexes','The second arrow function has two parameters, so arrow functions discard keys.','The number of input arrays determines this behavior, not arrow syntax or callback arity.','Assigning collection behavior to the callback’s syntax.')],key:'multi-reindexes',explanation:'array_map preserves keys for one input array. With multiple arrays, the result uses sequential integer keys, even when the first input is associative.',trace:'before has keys left and right. after has keys 0 and 1. A keyed loop or deliberate recombination is needed if those names are part of the contract.',validation:{kind:'contract',stdout:'[["left","right"],[0,1]]',keyEvidence:'The observed key lists differ exactly at the multi-array call.',counterexamples:{'values-keys':'Only values enter the callback','both-preserve':'after keys are 0 and 1','arrow-reindexes':'A two-parameter ordinary closure has the same multi-array behavior'}},references:['https://www.php.net/manual/en/function.array-map.php'] }),
q({id:"PHP-E26-0056",format:"R",level:"M",topic:14,subtopic:"constant-time-token-comparison",objective:"Review a secret comparison for strict equality and timing-resistant comparison.",reason:"Separate type-juggling prevention from the additional timing requirement.",prerequisites:["String comparison","Authentication tokens","Timing side channels"],stem:"These are fixed test strings, not real credentials. Production tokens are equal-length hexadecimal strings. The comparison must reject different contents and use PHP’s timing-safe comparison API. Which replacement satisfies both requirements?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$stored = '0e123456789';
$provided = '0e987654321';

$accepted = $stored == $provided;

echo json_encode($accepted);
`}],options:[o("cast","(string) $stored == (string) $provided","Both operands are already strings; loose numeric-string comparison still treats both as zero.","Assuming string casts disable numeric-string comparison."),o("strict","$stored === $provided","Identity rejects these values, but does not provide the requested timing-safe API contract.","Treating strict equality as a timing guarantee."),o("strcmp","strcmp($stored, $provided) === 0","This compares contents correctly but is not the requested timing-safe comparison API.","Assuming all string comparison functions are timing resistant."),o("hash-equals","hash_equals($stored, $provided)","hash_equals compares the known string with the user-supplied string using the intended timing-safe API.",null)],key:"hash-equals",explanation:"Loose comparison can treat numeric-looking strings as numbers. Strict comparison fixes that issue, but hash_equals additionally satisfies the explicit timing-safe API requirement.",trace:"The displayed loose comparison returns true because both strings represent zero in scientific notation. hash_equals compares their different bytes and returns false.",validation:{"kind":"contract","stdout":"true","keyEvidence":"The witness demonstrates loose comparison failure; the manual specifies hash_equals timing-safe contract.","counterexamples":{"cast":"Both numeric strings still compare numerically","strict":"No timing-safe guarantee","strcmp":"No timing-safe guarantee"}},references:["https://www.php.net/manual/en/function.hash-equals.php","https://www.php.net/manual/en/language.operators.comparison.php"],revision:2}),
q({id:'PHP-E26-0057',format:'R',level:'M',topic:10,subtopic:'lock-before-truncate-file-mode',objective:'Review a file replacement sequence that truncates before acquiring its cooperative lock.',reason:'Order open-mode side effects and lock acquisition under a stated concurrency protocol.',prerequisites:['fopen modes','flock','File truncation'],lessons:[20],coverageComplete:false,assumptions:['All participating writers use an exclusive flock on this same existing file; readers also follow the lock protocol. Each listed operation succeeds. Filesystem replacement is not required.'],stem:'The file must not be truncated until this writer owns the exclusive lock. The shown fopen already empties it. Which replacement sequence meets the requirement when all participants obey the stated locking protocol?',files:[file(`$path = __DIR__ . '/state.txt';
file_put_contents($path, 'old');

$handle = fopen($path, 'w');

echo strlen(file_get_contents($path));

fclose($handle);`)],options:[o('w-then-lock','Open with w; acquire LOCK_EX; write the replacement.','Mode w truncates during fopen, before flock can run.','Assuming truncation waits until the first write.'),o('c-lock-truncate','Open with c; acquire LOCK_EX; truncate to zero; rewind; write and flush; unlock.','Mode c avoids truncation at open, so truncation occurs only after lock acquisition.'),o('a-lock-write','Open with a; acquire LOCK_EX; write the replacement; unlock.','Append mode retains old contents and adds new bytes rather than replacing the file.','Treating append as a safe replacement mode.'),o('r-lock-write','Open with r; acquire LOCK_EX; truncate and write; unlock.','A read-only handle cannot perform the required writes and truncation.','Assuming an exclusive lock grants write access to a read-only stream.')],key:'c-lock-truncate',explanation:'Locking cannot undo a side effect that happened while opening the stream. The c mode opens for writing without truncating, allowing the lock to be acquired first.',trace:'The witness prints 0 immediately after fopen with w, before any write or flock. Under the stated cooperative protocol, c followed by the lock and explicit truncation preserves ordering.',validation:{kind:'contract',stdout:'0',keyEvidence:'The empty file before locking demonstrates the ordering defect; c avoids that open-time side effect.',counterexamples:{'w-then-lock':'Truncates before lock','a-lock-write':'Appends rather than replaces','r-lock-write':'Handle is not writable'}},references:['https://www.php.net/manual/en/function.fopen.php','https://www.php.net/manual/en/function.flock.php'] }),
q({id:'PHP-E26-0058',format:'R',level:'A',topic:25,subtopic:'weakmap-value-external-reachability',objective:'Review WeakMap eviction when an externally retained value points back to its key.',reason:'Distinguish an external strong reference from a collectable map-value-key cycle across two collection points.',prerequisites:['WeakMap (advanced)','Object reachability','Garbage collection'],stem:'A reviewer expects unsetting key to remove the cache entry immediately. Another variable still retains value, which points to key. Which assessment matches the two collection points?',files:[file(`$cache = new WeakMap();
$key = new stdClass();
$value = (object) ['owner' => $key];
$cache[$key] = $value;

unset($key);
gc_collect_cycles();
$whileHeld = count($cache);

unset($value);
gc_collect_cycles();

echo json_encode([$whileHeld, count($cache)]);`)],options:[o('force-gc','The first collection removes the entry because a WeakMap key can never have a strong owner.','WeakMap only weakens its own key edge; the external value variable still owns an object that retains the key.','Treating weak-map membership as weakening every reference to the key.'),o('key-copied','The entry survives both points because insertion clones and privately owns the key.','WeakMap preserves object identity and does not clone its keys.','Assuming a map copies its object keys.'),o('external-edge','The external value keeps the key alive at the first point; after value is unset, collection removes the entry.','The external value-to-owner path retains the key until that external root is removed.'),o('permanent-cycle','The entry survives both points because a map-value-key cycle is never collectable.','The second explicit collection removes this cycle on both stated runtimes.','Assuming every cycle involving a weak map is a permanent leak.')],key:'external-edge',explanation:'A weak key relationship does not cancel external strong references to the key. Once the external value is released, the remaining map-related cycle in this example can be collected.',trace:'The first count is 1 because value still retains owner. After value is unset and collection runs, the second count is 0.',validation:{kind:'contract',stdout:'[1,0]',keyEvidence:'The two observed counts distinguish external reachability from the remaining collectable cycle.',counterexamples:{'force-gc':'The first count is 1','key-copied':'The second count is 0 and no key clone occurs','permanent-cycle':'The second count is 0'}},references:['https://www.php.net/manual/en/class.weakmap.php'] }),
q({id:'PHP-E26-0059',revision:2,format:'R',level:'A',topic:17,subtopic:'readonly-clone-reinitialization',objective:'Review deep-copy repair using readonly-property reinitialization during cloning.',reason:'Combine shallow clone behavior, readonly assignment restrictions and the clone-specific reinitialization rule.',prerequisites:['Readonly properties','__clone','Nested object identity'],lessons:[23,24],coverageComplete:false,stem:'A reviewer claims that assigning child in __clone is forbidden because child is readonly. On the stated PHP 8.4/8.5 runtimes, which assessment is correct?',files:[file(`class Snapshot
{
    public function __construct(public readonly stdClass $child)
    {
    }

    public function __clone(): void
    {
        $this->child = clone $this->child;
    }
}

$original = new Snapshot((object) ['value' => 1]);
$copy = clone $original;
$copy->child->value = 2;

echo json_encode([$original->child->value, $copy->child->value]);`)],options:[o('clone-exception','The assignment is allowed during __clone; it gives the copy an independent child.','PHP permits readonly reinitialization during cloning, and the nested clone breaks child sharing.'),o('always-forbidden','The assignment must throw because readonly properties can never be reassigned in any context.','The stated versions include the clone-specific reinitialization rule.','Applying the older unconditional restriction to modern clone behavior.'),o('shared-slot','The assignment replaces the child on both snapshots because their readonly property storage is shared.','The clone has its own property slot. Replacing that slot does not replace the original snapshot’s child.','Confusing a shallow-copied object value with shared property storage between cloned objects.'),o('recursive-default','The assignment is unnecessary because cloning Snapshot already recursively clones child.','Normal object cloning is shallow; the explicit nested clone is what separates child.','Assuming automatic deep cloning.')],key:'clone-exception',explanation:'Since PHP 8.3, readonly properties may be reinitialized during cloning. This allows __clone to replace a shallow-copied nested object with its own clone.',trace:'The copy receives an independent child. Updating its value to 2 leaves the original child at 1.',validation:{kind:'contract',stdout:'[1,2]',keyEvidence:'The observed independent values validate both the permitted assignment and deep-copy step.',counterexamples:{'always-forbidden':'The program completes without Error','shared-slot':'The children have independent values','recursive-default':'Removing the explicit clone would retain the shared child'}},references:['https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties'] }),
q({id:'PHP-E26-0060',format:'R',level:'A',topic:8,subtopic:'private-first-class-callable-export',objective:'Review whether replacing a first-class callable with an array callable preserves private-method access.',reason:'Distinguish callable acquisition scope from later invocation visibility checks.',prerequisites:['First-class callables (advanced)','Private methods','Closure scope'],lessons:[8,25],coverageComplete:false,stem:'A proposed refactor changes exported from a first-class callable to an array callable. Invocation occurs outside Vault. Which review statement correctly describes the compatibility effect?',files:[file(`class Vault
{
    private function secret(): string
    {
        return 'ok';
    }

    public function exported(bool $asArray): mixed
    {
        if ($asArray) {
            return [$this, 'secret'];
        }

        return $this->secret(...);
    }
}

$vault = new Vault();
$closure = $vault->exported(false);
$array = $vault->exported(true);

echo json_encode([$closure(), is_callable($array)]);`)],options:[o('same-object','Both remain callable outside because the array retains the same object.','Object identity does not grant outside code access to a private method.','Equating possession of an object with permission to call its private methods.'),o('neither','Neither can be invoked outside because secret is private.','The first-class callable is acquired inside the authorized scope and remains invocable.','Rechecking private visibility for an already acquired Closure.'),o('array-public','The array form makes secret public for subsequent calls.','Returning an array does not change method visibility.','Treating a callable representation as a visibility modifier.'),o('scope-preserved','The Closure works outside; the array form fails the outside visibility check.','The acquired Closure retains callable access, while an array is resolved under the later caller’s scope.')],key:'scope-preserved',explanation:'First-class callable syntax acquires a Closure in the current scope. Returning an object/method array merely describes a future lookup and does not transfer private access.',trace:'The exported Closure returns ok. Outside Vault, is_callable for the array is false.',validation:{kind:'contract',stdout:'["ok",false]',keyEvidence:'The same private method behaves differently under the two callable representations.',counterexamples:{'same-object':'Outside is_callable is false','neither':'The Closure returns ok','array-public':'Visibility remains private'}},references:['https://www.php.net/manual/en/functions.first_class_callable_syntax.php'] }),
q({id:'PHP-E26-0061',revision:2,format:'R',level:"M",topic:14,subtopic:'unserialize-disallowed-class-shape',objective:'Review the limits of allowed_classes=false when consuming serialized data.',reason:"Distinguish class-instantiation restrictions from the type and validation of one decoded value.",prerequisites:['Serialization','__wakeup','__PHP_Incomplete_Class'],stem:'The payload is generated locally for this demonstration. A review proposes treating allowed_classes=false as proof that any decoded payload is a validated array. Which assessment of this claim is correct?',files:[file(`class Message
{
    public static int $wakes = 0;
    public string $text = 'demo';

    public function __wakeup(): void
    {
        self::$wakes++;
    }
}

$payload = serialize(new Message());
$decoded = unserialize($payload, ['allowed_classes' => false]);

echo json_encode([get_class($decoded), Message::$wakes, is_array($decoded)]);`)],options:[o('array-conversion','The option converts every object into an array and validates its field types.','Disallowed objects become incomplete objects; no schema validation is performed.','Confusing a class restriction with a data decoder and validator.'),o('limited-control','The option prevents Message construction here, but returns an incomplete object rather than a validated array.','Class restrictions control instantiation; callers must still validate the decoded value and should not deserialize untrusted input.'),o('wake-first','Message::__wakeup runs first, then the option converts its result to an array.','A disallowed class’s wakeup hook is not invoked in this case.','Assuming class restrictions apply only after object hooks run.'),o('null-result','Every disallowed object becomes null, so the caller only needs a null check.','The result is __PHP_Incomplete_Class, not null.','Assuming rejection discards the whole object value.')],key:'limited-control',explanation:'allowed_classes restricts classes that may be instantiated. It does not guarantee an array result, validate a schema or make arbitrary serialized input safe to trust.',trace:'The known fixture produces __PHP_Incomplete_Class, runs no Message wakeup hook and is not an array.',validation:{kind:'contract',stdout:'["__PHP_Incomplete_Class",0,false]',keyEvidence:'The runtime witness directly refutes the claimed array and validation guarantees.',counterexamples:{'array-conversion':'is_array is false','wake-first':'wakes remains 0','null-result':'get_class reports __PHP_Incomplete_Class'}},references:['https://www.php.net/manual/en/function.unserialize.php'] }),
q({id:'PHP-E26-0062',revision:2,format:'R',level:"M",topic:17,subtopic:'serialization-hook-precedence',objective:'Review a serialization-hook migration without assuming legacy hooks still execute.',reason:"Apply modern-hook precedence to one serialization round trip and identify skipped legacy validation.",prerequisites:['__serialize and __unserialize','__sleep and __wakeup','Static trace state'],stem:'A class adds modern serialization hooks but retains its old hooks. Which review statement matches the hook sequence for a newly serialized instance on PHP 8.4/8.5?',files:[file(`class Envelope
{
    public static array $trace = [];
    public int $value = 7;

    public function __sleep(): array
    {
        self::$trace[] = 'sleep';

        return ['value'];
    }

    public function __wakeup(): void
    {
        self::$trace[] = 'wakeup';
    }

    public function __serialize(): array
    {
        self::$trace[] = 'serialize';

        return ['v' => $this->value];
    }

    public function __unserialize(array $data): void
    {
        self::$trace[] = 'unserialize';
        $this->value = $data['v'];
    }
}

$restored = unserialize(serialize(new Envelope()));

echo json_encode([Envelope::$trace, $restored->value]);`)],options:[o('both-pairs','Both old and new hook pairs run, so old validation remains active.','The modern hooks take precedence instead of chaining to the legacy hooks.','Assuming serialization hooks compose automatically.'),o('old-wins','The older hooks retain precedence to preserve backward compatibility.','__serialize and __unserialize have precedence when present.','Assuming declaration history controls hook selection.'),o('modern-only','Only __serialize and __unserialize run; required old-hook logic must be deliberately preserved.','The modern pair controls this round trip, so migration must explicitly carry over any necessary validation.'),o('mixed','__serialize runs when writing, but __wakeup always runs after restoration.','__unserialize suppresses __wakeup for this restoration.','Applying modern precedence only to the write side.')],key:'modern-only',explanation:'When the modern hooks exist, PHP uses __serialize instead of __sleep and __unserialize instead of __wakeup. Old hook bodies are not automatically called.',trace:'The trace is serialize, unserialize. The modern representation uses v, which the modern reader restores to value 7.',validation:{kind:'contract',stdout:'[["serialize","unserialize"],7]',keyEvidence:'The trace records precisely which hooks execute in the round trip.',counterexamples:{'both-pairs':'sleep and wakeup are absent','old-wins':'Modern hooks appear in the trace',mixed:'wakeup is absent and unserialize is present'}},references:['https://www.php.net/manual/en/language.oop5.magic.php#object.serialize'] }),
q({id:'PHP-E26-0063',revision:2,format:'R',level:"M",topic:20,subtopic:'finally-replacement-exception-chain',objective:'Review exception identity and chaining when cleanup throws during exception propagation.',reason:"Trace a work exception through a throwing finally block and inspect the resulting previous chain.",prerequisites:['Exception propagation','finally','getPrevious'],lessons:[22],coverageComplete:true,stem:'A review claims that cleanup failure leaves the work failure as the directly caught exception. Which statement describes this code’s actual propagation?',files:[file(`try {
    try {
        throw new RuntimeException('work');
    } finally {
        throw new LogicException('cleanup');
    }
} catch (Throwable $error) {
    echo json_encode([
        get_class($error),
        $error->getMessage(),
        $error->getPrevious()?->getMessage(),
    ]);
}`)],options:[o('cleanup-primary','LogicException is caught directly, with the work exception retained as previous.','The throwable from finally takes precedence, and PHP chains the earlier exception.'),o('work-primary','RuntimeException is caught directly, with cleanup retained as previous.','The later throwable from finally becomes the directly propagated one.','Reversing the precedence of cleanup and pending failures.'),o('cleanup-only','LogicException is caught directly, and the earlier work exception is discarded completely.','The earlier exception is available through getPrevious in this case.','Assuming replacement necessarily deletes the causal chain.'),o('both-catches','The catch executes twice, once for each exception.','There is one propagated throwable with a previous chain, not two catch invocations.','Treating chained exceptions as separate propagation events.')],key:'cleanup-primary',explanation:'Throwing from finally changes the primary exception seen by the caller. When an exception was already propagating, PHP preserves it as the previous exception of the new one.',trace:'The catch receives LogicException with message cleanup. getPrevious retrieves the RuntimeException with message work.',validation:{kind:'contract',stdout:'["LogicException","cleanup","work"]',keyEvidence:'All three fields distinguish primary type, primary message and earlier cause.',counterexamples:{'work-primary':'The caught type is LogicException','cleanup-only':'previous message is work','both-catches':'Only one JSON tuple is emitted'}},references:['https://www.php.net/manual/en/language.exceptions.php#language.exceptions.finally'] }),
q({id:'PHP-E26-0064',revision:2,format:'R',level:"M",topic:3,subtopic:'dnf-union-refactor-widens-contract',objective:'Review whether flattening a disjunctive normal form type preserves its capability requirement.',reason:"Compare conjunction and disjunction against explicitly declared object capabilities.",prerequisites:['Interfaces','Union and intersection types','DNF types'],stem:'The original contract accepts an object that is both Readable and Seekable, or an IndependentSource. A refactor replaces (Readable&Seekable)|IndependentSource with Readable|Seekable|IndependentSource. Which input newly passes even though it violates the original contract?',files:[file(`interface Readable
{
}
interface Seekable
{
}
interface IndependentSource
{
}

class ReadOnlySource implements Readable
{
}
class SeekableSource implements Readable, Seekable
{
}
class Independent implements IndependentSource
{
}
class Hybrid implements Readable, IndependentSource
{
}

function original((Readable&Seekable)|IndependentSource $source): bool
{
    return true;
}

function revised(Readable|Seekable|IndependentSource $source): bool
{
    return true;
}

foreach ([new ReadOnlySource(), new SeekableSource(), new Independent(), new Hybrid()] as $source) {
    try {
        original($source);
        echo 'both;';
    } catch (TypeError $error) {
        echo revised($source) ? 'new-only;' : 'neither;';
    }
}`)],options:[o('seekable','SeekableSource','It implements both Readable and Seekable, so it already satisfies the original intersection.','Treating an intersection as excluding objects that implement both interfaces.'),o('independent','Independent','The independent-source branch already accepts this object.','Ignoring the original union’s second branch.'),o('hybrid','Hybrid','IndependentSource alone satisfies the original union, regardless of the additional Readable capability.','Assuming every accepted object must satisfy the intersection branch.'),o('read-only','ReadOnlySource','It lacks Seekable and IndependentSource, so only the widened union accepts it.')],key:'read-only',explanation:'The intersection requires both capabilities together. Replacing it with a union accepts either capability alone and therefore widens the domain.',trace:'Only the first object prints new-only. The remaining three already satisfy at least one original branch.',validation:{kind:'contract',stdout:'new-only;both;both;both;',keyEvidence:'The four witnesses evaluate each option against both type declarations.',counterexamples:{seekable:'Accepted by original intersection',independent:'Accepted by original second branch',hybrid:'Accepted by original second branch'}},references:['https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.composite.dnf'] }),
q({id:'PHP-E26-0065',format:'R',level:'A',topic:7,subtopic:'strict-types-internal-callback-boundary',objective:'Review a callback-to-loop refactor across strict and internal scalar-call boundaries.',reason:'Trace call-site strictness through a direct userland call and an internal function invoking a callback.',prerequisites:['strict_types','Scalar type declarations','Internal callbacks (advanced)'],lessons:[1,8],coverageComplete:false,stem:'A proposed refactor replaces array_map with a foreach loop that directly calls takeInt from this same strict file. Which compatibility concern is demonstrated by the example?',files:[file(`declare(strict_types=1);

function takeInt(int $value): int
{
    return $value;
}

try {
    takeInt('12');
    $direct = 'accepted';
} catch (TypeError $error) {
    $direct = 'TypeError';
}

$mapped = array_map('takeInt', ['12']);

echo json_encode([$direct, $mapped]);`)],options:[o('both-reject','No concern: strict_types makes both forms reject every numeric string.','Calls made from internal functions do not inherit this file’s strict scalar-call behavior.','Treating strict_types as a process-wide setting.'),o('boundary-change','The direct loop would reject a numeric string that array_map currently coerces.','The direct call originates in the strict file; the callback invocation originates in the internal function.'),o('both-coerce','No concern: the parameter’s int type always coerces numeric strings.','The direct call in this strict file throws TypeError.','Assuming scalar parameter declarations always use coercion.'),o('return-only','The difference concerns only return types; argument acceptance stays identical.','The witness differs at argument binding before any result is returned.','Applying strict_types only to return values.')],key:'boundary-change',explanation:'Strict scalar argument behavior is selected at the call site. PHP’s internal callback invocation does not apply the strict setting of the file that called array_map.',trace:'The direct takeInt call rejects the string. array_map invokes the callback with scalar coercion and obtains integer 12.',validation:{kind:'contract',stdout:'["TypeError",[12]]',keyEvidence:'The two call paths use the same function and input but have different argument acceptance.',counterexamples:{'both-reject':'array_map returns [12]','both-coerce':'Direct call throws TypeError','return-only':'The failure occurs while binding the argument'}},references:['https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict'] }),
q({id:'PHP-E26-0066',format:'I',level:'F',topic:10,subtopic:'split-header-first-delimiter',objective:'Split a name/value line at its first delimiter while retaining subsequent delimiters in the value.',reason:'Select the appropriate positive split limit for a small string.',prerequisites:['explode','Arrays'],lessons:[4],coverageComplete:false,stem:'Split this line into exactly ["Location","https://example.test/a:b"]. Which expression should replace the current explode call?',files:[file(`$line = 'Location:https://example.test/a:b';

$parts = explode(':', $line);

echo json_encode($parts, JSON_UNESCAPED_SLASHES);`)],options:[o('three',"explode(':', $line, 3)",'A limit of 3 still splits the colon after https.','Counting delimiters rather than desired result elements.'),o('two',"explode(':', $line, 2)",'The second element retains the remaining string, including all later colons.'),o('negative',"explode(':', $line, -1)",'A negative limit removes trailing pieces after splitting; it does not preserve the unsplit value.','Treating negative limits as split-from-the-front counts.'),o('one',"explode(':', $line, 1)",'A limit of 1 returns the entire line as one element.','Assuming the limit counts delimiter occurrences rather than output pieces.')],key:'two',explanation:'A positive explode limit is the maximum number of output elements. The last element contains the remaining unsplit text.',trace:'With limit 2, the first colon separates Location from the complete URL.',validation:{kind:'patch',marker:"explode(':', $line)",stdout:'["Location","https://example.test/a:b"]'},references:['https://www.php.net/manual/en/function.explode.php'] }),
q({id:'PHP-E26-0067',format:'I',level:'F',topic:4,subtopic:'array-column-index-and-value',objective:'Build an identifier-to-name lookup from a list of records.',reason:'Choose value and index fields in the array_column call.',prerequisites:['Arrays of records','array_column'],lessons:[4],coverageComplete:true,stem:'All rows have distinct integer ids and a name. Which expression produces an id-to-name lookup with keys 7 and 9?',files:[file(`$rows = [
    ['id' => 7, 'name' => 'Ada'],
    ['id' => 9, 'name' => 'Lin'],
];

$lookup = array_column($rows, 'name');

echo json_encode($lookup);`)],options:[o('names-as-keys',"array_column($rows, 'id', 'name')",'This produces the inverse mapping, names to ids.','Reversing the value-field and index-field arguments.'),o('whole-rows',"array_column($rows, null, 'id')",'This indexes whole row arrays by id, rather than mapping to names.','Using null to mean the desired value column instead of the full row.'),o('id-to-name',"array_column($rows, 'name', 'id')",'name supplies the values and id supplies the resulting keys.'),o('ids-only',"array_column($rows, 'id')",'This returns a positional list of ids without names.','Choosing the desired index field as the extracted value field.')],key:'id-to-name',explanation:'array_column takes the value column second and the optional index column third.',trace:'Row 7 contributes key 7 with value Ada; row 9 contributes key 9 with value Lin.',validation:{kind:'patch',marker:"array_column($rows, 'name')",stdout:'{"7":"Ada","9":"Lin"}'},references:['https://www.php.net/manual/en/function.array-column.php'] }),
q({id:'PHP-E26-0068',format:'I',level:'F',topic:5,subtopic:'single-bit-membership-mask',objective:'Test whether a specific permission bit is present in a combined mask.',reason:'Distinguish bitwise membership from equality and boolean truthiness.',prerequisites:['Bitwise AND and OR','Boolean comparisons'],lessons:[2],coverageComplete:true,stem:'READ is bit 1 and WRITE is bit 2. hasRead must return true for masks 1 and 3, but false for 0 and 2. Which return expression implements that rule?',files:[file(`const READ = 1;
const WRITE = 2;

function hasRead(int $mask): bool
{
    return $mask === READ;
}

echo json_encode(array_map('hasRead', [0, READ, WRITE, READ | WRITE]));`)],options:[o('contains','($mask & READ) === READ','AND retains the READ bit only when it is present.'),o('equals','$mask === READ','This rejects a mask that includes both READ and WRITE.','Assuming the permission mask contains only one flag.'),o('boolean','$mask && READ','Any nonzero mask is truthy, including WRITE alone.','Using boolean AND instead of bitwise membership.'),o('or','($mask | READ) === READ','This is also true for mask 0 and false for the combined mask.','Using bit addition to test whether a bit was already present.')],key:'contains',explanation:'Bitwise AND with READ isolates that bit. Comparing the result to READ accepts both a read-only mask and a mask with additional permissions.',trace:'The four masks yield false, true, false and true respectively.',validation:{kind:'patch',marker:'$mask === READ',stdout:'[false,true,false,true]'},references:['https://www.php.net/manual/en/language.operators.bitwise.php'] }),
q({id:"PHP-E26-0069",format:"I",level:"M",topic:11,subtopic:"query-digit-string-shape-validation",objective:"Validate a query parameter’s scalar shape and ASCII digit-only content without rejecting leading zeros.",reason:"Combine superglobal input shape with a precise lexical policy.",prerequisites:["ASCII digit strings","Lexical validation","Empty strings"],lessons:[13],coverageComplete:false,extensions:["ctype"],stem:"The token must be a nonempty string of ASCII decimal digits. Leading zeros are valid; signs, exponents and array-shaped query values are not. Which predicate implements this policy for the displayed cases?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function validToken(mixed $input): bool
{
    return is_numeric($input);
}

$cases = ['0', '007', '-2', '1e3', '', ['7'], "7\\n"];

echo json_encode(array_map('validToken', $cases));
`}],options:[o("numeric-string","is_string($input) && is_numeric($input)","is_numeric accepts signs and exponent notation.","Equating numeric syntax with a digit-only token grammar."),o("integer-filter","is_string($input) && filter_var($input, FILTER_VALIDATE_INT) !== false","Integer validation rejects the accepted token 007 under its default rules.","Treating a lexical identifier as a canonical integer representation."),o("digits","is_string($input) && ctype_digit($input)","The shape check rejects arrays; ctype_digit requires a nonempty all-digit string.",null),o("word","is_string($input) && preg_match(\"/^[0-9]+$/\", $input) === 1","Dollar permits a final newline, so this is broader than the stated all-byte digit policy.","Assuming the regex dollar anchor always means the absolute end of the string.")],key:"digits",explanation:"The input is a token, not a number to coerce. A string shape check followed by ctype_digit implements its byte-level digit grammar and preserves leading zeros.",trace:"0 and 007 pass. Negative, exponent, empty, array-shaped and newline-terminated values fail.",validation:{"kind":"patch","marker":"is_numeric($input)","stdout":"[true,true,false,false,false,false,false]","candidates":{},"fixtureNote":"A trailing-newline case is included in the source to distinguish the regex anchor alternative."},references:["https://www.php.net/manual/en/function.ctype-digit.php","https://www.php.net/manual/en/reference.pcre.pattern.syntax.php"],revision:2}),
q({id:"PHP-E26-0070",format:"I",level:"M",topic:10,subtopic:"json-top-level-object-shape",objective:"Require a top-level JSON object without confusing empty objects with empty lists.",reason:"Preserve JSON object/list shape through decoding and validation.",prerequisites:["JSON decoding","Objects versus arrays","Runtime type checks"],stem:"The endpoint accepts any JSON object, including {}, but rejects arrays and scalar JSON values. Syntax errors are already handled by JSON_THROW_ON_ERROR. Replace the return predicate. Which choice preserves that object-only policy?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function objectBody(string $raw): bool
{
    $decoded = json_decode($raw, false, 512, JSON_THROW_ON_ERROR);

    return is_array($decoded);
}

echo json_encode(array_map('objectBody', ['{}', '{"id":1}', '[]', '"text"']));
`}],options:[o("truthy","(bool) $decoded","An empty array is false, but a nonempty scalar string is true; truthiness is not object shape.","Using truthiness as structural validation."),o("object","$decoded instanceof stdClass","Default object decoding produces stdClass for both empty and populated JSON objects.",null),o("valid-json","json_validate($raw)","All four inputs are valid JSON, including the rejected list and scalar.","Confusing syntax validity with schema validity."),o("array","is_array(json_decode($raw, true, 512, JSON_THROW_ON_ERROR))","Associative decoding turns both JSON objects and arrays into PHP arrays.","Discarding the distinction before validating it.")],key:"object",explanation:"Decode objects as objects when their distinction from arrays matters. The top-level stdClass check accepts JSON objects without accepting lists or scalars.",trace:"Both object inputs become stdClass. The list becomes a PHP array and the string remains a PHP string.",validation:{"kind":"patch","marker":"is_array($decoded)","stdout":"[true,true,false,false]"},references:["https://www.php.net/manual/en/function.json-decode.php"],revision:2}),
q({id:'PHP-E26-0071',format:'I',level:'M',topic:10,subtopic:'exclusive-file-create-mode',objective:'Choose an open mode that creates a new file while refusing an existing path.',reason:'Distinguish atomic create-if-absent semantics from truncation, append and nontruncating opens.',prerequisites:['File modes','Error handlers','Exceptions'],lessons:[20,21,22],coverageComplete:true,assumptions:['The temporary directory is writable; both open attempts target regular local files. The explicit error handler converts fopen warnings to ErrorException.'],stem:'create must open a missing path for writing and refuse an existing path without altering it. Which mode string should replace c?',files:[file(`set_error_handler(function (int $severity, string $message): never {
    throw new ErrorException($message, 0, $severity);
});

function create(string $path): bool
{
    try {
        $handle = fopen($path, 'c');
        fwrite($handle, 'new');
        fclose($handle);

        return true;
    } catch (ErrorException $error) {
        return false;
    }
}

file_put_contents(__DIR__ . '/existing.txt', 'old');

$result = [
    create(__DIR__ . '/fresh.txt'),
    create(__DIR__ . '/existing.txt'),
    file_get_contents(__DIR__ . '/existing.txt'),
];

restore_error_handler();

echo json_encode($result);`)],options:[o('write',"'w'",'w opens existing files and truncates them.','Treating write mode as exclusive creation.'),o('append',"'a'",'a opens existing files and appends new bytes.','Assuming append protects an existing path by rejecting it.'),o('create',"'c'",'c avoids initial truncation but still opens and permits overwriting an existing file.','Confusing nontruncation with create-if-absent.'),o('exclusive',"'x'",'x creates a new file and fails if the path already exists.')],key:'exclusive',explanation:'The x mode requests exclusive creation. Checking existence separately before a normal open would also leave a race; the mode expresses the create-if-absent operation itself.',trace:'fresh.txt is created. Opening existing.txt warns and is converted to the handled exception, leaving old intact.',validation:{kind:'patch',marker:"'c'",stdout:'[true,false,"old"]'},references:['https://www.php.net/manual/en/function.fopen.php'] }),
q({id:'PHP-E26-0072',format:'I',level:'M',topic:10,subtopic:'partial-write-offset-accounting',objective:'Advance a write-all loop by the number of bytes actually accepted.',reason:'Track offsets across successful short writes instead of assuming the requested length was written.',prerequisites:['fwrite return contract','Byte offsets','Loops'],lessons:[3,20],coverageComplete:true,assumptions:['writeChunk is a deterministic stand-in for a writer that accepts only some requested bytes. It returns the accepted byte count. The existing guard handles false or zero.'],stem:'The loop must deliver every byte exactly once despite short writes. Which replacement for the offset update makes the sink equal ABCDEFGH?',files:[file(`$sink = '';
$quotas = [3, 2, 3];

$writeChunk = function (string $chunk) use (&$sink, &$quotas): int {
    $count = min(array_shift($quotas) ?? 0, strlen($chunk));
    $sink .= substr($chunk, 0, $count);

    return $count;
};

$payload = 'ABCDEFGH';
$offset = 0;

while ($offset < strlen($payload)) {
    $remaining = substr($payload, $offset);
    $written = $writeChunk($remaining);

    if ($written === false || $written === 0) {
        break;
    }

    $offset += strlen($remaining);
}

echo $sink;`)],options:[o('actual','$offset += $written;','The accepted-byte count identifies exactly where the next unwritten suffix begins.'),o('requested','$offset += strlen($remaining);','This skips bytes that were requested but not accepted by the short write.','Assuming a successful call writes its entire argument.'),o('reset','$offset = $written;','This resets the total offset to the latest chunk size, causing repeated earlier bytes.','Confusing per-call progress with cumulative progress.'),o('difference','$offset += strlen($remaining) - $written;','This advances by the unwritten count rather than the written count.','Reversing the accepted and remaining portions.')],key:'actual',explanation:'A successful write can consume fewer bytes than requested. The next call must begin after exactly those consumed bytes, so the cumulative offset increases by written.',trace:'The writer accepts ABC, then DE, then FGH. Offsets advance 0→3→5→8.',validation:{kind:'patch',marker:'$offset += strlen($remaining);',stdout:'ABCDEFGH'},references:['https://www.php.net/manual/en/function.fwrite.php'] }),
q({id:'PHP-E26-0073',revision:2,format:'I',level:'M',topic:8,subtopic:'deferred-closure-iteration-snapshot',objective:'Capture each loop value for deferred callbacks without following the reused loop variable.',reason:'Separate callback construction time from invocation time and choose the intended capture semantics.',prerequisites:['Arrow functions','Closure capture','Loop variables'],lessons:[6,7,9],coverageComplete:true,stem:'Each deferred callback must remember its own iteration’s id. Replace the callback expression so later invocation returns [1,2]. Which choice does that?',files:[file(`$jobs = [];

foreach ([1, 2] as $id) {
    $jobs[] = function () use (&$id) {
        return $id;
    };
}

echo json_encode(array_map(fn ($job) => $job(), $jobs));`)],options:[o('global',"fn () => $GLOBALS['id']",'Both callbacks read the same top-level loop variable after it has become 2.','Using a global lookup instead of capturing an iteration snapshot.'),o('parameter','fn ($id = 0) => $id','No argument is supplied when the jobs run, so both return the default zero.','Assuming a callback parameter automatically binds to an outer variable of the same name.'),o('arrow','fn () => $id','Each arrow function captures the current id value when it is created.'),o('reference',`static function () use (&$id) {
    return $id;
}`,'static removes implicit this binding; it does not change the explicit reference capture.','Assuming static freezes all captured variables.')],key:'arrow',explanation:'Arrow functions capture outer variables by value. A by-reference capture instead follows the reused loop variable until the callbacks are invoked.',trace:'The first arrow captures 1 and the second captures 2. Later calls read those two snapshots.',validation:{kind:'patch',marker:'function () use (&$id) {\n        return $id;\n    }',stdout:'[1,2]'},references:['https://www.php.net/manual/en/functions.arrow.php','https://www.php.net/manual/en/functions.anonymous.php'] }),
q({id:'PHP-E26-0074',format:'I',level:'M',topic:22,subtopic:'recursive-generator-delegation',objective:'Delegate nested generator values while continuing traversal of later siblings.',reason:'Distinguish yielding a generator object, returning it and forwarding its yielded values.',prerequisites:['Recursion','Generators','yield from'],lessons:[10],coverageComplete:false,stem:'walk must produce a flat stream of integers from this nested list, in order. Which statement should replace the marked recursive call?',files:[file(`function walk(array $items): Generator
{
    foreach ($items as $item) {
        if (is_array($item)) {
            walk($item);
        } else {
            yield $item;
        }
    }
}

echo json_encode(iterator_to_array(walk([1, [2], 3]), false));`)],options:[o('yield-object','yield walk($item);','This yields the Generator object itself rather than its integer values.','Confusing yielding an iterable with iterating and yielding its contents.'),o('delegate','yield from walk($item);','Delegation forwards the nested values and then resumes the outer loop.'),o('return','return walk($item);','This ends the outer generator at the nested item and puts the Generator object on the return channel.','Using return where recursive yielded values must be forwarded.'),o('call','walk($item);','Creating the nested generator without iterating it yields no nested values.','Assuming a generator executes fully when its function is called.')],key:'delegate',explanation:'yield from iterates the delegated generator and forwards its values. After it finishes, execution continues with the next outer item.',trace:'The outer generator yields 1, delegates the inner 2, then continues to yield 3.',validation:{kind:'patch',marker:'walk($item);',stdout:'[1,2,3]'},references:['https://www.php.net/manual/en/language.generators.syntax.php#control-structures.yield.from'] }),
q({id:'PHP-E26-0075',format:'I',level:'M',topic:8,subtopic:'normalize-callable-to-closure-property',objective:'Store an accepted callable in a Closure-typed property without narrowing the public constructor contract.',reason:'Distinguish a callable representation from a Closure object and choose the conversion API.',prerequisites:['callable','Closure','Typed properties'],lessons:[8,23,24],coverageComplete:true,stem:'Formatter accepts any valid callable, including a function-name string, but stores a Closure internally. Which expression should replace $format in the property assignment?',files:[file(`class Formatter
{
    private Closure $format;

    public function __construct(callable $format)
    {
        $this->format = $format;
    }

    public function apply(string $value): string
    {
        return ($this->format)($value);
    }
}

echo (new Formatter('strtoupper'))->apply('php');`)],options:[o('direct','$format','A valid callable string is not a Closure instance and cannot be assigned to this property.','Equating the callable pseudo-type with the Closure class.'),o('construct','new Closure($format)','Closure cannot be instantiated directly through its private constructor.','Assuming every object type has a public conversion constructor.'),o('bind','Closure::bind($format, null)','Closure::bind expects an existing Closure as its first argument, not a function-name string.','Confusing rebinding a Closure with converting a callable.'),o('convert','Closure::fromCallable($format)','fromCallable creates a Closure from an accessible valid callable representation.')],key:'convert',explanation:'callable includes strings, arrays, invokable objects and Closures. Closure::fromCallable normalizes those accepted forms to the concrete property type.',trace:'The string strtoupper becomes a Closure; invoking the stored Closure with php returns PHP.',validation:{kind:'patch',marker:'$this->format = $format;',candidates:{direct:'$this->format = $format;',construct:'$this->format = new Closure($format);',bind:'$this->format = Closure::bind($format, null);',convert:'$this->format = Closure::fromCallable($format);'},stdout:'PHP',errors:{direct:'TypeError',construct:'Instantiation of class Closure is not allowed',bind:'TypeError'}},references:['https://www.php.net/manual/en/closure.fromcallable.php'] }),
q({id:'PHP-E26-0076',revision:2,format:'I',level:"F",topic:19,subtopic:'psr4-prefix-removal-case-sensitive-path',objective:'Resolve a PSR-4 class path after removing the configured namespace prefix.',reason:"Apply one stated namespace-prefix mapping and preserve case in the resulting path.",prerequisites:['Namespaces','Composer PSR-4 (unmapped curriculum)','Case-sensitive filesystems'],lessons:[31],coverageComplete:false,assumptions:['Composer maps the exact namespace prefix Acme\\ to src/. The class is Acme\\Billing\\Invoice. The filesystem is case-sensitive; no classmap or fallback autoloader is configured.'],stem:'Which file location satisfies this PSR-4 mapping for Acme\\Billing\\Invoice?',options:[o('full-prefix','src/Acme/Billing/Invoice.php','The configured Acme prefix is removed before mapping the remaining namespace segments.','Retaining the prefix as an extra directory beneath its base path.'),o('lower-directory','src/billing/Invoice.php','The Billing namespace segment must match the directory’s case under the stated rules.','Assuming PHP class-name case tolerance also makes PSR-4 paths case-insensitive.'),o('mapped','src/Billing/Invoice.php','After removing Acme, Billing maps to a directory and Invoice maps to Invoice.php.'),o('lower-class','src/Billing/invoice.php','The class-name filename must match Invoice’s case.','Lowercasing a class filename during namespace-to-path conversion.')],key:'mapped',explanation:'PSR-4 maps the namespace portion after the registered prefix beneath its base directory, preserving namespace and class-name case in the path.',trace:'Acme\\ is replaced by src/. Billing becomes Billing/, and Invoice becomes Invoice.php.',validation:{kind:'document-review',rule:'PSR-4 section 2.3: namespace prefix maps to base directory; subnamespace and class filename match case.',optionAudit:{'full-prefix':'Adds a directory already accounted for by the prefix mapping','lower-directory':'Violates subnamespace case','mapped':'Matches the prefix and both case-sensitive segments','lower-class':'Violates class filename case'}},references:['https://www.php-fig.org/psr/psr-4/','https://getcomposer.org/doc/04-schema.md#psr-4'] }),
q({id:'PHP-E26-0077',format:'I',level:'A',topic:17,subtopic:'memoized-cyclic-object-clone',objective:'Memoize a clone before following cyclic object edges while preserving graph identity.',reason:'Coordinate object identity, memo lookup and recursive graph traversal without infinite recursion.',prerequisites:['Object cloning','SplObjectStorage (advanced)','Recursion with cycles'],lessons:[10,23],coverageComplete:false,stem:'copyNode must return a new node whose self-loop points to the new node, never the original. The depth guard is a test safety limit. Which memo assignment makes the copied graph satisfy both identity checks?',files:[file(`class Node
{
    public ?Node $next = null;
}

function copyNode(Node $node, SplObjectStorage $memo, int $depth = 0): Node
{
    if ($memo->offsetExists($node)) {
        return $memo[$node];
    }

    if ($depth > 5) {
        throw new RuntimeException('depth limit');
    }

    $copy = clone $node;
    $memo[$node] = clone $node;
    $copy->next = $node->next === null
        ? null
        : copyNode($node->next, $memo, $depth + 1);

    return $copy;
}

$original = new Node();
$original->next = $original;

try {
    $copy = copyNode($original, new SplObjectStorage());
    echo json_encode([$copy !== $original, $copy->next === $copy]);
} catch (RuntimeException $error) {
    echo 'depth limit';
}`)],options:[o('memo-copy','$memo[$copy] = $copy;','Recursive lookup uses the original node as key, so caching under the clone never breaks the original cycle.','Using destination identity as the memo lookup key.'),o('memo-original','$memo[$node] = $node;','The recursive edge resolves back to the original node rather than the new copy.','Using memoization merely to stop recursion without preserving copied identity.'),o('memo-extra-clone','$memo[$node] = clone $copy;','The edge resolves to a different clone from the one returned at the root.','Creating a second copy instead of registering the copy under construction.'),o('memo-current','$memo[$node] = $copy;','Registering the current clone under the original identity lets the recursive edge resolve to this exact copy.')],key:'memo-current',explanation:'Graph cloning needs a mapping from each original object to the single destination object under construction. Register it before traversing outgoing edges so cycles and aliases resolve consistently.',trace:'The original maps to copy. Recursing along the self-loop finds that memo entry and returns copy itself.',validation:{kind:'patch',marker:'$memo[$node] = clone $node;',stdout:'[true,true]'},references:['https://www.php.net/manual/en/class.splobjectstorage.php','https://www.php.net/manual/en/language.oop5.cloning.php'] }),
q({id:"PHP-E26-0078",format:"I",level:"A",topic:14,subtopic:"unambiguous-binary-field-signing-frame",objective:"Encode two ordered byte-string fields unambiguously before computing a message authentication code.",reason:"Reject ambiguous concatenation, delimiter collision and order erasure in a signing protocol.",prerequisites:["MAC input framing (advanced)","Binary strings","Field boundaries and ordering"],assumptions:["Each input is an arbitrary byte string shorter than 2^32 bytes. Field order matters. The chosen encoding will be authenticated with HMAC afterward; this question tests the encoding, not hash collision resistance."],stem:"Different ordered field pairs must never produce the same encoded bytes. Which return expression gives an unambiguous framing for these bounded fields?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function frame(string $first, string $second): string
{
    return $first . $second;
}

$pairs = [
    [['ab', 'c'], ['a', 'bc']],
    [["a\\nb", 'c'], ['a', "b\\nc"]],
    [['x', 'y'], ['y', 'x']],
    [["\\xFF", 'x'], ["\\xFE", 'x']],
];

$collisions = [];

foreach ($pairs as [$left, $right]) {
    $collisions[] = frame(...$left) === frame(...$right);
}

echo json_encode($collisions);
`}],options:[o("lengths","pack('N', strlen($first)) . $first . pack('N', strlen($second)) . $second","Fixed-width byte lengths identify each boundary, and the original field order is retained.",null),o("json-substitute","json_encode([$first, $second], JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR)","Distinct invalid UTF-8 bytes can both become U+FFFD, so this loses byte identity.","Assuming JSON with UTF-8 substitution preserves arbitrary binary fields."),o("newline","$first . \"\\n\" . $second","A newline within a field can collide with the separator, as the second pair demonstrates.","Using a delimiter without escaping or restricting field contents."),o("sorted","min($first, $second) . ':' . max($first, $second)","Sorting erases the required field order; x/y and y/x collide.","Confusing canonical ordering of an unordered set with encoding an ordered tuple.")],key:"lengths",explanation:"An unambiguous MAC input must preserve field boundaries and order. A fixed-width length prefix followed by that many bytes provides a unique parse for each bounded field.",trace:"The witnesses include ambiguous raw boundaries, embedded delimiters, reversed fields and distinct invalid UTF-8 bytes. The delimiter, sorting and substitution alternatives each lose a required distinction; binary length prefixes preserve all four pairs.",validation:{"kind":"patch","marker":"$first . $second","stdout":"[false,false,false,false]"},references:["https://www.php.net/manual/en/function.pack.php","https://www.php.net/manual/en/function.hash-hmac.php"],revision:2}),
q({id:'PHP-E26-0079',revision:2,format:'I',level:'A',topic:16,subtopic:'transactional-outbox-durable-intent',objective:'Choose a PHP persistence workflow that atomically records business changes and a durable publication intent.',reason:'Account for crash windows across a database transaction and a separate message broker without a distributed transaction.',prerequisites:['PDO transactions','Database/broker crash recovery (advanced)','Idempotent consumers'],assumptions:['The PHP service uses one transactional database and a separate broker, with no distributed transaction. One database transaction can write multiple tables. An independent worker can read committed database records and retry broker operations. Consumers deduplicate repeated event IDs. Either the request process or worker can crash between operations.'],stem:"A committed order must eventually be notified to the broker after recovery, and an order that rolls back must never be notified. Which implementation preserves both requirements across a process crash?",options:[o('publish-before','Publish to the broker first, then begin and commit the order transaction.','A later database failure can leave a notification for an order that never committed.','Assuming broker success can be rolled back with an unrelated database transaction.'),o('commit-publish','Commit the order, then publish synchronously before returning the HTTP response.','A crash after commit but before publish loses the notification intent.','Treating request sequencing as durable atomic coordination.'),o('outbox','Write the order and outbox event in one transaction; let a retrying worker publish the event.','The committed outbox record durably retains the publication intent across process crashes.'),o('shutdown','Commit the order and register a shutdown callback that publishes the event.','A callback in process memory is not durable and may not run after a crash.','Treating a shutdown hook as a persistent job queue.')],key:'outbox',explanation:'The database transaction can make the order and publication intent atomic. The worker bridges to the broker with retries, while event IDs and consumer deduplication handle duplicate delivery.',trace:'Before commit, neither record is durable. After commit, both exist. A crash before or after publishing leaves enough durable state for retry; duplicate publication is within the stated contract.',validation:{kind:'document-review',rule:'Atomic order/outbox commit closes the lost-intent crash window; broker publication remains at least once, not exactly once.',optionAudit:{'publish-before':'Can publish an event for rolled-back work','commit-publish':'Crash gap after commit loses intent',outbox:'Durable same-transaction intent plus retry meets the stated contract',shutdown:'Process-memory callback is not crash-durable'}},references:['https://www.php.net/manual/en/pdo.transactions.php','https://microservices.io/patterns/data/transactional-outbox.html'] }),
q({id:'PHP-E26-0080',format:'I',level:'A',topic:22,subtopic:'fiber-cancellation-exception-injection',objective:'Cancel a suspended Fiber through its exception path while allowing its finally cleanup to execute.',reason:'Distinguish resuming with a value, throwing in the caller and injecting a throwable at the suspension point.',prerequisites:['Fibers (advanced)','Exception injection','finally'],stem:'The suspended worker handles DomainException as cancellation and records cleanup in finally. Which driver statement produces exactly ["cancelled","released"] before the final echo?',files:[file(`$trace = [];
$worker = new Fiber(function () use (&$trace): void {
    try {
        Fiber::suspend('ready');
        $trace[] = 'completed';
    } catch (DomainException $error) {
        $trace[] = 'cancelled';
    } finally {
        $trace[] = 'released';
    }
});

$worker->start();

try {
    $worker->resume(null);
} catch (DomainException $error) {
    $trace[] = 'outside';
}

echo json_encode($trace);`)],options:[o('resume-error',"$worker->resume(new DomainException('cancel'));",'resume supplies a normal value as the return of suspend; it does not throw that value.','Assuming passing an exception object automatically throws it.'),o('inject',"$worker->throw(new DomainException('cancel'));",'Fiber::throw throws at the suspension point, reaching the worker’s catch and finally.'),o('outer-throw',"throw new DomainException('cancel');",'This throws in the driver, so the outer catch runs while the worker remains suspended.','Assuming a caller’s exception is automatically delivered to its suspended Fiber.'),o('null-resume','$worker->resume(null);','The worker resumes normally and records completed before cleanup.','Treating null as an implicit cancellation signal.')],key:'inject',explanation:'Fiber::throw resumes a suspended Fiber by throwing inside it at the suspension point. resume merely sends a value, and a caller-side throw remains on the caller’s stack.',trace:'The injected DomainException reaches the worker’s catch, which records cancelled. Its finally then records released.',validation:{kind:'patch',marker:'$worker->resume(null);',stdout:'["cancelled","released"]'},references:['https://www.php.net/manual/en/fiber.throw.php'] }),
q({id:"PHP-E26-0081",format:"T",level:"M",topic:23,subtopic:"filtered-list-json-shape-regression",objective:"Choose a test that exposes loss of JSON list shape after filtering preserves numeric keys.",reason:"Relate removal position to PHP array keys and JSON array/object encoding.",prerequisites:["array_filter","JSON list encoding","Regression tests"],lessons:[4],coverageComplete:false,stem:"encodePositive must return a JSON array containing the positive values in order. Which test fails for this implementation by comparing the returned JSON?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function encodePositive(array $values): string
{
    $positive = array_filter($values, fn ($value) => $value > 0);

    return json_encode($positive);
}
`}],options:[o("all-kept","encodePositive([1, 2]) should equal [1,2].","No key is removed, so the array remains a list and the test passes.","Testing only the path that preserves the original key sequence."),o("first-removed","encodePositive([-1, 2]) should equal [2].","The surviving key is 1, so the current implementation encodes an object instead of the required list.",null),o("last-removed","encodePositive([1, -2]) should equal [1].","The surviving key is 0, which is still a valid one-element list.","Assuming every removal creates a key gap."),o("all-removed","encodePositive([-1, -2]) should equal [].","An empty PHP array encodes as an empty JSON array, so this case passes.","Assuming an empty filtered array necessarily encodes as an object.")],key:"first-removed",explanation:"Filtering preserves keys. A leading removal leaves a nonzero starting key, exposing the distinction between a PHP array and a sequential list.",trace:"The failing result is {\"1\":2}. Reindexing with array_values before encoding produces [2].",validation:{"kind":"tests","marker":"json_encode($positive)","repair":"json_encode(array_values($positive))","cases":[{"option":"all-kept","probe":"echo encodePositive([1, 2]);","expected":"[1,2]"},{"option":"first-removed","probe":"echo encodePositive([-1, 2]);","expected":"[2]"},{"option":"last-removed","probe":"echo encodePositive([1, -2]);","expected":"[1]"},{"option":"all-removed","probe":"echo encodePositive([-1, -2]);","expected":"[]"}]},references:["https://www.php.net/manual/en/function.array-filter.php","https://www.php.net/manual/en/function.json-encode.php"],revision:2}),
q({id:"PHP-E26-0082",format:"T",level:"M",topic:23,subtopic:"secondary-sort-regression-fixture",objective:"Select a fixture that verifies the secondary ordering requirement of a comparator.",reason:"Distinguish primary-key ordering from tie-breaking while accounting for stable equal comparisons.",prerequisites:["usort","Stable sorting","Comparator tie-breakers"],lessons:[4,8],coverageComplete:false,stem:"Rows must sort by ascending score, then ascending ASCII name. Which test fails against the implementation? Each row below is written as [score, name].",files:[{path:"main.php",kind:"complete-file",source:`<?php

function ordered(array $rows): array
{
    usort($rows, function (array $left, array $right): int {
        return $left[0] <=> $right[0];
    });

    return $rows;
}
`}],options:[o("distinct-desc","[[2,\"B\"],[1,\"A\"]] should become [[1,\"A\"],[2,\"B\"]].","Different scores are correctly ordered by the existing comparator.","Testing only the primary ordering key."),o("tie-ordered","[[1,\"A\"],[1,\"B\"]] should remain in that order.","Equal-score rows retain their existing order, which already satisfies the name rule.","Using a tie fixture that masks the missing secondary comparison."),o("opposite-names","[[1,\"Z\"],[2,\"A\"]] should remain in that order.","Score takes priority, so the existing result is correct despite the name order.","Expecting the secondary key to override distinct primary values."),o("tie-reversed","[[1,\"B\"],[1,\"A\"]] should become [[1,\"A\"],[1,\"B\"]].","The comparator returns zero and preserves the wrong B/A order, exposing the missing tie-breaker.",null)],key:"tie-reversed",explanation:"To test a secondary sort key, use equal primary keys in an order that contradicts the secondary requirement. Already ordered ties cannot expose the defect.",trace:"The corrected comparator uses the score comparison first and strcmp on names only when scores tie.",validation:{"kind":"tests","marker":"return $left[0] <=> $right[0];","repair":"return ($left[0] <=> $right[0]) ?: strcmp($left[1], $right[1]);","cases":[{"option":"distinct-desc","probe":"echo json_encode(ordered([[2,\"B\"],[1,\"A\"]]));","expected":"[[1,\"A\"],[2,\"B\"]]"},{"option":"tie-ordered","probe":"echo json_encode(ordered([[1,\"A\"],[1,\"B\"]]));","expected":"[[1,\"A\"],[1,\"B\"]]"},{"option":"opposite-names","probe":"echo json_encode(ordered([[1,\"Z\"],[2,\"A\"]]));","expected":"[[1,\"Z\"],[2,\"A\"]]"},{"option":"tie-reversed","probe":"echo json_encode(ordered([[1,\"B\"],[1,\"A\"]]));","expected":"[[1,\"A\"],[1,\"B\"]]"}]},references:["https://www.php.net/manual/en/function.usort.php"],revision:2}),
q({id:'PHP-E26-0083',format:'T',level:'M',topic:23,subtopic:'memoized-null-negative-cache-test',objective:'Select a test that distinguishes cached null from a missing cache entry.',reason:'Observe collaborator call counts as well as returned values for repeated misses.',prerequisites:['Closures','isset versus array_key_exists','Test doubles'],lessons:[4,7],coverageComplete:false,stem:'The loader returns null for missing keys and ok for present. cached must call it at most once per distinct key, including missing keys. Which test exposes the defect?',files:[file(`function scenario(array $keys): int
{
    $calls = 0;
    $load = function (string $key) use (&$calls): ?string {
        $calls++;

        return $key === 'present' ? 'ok' : null;
    };
    $cache = [];
    $cached = function (string $key) use (&$cache, $load): ?string {
        if (!isset($cache[$key])) {
            $cache[$key] = $load($key);
        }

        return $cache[$key];
    };

    foreach ($keys as $key) {
        $cached($key);
    }

    return $calls;
}`)],options:[o('same-miss','scenario(["missing", "missing"]) should return 1.','A stored null fails isset, so the second call reloads the same key and returns a call count of 2.'),o('same-hit','scenario(["present", "present"]) should return 1.','The cached non-null value passes isset and avoids the second load.','Testing only positive cache entries.'),o('different-misses','scenario(["one", "two"]) should return 2.','Different keys require separate loads regardless of the null-cache defect.','Using distinct misses without checking reuse of one miss.'),o('single-miss','scenario(["missing"]) should return 1.','A first lookup always needs one load; there is no reuse to test.','Checking only the initial cache population.')],key:'same-miss',explanation:'A null result can be a valid cache entry. isset cannot distinguish it from absence, so the regression test must repeat the same missing key and inspect loader calls.',trace:'Replacing the guard with array_key_exists preserves the cached null and reduces the repeated-miss call count from 2 to 1.',validation:{kind:'tests',marker:'!isset($cache[$key])',repair:'!array_key_exists($key, $cache)',cases:[{option:'same-miss',probe:'echo scenario(["missing", "missing"]);',expected:'1'},{option:'same-hit',probe:'echo scenario(["present", "present"]);',expected:'1'},{option:'different-misses',probe:'echo scenario(["one", "two"]);',expected:'2'},{option:'single-miss',probe:'echo scenario(["missing"]);',expected:'1'}]},references:['https://www.php.net/manual/en/function.array-key-exists.php','https://www.php.net/manual/en/function.isset.php'] }),
q({id:"PHP-E26-0084",format:"T",level:"M",topic:23,subtopic:"utf8-prefix-character-count-test",objective:"Choose a UTF-8 fixture that distinguishes byte-based slicing from a two-code-point prefix.",reason:"Count encoded bytes and code points without relying on display appearance alone.",prerequisites:["UTF-8","substr versus mb_substr","Hexadecimal bytes"],extensions:["mbstring"],stem:"prefix must return up to two Unicode code points from valid UTF-8. These examples contain no combining marks. Which test fails against the implementation? é is encoded as C3 A9.",files:[{path:"main.php",kind:"complete-file",source:`<?php

function prefix(string $text): string
{
    return substr($text, 0, 2);
}
`}],options:[o("ascii","prefix(\"ABC\") should equal \"AB\".","ASCII code points each occupy one byte, so this passes both implementations.","Using only single-byte text to test Unicode slicing."),o("one-multibyte","prefix(\"é\") should equal \"é\".","The complete one-code-point input is exactly two bytes, so it also passes.","Assuming every non-ASCII fixture distinguishes the implementations."),o("mixed","prefix(\"éX\") should equal \"éX\".","The first two bytes contain only é; the required two-code-point prefix also includes X.",null),o("empty","prefix(\"\") should equal \"\".","Both implementations preserve empty input.","Testing the empty boundary without testing character-width behavior.")],key:"mixed",explanation:"substr counts bytes. A two-code-point prefix can require more than two bytes, so the fixture must cross that byte/character boundary.",trace:"The buggy prefix is C3 A9. mb_substr with UTF-8 returns C3 A9 58, retaining the second code point X.",validation:{"kind":"tests","marker":"substr($text, 0, 2)","repair":"mb_substr($text, 0, 2, 'UTF-8')","cases":[{"option":"ascii","probe":"echo bin2hex(prefix(\"ABC\"));","expected":"4142"},{"option":"one-multibyte","probe":"echo bin2hex(prefix(\"é\"));","expected":"c3a9"},{"option":"mixed","probe":"echo bin2hex(prefix(\"éX\"));","expected":"c3a958"},{"option":"empty","probe":"echo bin2hex(prefix(\"\"));","expected":""}]},references:["https://www.php.net/manual/en/function.substr.php","https://www.php.net/manual/en/function.mb-substr.php"],revision:2}),
q({id:"PHP-E26-0085",format:"T",level:"M",topic:14,subtopic:"canonical-path-directory-boundary-test",objective:"Test a canonical path’s directory boundary rather than only its textual prefix.",reason:"Construct a sibling path that shares the root’s character prefix but is outside its directory.",prerequisites:["Path containment","str_starts_with","Security regression tests"],lessons:[20],coverageComplete:false,assumptions:["Inputs are already canonical absolute POSIX file paths with no symlinks, dot segments or trailing slash. This pure string check is one stage of a larger access policy; it performs no filesystem operations."],stem:"inside must accept only descendants of /srv/files/. Which test fails against the implementation?",files:[{path:"main.php",kind:"complete-file",source:`<?php

function inside(string $candidate): bool
{
    $root = '/srv/files';

    return str_starts_with($candidate, $root);
}
`}],options:[o("direct","inside(\"/srv/files/report.pdf\") should be true.","A direct descendant passes both the correct and flawed checks.","Testing only an authorized path."),o("sibling","inside(\"/srv/files-backup/report.pdf\") should be false.","This sibling directory shares the textual prefix and is wrongly accepted.",null),o("other","inside(\"/srv/other/report.pdf\") should be false.","This path does not share the prefix, so the flawed check rejects it correctly.","Choosing an outside path that does not exercise the boundary defect."),o("nested","inside(\"/srv/files/nested/report.pdf\") should be true.","Nested descendants are valid and pass either implementation.","Assuming deeper nesting alone exposes a prefix-boundary error.")],key:"sibling",explanation:"A directory name is a path segment, not just a string prefix. Appending the separator to the canonical root prevents similarly named sibling directories from passing.",trace:"The flawed check accepts /srv/files-backup. Requiring the prefix /srv/files/ rejects it while accepting both valid descendants.",validation:{"kind":"tests","marker":"str_starts_with($candidate, $root)","repair":"str_starts_with($candidate, $root . '/')","cases":[{"option":"direct","probe":"echo json_encode(inside(\"/srv/files/report.pdf\"));","expected":"true"},{"option":"sibling","probe":"echo json_encode(inside(\"/srv/files-backup/report.pdf\"));","expected":"false"},{"option":"other","probe":"echo json_encode(inside(\"/srv/other/report.pdf\"));","expected":"false"},{"option":"nested","probe":"echo json_encode(inside(\"/srv/files/nested/report.pdf\"));","expected":"true"}]},references:["https://www.php.net/manual/en/function.realpath.php","https://www.php.net/manual/en/function.str-starts-with.php"],revision:2}),
q({id:'PHP-E26-0086',format:'T',level:'M',topic:23,subtopic:'aggregate-reset-state-transition-test',objective:'Verify that resetting an accumulator clears all state needed for subsequent calculations.',reason:'Test reuse after a state transition rather than only fresh-object results.',prerequisites:['Object state','Average calculation','Stateful tests'],lessons:[23],coverageComplete:false,stem:'After reset, Average must behave like a fresh instance. Which test exposes the incomplete reset?',files:[file(`class Average
{
    private int $sum = 0;
    private int $count = 0;

    public function add(int $value): void
    {
        $this->sum += $value;
        $this->count++;
    }

    public function reset(): void
    {
        $this->sum = 0;
    }

    public function value(): ?float
    {
        return $this->count === 0 ? null : $this->sum / $this->count;
    }
}`)],options:[o('fresh','A fresh instance should return null.','Both implementations start with count zero.','Testing construction instead of reset.'),o('one-add','Add 8 to a fresh instance; value should be 8.','No reset occurs, so sum and count agree.','Testing only normal accumulation.'),o('two-adds','Add 4 and 8 to a fresh instance; value should be 6.','The count is correctly incremented by add in both implementations.','Testing multiple inputs without exercising the reset transition.'),o('reuse','Add 8; reset; add 6; value should be 6.','The stale count becomes 2, so the buggy result is 3 rather than 6.')],key:'reuse',explanation:'Reset clears sum but leaves count behind. A reuse test must first create nonzero state, reset it, and then perform another calculation.',trace:'The repaired reset also sets count to zero. The next add produces sum 6 and count 1, giving 6.',validation:{kind:'tests',marker:'$this->sum = 0;',repair:'$this->sum = 0;\n        $this->count = 0;',cases:[{option:'fresh',probe:'$average = new Average(); echo json_encode($average->value());',expected:'null'},{option:'one-add',probe:'$average = new Average(); $average->add(8); echo $average->value();',expected:'8'},{option:'two-adds',probe:'$average = new Average(); $average->add(4); $average->add(8); echo $average->value();',expected:'6'},{option:'reuse',probe:'$average = new Average(); $average->add(8); $average->reset(); $average->add(6); echo $average->value();',expected:'6'}]},references:['https://www.php.net/manual/en/language.oop5.properties.php'] }),
q({id:'PHP-E26-0087',format:'T',level:'M',topic:11,subtopic:'head-representation-length-test',objective:'Verify that a HEAD response omits body bytes while retaining the corresponding GET representation length.',reason:'Separate transmitted content from representation metadata under an explicit response contract.',prerequisites:['HTTP GET and HEAD','Content-Length','Response tests'],lessons:[12],coverageComplete:false,assumptions:['The response representation is the supplied ASCII body, with no compression or transfer coding. The function’s contract requires Content-Length to equal the corresponding GET body length even for HEAD.'],stem:'Which test exposes the incorrect Content-Length computation?',files:[file(`function response(string $method, string $body): array
{
    $sent = $method === 'HEAD' ? '' : $body;

    return [strlen($sent), $sent];
}`)],options:[o('head-content','response("HEAD", "abc") should return [3, ""].','The current function computes zero from the omitted body instead of the representation length.'),o('get-content','response("GET", "abc") should return [3, "abc"].','GET sends the same body whose length is measured, so this passes.','Testing only GET behavior.'),o('head-empty','response("HEAD", "") should return [0, ""].','An empty representation has zero length either way, masking the error.','Choosing a HEAD fixture whose representation is already empty.'),o('get-empty','response("GET", "") should return [0, ""].','Both implementations agree for an empty GET representation.','Testing an empty boundary without separating sent bytes from representation bytes.')],key:'head-content',explanation:'A HEAD response has no body, but a Content-Length field, when supplied, describes the corresponding GET representation. Measure the representation before suppressing its transmission.',trace:'Replacing strlen(sent) with strlen(body) retains length 3 while the transmitted body stays empty.',validation:{kind:'tests',marker:'strlen($sent)',repair:'strlen($body)',cases:[{option:'head-content',probe:'echo json_encode(response("HEAD", "abc"));',expected:'[3,""]'},{option:'get-content',probe:'echo json_encode(response("GET", "abc"));',expected:'[3,"abc"]'},{option:'head-empty',probe:'echo json_encode(response("HEAD", ""));',expected:'[0,""]'},{option:'get-empty',probe:'echo json_encode(response("GET", ""));',expected:'[0,""]'}]},references:['https://www.rfc-editor.org/rfc/rfc9110.html#section-8.6','https://www.rfc-editor.org/rfc/rfc9110.html#section-9.3.2'] }),
q({id:"PHP-E26-0088",format:"T",level:"M",topic:10,subtopic:"pre-read-eof-empty-file-test",objective:"Choose a fixture that exposes processing a failed read as a real line.",reason:"Distinguish a pre-read EOF flag from the result of the next read, especially for an empty stream.",prerequisites:["fgets","feof","Stream tests"],lessons:[20],coverageComplete:true,assumptions:["The memory stream is seekable and every setup operation succeeds. The function should return one string per successfully read line, removing only CR and LF line endings."],stem:"readLines must return no lines for an empty stream. Which test fails against the implementation? The quoted inputs use \\n to denote a newline.",files:[{path:"main.php",kind:"complete-file",source:`<?php

function readLines(string $contents): array
{
    $handle = fopen('php://memory', 'w+');
    fwrite($handle, $contents);
    rewind($handle);
    $lines = [];

    while (!feof($handle)) {
        $line = fgets($handle);
        $lines[] = rtrim((string) $line, "\\r\\n");
    }

    fclose($handle);

    return $lines;
}
`}],options:[o("one-line","readLines(\"abc\") should return [\"abc\"].","The successful unterminated read reaches EOF, so no extra iteration occurs.","Assuming any nonempty file exposes the pre-read EOF problem."),o("two-lines","readLines(\"a\\nb\") should return [\"a\",\"b\"].","The final unterminated line reaches EOF during its successful read.","Testing multiple lines without a failing read being processed."),o("empty","readLines(\"\") should return [].","Before the first read, EOF has not yet been detected; the failed fgets is cast to an empty string and appended.",null),o("zero","readLines(\"0\") should return [\"0\"].","The code does not test the line’s truthiness, so the valid zero string is retained.","Confusing a pre-read EOF defect with a truthiness-based line-reading defect.")],key:"empty",explanation:"feof describes whether EOF has been detected, not whether the next read will return a line. Test fgets itself and append only successful reads.",trace:"The empty-stream read returns false. The original casts it to an empty string and returns [\"\"]. The repaired loop stops before appending anything.",validation:{"kind":"tests","marker":"while (!feof($handle)) {\n        $line = fgets($handle);","repair":"while (($line = fgets($handle)) !== false) {","cases":[{"option":"one-line","probe":"echo json_encode(readLines(\"abc\"));","expected":"[\"abc\"]"},{"option":"two-lines","probe":"echo json_encode(readLines(\"a\\nb\"));","expected":"[\"a\",\"b\"]"},{"option":"empty","probe":"echo json_encode(readLines(\"\"));","expected":"[]"},{"option":"zero","probe":"echo json_encode(readLines(\"0\"));","expected":"[\"0\"]"}]},references:["https://www.php.net/manual/en/function.feof.php","https://www.php.net/manual/en/function.fgets.php"],revision:2}),
q({id:"PHP-E26-0089",format:"T",level:"M",topic:22,subtopic:"iteratoraggregate-repeatable-traversal-test",objective:"Test repeated traversal of an IteratorAggregate that incorrectly caches a one-shot Generator.",reason:"Distinguish multiple aggregate traversals from a single traversal or separate instances.",prerequisites:["IteratorAggregate","Generator lifecycle","Repeatability tests"],stem:"Items promises a fresh traversal on every getIterator call. Which test fails against the implementation?",files:[{path:"main.php",kind:"complete-file",source:`<?php

class Items implements IteratorAggregate
{
    private Generator $iterator;

    public function __construct(private array $values)
    {
        $this->iterator = $this->fresh();
    }

    private function fresh(): Generator
    {
        yield from $this->values;
    }

    public function getIterator(): Traversable
    {
        return $this->iterator;
    }
}

function readItems(Items $items): array|string
{
    try {
        return iterator_to_array($items, false);
    } catch (Exception $error) {
        return 'closed';
    }
}
`}],options:[o("one-pass","Read Items([1,2]) once; expect [1,2].","The initial Generator is open, so the first traversal succeeds.","Testing only first-use behavior."),o("same-instance","Read the same Items([1]) twice; expect [[1],[1]].","The second traversal tries to reuse the exhausted Generator and produces closed.",null),o("two-instances","Read two separate Items([1]) instances once each; expect [[1],[1]].","Each instance owns a different fresh Generator, so this passes.","Replacing reuse of one aggregate with independent construction."),o("empty-once","Read Items([]) once; expect [].","A single empty traversal succeeds and does not test reuse.","Assuming an empty traversal alone checks repeatability.")],key:"same-instance",explanation:"An IteratorAggregate can provide repeatable traversal by constructing a new iterator for each request. Caching a Generator instead caches one consumable traversal.",trace:"Returning fresh() from getIterator makes both reads of the same aggregate independently yield 1.",validation:{"kind":"tests","marker":"return $this->iterator;","repair":"return $this->fresh();","cases":[{"option":"one-pass","probe":"echo json_encode(readItems(new Items([1,2])));","expected":"[1,2]"},{"option":"same-instance","probe":"$items = new Items([1]); echo json_encode([readItems($items), readItems($items)]);","expected":"[[1],[1]]"},{"option":"two-instances","probe":"echo json_encode([readItems(new Items([1])), readItems(new Items([1]))]);","expected":"[[1],[1]]"},{"option":"empty-once","probe":"echo json_encode(readItems(new Items([])));","expected":"[]"}]},references:["https://www.php.net/manual/en/class.iteratoraggregate.php","https://www.php.net/manual/en/class.generator.php"],revision:2}),
q({id:"PHP-E26-0090",revision:2,format:"T",level:"M",topic:20,subtopic:"custom-handler-suppression-mask-test",objective:"Verify that a custom error handler respects the currently enabled severity mask, including suppression.",reason:"Select a suppression case that distinguishes handler invocation from the enabled severity mask.",prerequisites:["Custom error handlers","Error severity masks","@ behavior in PHP 8"],lessons:[21],coverageComplete:false,stem:"The handler must record only severities enabled by error_reporting at the moment it runs. Each test begins with E_ALL. Which test fails against the implementation?",files:[{path:"main.php",kind:"complete-file",source:`<?php

$recorded = [];

set_error_handler(function (int $severity, string $message) use (&$recorded): bool {
    if (true) {
        $recorded[] = $message;
    }

    return true;
});
`}],options:[o("warning","Trigger one unsuppressed E_USER_WARNING; expect one record.","That severity is enabled under E_ALL, so recording it is correct.","Testing only enabled diagnostics."),o("notice","Trigger one unsuppressed E_USER_NOTICE; expect one record.","The notice is also enabled and should be recorded.","Changing severity without changing whether it is enabled."),o("suppressed","Trigger E_USER_WARNING with @; expect zero records.","The custom handler is still called, but the warning bit is disabled in the effective reporting mask.",null),o("two-warnings","Trigger two unsuppressed E_USER_WARNING diagnostics; expect two records.","Both enabled warnings should be recorded, so this does not expose suppression handling.","Testing repetition rather than reporting policy.")],key:"suppressed",explanation:"A custom handler may be invoked even for a suppressed diagnostic. It must inspect error_reporting() & severity if it promises to respect the effective mask; testing only whether the mask is zero is insufficient in modern PHP.",trace:"The repair records a message only when its severity bit is enabled. The suppressed-warning candidate then records zero messages.",validation:{"kind":"tests","marker":"if (true)","repair":"if ((error_reporting() & $severity) !== 0)","cases":[{"option":"warning","probe":"trigger_error('one', E_USER_WARNING); restore_error_handler(); echo count($recorded);","expected":"1"},{"option":"notice","probe":"trigger_error('one', E_USER_NOTICE); restore_error_handler(); echo count($recorded);","expected":"1"},{"option":"suppressed","probe":"@trigger_error('one', E_USER_WARNING); restore_error_handler(); echo count($recorded);","expected":"0"},{"option":"two-warnings","probe":"trigger_error('one', E_USER_WARNING); trigger_error('two', E_USER_WARNING); restore_error_handler(); echo count($recorded);","expected":"2"}]},references:["https://www.php.net/manual/en/function.set-error-handler.php","https://www.php.net/manual/en/language.operators.errorcontrol.php"]}),
q({id:'PHP-E26-0091',format:'T',level:'A',topic:17,subtopic:'cloned-owned-stream-lifetime-test',objective:'Test whether cloning an owning object creates independent stream ownership.',reason:'Follow shallow resource copying and destructor effects across two object lifetimes.',prerequisites:['Resource handles','clone','Destructors','Ownership contracts (advanced)'],lessons:[20,23],coverageComplete:false,stem:'Buffer promises that a clone owns an independent memory stream. Which test exposes the empty __clone implementation? valid reports whether that instance still has an open stream.',files:[file(`class Buffer
{
    private $stream;

    public function __construct()
    {
        $this->stream = fopen('php://memory', 'w+');
        fwrite($this->stream, 'abc');
        rewind($this->stream);
    }

    public function __clone(): void
    {
        // Clone the owned stream here.
    }

    public function valid(): bool
    {
        return is_resource($this->stream);
    }

    public function __destruct()
    {
        if (is_resource($this->stream)) {
            fclose($this->stream);
        }
    }
}`)],options:[o('destroy-copy','Clone a Buffer, unset the clone, then assert the original is still valid.','The clone’s destructor closes the shared resource, invalidating the original.'),o('fresh-valid','Construct a Buffer and assert it is valid.','Construction creates a valid stream; no ownership conflict has occurred.','Testing only initial resource acquisition.'),o('both-alive','Clone a Buffer and assert both instances are valid while both remain alive.','Both instances still reference the open shared resource, so this passes despite the ownership defect.','Checking validity without exercising independent lifetimes.'),o('separate-objects','Construct two Buffers, unset one, then assert the other is valid.','Separate construction already creates separate streams and does not exercise clone behavior.','Substituting independent construction for copying an owner.')],key:'destroy-copy',explanation:'Cloning an object copies its resource handle value; it does not duplicate the underlying stream. The failure appears when one supposed owner closes the resource while the other remains in use.',trace:'The repair creates a new memory stream, copies bytes and preserves position. Destroying the clone then closes only its own stream.',validation:{kind:'tests',marker:'// Clone the owned stream here.',repair:"$original = $this->stream;\n        $position = ftell($original);\n        $this->stream = fopen('php://memory', 'w+');\n        rewind($original);\n        stream_copy_to_stream($original, $this->stream);\n        fseek($original, $position);\n        fseek($this->stream, $position);",cases:[{option:'destroy-copy',probe:'$original = new Buffer(); $copy = clone $original; unset($copy); echo json_encode($original->valid());',expected:'true'},{option:'fresh-valid',probe:'$original = new Buffer(); echo json_encode($original->valid());',expected:'true'},{option:'both-alive',probe:'$original = new Buffer(); $copy = clone $original; echo json_encode($original->valid() && $copy->valid());',expected:'true'},{option:'separate-objects',probe:'$original = new Buffer(); $other = new Buffer(); unset($other); echo json_encode($original->valid());',expected:'true'}]},references:['https://www.php.net/manual/en/language.oop5.cloning.php','https://www.php.net/manual/en/function.fclose.php'] }),
q({id:'PHP-E26-0092',revision:2,format:'T',level:"F",topic:3,subtopic:'nan-comparator-reflexivity-test',objective:'Test comparator equality for two NaN values under an explicit total-order policy.',reason:"Trace the first matching branch against an explicitly stated equality requirement.",prerequisites:['NaN','is_nan','Comparator contracts'],stem:'The comparator’s policy is numeric ascending order, NaN after every non-NaN, and two NaNs equal for ordering. Which test exposes its defect?',files:[file(`function compare(float $left, float $right): int
{
    if (is_nan($left)) {
        return 1;
    }

    if (is_nan($right)) {
        return -1;
    }

    return $left <=> $right;
}`)],options:[o('nan-first','compare(NAN, 1.0) should return 1.','A NaN is correctly ordered after a non-NaN by the first branch.','Testing only one NaN operand.'),o('nan-second','compare(1.0, NAN) should return -1.','The second branch correctly places the finite value first.','Testing the reverse one-NaN case without checking equality.'),o('finite','compare(1.0, 2.0) should return -1.','The numeric comparison works for these finite values.','Testing only the ordinary numeric domain.'),o('two-nans','compare(NAN, NAN) should return 0.','The first branch returns 1 even when the right operand is also NaN, violating the stated equality policy.')],key:'two-nans',explanation:'A custom NaN ordering policy must explicitly handle the both-NaN case. Ordinary floating-point equality cannot be relied on because NaN is not equal to itself.',trace:'The corrected first branch returns zero if right is NaN, otherwise one. All other shown cases keep their existing results.',validation:{kind:'tests',marker:'return 1;',repair:'return is_nan($right) ? 0 : 1;',cases:[{option:'nan-first',probe:'echo compare(NAN, 1.0);',expected:'1'},{option:'nan-second',probe:'echo compare(1.0, NAN);',expected:'-1'},{option:'finite',probe:'echo compare(1.0, 2.0);',expected:'-1'},{option:'two-nans',probe:'echo compare(NAN, NAN);',expected:'0'}]},references:['https://www.php.net/manual/en/language.types.float.php','https://www.php.net/manual/en/function.is-nan.php'] }),
q({id:'PHP-E26-0093',format:'A',level:'M',topic:25,subtopic:'concurrent-worker-explicit-user-context',objective:'Keep per-job identity separate from shared services in a long-running concurrent PHP worker.',reason:'Follow the lifetime mismatch between a shared service and interleaved job-specific state.',prerequisites:['Dependency injection','Long-running workers','Cooperative concurrency'],assumptions:['One service instance handles interleaved Fiber jobs for different users. Operations may suspend. The authorization dependency is safe to share, but the current user is specific to each job.'],stem:'Every authorization check must use the calling job’s user even after suspension. Which design meets that requirement without serializing the worker?',options:[o('singleton-field','Assign currentUser on the shared service before each job and read it after each suspension.','Another job can replace the field while the first is suspended.','Treating a shared mutable field as job-local state.'),o('explicit-context','Pass an immutable user context to each operation, retained in that call’s local state.','Each suspended call retains its own context while sharing only the stateless authorization dependency.'),o('constructor-user','Capture the first job’s user in the shared service constructor for the worker’s lifetime.','Later jobs would inherit the first user’s identity.','Giving request-specific state the lifetime of a shared service.'),o('global-reset','Set a global current-user variable before each job and clear it in finally.','Interleaving jobs still overwrite or clear the same global while another call is suspended.','Assuming eventual cleanup prevents concurrent state contamination.')],key:'explicit-context',explanation:'Shared services and per-job identity have different lifetimes. Passing immutable context keeps identity in each call’s own state across suspension instead of a shared mutable location.',trace:'Job A retains context A on its stack. Job B uses context B. Resuming A does not require reading a field or global that B may have changed.',validation:{kind:'document-review',rule:'Given interleaved operations and shared mutable storage, job-specific values can be overwritten; separate immutable call contexts avoid that shared location.',optionAudit:{'singleton-field':'Interleaving overwrites the field','explicit-context':'Each call retains its own immutable identity','constructor-user':'One user is reused for later jobs','global-reset':'Interleaving still races through the global'}},references:['https://www.php.net/manual/en/language.fibers.php'] }),
q({id:'PHP-E26-0094',format:'A',level:'M',topic:24,subtopic:'psr7-request-middleware-propagation',objective:'Propagate an immutable PSR-7 request change to the downstream PSR-15 handler.',reason:'Identify which request instance crosses the middleware boundary.',prerequisites:['PSR-7 immutability','PSR-15 middleware'],assumptions:['request implements PSR-7 ServerRequestInterface; handler implements PSR-15 RequestHandlerInterface. actor is already authenticated. Downstream code reads the actor request attribute.'],stem:'Which middleware sequence makes actor available to the downstream handler?',options:[o('discard-return','Call request.withAttribute("actor", actor), discard its return, then handle the original request.','withAttribute returns a changed instance and leaves the original unchanged.','Treating a PSR-7 with-method as an in-place setter.'),o('after-handler','Handle the original request first, then call withAttribute on that request before returning the response.','The downstream handler has already run without the attribute.','Assuming a later request change can affect a completed downstream call.'),o('clone-discard','Clone the request, call withAttribute on the clone without retaining its return, then handle the clone.','Cloning does not change the immutable with-method contract; its returned instance is still discarded.','Assuming a clone makes immutable methods mutate in place.'),o('pass-result','Retain the instance returned by request.withAttribute("actor", actor), then handle that instance.','The modified request instance is the one passed downstream.')],key:'pass-result',explanation:'PSR-7 with-methods return a modified instance. Middleware must pass that returned request into the next handler for downstream code to observe the attribute.',trace:'The attribute is attached to the returned instance, which crosses the handler boundary. The original request remains unchanged.',validation:{kind:'document-review',rule:'PSR-7 ServerRequestInterface::withAttribute retains immutability; PSR-15 handler consumes the request passed to handle.',optionAudit:{'discard-return':'Original instance has no new attribute','after-handler':'Change occurs after consumption','clone-discard':'Changed instance is still discarded','pass-result':'Downstream receives the changed instance'}},references:['https://www.php-fig.org/psr/psr-7/#321-psrhttpmessageserverrequestinterface','https://www.php-fig.org/psr/psr-15/'] }),
q({id:'PHP-E26-0095',format:'A',level:'M',topic:20,subtopic:'logging-failure-preserve-primary-exception',objective:'Preserve the primary operation failure when best-effort logging can also throw.',reason:'Separate a required exception contract from an optional diagnostic side effect.',prerequisites:['Nested catches','Exception identity','Logging boundaries'],lessons:[21,22],coverageComplete:true,assumptions:['The operation throws an exception object original. The caller must receive that same object. Logging is best effort, may throw, and has a separate fallback diagnostic channel that does not throw.'],stem:'Which failure-handling design preserves the caller’s exception contract?',options:[o('guard-log','Attempt logging inside its own guarded try/catch, send logging failure to the fallback, then rethrow original.','The diagnostic failure is contained and the original exception object remains the propagated failure.'),o('finally-log','Rethrow original from catch and perform the unguarded logging call in finally.','A logging exception from finally replaces the directly propagated original.','Assuming finally cannot change a pending exception.'),o('wrap-logging','If logging fails, throw a new RuntimeException with original as previous.','The caller receives a new object rather than the exact original required by the contract.','Equating cause preservation with preservation of exception identity.'),o('boolean-fallback','If logging fails, return false; otherwise rethrow original.','The logging failure changes the operation’s exception contract into a boolean result.','Allowing optional diagnostics to choose the public failure channel.')],key:'guard-log',explanation:'Best-effort diagnostics must not determine the operation’s externally visible failure. Guard the logging side effect and rethrow the original object after either logging outcome.',trace:'If logging succeeds, original is rethrown. If logging fails, the fallback records that failure and original is still rethrown.',validation:{kind:'document-review',rule:'A nested catch can isolate a secondary throwable; throwing original preserves object identity, unlike wrapping or throwing from finally.',optionAudit:{'guard-log':'Both logging branches propagate the same original object','finally-log':'A secondary throwable can replace the primary','wrap-logging':'Caller receives a different object','boolean-fallback':'Caller receives a value rather than the required throwable'}},references:['https://www.php.net/manual/en/language.exceptions.php'] }),
q({id:'PHP-E26-0096',format:'A',level:'M',topic:19,subtopic:'composer-application-locked-production-install',objective:'Choose a reproducible production dependency workflow for a PHP application.',reason:'Distinguish dependency resolution from installation and retain platform compatibility checks.',prerequisites:['Composer lock files','Production dependencies','Platform requirements'],assumptions:['This is a deployable application, not a reusable library. Its reviewed composer.lock is committed. Production must use those locked versions, exclude require-dev packages and verify real runtime platform requirements.'],stem:'Which workflow satisfies these deployment constraints?',options:[o('update','Run composer update --no-dev on the production host for every release.','update resolves versions within constraints and may change the reviewed lock.','Treating update as an installation of already locked versions.'),o('ignore-platform','Run composer install --no-dev --ignore-platform-reqs from the committed lock.','This retains versions but deliberately bypasses required platform validation.','Solving installation failures by dropping a deployment guarantee.'),o('locked-install','Run composer install --no-dev from the committed lock, then composer check-platform-reqs --no-dev.','Installation uses locked versions and the check verifies the actual runtime platform without development packages.'),o('copy-development','Copy the developer’s entire vendor directory, including require-dev packages, into production.','The copied tree includes dependencies explicitly excluded by the stated production contract.','Treating a development working tree as the reviewed production dependency artifact.')],key:'locked-install',explanation:'For an application, the lock records the reviewed dependency resolution. install consumes it; update resolves again. Platform checks must examine the real deployment runtime rather than be bypassed.',trace:'The production install excludes require-dev. check-platform-reqs verifies the actual PHP and extension requirements of the installed production packages.',validation:{kind:'document-review',rule:'Composer install uses composer.lock; --no-dev excludes development requirements; check-platform-reqs checks the real platform.',optionAudit:{update:'Can choose new dependency versions','ignore-platform':'Bypasses platform requirements','locked-install':'Satisfies all three stated constraints','copy-development':'Includes excluded development packages'}},references:['https://getcomposer.org/doc/01-basic-usage.md#installing-from-composer-lock','https://getcomposer.org/doc/03-cli.md#check-platform-reqs'] }),
q({id:'PHP-E26-0097',format:'A',level:'M',topic:13,subtopic:'release-read-only-session-lock-before-work',objective:'Release a PHP session lock after reading authentication data and before long independent work.',reason:'Separate session access lifetime from the remainder of the HTTP request.',prerequisites:['PHP sessions','File session handler locking','Concurrent requests'],lessons:[19],coverageComplete:false,assumptions:['The configured file session handler holds an exclusive lock until session close. The request needs only a snapshot of user_id and will not modify session data afterward. A long calculation does not depend on keeping the session open.'],stem:'Requests from the same session currently wait behind the calculation. Which design permits their session access while this request continues calculating?',options:[o('regenerate','Regenerate the session ID, keep the session open, then perform the calculation.','ID rotation is not a deliberate release of the active session lock and also changes session identity unnecessarily.','Using session security rotation as a concurrency primitive.'),o('close-early','Read user_id into a local variable, call session_write_close, then perform the calculation.','Closing the session releases its lock while the local snapshot remains usable.'),o('clear-local','Copy user_id locally and unset $_SESSION, but leave the session active during calculation.','Clearing the PHP variable does not close the session or release the handler’s lock.','Confusing local variable removal with resource lifecycle completion.'),o('close-late','Perform the calculation, then call session_write_close immediately before returning.','The lock remains held for the entire slow operation.','Moving close slightly earlier without shortening the critical section that causes blocking.')],key:'close-early',explanation:'The lock protects active session access, not all work in the request. Once the needed values have been read and no later session writes are required, close the session before unrelated work.',trace:'The local user_id snapshot survives session_write_close. Other requests can then acquire the session lock during this request’s calculation.',validation:{kind:'document-review',rule:'session_write_close writes session data and ends the active session, releasing the file-handler lock under the stated configuration.',optionAudit:{regenerate:'Does not implement the required early session close','close-early':'Releases the lock before independent work','clear-local':'Does not end the session','close-late':'Retains the lock throughout the slow calculation'}},references:['https://www.php.net/manual/en/function.session-write-close.php'] }),
q({id:'PHP-E26-0098',revision:2,format:'A',level:"M",topic:14,subtopic:'authorization-cache-complete-decision-key',objective:'Choose a cache key that identifies every input to a tenant-scoped authorization decision.',reason:"Derive cache identity from per-tenant, per-user and per-resource policy differences and revision invalidation.",prerequisites:['Authorization caching','Tenant isolation','Versioned invalidation'],assumptions:['The cached action is always view. Resource IDs may repeat across tenants. Within a tenant, users sharing a role may have different overrides, and two resources of the same type may have different permissions. Every permission change increments a policy revision before further checks. Decisions are reused across requests, including requests using different HTTP methods.'],stem:'Which four-component key permits safe reuse under these assumptions?',options:[o('role-key','[tenantId, roleName, resourceId, policyRevision]','Users sharing a role may have different overrides, so their decisions cannot share this key.','Treating roles as complete user authorization identity.'),o('type-key','[tenantId, userId, resourceType, policyRevision]','Different resources of the same type may have different access decisions.','Replacing resource identity with its category.'),o('method-key','[tenantId, userId, resourceId, requestMethod]','Permission changes can reuse an old cached decision because the revision is absent.','Using request context as a substitute for authorization invalidation state.'),o('complete-key','[tenantId, userId, resourceId, policyRevision]','The key includes each stated decision input and changes when any of them changes.')],key:'complete-key',explanation:'A cached decision is valid only for the same authorization inputs. Tenant, user, resource and policy revision each distinguish cases that may legitimately have different outcomes.',trace:'Cross-tenant IDs remain separate; user overrides remain separate; resources remain separate; new policy revisions bypass earlier decisions.',validation:{kind:'document-review',rule:'Cache correctness requires identical keys to imply identical relevant inputs under the stated decision function.',optionAudit:{'role-key':'Conflates users with different overrides','type-key':'Conflates distinct resources','method-key':'Conflates old and new policies','complete-key':'Preserves all declared decision dimensions'}},references:['https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'] }),
q({id:'PHP-E26-0099',format:'A',level:'A',topic:16,subtopic:'unknown-commit-outcome-operation-identity',objective:'Recover from an ambiguous transaction commit without duplicating a logical operation.',reason:'Distinguish an unknown commit outcome from a confirmed rollback and use durable operation identity.',prerequisites:['PDO transactions','Connection failure','Idempotency records (advanced)'],assumptions:['The connection drops during commit, so the PHP caller cannot tell whether the database committed. Each transaction atomically stores its business changes and a result under a unique operation ID. Reconnecting to the authoritative database can resolve the old transaction before a lookup. Reusing the same operation ID is enforced by a unique constraint.'],stem:'Which recovery strategy avoids applying the logical operation twice while still recovering a committed result?',options:[o('rollback-new','Reconnect and call rollBack on the new connection, then retry under a new operation ID.','A new connection cannot roll back a transaction that may already have committed on the old connection.','Treating rollback as a global undo of an unknown prior commit.'),o('resolve-id','Resolve the old transaction; return its stored result or retry using the same operation ID.','The durable operation record distinguishes committed work, and stable identity prevents a second logical application.'),o('retry-new','Treat every commit exception as a rollback and repeat the operation with a new ID.','The first operation may already be committed, and a new ID bypasses duplicate protection.','Equating a missing acknowledgement with a failed commit.'),o('local-state','Inspect inTransaction on a new PDO connection and infer success if it returns false.','The new connection’s local state contains no evidence of the old transaction’s outcome.','Using fresh connection state as a transaction-history query.')],key:'resolve-id',explanation:'A communication failure during commit can leave the outcome unknown. Recovery must consult durable state tied to the same logical operation rather than assume rollback or create a new identity.',trace:'If the operation record exists, return its stored result. If the old transaction is resolved as uncommitted, retry with the same unique ID so later duplicate attempts cannot create a second operation.',validation:{kind:'document-review',rule:'Given ambiguous commit and atomic unique operation records, authoritative outcome resolution plus stable operation identity distinguishes success from retryable absence.',optionAudit:{'rollback-new':'Cannot undo a committed transaction on another connection','resolve-id':'Uses authoritative durable outcome and the same uniqueness boundary','retry-new':'Can duplicate committed work','local-state':'New connection state does not reveal old commit outcome'}},references:['https://www.php.net/manual/en/pdo.commit.php','https://www.postgresql.org/docs/current/libpq-status.html'] }),
q({id:'PHP-E26-0100',format:'A',level:'A',topic:24,subtopic:'streamed-response-late-failure-protocol',objective:'Design observable failure semantics for a streamed response after its HTTP headers are committed.',reason:'Reconcile bounded-memory streaming, irreversible output and application-level completion signaling.',prerequisites:['HTTP header commitment','Generators','Framed streaming protocols (advanced)'],assumptions:['A PHP endpoint emits newline-delimited JSON records with bounded memory and low first-record latency. The connection remains writable, but the producer can fail after records have been sent. Clients support a terminal success or error frame and treat a missing terminal frame as incomplete. Headers and prior bytes cannot be recalled.'],stem:'Which response design satisfies the stated streaming and failure requirements?',options:[o('terminal-frame','Validate what can be checked before starting, stream records, and emit a terminal error frame if a later producer failure occurs.','The agreed body protocol can report a late failure without pretending the already committed HTTP status can change.'),o('late-status','Stream records normally, then replace the HTTP status with 500 if a later exception occurs.','Once headers are committed, a later status change cannot replace what the client already received.','Treating response headers as mutable after transmission.'),o('buffer-all','Buffer the complete result in memory before sending any record or header.','This avoids late producer failures after output but violates both bounded memory and low first-record latency.','Solving failure semantics by discarding the required streaming properties.'),o('replace-body','After a late failure, clear the output buffer and send a fresh JSON error object instead of the earlier records.','Already transmitted bytes cannot be removed by clearing a later local buffer.','Treating local buffering as control over bytes already delivered to the client.')],key:'terminal-frame',explanation:'A streamed response cannot retroactively change sent headers or erase delivered records. A documented framing protocol can distinguish complete success, explicit failure and an incomplete connection.',trace:'Early validation can still choose an HTTP error before commitment. Later errors use the terminal error frame; clients reject partial data as a completed success.',validation:{kind:'document-review',rule:'Under committed headers and irreversible output, late outcome signaling must use the agreed body protocol or connection completion semantics; buffering all violates the explicit streaming constraints.',optionAudit:{'terminal-frame':'Meets the stated protocol, latency and memory requirements','late-status':'Cannot replace committed status','buffer-all':'Violates memory and first-record latency requirements','replace-body':'Cannot retract transmitted bytes'}},references:['https://www.php.net/manual/en/function.headers-sent.php','https://www.php.net/manual/en/function.ob-clean.php'] }),
];
