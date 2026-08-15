// ===========================================================
// Reservation rules — the single source of truth for the API.
//
// NOTE: the booking UI mirrors these in frontend/src/utils/constants.js
// (CLOSED_RESERVATION_DAYS, LUNCH_SLOTS, DINNER_SLOTS). Keep the two in sync.
// ===========================================================

// Days the restaurant takes no reservations. JS getDay(): 0 = Sunday.
// Thursday (4), Friday (5), Saturday (6) — walk-ins only on those days.
// This is separate from opening hours: the restaurant is open, it just
// doesn't hold tables.
const CLOSED_RESERVATION_DAYS = [4, 5, 6];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const LUNCH_SLOTS = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];
const DINNER_SLOTS = [
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];
const ALL_SLOTS = [...LUNCH_SLOTS, ...DINNER_SLOTS];

// A slot is taken unless the request was cancelled — a Pending request still
// holds the table until the restaurant decides.
const BLOCKING_STATUSES = ["Pending", "Confirmed"];

// The booking UI sends a plain calendar date ("2026-08-14"), which parses to
// UTC midnight — so the weekday must be read in UTC too. Using getDay() here
// would resolve against the server's timezone and land on the wrong day
// whenever that server isn't in Qatar.
function isClosedDay(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return false;
  return CLOSED_RESERVATION_DAYS.includes(d.getUTCDay());
}

// Start/end of the given calendar date in UTC — for querying a day's bookings.
function dayRange(date) {
  const d = date instanceof Date ? date : new Date(date);
  const start = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)
  );
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

// ---- Minimum notice ----------------------------------------------------
// Same-day requests are the ones that get missed, so reservations must land at
// least this far ahead of the restaurant's own clock. Guests wanting something
// sooner are pointed at the phone instead.
const MIN_NOTICE_HOURS = Number(process.env.MIN_BOOKING_NOTICE_HOURS || 24);

// Qatar is UTC+3 year-round — no daylight saving — so a fixed offset is safe
// and avoids depending on the server's timezone.
const QATAR_UTC_OFFSET_HOURS = 3;

// The absolute instant a reservation starts. The date arrives as UTC midnight
// of a Qatar calendar day and the time is restaurant-local, so 20:30 on
// 2026-08-19 is 17:30 UTC.
function reservationInstant(date, time) {
  const d = date instanceof Date ? date : new Date(date);
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(time || ""));
  if (Number.isNaN(d.getTime()) || !m) return null;
  return new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      Number(m[1]) - QATAR_UTC_OFFSET_HOURS,
      Number(m[2])
    )
  );
}

// Earliest instant a reservation may start.
function noticeCutoff(now = new Date()) {
  return new Date(now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000);
}

function isTooSoon(date, time, now = new Date()) {
  const at = reservationInstant(date, time);
  // An unparseable date/time is left to the shape validators to report.
  if (!at) return false;
  return at.getTime() < noticeCutoff(now).getTime();
}

// Which of a given date's slots fail the notice rule.
function tooSoonSlots(date, now = new Date()) {
  return ALL_SLOTS.filter((t) => isTooSoon(date, t, now));
}

// "Thursday, Friday and Saturday"
function closedDaysLabel() {
  const names = CLOSED_RESERVATION_DAYS.map((d) => DAY_NAMES[d]);
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

module.exports = {
  CLOSED_RESERVATION_DAYS,
  DAY_NAMES,
  LUNCH_SLOTS,
  DINNER_SLOTS,
  ALL_SLOTS,
  BLOCKING_STATUSES,
  MIN_NOTICE_HOURS,
  QATAR_UTC_OFFSET_HOURS,
  isClosedDay,
  dayRange,
  closedDaysLabel,
  reservationInstant,
  noticeCutoff,
  isTooSoon,
  tooSoonSlots,
};
