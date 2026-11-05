import hljs from './vendor/highlightjs/core.min.mjs';
import php from './vendor/highlightjs/php.min.mjs';

hljs.registerLanguage('php', php);

const entities = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'" };
const decode = text => text.replace(/&(?:amp|lt|gt|quot|#x27);/g, entity => entities[entity]);

// Consume only the public highlighter's escaped text/span output. No HTML is
// inserted into the page, including when source contains HTML or script tags.
function readTokens(html) {
  const tokens = [], scopes = [];
  const pattern = /<span class="([a-zA-Z0-9_ -]+)">|(<\/span>)|([^<]+)/gy;
  let offset = 0, match;
  while ((match = pattern.exec(html))) {
    if (match[1]) scopes.push(match[1]);
    else if (match[2]) {
      if (!scopes.length) throw new Error('Unbalanced highlight output');
      scopes.pop();
    } else tokens.push({ text: decode(match[3]), classes: scopes.join(' ') });
    offset = pattern.lastIndex;
  }
  if (offset !== html.length || scopes.length) throw new Error('Unexpected highlight output');
  return tokens;
}

export function highlightSource(source, language) {
  // Other languages keep an exact plain-text view; additional grammars can be
  // registered deliberately later, without guessing a snippet's language.
  if (String(language).toLowerCase() !== 'php') return [{ text: source, classes: '' }];
  try {
    const tokens = readTokens(hljs.highlight(source, { language: 'php', ignoreIllegals: true }).value);
    if (tokens.map(token => token.text).join('') !== source) throw new Error('Source changed');
    return tokens;
  } catch {
    // A grammar failure must never hide, alter, or prevent reading a question.
    return [{ text: source, classes: '' }];
  }
}
