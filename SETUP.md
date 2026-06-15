# Webinar Funnel Setup Guide

This funnel has 3 parts:

1. **Landing page / opt-in form** — `index.html`
2. **Thank you page** — `thank-you.html`
3. **Google Sheet connection** — opt-in form submissions are sent to your
   **"Claude Fable"** Google Sheet via a small Apps Script web app.

A spreadsheet called **"Claude Fable"** has already been created in your
Google Drive with the header row: `Timestamp | Name | Email | Phone`.

To connect the opt-in form to that sheet, you need to deploy the included
Apps Script as a Web App **once**. This is the standard (and only) way for a
static HTML form to write to Google Sheets — it takes about 3 minutes.

## Step 1 — Open the Apps Script editor

1. Open your **"Claude Fable"** Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Delete any code in the editor and paste the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs) from this project.
4. Click the **Save** icon (or press Ctrl/Cmd+S).

## Step 2 — Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Authorize the script when prompted (click **Authorize access**, choose
   your Google account, then **Advanced → Go to ... (unsafe) → Allow** — this
   warning appears because it's your own script).
6. Copy the **Web app URL** shown after deployment. It looks like:
   `https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec`

## Step 3 — Connect the form

1. Open `assets/script.js` in this project.
2. Replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the Web app
   URL you copied:

   ```js
   const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec";
   ```

3. Save the file.

## Step 4 — Test it

1. Open `index.html` in a browser (or host the folder anywhere — it's plain
   HTML/CSS/JS, no build step needed).
2. Fill in the opt-in form and submit.
3. You should be redirected to `thank-you.html`, and a new row with the
   submitted name/email/phone + timestamp should appear in your **Claude
   Fable** Google Sheet.

## Re-deploying after edits

If you ever edit `apps-script/Code.gs` again, go to **Deploy → Manage
deployments → Edit (pencil icon) → New version → Deploy** so the live Web
App URL picks up your changes.

## Project structure

```
index.html          Landing page with opt-in form
thank-you.html       Thank you / confirmation page
assets/style.css     Shared styling for both pages
assets/script.js     Form handling + Google Sheet submission
apps-script/Code.gs  Script to paste into the Google Sheet's Apps Script editor
```
