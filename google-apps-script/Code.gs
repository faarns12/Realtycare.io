/**
 * RealtyCare.io → Google Sheets
 * Paste this whole file into Extensions → Apps Script in your Google Sheet,
 * set SHARED_SECRET, then Deploy → New deployment → Web app (see README.md).
 *
 * Each form on the website gets its own tab (Strategy calls, Consultations,
 * Demo calls, Calculator). New columns are added automatically.
 */

// Must match GOOGLE_SHEET_SECRET in the website's environment variables.
const SHARED_SECRET = 'change-me-to-a-long-random-string';

// Optional: get an email for every new form. Leave '' to turn off.
const NOTIFY_EMAIL = '';

// Optional: email realtors their calculator results when they ask for them.
const SEND_CALCULATOR_EMAIL = true;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SHARED_SECRET) return json_({ ok: false, error: 'unauthorized' });

    const tab = String(body.sheet || 'Leads').slice(0, 60);
    const data = body.data || {};
    appendRow_(tab, data);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'New ' + tab + ' entry on RealtyCare.io', format_(data));
    }
    if (SEND_CALCULATOR_EMAIL && tab === 'Calculator' && data.email) {
      sendCalculatorEmail_(data);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Visit the Web app URL in a browser to check it's running. */
function doGet() {
  return json_({ ok: true, message: 'RealtyCare sheet endpoint is running' });
}

function appendRow_(tab, data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(tab) || ss.insertSheet(tab);
    const headers = sheet.getLastColumn() > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    let changed = false;
    Object.keys(data).forEach(function (k) {
      if (headers.indexOf(k) === -1) { headers.push(k); changed = true; }
    });
    if (changed) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#0F1E2E').setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(headers.map(function (h) { return data[h] === undefined ? '' : data[h]; }));
  } finally {
    lock.releaseLock();
  }
}

function sendCalculatorEmail_(d) {
  const usd = function (v) { return v === '' || v === 'custom' ? 'Custom' : '$' + Number(v).toLocaleString('en-US'); };
  const lines = [
    'Hi ' + (d.first_name || 'there') + ',',
    '',
    'Here are the numbers from the RealtyCare.io calculator:',
    '',
    'Monthly ad budget: ' + usd(d.ad_budget),
    'Estimated leads a month: ' + d.est_leads,
    'Estimated new clients a month: ' + d.est_clients,
    'Estimated commission a month: ' + usd(d.est_commission),
    '',
    'Plan that fits: ' + d.plan_recommended,
    'Your monthly total on ' + d.plan_viewed + ': ' + usd(d.plan_total),
    'The usual way (separate tools and people): ' + usd(d.usual_total),
    d.monthly_savings && Number(d.monthly_savings) > 0 ? 'Estimated saving: ' + usd(d.monthly_savings) + ' a month' : '',
    '',
    'These are estimates, not guarantees. Want to go through them for your market? Reply to this email.',
    '',
    'RealtyCare.io',
  ];
  MailApp.sendEmail({ to: d.email, subject: 'Your RealtyCare.io numbers', body: lines.join('\n'), name: 'RealtyCare.io' });
}

function format_(data) {
  return Object.keys(data).map(function (k) { return k + ': ' + data[k]; }).join('\n');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
