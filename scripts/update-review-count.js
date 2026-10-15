#!/usr/bin/env node
/*
 * Update the Google review count across the site from the CRM's daily snapshot.
 *
 *   SUPABASE_REVIEW_KEY=<anon key> node scripts/update-review-count.js
 *
 * Updates: every <span data-review-count>N</span>, every element with
 * data-count="N" ... data-review-count, every JSON-LD "reviewCount": "N",
 * "N five-star/Five-Star/verified Google" text inside meta tags, and llms.txt.
 *
 * KEY: use the Supabase anon (public) key, NOT service_role. This repo is
 * public. CRM migration 163 lets anon read google_review_snapshots only.
 *
 * Safety: exits without changing anything if the request fails, the number
 * isn't a whole number, it's LOWER than the number on the site, or it jumped
 * by more than 25. Node 20+, no dependencies.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = 'https://jnfcvqfenmjuuqjgkntm.supabase.co/rest/v1/google_review_snapshots?select=review_count,snapshot_date&order=snapshot_date.desc&limit=1';
const MAX_JUMP = 25;
const SKIP_DIRS = new Set(['.git', 'node_modules', 'Landing Pages', 'vendor', 'images', 'data', '.claude']);

function files(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) files(p, out); }
    else if (e.name.endsWith('.html') || p === path.join(ROOT, 'llms.txt')) out.push(p);
  }
  return out;
}

function currentCount(all) {
  const seen = new Map();
  for (const f of all) {
    const s = fs.readFileSync(f, 'utf8');
    for (const m of s.matchAll(/<span data-review-count>(\d+)<\/span>/g)) seen.set(+m[1], (seen.get(+m[1]) || 0) + 1);
  }
  if (!seen.size) return null;
  return [...seen.entries()].sort((a, b) => b[1] - a[1])[0][0]; // most common value
}

async function main() {
  const key = process.env.SUPABASE_REVIEW_KEY;
  if (!key) { console.log('SUPABASE_REVIEW_KEY not set; nothing changed.'); return; }

  let row;
  try {
    const res = await fetch(URL, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!res.ok) { console.log(`Request failed (HTTP ${res.status}); nothing changed.`); return; }
    row = (await res.json())[0];
  } catch (e) {
    console.log('Request failed (' + e.message + '); nothing changed.');
    return;
  }
  const n = row && row.review_count;
  if (!Number.isInteger(n) || n <= 0) { console.log('No valid review count in the response; nothing changed.'); return; }

  const all = files(ROOT);
  const cur = currentCount(all);
  if (cur === null) { console.log('No <span data-review-count> found on the site; nothing changed.'); return; }
  console.log(`Snapshot ${row.snapshot_date}: ${n} reviews. Site currently shows ${cur}.`);
  if (n === cur) { console.log('Already up to date.'); return; }
  if (n < cur) { console.log(`New count ${n} is lower than ${cur}; refusing to lower it. Nothing changed.`); return; }
  if (n - cur > MAX_JUMP) { console.log(`Jump of ${n - cur} is more than ${MAX_JUMP}; looks wrong. Nothing changed.`); return; }

  let changedFiles = 0;
  for (const f of all) {
    const s = fs.readFileSync(f, 'utf8');
    let t = s
      .replace(/<span data-review-count>\d+<\/span>/g, `<span data-review-count>${n}</span>`)
      .replace(/data-count="\d+"(?=[^>]*data-review-count)/g, `data-count="${n}"`)
      .replace(/(data-review-count>)\d+(<\/div>)/g, `$1${n}$2`)
      .replace(/"reviewCount":\s*"\d+"/g, `"reviewCount": "${n}"`)
      .replace(new RegExp(`\\b${cur}(\\s+(?:five-star|Five-Star|verified Google))`, 'g'), `${n}$1`);
    if (t !== s) { fs.writeFileSync(f, t); changedFiles++; }
  }
  console.log(`Updated review count ${cur} -> ${n} in ${changedFiles} files.`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `count=${n}\n`);
}

main();
