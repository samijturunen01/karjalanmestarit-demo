/**
 * OPTIONAL quote-request backend for a later, approved production version.
 * NOT deployed, NOT connected. The demo uses the mock handler in
 * src/services/quoteRequest.ts and sends nothing.
 *
 * Google Apps Script web app that receives the form as JSON (text/plain POST),
 * validates it server-side, rejects obvious bots and e-mails the request to the
 * right site manager. Nothing is stored.
 *
 * Setup (by the company or its IT partner):
 *  1. script.google.com → new project → paste this file.
 *  2. Project Settings → Script properties (never put these in the frontend):
 *       RECIPIENT_DEFAULT   e-mail that receives requests
 *       RECIPIENT_PK        optional, North Karelia requests
 *       RECIPIENT_PS        optional, North Savo requests
 *       TURNSTILE_SECRET    optional, Cloudflare Turnstile secret key
 *  3. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone.
 *  4. Build the site with VITE_QUOTE_ENDPOINT=<web app URL> (https only).
 *  5. Publish a privacy notice (tietosuojaseloste) before going live.
 */

var MAX = { name: 100, organisation: 120, email: 160, phone: 30, location: 160, message: 3000 };
var SERVICES = [
  'bitumikermi-ja-tiilikatteet',
  'rakennuspellitykset',
  'vesikattojen-puutyot',
  'vesikaton-tarkastus-ja-huolto',
  'maanalaisten-rakenteiden-bitumityot',
  'kattoremontti',
  'en-tieda',
  '',
];
var SAVO = /kuopio|siilinjärvi|iisalmi|varkaus|suonenjoki|tuusniemi|leppävirta|kaavi|rautalampi|pohjois-savo/i;

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Bots: honeypot filled or form submitted implausibly fast → pretend success
    if (data.hp || Number(data.elapsedMs) < 3000) return json_({ ok: true });

    var errors = validate_(data);
    if (errors.length) return json_({ ok: false, errors: errors });

    if (!rateLimitOk_(String(data.email).toLowerCase())) return json_({ ok: false, errors: ['rate'] });

    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty('TURNSTILE_SECRET');
    if (secret && !turnstileOk_(secret, data.turnstileToken)) return json_({ ok: false, errors: ['captcha'] });

    var to = props.getProperty('RECIPIENT_DEFAULT');
    if (SAVO.test(data.location) && props.getProperty('RECIPIENT_PS')) to = props.getProperty('RECIPIENT_PS');
    else if (props.getProperty('RECIPIENT_PK')) to = props.getProperty('RECIPIENT_PK');

    MailApp.sendEmail({
      to: to,
      replyTo: data.email,
      subject: 'Tarjouspyyntö: ' + clean_(data.location) + ' – ' + clean_(data.name),
      body: [
        'Nimi: ' + clean_(data.name),
        'Yritys / taloyhtiö: ' + clean_(data.organisation),
        'Sähköposti: ' + clean_(data.email),
        'Puhelin: ' + clean_(data.phone),
        'Kohteen sijainti: ' + clean_(data.location),
        'Palvelu: ' + clean_(data.service),
        '',
        clean_(data.message),
      ].join('\n'),
    });
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, errors: ['server'] });
  }
}

function validate_(d) {
  var errs = [];
  Object.keys(MAX).forEach(function (k) {
    if (String(d[k] || '').length > MAX[k]) errs.push(k);
  });
  if (String(d.name || '').trim().length < 2) errs.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(d.email || ''))) errs.push('email');
  if (!String(d.location || '').trim()) errs.push('location');
  if (String(d.message || '').trim().length < 10) errs.push('message');
  if (SERVICES.indexOf(String(d.service || '')) === -1) errs.push('service');
  return errs;
}

/** Max 3 requests per e-mail address per 10 minutes. */
function rateLimitOk_(key) {
  var cache = CacheService.getScriptCache();
  var n = Number(cache.get('rl:' + key) || 0);
  if (n >= 3) return false;
  cache.put('rl:' + key, String(n + 1), 600);
  return true;
}

function turnstileOk_(secret, token) {
  if (!token) return false;
  var res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true,
  });
  return JSON.parse(res.getContentText()).success === true;
}

function clean_(s) {
  return String(s || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, 3000);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
