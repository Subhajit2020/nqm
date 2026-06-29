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
var LEAD_SHEET_NAME = "1 July";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LEAD_SHEET_NAME);

  // Create the tab (with a header row) the first time it's needed.
  if (!sheet) {
    sheet = ss.insertSheet(LEAD_SHEET_NAME);
    sheet.appendRow(["Timestamp", "Name", "Email", "Phone"]);
  }

  var name = (e.parameter.name || "").toString();
  var email = (e.parameter.email || "").toString();
  var phone = (e.parameter.phone || "").toString();

  sheet.appendRow([new Date(), name, email, phone]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
