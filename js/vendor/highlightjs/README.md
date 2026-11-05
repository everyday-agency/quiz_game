# Vendored PHP highlighter

Highlight.js **11.12.0**, BSD-3-Clause, copied without source changes from the [official release assets](https://github.com/highlightjs/cdn-release/tree/11.12.0/build). The browser ES modules are renamed from `.js` to `.mjs` for native Node/browser imports. Only core and PHP are included: 27,086 bytes before compression. There are no transitive dependencies or runtime CDN requests.

`provenance.json` records original URLs and SHA-256 hashes. `LICENSE` is included in the static site. The [upstream README](https://github.com/highlightjs/highlight.js/blob/11.12.0/README.md) documents self-hosted ES modules with separately registered languages.

To update, review the upstream release, replace these two assets and license, update provenance, then run `node tests.mjs` and all three Chrome suites. In particular, test `code-highlighting.mjs` against changed span output; it uses the public `highlight()` API and safely falls back to plain text if the output is unexpected. Do not add language auto-detection or an all-language bundle.
