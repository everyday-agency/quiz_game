import { highlightSource } from './code-highlighting.mjs';

const defaultNames = { php: 'main.php', typescript: 'snippet.ts', tsx: 'snippet.tsx', javascript: 'snippet.js', json: 'snippet.json', sql: 'query.sql', mysql: 'query.sql' };

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createCodeText(source, language) {
  const code = element('code', 'code-text');
  for (const token of highlightSource(source, language)) {
    code.append(token.classes ? element('span', token.classes, token.text) : document.createTextNode(token.text));
  }
  return code;
}

// A source-only choice stays inside its answer button, without nested buttons.
export function createCodeChoice(source, language = 'php') {
  const choice = element('span', 'code-choice');
  choice.append(createCodeText(source, language));
  return choice;
}

export function createCodeLesson(lesson, labelText, { reading = false, lineNumbers = !reading } = {}) {
  const section = element('section', reading ? 'code-lesson code-reading' : 'code-lesson');
  section.setAttribute('aria-label', labelText);
  if (lesson.title && (!reading || lesson.title !== 'Code to inspect')) section.append(element('div', 'code-lesson-title', lesson.title));
  if (lesson.context) section.append(element('p', 'code-context', lesson.context));

  const language = String(lesson.language || 'text');
  for (const file of lesson.files || [{ snippet: lesson.snippet }]) {
    const source = file.snippet || '';
    const name = file.name || defaultNames[language.toLowerCase()] || 'snippet.txt';
    const panel = element('div', 'code-file');
    const header = element('div', 'code-file-header');
    const filename = element('span', 'code-filename', name);
    filename.title = name;
    const badge = element('span', 'code-language', language);
    const copy = element('button', 'code-copy', 'Copy');
    copy.type = 'button';
    copy.setAttribute('aria-label', `Copy ${name} code`);
    const status = element('span', 'code-copy-status');
    status.setAttribute('role', 'status');
    let reset;
    // Enter/Space on Copy must not also trigger the quiz's keyboard shortcuts.
    copy.addEventListener('keydown', event => event.stopPropagation());
    copy.addEventListener('click', async () => {
      clearTimeout(reset);
      try {
        await navigator.clipboard.writeText(source);
        copy.textContent = 'Copied';
        status.textContent = `${name} copied to clipboard.`;
      } catch {
        copy.textContent = 'Retry';
        status.textContent = 'Clipboard unavailable. Select the code to copy it manually.';
      }
      reset = setTimeout(() => { copy.textContent = 'Copy'; status.textContent = ''; }, 2500);
    });
    header.append(filename, badge, copy, status);
    panel.append(header);
    if (file.kind === 'php-fragment' || file.context) {
      const context = [file.kind === 'php-fragment' ? 'PHP contextual fragment' : '', file.context].filter(Boolean).join(' · ');
      panel.append(element('p', 'code-file-context', context));
    }

    const scroll = element('div', 'code-scroll');
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', `${name} source code; scroll to see more`);
    const lines = element('div', 'code-lines');
    const gutter = element('div', 'code-gutter', Array.from({ length: source.split(/\r\n|\r|\n/).length }, (_, i) => i + 1).join('\n'));
    gutter.setAttribute('aria-hidden', 'true');
    gutter.hidden = !lineNumbers;
    const pre = element('pre', 'code-source');
    pre.append(createCodeText(source, language));
    lines.append(gutter, pre);
    scroll.append(lines);
    panel.append(scroll);
    section.append(panel);
  }
  return section;
}
