import {q,output} from '../record.mjs';
import {feature} from './fixture.mjs';
export const versionedCache=q({n:429,revision:2,type:'A',sub:'cache-fill-snapshot-version-identity',needs:['Cache-aside races','Committed version numbers','Snapshot identity'],why:'Follow an interleaving where a delayed old reader republishes data after a writer invalidates the cache.',docs:['cache#storing-items-in-the-cache','database#database-transactions'],assume:['Each committed product update increments its version. A result is labelled with the version of the snapshot used to calculate it. Readers select the current committed version before choosing its cache key; this question does not claim full linearizability across a later update.'],ask:'Reader R computes price from version 1. A writer commits version 2 and deletes the old plain-key cache entry. R then publishes its delayed version-1 result. Which scheme prevents that result from occupying the version-2 cache entry?',choices:[['Include the snapshot version in the cache key used for each fill and lookup.','R can publish only under version 1; a lookup selecting committed version 2 uses a different key.'],['Delete the same unversioned key just before the database commit instead.','R can still publish its old result after that deletion, recreating stale data under the active plain key.'],['Keep the unversioned key and shorten its TTL to one second.','A shorter stale interval does not prevent the delayed result from occupying that key.'],['Acquire a cache lock only in the writer, leaving cache-fill readers outside it.','A reader that does not participate in the lock can still publish its old result after invalidation.']],test:output('old:missing:new',String.raw`use Illuminate\Support\Facades\Cache;
$snapshotVersion = 1;
$snapshotPrice = 'old';
$currentVersion = 2;
Cache::forget('price:7');
Cache::put("price:7:v$snapshotVersion", $snapshotPrice, 60);
echo Cache::get('price:7:v1').':'.Cache::get("price:7:v$currentVersion", 'missing').':';
Cache::put("price:7:v$currentVersion", 'new', 60);
echo Cache::get("price:7:v$currentVersion");`)});
export const validationAssertions=q({n:475,revision:2,type:'T',level:'F',sub:'validation-assertion-response-aware',needs:['Feature validation assertions','JSON errors','Session error bags'],why:'Use one assertion contract across the two standard validation response representations.',docs:['http-tests#assert-invalid'],ask:'A reusable test helper receives either a JSON validation response or a standard web validation redirect with session errors. It must assert that name has a validation error in either case. Which assertion handles both representations?',choices:[['$response->assertInvalid(["name"])','assertInvalid selects JSON validation errors for a JSON response and the session error bag for a web response.'],['$response->assertJsonValidationErrors(["name"])','That assertion targets JSON validation data and does not cover a session-error redirect.'],['$response->assertSessionHasErrors(["name"])','That targets session errors rather than the JSON validation representation.'],['$response->assertStatus(422)','A status alone does not verify the name error, and the standard web path is a redirect.']],test:output('json:web',feature+String.raw`app('router')->post('/profile', function (Illuminate\Http\Request $request) {
    $request->validate(['name' => 'required']);
    return 'saved';
})->middleware('web');
$test->postJson('/profile', [])->assertInvalid(['name']);
echo 'json:';
$test->post('/profile', [])->assertInvalid(['name']);
echo 'web';`)});
