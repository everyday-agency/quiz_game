import { LEGACY_QUESTIONS } from './legacy-v1.mjs';

// Factual follow-through for the two pilot families; not additional pilot items.
const families = [
  {
    ids: ['LQ-414', 'LQ-415', 'LQ-416'], family: 'laravel-route-generation',
    before: 'the generated URL is /admin/reports and the route also carries the reports rate limiter',
    after: 'the generated URL is https://quiz.example.test/admin/reports; throttle:reports is attached to the route but does not execute while generating that URL',
    assumptions: 'The current request origin is https://quiz.example.test, with no base-path prefix, URL defaults or forced URL overrides. The shown route is registered and ReportController exists.',
    explanation: 'route() defaults to an absolute URL. The name prefix identifies the route; only the path prefix contributes a URL segment. Middleware attached to the route executes during request dispatch, not URL generation.',
    validation: 'routeAbsolute',
  },
  {
    ids: ['LQ-454', 'LQ-455', 'LQ-456'], family: 'laravel-dirty-state',
    assumptions: 'The existing user was freshly retrieved with name="Ada" and no previous changes. There are no custom name casts/mutators or observers that change name. The save succeeds. Any timestamp changes are separate from name.',
    explanation: 'Assigning Grace changes the original Ada value, so isDirty(name) is true before save. A successful save records that name change, so wasChanged(name) is true, then synchronizes the original attributes and leaves isDirty(name) false.',
    validation: 'different attribute value is dirty',
  },
  {
    ids: ['LQ-313','LQ-315','LQ-316'], family: 'laravel-validation-data',
    assumptions: 'The FormRequest receives string name and budget inputs; authorization is handled separately. Normalize the name before constructing the ordinary validator. If project-name uniqueness is a domain requirement, enforce the corresponding database constraint.',
    explanation: 'prepareForValidation merges the normalized name before the validator captures the request data, so validated() and safe() expose the normalized accepted fields. Authorization and database uniqueness are separate responsibilities.',
    validation: 'prepareForValidation',
  },
];

export const LARAVEL_COMPANION_REVISIONS = families.flatMap(family => family.ids.map((id,index) => {
  const original = LEGACY_QUESTIONS.find(question => question.id === id);
  const validationFamily = family.family === 'laravel-validation-data';
  const options = original.coreOptions.map(option => family.before ? option.replace(family.before,family.after) : option);
  const misconception = index === 2;
  return {
    id, revision: 2, changeKind: 'correctness', status: 'review', family: family.family,
    prompt: original.prompt, options, answer: original.answer,
    explanation: validationFamily ? `${original.explanation} ${family.explanation}` : `${family.explanation}${misconception ? ' The keyed choice is the misconception requested by the stem, not a true description.' : ''}`,
    assumptions: family.assumptions,
    versions: {php:'8.4–8.5',laravel:'13.0.0',label:'Laravel 13.0.0 reference · PHP 8.4–8.5.'},
    code: {language:'php',title:validationFamily?'Project FormRequest':original.code.title,files:[{name:validationFamily?'StoreProjectRequest.php':family.family==='laravel-route-generation'?'routes/web.php':'controller.php',kind:'laravel-fragment',snippet:validationFamily?original.code.snippet.replace('passedValidation()', 'prepareForValidation()'):original.code.snippet}]},
    validation: {kind:'laravel-contract',case:family.validation},
    learning: {
      trace: family.explanation,
      rationales: validationFamily ? ({
        'LQ-313': [
          'Both APIs expose only the accepted fields, with name now normalized before validation.',
          'all() can include fields outside the rules; normalizing name does not validate those extra fields.',
          'The raw superglobal bypasses the FormRequest accepted-data boundary.',
          'HTTP headers are not the validated project fields required by create().',
        ],
        'LQ-315': [
          'Permission to create a project for an account is an actor-and-resource authorization decision.',
          'Decimal precision is an input rule; it does not establish the actor’s permission.',
          'Name length is an input constraint independent of account permission.',
          'Field presence is validated by required, not an authorization decision.',
        ],
        'LQ-316': [
          'Concurrent requests can both observe no conflicting name before either write commits.',
          'Validation rules can query a database; their separate checks still do not serialize competing writes.',
          'The constraint enforces persistent uniqueness, rather than merely formatting errors.',
          'max validates an input limit and does not create database schema.',
        ],
      })[id] : misconception ? [
        `This is the false interpretation requested by the question. ${family.explanation}`,
        `This is the behavior under the supplied premises, not a misconception. ${family.explanation}`,
        'Respecting the API contract is a valid principle, not the dangerous interpretation requested.',
        'Checking the observable result is a valid review practice, not the dangerous interpretation requested.',
      ] : index === 0 ? [
        family.explanation,
        `This reason for removing the mechanism is false. ${family.explanation}`,
        'A comment cannot perform URL generation or persist and synchronize model attributes.',
        'Suppressing failures does not preserve the demonstrated result and conceals a failed operation.',
      ] : [
        family.explanation,
        'The title text cannot verify the generated value or model state.',
        'Syntax validity alone does not observe the runtime behavior.',
        'An unrelated snapshot does not exercise this route or model.',
      ],
    },
    references:[validationFamily?'https://laravel.com/docs/13.x/validation#preparing-input-for-validation':family.family==='laravel-route-generation'?'https://laravel.com/docs/13.x/urls#urls-for-named-routes':'https://laravel.com/docs/13.x/eloquent#examining-attribute-changes'],
  };
}));
