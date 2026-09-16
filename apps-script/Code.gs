/**
 * Apps Script web app that receives opt-in form submissions and
 * appends them as a new row in the master Google Sheet.
 *
 * All new leads are written to the tab named in LEAD_SHEET_NAME below.
 * If that tab doesn't exist yet, it's created automatically with a
 * header row, so you don't have to set it up by hand.
 *
 * To collect a new batch in a fresh tab (e.g. for the next session),
 * just change LEAD_SHEET_NAME and re-deploy:
 *   Deploy -> Manage deployments -> Edit (pencil) -> New version -> Deploy
 *
 * Setup instructions: see ../SETUP.md
 */

// Leads for the current session are collected in this tab.
var LEAD_SHEET_NAME = "19 September";

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Look up the tab; create it (with a header row) only if missing.
    // Using getSheetByName + a null check avoids the "sheet already exists"
    // error that insertSheet throws when the tab is already there.
    var sheet = ss.getSheetByName(LEAD_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(LEAD_SHEET_NAME);
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
    // Try JSON first.
    try {
      var obj = JSON.parse(body);
      if (obj && typeof obj === "object") return obj;
    } catch (ignore) {}
    // Fall back to a url-encoded query string.
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
  return json({ result: "alive", sheet: LEAD_SHEET_NAME, time: new Date() });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
