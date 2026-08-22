/******************************************************
 * THE DANSVILLA STUDIO — "JOSH: THE DANCETROTTER"
 * SHOWCASE CAMPAIGN — REGISTRATION BACKEND
 *
 * Collects interest/registrations from the homepage
 * popup, sticky banner, and floating button for the
 * "Josh — The Dancetrotter" student showcase
 * (Saturday, January 30, 2027 — batches start September).
 *
 * This is intentionally a SEPARATE Google Sheet from the
 * regular enquiry form / student profile form, so Josh
 * campaign leads stay easy to find and count on their own.
 *
 * Paste this into a NEW Google Sheet's Apps Script editor
 * (Extensions -> Apps Script), created from the same
 * account Master uses: dansvilla2k19@gmail.com
 ******************************************************/

const MASTER_EMAIL = "dansvilla2k19@gmail.com";
const STUDIO_NAME = "The Dansvilla Studio";
const STUDIO_PHONE = "613-218-9417";
const STUDIO_WEBSITE = "https://www.thedansvillastudio.com";
const MASTER_WHATSAPP_NUMBER = "16132189417";
const EXPECTED_CAMPAIGN_ID = "josh-dancetrotter-2027"; // must match the "id" of the JOSH entry in index.html's CAMPAIGNS array

const HEADERS = [
  "Timestamp",
  "Full Name",
  "Phone / WhatsApp",
  "Email",
  "Dancer's Age Group",
  "Already Training With Dansvilla?",
  "Message / Notes",
  "Submitted From",
  "Received At",
  "Full Raw Data"
];

function doGet() {
  return ContentService
    .createTextOutput("Dansvilla Josh — The Dancetrotter registration backend is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const sheet = getMainSheet_();
    const data = parsePostData_(e);
    const timestamp = new Date();

    // Honeypot field — bots sometimes fill this. Accept quietly, do nothing else.
    if (String(data.website || "").trim()) {
      return jsonResponse_({ success: true });
    }

    // Safety net: if index.html's JOSH and Hai Garmi scriptUrl values ever get swapped or
    // duplicated by mistake, fail loudly here instead of silently saving mismatched data.
    if (data.campaignId && data.campaignId !== EXPECTED_CAMPAIGN_ID) {
      return jsonResponse_({ success: false, error: "This script is wired to '" + EXPECTED_CAMPAIGN_ID + "' but received a '" + data.campaignId + "' submission. Check the scriptUrl values in index.html — JOSH and Hai Garmi may be pointing at the same or swapped URLs." });
    }

    ensureHeaders_(sheet);

    const receivedAt = Utilities.formatDate(timestamp, "America/Toronto", "MMM d, yyyy h:mm a") + " Ottawa time";

    sheet.appendRow([
      timestamp,
      data.name || "",
      data.phone || "",
      data.email || "",
      data.ageGroup || "",
      data.currentStudent || "",
      data.message || "",
      data.pageUrl || "",
      receivedAt,
      JSON.stringify(data)
    ]);

    sendMasterEmail_(data, receivedAt);
    if (data.email && isValidEmail_(data.email)) {
      sendCustomerEmail_(data);
    }

    return jsonResponse_({ success: true });
  } catch (error) {
    return jsonResponse_({ success: false, error: error.message });
  }
}

function getMainSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  if (!sheet) throw new Error("No sheet found in this spreadsheet.");
  return sheet;
}

function ensureHeaders_(sheet) {
  const firstCell = String(sheet.getRange(1, 1).getValue() || "").trim();
  if (!firstCell) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function parsePostData_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("No POST data received.");
  }
  return JSON.parse(e.postData.contents || "{}");
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function buildWaLink_(number, text) {
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
}

/* ---------- Emails ---------- */

function sendMasterEmail_(data, receivedAt) {
  const rows = [
    ["Full Name", data.name || "Not provided"],
    ["Phone / WhatsApp", data.phone || "Not provided"],
    ["Email", data.email || "Not provided"],
    ["Dancer's Age Group", data.ageGroup || "Not provided"],
    ["Already Training With Dansvilla?", data.currentStudent || "Not provided"],
    ["Message / Notes", data.message || "No extra message"],
    ["Submitted From", data.pageUrl || STUDIO_WEBSITE],
    ["Received At", receivedAt],
  ];

  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="width:35%;font-weight:bold;background:#B8860B;color:#FFFFFF;padding:10px 12px;border:1px solid #F0DFA6;vertical-align:top;">${escapeHtml_(label)}</td>
      <td style="background:#FFFBEF;color:#111827;padding:10px 12px;border:1px solid #F0DFA6;white-space:pre-wrap;vertical-align:top;">${escapeHtml_(value)}</td>
    </tr>
  `).join("");

  const masterWaText = "Hi " + (data.name || "there") + ", thanks for registering interest in JOSH — The Dancetrotter! Let's get you into a batch starting in September.";
  const masterWa = data.phone ? buildWaLink_(sanitizePhoneForWa_(data.phone), masterWaText) : "";

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#111827;background:#ffffff;">
      <div style="max-width:760px;margin:0 auto;border:1px solid #F0DFA6;border-radius:12px;overflow:hidden;">
        <div style="background:#111827;color:#FFD700;padding:18px 20px;">
          <h2 style="margin:0;">🎬 New JOSH — The Dancetrotter Registration</h2>
          <p style="margin:6px 0 0;color:#FFD700;">Saturday, January 30, 2027 · Batches start September</p>
        </div>
        <div style="padding:20px;">
          <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;border:1px solid #F0DFA6;">${tableRows}</table>
          <div style="margin-top:18px;">
            ${masterWa ? `<a href="${masterWa}" style="display:inline-block;background:#25D366;color:white;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:bold;margin-bottom:8px;">Reply on WhatsApp</a>` : ""}
          </div>
        </div>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: MASTER_EMAIL,
    subject: `JOSH Registration: ${data.name || "New lead"} (${data.ageGroup || "age not given"})`,
    htmlBody: html,
  });
}

function sendCustomerEmail_(data) {
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;background:#ffffff;">
      <div style="max-width:640px;margin:0 auto;border:1px solid #F0DFA6;border-radius:12px;overflow:hidden;">
        <div style="background:#111827;color:#FFD700;padding:18px 20px;">
          <h2 style="margin:0;">You're on the list! 🎬✨</h2>
          <p style="margin:6px 0 0;color:#FFD700;">JOSH — The Dancetrotter</p>
        </div>
        <div style="padding:20px;">
          <p>Hi ${escapeHtml_(data.name || "there")},</p>
          <p>Thanks for registering your interest in <b>JOSH — The Dancetrotter</b>, our students' dance showcase on <b>Saturday, January 30, 2027</b>. Batches start <b>September</b> — Chaitanya Master will reach out shortly with batch timing and next steps.</p>
          <p>For faster help, you can also message Master directly: <a href="https://wa.me/${MASTER_WHATSAPP_NUMBER}" style="color:#128C7E;font-weight:bold;">WhatsApp</a> or call <b>${escapeHtml_(STUDIO_PHONE)}</b>.</p>
          <p style="margin-top:18px;"><b>${escapeHtml_(STUDIO_NAME)}</b><br><a href="${STUDIO_WEBSITE}" style="color:#B8860B;">${escapeHtml_(STUDIO_WEBSITE)}</a></p>
        </div>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: data.email,
    subject: "You're on the list — JOSH: The Dancetrotter 🎬",
    htmlBody: html,
  });
}

function sanitizePhoneForWa_(phone) {
  const digits = String(phone || "").replace(/[^\d]/g, "");
  if (digits.length === 10) return "1" + digits; // assume North American number
  return digits;
}

function escapeHtml_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
