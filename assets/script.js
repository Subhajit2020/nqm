// ============================================================
// CONFIGURATION
// Paste the Web App URL you get after deploying the Apps Script
// (see apps-script/Code.gs and SETUP.md) between the quotes below.
// ============================================================
const GOOGLE_SHEET_WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// Footer year on every page
document.querySelectorAll("#year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const form = document.getElementById("optin-form");

if (form) {
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !email) {
      statusEl.textContent = "Please fill in your name and email.";
      statusEl.className = "form-status error";
      return;
    }

    if (GOOGLE_SHEET_WEB_APP_URL.indexOf("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") !== -1) {
      statusEl.textContent =
        "Setup needed: add your Google Apps Script Web App URL in assets/script.js (see SETUP.md).";
      statusEl.className = "form-status error";
      return;
    }

    submitBtn.disabled = true;
    statusEl.textContent = "Submitting...";
    statusEl.className = "form-status";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);

    // Apps Script Web Apps don't return CORS headers for fetch responses,
    // so we send the request in "no-cors" mode and treat the absence of a
    // network error as success.
    fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })
      .then(function () {
        statusEl.textContent = "Success! Redirecting...";
        statusEl.className = "form-status success";
        window.location.href = "thank-you.html";
      })
      .catch(function () {
        submitBtn.disabled = false;
        statusEl.textContent =
          "Something went wrong submitting your registration. Please try again.";
        statusEl.className = "form-status error";
      });
  });
}
