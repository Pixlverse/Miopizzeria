// ===========================================================
// Builds the alert for each event and pushes it to every enabled channel
// (WhatsApp + email — each self-disables via its own *_PROVIDER setting).
//
// The alert carries three actions: Confirm, Decline, Call. Confirm/Decline are
// wa.me click-to-chat links that open a chat with the *guest*, reply already
// typed, sent from whichever WhatsApp account is on the device that taps it —
// i.e. the restaurant's own number. Because a human sends it, this needs no
// approved template and no guest opt-in.
//
// Every helper is fire-and-forget: call without awaiting so the guest's
// request returns immediately, and an outage stays invisible to them.
// ===========================================================

const { sendMail } = require("./mailer");
const { sendWhatsApp } = require("./whatsapp");
const { toDialable, waMeLink } = require("../utils/phone");

const TZ = process.env.NOTIFY_TIMEZONE || "Asia/Qatar";
const BRAND = process.env.BRAND_NAME || "Mio Pizzeria";
const ADMIN_URL = process.env.ADMIN_URL || "";

// -----------------------------------------------------------
// Formatting
// -----------------------------------------------------------

// "Sat, 9 Aug 2026". Dates arrive as UTC midnight and Qatar is UTC+3, so
// formatting in restaurant time never rolls back to the previous day.
function formatDate(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value); // party orders store free text
  return d.toLocaleDateString("en-GB", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// "Wed, 19 Aug" — no year; guest-facing messages are always near-term.
function formatDateShort(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  // en-GB renders this as "Wed 19 Aug"; compose it to keep the comma.
  const weekday = d.toLocaleDateString("en-GB", { timeZone: TZ, weekday: "short" });
  const rest = d.toLocaleDateString("en-GB", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
  });
  return `${weekday}, ${rest}`;
}

// Clock faces at half-hour resolution, starting at 12:00.
const CLOCK_FACES = [
  "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠",
  "🕕", "🕡", "🕖", "🕢", "🕗", "🕣", "🕘", "🕤", "🕙", "🕥", "🕚", "🕦",
];

// "20:30" -> { label: "8:30 PM", face: "🕣" }
function formatTime(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ""));
  if (!m) return { label: String(hhmm || ""), face: "🕐" };
  const h24 = Number(m[1]);
  const mins = Number(m[2]);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const idx = ((h12 % 12) * 2 + (mins >= 30 ? 1 : 0)) % 24;
  return {
    label: `${h12}:${String(mins).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`,
    face: CLOCK_FACES[idx],
  };
}

// Party orders store the date as free text ("Sept 12, evening"). Peel a
// trailing word-only fragment off as the time of day; anything containing a
// digit stays part of the date, so "12 Sept, 2026" isn't mangled.
function splitPartyWhen(raw) {
  const s = String(raw || "").trim();
  if (!s) return { date: "", when: "" };
  const i = s.lastIndexOf(",");
  if (i > 0) {
    const tail = s.slice(i + 1).trim();
    if (tail && !/\d/.test(tail)) {
      return {
        date: s.slice(0, i).trim(),
        when: tail.charAt(0).toUpperCase() + tail.slice(1),
      };
    }
  }
  return { date: s, when: "" };
}

const guestCount = (n) => `${n} ${Number(n) === 1 ? "guest" : "guests"}`;

// Shared letterhead for guest-facing messages.
const head = (title) => `🍕 ${BRAND.toUpperCase()}\n\n${title}`;

function formatReceivedAt(date) {
  return (date instanceof Date ? date : new Date()).toLocaleString("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// Drops empty detail lines so the alert stays tight. Each line is
// { icon, label, value }: WhatsApp shows "icon value", email shows
// "label | value" in its table.
function present(lines) {
  return lines.filter(
    ({ value }) =>
      value !== undefined && value !== null && value !== "" && !Number.isNaN(value)
  );
}

// -----------------------------------------------------------
// Guest reply templates — pre-filled into the restaurant's chat
// -----------------------------------------------------------

// Kept deliberately short: every character is URL-encoded into the wa.me link,
// and a long link is both unreadable in the alert and more likely to be
// mangled by WhatsApp's link detector. Apostrophes are avoided for the same
// reason (encodeStrict handles them, but shorter is still better).
const replies = {
  bookingConfirmed: (b) => {
    const t = formatTime(b.time);
    return [
      head("You’re booked! 🎉"),
      `Hi ${b.name} — your table for ${b.guests} is confirmed.`,
      `📅 ${formatDateShort(b.date)}\n${t.face} ${t.label}`,
      "Your table is waiting. See you soon!",
    ].join("\n\n");
  },

  bookingDeclined: (b) => {
    const t = formatTime(b.time);
    return [
      head("We couldn’t confirm your table"),
      `Hi ${b.name}, we’re fully booked at ${t.label} on ${formatDateShort(
        b.date
      )} for ${guestCount(b.guests)}.`,
      "But we’d still love to have you! ❤️",
      "Would another time work?",
    ].join("\n\n");
  },

  partyConfirmed: (o) => {
    const { date, when } = splitPartyWhen(o.date);
    const details = [
      date && `📅 ${date}`,
      when && `🕖 ${when}`,
      o.guests && `👥 ${guestCount(o.guests)}`,
    ].filter(Boolean);
    return [
      head("Event Request Confirmed ✓"),
      `Hi ${o.name}, we can host your event!`,
      ...(details.length ? [details.join("\n")] : []),
      "We’re ready to plan the details with you.",
    ].join("\n\n");
  },

  partyDeclined: (o) => {
    const { date } = splitPartyWhen(o.date);
    return [
      head("Date unavailable"),
      `Hi ${o.name}, unfortunately, ${
        date || "that date"
      } is already booked for events.`,
      "We’d still love to host your celebration. ❤️",
      "Would another date work?",
    ].join("\n\n");
  },
};

// Confirm / Decline / Call for a given guest record.
function buildActions(doc, confirmText, declineText) {
  const dial = toDialable(doc.phone);
  return [
    { key: "confirm", icon: "✅", label: "Confirm", url: waMeLink(doc.phone, confirmText) },
    { key: "decline", icon: "❌", label: "Decline", url: waMeLink(doc.phone, declineText) },
    // WhatsApp auto-links a bare international number, so this stays tappable
    // in the alert without needing a tel: URL (which WhatsApp won't linkify).
    { key: "call", icon: "📞", label: "Call", url: dial ? `tel:${dial}` : "", display: dial },
  ].filter((a) => a.url);
}

// -----------------------------------------------------------
// Renderers
// -----------------------------------------------------------

function renderWhatsApp({ title, subtitle, lines, status, actions, receivedAt, unreachable }) {
  const details = present(lines)
    .map(({ icon, value }) => `${icon} ${value}`)
    .join("\n");

  const blocks = [`*${title}*`, subtitle, details];
  if (status) blocks.push(`Status: ${status}`);

  if (actions.length) {
    const choices = actions
      .map((a) =>
        a.key === "call"
          ? `${a.icon} ${a.label}: ${a.display}`
          : `${a.icon} ${a.label}:\n${a.url}`
      )
      .join("\n\n");
    blocks.push("────────────", `*What would you like to do?*\n\n${choices}`);
  } else if (unreachable) {
    blocks.push("⚠️ Couldn't build a reply link — the phone number looks incomplete.");
  }

  blocks.push(`_Received ${receivedAt}_`);
  return blocks.filter(Boolean).join("\n\n");
}

function renderEmailText({ title, lines, status, actions, receivedAt }) {
  const body = present(lines)
    .map(({ label, value }) => `${label}: ${value}`)
    .concat(status ? [`Status: ${status}`] : [])
    .join("\n");
  const links = actions
    .map((a) => (a.key === "call" ? `${a.label}: ${a.display}` : `${a.label}: ${a.url}`))
    .join("\n");
  return (
    `${title}\n${"-".repeat(title.length)}\n\n${body}\n\n` +
    (links ? `Reply to the guest:\n${links}\n\n` : "") +
    `Received ${receivedAt}` +
    (ADMIN_URL ? `\nAdmin panel: ${ADMIN_URL}` : "") +
    `\n`
  );
}

const ACTION_COLOURS = { confirm: "#1F6F5C", decline: "#B4472E", call: "#4A4038" };

function renderEmailHtml({ title, accent, lines, status, actions, receivedAt }) {
  const cells = present(lines)
    .concat(status ? [{ icon: "", label: "Status", value: status }] : [])
    .map(
      ({ label, value }) => `
          <tr>
            <td style="padding:10px 16px;border-bottom:1px solid #f0ece6;color:#8a8178;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(
              label
            )}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #f0ece6;color:#241f1b;font-size:15px;font-weight:600;">${escapeHtml(
              value
            )}</td>
          </tr>`
    )
    .join("");

  const buttons = actions
    .map(
      (a) => `<a href="${escapeHtml(a.url)}" style="display:inline-block;background:${
        ACTION_COLOURS[a.key]
      };color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:6px;
         font-size:14px;font-weight:600;margin:0 8px 8px 0;">${a.icon} ${escapeHtml(
           a.label
         )}</a>`
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f6f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">
      <tr>
        <td style="background:${accent};padding:20px 24px;">
          <div style="color:rgba(255,255,255,.75);font-size:12px;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(
            BRAND
          )}</div>
          <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:4px;">${escapeHtml(
            title
          )}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 8px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${cells}</table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px 28px;">
          ${
            buttons
              ? `<p style="margin:0 0 12px;color:#8a8178;font-size:13px;font-weight:600;">Reply to the guest</p>${buttons}`
              : ""
          }
          ${
            ADMIN_URL
              ? `<p style="margin:16px 0 0;"><a href="${escapeHtml(
                  ADMIN_URL
                )}" style="color:${accent};font-size:13px;">Open admin panel →</a></p>`
              : ""
          }
          <p style="margin:16px 0 0;color:#a89f95;font-size:12px;">Received ${escapeHtml(
            receivedAt
          )} · automated alert from the ${escapeHtml(BRAND)} website.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// -----------------------------------------------------------
// Events
// -----------------------------------------------------------

function bookingAlert(booking) {
  const actions = buildActions(
    booking,
    replies.bookingConfirmed(booking),
    replies.bookingDeclined(booking)
  );
  const t = formatTime(booking.time);
  return {
    title: "🍕 New Reservation Request",
    subtitle: "A new booking is waiting for your response.",
    accent: "#B4472E",
    subject: `🍕 New reservation — ${booking.name}, ${guestCount(
      booking.guests
    )} on ${formatDate(booking.date)} at ${t.label}`,
    lines: [
      { icon: "👤", label: "Name", value: booking.name },
      { icon: "📞", label: "Phone", value: toDialable(booking.phone) || booking.phone },
      { icon: "📅", label: "Date", value: formatDate(booking.date) },
      { icon: t.face, label: "Time", value: t.label },
      { icon: "👥", label: "Guests", value: guestCount(booking.guests) },
    ],
    status: booking.status || "Pending",
    actions,
    unreachable: !actions.some((a) => a.key === "confirm"),
    receivedAt: formatReceivedAt(booking.createdAt),
  };
}

function partyOrderAlert(order) {
  const actions = buildActions(
    order,
    replies.partyConfirmed(order),
    replies.partyDeclined(order)
  );
  const { date, when } = splitPartyWhen(order.date);
  return {
    title: "🎉 New Party Order Request",
    subtitle: "A new event enquiry is waiting for your response.",
    accent: "#1F6F5C",
    subject: `🎉 New party order — ${order.name}${
      order.guests ? `, ${guestCount(order.guests)}` : ""
    }${order.date ? ` (${order.date})` : ""}`,
    lines: [
      { icon: "👤", label: "Name", value: order.name },
      { icon: "📞", label: "Phone", value: toDialable(order.phone) || order.phone },
      { icon: "📅", label: "Date", value: date },
      { icon: "🕖", label: "When", value: when },
      { icon: "👥", label: "Guests", value: order.guests && guestCount(order.guests) },
      { icon: "🎈", label: "Type", value: order.type },
      { icon: "💬", label: "Message", value: order.message },
    ],
    status: order.status || "Pending",
    actions,
    unreachable: !actions.some((a) => a.key === "confirm"),
    receivedAt: formatReceivedAt(order.createdAt),
  };
}

// Dispatches one alert to every channel. Each channel swallows its own errors,
// so one being misconfigured never stops the other.
function dispatch(alert, label) {
  return Promise.all([
    sendWhatsApp(renderWhatsApp(alert)).catch((err) =>
      console.error(`[notify] ${label} whatsapp failed:`, err.message)
    ),
    sendMail({
      subject: alert.subject,
      text: renderEmailText(alert),
      html: renderEmailHtml(alert),
    }).catch((err) => console.error(`[notify] ${label} email failed:`, err.message)),
  ]);
}

function push(build, doc, label) {
  try {
    return dispatch(build(doc), label);
  } catch (err) {
    console.error(`[notify] ${label} alert failed to build:`, err.message);
    return Promise.resolve();
  }
}

exports.notifyNewBooking = (booking) => push(bookingAlert, booking, "booking");
exports.notifyNewPartyOrder = (order) => push(partyOrderAlert, order, "party-order");

// Used by the admin test endpoint.
exports.sendTestMessage = () => {
  const receivedAt = formatReceivedAt(new Date());
  const alert = {
    title: `✅ ${BRAND} — test alert`,
    accent: "#2F6FB4",
    subject: `✅ ${BRAND} — test notification`,
    subtitle: "Notification channels are reachable.",
    lines: [{ icon: "✅", label: "Check", value: "Notification channels reachable" }],
    actions: [],
    receivedAt,
  };
  return dispatch(alert, "test");
};

// Exported for tests/preview.
exports._render = { renderWhatsApp, bookingAlert, partyOrderAlert };
