/******************************************************
 * THE DANSVILLA STUDIO — "HAI GARMI!"
 * SUMMER DANCE SHOWCASE — SEAT BOOKING BACKEND
 *
 * Collects free-entry seat bookings from the homepage
 * popup, sticky banner, and floating button for the
 * "Hai Garmi! Summer Dance Showcase"
 * (Saturday, September 19, 2026 — Ron Kolbus Lakeside
 * Centre, Britannia Beach, Ottawa — Showtime 3:00 PM).
 *
 * This is a SEPARATE Google Sheet from JOSH — The
 * Dancetrotter and from the regular enquiry/student
 * profile forms, so Hai Garmi headcount stays easy to
 * find and count on its own.
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
const EXPECTED_CAMPAIGN_ID = "hai-garmi-2026"; // must match the "id" of the Hai Garmi entry in index.html's CAMPAIGNS array

const HEADERS = [
  "Timestamp",
  "Full Name",
  "Phone / WhatsApp",
  "Email",
  "Adults",
  "Kids",
  "Total Seats",
  "Message / Notes",
  "Submitted From",
  "Received At",
  "Full Raw Data"
];

function doGet() {
  return ContentService
    .createTextOutput("Dansvilla Hai Garmi! seat-booking backend is running.")
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
    // duplicated by mistake, fail loudly here instead of silently saving mismatched data
    // (this is exactly what caused the "booked for 0 seats" email from a JOSH submission).
    if (data.campaignId && data.campaignId !== EXPECTED_CAMPAIGN_ID) {
      return jsonResponse_({ success: false, error: "This script is wired to '" + EXPECTED_CAMPAIGN_ID + "' but received a '" + data.campaignId + "' submission. Check the scriptUrl values in index.html — JOSH and Hai Garmi may be pointing at the same or swapped URLs." });
    }

    ensureHeaders_(sheet);

    const adults = parseInt(data.adults, 10) || 0;
    const kids = parseInt(data.kids, 10) || 0;
    const totalSeats = adults + kids;
    const receivedAt = Utilities.formatDate(timestamp, "America/Toronto", "MMM d, yyyy h:mm a") + " Ottawa time";

    sheet.appendRow([
      timestamp,
      data.name || "",
      data.phone || "",
      data.email || "",
      adults,
      kids,
      totalSeats,
      data.message || "",
      data.pageUrl || "",
      receivedAt,
      JSON.stringify(data)
    ]);

    sendMasterEmail_(data, totalSeats, receivedAt);
    if (data.email && isValidEmail_(data.email)) {
      sendCustomerEmail_(data, totalSeats);
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

function sendMasterEmail_(data, totalSeats, receivedAt) {
  const rows = [
    ["Full Name", data.name || "Not provided"],
    ["Phone / WhatsApp", data.phone || "Not provided"],
    ["Email", data.email || "Not provided"],
    ["Adults", data.adults || "0"],
    ["Kids", data.kids || "0"],
    ["Total Seats", String(totalSeats)],
    ["Message / Notes", data.message || "No extra message"],
    ["Submitted From", data.pageUrl || STUDIO_WEBSITE],
    ["Received At", receivedAt],
  ];

  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="width:35%;font-weight:bold;background:#c2410c;color:#FFFFFF;padding:10px 12px;border:1px solid #fed7aa;vertical-align:top;">${escapeHtml_(label)}</td>
      <td style="background:#fff7ed;color:#111827;padding:10px 12px;border:1px solid #fed7aa;white-space:pre-wrap;vertical-align:top;">${escapeHtml_(value)}</td>
    </tr>
  `).join("");

  const masterWaText = "Hi " + (data.name || "there") + ", thanks for booking " + totalSeats + " seat(s) for Hai Garmi! Summer Dance Showcase on Sept 19, 2026. See you at Ron Kolbus Lakeside Centre!";
  const masterWa = data.phone ? buildWaLink_(sanitizePhoneForWa_(data.phone), masterWaText) : "";

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#111827;background:#ffffff;">
      <div style="max-width:760px;margin:0 auto;border:1px solid #fed7aa;border-radius:12px;overflow:hidden;">
        <div style="background:#111827;color:#fbbf24;padding:18px 20px;">
          <h2 style="margin:0;">🌞 New Hai Garmi! Seat Booking — ${totalSeats} seat(s)</h2>
          <p style="margin:6px 0 0;color:#fbbf24;">Saturday, September 19, 2026 · Ron Kolbus Lakeside Centre · 3:00 PM</p>
        </div>
        <div style="padding:20px;">
          <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;border:1px solid #fed7aa;">${tableRows}</table>
          <div style="margin-top:18px;">
            ${masterWa ? `<a href="${masterWa}" style="display:inline-block;background:#25D366;color:white;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:bold;margin-bottom:8px;">Reply on WhatsApp</a>` : ""}
          </div>
        </div>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: MASTER_EMAIL,
    subject: `Hai Garmi Booking: ${data.name || "New booking"} — ${totalSeats} seat(s)`,
    htmlBody: html,
  });
}

function sendCustomerEmail_(data, totalSeats) {
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;background:#ffffff;">
      <div style="max-width:640px;margin:0 auto;border:1px solid #fed7aa;border-radius:12px;overflow:hidden;">
        <div style="background:#111827;color:#fbbf24;padding:18px 20px;">
          <h2 style="margin:0;">Your seats are booked! 🌞🎉</h2>
          <p style="margin:6px 0 0;color:#fbbf24;">Hai Garmi! Summer Dance Showcase</p>
        </div>
        <div style="padding:20px;">
          <p>Hi ${escapeHtml_(data.name || "there")},</p>
          <p>You're booked for <b>${totalSeats} seat(s)</b> at <b>Hai Garmi! Summer Dance Showcase</b> on <b>Saturday, September 19, 2026</b> at <b>3:00 PM</b>, Ron Kolbus Lakeside Centre, 102 Greenview Avenue, Ottawa. Free entry — just bring your family and friends!</p>
          <p>For faster help, you can also message Master directly: <a href="https://wa.me/${MASTER_WHATSAPP_NUMBER}" style="color:#128C7E;font-weight:bold;">WhatsApp</a> or call <b>${escapeHtml_(STUDIO_PHONE)}</b>.</p>
          <p style="margin-top:18px;"><b>${escapeHtml_(STUDIO_NAME)}</b><br><a href="${STUDIO_WEBSITE}" style="color:#c2410c;">${escapeHtml_(STUDIO_WEBSITE)}</a></p>
        </div>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: data.email,
    subject: "Your seats are booked — Hai Garmi! Summer Dance Showcase 🌞",
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
