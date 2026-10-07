import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, RotateCcw, Copy, Check, AlertCircle } from "lucide-react";
import { EXAMPLE_PROMPTS, generatePlan, planToNotes, kindFromPrompt } from "../lib/planner";
import Markdown from "../components/Markdown";
import { cn } from "../utils/cn";

type Status = "idle" | "loading" | "done" | "error";

export default function Planner() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  const run = (p?: string) => {
    const text = (p ?? prompt).trim();
    if (p) setPrompt(p);
    if (text.length < 4) { setError("کانسپت را کمی کامل‌تر بنویسید (حداقل چند کلمه)."); setStatus("error"); return; }
    if (text.length > 600) { setError("متن خیلی طولانی است؛ لطفاً در ۶۰۰ نویسه خلاصه کنید."); setStatus("error"); return; }
    setError(""); setStatus("loading");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        setPlan(generatePlan(text));
        setStatus("done");
        window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      } catch {
        setError("در تولید برنامه مشکلی پیش آمد. دوباره تلاش کنید.");
        setStatus("error");
      }
    }, 900);
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); run(); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(plan.replace(/\*\*/g, "").replace(/^### /gm, "")); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch {}
  };
  const toBooking = () => navigate("/booking", { state: { notes: planToNotes(prompt, plan), service: kindFromPrompt(prompt) } });

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      <header className="mb-7 px-1">
        <p className="eyebrow mb-2"><Sparkles className="h-3.5 w-3.5" /> Shoot Planner</p>
        <h1 className="font-display text-4xl font-extrabold">از ایده تا طرح نور</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted">کانسپت‌تان را بنویسید؛ برنامه‌ریز، طرح نورپردازی، لنز، پالت رنگی، شات‌لیست و مدت پیشنهادی را آماده می‌کند.</p>
      </header>

      <form onSubmit={onSubmit} className="rounded-[28px] border border-line bg-white p-4 shadow-sm sm:p-6">
        <label htmlFor="concept" className="mb-2 block text-sm font-semibold">کانسپت عکاسی</label>
        <textarea
          id="concept"
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); if (status === "error") setStatus("idle"); }}
          rows={4}
          maxLength={600}
          placeholder="مثلاً: پرتره‌ی سینمایی و تیره برای یک نوازنده‌ی ویولن…"
          className={cn("focus-ring w-full resize-y rounded-2xl border bg-paper px-4 py-3 text-sm leading-7 placeholder:text-muted/70", status === "error" ? "border-red-400" : "border-line")}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className={cn("text-xs", status === "error" ? "text-red-600" : "text-muted")}>
            {status === "error" ? <span className="inline-flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{error}</span> : "هرچه جزئیات بیشتر باشد، طرح دقیق‌تر است."}
          </p>
          <span className="text-[11px] text-muted" dir="ltr">{prompt.length}/600</span>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-muted">نمونه‌ها</p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {EXAMPLE_PROMPTS.map((p) => <button type="button" key={p} onClick={() => run(p)} disabled={status === "loading"} className="focus-ring shrink-0 rounded-full border border-line bg-paper px-3.5 py-1.5 text-xs hover:border-ink disabled:opacity-50">{p}</button>)}
          </div>
        </div>
        <button type="submit" disabled={status === "loading"} className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-bold text-paper transition hover:bg-ink-2 disabled:opacity-60">
          {status === "loading" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" /> : <Sparkles className="h-4 w-4" />}
          {status === "loading" ? "در حال تولید طرح…" : "تولید برنامهٔ عکاسی"}
        </button>
      </form>

      {status === "loading" && <div className="mt-8 space-y-3" aria-busy="true"><div className="skeleton h-5 w-40 rounded" /><div className="skeleton h-4 w-full rounded" /><div className="skeleton h-4 w-5/6 rounded" /><div className="skeleton h-4 w-2/3 rounded" /></div>}

      {status === "done" && (
        <div ref={resultRef} className="mt-8 rounded-[28px] border border-line bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-4 flex items-center justify-between border-b border-line pb-4">
            <h2 className="text-lg font-extrabold">برنامهٔ پیشنهادی</h2>
            <div className="flex gap-2">
              <button onClick={copy} className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs">{copied ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "کپی شد" : "کپی"}</button>
              <button onClick={() => run()} className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs"><RotateCcw className="h-3.5 w-3.5" /> دوباره</button>
            </div>
          </div>
          <Markdown source={plan} />
          <div className="mt-7 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-6 text-muted">این طرح به‌صورت خودکار در توضیحات فرم رزرو درج می‌شود.</p>
            <button onClick={toBooking} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-bold text-paper"><ArrowLeft className="h-4 w-4" /> ادامه به رزرو</button>
          </div>
        </div>
      )}
    </div>
  );
}
