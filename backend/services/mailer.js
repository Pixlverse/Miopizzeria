// ===========================================================
// Email sender.
//
// Transport is chosen with EMAIL_PROVIDER:
//   smtp     — real delivery through any SMTP host (Gmail, Zoho, SendGrid, …)
//   ethereal — local testing: nodemailer captures the mail and prints a
//              preview URL instead of delivering it. No credentials needed.
//   log      — no network call, just prints the email to the console
//   off      — disabled entirely
//
// Never throws: a failed notification must not break a guest's booking.
// ===========================================================

const nodemailer = require("nodemailer");

const PROVIDER = (process.env.EMAIL_PROVIDER || "log").toLowerCase();

// Where alerts land. Comma-separate to notify several inboxes.
const RECIPIENTS = (process.env.EMAIL_NOTIFY_TO || "adarshspillai2001@gmail.com")
  .split(",")
  .map((a) => a.trim())
  .filter(Boolean);

const FROM = process.env.EMAIL_FROM || "Mio Pizzeria <no-reply@miopizzeria.qa>";

let transportPromise = null;

async function buildTransport() {
  if (PROVIDER === "ethereal") {
    // Creates a throwaway inbox on the fly; mail is captured, not delivered.
    const account = await nodemailer.createTestAccount();
    console.log(`[mail] ethereal test inbox: ${account.user}`);
    return nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass },
    });
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST / SMTP_USER / SMTP_PASS not set");
  }
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host,
    port,
    // 465 is implicit TLS; 587 upgrades via STARTTLS.
    secure: port === 465,
    auth: { user, pass },
  });
}

// Cached across calls so we don't reconnect (or mint a new Ethereal inbox)
// on every booking. A failed setup is not cached — the next call retries.
function getTransport() {
  if (!transportPromise) {
    transportPromise = buildTransport().catch((err) => {
      transportPromise = null;
      throw err;
    });
  }
  return transportPromise;
}

// Sends one email to every configured recipient (single message, all in To:).
// Resolves to { ok, ... }; rejects never.
async function sendMail({ subject, text, html }) {
  if (PROVIDER === "off") return { ok: false, skipped: "provider off" };
  if (!RECIPIENTS.length) {
    console.warn("[mail] no EMAIL_NOTIFY_TO configured — skipping");
    return { ok: false, skipped: "no recipients" };
  }

  if (PROVIDER === "log") {
    console.log(
      `\n[mail:log] → ${RECIPIENTS.join(", ")}\nSubject: ${subject}\n\n${text}\n`
    );
    return { ok: true, id: "logged", recipients: RECIPIENTS };
  }

  try {
    const transport = await getTransport();
    const info = await transport.sendMail({
      from: FROM,
      to: RECIPIENTS.join(", "),
      subject,
      text,
      html,
    });

    const preview = nodemailer.getTestMessageUrl(info);
    console.log(
      `[mail] sent to ${RECIPIENTS.join(", ")} (${PROVIDER}, id=${info.messageId})` +
        (preview ? `\n[mail] preview: ${preview}` : "")
    );
    return {
      ok: true,
      id: info.messageId,
      recipients: RECIPIENTS,
      previewUrl: preview || undefined,
    };
  } catch (err) {
    console.error(`[mail] FAILED: ${err.message}`);
    return { ok: false, error: err.message, recipients: RECIPIENTS };
  }
}

module.exports = { sendMail, PROVIDER, RECIPIENTS, FROM };
