import { roadmapBank } from './roadmap-question-helpers.mjs';

const s = (topic, concepts, lessons) => ({ topic, concepts, lessons });
const l = (title, snippet, behavior, pitfall) => ({ title, snippet, behavior, pitfall });

const specs = [
  s('Type inference & annotations', ['TypeScript vs JavaScript', 'interoperability', 'primitive types', 'object types', 'type inference'], [
    l('Literal widening across mutable and immutable bindings', String.raw`const protocol = 'https';
let retryMode = 'fast';

const config = {
  protocol,
  retryMode,
};

type Protocol = typeof protocol;
type RetryMode = typeof retryMode;`, 'Protocol is the literal type https while RetryMode widens to string because the let binding may change', 'const makes every nested object property deeply readonly and preserves every property as a literal forever'),
    l('Annotating a boundary while keeping local inference', String.raw`type Invoice = { id: string; total: number };

function summarize(invoice: Invoice) {
  const tax = invoice.total * 0.077;
  return { id: invoice.id, gross: invoice.total + tax };
}

const result = summarize({ id: 'A-10', total: 100 });`, 'the parameter annotation checks the external shape while tax and the returned object properties are inferred from their expressions', 'every local variable and return value must be manually annotated before TypeScript checks the function'),
  ]),
  s('Narrowing & control flow', ['typeof', 'instanceof', 'equality', 'truthiness', 'in operator', 'type predicates'], [
    l('Narrowing an unknown value with built-in checks', String.raw`function size(value: unknown): number {
  if (typeof value === 'string') return value.length;
  if (Array.isArray(value)) return value.length;
  if (value instanceof Map) return value.size;

  return 0;
}`, 'each branch exposes only the operations proved by its runtime check and the final branch safely handles every other unknown value', 'annotating a value as unknown permits property access because unknown behaves like any'),
    l('User-defined predicate filtering a union', String.raw`type Entry = { id: string; active: boolean } | null;

function isActive(entry: Entry): entry is Exclude<Entry, null> {
  return entry !== null && entry.active;
}

const active = entries.filter(isActive);
active[0]?.id.toUpperCase();`, 'the predicate tells TypeScript that filtered elements are non-null objects, matching the runtime condition', 'the predicate converts null elements into objects at runtime rather than merely describing the successful branch'),
  ]),
  s('Objects & structural typing', ['object types', 'type compatibility', 'type aliases', 'interfaces', 'excess properties'], [
    l('Structural compatibility retains extra runtime fields', String.raw`type Named = { name: string };

const employee = {
  name: 'Ada',
  department: 'Research',
};

const named: Named = employee;
console.log(employee.department, named.name);`, 'employee is assignable because it has the required name member and its extra department field remains on the runtime object', 'assigning to Named deletes department from employee so the original object is transformed'),
    l('Fresh literal excess-property diagnostics', String.raw`interface ConnectionOptions {
  host: string;
  secure?: boolean;
}

const options: ConnectionOptions = {
  host: 'db.internal',
  secrue: true,
};`, 'the misspelled fresh-literal property is rejected because it is not part of ConnectionOptions', 'optional secure means any similarly spelled property is accepted and renamed during JavaScript emission'),
  ]),
  s('Functions & call signatures', ['typing functions', 'call signatures', 'overloads', 'callbacks', 'optional parameters', 'variadic functions'], [
    l('Overloads expose precise caller-facing results', String.raw`function normalize(value: string): string;
function normalize(value: string[]): string[];
function normalize(value: string | string[]): string | string[] {
  return Array.isArray(value)
    ? value.map(item => item.trim())
    : value.trim();
}

const one = normalize(' Ada ');
const many = normalize([' Ada ', ' Lin ']);`, 'one is inferred as string and many as string array because callers see the matching overload signature', 'callers use only the broad implementation signature and therefore both results are always string or string array'),
    l('Rest parameters preserve variadic element types', String.raw`type Listener = (event: string, ...ids: number[]) => void;

const audit: Listener = (event, ...ids) => {
  console.log(event, ids.reduce((sum, id) => sum + id, 0));
};

audit('selected', 10, 20, 30);`, 'the first argument must be a string and every remaining variadic argument must be a number collected into number array', 'a rest parameter disables argument checking after the first position and produces unknown array'),
  ]),
  s('Generics & constraints', ['generic types', 'generic constraints', 'key relationships', 'reusable APIs'], [
    l('Key-constrained property access preserves value types', String.raw`function read<T extends object, K extends keyof T>(
  object: T,
  key: K,
): T[K] {
  return object[key];
}

const user = { id: 10, name: 'Ada', active: true };
const id = read(user, 'id');
const active = read(user, 'active');`, 'id is number and active is boolean because K preserves the relationship between each valid key and its indexed value', 'keyof forces every property result to become string because object keys are represented as strings'),
    l('A generic constraint permits required operations', String.raw`type WithLength = { length: number };

function longest<T extends WithLength>(left: T, right: T): T {
  return left.length >= right.length ? left : right;
}

const winner = longest([1, 2, 3], [4, 5]);
const text = longest('typescript', 'php');`, 'the constraint allows length access while the return type remains the specific common argument type', 'extends WithLength converts arrays and strings into the WithLength object and loses their original methods'),
  ]),
  s('Unions & intersections', ['union types', 'intersection types', 'discriminated unions', 'exhaustiveness'], [
    l('Exhaustive discriminated-union switching', String.raw`type Result =
  | { kind: 'ok'; value: string }
  | { kind: 'error'; message: string };

function render(result: Result): string {
  switch (result.kind) {
    case 'ok': return result.value;
    case 'error': return result.message;
    default: return result satisfies never;
  }
}`, 'each case receives its matching payload and adding an unhandled variant makes the never exhaustiveness check fail', 'the default branch runs for every valid result and converts unmatched objects into never at runtime'),
    l('An impossible intersection collapses a conflicting field', String.raw`type NumericId = { id: number };
type TextId = { id: string };
type Impossible = NumericId & TextId;

declare const value: Impossible;
type Id = typeof value.id;

// Id is never: no value can be both number and string.`, 'the intersected id property is never because a value cannot simultaneously satisfy number and string', 'an intersection chooses the right-hand id type and silently discards the left-hand requirement'),
  ]),
  s('Nullability & optionality', ['null', 'undefined', 'optional properties', 'optional chaining', 'nullish coalescing', 'non-null assertion'], [
    l('Nullish coalescing preserves valid falsy values', String.raw`type Settings = { retries?: number; label?: string | null };

function normalize(settings: Settings) {
  return {
    retries: settings.retries ?? 3,
    label: settings.label ?? 'Untitled',
  };
}

normalize({ retries: 0, label: '' });`, 'zero retries and an empty label are preserved because only null and undefined trigger the defaults', 'nullish coalescing treats zero, false, and empty string as missing in the same way as logical OR'),
    l('Optional chaining stops only at the optional boundary', String.raw`type Account = {
  profile?: { address?: { city: string } };
};

function city(account: Account): string {
  return account.profile?.address?.city ?? 'Unknown';
}

const result = city({ profile: {} });`, 'the chain produces undefined when profile or address is absent and the final coalescing expression returns Unknown', 'one optional-chain operator at the first property automatically protects every later property access'),
  ]),
  s('Classes & encapsulation', ['classes', 'constructor parameters', 'access modifiers', 'abstract classes', 'inheritance', 'polymorphism', 'method overriding'], [
    l('ECMAScript private fields enforce runtime privacy', String.raw`class Counter {
  #value = 0;

  increment(): number {
    return ++this.#value;
  }
}

const counter = new Counter();
counter.increment();
// counter.#value is a syntax error outside the class.`, 'the hash-prefixed field is private in emitted JavaScript as well as in TypeScript checking', 'a hash-prefixed field is merely a compile-time convention and becomes a public value property at runtime'),
    l('Abstract methods and override checking', String.raw`abstract class Formatter {
  abstract format(value: number): string;
}

class CurrencyFormatter extends Formatter {
  override format(value: number): string {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency', currency: 'CHF',
    }).format(value);
  }
}`, 'the abstract class requires concrete subclasses to implement the compatible method and override documents the inherited member', 'abstract supplies a default runtime implementation so subclasses may omit format without becoming abstract'),
  ]),
  s('Modules & resolution', ['external modules', 'ambient modules', 'namespaces', 'type-only imports', 'module resolution'], [
    l('Type-only imports disappear from emitted JavaScript', String.raw`import type { User } from './types.js';
import { loadUser } from './api.js';

export async function label(id: string): Promise<string> {
  const user: User = await loadUser(id);
  return user.name.toUpperCase();
}`, 'the User import is used only during checking and is erased, while loadUser remains a runtime import', 'import type loads the module for side effects but disables TypeScript checking of the imported name'),
    l('NodeNext source specifiers describe emitted module paths', String.raw`// math.ts
export const double = (value: number) => value * 2;

// app.ts under moduleResolution: NodeNext
import { double } from './math.js';

console.log(double(21));`, 'the TypeScript source uses the JavaScript extension that the Node ESM runtime will resolve after emission', 'NodeNext requires the TypeScript extension in every emitted JavaScript import specifier'),
  ]),
  s('Async code & promises', ['async functions', 'Promise', 'Awaited', 'Promise.all', 'allSettled'], [
    l('Promise.all keeps tuple positions and fails fast', String.raw`const tasks = [
  Promise.resolve(42),
  Promise.resolve('ready'),
] as const;

const [count, status] = await Promise.all(tasks);
count.toFixed(0);
status.toUpperCase();`, 'the result preserves number and string positions and the combined promise rejects if either input rejects', 'Promise.all waits for every rejection and returns status objects instead of rejecting'),
    l('allSettled requires explicit result discrimination', String.raw`const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/teams'),
]);

for (const result of results) {
  if (result.status === 'fulfilled') {
    console.log(result.value.status);
  } else {
    console.error(result.reason);
  }
}`, 'the status discriminant separates fulfilled values from rejection reasons without rejecting the aggregate promise', 'allSettled narrows every result to fulfilled because network failures are converted into successful Response values'),
  ]),
  s('Arrays, tuples & readonly data', ['arrays', 'tuples', 'readonly arrays', 'variadic tuples'], [
    l('Readonly tuple positions preserve literal meaning', String.raw`const route = ['/users', 25, true] as const;

type Path = typeof route[0];
type Limit = typeof route[1];

function request(args: readonly [string, number, boolean]) {
  return { path: args[0], limit: args[1], cache: args[2] };
}

request(route);`, 'the tuple retains ordered literal elements and is accepted by a readonly tuple parameter without permitting mutation', 'as const freezes the nested runtime value recursively and throws whenever JavaScript code attempts mutation'),
    l('Variadic tuple composition preserves argument order', String.raw`type WithCallback<T extends unknown[]> = [
  ...T,
  (error?: Error) => void,
];

type ReadArgs = WithCallback<[path: string, encoding: string]>;

const args: ReadArgs = [
  '/tmp/report.txt',
  'utf8',
  error => console.error(error),
];`, 'the resulting tuple requires path then encoding then the callback with their labels and types preserved', 'the rest element turns every tuple position into an unordered union of all element types'),
  ]),
  s('Literals, enums & satisfies', ['literal types', 'enums', 'as const', 'satisfies keyword'], [
    l('satisfies checks shape without widening useful literals', String.raw`type RouteTable = Record<string, {
  method: 'GET' | 'POST';
  path: string;
}>;

const routes = {
  users: { method: 'GET', path: '/users' },
  login: { method: 'POST', path: '/login' },
} satisfies RouteTable;

const loginMethod = routes.login.method;`, 'the object is checked against RouteTable while loginMethod remains the literal type POST', 'satisfies changes the variable type exactly to RouteTable and erases all specific property information'),
    l('String-enum members provide a closed runtime set', String.raw`enum Status {
  Draft = 'draft',
  Published = 'published',
}

function canEdit(status: Status): boolean {
  return status === Status.Draft;
}

canEdit(Status.Published);`, 'Status exists at runtime and the parameter accepts members of that enum rather than arbitrary strings', 'string enums are erased like type aliases and therefore Status.Published has no runtime value'),
  ]),
  s('keyof & indexed access', ['keyof operator', 'indexed access types', 'generic property access', 'optional keys'], [
    l('Indexed access derives a property type from the model', String.raw`type ApiResponse = {
  data: {
    id: string;
    attributes: { title: string; views: number };
  };
};

type Attributes = ApiResponse['data']['attributes'];
type Views = Attributes['views'];

const views: Views = 10;`, 'Views is number and stays synchronized with the nested model instead of repeating the type manually', 'indexed access reads a live object property at runtime and therefore requires an ApiResponse value'),
    l('keyof constrains a patch helper to real properties', String.raw`function patch<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K],
): void {
  target[key] = value;
}

const user = { name: 'Ada', age: 30 };
patch(user, 'age', 31);`, 'the key must exist on the target and the value type must match the selected property', 'T[K] is always the union of every target property even when K is one specific key'),
  ]),
  s('Mapped & utility types', ['mapped types', 'Partial', 'Pick', 'Omit', 'Readonly', 'Record', 'Exclude', 'Extract'], [
    l('Mapped modifiers build a mutable required form', String.raw`type Draft = {
  readonly title?: string;
  readonly body?: string;
};

type CompleteMutable<T> = {
  -readonly [K in keyof T]-?: T[K];
};

type Published = CompleteMutable<Draft>;

const article: Published = { title: 'Types', body: 'Mapped' };`, 'the mapped type removes readonly and optional modifiers from each original key', 'minus modifiers delete the properties themselves and produce an empty object type'),
    l('Utility types expose a deliberate public projection', String.raw`type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

type PublicUser = Readonly<
  Omit<User, 'passwordHash'>
>;

function present(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}`, 'the returned type excludes passwordHash and marks the remaining public properties readonly to consumers', 'Omit removes passwordHash from the original runtime user object before the function executes'),
  ]),
  s('Conditional & template types', ['conditional types', 'infer', 'template literal types', 'recursive types'], [
    l('Conditional inference unwraps promise results', String.raw`type Result<T> = T extends Promise<infer Value>
  ? Value
  : T;

type A = Result<Promise<{ id: string }>>;
type B = Result<number>;

const a: A = { id: 'A-1' };
const b: B = 42;`, 'A is the inferred promised object type while B remains number because it does not match Promise', 'infer executes the promise at compile time to inspect the value it will eventually resolve with'),
    l('Template literal types derive event names', `type EventName<K extends string> = \`on\${Capitalize<K>}\`;

type Field = 'save' | 'cancel';
type HandlerName = EventName<Field>;

const save: HandlerName = 'onSave';
const cancel: HandlerName = 'onCancel';`, 'HandlerName becomes the union onSave or onCancel by distributing over the input literal union', 'template literal types build and register JavaScript event handlers at runtime'),
  ]),
  s('Runtime validation & trust', ['unknown', 'runtime validation', 'type predicates', 'schema validation', 'trusted boundaries'], [
    l('Parsing untrusted JSON into unknown before checking', String.raw`type User = { id: string; active: boolean };

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string'
    && typeof record.active === 'boolean';
}

const value: unknown = JSON.parse(payload);
if (!isUser(value)) throw new Error('Invalid user');
console.log(value.id);`, 'the runtime predicate checks the untrusted shape before TypeScript permits User-specific access', 'declaring the parsed value as User would cause JSON.parse to validate and coerce the fields automatically'),
    l('Schema validation returns typed parsed output', String.raw`const SettingsSchema = z.object({
  theme: z.enum(['light', 'dark']),
  pageSize: z.number().int().min(1).max(100),
});

type Settings = z.infer<typeof SettingsSchema>;

const result = SettingsSchema.safeParse(JSON.parse(input));
if (!result.success) return result.error.issues;
const settings: Settings = result.data;`, 'safeParse reports validation issues without throwing and successful data has the type inferred from the same schema', 'z.infer alone validates the JSON and safeParse is needed only to improve editor autocomplete'),
  ]),
  s('Errors, unknown & never', ['unknown catch variables', 'never', 'exhaustiveness', 'custom errors'], [
    l('Narrowing an unknown caught value safely', String.raw`try {
  await importUsers(file);
} catch (error: unknown) {
  if (error instanceof ValidationError) {
    console.error(error.issues);
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Non-Error rejection', error);
  }
}`, 'the catch block proves each available property before reading it and still handles non-Error rejections', 'every JavaScript rejection is guaranteed to be an Error instance with a message property'),
    l('A never helper makes missing cases visible', String.raw`type Action =
  | { type: 'add'; value: number }
  | { type: 'reset' };

function unreachable(value: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(value));
}

function reduce(state: number, action: Action): number {
  if (action.type === 'add') return state + action.value;
  if (action.type === 'reset') return 0;
  return unreachable(action);
}`, 'action narrows to never only after every union member is handled, so adding a variant exposes the missing branch', 'calling a never-returning function tells JavaScript to skip the call and continue with an undefined value'),
  ]),
  s('DOM & browser APIs', ['DOM types', 'event targets', 'instanceof', 'query selectors', 'browser APIs'], [
    l('Narrowing a queried element before using form APIs', String.raw`const element = document.querySelector('#checkout');

if (!(element instanceof HTMLFormElement)) {
  throw new Error('Checkout form is missing');
}

element.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(element);
  console.log(data.get('email'));
});`, 'the instanceof guard proves the element is a form before FormData and form-specific behavior are used', 'querySelector infers HTMLFormElement solely from the id text checkout and can never return null'),
    l('Using currentTarget with a typed event handler', String.raw`function handleInput(event: InputEvent): void {
  const target = event.currentTarget;
  if (!(target instanceof HTMLInputElement)) return;

  target.value = target.value.trimStart();
}

const input = document.querySelector<HTMLInputElement>('#name');
input?.addEventListener('input', handleInput);`, 'the runtime guard handles currentTarget safely and the optional call handles a missing queried element', 'the generic querySelector argument inserts an input into the DOM when no matching element exists'),
  ]),
  s('React with TypeScript', ['React props', 'component typing', 'events', 'children', 'hooks'], [
    l('A discriminated prop union forbids conflicting modes', String.raw`type ButtonProps =
  | { kind: 'link'; href: string; onClick?: never }
  | { kind: 'button'; href?: never; onClick: () => void };

function Action(props: ButtonProps) {
  return props.kind === 'link'
    ? <a href={props.href}>Open</a>
    : <button onClick={props.onClick}>Run</button>;
}`, 'the kind branch exposes the matching required prop and prevents callers from mixing href with the button callback', 'optional never means callers may freely provide both props because never behaves like any'),
    l('Typing a controlled input event and state', String.raw`function SearchBox() {
  const [query, setQuery] = useState('');

  function change(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.currentTarget.value);
  }

  return <input value={query} onChange={change} />;
}`, 'the event type exposes an HTML input currentTarget and the input value is controlled by React state', 'ChangeEvent automatically writes the input value into query even if setQuery is removed'),
  ]),
  s('Node & server TypeScript', ['Node ESM', 'server APIs', 'environment validation', 'package boundaries'], [
    l('Validating process environment before constructing config', String.raw`const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;`, 'string environment values are validated and PORT is deliberately coerced before typed configuration is exported', 'annotating process.env makes the operating system provide a number for PORT at runtime'),
    l('Dynamic ESM import returns a module promise', `type Adapter = {
  send(message: string): Promise<void>;
};

async function loadAdapter(name: 'console' | 'smtp'): Promise<Adapter> {
  const module = await import(\`./adapters/\${name}.js\`);
  return module.default;
}

const adapter = await loadAdapter('smtp');
await adapter.send('ready');`, 'the dynamic import is awaited and the default export must satisfy the Adapter contract returned to callers', 'import with a template path is synchronous and returns the default adapter directly'),
  ]),
  s('TSConfig & compilation', ['installation', 'tsconfig.json', 'compiler options', 'tsc', 'ts-node', 'TS Playground', 'build tools'], [
    l('Separating emitted syntax from available global types', String.raw`{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "noEmit": true
  }
}`, 'target controls assumed emitted syntax, lib supplies type declarations such as DOM, and noEmit makes this project a checker only', 'including DOM installs browser APIs into a Node runtime and target polyfills every missing feature'),
    l('Project references split checking into buildable units', String.raw`{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/web" }
  ]
}

// Each referenced project enables:
// "compilerOptions": { "composite": true }`, 'tsc build mode can order and incrementally rebuild referenced composite projects through their declared dependency graph', 'references merge every package into one global namespace and disable module boundaries'),
  ]),
  s('Declaration files & libraries', ['declaration files', 'ambient modules', 'module augmentation', 'global augmentation', 'library types'], [
    l('Module augmentation extends an existing library contract', String.raw`import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    flash?: string;
  }
}

app.use((request, _response, next) => {
  request.session.userId = 'U-10';
  next();
});`, 'the existing express-session SessionData interface is merged so consumers see the application fields', 'declare module replaces the installed package implementation and emits a new JavaScript session library'),
    l('An ambient module describes an untyped runtime package', String.raw`// legacy-parser.d.ts
declare module 'legacy-parser' {
  export interface Result { tokens: string[] }
  export function parse(source: string): Result;
}

// consumer.ts
import { parse } from 'legacy-parser';
const result = parse('a + b');
result.tokens.map(token => token.toUpperCase());`, 'the declaration supplies compile-time types for a package whose runtime implementation is loaded separately', 'the d.ts file implements parse and is sufficient even when no runtime package exists'),
  ]),
  s('Testing & type tests', ['testing', 'type tests', 'ts-expect-error', 'Vitest', 'compile-time contracts'], [
    l('A negative type test must continue producing an error', String.raw`type UserId = string & { readonly __brand: 'UserId' };

declare function loadUser(id: UserId): Promise<User>;
declare const userId: UserId;

loadUser(userId);

// @ts-expect-error ordinary strings must stay rejected
loadUser('U-10');`, 'the directive passes only while the following line has a type error and reports a failure if the API becomes too permissive', 'ts-expect-error disables all TypeScript errors in the file and remains silent when no error exists'),
    l('A typed mock preserves the dependency contract', String.raw`type Gateway = {
  charge(amount: number): Promise<{ id: string }>;
};

const gateway: Gateway = {
  charge: vi.fn(async amount => ({ id: 'pay-' + amount })),
};

const receipt = await checkout(gateway, 25);
expect(receipt.paymentId).toBe('pay-25');`, 'the mock implementation must satisfy Gateway and the test observes the behavior of checkout through that contract', 'vi.fn automatically proves that checkout uses the real network gateway correctly'),
  ]),
  s('Refactoring & API design', ['type-safe APIs', 'branded types', 'options objects', 'public contracts', 'backward compatibility'], [
    l('Branded identifiers prevent accidental cross-entity calls', String.raw`type Brand<Value, Name extends string> = Value & {
  readonly __brand: Name;
};

type UserId = Brand<string, 'UserId'>;
type ProjectId = Brand<string, 'ProjectId'>;

declare function assign(user: UserId, project: ProjectId): void;
declare const userId: UserId;
declare const projectId: ProjectId;

assign(userId, projectId);`, 'the nominal brand distinguishes otherwise identical string identifiers so argument order mistakes are rejected', 'brands add hidden properties to every runtime string and therefore change serialized identifiers'),
    l('An options object evolves without positional ambiguity', String.raw`type RequestOptions = {
  timeoutMs?: number;
  retries?: number;
  signal?: AbortSignal;
};

async function request(url: URL, options: RequestOptions = {}) {
  const { timeoutMs = 5000, retries = 2, signal } = options;
  return send(url, { timeoutMs, retries, signal });
}

request(new URL('/api', location.href), { retries: 0 });`, 'named optional fields let callers set retries to zero without supplying unrelated positional arguments', 'the defaulting expression treats zero retries as missing and replaces it with two'),
  ]),
  s('Type performance & maintainability', ['recursive types', 'conditional-type performance', 'project references', 'readable public types'], [
    l('Depth-limited recursion keeps a path type tractable', `type Prev = [never, 0, 1, 2, 3, 4, 5];

type Paths<T, Depth extends number = 5> =
  [Depth] extends [never] ? never :
  T extends object ? {
    [K in keyof T & string]:
      K | \`\${K}.\${Paths<T[K], Prev[Depth]>}\`
  }[keyof T & string] : never;

type ConfigPath = Paths<AppConfig>;`, 'the explicit depth parameter bounds recursive instantiation instead of expanding an arbitrarily deep object forever', 'TypeScript recursive types are evaluated only at runtime so their depth cannot affect editor or build performance'),
    l('Naming intermediate types reduces repeated expansion', String.raw`type ApiEntity = User | Team | Project | Invoice;

type EntityByKind = {
  [Entity in ApiEntity as Entity['kind']]: Entity
};

type EntityKind = keyof EntityByKind;

function find<K extends EntityKind>(
  kind: K,
  id: string,
): Promise<EntityByKind[K]> {
  return repository.find(kind, id);
}`, 'the named map computes the kind-to-entity relationship once and preserves a precise return type for each key', 'replacing every named type with nested conditional expressions always makes checking faster and easier to maintain'),
  ]),
];

export const typescriptRoadmapQuestions = roadmapBank('TypeScript', 'typescript', specs);
