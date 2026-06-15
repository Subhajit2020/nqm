// ============================================================
// Auto-reschedule the webinar to the NEXT Wednesday at 7:30 PM IST.
// Run by the weekly GitHub Action (.github/workflows/reschedule-webinar.yml)
// and also runnable locally:  node scripts/update-webinar-date.mjs
//
// It only rewrites the MASTERCLASS_DATE line in assets/script.js — every
// visible date on the site is rendered from that constant, so the whole
// page (and the countdown) update automatically.
// ============================================================
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../assets/script.js", import.meta.url);
const IST_OFFSET_MIN = 330; // UTC+05:30
const WEDNESDAY = 3; // 0 = Sunday
const HOUR = 19;
const MINUTE = 30;

// "Now" expressed in IST (GitHub runners are UTC).
const nowIst = new Date(Date.now() + IST_OFFSET_MIN * 60000);

// Days until the upcoming Wednesday (never today — always the next one).
let daysUntilWed = (WEDNESDAY - nowIst.getUTCDay() + 7) % 7;
if (daysUntilWed === 0) daysUntilWed = 7;

const target = new Date(
  Date.UTC(
    nowIst.getUTCFullYear(),
    nowIst.getUTCMonth(),
    nowIst.getUTCDate() + daysUntilWed
  )
);

const pad = (n) => String(n).padStart(2, "0");
const iso =
  `${target.getUTCFullYear()}-${pad(target.getUTCMonth() + 1)}-${pad(
    target.getUTCDate()
  )}T${pad(HOUR)}:${pad(MINUTE)}:00+05:30`;

let src = readFileSync(FILE, "utf8");
const before = src;

src = src.replace(
  /const MASTERCLASS_DATE = new Date\("[^"]*"\);/,
  `const MASTERCLASS_DATE = new Date("${iso}");`
);

if (src === before) {
  console.error("ERROR: MASTERCLASS_DATE line not found — nothing updated.");
  process.exit(1);
}

writeFileSync(FILE, src);
console.log("Webinar rescheduled to:", iso);
