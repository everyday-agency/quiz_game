export const queue=String.raw`Illuminate\Support\Facades\Schema::create('jobs', function ($t) {
    $t->bigIncrements('id');
    $t->string('queue')->index();
    $t->longText('payload');
    $t->unsignedTinyInteger('attempts');
    $t->unsignedInteger('reserved_at')->nullable();
    $t->unsignedInteger('available_at');
    $t->unsignedInteger('created_at');
});
config([
    'queue.default' => 'database',
    'queue.connections.database' => [
        'driver' => 'database',
        'connection' => 'sqlite',
        'table' => 'jobs',
        'queue' => 'default',
        'retry_after' => 90,
        'after_commit' => false,
    ],
]);
`;
export const marker=String.raw`class MarkWork implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;

    public function handle(): void
    {
        app('cache')->put('handled', true);
    }
}
`;
export const batches=String.raw`Illuminate\Support\Facades\Schema::create('job_batches', function ($t) {
    $t->string('id')->primary();
    $t->string('name');
    $t->integer('total_jobs');
    $t->integer('pending_jobs');
    $t->integer('failed_jobs');
    $t->longText('failed_job_ids');
    $t->mediumText('options')->nullable();
    $t->integer('cancelled_at')->nullable();
    $t->integer('created_at');
    $t->integer('finished_at')->nullable();
});
config(['queue.batching' => ['database' => 'sqlite', 'table' => 'job_batches']]);
class BatchWork implements Illuminate\Contracts\Queue\ShouldQueue
{
    use Illuminate\Foundation\Queue\Queueable;
    use Illuminate\Bus\Batchable;

    public function __construct(public bool $shouldFail = false)
    {
    }

    public function handle(): void
    {
        if ($this->shouldFail) {
            throw new RuntimeException('fixture failure');
        }
    }
}
`;
export const broadcast=String.raw`class CaptureBroadcaster extends Illuminate\Broadcasting\Broadcasters\Broadcaster
{
    public function auth($request)
    {
        return $this->verifyUserCanAccessChannel($request, $request->input('channel_name'));
    }

    public function validAuthenticationResponse($request, $result)
    {
        return $result;
    }

    public function broadcast(array $channels, $event, array $payload = [])
    {
        app('cache')->put('broadcast-payload', $payload);
        app('cache')->increment('broadcast-count');
    }
}
config(['broadcasting.default' => 'capture', 'broadcasting.connections.capture' => ['driver' => 'capture']]);
app(Illuminate\Broadcasting\BroadcastManager::class)->extend('capture', fn () => new CaptureBroadcaster());
`;
export const mail=String.raw`if (! is_dir(resource_path('views/mail'))) {
    mkdir(resource_path('views/mail'), 0700, true);
}
file_put_contents(resource_path('views/mail/simple.blade.php'), 'Receipt');
class SimpleMail extends Illuminate\Mail\Mailable
{
    use Illuminate\Bus\Queueable;
    use Illuminate\Queue\SerializesModels;

    public function envelope(): Illuminate\Mail\Mailables\Envelope
    {
        return new Illuminate\Mail\Mailables\Envelope(subject: 'Receipt');
    }

    public function content(): Illuminate\Mail\Mailables\Content
    {
        return new Illuminate\Mail\Mailables\Content(view: 'mail.simple');
    }
}
`;
export const notifications=String.raw`Illuminate\Support\Facades\Schema::create('members', function ($t) {
    $t->id();
    $t->string('name');
    $t->string('email');
    $t->boolean('email_notifications')->default(false);
});
Illuminate\Support\Facades\Schema::create('notifications', function ($t) {
    $t->uuid('id')->primary();
    $t->string('type');
    $t->morphs('notifiable');
    $t->text('data');
    $t->timestamp('read_at')->nullable();
    $t->timestamps();
});
class Member extends Illuminate\Database\Eloquent\Model
{
    use Illuminate\Notifications\Notifiable;

    public $timestamps = false;
    protected $guarded = [];
}
$member = Member::create(['name' => 'Ada', 'email' => 'ada@example.test']);
class DatabaseNotice extends Illuminate\Notifications\Notification
{
    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return ['message' => 'Hello'];
    }
}
`;
