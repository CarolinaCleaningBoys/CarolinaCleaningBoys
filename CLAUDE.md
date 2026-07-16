# CLAUDE.md — Carolina Cleaning Boys Website

Static HTML/CSS marketing site for Carolina Cleaning Boys, a pressure washing business in Greenville, NC. No build system — files are deployed directly (hosted on Cloudflare).

## File Structure

```
/                          ← root
├── index.html             ← homepage
├── style.css              ← shared stylesheet for all pages
├── favicon.ico
├── privacy-policy.html
├── terms-and-conditions.html
├── services/
│   ├── pressure-washing.html
│   ├── soft-washing.html
│   ├── surface-cleaning.html
│   ├── roof-cleaning.html
│   └── gutter-cleaning.html
├── locations/
│   └── [city]/            ← e.g. greenville/, ayden/, raleigh/
│       ├── pressure-washing.html
│       ├── soft-washing.html
│       ├── surface-cleaning.html
│       ├── roof-cleaning.html
│       └── gutter-cleaning.html
├── lp/                     ← standalone paid-traffic landing pages (Claude Design exports turned production)
│   ├── pressure-washing/index.html   ← served at carolinacleaningboys.com/lp/pressure-washing
│   ├── soft-washing/index.html
│   ├── surface-cleaning/index.html
│   ├── roof-washing/index.html
│   ├── gutter-cleaning/index.html
│   └── brand-awareness/index.html
└── images/                ← logos (.png) and photos (.webp)
```

## Design System

**Fonts (Google Fonts):**
- `Bevan` — display headings
- `Libre Baskerville` — body / subheadings

**Colors (informal palette):**
- Background: `#f5f0e8` (warm tan)
- Dark navy: `#1a2b3c` (headers, hero sections)
- Orange accent: `#e8823a` (CTAs, highlights, borders)
- Text: `#444` / `#555`

**Key CSS classes in style.css:**
- `.container` — max-width centered wrapper
- `.header` / `.nav` — sticky top nav bar
- `.sidebar` / `.sidebar-overlay` — hamburger slide-out nav
- `.hero` — homepage hero (full-bleed background image)
- `.service-hero` — service page hero (gradient + animated text)
- `.footer` / `.footer-content` / `.footer-bottom` — footer layout
- `.btn .btn-primary` / `.btn-secondary` — CTA buttons
- `.nav-cta .nav-cta-upgraded` — orange FREE Quote button in nav
- `.floating-cta` — fixed bottom-right quote button (service pages)
- `.animate-on-scroll` — fade-in on scroll (IntersectionObserver)

## Standard Page Head

Every page includes:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17822819353"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-17822819353');</script>
<link rel="icon" type="image/x-icon" href="../favicon.ico">   <!-- or "favicon.ico" from root -->
<link rel="stylesheet" href="../style.css">                    <!-- or "style.css" from root -->
<link href="https://fonts.googleapis.com/css2?family=Bevan&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

## Standard Nav (root-level paths shown; use `../` prefix for pages in subdirectories)

```html
<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
<nav class="sidebar" id="sidebar">
    <button class="sidebar-close" onclick="closeSidebar()">&times;</button>
    <div class="sidebar-content">
        <a href="index.html" class="sidebar-link">🏠 Home</a>
        <div class="sidebar-divider"></div>
        <span class="sidebar-label">Our Services</span>
        <a href="services/pressure-washing.html" class="sidebar-link">💧 Pressure Washing</a>
        <a href="services/soft-washing.html" class="sidebar-link">🧼 Soft-Washing</a>
        <a href="services/surface-cleaning.html" class="sidebar-link">🧱 Surface Cleaning</a>
        <a href="services/roof-cleaning.html" class="sidebar-link">🔝 Roof Cleaning</a>
        <a href="services/gutter-cleaning.html" class="sidebar-link">🍂 Gutter Cleaning</a>
        <div class="sidebar-divider"></div>
        <a href="index.html#estimate-form" class="sidebar-link sidebar-cta" onclick="closeSidebar()">📋 Get a FREE Quote</a>
        <a href="tel:919-717-4653" class="sidebar-link">📞 919-717-4653</a>
    </div>
</nav>
<header class="header">
    <nav class="nav container">
        <button class="hamburger" onclick="toggleSidebar()">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
        <a href="index.html" class="logo">
            <img src="images/logo-256.png" alt="Carolina Cleaning Boys Logo" class="logo-img" style="width:120px;height:auto;">
        </a>
        <div class="nav-contact">
            <a href="mailto:carolinacleaningboys@gmail.com" class="nav-email">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2"/></svg>
            </a>
            <a href="index.html#estimate-form" class="nav-cta nav-cta-upgraded">
                <span class="cta-icon">✨</span>
                <span class="cta-text">FREE Quote<span class="cta-subtext"> - 24hr Response!</span></span>
            </a>
        </div>
    </nav>
</header>
```

**Required sidebar JS** (include at bottom of every page):
```html
<script>
    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('sidebarOverlay').classList.toggle('active');
        document.body.style.overflow = document.getElementById('sidebar').classList.contains('active') ? 'hidden' : '';
    }
    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebarOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }
</script>
```

## Standard Footer

Service pages (`services/`) use relative `../` paths. Root pages use direct paths.

```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-brand">
                <a href="../index.html" class="footer-logo">
                    <img src="../images/logo-256-white.png" alt="Carolina Cleaning Boys Logo" class="footer-logo-img" style="height:100px!important;width:100px!important;max-width:none!important;object-fit:contain!important;display:block!important;">
                </a>
                <p class="footer-desc">Professional pressure washing, soft-washing, and exterior cleaning services. Proudly student-owned and operated by ECU students. "Turning Dirt into Degrees"</p>
                <div class="footer-social">
                    <a href="https://www.facebook.com/profile.php?id=61558735994193" target="_blank" rel="noopener noreferrer"><!-- FB SVG --></a>
                </div>
            </div>
            <div class="footer-contact">
                <h3>Contact Us</h3>
                <address>
                    <p>📍 Greenville, North Carolina</p>
                    <p><a href="tel:919-717-4653" class="footer-link">📞 919-717-4653</a></p>
                    <p><a href="mailto:carolinacleaningboys@gmail.com" class="footer-link">✉️ carolinacleaningboys@gmail.com</a></p>
                </address>
            </div>
            <div class="footer-services">
                <h3>Services</h3>
                <ul>
                    <li><a href="pressure-washing.html" class="footer-link">Pressure Washing</a></li>
                    <li><a href="soft-washing.html" class="footer-link">Soft-Washing</a></li>
                    <li><a href="surface-cleaning.html" class="footer-link">Surface Cleaning</a></li>
                    <li><a href="roof-cleaning.html" class="footer-link">Roof Cleaning</a></li>
                    <li><a href="gutter-cleaning.html" class="footer-link">Gutter Cleaning</a></li>
                </ul>
            </div>
        </div>
        </div>
        <div class="footer-partners">
            <span class="footer-partners-label">Partners</span>
            <a href="https://campuscribsrentals.com" target="_blank" rel="noopener noreferrer" class="footer-partner-badge">
                <img src="../images/campus-cribs-logo.png" alt="Campus Cribs Rentals" class="footer-partner-logo" style="height:30px;width:auto;max-height:30px;object-fit:contain;display:block;">
                <span class="footer-partner-name">Campus Cribs Rentals</span>
            </a>
            <a href="https://www.justiceleadership.com/" target="_blank" rel="noopener noreferrer" class="footer-partner-badge">
                <img src="../images/justice-leadership-logo.png" alt="Justice Leadership" class="footer-partner-logo" style="height:30px;width:auto;max-height:30px;object-fit:contain;display:block;">
                <span class="footer-partner-name">Justice Leadership</span>
            </a>
            <a href="https://radiateprints.com/" target="_blank" rel="noopener noreferrer" class="footer-partner-badge">
                <img src="../images/radiate-prints-logo.png" alt="Radiate Prints &amp; Promo" class="footer-partner-logo" style="height:30px;width:auto;max-height:30px;object-fit:contain;display:block;background:#fff;padding:3px;border-radius:4px;">
                <span class="footer-partner-name">Radiate Prints &amp; Promo</span>
            </a>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Carolina Cleaning Boys. All rights reserved.</p>
            <p><a href="../privacy-policy.html" class="footer-link">Privacy Policy</a> &nbsp;|&nbsp; <a href="../terms-and-conditions.html" class="footer-link">Terms &amp; Conditions</a></p>
        </div>
    </div>
</footer>
```

**Note:** Root pages (`index.html`, `privacy-policy.html`, `terms-and-conditions.html`) use `images/` (no `../`). Service pages use `../images/`. Location pages use `../../images/`.

## Business Info

- **Phone:** 919-717-4653
- **Email:** carolinacleaningboys@gmail.com
- **Location:** Greenville, NC (Pitt County, Eastern NC)
- **Facebook:** https://www.facebook.com/profile.php?id=61558735994193
- **Google Ads ID:** AW-17822819353
- **Google Maps API Key:** AIzaSyBMgQPLJlz8BrHJ7T6WJuJf54KU2JcwqN8

## Known Patterns & Gotchas

**The lead form silently breaks when its JavaScript won't parse (CRITICAL — the #1 recurring cause of lost leads):**

The `<script>` block holding `submitForm` posts leads directly to the CRM (`https://pressure-wash-crm.vercel.app/api/leads/web`, normal CORS `fetch()`, real success/error JSON is read — see `ccbSendLead`/`ccbShowSuccess`/`ccbShowError`), and fires the Meta Pixel + Google Ads conversions **only after a confirmed success**. If that script has *any* syntax error, the whole block fails to load, `submitForm` never exists, and the Submit button silently does nothing: **no lead reaches the CRM, no Gmail, no conversions — all at once, with no visible error.** This has broken real lead capture at least three times (2026-06-05, 2026-07-08, and 14 location pages + soft-washing found 2026-07-12), plus a separate file-truncation incident on 2026-07-12 that left `index.html` missing its closing `</script></body></html>` in production for over a month (fixed 2026-07-16 alongside the Apps-Script-to-CRM switch).

**As of 2026-07-16, `index.html` (the homepage form) was switched off the old Google Apps Script / Sheet flow onto this direct CRM POST** (Phase 1 of a planned site-wide switch — other pages may still reference the old flow until migrated). Its payload shape is NOT identical to the `lp/` pages documented below: it sends `street_address` (not `address`), `services` as a comma-joined string (not `service_type`), a nested `attribution` object (not flat UTM/click-ID fields), and no `zip`/`message` fields (uses `additional_info` instead). The CRM's `/api/leads/web` route must accept both shapes — confirm this on the CRM side (`CRM/src/app/api/leads/web/route.ts`) before/after this kind of migration, since a schema mismatch there would now surface as an honest "Something went wrong" error to real customers instead of a silent Apps Script failure.

Two failure modes seen so far:
1. **Smart/curly quotes** (`‘ ’ “ ”`) replacing straight quotes (`'` `"`) as string delimiters — happens automatically when code is pasted through Word, Google Docs, a chat window, or some AI tools. Curly quotes are invalid JS delimiters. (Curly quotes *inside* a string, e.g. `'We'll be in touch'`, are harmless — only delimiters break it.)
2. **Leftover dead code** from a bad find/replace during a form rewrite (e.g. an orphaned `function () {` fragment after the real `submitForm`).

**Guardrails (already installed — keep them):**
- `scripts/check-form-scripts.js` — extracts every inline `<script>` and verifies it parses. Run manually: `node scripts/check-form-scripts.js`.
- `.githooks/pre-commit` — runs the checker on staged HTML and blocks the commit if anything is broken. **Activate once per clone:** `git config core.hooksPath .githooks`.
- `.github/workflows/check-forms.yml` — runs the checker on every push/PR, so a broken form is caught before Cloudflare deploys it.

After ANY edit to a form or its script, run `node scripts/check-form-scripts.js` and confirm it prints `OK`.

**Service page `<style>` bug (already fixed in surface-cleaning, roof-cleaning, gutter-cleaning):**
These pages had the `</style>` tag closing the style block after the SEO fix CSS, leaving the FAQ accordion CSS rendered as raw text on the page. The fix is to keep the `</style>` after the FAQ CSS, not before it.

**Cloudflare email obfuscation:**
Email addresses in deployed HTML are replaced with Cloudflare-obfuscated spans. Write plain `mailto:` links in source — Cloudflare handles obfuscation on the CDN side.

**Logo files:**
- `images/logo-256.png` — colored logo on transparent bg, used in **nav** (120px wide)
- `images/logo-256-white.png` — white logo on transparent bg, used in **footer** (100px, needs `!important` overrides)
- `images/logo-512.png` — colored, used for PWA/site manifest icons
- `images/logo-1200.png` — colored, used for OG/social meta images (1200×629)
- `images/logo-1236.png` — high-res colored version (1236×1077)
- `images/campus-cribs-logo.png` — Campus Cribs Rentals partner logo (footer)
- `images/justice-leadership-logo.png` — Justice Leadership partner logo, white on transparent (footer)
- `images/radiate-prints-logo.png` — Radiate Prints & Promo partner logo (footer; full-color with black text, needs white background chip on dark footer)

**Path conventions:**
- Pages in `services/` reference root assets with `../` (e.g., `../style.css`, `../images/logo-256.png`)
- Pages in `locations/[city]/` use `../../` for root assets
- Root pages (`index.html`, `privacy-policy.html`, etc.) use no prefix

**Location pages:**
There are ~20+ cities each with 5 service variants = 100+ location pages. They follow the same template as service pages. Cities include: Greenville, Ayden, Bethel, Bailey, Black Creek, Clayton, Farmville, Fountain, Garner, Grimesland, Hookerton, Kenley, Knightdale, Lucama, Middlesex, Raleigh, Rolesville, Saratoga, Selma, Zebulon, and others.

**FAQ accordion JS** (used in service pages):
```js
function toggleFaq(btn) {
    btn.parentElement.classList.toggle('active');
}
```

## Landing Pages (`lp/`)

Standalone, self-contained pages for paid traffic (Google/Meta ads) — not part of the standard site nav/footer template. Built from Claude Design HTML exports (`Landing Pages/_extracted/`), kept as their own premium visual style rather than flattened into the old site template.

**URL structure:** each page lives at `lp/<name>/index.html` (2 levels deep), so GitHub Pages serves it at the clean, extension-less URL `carolinacleaningboys.com/lp/<name>` — no `.html` in the address bar. Because these files are 2 levels deep (not 1, like the old `landing/<name>.html`), every root-relative asset reference uses `../../` (e.g. `../../style.css`, `../../images/...`, `../../index.html`, `../../privacy-policy.html`), not `../`. The `<link rel="canonical">` and `og:url` tags point to the clean URL (`https://carolinacleaningboys.com/lp/<name>`, no `.html`), matching what's actually in the address bar.

Each page:

- Inlines its own `<style>` block (own color tokens matching the exported design, e.g. `pressure-washing` uses `#3F647F` / `#6FAFD8` / `#2E4F66` / `#F4EFE9` / `#FF6B35`→`#F7C531`) — does not link `style.css`.
- Still uses real brand assets: Bevan + Libre Baskerville fonts, real logo files from `images/`, and real job photos from `images/work/<category>/` (not the export's placeholder `<image-slot>` blocks).
- Real before/after pairs exist in `images/work/`: alt text says "Before ... " / "After ...", e.g. `pressure-washing/pressure-washing-16.webp` + `-17.webp`, `driveway-concrete/driveway-concrete-06.webp` + `-07.webp`. Check alt text sitewide before picking a pair — most `work/` images are single shots, not matched pairs.
- Reviews are pulled verbatim (text + first name + last initial) from `index.html`'s `.reviews-carousel` block — never invent review copy.
- Form field `name`s match the CRM's `/api/leads/web` zod schema exactly: `first_name, last_name, email, phone, address, city, state, zip, service_type, message, sms_consent, company_website` (honeypot), plus hidden `utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, gbraid, wbraid`.
- Submits with a normal (not `no-cors`) `fetch()` POST so the real success/error JSON can be read and shown to the user. **This requires the CRM's `/api/leads/web` route to send CORS headers** (`Access-Control-Allow-Origin` for `carolinacleaningboys.com`, plus an `OPTIONS` handler) since the static site and the CRM are different origins — see `CRM/src/app/api/leads/web/route.ts`.
- On success, fires the same Meta Pixel `Lead` (SHA-256-hashed email/phone eventID) + Google Ads conversion (`AW-17822819353/JIJRCJvpxuwbEJnIyrJC`) that `index.html` fires.
- Attribution capture IIFE fills hidden UTM/click-ID inputs directly from the URL query string (falls back to the `_gcl_aw` cookie for `gclid`, then to the `ccb_attribution` localStorage bundle other pages already write) — a different, simpler contract than `index.html`'s `ccbGetAttribution()` object, chosen because the CRM endpoint expects flat top-level fields, not a nested `attribution` object.
- Always run `node scripts/check-form-scripts.js` after editing — same silent-form-death risk as every other page (see above).
