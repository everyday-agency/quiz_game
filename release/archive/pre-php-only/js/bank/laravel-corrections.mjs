const retryCode = {
  language: 'php', title: 'Queued customer synchronization',
  files: [{name: 'SyncCustomer.php', kind: 'laravel-fragment', snippet: `final class SyncCustomer implements ShouldQueue
{
    public int $tries = 5;
    public function __construct(public int $customerId) {}
    public function backoff(): array { return [10, 60, 300]; }
    public function retryUntil(): DateTime { return now()->addHour(); }
    public function handle(CrmClient $crm): void {
        $crm->sync($this->customerId);
    }
}`}],
};
const reportingCode = {
  language: 'php', title: 'Registered exception reporting callback',
  files: [{name: 'bootstrap/app.php (withExceptions callback)', kind: 'laravel-fragment', snippet: `$exceptions->report(function (PaymentFailed $exception) {
    Log::withContext(['payment_id' => $exception->paymentId]);
    return false;
});`}],
};
const retryAssumptions = 'Laravel aliases and the CRM client are supplied by the application. The job payload contains a future retryUntil timestamp. Only ordinary handler exceptions occur; no maxExceptions, timeout-failure, cancellation or custom middleware limit applies.';
const reportAssumptions = 'This callback is registered through withExceptions. It is the only reporting callback. PaymentFailed has a paymentId and no custom report method. Log::withContext succeeds and does not itself emit a log record. Default exception logging is enabled.';
const specifications = [
  ['LQ-489','Applied', 'Five attempts of this job have thrown ordinary exceptions, but its queued retry deadline is still in the future. Which rule governs retry eligibility?',
    ['The tries property stops the job after attempt five.', 'The backoff array stops the job after attempt three.', 'The retryUntil deadline takes precedence over tries.', 'The earlier of the tries limit and deadline stops retries.'], 2,
    'When retryUntil is supplied, Laravel uses its deadline instead of the numeric tries limit for these ordinary retries.',
    ['The numeric tries limit does not take precedence when retryUntil is present.', 'The array supplies delays; its length is not an attempt cap.', 'The future retry deadline allows further ordinary attempts under the stated exclusions.', 'This incorrectly treats tries and retryUntil as simultaneous limits.']],
  ['LQ-490','Foundation', 'The first three attempts fail and each is retried. What delay does this backoff array supply after the fourth ordinary failure, while the retry deadline remains in the future?',
    ['10 seconds', '60 seconds', 'No further retry', '300 seconds'], 3,
    'Backoff entries are selected by attempt index; after the available entries are exhausted Laravel reuses the last value, 300 seconds.',
    ['The first entry is not restarted after the last entry.', '60 is the second delay, not the fallback for later attempts.', 'Neither the array length nor tries=5 ends this fourth retry under the stated deadline policy.', 'The final backoff entry is reused for this and later failures.']],
  ['LQ-491','Applied', 'A job is queued at 10:00 with retryUntil returning 11:00. The same queued payload is retried at 10:50. What deadline does the worker use?',
    ['11:00, from the original queued payload', '11:50, recalculated from this attempt', '10:50, because retrying consumes the deadline', 'The deadline is removed after the first attempt'], 0,
    'Laravel stores retryUntil in the queue payload when the job is enqueued. Retrying that payload does not slide the deadline forward.',
    ['The worker reads the timestamp stored in the existing payload.', 'This would incorrectly grant a fresh hour on every retry.', 'Starting an attempt does not replace the stored timestamp with the start time.', 'The payload retains retryUntil across attempts.']],
  ['LQ-492','Applied', 'The CRM accepts an update, but the connection fails before the worker receives its response. Which change makes retrying that same logical operation safer?',
    ['Increase the last backoff delay.', 'Pass a persisted operation ID as an idempotency key that the CRM enforces.', 'Reduce the retry deadline to one minute.', 'Generate a new operation ID inside each handle call.'], 1,
    'A timeout leaves the remote outcome uncertain. A stable operation identity, enforced by the remote API, lets later attempts recover or reuse the same result.',
    ['Waiting longer does not identify a repeated operation.', 'The same key across attempts allows the CRM to recognize the already accepted intent.', 'A shorter retry window does not undo or identify the first accepted update.', 'A new key makes each retry look like a new operation.']],
  ['LQ-545','Foundation', 'When PaymentFailed is reported through this callback, what happens to Laravel’s default exception logging for this reporting pass?',
    ['It logs once with payment_id context.', 'It skips default logging after the callback returns.', 'It logs once without payment_id because callback context is discarded.', 'It logs twice: once for withContext and once for the exception.'], 1,
    'Returning false from a registered reporting callback stops propagation to the default logging stack. Adding context alone emits no record and does not change response rendering.',
    ['That would occur if propagation were allowed; the explicit false stops it.', 'The registered callback’s false return stops default reporting.', 'withContext is not discarded on callback return; the false result stops the record from being emitted.', 'withContext does not emit a record, and returning false also prevents the normal exception record.']],
  ['LQ-546','Applied', 'The payment ID must enrich the normal exception log. Which smallest edit lets default reporting continue after this callback?',
    ['Change Log::withContext to Log::info and retain return false.', 'Call report($exception) inside this callback and retain return false.', 'Replace return false with throw $exception.', 'Remove return false so the callback returns null.'], 3,
    'A registered callback returning null allows default reporting to continue. Log::withContext adds context for the normal record; there is no need to report the same exception recursively.',
    ['This emits a separate message while still stopping the normal exception log.', 'Reporting the same exception from its reporting callback risks recursion.', 'Throwing disrupts reporting instead of allowing the normal logging path to continue.', 'Without a false result or stop flag, the registered callback permits propagation.']],
  ['LQ-547','Applied', 'Which focused assertion would detect the reporting defect if the intended behavior is one normal exception log containing payment_id?',
    ['Verify that PaymentFailed is rendered as an HTTP 500 response.', 'Verify only that Log::withContext was called with payment_id.', 'Report PaymentFailed through the exception handler and assert one default log record with that context.', 'Assert that the callback returns false when called directly.'], 2,
    'A handler-level reporting check observes whether the default record is emitted with context. The current false return makes that assertion fail.',
    ['HTTP rendering may work even though reporting was stopped.', 'Context can be attached without any exception record being emitted.', 'This observes the required record and context through the reporting path.', 'That assertion would preserve the defect rather than test the intended outcome.']],
  ['LQ-548','Applied', 'A different exception defines its own public report() method and returns false. It has no registered reporting callbacks. How does this differ from the registered callback shown?',
    ['The exception method delegates to default reporting; the registered callback stops default reporting.', 'Both returns stop default reporting.', 'Both returns delegate to default reporting.', 'The exception method stops default reporting; the registered callback delegates.'], 0,
    'Laravel distinguishes an exception object’s report method from a registered reporting callback. False from the method requests fallback reporting; false from the callback stops propagation.',
    ['The two extension points have different false-return semantics.', 'This incorrectly applies the registered callback rule to the exception object.', 'This incorrectly applies the exception object rule to the registered callback.', 'This reverses both rules.']],
];

export const LARAVEL_CORRECTIONS = specifications.map(([id,difficulty,prompt,options,answer,explanation,rationales]) => ({
  id, revision: 2, changeKind: 'correctness', status: 'review', difficulty, prompt, options, answer, explanation,
  versions: { php: '8.4–8.5', laravel: '13.0.0', label: 'Laravel 13.0.0 reference · PHP 8.4–8.5.' },
  assumptions: id < 'LQ-500' ? retryAssumptions : reportAssumptions,
  code: id < 'LQ-500' ? retryCode : reportingCode,
  learning: { trace: explanation, rationales },
  family: id < 'LQ-500' ? 'laravel-queue-retry' : 'laravel-exception-reporting',
  references: [id < 'LQ-500' ? 'https://laravel.com/docs/13.x/queues#time-based-attempts' : 'https://laravel.com/docs/13.x/errors#reporting-exceptions'],
}));
