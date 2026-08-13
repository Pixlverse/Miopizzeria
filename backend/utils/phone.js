// ===========================================================
// Phone normalization.
//
// Guests type numbers however they like — "5555 1234", "+974 5555-1234",
// "00974 55551234". WhatsApp links and the Cloud API both need bare E.164
// digits, so everything funnels through here.
// ===========================================================

// Qatar. Local mobiles/landlines are 8 digits with no trunk prefix.
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || "974";
const LOCAL_NUMBER_LENGTH = 8;

// Returns E.164 digits without a leading "+", or "" if it can't be trusted.
function toE164(input) {
  if (!input) return "";

  let digits = String(input).replace(/[^\d+]/g, "");

  // "00974…" and "+974…" both mean the same thing.
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);

  digits = digits.replace(/\D/g, "");
  if (!digits) return "";

  // A bare local number — assume the restaurant's own country.
  if (digits.length === LOCAL_NUMBER_LENGTH) {
    return `${DEFAULT_COUNTRY_CODE}${digits}`;
  }

  // Shorter than a local number can't be dialled; longer is already
  // international (or a typo we shouldn't silently "fix").
  if (digits.length < LOCAL_NUMBER_LENGTH) return "";

  return digits;
}

// "+97455551234" — for tel: links and display.
function toDialable(input) {
  const e164 = toE164(input);
  return e164 ? `+${e164}` : "";
}

// encodeURIComponent leaves ' ! * ( ) ~ literal, and WhatsApp's link detector
// stops dead at an apostrophe — truncating the link mid-URL. Escape them too.
function encodeStrict(value) {
  return encodeURIComponent(value).replace(
    /[!'()*~]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

// wa.me click-to-chat link with the reply already typed. The sender is
// whichever WhatsApp account is open on the device that taps it, so this
// needs no template approval and no opt-in — it's a human replying.
function waMeLink(phone, message) {
  const e164 = toE164(phone);
  if (!e164) return "";
  return `https://wa.me/${e164}?text=${encodeStrict(message)}`;
}

module.exports = { toE164, toDialable, waMeLink, encodeStrict, DEFAULT_COUNTRY_CODE };
