/**
 * Apps Script web app that receives opt-in form submissions and
 * appends them as a new row in the "Claude Fable" Google Sheet.
 *
 * Setup instructions: see ../SETUP.md
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  var name = (e.parameter.name || "").toString();
  var email = (e.parameter.email || "").toString();
  var phone = (e.parameter.phone || "").toString();

  sheet.appendRow([new Date(), name, email, phone]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
