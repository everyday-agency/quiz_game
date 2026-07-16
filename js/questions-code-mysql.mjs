import { codeLab, codeQuestion as c } from './code-question-helpers.mjs';

const modeling = 'Relational modeling';
const dataTypes = 'Data types & representation';
const nulls = 'NULL & three-valued logic';
const keys = 'Keys & constraints';
const joins = 'Joins & relationship queries';
const aggregation = 'Aggregation & grouping';
const ctes = 'Subqueries & CTEs';
const indexes = 'Index design';
const explain = 'EXPLAIN & optimizer reasoning';
const transactions = 'Transactions & ACID';
const isolation = 'Isolation & MVCC';
const locking = 'Locking & deadlocks';
const concurrency = 'Concurrency patterns';
const migrations = 'Schema migrations';
const normalization = 'Normalization & denormalization';
const json = 'JSON & generated columns';
const correctness = 'Query correctness & SQL semantics';
const pagination = 'Pagination & window functions';
const security = 'Security & privileges';
const backup = 'Backup & recovery';
const replication = 'Replication & read scaling';
const partitioning = 'Partitioning & data lifecycle';
const connections = 'Connections & configuration';
const observability = 'Observability & troubleshooting';
const production = 'Production performance & capacity';

export const mysqlCodeQuestions = [
  ...codeLab(modeling, 'sql', 'A relationship table with attributes and composite identity', String.raw`CREATE TABLE account_user (
    account_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role ENUM('owner', 'editor', 'viewer') NOT NULL,
    joined_at DATETIME NOT NULL,
    PRIMARY KEY (account_id, user_id),
    CONSTRAINT fk_membership_account
      FOREIGN KEY (account_id) REFERENCES accounts(id),
    CONSTRAINT fk_membership_user
      FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE = InnoDB;`, [
    c('Foundation', 'What relationship does this account_user table model between accounts and users?',
      ['A many-to-many relationship with attributes on each membership', 'A one-to-one relationship between all accounts and users', 'Class inheritance between two tables', 'A denormalized copy of every user'],
      'Each account can have many users and each user can join many accounts, while role and joined_at describe the relationship itself.'),
    c('Applied', 'What invariant is enforced by the composite primary key?',
      ['The same user can appear at most once within the same account', 'A user can belong to only one account globally', 'Every role value is globally unique', 'Account IDs and user IDs must be equal'],
      'Uniqueness applies to the pair. Either ID may repeat independently as long as the other component differs.'),
    c('Applied', 'Why does role belong in the relationship table rather than necessarily on users?',
      ['One user may have a different role in each account', 'ENUM values cannot appear in a users table', 'Foreign keys require an ENUM column', 'Users cannot have ordinary attributes'],
      'Role is contextual to a membership. Storing one role on users would lose differences between accounts.'),
    c('Advanced', 'What do the foreign keys guarantee when inserting a membership?',
      ['Both referenced account and user rows already exist', 'The current application actor is authorized', 'The user has only one role across all accounts', 'The membership cannot ever be deleted'],
      'Referential constraints enforce existence, not authorization or every business rule about the relationship.'),
  ]),

  ...codeLab(dataTypes, 'sql', 'Exact money, approximate ratios, and temporal values', String.raw`CREATE TABLE measurements (
    id BIGINT UNSIGNED PRIMARY KEY,
    amount DECIMAL(12, 2) NOT NULL,
    ratio DOUBLE NOT NULL,
    occurred_at DATETIME(6) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO measurements
VALUES (1, 19.99, 0.1 + 0.2, '2026-07-16 10:30:00.123456', DEFAULT);`, [
    c('Foundation', 'Why is DECIMAL a stronger choice than DOUBLE for amount?',
      ['DECIMAL represents fixed-scale decimal money without binary floating approximation', 'DECIMAL automatically converts every currency', 'DOUBLE cannot store positive numbers', 'DECIMAL creates a unique constraint'],
      'Fixed-point decimal storage preserves the stated base-10 scale, which is important for currency arithmetic and comparison.'),
    c('Applied', 'Why can comparing ratio directly with 0.3 be unreliable?',
      ['DOUBLE uses approximate binary floating representation', 'DOUBLE values are stored as strings', 'The plus operator concatenates numbers in SQL', '0.3 is always NULL'],
      'Many decimal fractions cannot be represented exactly in binary floating point, so calculations can differ by a tiny amount.'),
    c('Applied', 'For the occurred_at column in this table, what does the 6 in DATETIME(6) preserve?',
      ['Up to six digits of fractional seconds', 'Six different time zones', 'A six-year retention period', 'Six bytes of text only'],
      'Fractional-seconds precision controls how much sub-second detail the temporal column stores.'),
    c('Advanced', 'How does TIMESTAMP commonly differ from DATETIME regarding session time zones?',
      ['TIMESTAMP values are converted between the session time zone and UTC storage; DATETIME keeps the written calendar fields', 'DATETIME always stores Unix seconds', 'TIMESTAMP cannot have a default', 'DATETIME automatically knows the user time zone'],
      'TIMESTAMP participates in time-zone conversion, while DATETIME represents calendar values without that automatic conversion behavior.'),
  ]),

  ...codeLab(nulls, 'sql', 'Predicates under SQL three-valued logic', String.raw`SELECT id, priority, completed_at
FROM tasks
WHERE completed_at = NULL
   OR priority <> 1;

-- Example rows:
-- (10, NULL, NULL)
-- (11, 1,    NULL)
-- (12, 2,    '2026-07-16 09:00:00')`, [
    c('Foundation', 'Why does completed_at = NULL never evaluate to TRUE?',
      ['Ordinary equality with NULL yields UNKNOWN; IS NULL is required', 'NULL is stored as an empty string', 'Completed dates cannot be selected', 'The equals operator performs assignment'],
      'NULL represents an unknown value. SQL uses IS NULL and IS NOT NULL for nullness tests.'),
    c('Applied', 'Under SQL three-valued logic, does example row 10 pass this WHERE clause?',
      ['No; both comparisons evaluate to UNKNOWN and UNKNOWN OR UNKNOWN is not TRUE', 'Yes, because NULL equals NULL', 'Yes, because every OR expression includes missing rows', 'No, because the row is deleted'],
      'A WHERE clause retains only TRUE. Unknown results are filtered out just like FALSE results.'),
    c('Applied', 'After evaluating both OR conditions, which example row definitely passes this query?',
      ['Row 12, because priority <> 1 is TRUE', 'Row 11, because completed_at is NULL', 'Row 10, because NULL priorities equal zero', 'Every row passes'],
      'The second predicate is true for priority 2, so the OR result is true regardless of the false null equality test.'),
    c('Advanced', 'How can the priority predicate explicitly treat NULL as not equal to 1 in MySQL?',
      ['Use NOT (priority <=> 1) with the NULL-safe equality operator', 'Use priority = NULL', 'Use priority + NULL', 'Use COUNT(priority) in WHERE'],
      'MySQL <=> returns a definite boolean even with NULL. Negating it expresses NULL-safe inequality.'),
  ]),

  ...codeLab(keys, 'sql', 'Unique constraints, NULL, and CHECK rules', String.raw`CREATE TABLE coupons (
    id BIGINT UNSIGNED PRIMARY KEY,
    account_id BIGINT UNSIGNED NOT NULL,
    code VARCHAR(40) NOT NULL,
    disabled_at DATETIME NULL,
    discount_percent TINYINT UNSIGNED NOT NULL,
    UNIQUE KEY uq_coupon_state (account_id, code, disabled_at),
    CHECK (discount_percent BETWEEN 1 AND 100)
);`, [
    c('Foundation', 'When a coupon row is written, what values does the CHECK constraint reject?',
      ['Discount percentages outside the inclusive range 1 through 100', 'Duplicate coupon codes only', 'Every row containing NULL', 'Accounts without coupons'],
      'The check evaluates the stated row condition for inserted and updated values.'),
    c('Applied', 'Why can the unique key still allow multiple active rows with the same account and code when disabled_at is NULL?',
      ['MySQL unique indexes permit multiple NULL values because NULLs are not equal', 'Unique indexes ignore every third column', 'VARCHAR values are never compared', 'Primary keys disable secondary uniqueness'],
      'A nullable component weakens the intended active-row uniqueness because multiple NULL key combinations are permitted.'),
    c('Applied', 'What does the primary key add beyond the secondary unique key?',
      ['A non-null unique row identity used as the clustered key by InnoDB', 'A guarantee that coupon code is globally unique', 'Authorization for coupon updates', 'Automatic deletion of expired coupons'],
      'The primary key identifies each row. The secondary unique key enforces a different business combination.'),
    c('Advanced', 'Which design can enforce one active coupon per account and code more directly?',
      ['Index a deterministic generated active marker with account_id and code', 'Remove every unique constraint', 'Store disabled_at as an empty string', 'Check uniqueness only in browser JavaScript'],
      'A generated value that maps active rows to one non-null key can make the intended condition expressible in a unique index.'),
  ]),

  ...codeLab(joins, 'sql', 'Outer joins and row multiplication', String.raw`SELECT c.id,
       COUNT(o.id) AS order_rows,
       SUM(p.amount) AS paid_amount
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
LEFT JOIN payments AS p
  ON p.order_id = o.id
 AND p.status = 'captured'
GROUP BY c.id;`, [
    c('Foundation', 'Why are customers without orders still returned?',
      ['The first LEFT JOIN produces a NULL-extended row for an unmatched customer', 'COUNT creates missing customers', 'GROUP BY converts the join to INNER', 'The payments filter runs before customers'],
      'An outer join preserves the left row even when no matching right row exists.'),
    c('Applied', 'Why is the payment status condition placed in ON rather than WHERE?',
      ['It filters matching payments without removing customers lacking captured payments', 'WHERE cannot compare strings', 'ON automatically creates an index', 'The status column exists only during joining'],
      'A WHERE condition on the nullable right side would reject NULL-extended rows and partially cancel outer-join preservation.'),
    c('Applied', 'What can make order_rows larger than the number of distinct orders?',
      ['Several captured payment rows can duplicate the joined order row', 'COUNT ignores all joined rows', 'LEFT JOIN deduplicates orders automatically', 'GROUP BY creates one order per payment table'],
      'Joining one order to multiple payments multiplies its row before aggregation. COUNT(DISTINCT o.id) may match the intended metric.'),
    c('Advanced', 'How can paid_amount avoid multiplication if another one-to-many table is also joined?',
      ['Pre-aggregate each many-side to its intended grain before joining', 'Add more LEFT JOIN clauses', 'Replace SUM with ORDER BY', 'Remove the customer primary key'],
      'Aggregating each child source to one row per parent prevents independent one-to-many relationships from forming a Cartesian multiplication.'),
  ]),

  ...codeLab(aggregation, 'sql', 'Filtering rows before grouping and groups after aggregation', String.raw`SELECT account_id,
       COUNT(*) AS paid_orders,
       COUNT(coupon_code) AS coupon_orders,
       SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY account_id
HAVING SUM(total) >= 1000
ORDER BY revenue DESC;`, [
    c('Foundation', 'What does the WHERE clause do before GROUP BY?',
      ['Restricts input rows to paid orders', 'Filters aggregated accounts by revenue', 'Counts coupon codes', 'Sorts the result'],
      'WHERE chooses rows before aggregation, so unpaid orders do not contribute to any group metric.'),
    c('Applied', 'Why is the revenue threshold expressed in HAVING?',
      ['It depends on the group aggregate SUM(total)', 'HAVING always runs before WHERE', 'SUM cannot appear in SELECT', 'HAVING creates the account groups'],
      'HAVING filters completed groups and may use aggregate expressions unavailable during the row-filtering phase.'),
    c('Applied', 'How do COUNT(*) and COUNT(coupon_code) differ?',
      ['COUNT(*) counts rows; COUNT(coupon_code) ignores rows where that column is NULL', 'COUNT(*) counts only non-null coupon codes', 'They are always identical', 'COUNT(coupon_code) sums coupon text'],
      'COUNT of an expression counts non-null expression values, while COUNT(*) counts all input rows in the group.'),
    c('Advanced', 'Why can ORDER BY revenue use the SELECT alias?',
      ['Ordering occurs after the select list has computed the aggregate alias', 'Aliases are database columns created permanently', 'ORDER BY runs before grouping', 'MySQL replaces revenue with account_id'],
      'At the ordering phase the projected aggregate value is available by its alias.'),
  ]),

  ...codeLab(ctes, 'sql', 'Walking a hierarchy with a recursive CTE', String.raw`WITH RECURSIVE tree AS (
  SELECT id, parent_id, name, 0 AS depth
  FROM categories
  WHERE id = 42

  UNION ALL

  SELECT c.id, c.parent_id, c.name, tree.depth + 1
  FROM categories AS c
  JOIN tree ON c.parent_id = tree.id
)
SELECT * FROM tree ORDER BY depth, id;`, [
    c('Foundation', 'What row set forms the anchor member of this recursive CTE?',
      ['The category whose ID is 42', 'Every category without a parent', 'Only the deepest descendants', 'An empty temporary table'],
      'The non-recursive SELECT seeds the working result with the requested starting node.'),
    c('Applied', 'What relationship direction does the recursive member follow?',
      ['From each current tree row to categories whose parent_id equals its id', 'From each row directly to its parent only', 'Across unrelated category names', 'From depth to primary key'],
      'The join discovers children of the rows accumulated in the previous recursive step.'),
    c('Applied', 'What does UNION ALL preserve that UNION would additionally process?',
      ['All generated rows without duplicate elimination', 'Only distinct depths', 'Only the anchor row', 'Automatic cycle detection'],
      'UNION performs duplicate removal, which adds work. UNION ALL retains rows and relies on the data and recursion logic to terminate correctly.'),
    c('Advanced', 'What data problem can make this traversal repeat until the recursion limit?',
      ['A cycle in parent-child references', 'A unique primary key', 'An index on parent_id', 'A category name containing spaces'],
      'Recursive traversal assumes an acyclic hierarchy. Cycles require prevention or an explicit visited-path guard.'),
  ]),

  ...codeLab(indexes, 'sql', 'Using the leftmost prefix of a composite index', String.raw`CREATE INDEX idx_orders_account_status_created
ON orders (account_id, status, created_at, id);

SELECT id, created_at
FROM orders
WHERE account_id = 9
  AND status = 'paid'
  AND created_at >= '2026-01-01'
ORDER BY created_at, id
LIMIT 50;`, [
    c('Foundation', 'Why does this query align well with the composite index order?',
      ['It uses equality on the leading columns, then a range and matching order', 'It filters only the final id column', 'Composite indexes ignore column order', 'LIMIT disables indexes'],
      'Equality predicates narrow account and status before the created_at range; id then provides deterministic ordering within equal timestamps.'),
    c('Applied', 'Which query is least able to seek through this index using its leftmost prefix?',
      ['A query filtering only created_at', 'A query filtering account_id', 'A query filtering account_id and status', 'A query filtering account_id and ordering by status'],
      'Without a predicate on the leading account_id, the B-tree cannot generally seek directly to a created_at range.'),
    c('Applied', 'In this composite index and cursor ordering, why is id included after created_at?',
      ['It breaks timestamp ties and can support a stable cursor order', 'It changes id into a date', 'It makes account_id nullable', 'It removes the primary key'],
      'A unique tiebreaker makes pagination deterministic and lets a cursor compare a complete ordered position.'),
    c('Advanced', 'What write cost does this additional index introduce?',
      ['Inserts, deletes, and indexed-column updates must maintain another B-tree', 'The table becomes read-only', 'Every SELECT updates the index', 'The primary key stops working'],
      'Indexes trade storage and write maintenance for read access paths, so redundant indexes should be justified by real query workload.'),
  ]),

  ...codeLab(explain, 'sql', 'Reading an execution plan and row estimates', String.raw`EXPLAIN ANALYZE
SELECT *
FROM events
WHERE account_id = 77
  AND event_type = 'purchase'
ORDER BY occurred_at DESC
LIMIT 20;

-- observed plan excerpt:
-- Table scan on events  (actual rows=2400000)
-- Sort: occurred_at DESC
-- Limit: 20`, [
    c('Foundation', 'What is the strongest first interpretation of the table scan?',
      ['No useful access path was chosen for the predicates and ordering', 'The query returned no rows', 'LIMIT always forces a table scan', 'The table has no primary key'],
      'The plan indicates MySQL read the table rather than seeking through a selective matching index.'),
    c('Applied', 'Which index most directly matches this query pattern?',
      ['(account_id, event_type, occurred_at DESC)', '(occurred_at, account_id) only', '(event_type) with no account column', '(id) only'],
      'Equality columns lead the index and the ordered time column follows, supporting both filtering and newest-first retrieval.'),
    c('Applied', 'What does EXPLAIN ANALYZE add beyond ordinary EXPLAIN?',
      ['It executes the query and reports observed timing and row counts', 'It permanently creates the recommended index', 'It rolls back every SELECT', 'It changes table statistics without running'],
      'Observed execution metrics help compare estimates with reality, but the statement actually runs and must be used carefully for expensive writes or queries.'),
    c('Advanced', 'Why are large differences between estimated and actual rows important?',
      ['Bad cardinality estimates can lead the optimizer to choose a poor plan', 'Actual rows never affect performance', 'Estimates are authorization rules', 'A difference proves data corruption'],
      'Plan choices depend on estimated costs. Stale statistics or correlated data can make those estimates misleading.'),
  ]),

  ...codeLab(transactions, 'sql', 'Savepoints inside one transaction', String.raw`START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT after_debit;

INSERT INTO audit_log(account_id, message)
VALUES (1, 'manual adjustment');

ROLLBACK TO SAVEPOINT after_debit;
COMMIT;`, [
    c('Foundation', 'After rolling back to the savepoint and then committing, which database change survives?',
      ['The account debit survives, while the audit insert is undone', 'Both statements are undone', 'Only the audit insert survives', 'Neither statement was transactional'],
      'Rollback to the savepoint reverses work performed after that marker, while earlier transaction work remains pending for commit.'),
    c('Applied', 'Does ROLLBACK TO SAVEPOINT end the transaction?',
      ['No; the transaction remains active until COMMIT or full ROLLBACK', 'Yes; it commits earlier work automatically', 'Yes; it closes the connection', 'No; but it releases every lock immediately'],
      'A savepoint rollback is partial. The outer transaction continues and typically retains locks until it ends.'),
    c('Applied', 'What ACID property makes the final committed debit durable after success?',
      ['Durability', 'Isolation only', 'Consistency only', 'Atomicity of the audit row'],
      'Durability means committed changes survive subsequent failures according to the storage engine guarantees.'),
    c('Advanced', 'Why is a savepoint not the same as an independently committed nested transaction?',
      ['Its work still belongs to the one outer transaction and cannot commit independently', 'Savepoints use a second database server', 'Nested transactions ignore locks', 'Savepoints are available only for SELECT'],
      'The savepoint is a rollback marker inside one transaction. The outer commit remains the single durability boundary.'),
  ]),

  ...codeLab(isolation, 'sql', 'Consistent reads and current locking reads under MVCC', String.raw`-- Session A
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;            -- returns 500

-- Session B commits: UPDATE accounts SET balance = 400 WHERE id = 1;

-- Session A
SELECT balance FROM accounts WHERE id = 1;            -- consistent read
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE; -- current locking read`, [
    c('Foundation', 'What does the second ordinary SELECT in Session A normally see under InnoDB REPEATABLE READ?',
      ['The earlier snapshot value 500', 'The committed value 400 in every case', 'No row because Session B updated it', 'A random version'],
      'Consistent reads in the transaction use the established MVCC snapshot, giving repeatable results for the same row version.'),
    c('Applied', 'In Session A, how does the final SELECT FOR UPDATE differ from the consistent read?',
      ['It performs a current locking read rather than the old snapshot read', 'It reads only uncommitted data', 'It never waits for locks', 'It creates a backup'],
      'Locking reads inspect current committed state suitable for a protected update and acquire locks on the selected records.'),
    c('Applied', 'What structure lets InnoDB reconstruct the older visible row version?',
      ['Undo information combined with transaction visibility rules', 'The query cache', 'A replica server only', 'The binary log alone'],
      'MVCC follows row-version history in undo records to find the version visible to the transaction snapshot.'),
    c('Advanced', 'Why can a very long snapshot transaction harm purge and storage behavior?',
      ['Old row versions may need to be retained until that transaction no longer needs them', 'Snapshots delete undo immediately', 'SELECT commits every other transaction', 'Repeatable read disables indexes'],
      'Long-lived readers can hold back cleanup of history, increasing undo pressure and operational risk.'),
  ]),

  ...codeLab(locking, 'sql', 'Claiming queue rows with SKIP LOCKED', String.raw`START TRANSACTION;

SELECT id
FROM jobs
WHERE status = 'ready'
ORDER BY id
LIMIT 10
FOR UPDATE SKIP LOCKED;

UPDATE jobs
SET status = 'running', worker_id = 17
WHERE id IN (101, 102, 103);

COMMIT;`, [
    c('Foundation', 'What does FOR UPDATE do to the selected job rows?',
      ['Acquires exclusive-style locks for the claiming transaction', 'Deletes the jobs immediately', 'Makes the rows visible only on replicas', 'Sorts the rows after COMMIT'],
      'The locking read protects selected rows from competing modifications while the transaction marks them as claimed.'),
    c('Applied', 'What does SKIP LOCKED change when another worker already holds a matching row lock?',
      ['This worker skips that row instead of waiting for it', 'The other worker is killed', 'The lock is ignored and both workers receive the row', 'The transaction automatically rolls back'],
      'Skip-locked processing lets concurrent workers claim different available rows without blocking behind already claimed work.'),
    c('Applied', 'Why must the SELECT and UPDATE remain in the same transaction?',
      ['The claim decision and status change must share the acquired locks', 'UPDATE cannot run outside a SELECT statement', 'Transactions are required for ORDER BY', 'COMMIT creates the job IDs'],
      'Ending the transaction between the read and write would release locks and allow another worker to claim the same rows.'),
    c('Advanced', 'Why should workers use a consistent ordering such as id when claiming multiple rows?',
      ['Consistent lock acquisition order reduces deadlock opportunities', 'Ordering makes every ID contiguous', 'It disables secondary indexes', 'It guarantees exactly-once external effects'],
      'Deadlocks arise from incompatible lock orders. Stable ordering reduces cycles, though retry handling remains necessary.'),
  ]),

  ...codeLab(concurrency, 'sql', 'An atomic conditional inventory update', String.raw`UPDATE products
SET stock = stock - 3
WHERE id = 42
  AND stock >= 3;

SELECT ROW_COUNT() AS changed_rows;`, [
    c('Foundation', 'What does changed_rows = 1 prove for this statement?',
      ['The product existed with enough stock and was decremented atomically', 'Exactly one SELECT was executed', 'The transaction committed on every replica', 'The stock value is now exactly one'],
      'The condition and update are evaluated as one write operation; one affected row means the guarded transition occurred.'),
    c('Applied', 'After the guarded inventory update executes, what does changed_rows equal to zero mean?',
      ['Either the product was missing or it lacked enough stock', 'The stock was decremented twice', 'The WHERE clause was ignored', 'The database connection closed'],
      'The statement intentionally combines both failure cases. A separate lookup is needed only if the application must distinguish them.'),
    c('Applied', 'Why is this stronger than SELECT stock followed by an unconditional UPDATE?',
      ['Concurrent sessions cannot both act on the same stale check before the guarded write', 'SELECT statements cannot read stock', 'Unconditional UPDATE always sets stock to NULL', 'The atomic form requires no index'],
      'The business condition participates in the write itself, eliminating the application-level check-then-write race.'),
    c('Advanced', 'What schema rule remains useful even with this guarded statement?',
      ['A CHECK constraint preventing negative stock from other write paths', 'A foreign key from stock to products', 'A unique constraint allowing only one product', 'Removing the primary key'],
      'Defense in depth protects the invariant when future code updates stock through a different statement.'),
  ]),

  ...codeLab(migrations, 'sql', 'Requesting an online secondary-index build', String.raw`ALTER TABLE orders
  ADD INDEX idx_orders_status_created (status, created_at),
  ALGORITHM = INPLACE,
  LOCK = NONE;`, [
    c('Foundation', 'What does LOCK = NONE request for concurrent application traffic?',
      ['Permit reads and writes while the DDL operation runs', 'Prevent every connection from reading the table', 'Run the migration without metadata locks of any kind', 'Skip building the index'],
      'The clause requests the least restrictive supported DML lock level, but brief metadata locking and operation-specific limits still matter.'),
    c('Applied', 'What happens if this exact operation cannot satisfy the requested algorithm or lock level?',
      ['MySQL reports an error instead of silently using a more restrictive request', 'MySQL always drops the table', 'The index is created only on replicas', 'The operation becomes a SELECT'],
      'Explicit clauses can make unsupported deployment assumptions fail visibly rather than unexpectedly choosing another behavior.'),
    c('Applied', 'Why can this DDL still be operationally expensive without long write blocking?',
      ['It scans data, builds index pages, consumes I/O, and may create replication lag', 'Secondary indexes contain no data', 'INPLACE uses zero disk space', 'LOCK NONE pauses the database clock'],
      'Online availability does not remove resource cost. Capacity, duration, temporary space, and replica behavior still require planning.'),
    c('Advanced', 'What can make the statement wait before it begins despite LOCK = NONE?',
      ['An existing transaction holding an incompatible metadata lock', 'A missing browser cookie', 'The account application role', 'The ORDER BY clause'],
      'DDL needs metadata coordination. Long transactions referencing the table can delay acquisition even for an online algorithm.'),
  ]),

  ...codeLab(normalization, 'sql', 'A generated total derived from normalized line values', String.raw`CREATE TABLE invoice_lines (
    id BIGINT UNSIGNED PRIMARY KEY,
    invoice_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    line_total DECIMAL(14, 2)
      GENERATED ALWAYS AS (quantity * unit_price) STORED,
    INDEX idx_invoice_total (invoice_id, line_total)
);`, [
    c('Foundation', 'Why is line_total less vulnerable to drift than an ordinary writable duplicate column?',
      ['The database derives it from quantity and unit_price on each row', 'Generated columns cannot contain numbers', 'The application writes it before every query', 'The index recalculates all invoices globally'],
      'A generated expression centralizes the derivation and prevents write paths from supplying a contradictory line total.'),
    c('Applied', 'What does STORED mean for this generated column?',
      ['The computed value is materialized on disk and maintained on writes', 'The expression is evaluated only in the browser', 'The value may be edited manually', 'The column exists only in query aliases'],
      'Stored generated columns occupy storage and can support indexing while the engine maintains their expression result.'),
    c('Applied', 'What normalization benefit remains from keeping invoice lines separate from invoices?',
      ['Each repeating line item has its own row instead of repeated invoice columns', 'An invoice can contain only one line', 'Every invoice total is a string', 'Foreign keys become unnecessary'],
      'The one-to-many structure models repeating items without fixed line1, line2, and line3 groups.'),
    c('Advanced', 'What total is not automatically maintained by this expression?',
      ['The aggregate total across all lines of an invoice', 'The quantity multiplied by unit_price for one line', 'The line_total index entry', 'The line row value after an update'],
      'Generated columns are row-local. Cross-row invoice totals need aggregation, controlled summary maintenance, or query-time computation.'),
  ]),

  ...codeLab(json, 'sql', 'Indexing a scalar extracted from JSON', String.raw`CREATE TABLE events (
    id BIGINT UNSIGNED PRIMARY KEY,
    payload JSON NOT NULL,
    event_type VARCHAR(40)
      GENERATED ALWAYS AS (
        JSON_UNQUOTE(JSON_EXTRACT(payload, '$.type'))
      ) STORED,
    INDEX idx_event_type (event_type)
);

SELECT id FROM events WHERE event_type = 'purchase';`, [
    c('Foundation', 'Why create event_type when the value already exists inside payload?',
      ['It exposes a typed scalar that can be indexed and queried directly', 'JSON columns cannot store type', 'Generated columns duplicate the whole JSON document', 'Indexes work only on primary keys'],
      'Extracting a frequently queried scalar into a generated column gives the optimizer a conventional indexed access path.'),
    c('Applied', 'What does JSON_UNQUOTE contribute to the generated expression?',
      ['It converts the extracted JSON string value to SQL text without JSON quotes', 'It validates every property in payload', 'It removes the type property from JSON', 'It encrypts the value'],
      'JSON_EXTRACT returns a JSON value. Unquoting yields a VARCHAR-compatible scalar for the generated column.'),
    c('Applied', 'What happens to event_type when payload is updated?',
      ['MySQL recomputes the generated value and maintains its index entry', 'The old value remains forever', 'The application must always update both manually', 'The row becomes invalid JSON automatically'],
      'The generated expression is maintained from its source columns as part of the row write.'),
    c('Advanced', 'What contract risk remains when producers send a missing or non-string type?',
      ['The generated result may be NULL or unexpected, so input validation and constraints still matter', 'The index repairs every malformed payload', 'JSON guarantees a type property', 'STORED converts every value to purchase'],
      'A generated path improves querying but does not validate the complete event schema or producer behavior.'),
  ]),

  ...codeLab(correctness, 'sql', 'NOT IN and NULL contamination', String.raw`SELECT c.id
FROM customers AS c
WHERE c.id NOT IN (
  SELECT o.customer_id
  FROM orders AS o
);

-- orders.customer_id currently contains: 4, 8, NULL`, [
    c('Foundation', 'Why can this query return no customers when the subquery contains NULL?',
      ['Comparisons against the list become UNKNOWN, and NOT UNKNOWN is still UNKNOWN', 'NOT IN deletes the customers table', 'NULL is treated as every customer ID', 'Subqueries cannot return integers'],
      'Three-valued logic contaminates the membership test when the list includes an unknown value, so WHERE retains no non-matching rows.'),
    c('Applied', 'Which rewrite expresses the anti-join safely without depending on subquery NULL removal?',
      ['Use NOT EXISTS with a correlated equality predicate', 'Replace NOT IN with IN', 'Compare customer IDs to NULL', 'Add ORDER BY inside the subquery'],
      'NOT EXISTS asks whether a matching order row exists for the current customer and is not invalidated by unrelated NULL rows.'),
    c('Applied', 'When would filtering WHERE o.customer_id IS NOT NULL inside the subquery also restore expected NOT IN behavior?',
      ['When all remaining subquery values are definite comparable customer IDs', 'Never, because NOT IN cannot compare integers', 'Only when customers is empty', 'When every customer has an order'],
      'Removing NULL from the list avoids the unknown comparison, though NOT EXISTS often communicates the intended anti-join more directly.'),
    c('Advanced', 'What schema change can eliminate this particular NULL source if every order must have a customer?',
      ['Declare orders.customer_id NOT NULL with an appropriate foreign key', 'Make customer IDs nullable too', 'Remove the orders primary key', 'Store customer_id as JSON'],
      'If the domain requires ownership, a non-null foreign key encodes that rule and simplifies downstream query semantics.'),
  ]),

  ...codeLab(pagination, 'sql', 'Window ranking and deterministic keyset continuation', String.raw`WITH ranked AS (
  SELECT id, account_id, total,
         ROW_NUMBER() OVER (
           PARTITION BY account_id
           ORDER BY total DESC, id
         ) AS position
  FROM orders
)
SELECT id, account_id, total, position
FROM ranked
WHERE position <= 3
ORDER BY account_id, position;`, [
    c('Foundation', 'What does PARTITION BY account_id do for ROW_NUMBER?',
      ['Restarts numbering independently for each account', 'Physically partitions the orders table', 'Filters to one account only', 'Creates a primary key'],
      'Window partitions divide the result for calculation without collapsing rows or changing table storage.'),
    c('Applied', 'Why include id after total in the window ORDER BY?',
      ['It gives equal totals a deterministic tiebreak order', 'It adds id to every total', 'ROW_NUMBER requires a primary key name', 'It removes duplicate rows'],
      'Without a tiebreaker, equal totals can receive positions in an unspecified order between executions.'),
    c('Applied', 'How does ROW_NUMBER differ from RANK for equal totals?',
      ['ROW_NUMBER assigns distinct consecutive positions; RANK gives ties the same rank and leaves gaps', 'RANK deletes tied rows', 'ROW_NUMBER always returns one row', 'There is no difference'],
      'The choice depends on whether ties should share a business position or receive a deterministic sequence.'),
    c('Advanced', 'Why must the position filter appear outside the CTE select block?',
      ['Window results are calculated after that block’s WHERE phase', 'CTEs cannot contain WHERE clauses', 'position is a permanent column only outside', 'ORDER BY disables filters'],
      'The outer query can filter the already computed window value; the same-level WHERE cannot use a value not calculated yet.'),
  ]),

  ...codeLab(security, 'sql', 'Least privilege and parameterized execution', String.raw`CREATE USER 'reporter'@'10.%' IDENTIFIED BY 'managed-secret';
GRANT SELECT ON analytics.* TO 'reporter'@'10.%';

PREPARE statement FROM
  'SELECT id, total FROM orders WHERE account_id = ?';
SET @account_id = 42;
EXECUTE statement USING @account_id;`, [
    c('Foundation', 'What can the reporter account do after this GRANT?',
      ['Read tables in analytics but not write them through this grant', 'Modify every schema on the server', 'Create new administrative users', 'Read only the orders row with ID 42'],
      'The privilege is SELECT scoped to one database wildcard. Authentication and row-level tenant rules remain separate.'),
    c('Applied', 'What does the placeholder protect in the prepared statement?',
      ['The account value is bound separately from SQL syntax', 'The reporter password is encrypted in the query', 'The table name can be supplied as arbitrary input', 'The result is automatically authorized'],
      'Prepared values cannot break out into SQL structure, reducing injection risk for data values.'),
    c('Applied', 'Why is 10.% part of the MySQL account identity?',
      ['MySQL privileges distinguish users by both username and allowed host pattern', 'It limits the account to ten queries', 'It is the database port', 'It means the password is optional'],
      'A MySQL account includes user and host, allowing connection origin to be constrained as part of authentication.'),
    c('Advanced', 'What application rule is still required before binding account_id = 42?',
      ['Verify the current actor is allowed to report on account 42', 'SELECT privilege grants access to every tenant by design', 'Prepared statements infer tenant ownership', 'The host pattern performs row-level security'],
      'Database privileges limit the application connection, but they do not know the end-user ownership policy for each request.'),
  ]),

  ...codeLab(backup, 'sql', 'Point-in-time recovery using a full backup and binary logs', String.raw`-- Recovery plan recorded at backup time:
-- 1. Restore the full backup completed at 01:00.
-- 2. Replay binary-log events after the backup position.
-- 3. Stop immediately before the accidental DELETE at 09:42:17.

SHOW BINARY LOGS;
SHOW BINARY LOG STATUS;

-- Validate the restored copy before redirecting application traffic.`, [
    c('Foundation', 'Why is the full backup alone insufficient for recovery to 09:42?',
      ['It contains state only through 01:00, so later valid changes need log replay', 'Full backups contain no table rows', 'Binary logs contain the database schema only', 'The DELETE automatically edits the backup'],
      'Point-in-time recovery combines a base snapshot with the ordered change history after that snapshot.'),
    c('Applied', 'Why stop before the accidental DELETE instead of replaying every available event?',
      ['The binary log also records the damaging committed statement', 'Binary logs automatically skip DELETE statements', 'Later events cannot contain valid work', 'Restore tools cannot select a stopping point'],
      'Change logs faithfully reproduce both correct and incorrect committed changes. Recovery chooses the desired boundary.'),
    c('Applied', 'Why restore into an isolated environment first?',
      ['It permits consistency and application validation before replacing production state', 'MySQL forbids restoring to production disks', 'Isolation removes the need for access controls', 'The backup becomes read-only forever'],
      'A successful restore command is not enough; teams should verify data, schema, permissions, and application behavior before cutover.'),
    c('Advanced', 'What makes a replica an incomplete substitute for this retained recovery history?',
      ['Replication can quickly copy the accidental DELETE to the replica', 'Replicas contain no table data', 'Replicas cannot execute SELECT', 'Binary logs exist only on replicas'],
      'Replication improves availability and scaling but follows the live change stream, including destructive mistakes.'),
  ]),

  ...codeLab(replication, 'sql', 'Detecting replica lag and protecting read-after-write behavior', String.raw`-- On the replica
SHOW REPLICA STATUS;

-- Application routing idea:
-- INSERT/UPDATE -> primary
-- ordinary dashboard reads -> replica
-- confirmation read immediately after a write -> primary

SELECT @@GLOBAL.gtid_executed;`, [
    c('Foundation', 'Why can an immediate confirmation read from a replica return stale data?',
      ['Replication applies primary changes asynchronously and may lag', 'Replicas never store updated rows', 'SELECT always uses a snapshot from yesterday', 'GTID disables writes on the primary'],
      'A committed primary write can become visible on a replica later, creating a read-after-write consistency gap.'),
    c('Applied', 'Why route the confirmation read to the primary?',
      ['It reads from the authoritative server that committed the write', 'The primary automatically caches every query forever', 'Replicas cannot filter rows', 'It repairs every failed replication event'],
      'Primary affinity is a simple consistency strategy for user flows that must immediately observe their own write.'),
    c('Applied', 'Within this replication topology, what units of work do GTIDs identify conceptually?',
      ['Committed transactions in a topology-independent replication identity scheme', 'Individual table columns', 'User authentication sessions', 'Buffer-pool pages'],
      'Global transaction identifiers help track and compare executed transactions across replication members.'),
    c('Advanced', 'Why is a single lag-seconds metric not a complete replica-health signal?',
      ['Apply errors, stopped threads, workload bursts, and position gaps can require additional evidence', 'Lag is always exactly zero', 'Replica health depends only on disk size', 'GTID removes every replication failure'],
      'Operational health combines thread state, errors, positions, queue depth, and application consistency requirements.'),
  ]),

  ...codeLab(partitioning, 'sql', 'Range partitioning and pruning by date', String.raw`CREATE TABLE audit_events (
    id BIGINT UNSIGNED NOT NULL,
    occurred_on DATE NOT NULL,
    payload JSON NOT NULL,
    PRIMARY KEY (id, occurred_on)
)
PARTITION BY RANGE COLUMNS (occurred_on) (
    PARTITION p2025 VALUES LESS THAN ('2026-01-01'),
    PARTITION p2026 VALUES LESS THAN ('2027-01-01'),
    PARTITION pmax  VALUES LESS THAN (MAXVALUE)
);`, [
    c('Foundation', 'According to these range boundaries, where is a row dated 2026-07-16 stored?',
      ['In partition p2026', 'In p2025', 'In every partition', 'Outside the table'],
      'The date is not less than the 2026 boundary but is less than the 2027 boundary.'),
    c('Applied', 'What enables partition pruning for a query on a narrow occurred_on range?',
      ['A predicate the optimizer can relate directly to the partitioning expression', 'Selecting payload only', 'Removing occurred_on from WHERE', 'Ordering by JSON length'],
      'Pruning excludes partitions whose bounds cannot satisfy the date condition, reducing scanned data.'),
    c('Applied', 'Why does the primary key include occurred_on?',
      ['Unique keys on a partitioned table must include all partitioning columns', 'Dates are always globally unique', 'JSON columns cannot coexist with a simple key', 'The ID is no longer needed'],
      'MySQL requires every unique key to contain the partitioning columns so uniqueness can be enforced across partition routing.'),
    c('Advanced', 'What lifecycle advantage can date partitions provide for old audit data?',
      ['Dropping an old partition can remove a large date range efficiently', 'Partitions automatically back up themselves', 'Every partition uses a separate MySQL server', 'Old rows become immutable by default'],
      'Partition-level maintenance can be faster than row-by-row deletion, but retention, backups, and constraints still require planning.'),
  ]),

  ...codeLab(connections, 'sql', 'Session state and connection-pool reuse', String.raw`SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE';
SET SESSION time_zone = '+00:00';

START TRANSACTION;
UPDATE jobs SET status = 'running' WHERE id = 7;
-- application accidentally returns this connection to the pool here`, [
    c('Foundation', 'Why is returning this connection before COMMIT or ROLLBACK dangerous?',
      ['The next borrower may inherit an open transaction and its locks', 'Connection pools automatically commit every statement', 'The UPDATE becomes a SELECT', 'Session variables are stored per table'],
      'A pooled connection is a reused server session. Unfinished transaction state can leak across unrelated application work.'),
    c('Applied', 'Which settings shown persist for the server session rather than for one statement?',
      ['Isolation level, sql_mode, and time_zone session values', 'Only the jobs row status', 'The application user interface language', 'The table primary key'],
      'SET SESSION changes connection-local state that a pool must initialize or reset consistently.'),
    c('Applied', 'Why should pool size not simply equal the number of application requests?',
      ['Each database connection consumes server resources and excessive concurrency can increase contention', 'MySQL permits only one connection', 'Pools disable transactions above ten connections', 'HTTP requests never use SQL'],
      'Capacity is bounded by database CPU, memory, I/O, and lock behavior. A pool should apply backpressure rather than overwhelm the server.'),
    c('Advanced', 'What cleanup should a robust pool perform before reusing a connection?',
      ['End any transaction and restore required session state', 'Drop all tables touched by the session', 'Change every primary key', 'Disable strict mode permanently'],
      'Connection hygiene prevents transaction, temporary object, and session-option leakage between borrowers.'),
  ]),

  ...codeLab(observability, 'sql', 'Finding blocking and waiting InnoDB locks', String.raw`SELECT waiting.PROCESSLIST_ID AS waiting_thread,
       blocking.PROCESSLIST_ID AS blocking_thread,
       waits.REQUESTING_ENGINE_LOCK_ID,
       waits.BLOCKING_ENGINE_LOCK_ID
FROM performance_schema.data_lock_waits AS waits
JOIN performance_schema.threads AS waiting
  ON waiting.THREAD_ID = waits.REQUESTING_THREAD_ID
JOIN performance_schema.threads AS blocking
  ON blocking.THREAD_ID = waits.BLOCKING_THREAD_ID;`, [
    c('Foundation', 'What does each data_lock_waits relationship describe?',
      ['A requested lock currently blocked by an incompatible held lock', 'A completed query result cache entry', 'A missing table index', 'A binary-log backup file'],
      'The table connects lock requests that are waiting to locks that currently prevent them from proceeding.'),
    c('Applied', 'In this lock-wait diagnostic query, why join performance_schema.threads twice?',
      ['To map internal thread identifiers to connection-oriented process information', 'To create more locks', 'To aggregate table rows by account', 'To change transaction isolation'],
      'Thread metadata helps operators connect engine lock IDs to sessions they can inspect in process and application context.'),
    c('Applied', 'What should an operator inspect before terminating the blocking thread?',
      ['Its transaction age, statement, application owner, and rollback impact', 'Only the thread ID numeric size', 'The database server hostname color', 'Whether the waiting query uses SELECT'],
      'Killing a connection can roll back substantial work or interrupt a critical process, so the blocker’s context matters.'),
    c('Advanced', 'Why can a fast individual statement still participate in a long lock incident?',
      ['The surrounding transaction may remain open long after the statement finished', 'Locks exist only while CPU is executing', 'Fast statements never acquire locks', 'Performance Schema delays COMMIT automatically'],
      'Transaction lifetime controls lock lifetime. Application think time or forgotten commits can retain locks after SQL execution ends.'),
  ]),

  ...codeLab(production, 'sql', 'Reading buffer-pool effectiveness and I/O pressure', String.raw`SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';

-- Example snapshot:
-- Innodb_buffer_pool_read_requests = 900000000
-- Innodb_buffer_pool_reads         =   9000000

SELECT table_schema, table_name, data_length, index_length
FROM information_schema.tables
WHERE engine = 'InnoDB'
ORDER BY data_length + index_length DESC
LIMIT 10;`, [
    c('Foundation', 'What is the difference between buffer_pool_read_requests and buffer_pool_reads?',
      ['Requests are logical page reads; reads are pages that required physical storage access', 'Both counters always mean physical writes', 'Requests count SQL users only', 'Reads count table rows returned'],
      'The ratio helps describe how often requested pages are served from memory versus fetched from storage.'),
    c('Applied', 'What approximate physical-read fraction is shown by the example counters?',
      ['About 1 percent', 'About 10 percent', 'About 50 percent', 'Exactly 100 percent'],
      'Nine million physical reads divided by nine hundred million logical requests is approximately 0.01.'),
    c('Applied', 'Why is a high cache-hit ratio not sufficient proof that query performance is healthy?',
      ['Queries can still scan many cached pages, contend on locks, or use excessive CPU', 'Cached pages are always slower than disk', 'The buffer pool stores only indexes', 'Hit ratios determine authorization'],
      'Memory locality is one signal. Execution plans, latency, concurrency, and work per request still determine user-visible performance.'),
    c('Advanced', 'How does the information_schema query help capacity planning?',
      ['It identifies the largest table and index footprints competing for storage and cache', 'It resizes the buffer pool automatically', 'It deletes unused indexes', 'It predicts every future query exactly'],
      'Object sizes help compare the working set with memory and storage capacity, but usage and growth trends provide the rest of the picture.'),
  ]),
];
