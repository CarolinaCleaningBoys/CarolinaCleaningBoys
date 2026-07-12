#!/usr/bin/env node
/*
 * check-form-scripts.js
 * ---------------------------------------------------------------------------
 * Verifies that every inline <script> in the site's HTML actually PARSES as
 * valid JavaScript. Run by the git pre-commit hook and by GitHub Actions.
 *
 * WHY THIS EXISTS
 *   The lead form's JavaScript (submitForm / ccbSendLead / ccbFireTracking in
 *   index.html) uses ordinary straight quotes ( ' and " ) as string
 *   delimiters. If those get replaced by curly / "smart" quotes ( ' ' " " ) --
 *   which happens automatically when code is pasted through Word, Google Docs,
 *   a chat window, or some AI tools -- the whole <script> block fails to parse.
 *   When that happens the Submit button silently does nothing: no leads reach
 *   the Google Sheet / CRM / Gmail, and Meta + Google Ads conversions stop
 *   firing. This has already broken the form TWICE (2026-06-05 and 2026-07-08),
 *   each time costing days of leads before anyone noticed.
 *
 *   A plain "ban all curly quotes" check gives false positives, because curly
 *   apostrophes are legitimate INSIDE strings (e.g. 'We'll be in touch'). So
 *   instead we test the real failure condition directly: we extract each inline
 *   script and try to compile it. A curly apostrophe inside a string compiles
 *   fine; a curly quote used as a delimiter does not -- which is exactly the
 *   bug we want to catch.
 *
 * USAGE
 *   node scripts/check-form-scripts.js               # scan all tracked .html
 *   node scripts/check-form-scripts.js a.html b.html # scan only these files
 *
 * Exit 0 = all inline scripts parse. Exit 1 = a script is broken (details
 * printed, with file and line number).
 * ---------------------------------------------------------------------------
 */
'use strict';

const fs = require('fs');
const vm = require('vm');
const cp = require('child_process');

// Script types that are real JavaScript. Anything else (notably
// application/ld+json schema.org blocks) is skipped.
const JS_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module']);

function filesToScan() {
  if (process.argv.length > 2) return process.argv.slice(2).filter((f) => f.endsWith('.html'));
  try {
    return cp
      .execSync('git ls-files "*.html"', { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
  } catch (e) {
    return []; // not a git tree / git unavailable; nothing to do
  }
}

// Returns array of { line, type, code } for each inline <script> with a body.
function extractScripts(html) {
  const out = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] || '';
    const code = m[2] || '';
    if (/\bsrc\s*=/.test(attrs)) continue; // external script, no inline body
    const typeMatch = attrs.match(/\btype\s*=\s*["']?([^"'\s>]*)/i);
    const type = (typeMatch ? typeMatch[1] : '').toLowerCase();
    if (!JS_TYPES.has(type)) continue; // e.g. application/ld+json
    if (!code.trim()) continue;
    const line = html.slice(0, m.index).split('\n').length;
    out.push({ line, type, code });
  }
  return out;
}

let broken = 0;
const files = filesToScan();

for (const file of files) {
  let html;
  try {
    html = fs.readFileSync(file, 'utf8');
  } catch (e) {
    continue;
  }
  for (const s of extractScripts(html)) {
    try {
      // Compiles (parses) without executing. Throws SyntaxError on bad code.
      new vm.Script(s.code, { filename: file });
    } catch (err) {
      if (broken === 0) {
        console.error('ERROR: an inline <script> does not parse as JavaScript.');
        console.error('This is exactly how curly/"smart" quotes silently break the lead form.');
        console.error('Fix the syntax (straight quotes only for delimiters) before committing.\n');
      }
      console.error(`  ${file}: <script> starting at line ${s.line}`);
      console.error(`    ${err.message}`);
      // Show the offending snippet if we can pinpoint it.
      const lc = err.stack && err.stack.match(/:(\d+)\)?\s*$/m);
      console.error('');
      broken++;
    }
  }
}

if (broken > 0) {
  console.error(`Found ${broken} broken inline script(s). Commit blocked.`);
  process.exit(1);
}

console.log(`OK: all inline scripts parse (${files.length} HTML file(s) checked).`);
process.exit(0);
