// Ad tracking (Meta Pixel + Google tag). OFF until the IDs below are filled in —
// with both blank, nothing loads and nothing is sent anywhere.
// META_PIXEL_ID: Meta Events Manager → Data sources → your pixel (digits only).
// GOOGLE_TAG_ID: Google Ads → Tools → Google tag (looks like AW-123456789) or a GA4 ID (G-XXXX).
// GOOGLE_SIGNUP_LABEL: Google Ads conversion label for "Sign-up" (the part after the slash).
(function () {
    var META_PIXEL_ID = '1256233184233936';
    var GOOGLE_TAG_ID = '';
    var GOOGLE_SIGNUP_LABEL = '';

    // Only on the real sites, so staging/test traffic never pollutes the ad data.
    var live = /(^|\.)detailerlogic\.com$/.test(location.hostname);
    var meta = live && /^\d{6,20}$/.test(META_PIXEL_ID);
    var goog = live && /^(AW|G)-[A-Z0-9]+$/.test(GOOGLE_TAG_ID);

    if (meta) {
        !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', META_PIXEL_ID);
        window.fbq('track', 'PageView');
    }
    if (goog) {
        var g = document.createElement('script'); g.async = true;
        g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_TAG_ID;
        document.head.appendChild(g);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GOOGLE_TAG_ID);
    }

    // Website only: a tap on any 'Start free' / app link counts as interest.
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="https://app.detailerlogic.com"]');
        if (!a || /log in/i.test(a.textContent)) return;
        try { if (meta && window.fbq) window.fbq('trackCustom', 'StartFreeClick');
              if (goog && window.gtag) window.gtag('event', 'start_free_click'); } catch (x) {}
    });

    // dlTrack('signup') — called once after a successful sign-up. Never throws.
    window.dlTrack = function (kind) {
        try {
            if (kind !== 'signup') return;
            if (meta && window.fbq) window.fbq('track', 'CompleteRegistration');
            if (goog && window.gtag) {
                if (GOOGLE_TAG_ID.indexOf('AW-') === 0 && GOOGLE_SIGNUP_LABEL) window.gtag('event', 'conversion', { send_to: GOOGLE_TAG_ID + '/' + GOOGLE_SIGNUP_LABEL });
                else window.gtag('event', 'sign_up');
            }
        } catch (e) {}
    };
})();
