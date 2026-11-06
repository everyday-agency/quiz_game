import {q,file,output} from '../record.mjs';
export default [
q({n:541,type:'E',level:'F',sub:'collection-map-versus-transform-state',needs:['Collections','map','transform'],why:'Track which collection is changed by the transformation operation.',docs:['collections#method-map','collections#method-transform'],ask:'What is printed?',code:[file(String.raw`$original = collect([1, 2]);
$mapped = $original->map(fn ($value) => $value * 10);
$original->transform(fn ($value) => $value + 1);

echo $original->implode(',').':'.$mapped->implode(',');`)],choices:[['2,3:10,20','map returns a new collection; transform then replaces values in the original collection only.'],['11,21:10,20','This incorrectly assumes map had already changed the original to 10 and 20.'],['2,3:2,3','The mapped collection is not the same collection object as the original.'],['1,2:10,20','This ignores transform’s mutation of the original collection.']],test:output('2,3:10,20')}),
q({n:542,type:'D',level:'F',sub:'filtered-list-json-reindex',needs:['Collection filtering','Numeric keys','JSON arrays'],why:'Preserve a list-shaped API contract after filtering creates gaps in numeric keys.',docs:['collections#method-filter','collections#method-values'],ask:'After filtering [10,20,30] to values greater than 10, the collection retains keys 1 and 2. The API requires a JSON list, not a JSON object keyed by those indices. What should happen before serialization?',choices:[['Call values() to reindex the remaining items from zero.','values discards the retained numeric keys, yielding the consecutive list keys expected for JSON array encoding.'],['Call keys() and serialize that result as the data.','That returns the keys themselves and loses the remaining values.'],['Call reverse() and preserve its keys.','Changing item order does not necessarily repair the nonzero retained key sequence.'],['Convert the same keyed collection to an array without reindexing.','The key gap remains and can still cause JSON object encoding.']],test:output('{"1":20,"2":30}:[20,30]',String.raw`$items = collect([10, 20, 30])->filter(fn ($v) => $v > 10);
echo $items->toJson().':'.$items->values()->toJson();`)}),
q({n:543,type:'D',level:'F',sub:'collection-search-zero-key',needs:['Collection search','Strict false comparison'],why:'Distinguish a valid first numeric key from the search failure sentinel.',docs:['collections#method-search'],ask:'search("target") returns 0, but if (! $key) treats that as not found. Which check correctly distinguishes a missing item?',choices:[['$key === false','search returns false for failure; numeric key zero is a valid result and must be distinguished strictly.'],['$key == false','Loose comparison still equates zero with false.'],['empty($key)','empty also treats numeric zero as empty.'],['$key === null','The missing-value sentinel for this search is false, not null.']],test:output('found:missing',String.raw`$items = collect(['target', 'other']);
$key = $items->search('target');
echo ($key === false ? 'missing' : 'found').':';
echo $items->search('absent') === false ? 'missing' : 'found';`)}),
q({n:544,type:'I',sub:'collection-unique-strict-identifiers',needs:['Collection uniqueness','Scalar types','Loose comparison'],why:'Keep identifiers whose type is part of the contract from being collapsed by loose matching.',docs:['collections#method-unique','collections#method-uniquestrict'],ask:'The identifiers 7 and "7" are intentionally distinct in this input contract. Which collection operation removes exact duplicates while retaining both typed identifiers?',choices:[['uniqueStrict()->values()','Strict uniqueness keeps integer 7 distinct from string "7"; values only reindexes the result.'],['unique()->values()','Default loose uniqueness can collapse the integer and numeric string into one value.'],['map(fn ($id) => (string) $id)->unique()->values()','Converting both values to strings erases the type distinction before deduplication.'],['map(fn ($id) => (int) $id)->uniqueStrict()->values()','Converting both to integers also erases the distinction before strict comparison.']],test:output('[7,"7"]',String.raw`echo collect([7, '7', 7])->uniqueStrict()->values()->toJson();`)}),
q({n:545,type:'E',level:'F',sub:'collection-keyby-duplicate-last-wins',needs:['keyBy','Duplicate keys','Input order'],why:'Predict a keyed projection when more than one record has the same selected key.',docs:['collections#method-keyby'],ask:'Which name is stored under A after keyBy("code")?',code:[file(String.raw`$records = collect([
    ['code' => 'A', 'name' => 'first'],
    ['code' => 'B', 'name' => 'middle'],
    ['code' => 'A', 'name' => 'last'],
]);

echo $records->keyBy('code')['A']['name'];`)],choices:[['last','Each item is assigned to its selected key; a later duplicate key replaces the earlier value.'],['first','keyBy does not preserve the first duplicate by ignoring later items.'],['An array containing first and last','That would be grouping behavior rather than a single keyed value.'],['An exception for a duplicate collection key','keyBy overwrites the key rather than enforcing database-like uniqueness.']],test:output('last')}),
q({n:546,type:'E',sub:'collection-flatten-depth-boundary',needs:['Nested collections','Flatten depth'],why:'Apply one flattening level without discarding deeper structure.',docs:['collections#method-flatten'],ask:'What JSON does flatten(1) produce here?',code:[file(String.raw`echo collect([[1, 2], [3, [4]]])->flatten(1)->toJson();`)],choices:[['[1,2,3,[4]]','One level removes the outer nested arrays, but the array containing 4 remains one level deeper.'],['[1,2,3,4]','That fully flattens the nested value rather than stopping after one level.'],['[[1,2],[3,[4]]]','That leaves the input unchanged instead of flattening one level.'],['[1,2,[3,4]]','This preserves and changes different branches rather than applying the depth consistently.']],test:output('[1,2,3,[4]]')}),
q({n:547,type:'I',sub:'collection-partition-one-predicate-pass',needs:['Collection partition','Stateful predicates','Accepted and rejected sets'],why:'Classify each input once while retaining both groups.',docs:['collections#method-partition'],ask:'A predicate performs a time-sensitive check. The code needs both accepted and rejected items, with each item checked exactly once. Which collection operation fits?',choices:[['partition($predicate), yielding the passing and failing collections together.','partition classifies each item in one pass and retains both outcomes.'],['filter($predicate) followed by reject($predicate) on the original collection.','That evaluates the predicate twice per item and can observe different time-sensitive results.'],['filter($predicate) and use the same filtered collection for rejected items.','That loses the rejected set and mislabels the accepted items.'],['map($predicate) and use the resulting booleans as both item groups.','That replaces the items with boolean results rather than retaining the requested groups.']],test:output('2:1,3:3',String.raw`$calls = 0;
[$accepted, $rejected] = collect([1, 2, 3])->partition(function ($value) use (&$calls) {
    $calls++;
    return $value % 2 === 0;
});
echo $accepted->implode(',').':'.$rejected->implode(',').':'.$calls;`)}),
q({n:548,type:'E',sub:'lazy-collection-demand-driven-take',needs:['LazyCollection','Generators','Consumption'],why:'Trace source work before and during bounded consumption.',docs:['collections#lazy-collections'],ask:'What is printed by this lazy pipeline?',code:[file(String.raw`$yielded = 0;
$items = Illuminate\Support\LazyCollection::make(function () use (&$yielded) {
    for ($value = 1; $value <= 100; $value++) {
        $yielded++;
        yield $value;
    }
});

$firstTwo = $items->take(2);
echo $yielded.':';
echo $firstTwo->sum().':'.$yielded;`)],choices:[['0:3:2','Defining the pipeline does not iterate the source. Summing the first two values consumes only 1 and 2.'],['100:3:100','This treats lazy construction as eager materialization of all source values.'],['0:5050:100','take(2) limits the consumed values; sum does not ignore that stage.'],['2:3:2','take creates a lazy operation rather than consuming the two values immediately.']],test:output('0:3:2')}),
q({n:549,type:'E',sub:'collection-merge-union-string-key-precedence',needs:['Associative collections','merge','union'],why:'Choose the desired precedence when combining maps with colliding string keys.',docs:['collections#method-merge','collections#method-union'],ask:'What values are printed for mode?',code:[file(String.raw`$base = collect(['mode' => 'safe', 'limit' => 10]);
$incoming = ['mode' => 'fast'];

echo $base->merge($incoming)['mode'].':';
echo $base->union($incoming)['mode'];`)],choices:[['fast:safe','merge replaces a duplicate string key with the incoming value; union keeps the original collection’s value for that key.'],['safe:fast','This reverses the two operations’ key precedence.'],['fast:fast','union does not overwrite the existing string-key value.'],['safe:safe','merge does allow the incoming value to replace a duplicate string key.']],test:output('fast:safe')}),
q({n:550,type:'E',sub:'groupby-multiple-memberships',needs:['groupBy callback','Multiple group keys'],why:'Interpret an array-valued grouping callback as several memberships, not a serialized single key.',docs:['collections#method-groupby'],ask:'How many records appear in the author and editor groups?',code:[file(String.raw`$members = collect([
    ['name' => 'Ada', 'roles' => ['author', 'editor']],
    ['name' => 'Lin', 'roles' => ['author']],
]);

$groups = $members->groupBy(fn ($member) => $member['roles']);

echo $groups['author']->count().':'.$groups['editor']->count();`)],choices:[['2:1','An array of group keys places Ada in both groups and Lin in author.'],['1:1','This assumes each item can belong to only one returned group.'],['2:0','This assumes only the first role in each callback result is used.'],['An error because groupBy callbacks must always return a scalar key','The callback can return multiple keys to place an item into several groups.']],test:output('2:1')}),
];
