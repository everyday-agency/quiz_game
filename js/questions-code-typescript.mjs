import { codeLab, codeQuestion as c } from './code-question-helpers.mjs';

const inference = 'Type inference & annotations';
const narrowing = 'Narrowing & control flow';
const objects = 'Objects & structural typing';
const functions = 'Functions & call signatures';
const generics = 'Generics & constraints';
const unions = 'Unions & intersections';
const nullability = 'Nullability & optionality';
const classes = 'Classes & encapsulation';
const modules = 'Modules & resolution';
const asyncCode = 'Async code & promises';
const arrays = 'Arrays, tuples & readonly data';
const literals = 'Literals, enums & satisfies';
const keyofTopic = 'keyof & indexed access';
const mapped = 'Mapped & utility types';
const conditional = 'Conditional & template types';
const runtime = 'Runtime validation & trust';
const errors = 'Errors, unknown & never';
const dom = 'DOM & browser APIs';
const react = 'React with TypeScript';
const node = 'Node & server TypeScript';
const tsconfig = 'TSConfig & compilation';
const declarations = 'Declaration files & libraries';
const testing = 'Testing & type tests';
const refactoring = 'Refactoring & API design';
const performance = 'Type performance & maintainability';

export const typescriptCodeQuestions = [
  ...codeLab(inference, 'typescript', 'How TypeScript parses increment beside addition', String.raw`let count = 1;
const step = 2;

const first = count+++step;
const second = ++count + step;

console.log({ count, first, second });`, [
    c('Foundation', 'How is the expression count+++step parsed by JavaScript and TypeScript?',
      ['As (count++) + step; there is no separate +++ operator', 'As count + (++step)', 'As a syntax for adding three values', 'As count += step'],
      'The lexer recognizes the postfix increment token followed by addition. Spacing it as count++ + step makes the intent much easier to read.'),
    c('Applied', 'What value is assigned to first when count starts at 1 and step is 2?',
      ['3, because postfix increment contributes the old count value', '4, because postfix increment contributes the new value', '2, because step is ignored', 'The expression always throws'],
      'count++ evaluates to 1 and then changes count to 2. The addition therefore computes 1 + 2.'),
    c('Applied', 'What value is assigned to second immediately after the first expression?',
      ['5, because prefix increment changes count from 2 to 3 before addition', '4, because prefix increment returns the old value', '3, because count is reset between statements', '2, because ++ is a type-only operator'],
      'After the first line count is 2. Prefix ++count changes it to 3 and produces 3, then step adds 2.'),
    c('Advanced', 'Why should a team avoid writing count+++step even though it is valid code?',
      ['Its token boundary is visually ambiguous and easy to misread during review', 'TypeScript emits a different operator named +++', 'It changes number into bigint', 'The expression cannot be minified'],
      'Readable spacing communicates the actual operator sequence. Correct parsing is not enough when maintainers can easily infer the wrong behavior.'),
  ]),

  ...codeLab(narrowing, 'typescript', 'Narrowing a union with property and type checks', String.raw`type Input =
  | { kind: "text"; value: string }
  | { kind: "count"; value: number }
  | null;

function format(input: Input): string {
  if (input === null) return "missing";
  if (input.kind === "text") return input.value.trim();
  return input.value.toFixed(0);
}`, [
    c('Foundation', 'What type does input have after the input === null guard has returned?',
      ['The two non-null object members of the union', 'Only the text member', 'unknown', 'never'],
      'The early return removes null from subsequent control flow, leaving the discriminated object union.'),
    c('Applied', 'Why is trim accepted inside the kind === text branch?',
      ['The discriminant narrows value to string in that branch', 'trim exists on every JavaScript value', 'The null check converts number to string', 'TypeScript ignores method calls inside if statements'],
      'A literal discriminant connects the text tag to the string payload, so the compiler can select the matching union member.'),
    c('Applied', 'What type does input have in the final return statement?',
      ['The count member with a numeric value', 'The original union including null', 'The text member', 'Any'],
      'Null and text have already returned, so control-flow analysis leaves only the count variant.'),
    c('Advanced', 'What happens if a third object variant is added without changing the final code?',
      ['The final branch may no longer prove value is number, revealing the missing case', 'TypeScript silently converts the new value to number', 'The new variant is removed at runtime', 'The null check automatically handles every future variant'],
      'Control-flow narrowing follows the actual union. A new unmatched member can make the final numeric operation unsafe and force the code to address it.'),
  ]),

  ...codeLab(objects, 'typescript', 'Structural assignment and excess-property checks', String.raw`type User = { id: number; name: string };

const source = { id: 1, name: "Ada", admin: true };
const fromVariable: User = source;

const fromLiteral: User = {
  id: 1,
  name: "Ada",
  admin: true,
};`, [
    c('Foundation', 'Why is assigning source to fromVariable accepted by structural typing?',
      ['source contains at least the required compatible id and name members', 'The admin member is deleted at runtime', 'User is nominally inherited by source', 'Variables bypass all TypeScript checking'],
      'Structural compatibility asks whether the source has the members required by the target. Additional members can remain on the runtime object.'),
    c('Applied', 'Why does the direct object literal normally produce an excess-property error?',
      ['Fresh object literals receive an extra check for likely misspelled or unintended fields', 'Object literals may contain only one property', 'admin is a reserved JavaScript keyword', 'Type aliases cannot describe object literals'],
      'Excess-property checking is a targeted diagnostic on fresh literals. It catches suspicious fields without changing the underlying structural model.'),
    c('Applied', 'Does fromVariable.admin exist at runtime after the assignment?',
      ['Yes, but the static User type does not expose it', 'No, TypeScript removes extra properties from objects', 'Only when strict mode is disabled', 'It becomes a private field'],
      'Type annotations do not transform the value. The object still has admin, although code typed as User cannot access that member directly.'),
    c('Advanced', 'Which design is strongest if admin is intentionally part of the consumed contract?',
      ['Add it to the target type or define a separate richer type explicitly', 'Cast every object to User and read admin anyway', 'Disable excess-property checking globally', 'Use Object as the target type'],
      'The declared contract should describe intentional capabilities. Assertions and broad Object types hide disagreements instead of modeling them.'),
  ]),

  ...codeLab(functions, 'typescript', 'Overloads and implementation signatures', String.raw`function parse(value: string): number;
function parse(value: number): string;
function parse(value: string | number): string | number {
  return typeof value === "string"
    ? Number(value)
    : String(value);
}

const a = parse("42");
const b = parse(42);`, [
    c('Foundation', 'After these overloaded calls are checked, what static types are inferred for a and b?',
      ['a is number and b is string', 'Both are string | number', 'Both are any', 'a is string and b is number'],
      'Callers see the matching overload signatures, which preserve the relationship between input and output for each supported call.'),
    c('Applied', 'Can a caller pass a variable typed string | number to these two overloads as written?',
      ['Not necessarily; no visible overload accepts the union as one argument type', 'Yes, the implementation signature is always directly callable', 'Yes, unions select both overloads automatically', 'No function with overloads can accept variables'],
      'The implementation signature must cover all overloads internally, but callers are checked against the exposed overload signatures.'),
    c('Applied', 'What is the purpose of the implementation signature?',
      ['Provide one runtime body compatible with every overload', 'Emit two JavaScript functions with the same name', 'Validate JSON automatically', 'Create a generic class'],
      'Overloads exist only in the type layer. JavaScript receives one function implementation that must safely handle the combined input space.'),
    c('Advanced', 'When would a generic conditional return type be preferable to many overloads?',
      ['When one systematic input-output relationship must scale across many types', 'When runtime needs several function bodies', 'When every input should return any', 'When the function has no parameters'],
      'Generics can express a reusable relationship without maintaining a long overload list, provided the resulting type remains readable and sound.'),
  ]),

  ...codeLab(generics, 'typescript', 'Constraining one generic key by another generic type', String.raw`function getProperty<T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key];
}

const project = { id: 7, name: "Portal", active: true };
const name = getProperty(project, "name");
const missing = getProperty(project, "owner");`, [
    c('Foundation', 'Why is the owner call rejected by the compiler?',
      ['owner is not assignable to the keyof project union', 'Generic functions accept only numeric keys', 'project is missing a class constructor', 'getProperty can read only optional members'],
      'K is constrained to actual keys of T, so the second argument cannot name a property absent from the object type.'),
    c('Applied', 'When getProperty receives the name key, what return type is inferred for name?',
      ['string', 'string | number | boolean', 'keyof typeof project', 'unknown'],
      'K is inferred as the specific name literal, and indexed access T[K] selects the corresponding string property type.'),
    c('Applied', 'Why would returning T[keyof T] be less precise than T[K]?',
      ['It would return the union of all property value types instead of the selected key type', 'It would remove every property from T', 'It would make K a runtime validator', 'It would always return never'],
      'T[K] preserves the relationship between the chosen key and its value. T[keyof T] forgets which key was passed.'),
    c('Advanced', 'What runtime guarantee does this generic constraint not provide?',
      ['It does not validate an untrusted object received from JSON', 'It prevents misspelled keys in checked calls', 'It relates a key to its property type', 'It preserves the selected return type'],
      'Generics constrain compile-time values. External runtime data must still be parsed or validated before the object type can be trusted.'),
  ]),

  ...codeLab(unions, 'typescript', 'Exhaustive handling of a discriminated union', String.raw`type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "failure"; error: Error };

function assertNever(value: never): never {
  throw new Error("Unhandled state");
}

function render(state: State): string {
  switch (state.status) {
    case "idle": return "Start";
    case "loading": return "Loading";
    case "success": return state.data.join(", ");
    case "failure": return state.error.message;
    default: return assertNever(state);
  }
}`, [
    c('Foundation', 'Why can the success branch access data without an additional assertion?',
      ['The status discriminant narrows state to the success member', 'Every State member contains data', 'join is available on Error', 'The switch converts state to any'],
      'Matching the literal status selects the union member whose data property is a string array.'),
    c('Applied', 'What static type should state have in the default branch today?',
      ['never, because all union members were handled', 'State', 'unknown', 'Error'],
      'After every known discriminant has a case, no possible State value remains, so exhaustive control flow narrows to never.'),
    c('Applied', 'What happens if a cancelled variant is added without a new case?',
      ['The assertNever call receives a non-never value and the compiler reports the omission', 'cancelled is automatically treated as idle', 'The variant disappears from JavaScript', 'The default branch is deleted'],
      'The exhaustiveness helper turns future union growth into a compile-time reminder at each incomplete switch.'),
    c('Advanced', 'Why is an intersection of all four object members not an alternative model for State?',
      ['It would require incompatible status literals simultaneously rather than represent alternatives', 'Intersections always remove object properties', 'Intersections are runtime arrays', 'A union cannot contain Error'],
      'A union means one of several shapes. Intersecting contradictory literal tags creates an impossible requirement instead of a state machine.'),
  ]),

  ...codeLab(nullability, 'typescript', 'Optional chaining, nullish coalescing, and truthiness', String.raw`type Settings = { retries?: number; label?: string | null };

function normalize(settings: Settings) {
  const retries = settings.retries ?? 3;
  const label = settings.label || "Untitled";
  const length = settings.label?.length;
  return { retries, label, length };
}`, [
    c('Foundation', 'What value does retries keep when settings.retries is 0?',
      ['0, because nullish coalescing falls back only for null or undefined', '3, because 0 is falsy', 'undefined', 'The code throws'],
      'The nullish operator preserves valid falsy values such as zero and only replaces absent nullish values.'),
    c('Applied', 'What value does label receive when settings.label is an empty string?',
      ['Untitled, because logical OR falls back for every falsy value', 'The empty string, because OR checks only null', 'null', 'A compile-time error'],
      'Logical OR uses truthiness, so empty string triggers the fallback. Use ?? when empty string is a valid configured value.'),
    c('Applied', 'After optional chaining is applied to label, what is the static type of length?',
      ['number | undefined', 'number', 'string | null', 'never'],
      'Optional chaining stops on null or undefined and produces undefined; otherwise the string length is a number.'),
    c('Advanced', 'What does a non-null assertion settings.label!.length change?',
      ['Only the compiler assumption; it can still fail at runtime for null or undefined', 'It inserts a runtime null check', 'It replaces null with an empty string', 'It narrows Settings permanently everywhere'],
      'The exclamation mark is erased during compilation. It supplies no runtime evidence that the optional value exists.'),
  ]),

  ...codeLab(classes, 'typescript', 'Compile-time private versus JavaScript private fields', String.raw`class Counter {
  private label = "requests";
  #value = 0;

  increment(): number {
    return ++this.#value;
  }
}

const counter = new Counter();
console.log(counter.increment());`, [
    c('Foundation', 'Which member uses a JavaScript runtime-enforced private field?',
      ['#value', 'label', 'increment', 'counter'],
      'Hash-prefixed fields are native JavaScript private names and cannot be accessed outside the declaring class at runtime.'),
    c('Applied', 'How is the TypeScript private label different from #value?',
      ['label privacy is primarily checked by TypeScript, while #value is enforced by JavaScript', 'label is encrypted and #value is public', 'private label exists only in type declarations and never at runtime', 'There is no difference in emitted behavior'],
      'The private modifier restricts typed access but normally emits an ordinary property. Native # fields have runtime brand checks and privacy.'),
    c('Applied', 'What does the prefix increment return from the first increment call?',
      ['1, because #value is changed before the expression produces a value', '0, because prefix increment returns the old value', 'undefined', 'A Counter instance'],
      'Prefix increment mutates first and evaluates to the new number. Postfix increment would evaluate to the previous number.'),
    c('Advanced', 'How do private or protected members affect structural class compatibility?',
      ['Compatible private members must originate from the same class declaration', 'Private members are ignored in every compatibility check', 'Any two classes with the same private name are compatible', 'They convert TypeScript to nominal typing for all objects'],
      'Private and protected origins add a nominal-like restriction to otherwise structural class instance compatibility.'),
  ]),

  ...codeLab(modules, 'typescript', 'Type-only imports and runtime module output', String.raw`import type { User } from "./types.js";
import { createUser } from "./factory.js";

export function register(name: string): User {
  return createUser({ name });
}`, [
    c('Foundation', 'What happens to the import type line in emitted JavaScript?',
      ['It is erased because User is used only in the type system', 'It becomes a runtime fetch of types.js', 'It creates a User constructor automatically', 'It is converted to require in every module mode'],
      'Type-only imports declare compile-time dependencies and are omitted from runtime output.'),
    c('Applied', 'Why do the relative specifiers include .js in a Node ESM-oriented project even though the source is .ts?',
      ['The emitted runtime module is JavaScript and Node resolves the final .js specifier', 'TypeScript cannot import .ts files internally', 'The extension activates strict mode', 'The extension makes User available at runtime'],
      'With Node-compatible ESM resolution, source specifiers model the paths that the emitted JavaScript runtime will load.'),
    c('Applied', 'After TypeScript emits this module, which import remains in the runtime JavaScript?',
      ['createUser, because the function is called by emitted code', 'User only', 'Neither import', 'Both imports always'],
      'Value imports are preserved when needed by runtime code; type-only symbols are erased.'),
    c('Advanced', 'What error appears if code tries new User after importing it with import type?',
      ['User cannot be used as a runtime value because only its type was imported', 'The constructor runs but returns unknown', 'TypeScript silently changes the import to a value import', 'new is allowed only for interfaces'],
      'A type-only binding has no runtime object. Constructors, instanceof, and static members require a value import.'),
  ]),

  ...codeLab(asyncCode, 'typescript', 'Promise aggregation and failure behavior', String.raw`const jobs = [loadUser(), loadProjects(), loadFlags()];

const all = await Promise.all(jobs);
const settled = await Promise.allSettled(jobs);

for (const result of settled) {
  if (result.status === "fulfilled") console.log(result.value);
  else console.error(result.reason);
}`, [
    c('Foundation', 'What happens to the Promise.all await when one input promise rejects?',
      ['It rejects with that failure without producing the full result tuple', 'It returns only the fulfilled values', 'It converts the failure into undefined', 'It waits and returns status objects'],
      'Promise.all is fail-fast from the caller perspective. Other operations may continue running, but the aggregate promise rejects.'),
    c('Applied', 'What does Promise.allSettled provide that Promise.all does not?',
      ['A result object for every input, including fulfilled and rejected outcomes', 'Automatic retries for rejected operations', 'Cancellation of every promise', 'Runtime validation of each value'],
      'allSettled waits for all inputs and represents each outcome as a discriminated result object.'),
    c('Applied', 'Why does the status check permit access to result.value?',
      ['It narrows the settled-result union to PromiseFulfilledResult', 'Every rejected result also has value', 'console.log casts the result to any', 'Await removes union types'],
      'The status literal discriminates fulfilled from rejected results, exposing value or reason on the matching branch.'),
    c('Advanced', 'What does neither API guarantee about the three underlying operations?',
      ['Neither makes their external side effects atomic or automatically cancellable', 'Neither starts the promises', 'Neither preserves input ordering in results', 'Neither can handle values'],
      'Promise aggregation coordinates observation. It does not create a distributed transaction or undo operations that already ran.'),
  ]),

  ...codeLab(arrays, 'typescript', 'Readonly tuples and variadic inference', String.raw`const route = ["GET", "/projects"] as const;

function defineRoute<const T extends readonly [string, string]>(value: T): T {
  return value;
}

const configured = defineRoute(route);
const method = configured[0];`, [
    c('Foundation', 'After defineRoute returns the readonly tuple, what type is inferred for method?',
      ['The string literal type GET', 'string', 'GET | projects', 'unknown'],
      'as const preserves literal element types and readonly tuple positions, so index zero remains the specific GET literal.'),
    c('Applied', 'Why can route not be passed to a parameter typed [string, string] without readonly?',
      ['A readonly tuple cannot be assigned to a mutable tuple that could change it', 'Readonly tuples contain no values', 'Mutable tuples accept only numbers', 'as const removes array methods at runtime'],
      'A mutable target could write through the reference, violating the source readonly guarantee.'),
    c('Applied', 'What does the const type parameter help preserve for inline tuple arguments?',
      ['Narrow literal information instead of widening each element to string', 'Runtime immutability of every nested object', 'Automatic JSON validation', 'A new JavaScript const variable'],
      'Const type parameters bias inference toward literal-rich readonly shapes; they do not freeze the runtime object.'),
    c('Advanced', 'Does as const deeply freeze route at runtime?',
      ['No; it changes TypeScript inference and readonly checking, not runtime freezing', 'Yes; it calls Object.freeze recursively', 'Yes; arrays become immutable JavaScript primitives', 'No; it converts route to any'],
      'Const assertions are erased. Use Object.freeze or an ownership strategy when runtime mutation must be prevented.'),
  ]),

  ...codeLab(literals, 'typescript', 'Validating shape while preserving literal inference with satisfies', String.raw`type RouteConfig = Record<string, {
  method: "GET" | "POST";
  auth: boolean;
}>;

const routes = {
  projects: { method: "GET", auth: true },
  create: { method: "POST", auth: true },
} satisfies RouteConfig;

const createMethod = routes.create.method;`, [
    c('Foundation', 'Because the object uses satisfies, what exact type is preserved for createMethod?',
      ['The literal type POST', 'GET | POST only', 'string', 'boolean'],
      'satisfies checks compatibility without replacing the expression with the broader target annotation, preserving useful literal inference.'),
    c('Applied', 'How would annotating routes: RouteConfig differ?',
      ['Property reads are generally widened to the RouteConfig value contract', 'It would skip shape validation', 'It would create runtime route objects', 'It would make method a number'],
      'A direct annotation gives the variable the declared broad type. satisfies validates while retaining the expression’s more specific inferred type.'),
    c('Applied', 'What error is caught if one route uses method: DELETE?',
      ['DELETE is not assignable to the allowed GET or POST union', 'The object has too many route names', 'Record forbids boolean values', 'satisfies accepts every string'],
      'The satisfies target checks each route value against the allowed method literals and auth shape.'),
    c('Advanced', 'When this file is compiled to JavaScript, what runtime work does the satisfies operator emit?',
      ['None; it is a compile-time compatibility check', 'A loop that validates every route on startup', 'A JSON schema parser', 'An enum object'],
      'satisfies supplies no runtime validation. Untrusted dynamic configuration still needs a parser.'),
  ]),

  ...codeLab(keyofTopic, 'typescript', 'Indexed access over a selected property key', String.raw`type Project = {
  id: number;
  name: string;
  metadata: { archived: boolean };
};

type ProjectKey = keyof Project;
type Metadata = Project["metadata"];
type AnyProjectValue = Project[ProjectKey];`, [
    c('Foundation', 'After applying keyof to Project, what property-name union does ProjectKey represent?',
      ['id | name | metadata as string literal keys', 'number | string | boolean', 'Only metadata', 'Every possible JavaScript string'],
      'keyof an object type produces a union of its known property keys.'),
    c('Applied', 'After indexed access selects the metadata key, what is the resulting Metadata type?',
      ['An object containing archived: boolean', 'boolean', 'ProjectKey', 'unknown'],
      'Indexed access with a specific key selects exactly the declared property type for metadata.'),
    c('Applied', 'When Project is indexed by the complete key union, what does AnyProjectValue represent?',
      ['The union of number, string, and the metadata object type', 'An intersection requiring all three values at once', 'Only number', 'A runtime array of values'],
      'Indexing by a key union distributes across the corresponding properties and produces their value-type union.'),
    c('Advanced', 'Why can Object.keys(project) not always be typed simply as ProjectKey[] for arbitrary objects?',
      ['Runtime objects may have additional enumerable keys beyond the static type', 'keyof works only on classes', 'Object.keys returns property values', 'ProjectKey is erased into never'],
      'Structural types describe required known members, not an exact sealed runtime shape, so the standard library returns string keys conservatively.'),
  ]),

  ...codeLab(mapped, 'typescript', 'Mapped types that transform property modifiers', String.raw`type Draft<T> = {
  -readonly [K in keyof T]?: T[K];
};

type User = {
  readonly id: number;
  name: string;
  active: boolean;
};

const patch: Draft<User> = { name: "Grace" };`, [
    c('Foundation', 'What does the question mark do to properties in Draft?',
      ['Makes each mapped property optional', 'Removes every property', 'Makes every value nullable only', 'Creates a runtime default'],
      'The optional modifier is applied to each key produced by the mapped type.'),
    c('Applied', 'While Draft maps across User properties, what does the -readonly modifier do?',
      ['Removes the readonly modifier from each selected property', 'Makes the whole object immutable', 'Deletes readonly properties', 'Converts keys to numbers'],
      'A minus mapped modifier removes that modifier from the output property declarations.'),
    c('Applied', 'How does Draft<User> differ from Partial<User>?',
      ['Draft also removes readonly, while Partial only makes properties optional', 'Partial removes all property value types', 'Draft creates runtime cloning code', 'They are always identical for every T'],
      'Partial preserves existing readonly modifiers. This custom mapping deliberately changes both optionality and writability.'),
    c('Advanced', 'What risk appears if Draft is used as the domain model rather than as an update input?',
      ['Required invariants can disappear because every field becomes optional', 'Mapped types validate database rows automatically', 'Readonly fields become encrypted', 'The type gains extra runtime methods'],
      'Utility shapes are useful at boundaries, but weakening every field can allow incomplete state if it leaks into core domain logic.'),
  ]),

  ...codeLab(conditional, 'typescript', 'Conditional inference from Promise-like values and event names', `type AwaitedValue<T> = T extends PromiseLike<infer U> ? U : T;
type EventName<K extends string> = \`on\${Capitalize<K>}\`;

type A = AwaitedValue<Promise<number>>;
type B = AwaitedValue<string>;
type C = EventName<"save">;`, [
    c('Foundation', 'When AwaitedValue receives Promise<number>, what type is inferred for alias A?',
      ['number', 'Promise<number>', 'unknown', 'never'],
      'The conditional matches PromiseLike and infer captures its resolved value type.'),
    c('Applied', 'When AwaitedValue receives a plain string, what type is inferred for alias B?',
      ['string, because the false branch returns T unchanged', 'Promise<string>', 'never', 'unknown'],
      'A plain string does not extend PromiseLike, so the conditional selects the original T.'),
    c('Applied', 'When EventName transforms the save key, what string literal type does alias C produce?',
      ['onSave', 'onsave', 'saveOn', 'string only'],
      'The template literal prefixes on and Capitalize transforms the first character of the key literal.'),
    c('Advanced', 'What happens when a naked union is supplied to AwaitedValue?',
      ['The conditional distributes over each union member', 'The union is always converted to never', 'Only the first union member is examined', 'A runtime loop is emitted'],
      'Conditional types distribute over union members when the checked side is a naked type parameter, then union the individual results.'),
  ]),

  ...codeLab(runtime, 'typescript', 'A runtime type guard for untrusted JSON', String.raw`type Project = { id: number; name: string };

function isProject(value: unknown): value is Project {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === "number"
    && typeof candidate.name === "string";
}

const payload: unknown = JSON.parse(input);
if (!isProject(payload)) throw new Error("Invalid project");
console.log(payload.name.toUpperCase());`, [
    c('Foundation', 'Why is JSON.parse assigned to unknown at the trust boundary?',
      ['Unknown prevents unchecked property use until runtime evidence is established', 'Unknown converts invalid JSON into a Project', 'Unknown is identical to any for property access', 'Unknown skips parsing'],
      'Unknown can hold any runtime value but requires narrowing before operations, containing the untrusted boundary.'),
    c('Applied', 'What does the return type value is Project communicate?',
      ['A true result narrows the checked value to Project for the caller', 'The function constructs a Project class', 'The function always returns a Project object', 'The predicate runs only at compile time'],
      'A type predicate connects the runtime boolean check to control-flow narrowing in calling code.'),
    c('Applied', 'Why must the code check value === null after typeof value === object?',
      ['JavaScript reports typeof null as object', 'Null has every object property', 'TypeScript never narrows typeof checks', 'JSON.parse cannot return null'],
      'The historical JavaScript typeof behavior includes null, so a safe record check must exclude it explicitly.'),
    c('Advanced', 'What limitation remains in this hand-written guard?',
      ['It validates only the fields and rules explicitly implemented', 'It automatically checks every future Project field', 'It changes the JSON object prototype', 'It guarantees database ownership'],
      'A guard is executable validation code. The implementation must evolve with the contract and still does not provide authorization or business invariants.'),
  ]),

  ...codeLab(errors, 'typescript', 'Handling unknown catch variables and exhaustive failure codes', `type Failure =
  | { code: "timeout"; seconds: number }
  | { code: "denied"; reason: string };

function message(failure: Failure): string {
  switch (failure.code) {
    case "timeout": return \`Timed out after \${failure.seconds}s\`;
    case "denied": return failure.reason;
  }
}

try {
  await submit();
} catch (error: unknown) {
  if (error instanceof Error) console.error(error.message);
}`, [
    c('Foundation', 'Why is the catch variable typed unknown instead of Error?',
      ['JavaScript permits throwing values that are not Error instances', 'Unknown catches only network errors', 'Error objects do not exist at runtime', 'Unknown automatically logs the value'],
      'Any JavaScript value can be thrown, so code needs evidence before reading Error-specific properties.'),
    c('Applied', 'What does instanceof Error establish inside the catch block?',
      ['A runtime prototype check that narrows error to Error', 'A compile-time assertion with no runtime work', 'That submit returned an Error', 'That every thrown value is repaired'],
      'instanceof is executable evidence and TypeScript uses its true branch to expose Error members.'),
    c('Applied', 'Why does message not require a default branch for the current Failure union?',
      ['Both discriminant variants return from the switch', 'TypeScript inserts a default automatically', 'Failure is any', 'Switch statements ignore union members'],
      'Control flow knows timeout and denied exhaust the current union, so every reachable path returns a string.'),
    c('Advanced', 'What technique makes a future unhandled Failure code produce an explicit compile error?',
      ['Pass the default-branch value to an assertNever function', 'Cast failure to any before the switch', 'Return an empty string from default', 'Disable strict checking'],
      'An assertNever boundary documents exhaustiveness and makes new union members fail where handling is incomplete.'),
  ]),

  ...codeLab(dom, 'typescript', 'DOM element generics and event target types', String.raw`const form = document.querySelector<HTMLFormElement>("#checkout");
const email = document.querySelector<HTMLInputElement>("#email");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const currentForm = event.currentTarget;
  if (!(currentForm instanceof HTMLFormElement)) return;
  console.log(email?.value, currentForm.action);
});`, [
    c('Foundation', 'Why do form and email still include null despite their generic element types?',
      ['The selector may not match an element at runtime', 'Generics always add null to every type', 'HTML elements exist only during compilation', 'querySelector throws instead of returning null'],
      'The generic refines the kind of matched element, not whether a match exists. Optional chaining handles absence.'),
    c('Applied', 'What does the generic argument to querySelector provide?',
      ['A more specific expected element type for checked property access', 'Runtime validation of the actual tag name', 'Automatic creation of a missing element', 'A CSS selector transformation'],
      'The generic affects static typing. If the selector or DOM is wrong, the browser does not verify the assertion for TypeScript.'),
    c('Applied', 'Why is currentTarget more useful than target for reading the form action here?',
      ['currentTarget is the element whose listener is running; target may be a nested submit control', 'target is always null', 'currentTarget creates a new form', 'target is typed as HTMLFormElement in every event'],
      'Events can originate from descendants. currentTarget represents the listener owner during the callback.'),
    c('Advanced', 'What runtime check is strongest when a selector can be changed independently from this code?',
      ['Verify the returned node with instanceof HTMLFormElement before form-specific operations', 'Add a non-null assertion only', 'Cast the node through any', 'Disable strictNullChecks'],
      'An instanceof check validates both existence and runtime element class, unlike generic arguments and assertions.'),
  ]),

  ...codeLab(react, 'typescript', 'React state inference and typed input events', String.raw`type FormState = { name: string; age: number | null };

function Editor() {
  const [form, setForm] = useState<FormState>({ name: "", age: null });

  const onName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(current => ({ ...current, name: event.currentTarget.value }));
  };

  return <input value={form.name} onChange={onName} />;
}`, [
    c('Foundation', 'Why is the FormState type argument useful for this useState call?',
      ['It preserves the intended number-or-null age contract even though the initial value is null', 'It creates runtime form validation', 'It makes every property optional', 'It converts the component into a class'],
      'Without context, a null initial property can infer too narrowly. The explicit state contract describes valid future values.'),
    c('Applied', 'Why does this input handler use the functional setForm form instead of the captured form value?',
      ['It derives the next object from the latest committed state', 'It mutates current in place', 'It disables React batching', 'It turns the event into a promise'],
      'Functional updates avoid closing over a stale render when several updates are queued or batched.'),
    c('Applied', 'What does ChangeEvent<HTMLInputElement> provide inside onName?',
      ['A typed currentTarget with input-specific properties such as value', 'A guarantee that the event came from the server', 'Automatic numeric parsing of value', 'A runtime check of the JSX tree'],
      'The event generic connects the handler to an input element, giving checked access to its DOM API.'),
    c('Advanced', 'Why is spreading current important in this update?',
      ['useState replaces the state value; it does not shallow-merge object fields', 'React requires every object to be cloned twice', 'Spread validates age at runtime', 'current contains only name'],
      'The updater must preserve fields not being changed because hook state setters replace the entire stored value.'),
  ]),

  ...codeLab(node, 'typescript', 'Node ESM metadata and CommonJS differences', `// package.json contains: "type": "module"
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const filename = fileURLToPath(import.meta.url);
const directory = dirname(filename);

export async function loadPlugin(name: string) {
  return import(\`./plugins/\${name}.js\`);
}`, [
    c('Foundation', 'Why does this ESM module derive filename from import.meta.url?',
      ['CommonJS globals such as __filename are not provided in ESM', 'ESM modules cannot read paths', 'import.meta.url is always a database URL', 'TypeScript removes all Node APIs'],
      'Node ESM exposes module location through import.meta.url rather than the CommonJS __filename and __dirname globals.'),
    c('Applied', 'What does the dynamic import expression return?',
      ['A promise for the loaded module namespace', 'The module namespace synchronously', 'A CommonJS require function', 'Only a TypeScript type'],
      'Dynamic import is asynchronous and resolves to the runtime module namespace object.'),
    c('Applied', 'What security rule should constrain name before constructing this path?',
      ['Allowlist known plugin identifiers rather than accept arbitrary path segments', 'Cast name to any', 'Add a .ts extension from user input', 'Disable ESM'],
      'Dynamic paths are a trust boundary. An allowlist prevents traversal and unintended module loading.'),
    c('Advanced', 'What compiler setting family should match this Node runtime module behavior?',
      ['A Node-aware module and moduleResolution mode such as NodeNext', 'DOM-only lib with module none', 'target ES3 and no resolution', 'jsx preserve only'],
      'Node-aware modes model package type, ESM/CJS boundaries, file extensions, and conditional exports using Node semantics.'),
  ]),

  ...codeLab(tsconfig, 'json', 'Strict indexed access and exact optional properties', String.raw`{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noEmitOnError": true
  }
}`, [
    c('Foundation', 'What type does noUncheckedIndexedAccess add to an array or dictionary lookup that may miss?',
      ['undefined', 'null only', 'never', 'any'],
      'Unchecked indexing cannot prove the key exists, so the option adds undefined and requires a guard or stronger data structure.'),
    c('Applied', 'With exactOptionalPropertyTypes, how does property?: string differ from property: string | undefined?',
      ['The optional property may be absent, but assigning explicit undefined is not automatically the same contract', 'There is never any difference', 'Optional properties become required', 'The option changes runtime object deletion'],
      'Exact optional types distinguish absence from a present property whose value is undefined unless undefined is explicitly included.'),
    c('Applied', 'When the project contains a type error, what output does noEmitOnError prevent?',
      ['Writing JavaScript output when the project has type-checking errors', 'Executing JavaScript with runtime exceptions', 'Importing declaration files', 'Reading source maps'],
      'The flag controls compiler output. It cannot guarantee that successfully checked JavaScript has no runtime failures.'),
    c('Advanced', 'Across this compiler configuration, what does the strict option enable conceptually?',
      ['A family of stricter type-checking options that expose more uncertainty', 'Runtime schema validation for JSON', 'Automatic unit tests', 'Nominal typing for every interface'],
      'Strict mode strengthens static analysis but remains a compile-time system; runtime inputs still need executable validation.'),
  ]),

  ...codeLab(declarations, 'typescript', 'Module augmentation of an existing library contract', String.raw`import "express-session";
import type { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
    tenantId?: string;
  }
}

export function requireUser(session: SessionData): string {
  return session.userId;
}`, [
    c('Foundation', 'In this declaration file, what does the declare module block do to express-session?',
      ['Augments the existing express-session module declaration', 'Downloads a new runtime package', 'Replaces every interface in the library', 'Creates a database session'],
      'Module augmentation merges additional declarations into the library’s existing module contract.'),
    c('Applied', 'Why import express-session before the augmentation?',
      ['It ensures the file is a module and references the declaration being augmented', 'It executes every session at compile time', 'It makes userId optional', 'Imports are required for all interfaces'],
      'The side-effect import establishes module context and makes the target package declaration part of the compilation.'),
    c('Applied', 'Does this augmentation create userId on runtime session objects?',
      ['No; application code must still assign and maintain the runtime property', 'Yes; interfaces allocate runtime storage', 'Yes; declaration merging writes to Redis', 'No; userId can never exist'],
      'Declaration files describe values; they do not construct or initialize those values.'),
    c('Advanced', 'Why can making userId required be unsafe if anonymous sessions exist?',
      ['The declaration would promise a value that some runtime sessions do not contain', 'Required properties are slower at runtime', 'Express rejects strings', 'Augmentations cannot use optional members'],
      'Ambient contracts must truthfully model every runtime state. A guard or optional property may be necessary before authentication.'),
  ]),

  ...codeLab(testing, 'typescript', 'Negative type tests with ts-expect-error', String.raw`type UserId = string & { readonly __brand: "UserId" };

declare function loadUser(id: UserId): Promise<void>;

const raw = "user-42";

// @ts-expect-error plain strings must not cross this boundary
loadUser(raw);

const id = raw as UserId;
loadUser(id);`, [
    c('Foundation', 'What does ts-expect-error require on the following line?',
      ['At least one TypeScript error; otherwise the directive itself reports a problem', 'The line must compile without any diagnostic', 'A runtime exception must be thrown', 'The function must return never'],
      'The directive is useful for negative tests because it fails when the expected type rejection disappears.'),
    c('Applied', 'Why would replacing ts-expect-error with ts-ignore make this negative type test weaker?',
      ['It suppresses diagnostics even if the line later becomes valid', 'It executes the line twice', 'It works only in JavaScript files', 'It turns errors into warnings at runtime'],
      'ts-ignore does not verify that an error still exists, so a regression in the intended boundary can pass silently.'),
    c('Applied', 'What does the UserId brand prevent structurally?',
      ['An ordinary string from being accepted without an explicit construction or assertion step', 'A UserId from being serialized', 'All string operations on an ID', 'Runtime forgery of the string'],
      'The extra phantom member makes the static type distinct from plain string, but it does not create runtime validation.'),
    c('Advanced', 'What production design is stronger than scattering as UserId assertions?',
      ['A constructor or parser that validates input and returns UserId', 'Casting every string through any', 'Removing the brand', 'Using Object for all identifiers'],
      'Central construction combines runtime evidence with the branded output and makes trust-boundary crossings auditable.'),
  ]),

  ...codeLab(refactoring, 'typescript', 'An options object and branded identifiers at an API boundary', String.raw`type ProjectId = string & { readonly __brand: "ProjectId" };

type LoadOptions = {
  includeArchived?: boolean;
  signal?: AbortSignal;
};

async function loadProject(
  id: ProjectId,
  options: LoadOptions = {},
): Promise<Project> {
  return repository.load(id, options);
}`, [
    c('Foundation', 'What maintainability benefit does LoadOptions provide over several positional booleans?',
      ['Call sites name their intent and new optional capabilities can be added compatibly', 'Options objects validate all values at runtime', 'Positional parameters cannot be typed', 'The function becomes synchronous'],
      'Named options reduce ambiguous calls and allow additive evolution without shifting every parameter position.'),
    c('Applied', 'For callers of loadProject, what does the default empty options object permit?',
      ['Calling loadProject with only the required ID', 'Calling without an ID', 'Returning undefined instead of Project', 'Skipping repository execution'],
      'The options parameter is optional as a whole because a default value is supplied, while the branded ID remains required.'),
    c('Applied', 'At this asynchronous API boundary, what use case does the optional AbortSignal support?',
      ['Cooperative cancellation of an in-flight asynchronous operation', 'Automatic database transaction rollback', 'Runtime validation of ProjectId', 'Retrying every failed request'],
      'AbortSignal gives callers a standard cancellation channel, provided the implementation and underlying APIs honor it.'),
    c('Advanced', 'What compatibility risk appears if includeArchived later changes from boolean to a string mode?',
      ['Existing callers and implementations rely on the old property type and need an explicit migration', 'Options object properties may change type silently', 'TypeScript converts booleans to strings automatically', 'Optional properties never affect compatibility'],
      'Named options help additive changes, but changing the meaning or type of an existing field is still a breaking contract change.'),
  ]),

  ...codeLab(performance, 'typescript', 'Controlling recursive conditional-type depth', String.raw`type DeepReadonly<T, Seen = never> =
  T extends Seen ? T :
  T extends (...args: any[]) => any ? T :
  T extends object ? {
    readonly [K in keyof T]: DeepReadonly<T[K], Seen | T>
  } : T;

type Node = { value: string; next?: Node };
type FrozenNode = DeepReadonly<Node>;`, [
    c('Foundation', 'Why is the function branch handled before the general object branch?',
      ['Functions are objects but should keep their callable signature instead of mapping their members', 'Functions cannot appear in conditional types', 'The branch executes functions at compile time', 'Object types exclude functions automatically'],
      'Without the special case, the mapped object branch can transform function structure and lose the intended call signature.'),
    c('Applied', 'What problem does Seen attempt to limit for recursive object graphs?',
      ['Revisiting the same type indefinitely during recursive expansion', 'Runtime circular JSON serialization', 'Database deadlocks', 'JavaScript garbage collection'],
      'The accumulator records visited static types so the conditional can stop when a recursive structure refers back to itself.'),
    c('Applied', 'What property modifier does the mapped branch add?',
      ['readonly to every traversed property', 'optional to every property', 'private to every property', 'static to every property'],
      'The mapped member uses the readonly modifier while recursively transforming each value type.'),
    c('Advanced', 'Why can a simpler, shallower utility be better for a public library API?',
      ['Complex recursive types can slow checking and produce unreadable diagnostics', 'Recursive types always emit large JavaScript functions', 'Mapped types cannot be exported', 'Readonly is ignored by editors'],
      'Type-level power has a usability and compiler-cost budget. A smaller contract can be easier to understand, infer, and maintain.'),
  ]),
];
