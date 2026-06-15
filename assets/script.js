// ============================================================
// CONFIG
// ============================================================
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbywm-sn_ly1VgiMXaY4WE2j6YqE3s3kCxUsS5Puf-JyVD2GocWM7XhLRLO2no136RdLhQ/exec";

// Target masterclass date — Wednesday, 11th March 2026 at 7:30 PM IST
const MASTERCLASS_DATE = new Date("2026-03-11T19:30:00+05:30");

// ============================================================
// FOOTER YEAR
// ============================================================
document.querySelectorAll("#year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ============================================================
// COUNTDOWN TIMERS
// ============================================================
function updateCountdowns() {
  const now = new Date().getTime();
  const distance = MASTERCLASS_DATE.getTime() - now;

  let days, hours, minutes, seconds;
  if (distance <= 0) {
    days = hours = minutes = seconds = 0;
  } else {
    days = Math.floor(distance / (1000 * 60 * 60 * 24));
    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }

  const pad = (n) => String(n).padStart(2, "0");

  document.querySelectorAll("[data-countdown]").forEach((el) => {
    const d = el.querySelector("[data-days]");
    const h = el.querySelector("[data-hours]");
    const m = el.querySelector("[data-minutes]");
    const s = el.querySelector("[data-seconds]");
    if (d) d.textContent = pad(days);
    if (h) h.textContent = pad(hours);
    if (m) m.textContent = pad(minutes);
    if (s) s.textContent = pad(seconds);
  });
}
updateCountdowns();
setInterval(updateCountdowns, 1000);

// ============================================================
// OPT-IN FORM
// ============================================================
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

    submitBtn.disabled = true;
    statusEl.textContent = "Submitting...";
    statusEl.className = "form-status";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);

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
          "Something went wrong. Please try again.";
        statusEl.className = "form-status error";
      });
  });
}
