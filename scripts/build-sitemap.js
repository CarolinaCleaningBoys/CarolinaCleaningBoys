#!/usr/bin/env node
/*
 * Rebuild sitemap.xml from the pages on disk.
 *
 *   node scripts/build-sitemap.js
 *
 * - Includes every .html page that is a real page (has <html>) and is not
 *   marked noindex. Redirect stubs are noindex, so they drop out on their own.
 * - Clean URLs: /index.html -> /, folder/index.html -> /folder/.
 * - lastmod = the date of the file's last git commit (today if uncommitted).
 * No dependencies.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://carolinacleaningboys.com';
const SKIP_DIRS = new Set(['.git', '.github', 'node_modules', 'Landing Pages', 'vendor', 'images', 'data', 'docs', 'scripts', '.claude']);

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name) && !e.name.startsWith('.')) walk(path.join(dir, e.name), out);
    } else if (e.name.endsWith('.html')) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

function lastmod(file) {
  try {
    const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (d) return d;
  } catch (e) { /* not a git checkout */ }
  return new Date().toISOString().slice(0, 10);
}

function priority(url) {
  if (url === '/') return '1.0';
  if (url.startsWith('/services/')) return '0.9';
  if (url.startsWith('/locations/')) return '0.8';
  if (url.startsWith('/lp/')) return '0.5';
  return '0.7';
}

const entries = [];
for (const file of walk(ROOT, [])) {
  const html = fs.readFileSync(file, 'utf8');
  if (!/<html[\s>]/i.test(html)) continue; // e.g. the Google verification file
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  if (robots && /noindex/i.test(robots[1])) continue;
  if (/http-equiv=["']refresh["']/i.test(html)) continue; // any stub missing noindex
  let rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (rel.startsWith('lp/')) continue; // paid-ad landing pages: near-duplicates of the service pages, kept out of the sitemap
  let url = '/' + rel;
  if (url === '/index.html') url = '/';
  else if (url.endsWith('/index.html')) url = url.slice(0, -'index.html'.length);
  entries.push({ url, lastmod: lastmod(rel) });
}

entries.sort((a, b) => (a.url === '/' ? -1 : b.url === '/' ? 1 : a.url.localeCompare(b.url)));

const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
  .concat(entries.map((e) => `    <url>\n        <loc>${SITE}${e.url}</loc>\n        <lastmod>${e.lastmod}</lastmod>\n        <priority>${priority(e.url)}</priority>\n    </url>`))
  .concat(['</urlset>', ''])
  .join('\n');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${entries.length} pages`);
entries.forEach((e) => console.log('  ' + e.url));
