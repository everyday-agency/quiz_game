import { roadmapBank } from './roadmap-question-helpers.mjs';

const lesson = (title, lines, behavior, pitfall) => ({
  title,
  snippet: lines.join('\n'),
  behavior,
  pitfall,
});

const spec = (topic, concepts, behavior, pitfall, examples) => ({
  topic,
  concepts,
  lessons: examples.map(([title, lines]) => lesson(title, lines, behavior, pitfall)),
});

const specs = [
  spec('Tooling & Vite', ['CLI tools', 'Vite', 'development server', 'production build', 'environment variables'],
    'Vite transforms modules for development, builds optimized static assets for production, and only exposes intentionally prefixed client variables',
    'the development server is the production application server and every operating-system environment variable is automatically safe in browser code', [
      ['Reading a client-safe Vite environment value', ['const apiBase = import.meta.env.VITE_API_BASE_URL;', '', 'if (!apiBase) {', '  throw new Error("VITE_API_BASE_URL is required");', '}', '', 'export async function loadHealth() {', '  const response = await fetch(`${apiBase}/health`);', '  return response.json();', '}']],
      ['Lazy module loading creates a build split point', ['import { lazy, Suspense } from "react";', '', 'const AdminPage = lazy(() => import("./AdminPage"));', '', 'export function App() {', '  return (', '    <Suspense fallback={<p>Loading admin…</p>}>', '      <AdminPage />', '    </Suspense>', '  );', '}']],
    ]),
  spec('Functional components & JSX', ['functional components', 'JSX', 'component purity', 'fragments', 'rendering'],
    'a component returns a description of UI from props and state, and JSX expressions evaluate before React receives the resulting element tree',
    'calling a component permanently creates DOM nodes and JSX may contain statements such as if directly between braces', [
      ['Rendering calculated values through JSX expressions', ['type PriceProps = { net: number; taxRate: number };', '', 'export function Price({ net, taxRate }: PriceProps) {', '  const gross = net * (1 + taxRate);', '  return (', '    <>', '      <strong>{gross.toFixed(2)}</strong>', '      <small> including tax</small>', '    </>', '  );', '}']],
      ['Keeping render calculation pure', ['type GreetingProps = { name: string; hour: number };', '', 'export function Greeting({ name, hour }: GreetingProps) {', '  const period = hour < 12 ? "morning" : "evening";', '', '  return <h1>Good {period}, {name}</h1>;', '}', '', '// The component does not mutate props or external state while rendering.']],
    ]),
  spec('Props, state & composition', ['props vs state', 'composition', 'children', 'one-way data flow', 'lifting state', 'render props', 'higher-order components'],
    'props are read-only inputs while owned state changes through its setter, and composition passes behavior or UI through explicit boundaries',
    'a child may mutate a prop object to update its parent and children automatically share private state without lifting it', [
      ['Composing a panel through children', ['type PanelProps = {', '  title: string;', '  children: React.ReactNode;', '};', '', 'export function Panel({ title, children }: PanelProps) {', '  return <section aria-label={title}>', '    <h2>{title}</h2>', '    {children}', '  </section>;', '}']],
      ['Stateful render props and higher-order composition', ['type PointerProps = { render: (point: { x: number; y: number }) => React.ReactNode };', '', 'function Pointer({ render }: PointerProps) {', '  const [point, setPoint] = useState({ x: 0, y: 0 });', '  return <div onPointerMove={event => setPoint({ x: event.clientX, y: event.clientY })}>', '    {render(point)}', '  </div>;', '}', '', 'function withPanel<Props extends object>(Component: React.ComponentType<Props>) {', '  return function Panelled(props: Props) {', '    return <Panel title="Details"><Component {...props} /></Panel>;', '  };', '}']],
    ]),
  spec('Conditional rendering', ['conditional rendering', 'ternary operator', 'logical AND', 'early return', 'preserving state'],
    'conditional branches choose which element description React reconciles, and an early return can represent loading or missing data explicitly',
    'false and null are rendered as visible text and changing any conditional branch always preserves all descendant state', [
      ['Separating loading, error, and success branches', ['function Profile({ query }: { query: Query<User> }) {', '  if (query.status === "pending") return <Spinner />;', '  if (query.status === "error") {', '    return <ErrorMessage message={query.error.message} />;', '  }', '', '  return <ProfileCard user={query.data} />;', '}']],
      ['Using a ternary when exactly one branch should render', ['function SaveState({ saving }: { saving: boolean }) {', '  return (', '    <button type="submit" disabled={saving}>', '      {saving ? "Saving…" : "Save changes"}', '    </button>', '  );', '}', '', '// Exactly one label is in the returned tree.']],
    ]),
  spec('Lists, keys & reconciliation', ['lists and keys', 'reconciliation', 'stable identity', 'array mapping', 'component state'],
    'a stable key tells React which logical item owns each component instance across insertions and reordering',
    'an array index is always the best key and changing a key merely changes a label without affecting component identity or state', [
      ['Stable database identifiers survive reordering', ['function TodoList({ todos }: { todos: Todo[] }) {', '  return <ul>', '    {todos.map(todo => (', '      <TodoRow', '        key={todo.id}', '        todo={todo}', '      />', '    ))}', '  </ul>;', '}']],
      ['Changing a key intentionally resets local state', ['function Editor({ documentId }: { documentId: string }) {', '  return (', '    <DocumentForm', '      key={documentId}', '      documentId={documentId}', '    />', '  );', '}', '', '// A different documentId mounts a fresh form instance.']],
    ]),
  spec('Events & form basics', ['events', 'event handlers', 'controlled inputs', 'preventDefault', 'state updates'],
    'event handlers are passed as functions, controlled inputs derive their displayed value from state, and preventDefault stops native submission navigation',
    'adding parentheses to an event handler defers it until the event and preventDefault stops React state updates', [
      ['Controlled input updates from the change event', ['function SearchBox() {', '  const [query, setQuery] = useState("");', '', '  return <label>', '    Search', '    <input', '      value={query}', '      onChange={event => setQuery(event.target.value)}', '    />', '  </label>;', '}']],
      ['Handling submission without a page reload', ['function LoginForm() {', '  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {', '    event.preventDefault();', '    const data = new FormData(event.currentTarget);', '    login(String(data.get("email")));', '  }', '', '  return <form onSubmit={handleSubmit}>', '    <input name="email" type="email" required />', '    <button>Sign in</button>', '  </form>;', '}']],
    ]),
  spec('useState & state snapshots', ['useState', 'state snapshots', 'functional updates', 'batching', 'immutability'],
    'each render sees a state snapshot and functional updater calls compose reliably when the next value depends on the previous value',
    'calling a setter immediately mutates the current render variable and direct object mutation tells React to render the change', [
      ['Three functional increments compose in one event', ['function Counter() {', '  const [count, setCount] = useState(0);', '', '  function addThree() {', '    setCount(current => current + 1);', '    setCount(current => current + 1);', '    setCount(current => current + 1);', '  }', '', '  return <button onClick={addThree}>{count}</button>;', '}']],
      ['Replacing nested state without mutation', ['function ProfileEditor() {', '  const [profile, setProfile] = useState({ name: "Ada", city: "Bern" });', '', '  function move(city: string) {', '    setProfile(current => ({ ...current, city }));', '  }', '', '  return <button onClick={() => move("Zurich")}>', '    {profile.name}: {profile.city}', '  </button>;', '}']],
    ]),
  spec('useEffect & lifecycle', ['useEffect', 'component lifecycle', 'dependencies', 'cleanup', 'synchronization'],
    'an effect synchronizes with an external system after commit and its cleanup stops the previous subscription before rerun or unmount',
    'effects are the preferred place for every derived calculation and an empty dependency array makes captured props update automatically', [
      ['Subscribing and cleaning up by room identity', ['function Chat({ roomId }: { roomId: string }) {', '  useEffect(() => {', '    const connection = createConnection(roomId);', '    connection.connect();', '', '    return () => connection.disconnect();', '  }, [roomId]);', '', '  return <h1>Room {roomId}</h1>;', '}']],
      ['Deriving display data during render instead of an effect', ['function ProductList({ products, filter }: Props) {', '  const visible = products.filter(product =>', '    product.name.toLowerCase().includes(filter.toLowerCase())', '  );', '', '  return <ul>{visible.map(product =>', '    <li key={product.id}>{product.name}</li>', '  )}</ul>;', '}', '', '// No effect or duplicate visible state is required.']],
    ]),
  spec('useRef & DOM refs', ['useRef', 'DOM refs', 'imperative handles', 'mutable values', 'rendering'],
    'a ref preserves a mutable value across renders without scheduling a render and a DOM ref becomes available after commit',
    'changing ref.current always rerenders the component and a DOM node can be read reliably during the component function call before commit', [
      ['Focusing a DOM node from an event', ['function Search() {', '  const inputRef = useRef<HTMLInputElement>(null);', '', '  function focusSearch() {', '    inputRef.current?.focus();', '  }', '', '  return <>', '    <input ref={inputRef} />', '    <button onClick={focusSearch}>Focus search</button>', '  </>;', '}']],
      ['Storing an interval identifier outside rendered state', ['function Stopwatch() {', '  const intervalRef = useRef<number | null>(null);', '', '  function start() {', '    if (intervalRef.current !== null) return;', '    intervalRef.current = window.setInterval(tick, 1000);', '  }', '', '  function stop() {', '    if (intervalRef.current !== null) clearInterval(intervalRef.current);', '    intervalRef.current = null;', '  }', '}']],
    ]),
  spec('useReducer', ['useReducer', 'reducers', 'actions', 'immutable transitions', 'state machines'],
    'a reducer centralizes state transitions as a pure function and dispatch selects a transition through an explicit action',
    'a reducer may mutate and return the same state object because dispatch always forces React to detect nested changes', [
      ['Modeling cart transitions with discriminated actions', ['type Action =', '  | { type: "added"; item: Item }', '  | { type: "removed"; id: number };', '', 'function cartReducer(state: Item[], action: Action): Item[] {', '  switch (action.type) {', '    case "added": return [...state, action.item];', '    case "removed": return state.filter(item => item.id !== action.id);', '  }', '}']],
      ['Dispatching describes what happened', ['function Cart() {', '  const [items, dispatch] = useReducer(cartReducer, []);', '', '  return <button onClick={() => dispatch({', '    type: "added",', '    item: { id: crypto.randomUUID(), name: "Book" },', '  })}>', '    Add book ({items.length})', '  </button>;', '}']],
    ]),
  spec('Memoization hooks', ['useMemo', 'useCallback', 'memo', 'referential identity', 'performance'],
    'memoization can preserve a calculated value or callback identity between renders when dependencies are unchanged, but it is a performance tool rather than a correctness mechanism',
    'useMemo runs only once for the lifetime of the application and useCallback executes the callback immediately to cache its result', [
      ['Memoizing an expensive filtered collection', ['function Results({ records, query }: Props) {', '  const visible = useMemo(', '    () => expensiveFilter(records, query),', '    [records, query],', '  );', '', '  return <ResultTable records={visible} />;', '}', '', '// Correctness does not depend on useMemo.']],
      ['Preserving a callback passed to a memoized child', ['function ProductPage({ productId, referrer }: Props) {', '  const handleSubmit = useCallback((order: Order) => {', '    postOrder(productId, order, referrer);', '  }, [productId, referrer]);', '', '  return <MemoizedOrderForm onSubmit={handleSubmit} />;', '}']],
    ]),
  spec('Context & custom hooks', ['useContext', 'context providers', 'custom hooks', 'hook composition', 'hook rules'],
    'context reads the nearest provider value and a custom hook composes reusable stateful behavior while still obeying the rules of hooks',
    'a custom hook shares one state instance among every caller and hooks may be called conditionally when a branch seems stable', [
      ['Rejecting a missing provider in a custom hook', ['const ThemeContext = createContext<Theme | null>(null);', '', 'export function useTheme(): Theme {', '  const value = useContext(ThemeContext);', '  if (value === null) {', '    throw new Error("useTheme must be inside ThemeProvider");', '  }', '  return value;', '}']],
      ['Custom hook owns cleanup for online status', ['function useOnlineStatus() {', '  const [online, setOnline] = useState(navigator.onLine);', '', '  useEffect(() => {', '    const update = () => setOnline(navigator.onLine);', '    window.addEventListener("online", update);', '    window.addEventListener("offline", update);', '    return () => {', '      window.removeEventListener("online", update);', '      window.removeEventListener("offline", update);', '    };', '  }, []);', '', '  return online;', '}']],
    ]),
  spec('State management libraries', ['Context', 'Zustand', 'Jotai', 'MobX', 'external stores'],
    'external state tools expose subscriptions or selectors so components update for the slice they consume, while local UI state can remain local',
    'choosing a state library removes the need to model ownership and every component should subscribe to the entire global store', [
      ['Selecting a narrow Zustand store slice', ['type CartStore = {', '  items: Item[];', '  add: (item: Item) => void;', '};', '', 'const useCart = create<CartStore>(set => ({', '  items: [],', '  add: item => set(state => ({ items: [...state.items, item] })),', '}));', '', 'function CartCount() {', '  const count = useCart(state => state.items.length);', '  return <span>{count}</span>;', '}']],
      ['Deriving Jotai state from smaller atoms', ['const itemsAtom = atom<Item[]>([]);', 'const totalAtom = atom(get =>', '  get(itemsAtom).reduce((sum, item) => sum + item.price, 0)', ');', '', 'function CartTotal() {', '  const total = useAtomValue(totalAtom);', '  return <strong>{total.toFixed(2)}</strong>;', '}']],
    ]),
  spec('Routing', ['React Router', 'TanStack Router', 'nested routes', 'route parameters', 'navigation'],
    'a router maps locations to UI and nested routes render child matches through an outlet while parameters remain external input that should be validated',
    'a route change reloads the entire document by default and route parameters automatically become validated domain objects', [
      ['Nested React Router layout renders an outlet', ['const router = createBrowserRouter([{', '  path: "/projects",', '  element: <ProjectsLayout />,', '  children: [', '    { index: true, element: <ProjectList /> },', '    { path: ":projectId", element: <ProjectDetail /> },', '  ],', '}]);', '', 'function ProjectsLayout() {', '  return <main><h1>Projects</h1><Outlet /></main>;', '}']],
      ['Validating a route parameter before use', ['function ProjectDetail() {', '  const { projectId } = useParams();', '  const id = Number(projectId);', '', '  if (!Number.isInteger(id) || id < 1) {', '    return <Navigate to="/projects" replace />;', '  }', '', '  return <ProjectScreen projectId={id} />;', '}']],
    ]),
  spec('CSS & component libraries', ['CSS Modules', 'Tailwind CSS', 'Panda CSS', 'Material UI', 'Chakra UI', 'shadcn UI'],
    'component styling approaches differ in where styles are authored and generated, while reusable components still need explicit variant and prop contracts',
    'a CSS library changes React state semantics and utility classes automatically guarantee accessible component behavior', [
      ['CSS Modules scope the generated class name', ['import styles from "./Button.module.css";', '', 'type ButtonProps = {', '  danger?: boolean;', '  children: React.ReactNode;', '};', '', 'export function Button({ danger, children }: ButtonProps) {', '  const className = danger ? styles.danger : styles.primary;', '  return <button className={className}>{children}</button>;', '}']],
      ['Component-library variants remain normal props', ['function CheckoutAction({ busy }: { busy: boolean }) {', '  return (', '    <Button', '      colorScheme="teal"', '      isLoading={busy}', '      loadingText="Paying"', '      type="submit"', '    >', '      Pay now', '    </Button>', '  );', '}']],
    ]),
  spec('Headless & accessible components', ['Radix UI', 'React Aria', 'Ark UI', 'headless components', 'accessibility'],
    'headless primitives provide behavior and accessibility contracts while the application supplies styles and visible content',
    'a div with an onClick handler is automatically equivalent to a keyboard-operable button and ARIA labels replace all native semantics', [
      ['React Aria supplies interaction props to a native button', ['function AccessibleAction(props: AriaButtonProps) {', '  const ref = useRef<HTMLButtonElement>(null);', '  const { buttonProps, isPressed } = useButton(props, ref);', '', '  return (', '    <button {...buttonProps} ref={ref} data-pressed={isPressed}>', '      {props.children}', '    </button>', '  );', '}']],
      ['Radix dialog composes semantics with custom styling', ['function ConfirmDialog() {', '  return <Dialog.Root>', '    <Dialog.Trigger asChild><button>Delete</button></Dialog.Trigger>', '    <Dialog.Portal>', '      <Dialog.Overlay className="overlay" />', '      <Dialog.Content className="dialog">', '        <Dialog.Title>Delete project?</Dialog.Title>', '        <Dialog.Description>This cannot be undone.</Dialog.Description>', '        <Dialog.Close asChild><button>Cancel</button></Dialog.Close>', '      </Dialog.Content>', '    </Dialog.Portal>', '  </Dialog.Root>;', '}']],
    ]),
  spec('REST API calls', ['fetch', 'Axios', 'TanStack Query', 'SWR', 'RTK Query'],
    'HTTP code must handle cancellation and unsuccessful status responses, while server-state libraries add caching and request lifecycle coordination',
    'fetch rejects every HTTP 4xx or 5xx response automatically and client caches remove the need for invalidation after a mutation', [
      ['Aborting stale fetch work during effect cleanup', ['function UserView({ userId }: { userId: number }) {', '  const [user, setUser] = useState<User | null>(null);', '', '  useEffect(() => {', '    const controller = new AbortController();', '    fetch(`/api/users/${userId}`, { signal: controller.signal })', '      .then(response => {', '        if (!response.ok) throw new Error(`HTTP ${response.status}`);', '        return response.json();', '      })', '      .then(setUser)', '      .catch(error => { if (error.name !== "AbortError") throw error; });', '    return () => controller.abort();', '  }, [userId]);', '', '  return user ? <UserCard user={user} /> : <Spinner />;', '}']],
      ['Invalidating TanStack Query data after a mutation', ['function RenameProject({ id }: { id: number }) {', '  const client = useQueryClient();', '  const rename = useMutation({', '    mutationFn: (name: string) => api.renameProject(id, name),', '    onSuccess: () => client.invalidateQueries({ queryKey: ["project", id] }),', '  });', '', '  return <button onClick={() => rename.mutate("New name")}>', '    Rename', '  </button>;', '}']],
    ]),
  spec('GraphQL & data libraries', ['GraphQL', 'Apollo Client', 'Relay', 'urql', 'normalized cache'],
    'a GraphQL operation requests an explicit field selection and client libraries coordinate loading, errors, and normalized cache updates',
    'GraphQL returns every server field by default and a successful mutation automatically updates every cached query without identity information or policy', [
      ['Apollo query renders each request state', ['const GET_PROJECT = gql`', '  query Project($id: ID!) {', '    project(id: $id) { id name owner { id name } }', '  }', '`;', '', 'function Project({ id }: { id: string }) {', '  const { data, loading, error } = useQuery(GET_PROJECT, { variables: { id } });', '  if (loading) return <Spinner />;', '  if (error) return <ErrorMessage message={error.message} />;', '  return <h1>{data.project.name}</h1>;', '}']],
      ['Mutation returns identity fields for cache normalization', ['const RENAME_PROJECT = gql`', '  mutation Rename($id: ID!, $name: String!) {', '    renameProject(id: $id, name: $name) {', '      id', '      __typename', '      name', '    }', '  }', '`;', '', 'const [rename, state] = useMutation(RENAME_PROJECT);']],
    ]),
  spec('Testing', ['Vitest', 'Jest', 'React Testing Library', 'Cypress', 'Playwright'],
    'component tests should interact through user-visible roles and text, while browser tests cover integration across routing, network, and real browser behavior',
    'tests are most reliable when they assert implementation state and CSS selectors rather than observable behavior', [
      ['Testing an interaction through accessible roles', ['it("submits the entered email", async () => {', '  const user = userEvent.setup();', '  const onSubmit = vi.fn();', '  render(<NewsletterForm onSubmit={onSubmit} />);', '', '  await user.type(screen.getByRole("textbox", { name: /email/i }), "ada@example.com");', '  await user.click(screen.getByRole("button", { name: /subscribe/i }));', '', '  expect(onSubmit).toHaveBeenCalledWith("ada@example.com");', '});']],
      ['Playwright waits on the page contract', ['test("customer can open an order", async ({ page }) => {', '  await page.goto("/orders");', '  await page.getByRole("link", { name: "Order 42" }).click();', '', '  await expect(page).toHaveURL(/orders\/42/);', '  await expect(page.getByRole("heading", { name: "Order 42" }))', '    .toBeVisible();', '});']],
    ]),
  spec('Frameworks & rendering', ['React Router framework mode', 'Next.js', 'Astro', 'server rendering', 'hydration'],
    'frameworks coordinate routing, data loading, server rendering, and client hydration, and code must respect which side can access browser-only APIs',
    'server rendering runs effects on the server and browser globals are always safe during a server component or server render', [
      ['Server-rendered component keeps browser APIs in an effect', ['function WidthLabel() {', '  const [width, setWidth] = useState<number | null>(null);', '', '  useEffect(() => {', '    const update = () => setWidth(window.innerWidth);', '    update();', '    window.addEventListener("resize", update);', '    return () => window.removeEventListener("resize", update);', '  }, []);', '', '  return <span>{width === null ? "Unknown" : width}</span>;', '}']],
      ['Next server component awaits data before rendering', ['export default async function ProjectPage({', '  params,', '}: { params: Promise<{ id: string }> }) {', '  const { id } = await params;', '  const project = await db.project.findUniqueOrThrow({ where: { id } });', '', '  return <ProjectDetails project={project} />;', '}', '', '// No client hook is required for this server-side read.']],
    ]),
  spec('TypeScript & validation', ['TypeScript', 'Zod', 'runtime validation', 'discriminated unions', 'component props'],
    'TypeScript checks code during development while runtime validation must inspect untrusted network or form data before the application relies on its shape',
    'a TypeScript type annotation validates JSON received from the network and a schema parse changes the remote server response', [
      ['Parsing unknown API JSON with Zod', ['const UserSchema = z.object({', '  id: z.number().int().positive(),', '  name: z.string().min(1),', '  role: z.enum(["admin", "member"]),', '});', '', 'type User = z.infer<typeof UserSchema>;', '', 'async function loadUser(): Promise<User> {', '  const response = await fetch("/api/me");', '  const json: unknown = await response.json();', '  return UserSchema.parse(json);', '}']],
      ['Discriminated props prevent impossible combinations', ['type NoticeProps =', '  | { kind: "success"; message: string; onRetry?: never }', '  | { kind: "error"; message: string; onRetry: () => void };', '', 'function Notice(props: NoticeProps) {', '  return <aside>', '    <p>{props.message}</p>', '    {props.kind === "error" && <button onClick={props.onRetry}>Retry</button>}', '  </aside>;', '}']],
    ]),
  spec('Forms libraries', ['React Hook Form', 'Formik', 'field registration', 'form validation', 'submission state'],
    'form libraries coordinate field registration, validation, touched or dirty state, and submission without changing the underlying browser data contract',
    'registering a field guarantees server acceptance and form validity is equivalent to authorization and business-rule validation', [
      ['React Hook Form connects fields and schema errors', ['const schema = z.object({', '  email: z.string().email(),', '  age: z.coerce.number().int().min(18),', '});', '', 'function SignupForm() {', '  const { register, handleSubmit, formState } = useForm({', '    resolver: zodResolver(schema),', '  });', '', '  return <form onSubmit={handleSubmit(saveUser)}>', '    <input {...register("email")} />', '    <input {...register("age")} />', '    {formState.errors.email && <p>{formState.errors.email.message}</p>}', '    <button disabled={formState.isSubmitting}>Create</button>', '  </form>;', '}']],
      ['Formik submission resets only after success', ['function ProfileForm() {', '  return <Formik', '    initialValues={{ name: "" }}', '    validate={values => values.name ? {} : { name: "Required" }}', '    onSubmit={async (values, helpers) => {', '      await api.saveProfile(values);', '      helpers.resetForm({ values });', '    }}', '  >', '    {({ isSubmitting }) => <Form>', '      <Field name="name" />', '      <ErrorMessage name="name" component="p" />', '      <button disabled={isSubmitting}>Save</button>', '    </Form>}', '  </Formik>;', '}']],
    ]),
  spec('Error boundaries & portals', ['error boundaries', 'portals', 'fallback UI', 'event propagation', 'DOM placement'],
    'an error boundary catches rendering failures below it and a portal changes DOM placement while preserving React-tree context and event propagation',
    'error boundaries catch errors in every event handler and portals detach children from their React parents and contexts', [
      ['Class error boundary renders a fallback after failure', ['class ErrorBoundary extends React.Component<', '  React.PropsWithChildren,', '  { failed: boolean }', '> {', '  state = { failed: false };', '  static getDerivedStateFromError() { return { failed: true }; }', '  componentDidCatch(error: Error) { reportError(error); }', '  render() {', '    return this.state.failed ? <h2>Something went wrong</h2> : this.props.children;', '  }', '}']],
      ['Portal places a dialog at the document body', ['function Modal({ children, onClose }: ModalProps) {', '  return createPortal(', '    <div className="backdrop" onClick={onClose}>', '      <div role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>', '        {children}', '      </div>', '    </div>,', '    document.body,', '  );', '}']],
    ]),
  spec('Suspense, server APIs & performance', ['Suspense', 'lazy', 'transitions', 'server APIs', 'streaming'],
    'Suspense displays a fallback for compatible suspended work and transitions mark non-urgent updates so urgent input can stay responsive',
    'wrapping arbitrary fetch calls in Suspense automatically caches them and startTransition delays the state update until all network work is complete', [
      ['Transition keeps typing urgent while results update', ['function SearchPage() {', '  const [input, setInput] = useState("");', '  const [query, setQuery] = useState("");', '  const [pending, startTransition] = useTransition();', '', '  function change(value: string) {', '    setInput(value);', '    startTransition(() => setQuery(value));', '  }', '', '  return <>', '    <input value={input} onChange={event => change(event.target.value)} />', '    {pending && <small>Updating…</small>}', '    <SlowResults query={query} />', '  </>;', '}']],
      ['Suspense scopes a lazy route fallback', ['const Reports = lazy(() => import("./Reports"));', '', 'function Dashboard() {', '  return <Layout>', '    <Suspense fallback={<ReportsSkeleton />}>', '      <Reports />', '    </Suspense>', '  </Layout>;', '}', '', '// Only the boundary content is replaced while the module loads.']],
    ]),
  spec('Animation & mobile React', ['Framer Motion', 'react-spring', 'GSAP', 'React Native', 'mobile applications'],
    'React animation libraries coordinate visual state with component lifecycle, while React Native renders platform components rather than browser DOM elements',
    'React Native renders div and span elements directly and animation state may ignore cleanup because unmounted components remain active', [
      ['Framer Motion animates presence with stable keys', ['function Toasts({ toasts }: { toasts: Toast[] }) {', '  return <AnimatePresence>', '    {toasts.map(toast => (', '      <motion.div', '        key={toast.id}', '        initial={{ opacity: 0, y: 12 }}', '        animate={{ opacity: 1, y: 0 }}', '        exit={{ opacity: 0, y: -12 }}', '      >', '        {toast.message}', '      </motion.div>', '    ))}', '  </AnimatePresence>;', '}']],
      ['React Native uses platform primitives and state hooks', ['function CounterScreen() {', '  const [count, setCount] = useState(0);', '', '  return <SafeAreaView>', '    <Text accessibilityRole="header">Count: {count}</Text>', '    <Pressable', '      accessibilityRole="button"', '      onPress={() => setCount(current => current + 1)}', '    >', '      <Text>Increment</Text>', '    </Pressable>', '  </SafeAreaView>;', '}']],
    ]),
];

export const reactQuestions = roadmapBank('React', 'tsx', specs, { extended: true });
