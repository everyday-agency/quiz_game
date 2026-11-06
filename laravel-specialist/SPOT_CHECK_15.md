# Fifteen randomly selected unchanged Laravel questions

Independent editorial approval remains **pending**. All options below use source order; the quiz shuffles their displayed order. Correct keys and all rationales are included for the reviewer.

## LAR-S26-0118 — revision 2

**Validation · Foundation · implementation**

Learning objective: Reject a non-list associative payload when the API requires a consecutive numeric list.

Prerequisites: PHP arrays; List validation.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**An API requires items to have consecutive numeric keys starting at zero. The directly decoded input [1 => "A", 2 => "B"] must be rejected, not reindexed. Which rules enforce the shape?**

**A.** Apply array_values before using required|array.

**B.** required|array

**C.** required|array|min:2

**D.** required|array|list

**Correct answer: D** (choice-4).

list requires consecutive numeric keys starting at zero, in addition to the array requirement.

- **A:** Reindexing transforms the invalid shape into a list instead of rejecting it as required.
- **B:** An array can have arbitrary keys, so this permits the invalid shape.
- **C:** The payload already has two entries; a count minimum does not establish its key sequence.
- **D:** list requires consecutive numeric keys starting at zero, in addition to the array requirement.

Difficulty rationale: Reject a non-list shape instead of silently normalizing it.

Validation: runtime-verified — [batch evidence](evidence/batch-2-technical.json).

Observed stdout on both supported PHP versions: `[false,true]`.

References:

- [https://laravel.com/docs/13.x/validation#rule-list](https://laravel.com/docs/13.x/validation#rule-list)

## LAR-S26-0039 — revision 2

**Routing · Intermediate · code-review**

Learning objective: Preserve only approved search parameters when replacing a fixed legacy redirect with a generated redirect.

Prerequisites: Redirect routes; Request query selection; Named URL generation.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**GET /find?q=php&token=private follows this legacy redirect, but the search term is lost. The new URL must retain q and must omit token. Which replacement for the /find handler meets both requirements?**

### routes/fixture.php (complete-file)

```php
<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/find', '/search');
Route::get('/search', fn () => 'search')->name('search');
```

**A.** Make the redirect permanent by changing its status to 301.

**B.** Generate a redirect to search with only q from $request->query("q").

**C.** Append the complete incoming query string to /search.

**D.** Keep Route::redirect and add ->where("q", ".*").

**Correct answer: B** (choice-2).

A fixed redirect does not transfer the incoming query automatically; explicitly generating the URL with q preserves the allowed value without token.

- **A:** Changing the redirect status does not copy q or selectively remove token.
- **B:** A fixed redirect does not transfer the incoming query automatically; explicitly generating the URL with q preserves the allowed value without token.
- **C:** That preserves q but also carries the private token into the destination URL.
- **D:** Route constraints govern URI placeholders, not forwarding of incoming query parameters.

Difficulty rationale: Preserve useful query state while excluding a credential from the redirect URL.

Validation: runtime-verified — [batch evidence](evidence/batch-1-technical.json).

Observed stdout on both supported PHP versions: `/search|/search?q=php`.

References:

- [https://laravel.com/docs/13.x/routing#redirect-routes](https://laravel.com/docs/13.x/routing#redirect-routes)
- [https://laravel.com/docs/13.x/responses#redirecting-to-named-routes](https://laravel.com/docs/13.x/responses#redirecting-to-named-routes)

## LAR-S26-0534 — revision 2

**Encryption formats · Foundation · execution**

Learning objective: Keep string encryption and serialized-value encryption paired with the matching decryption API.

Prerequisites: Encrypter serialization; String-specific encryption methods.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**What does decryptString return for a value produced by the default encrypt("hello") method?**

### probe.php (complete-file)

```php
<?php

$encrypted = Illuminate\Support\Facades\Crypt::encrypt('hello');
$decoded = Illuminate\Support\Facades\Crypt::decryptString($encrypted);

echo $decoded;
```

**A.** The serialized PHP string representation s:5:"hello";

**B.** The plain string hello

**C.** A MAC failure merely because different method names were paired

**D.** The original encrypted base64 payload

**Correct answer: A** (choice-1).

Default encrypt serializes its value first; decryptString decrypts bytes without unserializing them. Use matching APIs for the desired representation.

- **A:** Default encrypt serializes its value first; decryptString decrypts bytes without unserializing them. Use matching APIs for the desired representation.
- **B:** That would require unserialization, as performed by the matching default decrypt method.
- **C:** Both use the same encryption format; the mismatched representation does not itself invalidate the MAC.
- **D:** decryptString does perform decryption; the distinction is its serialization behavior.

Difficulty rationale: Pair encryption and decryption APIs with the representation actually protected.

Validation: runtime-verified — [batch evidence](evidence/batch-6-technical.json).

Observed stdout on both supported PHP versions: `s:5:"hello";`.

References:

- [https://laravel.com/docs/13.x/encryption#using-the-encrypter](https://laravel.com/docs/13.x/encryption#using-the-encrypter)

## LAR-S26-0355 — revision 1

**Broadcast events · Intermediate · code-review**

Learning objective: Restrict public broadcast payloads with broadcastWith rather than exposing every public property.

Prerequisites: Broadcast event payloads; Public properties; Data minimization.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**A broadcast event has public orderId and internalToken properties. Subscribers need only orderId. Which event method explicitly defines the broadcast payload without exposing internalToken?**

**A.** broadcastOn(), returning ["orderId" => $this->orderId].

**B.** viaQueue(), returning "private".

**C.** broadcastAs(), returning "orderId".

**D.** broadcastWith(), returning ["orderId" => $this->orderId].

**Correct answer: D** (choice-4).

An explicit broadcast payload replaces the default public-property extraction with the selected fields.

- **A:** broadcastOn selects channels, not the data fields in the transmitted payload.
- **B:** A queue name does not redact fields delivered to subscribers.
- **C:** Renaming the event does not remove sensitive public properties from its payload.
- **D:** An explicit broadcast payload replaces the default public-property extraction with the selected fields.

Difficulty rationale: Control fields exposed to subscribers independently of server-side event data.

Validation: runtime-verified — [batch evidence](evidence/batch-4-technical.json).

Observed stdout on both supported PHP versions: `7:hidden`.

References:

- [https://laravel.com/docs/13.x/broadcasting#broadcast-data](https://laravel.com/docs/13.x/broadcasting#broadcast-data)

## LAR-S26-0057 — revision 1

**HTTP responses · Intermediate · execution**

Learning objective: Distinguish creation of a streamed download from execution of its callback.

Prerequisites: Streamed responses; Callback timing.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**At the point shown, what is printed? No response has been sent yet.**

### probe.php (complete-file)

```php
<?php

$ran = false;
$response = response()->streamDownload(function () use (&$ran): void {
    $ran = true;
    echo 'a,b';
}, 'report.csv');

echo $ran ? 'ran' : 'pending';
```

**A.** ran without a,b

**B.** a,bran

**C.** pending

**D.** An error because callbacks cannot print response content

**Correct answer: C** (choice-3).

Constructing the streamed response stores the callback; content sending executes it later.

- **A:** The callback has not run at all; its state change is deferred along with its output.
- **B:** This would require the callback to execute during construction, which it does not.
- **C:** Constructing the streamed response stores the callback; content sending executes it later.
- **D:** Printing content is precisely how a streamed response callback supplies its body.

Difficulty rationale: Separate constructing the response from sending its content.

Validation: runtime-verified — [batch evidence](evidence/batch-1-technical.json).

Observed stdout on both supported PHP versions: `pending`.

References:

- [https://laravel.com/docs/13.x/responses#streamed-downloads](https://laravel.com/docs/13.x/responses#streamed-downloads)

## LAR-S26-0437 — revision 2

**HTTP client errors · Foundation · debugging**

Learning objective: Distinguish a connection failure from an HTTP response error.

Prerequisites: ConnectionException; HTTP status versus transport failure.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**The remote host cannot be reached and no HTTP response is received. With an ordinary Http::get call, which handling strategy covers that failure?**

**A.** Catch ConnectionException separately from checking HTTP response statuses.

**B.** Treat the call as a successful empty response when no throw() was configured.

**C.** Check $response->status() === 500 after every connection failure.

**D.** Use only $response->failed() without catching transport exceptions.

**Correct answer: A** (choice-1).

A connection failure is represented by an exception because no response status exists to inspect.

- **A:** A connection failure is represented by an exception because no response status exists to inspect.
- **B:** Default non-throwing HTTP-status behavior does not suppress transport exceptions.
- **C:** A connection failure does not create a server-generated HTTP 500 response object.
- **D:** The failed method requires a response and cannot handle a call that throws before returning one.

Difficulty rationale: Handle a transport failure that has no HTTP status to inspect.

Validation: runtime-verified — [batch evidence](evidence/batch-5-technical.json).

Observed stdout on both supported PHP versions: `connection`.

References:

- [https://laravel.com/docs/13.x/http-client#timeout](https://laravel.com/docs/13.x/http-client#timeout)

## LAR-S26-0522 — revision 2

**Encryption integrity · Foundation · testing**

Learning objective: Reject modified encrypted payloads rather than trusting decryptable-looking base64.

Prerequisites: Encrypted payload integrity; MAC verification; Decryption exceptions.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:

- The application uses Laravel’s AES-256-CBC encrypter. A test modifies the ciphertext value inside the payload but leaves its original MAC.

**Which result should the tampering regression test require?**

**A.** decryptString throws DecryptException instead of returning trusted plaintext.

**B.** decryptString returns null as its normal invalid-payload result.

**C.** The modified outer value is accepted whenever it remains valid base64.

**D.** decryptString returns the changed bytes as a successful plaintext value.

**Correct answer: A** (choice-1).

The MAC authenticates the protected payload, so changing ciphertext without a valid corresponding MAC must be rejected.

- **A:** The MAC authenticates the protected payload, so changing ciphertext without a valid corresponding MAC must be rejected.
- **B:** The authenticated decryption failure is reported by DecryptException, not a successful null return.
- **C:** Base64 validity is only an encoding property, not authenticity.
- **D:** That would ignore the integrity guarantee the test is meant to protect.

Difficulty rationale: Verify rejection of a modified protected value rather than only successful round trips.

Validation: runtime-verified — [batch evidence](evidence/batch-6-technical.json).

Observed stdout on both supported PHP versions: `rejected`.

References:

- [https://laravel.com/docs/13.x/encryption#decrypting-a-value](https://laravel.com/docs/13.x/encryption#decrypting-a-value)

## LAR-S26-0261 — revision 1

**Query Builder · Foundation · debugging**

Learning objective: Extend a projection with addSelect instead of replacing the existing selected columns.

Prerequisites: Query Builder projection.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**A shared query already selects id and name. A helper calls select("code"), and downstream code can no longer read id. Which helper change adds code while retaining the existing projection?**

**A.** Call select("code") twice.

**B.** Call get() before select("code").

**C.** Use addSelect("code").

**D.** Use whereNotNull("code") instead.

**Correct answer: C** (choice-3).

addSelect extends the builder’s selected columns instead of resetting them.

- **A:** Repeated select calls still replace the current projection.
- **B:** This executes the existing query and changes the workflow rather than extending its projection.
- **C:** addSelect extends the builder’s selected columns instead of resetting them.
- **D:** A predicate can filter rows but does not add code to the selected columns.

Difficulty rationale: Extend an existing projection instead of replacing fields required by the caller.

Validation: runtime-verified — [batch evidence](evidence/batch-3-technical.json).

Observed stdout on both supported PHP versions: `id,name,code`.

References:

- [https://laravel.com/docs/13.x/queries#select-statements](https://laravel.com/docs/13.x/queries#select-statements)

## LAR-S26-0448 — revision 1

**HTTP client retries · Intermediate · code-review**

Learning objective: Refresh a rejected token within a status-specific retry callback before the next request.

Prerequisites: Status-specific retry callbacks; PendingRequest authentication; Token refresh.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:

- A trusted local refresh function can provide a new token. Retry budget permits one further attempt.

**An authenticated request receives 401 because its token expired. Which retry callback policy changes the next request appropriately without treating every failure as an expired token?**

**A.** Check for RequestException with status 401, refresh the pending request’s token, then allow retry.

**B.** Treat every 5xx response as proof that the user’s access token expired.

**C.** Return true for every exception but leave the pending request’s token unchanged.

**D.** Refresh a separate newly created request object but retry the original unchanged request.

**Correct answer: A** (choice-1).

The callback receives the pending request and can update its credential for the next attempt while filtering by the relevant failure.

- **A:** The callback receives the pending request and can update its credential for the next attempt while filtering by the relevant failure.
- **B:** Server errors do not uniquely indicate a rejected credential.
- **C:** That retries the same rejected credential and does not perform the required refresh.
- **D:** Changing an unrelated request does not update the request being retried.

Difficulty rationale: Change the next attempt’s credential only for the failure that warrants refresh.

Validation: runtime-verified — [batch evidence](evidence/batch-5-technical.json).

Observed stdout on both supported PHP versions: `Bearer old:Bearer new:200`.

References:

- [https://laravel.com/docs/13.x/http-client#retries](https://laravel.com/docs/13.x/http-client#retries)

## LAR-S26-0278 — revision 2

**Query Builder · Intermediate · execution**

Learning objective: Retrieve an inserted identifier without assuming Query Builder applies Eloquent model events or timestamps.

Prerequisites: Query Builder insertGetId; Eloquent lifecycle boundary.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**records has nullable timestamps. Record has a creating observer that increments a counter. The table starts empty. What follows DB::table("records")->insertGetId(["name" => "new"])?**

**A.** It returns a Record model and runs creating before the insert.

**B.** It returns the id and runs the observer once because the table name matches Record.

**C.** The id is returned; no observer runs or timestamps are filled.

**D.** It returns the id and automatically fills both timestamps using Record’s defaults.

**Correct answer: C** (choice-3).

Query Builder inserts directly and retrieves the key without constructing or saving an Eloquent model.

- **A:** insertGetId returns the identifier, not an Eloquent model with lifecycle hooks.
- **B:** Query Builder does not infer a model class from the table name.
- **C:** Query Builder inserts directly and retrieves the key without constructing or saving an Eloquent model.
- **D:** Eloquent timestamp behavior does not apply to this direct table operation.

Difficulty rationale: Separate raw table insertion from model timestamp and observer behavior.

Validation: runtime-verified — [batch evidence](evidence/batch-3-technical.json).

Observed stdout on both supported PHP versions: `1:0:null`.

References:

- [https://laravel.com/docs/13.x/queries#auto-incrementing-ids](https://laravel.com/docs/13.x/queries#auto-incrementing-ids)
- [https://laravel.com/docs/13.x/eloquent#events](https://laravel.com/docs/13.x/eloquent#events)

## LAR-S26-0436 — revision 1

**HTTP client · Foundation · execution**

Learning objective: Handle an HTTP error status without assuming the Laravel client throws by default.

Prerequisites: Laravel HTTP client; HTTP status codes.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:

- The server returns HTTP 500. No retry or throw behavior has been configured.

**What happens at this call?**

### probe.php (complete-file)

```php
<?php

$response = Illuminate\Support\Facades\Http::get('https://api.example.test/report');
$status = $response->status();
```

**A.** The client retries indefinitely until a 2xx response arrives.

**B.** A RequestException is always thrown before $status can be assigned.

**C.** A response is returned and $status is 500.

**D.** The client returns null because a 500 response has no usable response object.

**Correct answer: C** (choice-3).

The client does not throw for HTTP 4xx/5xx statuses by default; callers can inspect or explicitly throw.

- **A:** There is no implicit unlimited retry loop for an ordinary get.
- **B:** That requires an explicit throwing policy or applicable retry behavior, absent here.
- **C:** The client does not throw for HTTP 4xx/5xx statuses by default; callers can inspect or explicitly throw.
- **D:** Error responses still have a status, headers and potentially a body.

Difficulty rationale: Distinguish an HTTP response with an error status from an exception policy.

Validation: runtime-verified — [batch evidence](evidence/batch-5-technical.json).

Observed stdout on both supported PHP versions: `500`.

References:

- [https://laravel.com/docs/13.x/http-client#error-handling](https://laravel.com/docs/13.x/http-client#error-handling)

## LAR-S26-0460 — revision 2

**API pagination · Intermediate · execution**

Learning objective: Retain the paginated data envelope even when ordinary resource wrapping is disabled.

Prerequisites: Resource wrapping; Paginator metadata.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**JsonResource::withoutWrapping() is enabled. A resource collection wraps a LengthAwarePaginator. What shape should a client still expect?**

**A.** A data envelope with pagination links and meta.

**B.** An exception because pagination requires the global wrap setting to remain enabled.

**C.** A data envelope and links, but no meta because wrapping was disabled.

**D.** Only the bare item array with no links or meta.

**Correct answer: A** (choice-1).

Paginated resource responses retain data wrapping to accompany the pagination information.

- **A:** Paginated resource responses retain data wrapping to accompany the pagination information.
- **B:** The resource machinery handles pagination wrapping even when ordinary wrapping is disabled.
- **C:** The pagination response still includes its metadata; disabling ordinary wrapping does not remove that part.
- **D:** Disabling ordinary wrapping does not remove the pagination response structure.

Difficulty rationale: Recognize the pagination envelope exception to ordinary unwrapped resources.

Validation: runtime-verified — [batch evidence](evidence/batch-5-technical.json).

Observed stdout on both supported PHP versions: `data,links,meta`.

References:

- [https://laravel.com/docs/13.x/eloquent-resources#data-wrapping-and-pagination](https://laravel.com/docs/13.x/eloquent-resources#data-wrapping-and-pagination)

## LAR-S26-0564 — revision 1

**Localization · Intermediate · implementation**

Learning objective: Keep persisted timestamps in a consistent time basis while formatting a viewer-specific timezone.

Prerequisites: UTC storage; Carbon timezone conversion; Instant versus wall time.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**A UTC timestamp represents 2026-01-15 12:00:00. The viewer uses Europe/Zurich, and the displayed value must preserve the same instant. Which operation on its CarbonImmutable value is appropriate?**

**A.** shiftTimezone("Europe/Zurich")

**B.** addHour() while keeping the UTC timezone

**C.** Parse the stored UTC text as Europe/Zurich without declaring its original UTC basis

**D.** setTimezone("Europe/Zurich")

**Correct answer: D** (choice-4).

Timezone conversion changes the wall-clock display to the viewer’s zone while retaining the instant.

- **A:** That keeps the wall-clock fields while changing the timezone interpretation, which changes the represented instant.
- **B:** Adding an hour changes the instant instead of merely displaying it in another zone.
- **C:** That interprets the source wall time in the wrong zone rather than converting the known instant.
- **D:** Timezone conversion changes the wall-clock display to the viewer’s zone while retaining the instant.

Difficulty rationale: Change the display timezone without changing which instant the timestamp denotes.

Validation: runtime-verified — [batch evidence](evidence/batch-6-technical.json).

Observed stdout on both supported PHP versions: `13:00:same-instant`.

References:

- [https://laravel.com/docs/13.x/eloquent-mutators#date-casting-serialization-and-timezones](https://laravel.com/docs/13.x/eloquent-mutators#date-casting-serialization-and-timezones)
- [https://carbon.nesbot.com/docs/](https://carbon.nesbot.com/docs/)

## LAR-S26-0165 — revision 1

**Blade components · Foundation · code-review**

Learning objective: Distinguish default attribute values from enforced values when merging component attributes.

Prerequisites: Component attribute merging; HTML button types.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**A button component uses $attributes->merge(["type" => "button"]). A caller supplies type="submit". A reviewer claims the default guarantees the component cannot submit a form. Which finding is correct?**

**A.** The default button value always overrides the caller.

**B.** The component throws because type appears in both input and defaults.

**C.** The type becomes "button submit", so neither behavior applies.

**D.** The caller's submit value wins; merge supplies a default, not an enforcement policy.

**Correct answer: D** (choice-4).

For ordinary attributes such as type, a provided caller value overrides the default in the merge.

- **A:** This reverses the precedence for an ordinary supplied attribute.
- **B:** The merge handles this overlap by choosing the supplied value, not by rejecting it.
- **C:** Non-class attributes are not concatenated like CSS classes.
- **D:** For ordinary attributes such as type, a provided caller value overrides the default in the merge.

Difficulty rationale: Distinguish a default from an enforced attribute value.

Validation: runtime-verified — [batch evidence](evidence/batch-2-technical.json).

Observed stdout on both supported PHP versions: `<button type="submit">Save</button>`.

References:

- [https://laravel.com/docs/13.x/blade#non-class-attribute-merging](https://laravel.com/docs/13.x/blade#non-class-attribute-merging)

## LAR-S26-0084 — revision 1

**Middleware · Foundation · debugging**

Learning objective: Register a route middleware alias in the Laravel 13 bootstrap configuration.

Prerequisites: Bootstrap middleware configuration; Route aliases.

Runtime: Laravel 13.x (validated 13.40.0) · PHP 8.4 / 8.5. E_ALL; UTC; no external services or application data.

Assumptions:



**A standard Laravel 13 route uses middleware("paid"), but the alias is unknown. PaidSubscription is an autoloadable middleware class. It should run only on routes that name paid. Which bootstrap configuration supplies the missing mapping?**

**A.** Inside withMiddleware, call $middleware->append(PaidSubscription::class).

**B.** Add PaidSubscription::class to bootstrap/providers.php.

**C.** Inside withMiddleware, call $middleware->alias(["paid" => PaidSubscription::class]).

**D.** Rename the route itself to paid.

**Correct answer: C** (choice-3).

The alias map resolves the short route middleware name to the class without adding it globally.

- **A:** Appending makes it global and does not supply the required paid alias mapping.
- **B:** That file registers service providers, not route middleware aliases.
- **C:** The alias map resolves the short route middleware name to the class without adding it globally.
- **D:** A route name is unrelated to resolving middleware("paid").

Difficulty rationale: Connect a route alias to its middleware class without broadening its scope.

Validation: documented-contract-reviewed — [batch evidence](evidence/batch-1-technical.json).

Documented-contract limitation: The middleware builder stores custom aliases for the HTTP kernel/router alias table.

References:

- [https://laravel.com/docs/13.x/middleware#middleware-aliases](https://laravel.com/docs/13.x/middleware#middleware-aliases)

