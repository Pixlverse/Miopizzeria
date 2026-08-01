import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiSend, FiCheck } from "react-icons/fi";
import api from "@/utils/api";
import { useI18n } from "@/context/LocaleContext";

const inputClass =
  "w-full rounded-xl border border-rust/20 bg-white/90 px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-rust focus:ring-2 focus:ring-rust/20";

export default function PartyOrderForm() {
  const { t } = useI18n();
  const types = t("events.types");
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    // Only send fields that carry a value; guests as a number when present.
    const payload = {
      name: data.name.trim(),
      phone: data.phone.trim(),
    };
    if (data.date) payload.date = data.date;
    if (data.guests) payload.guests = Number(data.guests);
    if (data.type) payload.type = data.type;
    if (data.message) payload.message = data.message;

    try {
      await api.post("/party-orders", payload);
      setSent(true);
      reset();
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Couldn't send your request. Please check your connection and try again.",
      );
    }
  };

  if (sent) {
    return (
      <div className="rounded-3xl bg-white/85 p-8 text-center shadow-card backdrop-blur md:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rust/15 text-rust">
          <FiCheck size={34} />
        </span>
        <h3 className="mt-5 text-2xl font-bold text-ink">Request received!</h3>
        <p className="mt-2 text-muted">
          Thanks — we've saved your party-order request. Our team will reach out to confirm the
          details shortly.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 rounded-full border border-rust px-7 py-3 text-sm font-bold uppercase tracking-wide text-rust transition-colors hover:bg-rust hover:text-white"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/85 p-7 shadow-card backdrop-blur md:p-9">
      <h3 className="text-2xl font-bold text-ink">{t("events.form.title")}</h3>
      <p className="mt-2 text-muted">
        Fill this in and our team will get back to you to confirm the details.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input
              className={inputClass}
              placeholder={t("events.form.name")}
              aria-label={t("events.form.name")}
              {...register("name", { required: t("events.form.errRequired") })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <input
              type="tel"
              className={inputClass}
              placeholder={t("events.form.phone")}
              aria-label={t("events.form.phone")}
              {...register("phone", {
                required: t("events.form.errRequired"),
                pattern: { value: /^[+\d][\d\s-]{6,}$/, message: t("events.form.errPhone") },
              })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="date"
            className={inputClass}
            aria-label={t("events.form.date")}
            {...register("date")}
          />
          <input
            type="number"
            min="1"
            className={inputClass}
            placeholder={t("events.form.guests")}
            aria-label={t("events.form.guests")}
            {...register("guests")}
          />
        </div>

        <select className={inputClass} aria-label={t("events.form.type")} {...register("type")}>
          <option value="">{t("events.form.type")}</option>
          {(Array.isArray(types) ? types : []).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <textarea
          rows={3}
          className={inputClass}
          placeholder={t("events.form.message")}
          aria-label={t("events.form.message")}
          {...register("message")}
        />

        {serverError && <p className="text-sm font-semibold text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-rust py-3.5 text-base font-bold text-white transition-colors hover:bg-rust-dark disabled:opacity-60"
        >
          <FiSend size={18} />
          {isSubmitting ? "Sending…" : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
