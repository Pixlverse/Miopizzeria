# Miopizzeria Qatar

Premium restaurant website (MERN stack). Next.js 14 frontend + Express/MongoDB backend.

## Structure

```
MIOpizzeria/
├── frontend/   # Next.js 14 (pages router), Tailwind, GSAP, Framer Motion
└── backend/    # Express, Mongoose, JWT auth
```

## Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

Design tokens live in `tailwind.config.js` + `src/styles/variables.css`.
Brand palette: rust `#AB4C35`, cream `#FEDCBD`, neutral `#DCDDDE`.

Until the API is wired in, pages render from mock data in `src/utils/constants.js`.

## Backend

```bash
cd backend
cp .env.example .env      # then fill in MONGODB_URI, JWT_SECRET, etc.
npm install
npm run seed              # creates first admin + sample menu items
npm run dev               # http://localhost:5000
```

Requires a running MongoDB (local or MongoDB Atlas).

### API

| Method | Endpoint              | Auth  |
| ------ | --------------------- | ----- |
| POST   | /api/auth/login       | —     |
| POST   | /api/auth/refresh     | —     |
| GET    | /api/menu-items       | —     |
| GET    | /api/menu-items/:id   | —     |
| POST   | /api/menu-items       | admin |
| PUT    | /api/menu-items/:id   | admin |
| DELETE | /api/menu-items/:id   | admin |
| GET    | /api/categories       | —     |
| GET    | /api/settings         | —     |
| PUT    | /api/settings         | admin |
| POST   | /api/bookings         | —     |
| GET    | /api/bookings/rules   | —     |
| GET    | /api/bookings/availability?date=YYYY-MM-DD | — |
| POST   | /api/party-orders     | —     |
| GET    | /api/notifications/status | admin |
| POST   | /api/notifications/test   | admin |

### Reservation rules

Everything time-related resolves against **Doha (UTC+3, no DST)**, never the
visitor's device — a guest browsing from another timezone sees the same "today",
the same open/closed state and the same bookable slots as someone at the door.
Frontend helpers live in `frontend/src/utils/qatarTime.js`; the backend uses a
fixed offset in `backend/config/reservations.js`.

- **Minimum 24 hours' notice** (`MIN_BOOKING_NOTICE_HOURS`). Same-day requests are
  the ones that get missed, so the calendar greys out any date with no slot far
  enough ahead, individual slots inside the window are disabled with a
  "Needs 24h notice" tooltip, and both the date step and a fully-blocked time step
  offer a **direct call link** instead of a dead end. `GET /availability` returns a
  `tooSoon` list computed from the *server's* clock, so a wrong device clock can
  only affect what the UI offers — never what gets saved.
- **No reservations on Thursday, Friday or Saturday** — walk-ins only. Defined in
  `backend/config/reservations.js` and mirrored in `frontend/src/utils/constants.js`
  (`CLOSED_RESERVATION_DAYS`); **keep the two in sync**. The API enforces it, so a
  stale copy in the UI can't create an invalid booking.
- **One table per time slot.** A slot counts as taken while a request is Pending or
  Confirmed; cancelling frees it. The booking UI greys out taken slots via
  `GET /api/bookings/availability`, and `POST /api/bookings` re-checks on submit,
  returning `409 { code: "SLOT_TAKEN" }` if someone got there first.
- Guests send a plain calendar date (`2026-08-19`), not an instant — a timestamp of
  local midnight shifts a day across timezones.

### Alerts

Every new reservation and party order is saved, then pushed to the restaurant over
**WhatsApp and email**. Both are fire-and-forget and independently switchable, so an
outage in either never fails a guest's request.

Each alert carries three actions — **Confirm**, **Decline**, **Call**. Confirm and
Decline are `wa.me` click-to-chat links that open a chat with the *guest* with the
reply already typed; the owner just presses send. Because a human sends it from the
restaurant's own WhatsApp, this needs **no approved template and no guest opt-in**.
Guest phone numbers are normalised to E.164 first (`backend/utils/phone.js`, bare
8-digit numbers assumed `+974`), and the alert says so explicitly when a number is
too malformed to build a link from.

#### WhatsApp

- `WHATSAPP_PROVIDER` — `log` (default; prints to console), `meta`, `twilio`, `off`
- `WHATSAPP_NOTIFY_TO` — the restaurant's number, digits only (`97460064003`)

For production use **meta** with a permanent System User token and an approved
**Utility** template whose body is a single `{{1}}` (`WHATSAPP_TEMPLATE_NAME`) —
free-form text only reaches a number that messaged the business in the last 24h.
The API sender must be a *dedicated* number, never the restaurant's public one:
registering a number to the Cloud API removes it from the WhatsApp app.

#### Email

Configure in `backend/.env` (see `.env.example`):

- `EMAIL_PROVIDER` — `ethereal` (local testing), `smtp` (real delivery), `log`, or `off`
- `EMAIL_NOTIFY_TO` — recipient inbox(es), comma-separated
- `ADMIN_URL` — optional; adds an "Open admin panel" button to the email

**Ethereal** (default locally): no credentials needed. Nodemailer captures the
mail and prints a `preview:` URL to the server console — open it to see exactly
what would have been delivered. Nothing reaches a real inbox.

**SMTP** (real delivery): set `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`
and `EMAIL_PROVIDER=smtp`. For Gmail use `smtp.gmail.com`, port `587`, and a
16-character **App Password** (Google Account → Security → 2-Step Verification →
App passwords) — a normal account password will be rejected.

Verify the wiring any time with `POST /api/notifications/test` (admin auth).

## Status

- [x] Project scaffold (frontend + backend)
- [x] Design system (colors, fonts, Tailwind config, animations)
- [x] Home page (hero w/ parallax, featured menu, delivery, testimonials, location, footer)
- [x] Backend API + models + JWT auth + seed
- [ ] Menu page with category filtering (live data)
- [ ] Item details page (slice-joining animation)
- [ ] Contact form
- [ ] Admin panel (login, dashboard, CRUD)
- [ ] Cloudinary image uploads
- [ ] Deployment config
```
