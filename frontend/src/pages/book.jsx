import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiUsers,
  FiClock,
  FiUser,
  FiPhone,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import Layout from "@/components/Layout";
import HeroBackdrop from "@/components/HeroBackdrop";
import SectionBackdrop from "@/components/SectionBackdrop";
import api from "@/utils/api";
import { useSettings } from "@/hooks/useSettings";

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const toMin = (hhmm) => {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// Live open/closed status for the given day's hours, vs. the current time.
function hoursStatus(dh) {
  if (!dh) return null;
  if (dh.closed) return { state: "closed", label: "Closed today" };
  const open = toMin(dh.open);
  const close = toMin(dh.close);
  if (open == null || close == null) return null;

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const closeAdj = close <= open ? close + 1440 : close; // handle past-midnight close
  const nowAdj = nowMin < open && close <= open ? nowMin + 1440 : nowMin;

  if (nowAdj < open || nowAdj >= closeAdj) {
    return { state: "closed", label: `Closed · Opens ${dh.open}` };
  }
  if (closeAdj - nowAdj <= 60) {
    return { state: "soon", label: `Closes soon · ${dh.close}` };
  }
  return { state: "open", label: `Open now · until ${dh.close}` };
}

const STATUS_TONE = {
  open: { dot: "bg-green-400", pill: "bg-green-400/15 ring-green-300/30 text-green-50" },
  soon: { dot: "bg-amber-400", pill: "bg-amber-400/15 ring-amber-300/30 text-amber-50" },
  closed: { dot: "bg-red-400", pill: "bg-white/10 ring-white/15 text-cream/80" },
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const LUNCH = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];
const DINNER = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

const STEPS = [
  { id: 0, label: "Date", Icon: FiCalendar },
  { id: 1, label: "Guests", Icon: FiUsers },
  { id: 2, label: "Time", Icon: FiClock },
  { id: 3, label: "Details", Icon: FiUser },
];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmtDate(d) {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BookPage() {
  const today = useMemo(startOfToday, []);
  const settings = useSettings();
  const todayHours = settings?.hours?.[DAY_KEYS[today.getDay()]];
  const status = hoursStatus(todayHours);
  const [step, setStep] = useState(0);
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [date, setDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [guestsTouched, setGuestsTouched] = useState(false);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [terms, setTerms] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Calendar grid for the viewed month.
  const cells = useMemo(() => {
    const firstDay = new Date(view.y, view.m, 1).getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const arr = Array.from({ length: firstDay }, () => null);
    for (let d = 1; d <= daysInMonth; d += 1) arr.push(new Date(view.y, view.m, d));
    return arr;
  }, [view]);

  const canPrevMonth =
    view.y > today.getFullYear() ||
    (view.y === today.getFullYear() && view.m > today.getMonth());

  const shiftMonth = (dir) => {
    setView((v) => {
      const m = v.m + dir;
      if (m < 0) return { y: v.y - 1, m: 11 };
      if (m > 11) return { y: v.y + 1, m: 0 };
      return { ...v, m };
    });
  };

  const chooseGuests = (v) => {
    setGuests(v);
    setGuestsTouched(true);
  };

  const next = () => {
    if (step === 1) setGuestsTouched(true);
    setStep((s) => Math.min(3, s + 1));
  };

  const phoneValid = /^[+\d][\d\s-]{6,}$/.test(phone);
  const canContinue =
    (step === 0 && date) ||
    step === 1 ||
    (step === 2 && time) ||
    (step === 3 && name.trim() && phoneValid && terms);

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await api.post("/bookings", {
        name: name.trim(),
        phone: phone.trim(),
        date: date.toISOString(),
        time,
        guests,
      });
      setDone(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't send your request. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Book a Table">
      {/* Hero header — shared backdrop, no icon/line patterns */}
      <section className="relative overflow-hidden pb-24 pt-28 md:pb-28 md:pt-36">
        <HeroBackdrop />

        <div className="section relative z-10 text-center">
          <p className="font-display text-xl italic text-cream/80">Reservations</p>
          <h1 className="mt-2 text-5xl font-bold text-white md:text-6xl">Book a Table</h1>
          <p className="mt-4 text-lg leading-relaxed text-cream/85">
            A few taps and your table is set
          </p>
            {status && (
              <p
                className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ${
                  STATUS_TONE[status.state].pill
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  {status.state !== "closed" && (
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${STATUS_TONE[status.state].dot}`}
                    />
                  )}
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${STATUS_TONE[status.state].dot}`} />
                </span>
                {status.label}
              </p>
            )}
          </div>

        {/* Curved transition into the light content */}
        <svg
          className="absolute bottom-0 left-0 z-10 w-full"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,90 C360,10 1080,10 1440,90 Z" fill="#FDF5ED" />
        </svg>
      </section>

      {/* Booking — calendar / stepper below the hero */}
      <section className="relative overflow-hidden pb-20 pt-8">
        <SectionBackdrop />
        <div className="section relative z-10">
          {done ? (
            <SuccessCard
              date={date}
              guests={guests}
              time={time}
              name={name}
              onReset={() => {
                setDone(false);
                setStep(0);
                setDate(null);
                setTime("");
                setName("");
                setPhone("");
                setTerms(false);
                setGuests(2);
                setGuestsTouched(false);
                setError("");
              }}
            />
          ) : (
            <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_360px]">
              {/* Interactive stepper */}
              <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
                <Stepper step={step} setStep={setStep} date={date} time={time} />

                <div className="mt-8 min-h-[320px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25 }}
                    >
                      {step === 0 && (
                        <DateStep
                          view={view}
                          cells={cells}
                          date={date}
                          today={today}
                          canPrevMonth={canPrevMonth}
                          onShift={shiftMonth}
                          onPick={setDate}
                        />
                      )}
                      {step === 1 && <GuestStep guests={guests} setGuests={chooseGuests} />}
                      {step === 2 && <TimeStep time={time} setTime={setTime} />}
                      {step === 3 && (
                        <DetailsStep
                          name={name}
                          setName={setName}
                          phone={phone}
                          setPhone={setPhone}
                          phoneValid={phoneValid}
                          terms={terms}
                          setTerms={setTerms}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Nav */}
                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wide text-rust transition-colors hover:bg-rust/10 disabled:invisible"
                  >
                    Back
                  </button>
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={next}
                      disabled={!canContinue}
                      className="rounded-full bg-rust px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all hover:bg-rust-dark disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!canContinue || submitting}
                      className="rounded-full bg-rust px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all hover:bg-rust-dark disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {submitting ? "Sending…" : "Confirm Booking"}
                    </button>
                  )}
                </div>

                {error && (
                  <p className="mt-4 text-center text-sm font-semibold text-red-600">{error}</p>
                )}
              </div>

              {/* Live reservation ticket */}
              <Ticket
                date={date}
                guests={guests}
                guestsTouched={guestsTouched}
                time={time}
                name={name}
                phone={phone}
              />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

/* ---------- Sub-components ---------- */

function Stepper({ step, setStep, date, time }) {
  const reachable = (id) =>
    id === 0 ||
    (id === 1 && date) ||
    (id === 2 && date) ||
    (id === 3 && date && time);
  return (
    <div className="flex items-center justify-between">
      {STEPS.map((s, i) => {
        const active = step === s.id;
        const complete = step > s.id;
        return (
          <div key={s.id} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => reachable(s.id) && setStep(s.id)}
              disabled={!reachable(s.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-full border-2 transition-colors ${
                  active
                    ? "border-rust bg-rust text-white"
                    : complete
                      ? "border-rust bg-rust/10 text-rust"
                      : "border-rust/25 bg-white text-rust/40"
                }`}
              >
                {complete ? <FiCheck size={18} /> : <s.Icon size={18} />}
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wide ${
                  active || complete ? "text-rust" : "text-muted"
                }`}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-2 mb-5 h-0.5 flex-1 rounded-full transition-colors ${
                  step > s.id ? "bg-rust" : "bg-rust/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function DateStep({ view, cells, date, today, canPrevMonth, onShift, onPick }) {
  const sameDay = (a, b) =>
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  return (
    <div className="rounded-2xl bg-gradient-to-br from-rust/[0.07] via-rust/[0.03] to-transparent p-4 ring-1 ring-rust/10">
      {/* Month header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canPrevMonth && onShift(-1)}
          disabled={!canPrevMonth}
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-rust shadow-sm ring-1 ring-rust/10 transition-all hover:bg-rust hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-rust"
          aria-label="Previous month"
        >
          <FiChevronLeft />
        </button>
        <p className="text-lg font-bold tracking-tight text-ink">
          {MONTHS[view.m]} {view.y}
        </p>
        <button
          type="button"
          onClick={() => onShift(1)}
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-rust shadow-sm ring-1 ring-rust/10 transition-all hover:bg-rust hover:text-white"
          aria-label="Next month"
        >
          <FiChevronRight />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="py-1 text-xs font-bold uppercase text-rust/60">
            {w}
          </span>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const past = d < today;
          const selected = sameDay(d, date);
          const isToday = sameDay(d, today);
          return (
            <div key={d.toISOString()} className="flex aspect-square items-center justify-center">
              <button
                type="button"
                disabled={past}
                onClick={() => onPick(d)}
                className={`relative grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition-all duration-200 ${
                  selected
                    ? "scale-105 bg-gradient-to-br from-rust to-rust-dark text-white shadow-lg shadow-rust/30"
                    : past
                      ? "cursor-not-allowed text-muted/30"
                      : "text-ink hover:scale-110 hover:bg-rust/10 hover:text-rust active:scale-95"
                } ${isToday && !selected ? "font-bold text-rust ring-2 ring-rust/40" : ""}`}
              >
                {d.getDate()}
                {isToday && !selected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-rust" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuestStep({ guests, setGuests }) {
  const clamp = (n) => Math.min(20, Math.max(1, n));
  return (
    <div className="flex flex-col items-center">
      <p className="text-center text-muted">How many guests are joining?</p>

      <div className="mt-8 flex items-center gap-8">
        <button
          type="button"
          onClick={() => setGuests((g) => clamp(g - 1))}
          className="grid h-14 w-14 place-items-center rounded-full border-2 border-rust text-rust transition-colors hover:bg-rust hover:text-white"
          aria-label="Fewer guests"
        >
          <FiMinus size={22} />
        </button>
        <div className="w-24 text-center">
          <span className="font-display text-6xl font-bold text-rust">{guests}</span>
          <p className="text-sm font-semibold text-muted">{guests === 1 ? "guest" : "guests"}</p>
        </div>
        <button
          type="button"
          onClick={() => setGuests((g) => clamp(g + 1))}
          className="grid h-14 w-14 place-items-center rounded-full border-2 border-rust text-rust transition-colors hover:bg-rust hover:text-white"
          aria-label="More guests"
        >
          <FiPlus size={22} />
        </button>
      </div>

      {/* Visual people row */}
      <div className="mt-8 flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: Math.min(guests, 12) }).map((_, i) => (
          <FiUser key={i} className="text-rust" size={20} />
        ))}
        {guests > 12 && <span className="text-sm font-bold text-rust">+{guests - 12}</span>}
      </div>

      {/* Quick picks */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {[2, 4, 6, 8].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setGuests(n)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
              guests === n
                ? "border-rust bg-rust text-white"
                : "border-rust/30 text-rust hover:bg-rust/10"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setGuests(20)}
          className="rounded-full border border-rust/30 px-5 py-2 text-sm font-semibold text-rust hover:bg-rust/10"
        >
          Large party
        </button>
      </div>
    </div>
  );
}

function Slot({ value, time, setTime }) {
  const active = time === value;
  return (
    <button
      type="button"
      onClick={() => setTime(value)}
      className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
        active
          ? "border-rust bg-rust text-white shadow-md"
          : "border-rust/25 bg-white text-ink hover:border-rust hover:bg-rust/5"
      }`}
    >
      {value}
    </button>
  );
}

function TimeStep({ time, setTime }) {
  return (
    <div>
      <p className="text-center text-muted">Pick a time that suits you.</p>

      <p className="mt-6 mb-2 text-sm font-bold uppercase tracking-wide text-rust-light">Lunch</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {LUNCH.map((v) => (
          <Slot key={v} value={v} time={time} setTime={setTime} />
        ))}
      </div>

      <p className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide text-rust-light">Dinner</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {DINNER.map((v) => (
          <Slot key={v} value={v} time={time} setTime={setTime} />
        ))}
      </div>
    </div>
  );
}

function DetailsStep({ name, setName, phone, setPhone, phoneValid, terms, setTerms }) {
  const field =
    "w-full rounded-xl border border-rust/20 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-rust focus:ring-2 focus:ring-rust/20";
  return (
    <div className="mx-auto max-w-md">
      <p className="text-center text-muted">Almost there — who's the table for?</p>
      <label className="mt-6 block text-sm font-semibold text-ink">Full name</label>
      <input
        className={`mt-1 ${field}`}
        placeholder="e.g. Ahmed Al-Sayed"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="mt-4 block text-sm font-semibold text-ink">Phone number</label>
      <input
        type="tel"
        className={`mt-1 ${field}`}
        placeholder="+974 …"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {phone && !phoneValid && (
        <p className="mt-1 text-sm text-red-600">Please enter a valid phone number.</p>
      )}

      {/* Consent */}
      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-rust"
        />
        <span className="text-sm font-semibold text-ink">
          I accept the general terms and conditions.
        </span>
      </label>
      <details className="mt-3 rounded-xl bg-rust/5 px-4 py-3 text-sm text-muted">
        <summary className="cursor-pointer font-semibold text-rust">
          How we use your data
        </summary>
        <p className="mt-2 leading-relaxed">
          The restaurant where you are making a booking or click-and-collect request processes your
          personal data to manage and follow up on your booking and the responses to it, including
          any messages sent to you by email or SMS (such as confirmations and updates). This may be
          done in collaboration with Mio Pizzeria, which provides tools for managing bookings and
          orders. The restaurant may also use your data to manage your relationship overall and to
          send updates or promotional messages by phone, email or SMS. You have the right to
          access, correct, delete or transfer your data, and to limit or object to how it's used —
          including objecting to direct marketing at any time without giving a reason. Where your
          data is used based on consent, you may withdraw that consent at any time. For more
          details, please refer to our privacy policy or contact the restaurant directly.
        </p>
      </details>

      <p className="mt-4 rounded-xl bg-rust/5 px-4 py-3 text-center text-sm text-muted">
        We'll confirm your reservation over WhatsApp.
      </p>
    </div>
  );
}

function Ticket({ date, guests, guestsTouched, time, name, phone }) {
  // Only rows with real, user-chosen data — the ticket builds up as you go.
  const rows = [
    date && { key: "date", Icon: FiCalendar, label: "Date", value: fmtDate(date) },
    guestsTouched && {
      key: "guests",
      Icon: FiUsers,
      label: "Guests",
      value: `${guests} ${guests === 1 ? "guest" : "guests"}`,
    },
    time && { key: "time", Icon: FiClock, label: "Time", value: time },
    name.trim() && { key: "name", Icon: FiUser, label: "Name", value: name.trim() },
    phone.trim() && { key: "phone", Icon: FiPhone, label: "Phone", value: phone.trim() },
  ].filter(Boolean);

  return (
    <aside className="h-fit lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-rust/10">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rust to-rust-dark p-6">
          <p className="font-display text-lg italic text-cream/80">Your reservation</p>
          <p className="text-2xl font-bold text-white">Mio Pizzeria</p>
        </div>

        {/* Perforation */}
        <div className="relative h-4 bg-white">
          <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-cream/40 ring-1 ring-rust/10" />
          <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-cream/40 ring-1 ring-rust/10" />
          <span className="absolute inset-x-5 top-1/2 border-t border-dashed border-rust/20" />
        </div>

        {/* Body */}
        <div className="p-6 pt-2">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-rust/10 text-rust">
                <FiCalendar size={24} />
              </span>
              <p className="mt-4 font-semibold text-ink">Nothing selected yet</p>
              <p className="mt-1 text-sm text-muted">
                Pick a date, party size and time — your summary appears here.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              <AnimatePresence initial={false}>
                {rows.map((r) => (
                  <motion.li
                    key={r.key}
                    layout
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3 py-2"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rust/10 text-rust">
                      <r.Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted">{r.label}</p>
                      <p className="truncate font-semibold text-ink">{r.value}</p>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

function SuccessCard({ date, guests, time, name, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md rounded-3xl bg-white/90 p-8 text-center shadow-card backdrop-blur"
    >
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rust/15 text-rust">
        <FiCheck size={34} />
      </span>
      <h2 className="mt-5 text-2xl font-bold text-ink">Request received!</h2>
      <p className="mt-2 text-muted">
        Thanks{name ? `, ${name.split(" ")[0]}` : ""} — we've saved your reservation request.
        Our team will confirm your table for {guests} {guests === 1 ? "guest" : "guests"} on{" "}
        {date ? fmtDate(date) : ""} at {time} shortly.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-full border border-rust px-7 py-3 text-sm font-bold uppercase tracking-wide text-rust transition-colors hover:bg-rust hover:text-white"
      >
        Make another booking
      </button>
    </motion.div>
  );
}
