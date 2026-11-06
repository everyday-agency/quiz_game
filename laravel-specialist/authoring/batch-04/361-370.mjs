import {q,file,output} from '../record.mjs';
import {queue,mail} from './fixture.mjs';
export default [
q({n:361,type:'I',sub:'mailable-explicit-view-data',needs:['Mailable Content','Blade view data','Property visibility'],why:'Expose a protected mailable value through the intended view-data boundary.',docs:['mail#via-the-with-parameter'],ask:'InvoiceMail stores total in a protected property. Its Blade template reads $total. Which content definition explicitly supplies that value without making the property public?',choices:[['new Content(view: "mail.invoice", with: ["total" => $this->total])','The with map supplies named data to the template independently of the property’s visibility.'],['new Content(view: "mail.invoice") with no other data mapping','Protected properties are not automatically exported as public view data.'],['new Content(view: $this->total)','The view argument names a template; it does not bind total inside mail.invoice.'],['new Envelope(subject: $this->total)','An envelope subject sets a message header rather than the template variable.']],test:output('12.50',String.raw`if (! is_dir(resource_path('views/mail'))) {
    mkdir(resource_path('views/mail'), 0700, true);
}
file_put_contents(resource_path('views/mail/invoice.blade.php'), '{{ $total }}');
class InvoiceMail extends Illuminate\Mail\Mailable
{
    public function __construct(protected string $total)
    {
    }

    public function content(): Illuminate\Mail\Mailables\Content
    {
        return new Illuminate\Mail\Mailables\Content(view: 'mail.invoice', with: ['total' => $this->total]);
    }
}
echo (new InvoiceMail('12.50'))->render();`)}),
q({n:362,type:'E',level:'F',sub:'mail-envelope-versus-body-address',needs:['Mail envelope','Blade body rendering'],why:'Distinguish a transport recipient from text that merely appears in the message body.',docs:['mail#configuring-the-envelope','mail#configuring-the-view'],ask:'No PendingMail recipient is added. Which address is the message’s To recipient?',code:[file(String.raw`use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class NoticeMail extends Mailable
{
    public function envelope(): Envelope
    {
        return new Envelope(
            to: [new Address('owner@example.test')],
            subject: 'Notice',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'mail.notice');
    }
}`,'app/Mail/NoticeMail.php'),file('Contact support@example.test for help.','resources/views/mail/notice.blade.php','blade')],choices:[['owner@example.test','The envelope explicitly configures the recipient; an address in the body does not change routing.'],['support@example.test','That address appears only in body text.'],['Both addresses','Laravel does not scan the body and add every mentioned address to the recipients.'],['Neither, because recipients can only be supplied with Mail::to()','The mailable envelope also supports recipient configuration.']],test:output('owner@example.test',String.raw`require getcwd().'/app/Mail/NoticeMail.php';
Illuminate\Support\Facades\Mail::send(new NoticeMail());
$message = app('mailer')->getSymfonyTransport()->messages()->first()->getOriginalMessage();
echo $message->getTo()[0]->getAddress();`)}),
q({n:363,type:'I',sub:'mail-attachment-storage-disk-reference',needs:['Mailable attachments','Storage disk paths'],why:'Resolve a disk-relative attachment through the intended filesystem abstraction.',docs:['mail#attaching-files-from-disk'],ask:'reports/run.csv exists on a configured reports disk. It is a disk-relative key, not an absolute local path or public URL. With Attachment imported, which declaration uses the correct disk abstraction?',choices:[['Attachment::fromStorageDisk("reports", "reports/run.csv")','The disk name and key are resolved through the configured filesystem before attaching the bytes.'],['Attachment::fromPath("reports/run.csv")','This treats the key as a local filesystem path rather than resolving it on the reports disk.'],['Attachment::fromData(fn () => "reports/run.csv", "run.csv")','This attaches the path text as data instead of reading the stored CSV.'],['Attachment::fromStorageDisk("reports/run.csv", "reports")','This reverses the disk name and path arguments.']],test:output('run.csv:a,b',mail+String.raw`config(['filesystems.disks.reports' => ['driver' => 'local', 'root' => getcwd().'/private-reports', 'throw' => true]]);
Illuminate\Support\Facades\Storage::disk('reports')->put('reports/run.csv', 'a,b');
class CsvMail extends SimpleMail
{
    public function attachments(): array
    {
        return [Illuminate\Mail\Mailables\Attachment::fromStorageDisk('reports', 'reports/run.csv')->withMime('text/csv')];
    }
}
Illuminate\Support\Facades\Mail::to('a@example.test')->send(new CsvMail());
$part = app('mailer')->getSymfonyTransport()->messages()->first()->getOriginalMessage()->getAttachments()[0];
echo $part->getFilename().':'.$part->getBody();`)}),
q({n:364,revision:2,type:'E',level:'F',sub:'attachment-data-callback-evaluation',needs:['Mail Attachment fromData','Lazy callback evaluation'],why:'Identify the moment data generation occurs instead of assuming declaration eagerly produces bytes.',docs:['mail#raw-data-attachments'],ask:'What is $reads immediately after this declaration, before the attachment is attached to a message?',code:[file(String.raw`use Illuminate\Mail\Mailables\Attachment;

$reads = 0;

$attachment = Attachment::fromData(function () use (&$reads) {
    $reads++;

    return 'report bytes';
}, 'report.txt');`)],choices:[['0','fromData retains the callback; the bytes are produced when the attachment is materialized for a message.'],['1','Constructing the attachment descriptor does not immediately invoke the data callback.'],['2','There is no automatic construction-time validation pass that reads the callback twice.'],['An undefined variable because by-reference captures cannot be deferred','The closure retains a valid reference to the variable in this scope.']],test:output('0:1',String.raw`require getcwd().'/probe.php';
echo $reads.':';
$message = new Illuminate\Mail\Message(new Symfony\Component\Mime\Email());
$attachment->attachTo($message);
echo $reads;`)}),
q({n:365,type:'E',sub:'should-queue-mailable-send-path',needs:['Mail send','Queueable mailables','ShouldQueue'],why:'Recognize that a mailable’s queue contract can change the apparent send call’s execution mode.',docs:['mail#queueing-by-default'],ask:'ReceiptMail implements ShouldQueue. The queue connection is asynchronous and no worker runs. What does Mail::to($recipient)->send(new ReceiptMail()) do?',choices:[['Queues the mailable for later sending.','A mailable implementing ShouldQueue follows the queue path even when passed to send.'],['Sends synchronously because only the queue method can enqueue mail.','The ShouldQueue contract is explicitly honored by the send path.'],['Sends synchronously and also enqueues a duplicate for retry.','The normal path chooses queueing rather than performing both deliveries.'],['Throws because ShouldQueue mailables cannot be passed to send.','Passing such a mailable to send is supported and selects deferred sending.']],test:output('1:0',queue+mail+String.raw`class ReceiptMail extends SimpleMail implements Illuminate\Contracts\Queue\ShouldQueue
{
}
Illuminate\Support\Facades\Mail::to('a@example.test')->send(new ReceiptMail());
echo Illuminate\Support\Facades\DB::table('jobs')->count().':'.app('mailer')->getSymfonyTransport()->messages()->count();`)}),
q({n:366,revision:2,type:'E',sub:'queued-mail-locale-restoration',needs:['Localized mailables','Queued mail','Worker locale lifetime'],why:'Apply a per-message locale without leaking it into later work in the worker process.',docs:['mail#localizing-mailables'],ask:'The worker locale is en. A mailable is queued with locale("fr"), and its template translates Receipt. Both translations exist. Which locale behavior is expected while sending and immediately afterwards?',choices:[['French for this message, then en again for the worker.','The mailable carries its chosen locale and applies it within a scope that restores the previous locale.'],['The message uses English because queued mail discards locale metadata.','Laravel preserves the mailable locale for queued delivery.'],['The message uses French and permanently switches the worker to fr.','The locale scope restores the prior application locale after the operation.'],['Rendering fails unless the worker’s global locale was already fr.','A mailable can explicitly request a locale different from the worker default.']],test:output('Reçu:en',queue+mail+String.raw`file_put_contents(lang_path('en.json'), '{"Receipt":"Receipt"}');
file_put_contents(lang_path('fr.json'), '{"Receipt":"Reçu"}');
file_put_contents(resource_path('views/mail/simple.blade.php'), "{{ __('Receipt') }}");
class LocalizedMail extends SimpleMail implements Illuminate\Contracts\Queue\ShouldQueue
{
}
Illuminate\Support\Facades\Mail::to('a@example.test')->locale('fr')->queue(new LocalizedMail());
app('queue')->connection()->pop()->fire();
$message = app('mailer')->getSymfonyTransport()->messages()->first()->getOriginalMessage();
echo $message->getHtmlBody().':'.app()->getLocale();`)}),
q({n:367,revision:2,type:'I',level:'F',sub:'inline-mail-image-cid',needs:['Mail inline attachments','Private files','HTML message references'],why:'Include the image bytes in the message rather than linking to an inaccessible server path.',docs:['mail#inline-attachments'],ask:'An HTML email must display a PNG from a private local file, and the recipient must not need access to the server’s filesystem or a public image URL. In the mail Blade template, which source expression embeds the file with a CID reference?',choices:[['{{ $message->embed($absolutePath) }}','embed adds an inline attachment and returns the content-ID URL used by the email body.'],['{{ $absolutePath }}','A server filesystem path is not accessible to the recipient’s mail client.'],['{{ asset($absolutePath) }}','Generating an HTTP asset URL does not publish or embed a private local file.'],['{{ base_path($absolutePath) }}','Resolving a local path still provides no image bytes or usable recipient-side resource.']],test:output('cid:inline',mail+String.raw`$path = getcwd().'/logo.png';
file_put_contents($path, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1kAAAAASUVORK5CYII='));
file_put_contents(resource_path('views/mail/simple.blade.php'), '<img src="{{ $message->embed($path) }}">');
Illuminate\Support\Facades\Mail::send('mail.simple', ['path' => $path], function ($message) {
    $message->to('a@example.test')->subject('Logo');
});
$message = app('mailer')->getSymfonyTransport()->messages()->first()->getOriginalMessage();
echo (str_contains($message->getHtmlBody(), 'cid:') ? 'cid' : 'path').':'.($message->getAttachments()[0]->getDisposition() === 'inline' ? 'inline' : 'attachment');`)}),
q({n:368,type:'T',level:'F',sub:'mail-fake-queued-versus-sent',needs:['Mail fake','Queued mail assertions'],why:'Assert the recorded delivery intent corresponding to the chosen send path.',docs:['mail#testing-mailable-sending'],ask:'The action calls Mail::to($recipient)->queue(new ReceiptMail()). Mail::fake() is active. Which assertion checks this intent directly?',choices:[['Mail::assertQueued(ReceiptMail::class);','The fake records queued mail separately from immediately sent mail.'],['Mail::assertSent(ReceiptMail::class);','A queued record does not satisfy the separate immediate-send assertion.'],['Mail::assertNothingOutgoing();','The action is expected to create outgoing work, so asserting none contradicts the requirement.'],['Queue::assertPushed(ReceiptMail::class);','A mail fake intercepts mail intent; the actual queue job type would also be a wrapper rather than the mailable itself.']],test:output('queued:not-sent',mail+String.raw`Illuminate\Support\Facades\Mail::fake();
Illuminate\Support\Facades\Mail::to('a@example.test')->queue(new SimpleMail());
Illuminate\Support\Facades\Mail::assertQueued(SimpleMail::class);
Illuminate\Support\Facades\Mail::assertNothingSent();
echo 'queued:not-sent';`)}),
q({n:369,revision:2,type:'T',level:'F',sub:'mail-recipient-and-domain-data-assertion',needs:['Mail fake callbacks','Recipient routing','Mailable data'],why:'Verify both destination and business context instead of only a class or count.',docs:['mail#testing-mailable-sending'],ask:'A receipt test must verify invoice 7 is sent to owner@example.test. The mailable exposes invoiceId. Which assertion checks both requirements?',choices:[['Mail::assertSent(ReceiptMail::class, fn ($mail) => $mail->hasTo("owner@example.test") && $mail->invoiceId === 7);','The predicate examines the actual recorded mailable recipient and its domain data.'],['Mail::assertSent(ReceiptMail::class, 1);','A count alone does not establish either recipient or invoice identity.'],['Mail::assertSent(ReceiptMail::class, fn ($mail) => $mail->invoiceId === 7);','This checks the invoice but can pass for mail sent to the wrong recipient.'],['Mail::assertSent(ReceiptMail::class, fn ($mail) => $mail->hasTo("owner@example.test"));','This checks the recipient but can pass for the wrong invoice.']],test:output('matched',mail+String.raw`class ReceiptMail extends SimpleMail
{
    public function __construct(public int $invoiceId)
    {
    }
}
Illuminate\Support\Facades\Mail::fake();
Illuminate\Support\Facades\Mail::to('owner@example.test')->send(new ReceiptMail(7));
Illuminate\Support\Facades\Mail::assertSent(ReceiptMail::class, fn ($m) => $m->hasTo('owner@example.test') && $m->invoiceId === 7);
echo 'matched';`)}),
q({n:370,type:'I',level:'F',sub:'multipart-html-and-text-mail',needs:['Mailable Content','HTML and plain-text alternatives'],why:'Associate each template with its intended MIME representation.',docs:['mail#plain-text-emails'],ask:'mail.html contains HTML markup; mail.text contains a plain-text alternative. A message must include both representations. Which Content configuration selects both correctly?',choices:[['new Content(view: "mail.html", text: "mail.text")','view supplies the HTML representation and text supplies the separate plain-text representation.'],['new Content(view: "mail.text", text: "mail.html")','This reverses the representations and puts HTML markup in the plain-text part.'],['new Content(view: "mail.html")','This supplies only the HTML view, without the requested explicit text template.'],['new Content(text: "mail.text")','This supplies only the plain-text view and omits the HTML representation.']],test:output('<strong>Paid</strong>:Paid',mail+String.raw`file_put_contents(resource_path('views/mail/html.blade.php'), '<strong>Paid</strong>');
file_put_contents(resource_path('views/mail/text.blade.php'), 'Paid');
class MultipartMail extends SimpleMail
{
    public function content(): Illuminate\Mail\Mailables\Content
    {
        return new Illuminate\Mail\Mailables\Content(view: 'mail.html', text: 'mail.text');
    }
}
Illuminate\Support\Facades\Mail::to('a@example.test')->send(new MultipartMail());
$message = app('mailer')->getSymfonyTransport()->messages()->first()->getOriginalMessage();
echo $message->getHtmlBody().':'.$message->getTextBody();`)}),
];
