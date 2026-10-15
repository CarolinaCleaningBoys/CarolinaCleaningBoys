/*
 * Lazy-load autoplay videos (added 2026-10-14).
 *
 * Videos are written as <video data-src="..." poster="..." preload="none" autoplay muted loop playsinline>.
 * The poster image shows right away; the video file (1-9 MB) only downloads when it
 * comes within 200px of the screen, then starts playing. Before this, every visitor
 * downloaded every video on the page in full, even ones they never scrolled to.
 * Pattern from https://web.dev/articles/lazy-loading-video (JavaScript + IntersectionObserver
 * version, which works in all browsers; the loading="lazy" attribute on <video> is not yet universal).
 */
(function () {
  var videos = [].slice.call(document.querySelectorAll('video[data-src]'));
  if (!videos.length) return;

  function load(v) {
    if (v.getAttribute('data-loaded')) return;
    v.setAttribute('data-loaded', '1');
    v.src = v.getAttribute('data-src');
    v.load();
    if (v.hasAttribute('autoplay')) {
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays, pause button still works */ });
    }
  }

  if (!('IntersectionObserver' in window)) { videos.forEach(load); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { load(e.target); io.unobserve(e.target); }
    });
  }, { rootMargin: '200px 0px' });
  videos.forEach(function (v) { io.observe(v); });
})();
