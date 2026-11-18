/**
 * Apps Script web app that receives opt-in form submissions and
 * appends them as a new row in the master Google Sheet.
 *
 * New leads are written to the spreadsheet identified by SPREADSHEET_ID
 * below (the "NQM | 2026 | November" sheet), on the tab named LEAD_SHEET_NAME.
 * Writing by ID (instead of getActiveSpreadsheet) means this works no matter
 * which spreadsheet the script project is bound to.
 *
 * To collect into a different spreadsheet later, change SPREADSHEET_ID and
 * re-deploy:
 *   Deploy -> Manage deployments -> Edit (pencil) -> New version -> Deploy
 *
 * Setup instructions: see ../SETUP.md
 */

// Target spreadsheet: "NQM | 2026 | November"
var SPREADSHEET_ID = "1YRcdombnFBwFFF4YWihYbJNY1nVX6Apcuf4EoSLM584";

// Leads are collected on this tab inside that spreadsheet.
var LEAD_SHEET_NAME = "Leads";

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Look up the tab; create it (with a header row) only if missing.
    var sheet = ss.getSheetByName(LEAD_SHEET_NAME);
    if (!sheet) {
      // Reuse the default first sheet if it's still the blank "Sheet1".
      var first = ss.getSheets()[0];
      if (first && first.getName() === "Sheet1" && first.getLastRow() <= 1) {
        first.setName(LEAD_SHEET_NAME);
        sheet = first;
      } else {
        sheet = ss.insertSheet(LEAD_SHEET_NAME);
      }
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone"]);
    }

    var data = getParams(e);

    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.phone || "",
    ]);

    return json({ result: "success" });
  } catch (err) {
    return json({ result: "error", message: String(err) });
  }
}

// Reads form fields whether they arrive as url-encoded, multipart, or a
// raw JSON/query-string body — so the write works no matter how the
// website sends the request.
function getParams(e) {
  if (e && e.parameter && (e.parameter.name || e.parameter.email || e.parameter.phone)) {
    return e.parameter;
  }
  if (e && e.postData && e.postData.contents) {
    var body = e.postData.contents;
    try {
      var obj = JSON.parse(body);
      if (obj && typeof obj === "object") return obj;
    } catch (ignore) {}
    var out = {};
    body.split("&").forEach(function (pair) {
      var kv = pair.split("=");
      if (kv.length >= 1 && kv[0]) {
        out[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
      }
    });
    return out;
  }
  return {};
}

// A quick health check: opening the /exec URL in a browser hits doGet and
// should show {"result":"alive", ...}. If you see that, the deployment works.
function doGet() {
  return json({ result: "alive", spreadsheet: SPREADSHEET_ID, sheet: LEAD_SHEET_NAME, time: new Date() });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
