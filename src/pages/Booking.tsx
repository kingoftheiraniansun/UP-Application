import { useMemo, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { Check, Copy, AlertCircle, RotateCcw, Sparkles } from "lucide-react";
import { WhatsAppIcon, TelegramIcon } from "../components/BrandIcons";
import { BRAND, DURATIONS, EQUIPMENT, SERVICES, TIME_SLOTS, toEn, toFa } from "../data/brand";
import { cn } from "../utils/cn";

interface Form {
  name: string;
  phone: string;
  date: string;
  time: string;
  duration: string;
  service: string;
  equipment: string[];
  notes: string;
}

const empty: Form = { name: "", phone: "", date: "", time: "", duration: "", service: "", equipment: [], notes: "" };
const label = "mb-1.5 block text-sm font-semibold text-ink";
const input = "focus-ring w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-sm text-ink placeholder:text-muted/70 transition focus:border-ink";
const errorCls = "border-red-400 bg-red-50";

export default function Booking() {
  const location = useLocation();
  const prefill = (location.state as { notes?: string; service?: string } | null) ?? null;
  const [form, setForm] = useState<Form>({ ...empty, notes: prefill?.notes ?? "", service: prefill?.service ?? "" });
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (form.name.trim().length < 2) e.name = "نام را کامل وارد کنید.";
    const phone = toEn(form.phone).replace(/[\s-]/g, "");
    if (!/^(\+98|0098|0)?9\d{9}$/.test(phone)) e.phone = "شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲…).";
    if (!form.date) e.date = "تاریخ را انتخاب کنید.";
    else if (new Date(form.date) < new Date(new Date().toDateString())) e.date = "تاریخ نمی‌تواند در گذشته باشد.";
    if (!form.time) e.time = "ساعت را انتخاب کنید.";
    if (!form.duration) e.duration = "مدت را انتخاب کنید.";
    if (!form.service) e.service = "نوع خدمات را انتخاب کنید.";
    return e;
  }, [form]);

  const valid = Object.keys(errors).length === 0;

  const message = useMemo(() => {
    const service = SERVICES.find((s) => s.id === form.service)?.title ?? "—";
    const dateFa = form.date
      ? new Date(form.date + "T12:00:00").toLocaleDateString("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      : "—";
    return [
      "سلام، درخواست رزرو آپ استودیو:",
      `👤 نام: ${form.name.trim()}`,
      `📱 شماره: ${toFa(toEn(form.phone))}`,
      `📅 تاریخ: ${dateFa}`,
      `⏰ ساعت: ${form.time || "—"}`,
      `⏳ مدت: ${form.duration || "—"}`,
      `📷 خدمات: ${service}`,
      `💡 تجهیزات: ${form.equipment.length ? form.equipment.join("، ") : "—"}`,
      form.notes.trim() ? `📝 توضیحات: ${form.notes.trim()}` : null,
    ].filter(Boolean).join("\n");
  }, [form]);

  const waUrl = `https://wa.me/${BRAND.phoneIntl.replace("+", "")}?text=${encodeURIComponent(message)}`;
  const tgUrl = `${BRAND.telegram}?text=${encodeURIComponent(message)}`;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) {
      document.querySelector<HTMLElement>("[data-error='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = message;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } finally { ta.remove(); }
    }
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const err = (k: keyof Form) => touched && errors[k];

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 md:pt-16">
        <div className="rounded-[28px] border border-line bg-white p-6 text-center shadow-sm sm:p-8">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15"><Check className="h-8 w-8 text-gold" /></span>
          <h1 className="mt-6 text-2xl font-extrabold">درخواست شما آماده است</h1>
          <p className="mt-3 text-sm leading-7 text-muted">برای نهایی‌شدن رزرو، پیام زیر را از طریق واتس‌اپ یا تلگرام برای استودیو ارسال کنید.</p>
          <pre className="mt-6 whitespace-pre-wrap rounded-2xl bg-paper p-4 text-right text-sm leading-7 text-ink-2" dir="rtl">{message}</pre>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-paper"><WhatsAppIcon className="h-5 w-5" /> ارسال در واتس‌اپ</a>
            <a href={tgUrl} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-ink px-6 py-3.5 text-sm font-bold"><TelegramIcon className="h-5 w-5" /> ارسال در تلگرام</a>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
            <button onClick={copy} className="focus-ring inline-flex items-center gap-1.5 text-ink-2 hover:text-ink">{copied ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />} {copied ? "کپی شد" : "کپی متن"}</button>
            <button onClick={() => { setDone(false); setTouched(false); setForm(empty); }} className="focus-ring inline-flex items-center gap-1.5 text-muted hover:text-ink"><RotateCcw className="h-4 w-4" /> درخواست جدید</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      <header className="mb-7 px-1">
        <p className="eyebrow mb-2">Booking</p>
        <h1 className="font-display text-4xl font-extrabold">رزرو استودیو</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted">فرم را تکمیل کنید؛ پیام رزرو آماده می‌شود و با یک لمس به واتس‌اپ استودیو می‌روید.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} noValidate className="space-y-5">
          {touched && !valid && (
            <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> لطفاً فیلدهای مشخص‌شده را تکمیل کنید.</div>
          )}

          <div className="rounded-[28px] border border-line bg-white p-4 sm:p-6">
            <h2 className="text-base font-bold">اطلاعات تماس و زمان</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div data-error={!!err("name")}>
                <label htmlFor="name" className={label}>نام <span className="text-gold">*</span></label>
                <input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} className={cn(input, err("name") && errorCls)} placeholder="نام و نام خانوادگی" autoComplete="name" aria-invalid={!!err("name")} />
                {err("name") && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div data-error={!!err("phone")}>
                <label htmlFor="phone" className={label}>شماره تماس <span className="text-gold">*</span></label>
                <input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={cn(input, err("phone") && errorCls)} placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰" inputMode="tel" autoComplete="tel" dir="ltr" aria-invalid={!!err("phone")} />
                {err("phone") && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div data-error={!!err("date")}>
                <label htmlFor="date" className={label}>تاریخ <span className="text-gold">*</span></label>
                <input id="date" type="date" value={form.date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => set("date", e.target.value)} className={cn(input, err("date") && errorCls)} dir="ltr" />
                {err("date") && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
              </div>
              <div data-error={!!err("time")}>
                <span className={label}>زمان <span className="text-gold">*</span></span>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((t) => <button type="button" key={t} onClick={() => set("time", t)} className={cn("focus-ring rounded-full border px-3.5 py-2 text-sm transition", form.time === t ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink", err("time") && !form.time && "border-red-300")}>{t}</button>)}
                </div>
                {err("time") && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-line bg-white p-4 sm:p-6">
            <h2 className="text-base font-bold">نوع پروژه و مدت</h2>
            <div className="mt-5">
              <span className={label}>مدت <span className="text-gold">*</span></span>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => <button type="button" key={d} onClick={() => set("duration", d)} className={cn("focus-ring rounded-full border px-4 py-2 text-sm transition", form.duration === d ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink")}>{d}</button>)}
              </div>
              {err("duration") && <p className="mt-1 text-xs text-red-600">{errors.duration}</p>}
            </div>
            <div data-error={!!err("service")} className="mt-6">
              <span className={label}>نوع خدمات <span className="text-gold">*</span></span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SERVICES.map((s) => <button type="button" key={s.id} onClick={() => set("service", s.id)} className={cn("focus-ring rounded-2xl border p-4 text-right text-sm font-semibold transition", form.service === s.id ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink")}>{s.title}</button>)}
              </div>
              {err("service") && <p className="mt-1 text-xs text-red-600">{errors.service}</p>}
            </div>
          </div>

          <div className="rounded-[28px] border border-line bg-white p-4 sm:p-6">
            <h2 className="text-base font-bold">تجهیزات و توضیحات</h2>
            <div className="mt-5">
              <span className={label}>تجهیزات <span className="text-xs font-normal text-muted">(اختیاری)</span></span>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT.map((eq) => {
                  const on = form.equipment.includes(eq);
                  return <button type="button" key={eq} aria-pressed={on} onClick={() => set("equipment", on ? form.equipment.filter((x) => x !== eq) : [...form.equipment, eq])} className={cn("focus-ring inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition", on ? "border-gold bg-gold/10" : "border-line bg-paper hover:border-ink")}>{on && <Check className="h-3.5 w-3.5 text-gold" />}{eq}</button>;
                })}
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="notes" className={label}>توضیحات</label>
              <textarea id="notes" rows={4} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={cn(input, "resize-y")} placeholder="کانسپت، تعداد نفرات، نیاز به گریمور یا هر نکتهٔ دیگر…" />
            </div>
          </div>

          <button type="submit" className="focus-ring w-full rounded-full bg-ink py-4 text-sm font-bold text-paper transition hover:bg-ink-2 sm:w-auto sm:px-10">ساخت پیام رزرو</button>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[28px] border border-line bg-white p-5">
            <p className="text-xs font-bold text-muted">پیش‌نمایش پیام</p>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-7 text-ink-2" dir="rtl">{message}</pre>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-xs text-muted">
              <button type="button" onClick={copy} className="focus-ring inline-flex items-center gap-1.5 hover:text-ink">{copied ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "کپی شد" : "کپی"}</button>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-1.5 hover:text-ink"><WhatsAppIcon className="h-3.5 w-3.5" /> واتس‌اپ</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
