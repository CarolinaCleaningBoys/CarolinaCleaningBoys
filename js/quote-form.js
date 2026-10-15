/*
 * Shared quote form: every page with the lead form (#leadForm) loads this file.
 * One copy, so a fix here fixes all 29 forms. Added 2026-10-14 (was copied
 * inline into each page before).
 *
 * The page's <form> carries data-form-source="full_form" (homepage),
 * "service_page" or "location_hub" - sent to the CRM as form_source.
 *
 * Steps (same order on every page):
 *   1 contact: property type, name, email, phone, SMS consent
 *   2 property + service: street, city, state, services, window questions
 *   3 details: how did you hear about us, notes, submit
 *
 * The lead is POSTed to the CRM (/api/leads/web). The success message and the
 * Meta Lead + Google Ads conversion fire ONLY after the CRM confirms receipt.
 * After editing: node scripts/check-form-scripts.js  (a syntax error here
 * silently stops every lead on the site).
 */

// ---- step navigation (works with the homepage card and the section layout) ----
function ccbFormSections() {
    var form = document.getElementById('leadForm');
    return form ? form.querySelectorAll('.form-section') : [];
}
function ccbStepError(section, msg, focusEl) {
    var el = section.querySelector('.hero-form-error');
    if (el) { el.textContent = msg; } else { alert(msg); }
    if (focusEl && focusEl.focus) focusEl.focus();
}
function ccbValidateSection(section) {
    var err = section.querySelector('.hero-form-error');
    if (err) err.textContent = '';
    var has = function (sel) { return section.querySelector(sel); };
    var val = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; };
    if (has('input[name="property_type"]') && !document.querySelector('input[name="property_type"]:checked')) { ccbStepError(section, 'Please select a property type.'); return false; }
    if (has('#first_name') && !val('first_name')) { ccbStepError(section, 'Please enter your first name.', document.getElementById('first_name')); return false; }
    if (has('#last_name') && !val('last_name')) { ccbStepError(section, 'Please enter your last name.', document.getElementById('last_name')); return false; }
    if (has('#email') && !val('email')) { ccbStepError(section, 'Please enter your email address.', document.getElementById('email')); return false; }
    if (has('#phone') && val('phone').replace(/\D/g, '').length < 10) { ccbStepError(section, 'Please enter a valid phone number (at least 10 digits).', document.getElementById('phone')); return false; }
    if (has('#street_address') && !val('street_address')) { ccbStepError(section, 'Please enter your street address.', document.getElementById('street_address')); return false; }
    if (has('#city') && !val('city')) { ccbStepError(section, 'Please enter your city.', document.getElementById('city')); return false; }
    if (has('input[name="services"]') && !document.querySelectorAll('input[name="services"]:checked').length) { ccbStepError(section, 'Please select at least one service.'); return false; }
    return true;
}
function ccbShowStep(target) {
    var sections = ccbFormSections();
    var steps = document.querySelectorAll('.form-progress-step');
    var connectors = document.querySelectorAll('.form-progress-connector');
    for (var i = 0; i < sections.length; i++) {
        var n = i + 1;
        sections[i].classList.toggle('active', n === target);
        if (steps[i]) {
            steps[i].classList.toggle('active', n === target);
            steps[i].classList.toggle('completed', n < target);
        }
        if (connectors[i]) connectors[i].classList.toggle('active', n < target);
    }
    var card = document.getElementById('hero-quote-form');
    if (card) card.scrollTop = 0;
    // Tell analytics (js/analytics-config.js) which step is showing.
    try { document.dispatchEvent(new CustomEvent('ccb:form-step', { detail: { step: target } })); } catch (e) { /* never block the form */ }
}
function ccbLoadMaps() {
    if (window._mapsLoaded || typeof window.initAutocomplete !== 'function') return;
    window._mapsLoaded = true;
    if ((window.google && window.google.maps) || document.querySelector('script[src*="maps.googleapis.com"]')) return;
    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBMgQPLJlz8BrHJ7T6WJuJf54KU2JcwqN8&libraries=places&callback=initAutocomplete&loading=async';
    s.async = true;
    document.head.appendChild(s);
}
function nextFormStep(target) {
    var sections = ccbFormSections();
    var current = sections[target - 2];
    if (current && !ccbValidateSection(current)) return;
    ccbShowStep(target);
    if (target === 2) ccbLoadMaps();
}
function prevFormStep(target) { ccbShowStep(target); }
// Old names, in case any page still calls them.
var nextStep = nextFormStep;
var prevStep = prevFormStep;

// ---- window questions, sending, tracking, submit ----
function ccbRadioVal(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
}

function ccbCountLine(checkboxId, countId, label, unit, suffix) {
    var cb = document.getElementById(checkboxId);
    if (!cb || !cb.checked) return '';
    var countEl = document.getElementById(countId);
    var count = countEl ? (countEl.value || '').trim() : '';
    var unitPart = unit ? (' ' + unit) : '';
    var suffixPart = suffix || '';
    if (count) return label + ': ' + count + unitPart + suffixPart;
    return label + ': yes' + suffixPart;
}

function ccbComposeWindowDetails() {
    var lines = [];

    var winCountEl = document.getElementById('win_count');
    var windowsCount = winCountEl ? (winCountEl.value || '').trim() : '';
    var inout = ccbRadioVal('win_inout');
    var inoutLabel = { outside: 'outside only', both: 'inside + outside', unsure: 'not sure' }[inout] || '';
    if (windowsCount && inoutLabel) {
        lines.push('Windows: ' + windowsCount + ' (' + inoutLabel + ')');
    } else if (windowsCount) {
        lines.push('Windows: ' + windowsCount);
    } else if (inoutLabel) {
        lines.push('Windows: ' + inoutLabel);
    }

    var screens = ccbCountLine('win_screens', 'win_screens_count', 'Screens', '', ' - clean them');
    if (screens) lines.push(screens);

    var stormEl = document.getElementById('win_storm');
    var storm = stormEl ? (stormEl.value || '').trim() : '';
    if (storm) lines.push('Storm panes: ' + storm);

    var slidingEl = document.getElementById('win_sliding');
    var sliding = slidingEl ? (slidingEl.value || '').trim() : '';
    if (sliding) lines.push('Sliding doors: ' + sliding);

    var skylightsEl = document.getElementById('win_skylights');
    var skylights = skylightsEl ? (skylightsEl.value || '').trim() : '';
    if (skylights) lines.push('Skylights: ' + skylights);

    var deepTrack = ccbCountLine('win_deep_track', 'win_deep_track_count', 'Deep track & sill detail', 'windows');
    if (deepTrack) lines.push(deepTrack);

    var hardWater = ccbCountLine('win_hard_water', 'win_hard_water_count', 'Hard water spots', 'windows');
    if (hardWater) lines.push(hardWater);

    var overspray = ccbCountLine('win_overspray', 'win_overspray_count', 'Paint / overspray', 'windows');
    if (overspray) lines.push(overspray);

    var hardReach = ccbCountLine('win_hard_reach', 'win_hard_reach_count', 'Hard to reach', 'windows');
    if (hardReach) lines.push(hardReach);

    return lines.length ? ('WINDOW CLEANING DETAILS\n' + lines.join('\n')) : '';
}

function ccbCapMessage(str) {
    if (str.length <= 2000) return str;
    var truncated = str.slice(0, 2000);
    var lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) truncated = truncated.slice(0, lastSpace);
    return truncated;
}

function ccbComposeAdditionalInfo(typedValue) {
    var detailBlock = ccbComposeWindowDetails();
    var typed = (typedValue || '').trim();
    var combined = detailBlock
        ? (typed ? detailBlock + '\n\n' + typed : detailBlock)
        : typed;
    return ccbCapMessage(combined);
}

(function () {
    var windowCheckbox = document.querySelector('input[name="services"][value="Windows"]');
    var panel = document.getElementById('windowDetailsPanel');
    function ccbSyncWindowPanel() {
        if (windowCheckbox && panel) {
            panel.style.display = windowCheckbox.checked ? 'block' : 'none';
        }
    }
    if (windowCheckbox) { windowCheckbox.addEventListener('change', ccbSyncWindowPanel); }
    ccbSyncWindowPanel();
})();

(function () {
    function wireCount(checkboxId, wrapId) {
        var cb = document.getElementById(checkboxId);
        var wrap = document.getElementById(wrapId);
        if (!cb || !wrap) return;
        function sync() { wrap.classList.toggle('show', cb.checked); }
        cb.addEventListener('change', sync);
        sync();
    }
    wireCount('win_screens', 'win_screens_wrap');
    wireCount('win_deep_track', 'win_deep_track_wrap');
    wireCount('win_hard_water', 'win_hard_water_wrap');
    wireCount('win_overspray', 'win_overspray_wrap');
    wireCount('win_hard_reach', 'win_hard_reach_wrap');
})();

function ccbNewEventId() {
    // Shared between the browser pixel and the server-side Conversions API so
    // OpenAI dedupes the two into one conversion instead of counting both.
    try {
        if (window.crypto && window.crypto.randomUUID) { return window.crypto.randomUUID(); }
    } catch (e) {}
    return 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2);
}

function ccbFireTracking(phone, email, openaiEventId) {
    // Meta Lead. Isolated: a tracking failure must NEVER block lead capture.
    try {
        var raw = ((email || '').trim().toLowerCase()) || ((phone || '').replace(/\D/g, '')) || '';
        function fireLead(eid) {
            if (typeof fbq === 'function') {
                fbq('track', 'Lead', { value: 150.00, currency: 'USD' }, eid ? { eventID: eid } : {});
            } else {
                console.warn('[CCB] Meta pixel (fbq) unavailable - Lead event NOT sent. Likely blocked by an ad blocker or tracking protection.');
            }
        }
        if (raw && window.crypto && window.crypto.subtle) {
            window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)).then(function(buf) {
                var hex = Array.prototype.map.call(new Uint8Array(buf), function(b) { return ('0' + b.toString(16)).slice(-2); }).join('');
                fireLead(hex);
            }).catch(function() { fireLead(''); });
        } else { fireLead(''); }
    } catch (err) { console.error('[CCB] Meta Lead tracking failed:', err); }

    // Google Ads conversion. Also isolated.
    try {
        if (typeof gtag === 'function') {
            gtag('event', 'conversion', { 'send_to': 'AW-17822819353/JIJRCJvpxuwbEJnIyrJC', 'value': 150.0, 'currency': 'USD' });
        } else {
            console.warn('[CCB] gtag unavailable - Google Ads conversion NOT sent.');
        }
    } catch (err) { console.error('[CCB] Google Ads conversion failed:', err); }

    // OpenAI Ads lead_created. Also isolated.
    try {
        if (typeof window.oaiq === 'function') {
            window.oaiq('measure', 'lead_created', { type: 'customer_action' }, openaiEventId ? { event_id: openaiEventId } : {});
        } else {
            console.warn('[CCB] oaiq unavailable - OpenAI lead_created NOT sent.');
        }
    } catch (err) { console.error('[CCB] OpenAI lead_created failed:', err); }
}

function ccbSendLead(data, form, btn, originalBtnLabel) {
    fetch('https://pressure-wash-crm.vercel.app/api/leads/web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(function(res) {
        if (!res.ok) { throw new Error('Request failed with status ' + res.status); }
        return res.json();
    }).then(function(d) {
        if (d && d.success === false) { throw new Error(d.error || 'Submission failed'); }
        ccbShowSuccess(form, btn);
        ccbFireTracking(data.phone, data.email, data.openai_event_id);
    }).catch(function(err) {
        console.error('[CCB] Lead submit failed:', err);
        ccbShowError(form, btn, originalBtnLabel);
    });
}

function ccbShowSuccess(form, btn) {
    btn.textContent = 'Request Sent!';
    btn.disabled = true;
    var successMsg = document.createElement('p');
    successMsg.style.cssText = 'margin-top:16px;font-size:1.1rem;color:#22c55e;font-weight:600;text-align:center;';
    successMsg.textContent = 'Thanks! We\u2019ll be in touch within 24 hours.';
    form.appendChild(successMsg);

    // 10-second fallback notice
    setTimeout(function() {
        var fallback = document.createElement('p');
        fallback.style.cssText = 'margin-top:8px;font-size:0.95rem;color:#555;text-align:center;';
        fallback.innerHTML = 'If you don\u2019t hear from us within 24 hours, call <a href="tel:919-717-4653" style="color:#3F647F;font-weight:700;">919-717-4653</a>.';
        form.appendChild(fallback);
    }, 10000);
}

function ccbShowError(form, btn, originalBtnLabel) {
    btn.disabled = false;
    btn.textContent = originalBtnLabel || 'Submit Request';
    var errorMsg = document.getElementById('leadFormSubmitError');
    if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.id = 'leadFormSubmitError';
        errorMsg.setAttribute('role', 'alert');
        errorMsg.style.cssText = 'margin-top:12px;font-size:0.95rem;color:#dc2626;font-weight:600;text-align:center;';
        form.appendChild(errorMsg);
    }
    errorMsg.innerHTML = 'Something went wrong sending your request \u2014 please try again, or call <a href="tel:919-717-4653" style="color:#dc2626;text-decoration:underline;">919-717-4653</a>.';
}

function ccbGetAttribution() {
    try { return (function(){try{var _a=JSON.parse(localStorage.getItem('ccb_attribution'))||{};if(!_a.captured_at||(Date.now()-_a.captured_at)>2592000000){return {};}return _a;}catch(_e){return {};}})() || {}; } catch(e) { return {}; }
}

function submitForm(e) {
    e.preventDefault();
    var form = document.getElementById('leadForm');

    // Honeypot: a real visitor never fills this in. Silently drop bot submissions.
    var hp = form.querySelector('#company_website');
    if (hp && hp.value) { return; }

    // Phone validation
    var phoneVal = form.querySelector('#phone').value.replace(/\D/g, '');
    if (phoneVal.length < 10) {
        alert('Please enter a valid phone number (at least 10 digits).');
        form.querySelector('#phone').focus();
        return;
    }

    // Service checkbox validation
    var checkedServices = form.querySelectorAll('input[name="services"]:checked');
    if (checkedServices.length === 0) {
        alert('Please select at least one service.');
        return;
    }

    var btn = document.getElementById('submitBtn');
    var originalBtnLabel = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    var services = [];
    checkedServices.forEach(function(cb) { services.push(cb.value); });

    var propertyType = form.querySelector('input[name="property_type"]:checked');
    var smsConsentEl = form.querySelector('#sms_consent');

    var ccbAttr = ccbGetAttribution();
    var data = {
        property_type: propertyType ? propertyType.value : '',
        first_name: form.querySelector('#first_name').value,
        last_name: form.querySelector('#last_name').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value,
        street_address: form.querySelector('#street_address').value,
        city: form.querySelector('#city').value,
        state: form.querySelector('#state').value,
        services: services.join(', '),
        referral_source: form.querySelector('#referral_source').value,
        additional_info: ccbComposeAdditionalInfo(form.querySelector('#additional_info').value),
        sms_consent: smsConsentEl ? smsConsentEl.checked : false,
        consent_evidence: { form_url: window.location.href, user_agent: navigator.userAgent, submitted_at: new Date().toISOString() },
        form_source: form.getAttribute('data-form-source') || 'full_form',
        attribution: ccbAttr,
        oppref: ccbAttr.oppref || '',
        openai_event_id: ccbNewEventId(),
        company_website: hp ? hp.value : ''
    };

    // Send the lead. Success message + tracking only fire once the CRM
    // confirms it actually received the lead (see ccbSendLead).
    ccbSendLead(data, form, btn, originalBtnLabel);
}
