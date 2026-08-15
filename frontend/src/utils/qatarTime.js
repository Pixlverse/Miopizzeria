// ===========================================================
// Qatar time.
//
// The restaurant is in Doha and every date, opening-hours check and booking
// rule must resolve against *its* clock, not the visitor's device. A guest
// browsing from India (UTC+5:30) or the UK (UTC+1) must see the same "today",
// the same open/closed state and the same bookable slots as someone standing
// outside the door.
//
// Qatar is UTC+3 all year — no daylight saving — so a fixed offset is exact
// and needs no timezone database at runtime.
// ===========================================================

export const QATAR_TZ = "Asia/Qatar";
export const QATAR_UTC_OFFSET_HOURS = 3;

const HOUR_MS = 60 * 60 * 1000;

/**
 * Qatar wall-clock fields for a given instant. Shifting the instant by the
 * offset and then reading the UTC getters yields Doha's calendar/clock values
 * regardless of where the browser is.
 */
export function qatarParts(nowMs = Date.now()) {
  const shifted = new Date(nowMs + QATAR_UTC_OFFSET_HOURS * HOUR_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(), // 0-indexed
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(), // 0 = Sunday
    hours: shifted.getUTCHours(),
    minutes: shifted.getUTCMinutes(),
  };
}

/**
 * Midnight of Qatar's current calendar date, as a plain local Date.
 *
 * Deliberately built with the local constructor: the booking calendar creates
 * its cells the same way (`new Date(y, m, d)`), so both sides describe a
 * calendar date rather than an instant and compare cleanly.
 */
export function qatarToday(nowMs = Date.now()) {
  const { year, month, day } = qatarParts(nowMs);
  return new Date(year, month, day);
}

/** Minutes since midnight in Doha — for comparing against opening hours. */
export function qatarMinutesNow(nowMs = Date.now()) {
  const { hours, minutes } = qatarParts(nowMs);
  return hours * 60 + minutes;
}

/** Qatar's current weekday, 0 = Sunday. */
export function qatarWeekday(nowMs = Date.now()) {
  return qatarParts(nowMs).weekday;
}

/** Formats an instant in Doha time, e.g. for "we'll confirm by ..." copy. */
export function formatQatar(value, options = {}) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", { timeZone: QATAR_TZ, ...options });
}
