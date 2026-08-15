// ===========================================================
// Minimum-notice rules for the booking UI.
//
// Mirrors backend/config/reservations.js (MIN_NOTICE_HOURS,
// QATAR_UTC_OFFSET_HOURS) — keep the two in sync. The API re-checks every
// request against its own clock, so a stale copy here (or a guest with a wrong
// device clock) can only affect what the UI offers, never what gets saved.
// ===========================================================

import { QATAR_UTC_OFFSET_HOURS } from "./qatarTime";

// Same-day requests are the ones that get missed, so a reservation must start
// at least this far ahead of the restaurant's clock.
export const MIN_NOTICE_HOURS = 24;

const HOUR_MS = 60 * 60 * 1000;

/**
 * Absolute instant (epoch ms) at which a slot starts. Reads the calendar
 * fields off `dateObj` rather than its epoch value, because the picker builds
 * dates at local midnight — the guest's timezone must not shift the day.
 */
export function slotInstantMs(dateObj, time) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(time || ""));
  if (!dateObj || !m) return NaN;
  return Date.UTC(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    Number(m[1]) - QATAR_UTC_OFFSET_HOURS,
    Number(m[2]),
  );
}

/** Earliest instant (epoch ms) a reservation may start. */
export function noticeCutoffMs(nowMs = Date.now()) {
  return nowMs + MIN_NOTICE_HOURS * HOUR_MS;
}

export function isSlotTooSoon(dateObj, time, nowMs = Date.now()) {
  const at = slotInstantMs(dateObj, time);
  if (Number.isNaN(at)) return false;
  return at < noticeCutoffMs(nowMs);
}

/** True when no slot on this date clears the notice window. */
export function isDateTooSoon(dateObj, slots, nowMs = Date.now()) {
  return slots.every((t) => isSlotTooSoon(dateObj, t, nowMs));
}
