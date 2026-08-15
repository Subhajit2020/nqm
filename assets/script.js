// ============================================================
// CONFIG
// ============================================================
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxMqIHttWbHBi1WrKlxjTaOr878vt0jHTQD3uVcejQiWxnQ4cG4TqOlUQ1ynBiS7mC9Ww/exec";

// Target masterclass date — Saturday, 15th August 2026 at 7:30 PM IST
const MASTERCLASS_DATE = new Date("2026-08-19T19:30:00+05:30");

// ============================================================
// FOOTER YEAR
// ============================================================
document.querySelectorAll("#year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ============================================================
// WEBINAR DATE LABELS (all rendered from MASTERCLASS_DATE)
// Any element with [data-webinar-date] is filled automatically:
//   data-webinar-date="full" -> "Wednesday, 11th March 2026 at 7:30 P.M."
//   data-webinar-date="date" -> "Wednesday, 11th March 2026"
//   data-webinar-date="time" -> "7:30 P.M."
// ============================================================
function formatWebinarDate(part) {
  const TZ = "Asia/Kolkata";
  const d = MASTERCLASS_DATE;
  const get = (opts) => d.toLocaleString("en-US", Object.assign({ timeZone: TZ }, opts));

  const weekday = get({ weekday: "long" });
  const day = parseInt(get({ day: "numeric" }), 10);
  const month = get({ month: "long" });
  const year = get({ year: "numeric" });

  const ord = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  let time = d.toLocaleTimeString("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  time = time.replace("AM", "A.M.").replace("PM", "P.M.");

  const dateStr = weekday + ", " + ord(day) + " " + month + " " + year;
  if (part === "time") return time;
  if (part === "date") return dateStr;
  return dateStr + " at " + time;
}

document.querySelectorAll("[data-webinar-date]").forEach((el) => {
  el.textContent = formatWebinarDate(el.getAttribute("data-webinar-date") || "full");
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
// OPT-IN FORM(S)
// ============================================================
function wireOptinForm(formId, nameId, emailId, phoneId, statusId, submitId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const statusEl = document.getElementById(statusId);
  const submitBtn = document.getElementById(submitId);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById(nameId).value.trim();
    const email = document.getElementById(emailId).value.trim();
    const phone = document.getElementById(phoneId).value.trim();

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

wireOptinForm("popup-optin-form", "popup-name", "popup-email", "popup-phone", "popup-form-status", "popup-submit-btn");

// ============================================================
// CTA POPUP MODAL
// ============================================================
const popupOverlay = document.getElementById("popup-overlay");
const popupClose = document.getElementById("popup-close");

function openPopup() {
  if (popupOverlay) popupOverlay.classList.add("open");
}

function closePopup() {
  if (popupOverlay) popupOverlay.classList.remove("open");
}

document.querySelectorAll(".js-open-popup").forEach((btn) => {
  btn.addEventListener("click", openPopup);
});

if (popupClose) popupClose.addEventListener("click", closePopup);

if (popupOverlay) {
  popupOverlay.addEventListener("click", function (event) {
    if (event.target === popupOverlay) closePopup();
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closePopup();
});

// ============================================================
// LIVE SOCIAL PROOF — viewers count + signup toasts
// ============================================================
(function () {
  // ---- Reveal only once the hero's primary CTA has scrolled out of view,
  // so this never covers the CTA on first landing (esp. on mobile) ----
  const proof = document.querySelector(".social-proof");
  const heroCta = document.querySelector(".hero-primary-cta");
  if (proof) {
    if (heroCta && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            proof.classList.toggle("visible", !entry.isIntersecting);
          });
        },
        { threshold: 0 }
      );
      observer.observe(heroCta);
    } else {
      proof.classList.add("visible");
    }
  }

  // ---- Live viewers count (gently fluctuates) ----
  const countEl = document.getElementById("live-count");
  if (countEl) {
    let viewers = 147;
    setInterval(function () {
      const delta = Math.floor(Math.random() * 7) - 3; // -3..+3
      viewers = Math.min(213, Math.max(118, viewers + delta));
      countEl.textContent = viewers;
    }, 4000);
  }

  // ---- Rotating signup toasts ----
  const toast = document.getElementById("signup-toast");
  const nameEl = document.getElementById("toast-name");
  const cityEl = document.getElementById("toast-city");
  const avatarEl = document.getElementById("toast-avatar");
  if (!toast || !nameEl || !cityEl || !avatarEl) return;

  const names = [
    "Suresh", "Rabi", "Lakshmi", "Venkatesh", "Priya", "Anand",
    "Divya", "Ramesh", "Kavya", "Srinivas", "Meena", "Karthik",
    "Saritha", "Naveen", "Deepa", "Mohan", "Swetha", "Bhaskar",
  ];
  const cities = [
    "Hyderabad", "Khammam", "Chennai", "Bengaluru", "Vijayawada",
    "Coimbatore", "Visakhapatnam", "Madurai", "Warangal", "Kochi",
    "Tirupati", "Mysuru", "Guntur", "Nellore", "Trichy", "Kurnool",
    "Mangaluru", "Rajahmundry",
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function showToast() {
    const name = pick(names);
    const city = pick(cities);
    nameEl.textContent = name;
    cityEl.textContent = city;
    avatarEl.textContent = name.charAt(0);
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 5000);
  }

  // First toast shortly after load, then repeat with a randomized gap
  setTimeout(function loop() {
    showToast();
    const gap = 8000 + Math.random() * 5000; // 8–13s between toasts
    setTimeout(loop, gap);
  }, 3500);
})();
