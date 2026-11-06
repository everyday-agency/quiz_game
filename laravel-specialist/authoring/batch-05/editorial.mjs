// Focused author review corrections. Prior materialized records are archived.
import assert from 'node:assert/strict';
export const corrections = {
404: [['Set the file extension', 'Set report to false and keep throw false.', 'Disabling reporting does not change a caught write failure into an exception for the caller.']],
410: [['The adapter can read', 'Append can read and rewrite the object; coordinate concurrent writers.', 'The adapter reads existing content and writes the combined result, so it does not promise atomic concurrent line appends.']],
411: [['POST the URL string', 'Upload with PUT but replace the returned signed headers with the browser’s defaults.', 'The correct method alone is insufficient when the signature requires particular header values.']],
413: [['Laravel creates a new disk', 'It returns false under every disk configuration without throwing.', 'Path normalization can reject traversal before the disk write error-return policy applies.']],
417: [['A null database result automatically', 'The null result is stored normally, but its TTL is always forced to zero.', 'The TTL need not be changed: remember treats a retrieved null as a miss even while that entry is retained.']],
420: [
 ['Laravel automatically synchronizes', 'Redis cache prefixes are discarded for all ordinary key reads and writes.', 'Ordinary key operations use prefixes; the broad flush operation is the exceptional scope being tested.'],
 ['Different prefixes are merged', 'The prefixes collide only because both applications share the same Redis connection name.', 'Connection naming is not a selective boundary for a flush of the underlying logical database.']
],
423: [
 ['Reading a forever entry', 'A forever entry becomes a permanent record if the application reads it at least once each day.', 'Access frequency does not protect the entry from an explicit flush, eviction policy or store loss.'],
 ['The problem disappears', 'Changing the key to include the invoice’s database ID makes cache loss harmless.', 'A better key does not recreate the only copy of a lost business record.']
],
424: [['The callback runs in a queue', 'It returns false without throwing, exactly like a nonblocking get attempt.', 'The blocking helper reports an exhausted wait through LockTimeoutException; it is not the nonblocking false-return path.']],
425: [['Pass the request URL', 'Pass only the lock name and call forceRelease when the job finishes.', 'That can remove a lock without proving the job owns it, so it fails the ownership-checking requirement.']],
426: [['release removes A’s lock', 'release checks only the name; forceRelease additionally checks the owner token.', 'That reverses the protection: release checks the owner, while forceRelease bypasses that check.']],
435: [
 ['Cache::put installs', 'Cache::put clones the object, but the clone shares scalar properties with the original.', 'A clone would hold its own scalar count property; this behavior comes from retaining the same object instead.'],
 ['The numeric field expires', 'Cache::get returns the original variable by reference even when the store serializes values.', 'Serialization reconstructs values rather than retaining this live PHP object identity across the storage boundary.']
],
444: [['$request->withHeaders(["X-Trace"', '$request->withHeaders(["X-Mode" => null])->withHeaders(["X-Mode" => "new"])', 'Adding a null header value through recursive merging is not the supported replacement operation and does not reliably remove the old value.']],
460: [['Only pagination links', 'A data envelope and links, but no meta because wrapping was disabled.', 'The pagination response still includes its metadata; disabling ordinary wrapping does not remove that part.']],
463: [['No; the resource explicitly', 'No; the resource explicitly reads and returns the secret.', 'Model hidden settings affect model array serialization, not explicit attribute access in a custom resource. Remove this field or gate its exposure according to the API policy.']],
467: [['Rename the model’s primary', 'Call $resource->additional(["item" => []]) without changing the wrapper.', 'That adds an extra top-level field but does not rename the default data wrapper.']],
470: [['204 for the created', '201 for both whenever the route uses POST.', 'The stated default is based on the model flag, not simply on the incoming HTTP method.']],
481: [['The helper deletes', 'Following works only for an initial GET, so the POST response must still be the original redirect.', 'The feature helper can follow the redirect produced by this POST and return the final destination response.']],
484: [
 ['The command class', 'The output contains no line beginning with Error.', 'An unsuccessful command can use different wording or report failure only through its exit code.'],
 ['The console output is nonempty', 'The command produces no stderr text.', 'A command can return a failure exit code without writing to stderr.']
],
485: [
 ['Container bindings apply only', 'The fake was bound as an instance instead of a singleton, so direct new calls ignore it.', 'Changing the binding lifetime does not make manual construction consult the container.'],
 ['The fake must have', 'The fake needs the same concrete class name as RealGateway before the binding can intercept new.', 'A binding does not intercept PHP new expressions; matching names is not an object-replacement mechanism.'],
 ['The binding will replace', 'The binding must be repeated after Checkout has been manually constructed.', 'Rebinding does not replace the collaborator already stored in a manually created object.']
],
486: [['Disable foreign-key checks', 'Give each test database a longer random suffix while keeping the file path unchanged.', 'Database naming still does not distinguish the shared filesystem path.']],
487: [['Yes; the callback is permanently', 'Yes; a database queue is required before any afterCommit callback can run in a test.', 'The transaction callback mechanism does not require a database queue driver.']],
491: [
 ['Copy resources/js', 'Deploy only the original resources/js directory and keep the @vite directive unchanged.', 'The production directive needs the manifest and generated assets, not just the source entry directory.'],
 ['Set APP_DEBUG', 'Set APP_ENV=production and leave the missing build artifacts for Laravel to generate.', 'The environment setting does not run the JavaScript build or generate the required manifest.'],
 ['Run only route:cache', 'Run view:cache and deploy only the compiled Blade files.', 'Compiling Blade does not produce the Vite manifest or bundled asset files.']
],
492: [
 ['The production manifest always', 'A cached route is overriding the Vite manifest; clear only the route cache.', 'Vite checks its hot file independently of route cache lookup.'],
 ['APP_NAME must match', 'The manifest wins only when APP_DEBUG is false, so keep the hot file and disable debugging.', 'Hot-file detection is based on the file’s presence, not the debug flag.']
],
495: [
 ['Keep the wildcard and repeat', 'Keep the wildcard and set Access-Control-Allow-Credentials to false.', 'That no longer permits the required credentialed response and does not satisfy the stated session use.'],
 ['Keep the wildcard and add', 'Keep the wildcard but add Vary: Origin.', 'Vary supports cache correctness; it does not make a wildcard acceptable for a credentialed response.']
],
500: [['The adapter converts every', 'The next page receives only the old input; errors must be fetched from a separate REST endpoint.', 'The standard adapter already shares the flashed validation errors in page props, so a separate error endpoint is not required.']]
};
export const foundation=[413,415,423,430,437,445,452,455,456,459,462,464,484,485,489,490,491,493,494,497];
export default function editorial(records) {
 return records.map(original=>{
  const q=structuredClone(original),n=Number(q.id.slice(-4));
  let changed=false;
  for(const [prefix,text,rationale] of corrections[n]||[]){
   const matches=q.options.filter(o=>o.text.startsWith(prefix));
   assert.equal(matches.length,1,'Editorial target '+q.id+' '+prefix);
   Object.assign(matches[0],{text,rationale,misconception:matches[0].id===q.correctOptionId?null:rationale});
   changed=true;
  }
  if(foundation.includes(n)){
   q.difficulty.level='Foundation';q.difficulty.audience='junior';changed=true;
  }
  if(n===427){q.difficulty.level='Intermediate';q.difficulty.audience='intermediate';changed=true;}
  if(n===484){
   const key=q.options.find(o=>o.id===q.correctOptionId);
   key.text='A successful exit status.';
   q.revision++;
  }
  if(changed){
   q.revision++;
   q.explanation.summary=q.options.find(o=>o.id===q.correctOptionId).rationale;
   q.explanation.trace=q.options.map(o=>o.rationale);
  }
  return q;
 });
}
