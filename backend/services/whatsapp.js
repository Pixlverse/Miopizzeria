// ===========================================================
// WhatsApp sender.
//
// Provider-agnostic: pick one with WHATSAPP_PROVIDER.
//   meta   — WhatsApp Cloud API (official; production)
//   twilio — Twilio WhatsApp (has a sandbox, easiest to test with)
//   log    — no network call, just prints the message (default)
//   off    — disabled entirely
//
// Never throws: a failed notification must not break a guest's booking.
// ===========================================================

const { toE164 } = require("../utils/phone");

const PROVIDER = (process.env.WHATSAPP_PROVIDER || "log").toLowerCase();

// The restaurant's own WhatsApp — where alerts land. Comma-separate for several.
const RECIPIENTS = (process.env.WHATSAPP_NOTIFY_TO || "97460064003")
  .split(",")
  .map((n) => toE164(n))
  .filter(Boolean);

const TIMEOUT_MS = 8000;

// -----------------------------------------------------------
// Meta WhatsApp Cloud API
// -----------------------------------------------------------
async function sendViaMeta(to, text) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error("WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID not set");
  }
  const version = process.env.WHATSAPP_API_VERSION || "v21.0";
  const template = process.env.WHATSAPP_TEMPLATE_NAME;

  // Free-form text only reaches a number that messaged the business within the
  // last 24h. Outside that window Meta requires an approved template, so set
  // WHATSAPP_TEMPLATE_NAME to a template whose body is a single {{1}}.
  // Template params reject newlines/tabs — flatten them.
  const body = template
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: text.replace(/\s*\n\s*/g, " · ") }],
            },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to,
        type: "text",
        // Keep link previews off — the alert carries several wa.me links and a
        // preview card for one of them just adds noise.
        text: { preview_url: false, body: text },
      };

  const res = await fetch(
    `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Meta ${res.status}: ${data?.error?.message || JSON.stringify(data)}`
    );
  }
  return data?.messages?.[0]?.id || "sent";
}

// -----------------------------------------------------------
// Twilio WhatsApp
// -----------------------------------------------------------
async function sendViaTwilio(to, text) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  // Sandbox sender is +14155238886.
  const from = toE164(process.env.TWILIO_WHATSAPP_FROM);
  if (!sid || !authToken || !from) {
    throw new Error(
      "TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM not set"
    );
  }

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${sid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: `whatsapp:+${from}`,
        To: `whatsapp:+${to}`,
        Body: text,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Twilio ${res.status}: ${data?.message || JSON.stringify(data)}`);
  }
  return data?.sid || "sent";
}

// -----------------------------------------------------------
// Public API
// -----------------------------------------------------------

// Sends `text` to every configured recipient. Resolves to a per-recipient
// result array; rejects never — errors come back as { ok: false, error }.
async function sendWhatsApp(text) {
  if (PROVIDER === "off") return [];
  if (!RECIPIENTS.length) {
    console.warn("[whatsapp] no WHATSAPP_NOTIFY_TO configured — skipping");
    return [];
  }

  if (PROVIDER === "log") {
    RECIPIENTS.forEach((to) => console.log(`\n[whatsapp:log] → +${to}\n${text}\n`));
    return RECIPIENTS.map((to) => ({ to, ok: true, id: "logged" }));
  }

  const send = PROVIDER === "twilio" ? sendViaTwilio : sendViaMeta;

  return Promise.all(
    RECIPIENTS.map(async (to) => {
      try {
        const id = await send(to, text);
        console.log(`[whatsapp] sent to +${to} (${PROVIDER}, id=${id})`);
        return { to, ok: true, id };
      } catch (err) {
        console.error(`[whatsapp] FAILED for +${to}: ${err.message}`);
        return { to, ok: false, error: err.message };
      }
    })
  );
}

module.exports = { sendWhatsApp, PROVIDER, RECIPIENTS };
