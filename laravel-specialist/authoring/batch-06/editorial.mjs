import assert from 'node:assert/strict';
export const corrections = {
502: [
 ['The handler returns the previous', 'The handler throws a TypeError because every render callback must return a Response.', 'Returning null is supported as a fall-through signal; it is not a mandatory Response return contract.'],
 ['The exception is considered handled', 'The callback result is serialized as JSON null with status 200.', 'A null callback result selects fallback rendering rather than becoming a successful JSON response.']
],
503: [
 ['Yes; Laravel resumes', 'No response is generated because reporting is required before rendering.', 'Reporting and rendering are separate handler responsibilities; omitting a report does not prevent a response.'],
 ['No; dontReport changes', 'The failure becomes a 422 validation response because it was excluded from reporting.', 'A reporting exclusion does not classify an arbitrary RuntimeException as a validation failure.']
],
504: [['getCode()', 'A public $context property with the same associative array', 'The exception-reporting integration calls the context method; an arbitrary property does not supply that method contract.']],
513: [
 ['request_id is included', 'Only request_id is logged; hidden internal_flag remains readable through hidden-context access.', 'Hidden context remains in the repository but is excluded from the standard processor’s log extras.'],
 ['Both values are logged', 'Both values are logged because the processor reads all public and hidden repository data.', 'The processor uses the public context collection, not the separate hidden data collection.']
],
515: [['Both A and B', 'Hydration throws because request_id is already present in the worker context.', 'Normal hydration replaces the captured context; a preexisting key is not a duplicate-key exception.']],
520: [
 ['Assert only that the log', 'Assert that a log record contains a nonempty request_id, without inspecting the response.', 'A populated log field alone does not prove it matches the identifier returned to the client.'],
 ['Generate two independent', 'Assert that both values are valid UUIDs without comparing their values.', 'Two independently generated valid UUIDs would pass that check while breaking correlation.']
],
522: [['decryptString silently repairs', 'decryptString returns null as its normal invalid-payload result.', 'The authenticated decryption failure is reported by DecryptException, not a successful null return.']],
523: [['Alternate current keys', 'Use the new current key and configure the old value only as the application name.', 'The application name is not a previous decryption key; it cannot retain old ciphertext compatibility.']],
525: [['No; the token column', 'No; the stored token is reversibly encrypted and is decrypted before comparison.', 'The repository uses a verification hash, not reversible encryption of the reset token.']],
527: [['Its plaintext value', 'It is retained and marked consumed in a used_at column by the standard broker.', 'The standard successful reset path deletes the repository token record rather than maintaining a used_at state.']],
529: [['It selects the account', 'It verifies the email hash but ignores the route ID because auth already selected a user.', 'The standard request checks both the route identity and the current verification-email digest.']],
530: [['signed only', 'auth and signed, requiring a signed URL but no verified middleware', 'A signed URL proves integrity of that URL; it does not enforce the user model’s verified-email state.']],
532: [['Any nonempty string', 'The account email, with the guard looking up the stored password internally.', 'Finding an account is not proof of the current password; the method verifies the supplied password against the stored hash.']],
536: [['Only the first business', 'The decoded JSON fields joined in their received order without JSON punctuation.', 'That is a different byte sequence from the provider’s specified raw-body input.']],
537: [['Verify the signature, enforce', 'Check the signature and signed age, then atomically consume the delivery ID once.', 'Authenticity, the defined freshness window and a durable unique consumption decision address altered, stale and repeated deliveries.']],
539: [['Nothing further', 'Only a valid session login; confirmation age matters only after the user logs out.', 'The confirmation middleware enforces recency for an already authenticated session.']],
540: [
 ['Keep CSRF defenses only', 'Remove token checks for POST if the cookie is HttpOnly, but retain them for DELETE.', 'HttpOnly does not distinguish those methods or stop automatic cookie attachment.'],
 ['Remove CSRF defenses because HttpOnly prevents', 'Remove them when fetch uses credentials: include, because HttpOnly rejects scripted credential use.', 'HttpOnly prevents reading the cookie value but does not block fetch from sending eligible cookies.'],
 ['Remove CSRF defenses because HttpOnly requires', 'Keep token checks only for JavaScript clients; ordinary HTML forms cannot send an HttpOnly cookie.', 'Eligible form submissions also carry cookies; script access to the value is not required.']
],
547: [
 ['filter($predicate) and use', 'groupBy($predicate) and destructure its returned values as [accepted, rejected] without selecting boolean keys.', 'Group insertion order follows encountered keys, so destructuring values does not guarantee the requested accepted/rejected order.'],
 ['map($predicate) and use', 'Use takeWhile($predicate) for accepted items and skipUntil($predicate) for rejected items.', 'Those operations select sequence boundaries, not all items by a single shared classification pass.']
],
551: [['["Ada"]', '["Ada"]', 'The wildcard result keeps a slot for the missing leaf, with null in the pinned implementation, rather than dropping that row.']],
556: [['Au revoir', 'An empty string', 'A missing key is not an empty translation: the configured fallback locale supplies the requested welcome key.']],
557: [['[null]:[null]', '[]:[absent]', 'An absent grouped key falls back to its full key text, including messages., rather than only the final segment.']],
561: [
 ['The translator combines', 'The helper treats every undotted key as a request for all JSON translations.', 'The relevant array comes from the matching PHP group, not from an automatic dump of JSON translations.'],
 ['The en locale requires', 'The PHP file must be named messages.php before any scalar translation can be returned.', 'PHP groups can have other filenames; a fully qualified key such as action.save selects a scalar entry.']
],
563: [
 ['Accept any two-letter', 'Accept any two-letter locale matching /^[a-z]{2}$/ and use en only for malformed input.', 'Syntax does not enforce the stated en/fr support boundary; de would still be selected.'],
 ['Use the browser’s first', 'Use fr for every unsupported value because it is the last configured supported locale.', 'The requirement specifically selects en as the fallback, not the final allowlist entry.']
],
566: [
 ['Keep the project root and enable', 'Keep the project root and add Laravel middleware that rejects requests for dotfiles.', 'The web server may serve a file before Laravel middleware runs; the document-root boundary must be correct.'],
 ['Point the document root at storage', 'Point at the project root and remove read access to .env only.', 'Restricting one file still exposes other private application paths; serving through public establishes the intended boundary.']
],
567: [
 ['Use debug=true and hide', 'Leave debug enabled but replace the visible error page using client-side JavaScript.', 'Removing text from the visible page does not remove details already sent in the response.'],
 ['Clear route cache', 'Return a generic HTML error view but leave debug JSON responses untested.', 'The stated public route can negotiate JSON, so checking only HTML leaves that diagnostic representation uncovered.']
],
568: [['Production automatically ignores', 'The production APP_ENV value always overrides every value loaded from the cached array.', 'Loading the resolved cache does not recompute its entries from the new environment.']],
569: [
 ['Drop full_name', 'Deploy new readers first, then add and backfill display_name after all nodes switch.', 'New readers can fail or see missing values before the schema and backfill they require are ready.'],
 ['Change the model accessor', 'Rename the column inside one transaction and keep old workers serving throughout.', 'Atomic schema change does not make old workers’ full_name queries compatible after the rename.']
],
570: [
 ['Yes; Laravel stores', 'Yes, if the migration was originally run inside a transaction that later committed.', 'A completed transaction is not an ongoing snapshot available to a later rollback command.'],
 ['Only if the command', 'Yes, if down uses the same nullable type and column name as the original.', 'Matching schema shape does not reconstruct values that were discarded.']
],
573: [['Every migration down', 'Run every migration down method before checking whether A can use the current schema.', 'That can destroy new data or reverse compatible additions unnecessarily; recovery must first assess current-state compatibility.']],
579: [['Record only the number', 'Record total SQL time but omit query count and total endpoint duration.', 'That omits query-frequency and non-database context needed to distinguish the proposed bottleneck.']],
580: [
 ['Whether the Laravel migration', 'Whether the index fits in memory under the production cache and storage budget.', 'That is useful capacity evidence but does not cover the frequent-write maintenance cost and overall workload tradeoff.'],
 ['Whether one cached', 'Whether the report’s average query duration improves on an otherwise idle database.', 'That confirms an isolated read improvement but does not assess the stated frequent-write workload.'],
 ['Whether every model', 'Whether the migration can create and drop the index successfully in a test database.', 'Schema operability matters but does not measure production read/write tradeoffs.']
],
584: [['Enforce the nonnegative', 'Enforce the limit in a shared domain operation or value object.', 'All entry points cross that invariant boundary; the controller can retain validation for user-facing feedback.']],
585: [['A static carrier facade', 'A wrapper returning the SDK’s response object unchanged to checkout.', 'The wrapper still exposes provider-specific representation to the business flow instead of defining its own needed result.']],
586: [
 ['Put the operation’s ordered', 'Move both updates to one orchestrating service; remove their reciprocal triggers.', 'An explicit owner performs both required updates without recursively reentering the other observer.'],
 ['Catch the recursion failure', 'Add a per-observer boolean flag that is reset before the reciprocal save returns.', 'Resetting the guard before the recursive operation completes leaves reentry possible and does not establish a coherent operation boundary.']
],
587: [['Add a physical order', 'Add report-only global grouping and aggregate selection to every Order query.', 'That alters ordinary order reads and write-related lookups rather than isolating this report’s different representation.']],
590: [['Retry the temporary', 'Retry 503 within a budget; return the stable 422 rejection.', 'The read is safe to retry after a transient outage; repeating identical input cannot resolve the specified stable business rejection.']],
592: [
 ['Three, because', 'One delayed attempt scheduled automatically at 5000 ms.', 'The displayed code is a gate; it does not schedule a later call when the condition is false.'],
 ['A random count', 'One attempt after sleeping for 800 ms inside mayCall.', 'mayCall performs a comparison only and has no sleep or retry side effect.']
],
597: [['Add the tag name', 'Run vendor:publish with only the package’s configuration tag.', 'A different tag selects different registered paths; it does not copy the calendar asset mapping.']]
};
export const foundation=[501,503,508,509,516,518,520,522,524,525,527,528,530,531,534,539,544,546,547,549,550,552,553,556,557,558,559,563,565,566,567,570,579,583,584,594,597,598,599,600];
export default function editorial(records) {
 return records.map(original=>{
  const q=structuredClone(original),n=Number(q.id.slice(-4));let changed=false;
  for(const [prefix,text,rationale] of corrections[n]||[]){
   const matches=q.options.filter(o=>o.text.startsWith(prefix));
   assert.equal(matches.length,1,q.id+' '+prefix);
   Object.assign(matches[0],{text,rationale,misconception:matches[0].id===q.correctOptionId?null:rationale});changed=true;
  }
  if(foundation.includes(n)&&q.difficulty.level!=='Foundation'){q.difficulty.level='Foundation';q.difficulty.audience='junior';changed=true;}
  if(n===528){q.stem='What does the second password-broker sendResetLink call do within the issuance throttle window?';changed=true;}
  if(n===595){
   q.stem='Two packages register loadViewsFrom under distinct namespaces, billing and shipping. Each package has a card.blade.php; the application also has an ordinary views/card.blade.php. With no namespace overrides, which template does view("shipping::card") select?';
   q.context.assumptions=['Both package paths exist and are registered. There is no resources/views/vendor/shipping/card.blade.php override.'];
   q.objective={id:'laravel.package-view-namespace-isolation',text:'Resolve a namespaced package view without colliding with an application or another package view of the same filename.'};
   q.subtopic='package-view-namespace-isolation';
   q.difficulty={...q.difficulty,level:'Foundation',audience:'junior',rationale:'Resolve an explicit namespace independently of ordinary application view lookup.'};
   const values=[
    ['The shipping package card.','The shipping namespace restricts lookup to its registered paths; the ordinary application view and billing namespace are separate.'],
    ['The ordinary application card because application views always win.','An ordinary views/card.blade.php is not the conventional override for shipping::card.'],
    ['The billing card if its provider registered first.','Distinct namespaces do not compete for the same unqualified view name.'],
    ['An ambiguity error because all three files have the same basename.','The explicit namespace disambiguates the requested package view.']
   ];
   const correct=q.options.find(o=>o.id===q.correctOptionId);let j=1;
   for(const o of q.options){const [text,rationale]=values[o===correct?0:j++];Object.assign(o,{text,rationale,misconception:o===correct?null:rationale});}
   q.validation.probe=String.raw`foreach (['billing', 'shipping'] as $name) {
    mkdir(base_path('packages/'.$name), 0700, true);
    file_put_contents(base_path('packages/'.$name.'/card.blade.php'), $name);
}
file_put_contents(resource_path('views/card.blade.php'), 'application');
$provider = new class(app()) extends Illuminate\Support\ServiceProvider {
    public function boot(): void
    {
        $this->loadViewsFrom(base_path('packages/billing'), 'billing');
        $this->loadViewsFrom(base_path('packages/shipping'), 'shipping');
    }
};
$provider->boot();
echo view('shipping::card')->render();`;
   q.validation.stdout='shipping';changed=true;
  }
  if(n===566){
   q.stem='The document root already points to public. A generic Nginx PHP location would execute any .php file placed there. The deployment must execute only Laravel’s index.php entry point and reject other PHP paths. Which policy meets that boundary?';
   q.objective={id:'laravel.nginx-front-controller-execution-boundary',text:'Restrict web-server PHP execution to the Laravel front controller rather than every PHP file in the public tree.'};
   q.subtopic='nginx-front-controller-execution-boundary';
   q.prerequisites=['Nginx PHP routing','Laravel front controller','Public file execution boundary'];
   q.difficulty={level:'Intermediate',audience:'intermediate',rationale:'Distinguish a correct document root from the separate policy selecting which PHP files may execute.'};
   const values=[
    ['Allow the index.php entry-point location, then reject other PHP paths.', 'A narrow FastCGI entry point plus rejection of other PHP paths enforces the stated execution boundary.'],
    ['Send every existing .php file under public to PHP-FPM.', 'The document root is correct but this still permits additional PHP files to execute.'],
    ['Remove all PHP handling and serve those files as ordinary static content.', 'That prevents Laravel from executing and may disclose source rather than safely rejecting PHP paths.'],
    ['Keep the generic PHP handler and reject extra PHP paths inside Laravel middleware.', 'A separate PHP script can execute without entering Laravel’s front controller or middleware.']
   ];
   const correct=q.options.find(o=>o.id===q.correctOptionId);let j=1;
   for(const o of q.options){const [text,rationale]=values[o===correct?0:j++];Object.assign(o,{text,rationale,misconception:o===correct?null:rationale});}
   q.validation={kind:'documented-contract',sourceRoot:'reference',source:'nginx-entrypoint.txt',contains:['index.php','reject'],reason:'Laravel official Nginx deployment example restricts FastCGI to the front controller and returns 404 for other PHP locations. No live Nginx instance is tested.',status:'unvalidated',independentEditorialReview:'pending'};
   q.revision++;changed=true;
  }
  if(n===569){q.options.find(o=>o.id===q.correctOptionId).text='Add and backfill the new column; transition code before removing the old one.';q.revision++;changed=true;}
  if(changed){q.revision++;q.explanation.summary=q.options.find(o=>o.id===q.correctOptionId).rationale;q.explanation.trace=q.options.map(o=>o.rationale);}
  return q;
 });
}
