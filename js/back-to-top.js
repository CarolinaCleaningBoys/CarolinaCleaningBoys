/*
 * Back-to-top button, shared by every page on the site.
 *
 * One file so the behaviour lives in one place (the same rule copy-pasted
 * into dozens of pages drifts apart). Each page loads it with a single
 * <script src=".../js/back-to-top.js" defer> tag.
 *
 * - Appears after the visitor has scrolled ~600px, fades out near the top.
 * - Sits bottom-right. If another fixed element already owns that corner
 *   (the orange floating quote button on service pages, the "Text us"
 *   button on What to Expect, the sticky call bar on the ad landing pages)
 *   it measures that element and parks itself just above it.
 * - z-index 160: above page content and the floating quote button (150),
 *   below the hamburger menu overlay (200), so an open menu covers it.
 * - Self-contained: injects its own styles, needs nothing from style.css.
 */
(function () {
    'use strict';
    if (document.getElementById('ccb-back-to-top')) return;

    var SHOW_AFTER = 600;   // px scrolled before it appears
    var BASE_GAP = 20;      // px from the bottom edge when the corner is free
    var CLEARANCE = 12;     // px kept between it and anything it stacks above
    var CORNER_OWNERS = '.floating-cta, .wte-textus-fab, .lp-sticky';

    var style = document.createElement('style');
    style.textContent =
        '#ccb-back-to-top{position:fixed;right:16px;bottom:' + BASE_GAP + 'px;z-index:160;' +
        'width:48px;height:48px;border-radius:50%;border:2px solid #fff;padding:0;' +
        'background:#2E4F66;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.25);' +
        'display:flex;align-items:center;justify-content:center;cursor:pointer;' +
        'opacity:0;visibility:hidden;transform:translateY(10px);' +
        'transition:opacity .25s ease,transform .25s ease,visibility .25s ease,bottom .2s ease}' +
        '#ccb-back-to-top.is-visible{opacity:1;visibility:visible;transform:none}' +
        '#ccb-back-to-top:hover{background:#1c2a33}' +
        '#ccb-back-to-top:focus-visible{outline:3px solid #F7C531;outline-offset:2px}' +
        '#ccb-back-to-top svg{width:22px;height:22px;display:block}' +
        '@media (min-width:900px){#ccb-back-to-top{right:24px}}' +
        '@media print{#ccb-back-to-top{display:none!important}}' +
        '@media (prefers-reduced-motion:reduce){#ccb-back-to-top{transition:none}}';
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'ccb-back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);

    // Park above whatever already occupies the bottom-right corner.
    function place() {
        var bottom = BASE_GAP;
        var owners = document.querySelectorAll(CORNER_OWNERS);
        for (var i = 0; i < owners.length; i++) {
            var el = owners[i];
            var cs = window.getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position !== 'fixed') continue;
            var r = el.getBoundingClientRect();
            if (!r.height || r.right < window.innerWidth - 90) continue; // not in our corner
            bottom = Math.max(bottom, Math.ceil(window.innerHeight - r.top) + CLEARANCE);
        }
        btn.style.bottom = bottom + 'px';
    }

    var visible = false;
    function onScroll() {
        var y = window.pageYOffset || document.documentElement.scrollTop || 0;
        var shouldShow = y > SHOW_AFTER;
        if (shouldShow === visible) return;
        visible = shouldShow;
        if (visible) place();
        btn.classList.toggle('is-visible', visible);
    }

    btn.addEventListener('click', function () {
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        btn.blur();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { if (visible) place(); });
    onScroll();
})();
