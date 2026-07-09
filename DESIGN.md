# DESIGN.md — Carolina Cleaning Boys

Design-system reference for the Carolina Cleaning Boys marketing site (static HTML/CSS, no build system). Used as brand/design context for design tooling (e.g. Impeccable) and future work.

## Brand identity
- **Business:** Carolina Cleaning Boys — pressure washing & exterior cleaning in Greenville, NC and Eastern NC (Pitt County + surrounding).
- **Story:** Student-owned and operated by ECU students. Tagline: *"Turning Dirt into Degrees."*
- **Positioning:** Local, scrappy, trustworthy, professional-quality work at a fair price. Not a faceless franchise.
- **Audience:** Eastern NC homeowners (and some landlords/rentals near ECU) needing driveways, siding, roofs, gutters, and concrete cleaned.

## Voice & tone
- Concrete, human, specific. Reference real local geography (roads, neighborhoods, counties, NC climate) over generic marketing filler.
- Confident but down-to-earth; "student-owned crew" pride.
- Avoid AI-generic phrasing, hype, and filler. Favor plain, believable language (it also converts better).

## Typography (Google Fonts)
- **Display / headings:** `Bevan` (bold, condensed slab — used for H1/hero titles).
- **Body / subheadings:** `Libre Baskerville` (serif — body copy, subheads, buttons).
- Keep the two-font system; don't introduce new families.

## Color palette
| Role | CSS variable | Hex |
|---|---|---|
| Primary (headings, body text, anchors) | `--primary` | `#3F647F` |
| Primary light (accents, borders, badges) | `--primary-light` | `#6FAFD8` |
| Primary dark (footer bg, deep accents) | `--primary-dark` | `#2E4F66` |
| Background (warm off-white) | `--off-white` | `#F4EFE9` |
| CTA gradient start (orange) | — | `#FF6B35` |
| CTA gradient end (gold) | — | `#F7C531` |
| Placeholder text | — | `#4A6A80` |
- Orange-to-gold gradient is the action color (nav CTA, hero form submit, sidebar CTA). Blue-gray (`--primary`) anchors headings and body text. Off-white is the page canvas.
- Service-specific accent colors: `--accent-pressure: #E85D04`, `--accent-soft: #48CAE4`, `--accent-surface: #6C757D`, `--accent-roof: #1D3557`, `--accent-gutter: #BC6C25`.

## Layout & components
- **Container:** `.container` — max-width centered wrapper.
- **Nav:** sticky `.header`/`.nav`; hamburger `.sidebar` slide-out on the homepage.
- **Hero (location pages):** photo backdrop + dark navy→orange scrim (`.city-hero`), split layout (`.city-hero-inner`) — copy left, framed job photo right.
- **Homepage hero:** split layout (`.hero-split-layout`) — copy left (H1, tagline, trust badges, phone), compact inline quote form right. Stacks vertically on mobile.
- **Service hero:** gradient + animated text (`.service-hero`).
- **Before/After:** `.ba-pair` — two images side-by-side in one bound unit, BEFORE (left/dirty) + AFTER (right/clean) badges. Always side-by-side, never stacked.
- **Galleries:** `.work-grid` (responsive photo grid, no JS).
- **Buttons:** `.btn .btn-primary` (orange) / `.btn-secondary`; pill CTAs.
- **Cards:** rounded 12–16px corners, soft shadow (`0 4px 18px rgba(0,0,0,.08)`).
- **Reveal animation:** `.animate-on-scroll` scoped to `.js-loaded` (progressive enhancement — content visible without JS, animation layered on top). IntersectionObserver adds `.animated` class.

## Imagery
- **Use real job photos** (in `images/work/`), organized by service. Before/after pairs and "split" (half-dirty/half-clean) shots are the highest-trust assets.
- Prefer concrete/vinyl/brick on pressure-washing contexts; avoid over-using wood-deck shots. Avoid soapy/mid-treatment ("post-treat") shots as "result" images.
- No stock-looking or AI-generated imagery. All `.webp`, web-optimized.

## Do / Don't
- ✅ Real photos, real reviews, real local detail, fast-loading media.
- ✅ Consistent hero + section structure across all location pages.
- ❌ Emoji standing in for icons in primary nav/CTAs (reads as template-default / "AI-made").
- ❌ Fabricated reviews, testimonials, or before/after claims.
- ❌ Heavy/uncompressed video or images (hurts Core Web Vitals).

## Technical notes
- Static HTML/CSS; shared `style.css`; deployed via GitHub Pages behind Cloudflare (`main` auto-deploys).
- Path conventions: root pages use `images/…`; `services/` use `../`; `locations/[city]/` use `../../`.
