# Carolina Cleaning Boys website

Static HTML/CSS site for https://carolinacleaningboys.com, hosted on GitHub Pages behind Cloudflare. No build step: edit the HTML and push to `main`.

Project notes for Claude Code sessions live in `CLAUDE.md`.

## Sitemap

Run `node scripts/build-sitemap.js` after changing pages. It rebuilds `sitemap.xml` from the pages on disk, skips noindex pages and redirect stubs, and sets each page's lastmod from its last git commit.

## Review count

`scripts/update-review-count.js` (needs the `SUPABASE_REVIEW_KEY` repo secret = the Supabase anon key, never service_role) updates the Google review count across the site (every `<span data-review-count>`, JSON-LD `reviewCount`, and `llms.txt`). The GitHub Action `.github/workflows/update-review-count.yml` runs it every morning.

## Form safety check

Run `node scripts/check-form-scripts.js` after editing any quote form. A script error silently stops leads from reaching the CRM.
