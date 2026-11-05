import { LEGACY_QUESTIONS } from './legacy-v1.mjs';

const byId = new Map(LEGACY_QUESTIONS.map(question => [question.id, question]));
// Each list names existing records explicitly. No identity depends on list position.
const families = [
  [['PQ-009','PQ-010','PQ-011','PQ-012'], ['PQ-001','PQ-005'], ['arithmetic.php','caller.php'],
    'The first file prints 30. In the second, the strict caller rejects a string passed to the supplied int parameter before formatTotal executes.',
    'The two programs run independently. legacy.php exists, contains only function formatTotal(int $amount): string { return (string) $amount; }, and emits no output.'],
  [['PQ-021','PQ-022','PQ-023','PQ-024'], ['PQ-013','PQ-017'], ['captures.php','sequence.php'],
    'The capture example prints 8 12; the independent static-local example prints 123.',
    'Run each file separately in a fresh PHP process.'],
  [['PQ-033','PQ-034','PQ-035','PQ-036'], ['PQ-025','PQ-029'], ['comparisons.php','defaults.php'],
    'The comparisons produce true, false, true; null coalescing preserves false and 0 and supplies untitled only for the absent label.',
    'Run the examples separately with the inputs shown.'],
  [['PQ-045','PQ-046','PQ-047','PQ-048'], ['PQ-037','PQ-041'], ['prices.php','destructure.php'],
    'The prices become a zero-indexed list containing 11, 27.5 and 5.5; destructuring the independent row yields id 7, name Ada and default role viewer.',
    'The files are independent. Float display formatting is not the question; compare values and keys.'],
  [['PQ-057','PQ-058','PQ-059','PQ-060'], ['PQ-049','PQ-053'], ['increments.php','short-circuit.php'],
    'The increment example assigns before=5 and after=7, leaving counter=7; the independent boolean example makes zero calls to check.',
    'Each file starts with only the variables shown.'],
  [['PQ-069','PQ-070','PQ-071','PQ-072'], ['PQ-061','PQ-065'], ['match.php','loops.php'],
    'The match expression returns string one; the nested loops print 1:1 and 2:1 on separate lines.',
    'The files are independent; the string status and continue level are exactly as shown.'],
  [['PQ-081','PQ-082','PQ-083','PQ-084'], ['PQ-073','PQ-077'], ['named-arguments.php','variadics.php'],
    'The page array contains size 50 and number 3; the typed variadic call accepts the integer as a float argument and formats 19.75.',
    'The files are independent and no locale-specific formatting is requested.'],
  [['PQ-093','PQ-094','PQ-095','PQ-096'], ['PQ-085','PQ-089'], ['arrow.php','callable.php'],
    'The arrow callback uses the captured 0.10 tax rate to produce 11 and 22; creating the Slugger callable defers execution until it is called with Hello PHP.',
    'Run each file independently.'],
  [['PQ-105','PQ-106','PQ-107','PQ-108'], ['PQ-097','PQ-101'], ['bootstrap.php','optional-reader.php'],
    'The bootstrap requires its declared files before constructing the service; a missing optional include emits a warning, returns false and permits the later echo under the stated error policy.',
    'These are independent contextual examples. Composer autoload.php and config/app.php exist and supply InvoiceService in bootstrap.php. In the optional example the target optional-hooks.php is absent; warnings are not converted to exceptions.'],
  [['PQ-117','PQ-118','PQ-119','PQ-120'], ['PQ-109','PQ-113'], ['json-reader.php','csv-reader.php'],
    'Malformed JSON triggers JsonException with JSON_THROW_ON_ERROR; the CSV loop uses an explicit escape setting and closes its successfully opened handle in finally.',
    'The examples are independent. payload.json is readable UTF-8 JSON when valid; users.csv is readable conventional CSV with exactly two fields per nonempty row. These examples do not claim that fopen or file_get_contents cannot fail.'],
  [['PQ-129','PQ-130','PQ-131','PQ-132'], ['PQ-121','PQ-125'], ['query-input.php','json-response.php'],
    'An absent or invalid page triggers the 400 branch; the independent response example sets JSON headers and status 201 before emitting its body.',
    'Each file handles a separate HTTP request in a web SAPI. No earlier body output or custom error handler exists; the page input is a scalar string or absent.'],
  [['PQ-141','PQ-142','PQ-143','PQ-144'], ['PQ-133','PQ-137'], ['validate-upload.php','store-upload.php'],
    'The first step checks the upload error and detected MIME; the second chooses a server-generated name and checks the move result. Neither step enforces a byte-size limit.',
    'These are successive included fragments in one HTTP upload handler. $_FILES has PHP’s normal single-upload shape; $file and server-detected $mime pass from the first fragment to the second. fileinfo is installed and the uploads directory is writable.'],
  [['PQ-153','PQ-154','PQ-155','PQ-156'], ['PQ-145','PQ-149'], ['preference.php','login.php'],
    'The preference cookie requests Secure, HttpOnly and SameSite=Lax; after a successful password check the login handler regenerates the session ID before storing the user ID.',
    'The snippets handle separate HTTPS requests before body output. The login example receives a string password and a trusted $user containing id and password_hash; session storage works.'],
  [['PQ-165','PQ-166','PQ-167','PQ-168'], ['PQ-157','PQ-161'], ['html-output.php','csrf.php'],
    'The HTML example applies length validation and HTML-text escaping; the CSRF example rejects an empty expected token or a nonmatching submitted token.',
    'These are independent HTTP handlers. Inputs are strings, mbstring is installed, a session is available, and output is inserted into HTML text, not JavaScript or a URL.'],
  [['PQ-177','PQ-178','PQ-179','PQ-180'], ['PQ-169','PQ-173'], ['values.php','identifiers.php'],
    'The value query binds status as data; the sort query selects its interpolated column from a fixed allowlist. Both fetch associative rows.',
    'A configured MySQL PDO connection and users table with the shown columns exist. The supplied status and sort are strings. The second fragment receives $pdo from connection setup; no rows or ordering beyond the shown SQL are assumed.'],
  [['PQ-189','PQ-190','PQ-191','PQ-192'], ['PQ-181','PQ-185'], ['transfer.php','migration.php'],
    'When debit and credit use the same transactional connection, an operation failure rolls back their writes; the migration provides an inverse schema operation, not recovery of dropped data.',
    'These examples are independent. debit and credit only write through the supplied PDO connection to transactional tables and throw on failure. Rollback succeeds. The orders table initially lacks status; DDL is supported.'],
  [['PQ-201','PQ-202','PQ-203','PQ-204'], ['PQ-193','PQ-197'], ['money.php','clone.php'],
    'Money initializes readonly promoted properties and rejects negative cents; the independent Counter clone has distinct identity and changing its scalar value leaves the original value at 1.',
    'Run each file independently. The claim concerns ordinary writes after initialization, not readonly reinitialization during cloning.'],
  [['PQ-213','PQ-214','PQ-215','PQ-216'], ['PQ-205','PQ-209'], ['clock-contract.php','logger-traits.php'],
    'TokenIssuer requires a Clock implementation; the Logger class resolves log to JsonLogger and exposes TextLogger’s implementation as logText.',
    'These examples define independent types. No clock instance is created or method invoked unless the question explicitly says so.'],
  [['PQ-225','PQ-226','PQ-227','PQ-228'], ['PQ-217','PQ-221'], ['aliases.php','front-controller.php'],
    'The aliases select two different fully qualified Invoice classes; the front controller relies on a configured autoloader and container to obtain its handler.',
    'These are independent fragments. The named packages/classes and Composer mapping are installed. The container’s get method resolves the requested class and the request/response contracts provide the shown methods. A use statement does not itself install or load a package.'],
  [['PQ-237','PQ-238','PQ-239','PQ-240'], ['PQ-229','PQ-233'], ['checkout.php','locked-import.php'],
    'OutOfStock is translated into a 409 response while other Throwables are logged and rethrown; the import fragment releases its acquired lock in finally on normal completion or exception unwinding.',
    'The examples are independent. The checkout collaborators exist and logging succeeds. fopen and flock succeed before the import try block; runImport returns or throws, without exit, process termination or another cleanup failure.'],
  [['PQ-249','PQ-250','PQ-251','PQ-252'], ['PQ-241','PQ-245'], ['status.php','attribute.php'],
    'tryFrom returns a matching enum case or null for an unknown string; attribute reflection constructs Route metadata and prints /health without invoking Controller::health.',
    'Run the examples separately. POST status is a string or absent; there is no conflicting Route class.'],
  [['PQ-261','PQ-262','PQ-263','PQ-264'], ['PQ-253','PQ-257'], ['lines.php','fiber.php'],
    'The generator yields lines as requested and closes the handle when it completes or is destroyed; the fiber suspends at start and resumes only when resume supplies data.',
    'The examples are independent. huge.log is readable; process returns normally and iteration completes. Breaking a loop while retaining the generator is not a promise of immediate cleanup.'],
  [['PQ-273','PQ-274','PQ-275','PQ-276'], ['PQ-265','PQ-269'], ['price-test.php','analysis.php'],
    'The test asserts the calculator’s observable result under a stubbed discount; the annotated generic function supplies strings to an int parameter, a type mismatch that analysis can detect.',
    'The first is a PHPUnit fragment with autoloaded collaborators and the specified total contract. The second is a separate PHP analysis example; the type checker understands generic PHPDoc. Passing this one test says nothing about unrelated integrations.'],
  [['PQ-285','PQ-286','PQ-287','PQ-288'], ['PQ-277','PQ-281'], ['http-client.php','response-helper.php'],
    'The client distinguishes transport failure from HTTP errors; PSR-7 withHeader and withStatus return messages, while writing to getBody mutates its stream and may affect another message sharing that stream.',
    'These are independent fragments. cURL is installed; transport outcomes must be controlled in any execution fixture. The response helper receives a PSR-7 response with a writable stream. The client’s >=400 check is not a guarantee of a 2xx response.'],
  [['PQ-297','PQ-298','PQ-299','PQ-300'], ['PQ-289','PQ-293'], ['worker.php','connection.php'],
    'The worker attempts unit-of-work cleanup after each iteration; connection setup checks the DSN and requests a nonpersistent PDO connection. Neither snippet proves all application state is reset.',
    'These are independent contextual fragments. Queue, handler, and entity manager implement the shown operations; reserve eventually returns false. Executing this fragment requires a fixture-provided DATABASE_DSN and PDO driver. This audit lints it without connecting to a database.'],
];

export const PHP_REPAIR_REVISIONS = families.flatMap(([ids, sources, names, behavior, assumptions]) => {
  const originals = sources.map(id => byId.get(id));
  const files = originals.map((q, index) => ({
    name: names[index],
    kind: /require|include|\$_|\$pdo|\$dsn|\$user|fopen|file_get_contents|curl_|PHPUnit|Psr\\|\$queue|\$service|new App\\|new BillingInvoice/.test(q.code.snippet) ? 'php-fragment' : 'php-file',
    snippet: q.code.snippet,
  }));
  if (ids[0] === 'PQ-009') files.push({ name: 'legacy.php', kind: 'php-file', snippet: '<?php\nfunction formatTotal(int $amount): string { return (string) $amount; }\n' });
  if (ids[0] === 'PQ-117') files[1].snippet = files[1].snippet.replace('fgetcsv($handle)', "fgetcsv($handle, escape: '')");
  if (ids[0] === 'PQ-273') files[1].snippet = `<?php
/**
 * @template T
 * @param non-empty-list<T> $items
 * @return T
 */
function first(array $items) { return $items[0]; }
function needsInt(int $id): void {}
needsInt(first(['not', 'numbers']));`;
  return ids.map((id, index) => {
    const old = byId.get(id);
    const options = [...old.coreOptions];
    const misconception = 'Both examples would retain these behaviors if the operators, guards and API calls responsible for them were removed';
    if (index === 0) options[0] = behavior;
    if (index === 1) options[0] = `Keep the relevant mechanism because ${behavior.charAt(0).toLowerCase() + behavior.slice(1)}`;
    if (index === 2) options[0] = `Exercise each example under the stated assumptions and assert: ${behavior}`;
    if (index === 3) { options[0] = misconception; options[1] = behavior; }
    if (index < 2) options[1] = misconception;
    const explanation = `${behavior} ${index === 3 ? 'The selected answer is a false assumption: the behavior depends on the shown mechanisms, not on the labels of the examples.' : 'The files or fragments have the explicitly stated boundaries; they are not one concatenated PHP program.'}`;
    return {
      id, revision: 2, changeKind: 'correctness', status: 'review',
      prompt: old.prompt.replace('integration review across two cooperating code paths', 'review of two separately displayed examples').replace('the displayed code', 'the displayed examples'),
      code: { language: 'php', title: `${old.topic}: two examples`, files, context: 'Read the named files/fragments with the assumptions below; do not concatenate their PHP opening tags.' },
      assumptions, versions: { php: '8.4–8.5', label: 'PHP 8.4–8.5.' },
      options, answer: 0, explanation,
      answerIntent: index === 3 ? 'misconception' : 'behavior',
      learning: {
        trace: behavior,
        rationales: options.map((option, optionIndex) => {
          if (optionIndex === 0) return index === 3 ? 'This is the misconception requested by the stem; removing the responsible mechanism does not preserve its guarantee.' : behavior;
          if (index === 3) return optionIndex === 1 ? `This describes the behavior under the stated assumptions, so it is not the requested misconception. ${behavior}` : 'This is a valid review principle, not the false assumption requested by the stem.';
          if (index === 2) return [null, 'A title assertion checks text, not the values or effects of these examples.', 'Parsing alone cannot verify the runtime results or contract assumptions described here.', 'An unrelated snapshot does not exercise either of the paths shown.'][optionIndex];
          return optionIndex === 1 ? 'The operators and API calls implement the stated behavior; removing them does not preserve it.' : index === 1 ? (optionIndex === 2 ? 'A comment executes no guard or transformation, so it cannot implement the required behavior.' : 'Converting failures to successful-looking values changes the error contract instead of preserving it.') : (optionIndex === 2 ? 'These are PHP operations with runtime effects, not editor-only declarations.' : 'PHP follows the displayed control flow; no mechanism in these examples supplies that replacement behavior.');
        }),
      },
      family: `php-pair-${sources[0]}`,
    };
  });
});
