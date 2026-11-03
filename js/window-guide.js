/*
 * "How do we count windows?" (Zach 2026-11-03). Loaded by js/quote-form.js (the 29 form
 * pages, only when the page has the window count box) and directly by
 * lp/window-cleaning/index.html (which has its own form script).
 *
 * A small tap-to-open link under the window count box. Most clients don't know how we
 * count windows (a double casement is 2, a triple picture unit is 3), and the quote is
 * built on that count. Closed by default; the picture only downloads when it's opened.
 * The CRM also texts this same picture to every window lead, so the website is a bonus,
 * not the only place they see it. Self-contained styles so it works on any page.
 */
function ccbAddWindowGuide(countInput, imgSrc) {
    if (!countInput || !countInput.parentNode || document.getElementById('ccbWindowGuide')) return;
    var box = document.createElement('details');
    box.id = 'ccbWindowGuide';
    box.style.margin = '6px 0 0';
    var sum = document.createElement('summary');
    sum.textContent = 'How do we count windows?';
    sum.style.cursor = 'pointer';
    sum.style.fontSize = '0.9em';
    sum.style.textDecoration = 'underline';
    sum.style.color = 'inherit';
    box.appendChild(sum);
    var img = document.createElement('img');
    img.alt = 'How we count windows: double hung, single hung and casement windows count as 1; a double casement counts as 2; a triple picture unit counts as 3; picture windows, patio doors, round and shaped windows and each screen count as 1. French windows, patio doors and oversized windows have additional charges.';
    img.width = 746;
    img.height = 594;
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.maxWidth = '480px';
    img.style.height = 'auto';
    img.style.marginTop = '8px';
    img.style.borderRadius = '6px';
    box.appendChild(img);
    box.addEventListener('toggle', function () {
        if (box.open && !img.getAttribute('src')) img.setAttribute('src', imgSrc);
    });
    countInput.parentNode.insertBefore(box, countInput.nextSibling);
}
(function () {
    try {
        // window.CCB_WINDOW_GUIDE_SRC lets a local preview point at the file; the live site uses the root path.
        ccbAddWindowGuide(document.getElementById('win_count'), window.CCB_WINDOW_GUIDE_SRC || '/images/how-to-count-windows.webp');
    } catch (e) {}
})();
