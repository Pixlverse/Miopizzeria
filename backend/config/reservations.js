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
  isClosedDay,
  dayRange,
  closedDaysLabel,
};
