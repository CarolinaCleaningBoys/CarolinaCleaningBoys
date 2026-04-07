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
