/*
 * Google Analytics 4 (GA4), ready to switch on.
 *
 * To turn it on: replace the placeholder below with the real Measurement ID
 * from analytics.google.com (Admin > Data streams > the website stream), e.g.
 *   const GA4_ID = 'G-AB12CD34EF';
 * Until then this file does nothing at all.
 *
 * gtag.js is already loaded on every page for Google Ads; this only adds the
 * GA4 config call and these events (GA4 only, sent with send_to = GA4_ID):
 *   form_step_view       { step: 1|2|3, page_type }  step 1 when the form scrolls into view
 *   form_submit_success  { page_type }                when the CRM confirms the lead
 *   phone_click          { page_type }                any tel: link
 *   email_click          { page_type }                any mailto: link
 *   quote_cta_click      { page_type }                "Get a FREE Quote" style buttons
 * It never touches the Google Ads conversion or the Meta Pixel.
 */
const GA4_ID = 'G-XXXXXXXXXX';

(function () {
  if (!/^G-[A-Z0-9]+$/.test(GA4_ID) || GA4_ID === 'G-XXXXXXXXXX') return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  window.gtag('config', GA4_ID);

  var path = location.pathname;
  var pageType = (path === '/' || path === '/index.html') ? 'home'
    : path.indexOf('/services/') === 0 ? 'service'
    : path.indexOf('/locations/') === 0 ? 'city'
    : path.indexOf('/lp/') === 0 ? 'landing'
    : 'other';

  function send(name, params) {
    params = params || {};
    params.page_type = pageType;
    params.send_to = GA4_ID;
    try { window.gtag('event', name, params); } catch (e) { /* never break the page */ }
  }

  // ---- form steps ---------------------------------------------------------
  var sentSteps = {};
  function stepView(n) {
    if (sentSteps[n]) return;
    sentSteps[n] = true;
    send('form_step_view', { step: n });
  }

  function watchForm() {
    var form = document.getElementById('estimate-form');
    if (form && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { stepView(1); io.disconnect(); } });
      }, { threshold: 0.25 });
      io.observe(form);
    }
    var steps = document.querySelectorAll('.form-progress-step');
    if (steps.length && 'MutationObserver' in window) {
      var mo = new MutationObserver(function () {
        for (var i = 0; i < steps.length; i++) {
          if (steps[i].classList.contains('active') && i > 0) stepView(i + 1);
        }
      });
      for (var j = 0; j < steps.length; j++) mo.observe(steps[j], { attributes: true, attributeFilter: ['class'] });
    }
  }

  // ---- successful submission ---------------------------------------------
  // ccbShowSuccess is the page's own success handler (runs only after the CRM
  // confirms the lead). Wrap it so the original still runs exactly as before.
  function watchSuccess() {
    if (typeof window.ccbShowSuccess !== 'function' || window.ccbShowSuccess.__ga4) return;
    var original = window.ccbShowSuccess;
    var wrapped = function () {
      try { send('form_submit_success'); } catch (e) { /* ignore */ }
      return original.apply(this, arguments);
    };
    wrapped.__ga4 = true;
    window.ccbShowSuccess = wrapped;
  }

  // ---- clicks ---------------------------------------------------------------
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href.indexOf('tel:') === 0) return send('phone_click');
    if (href.indexOf('mailto:') === 0) return send('email_click');
    var text = (a.textContent || '').toLowerCase();
    if (text.indexOf('free quote') !== -1 || text.indexOf('free estimate') !== -1 || href === '#estimate-form') {
      send('quote_cta_click');
    }
  }, true);

  function init() { watchForm(); watchSuccess(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
