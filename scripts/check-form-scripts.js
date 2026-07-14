#!/usr/bin/env node
/*
 * check-form-scripts.js
 * ---------------------------------------------------------------------------
 * Guards the lead forms against the two ways they have silently broken before.
 * Run by the git pre-commit hook (.githooks/pre-commit) and safe to run by hand:
 *
 *     node scripts/check-form-scripts.js               # scan all tracked .html
 *     node scripts/check-form-scripts.js a.html b.html # scan only these files
 *
 * It fails (exit 1) if either problem is present:
 *
 *   1) An inline <script> does not PARSE as JavaScript. This is how curly /
 *      "smart" quotes ( ' ' " " ) break the form: when code is pasted through
 *      Word, Google Docs, a chat window, or some AI tools, straight quote
 *      delimiters get swapped for curly ones and the whole <script> block
 *      fails to parse -- the Submit button then silently does nothing, no lead
 *      reaches the Google Sheet / CRM / Gmail, and Meta + Google Ads
 *      conversions stop firing. (Broke the form on 2026-06-05 and 2026-07-08.)
 *      A curly apostrophe INSIDE a string (e.g. 'We'll be in touch') is fine
 *      and correctly ignored -- we test real parseability, not raw characters.
 *
 *   2) A file contains NUL bytes. HTML is text and never legitimately contains
 *      NUL (0x00). Their presence means the file was corrupted -- e.g. a
 *      OneDrive sync/write race appending a block of NUL padding (which
 *      happened on 2026-07-12 to 15 files and made git treat them as binary).
 *
 * NOTE: this repo currently lives inside a OneDrive-synced folder, which is
 * the root cause of the NUL corruption. Moving the working copy outside
 * OneDrive is the real fix; this check is the safety net until then.
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
    return []; // not a git tree / git unavailable
  }
}

// Returns array of { line, code } for each inline <script> that has a body.
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
    out.push({ line, code });
  }
  return out;
}

let problems = 0;
const files = filesToScan();

for (const file of files) {
  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch (e) {
    continue;
  }

  // (2) NUL-byte corruption check.
  if (buf.indexOf(0) !== -1) {
    if (problems === 0) console.error('ERROR: lead-form / HTML integrity check failed.\n');
    console.error(`  ${file}: contains NUL bytes (file is corrupted -- likely a OneDrive sync race).`);
    console.error('    Fix: restore the file or strip the NUL padding before committing.\n');
    problems++;
    continue; // don't try to parse a corrupted file
  }

  // (1) Inline-script parse check.
  const html = buf.toString('utf8');
  for (const s of extractScripts(html)) {
    try {
      new vm.Script(s.code, { filename: file }); // parses without executing
    } catch (err) {
      if (problems === 0) console.error('ERROR: lead-form / HTML integrity check failed.\n');
      console.error(`  ${file}: <script> at line ${s.line} does not parse -- ${err.message}`);
      console.error('    This is how curly/"smart" quotes silently break the form. Use straight quotes.\n');
      problems++;
    }
  }
}

if (problems > 0) {
  console.error(`Found ${problems} problem(s). Commit blocked.`);
  process.exit(1);
}

console.log(`OK: ${files.length} HTML file(s) clean -- all inline scripts parse, no NUL bytes.`);
process.exit(0);
