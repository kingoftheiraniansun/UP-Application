import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Send, ExternalLink, Trash2, Sparkles } from "lucide-react";
import { localAssistant, SUGGESTIONS, type Reply } from "../lib/assistant";
import { LogoMark } from "../components/Logo";
import { cn } from "../utils/cn";

interface Msg {
  id: number;
  role: "user" | "bot";
  text: string;
  actions?: Reply["actions"];
}

const WELCOME: Msg = {
  id: 0,
  role: "bot",
  text: "سلام! من دستیار آپ استودیو هستم. دربارهٔ رزرو، قیمت، تجهیزات، آدرس یا نوع عکاسی بپرسید.",
};

const STORAGE = "upstudio_chat";

export default function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE);
      return raw ? (JSON.parse(raw) as Msg[]) : [WELCOME];
    } catch {
      return [WELCOME];
    }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const idRef = useRef(Date.now());

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    try { sessionStorage.setItem(STORAGE, JSON.stringify(msgs.slice(-40))); } catch {}
  }, [msgs, typing]);

  const send = (textRaw?: string) => {
    const text = (textRaw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    const userMsg: Msg = { id: ++idRef.current, role: "user", text };
    setMsgs((m) => [...m, userMsg]);
    setTyping(true);
    const delay = Math.min(1400, 500 + text.length * 12);
    const timer = window.setTimeout(() => {
      let reply: Reply;
      try { reply = localAssistant(text); } catch { reply = { text: "در پردازش پیام مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا از واتس‌اپ پیام دهید." }; }
      setMsgs((m) => [...m, { id: ++idRef.current, role: "bot", text: reply.text, actions: reply.actions }]);
      setTyping(false);
    }, delay);
    window.setTimeout(() => { window.clearTimeout(timer); setTyping((t) => t); }, 6000);
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); send(); };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };
  const reset = () => {
    setMsgs([WELCOME]);
    try { sessionStorage.removeItem(STORAGE); } catch {}
  };

  return (
    <div className="mx-auto max-w-3xl px-0 pb-4 sm:px-5 md:pt-8">
      <div className="flex min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-paper-2"><Sparkles className="h-5 w-5 text-gold" /></span>
            <div>
              <p className="text-sm font-bold">دستیار آپ استودیو</p>
              <p className="text-[11px] text-muted">راهنمای آفلاین · همیشه در دسترس</p>
            </div>
          </div>
          <button onClick={reset} className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-paper-2 hover:text-ink" aria-label="پاک کردن گفتگو"><Trash2 className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-paper/50 px-4 py-6 sm:px-6" role="log" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-start flex-row-reverse" : "justify-start")}>
              <div className={cn(
                "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7",
                m.role === "user" ? "rounded-tl-md bg-ink text-paper" : "rounded-tr-md border border-line bg-white text-ink",
              )}>
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.actions.map((a) => a.to ? (
                      <Link key={a.label} to={a.to} className="focus-ring rounded-full border border-gold/60 bg-gold/10 px-3 py-1.5 text-xs font-semibold">{a.label}</Link>
                    ) : (
                      <a key={a.label} href={a.href} target={a.href?.startsWith("tel:") ? undefined : "_blank"} rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gold/10 px-3 py-1.5 text-xs font-semibold">{a.label} <ExternalLink className="h-3 w-3" /></a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex">
              <div className="flex items-center gap-1 rounded-2xl rounded-tr-md border border-line bg-white px-4 py-3">
                <span className="dot h-2 w-2 rounded-full bg-muted" /><span className="dot h-2 w-2 rounded-full bg-muted" /><span className="dot h-2 w-2 rounded-full bg-muted" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-line px-4 py-3 sm:px-6">
          {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} disabled={typing} className="focus-ring shrink-0 rounded-full border border-line bg-paper px-3.5 py-1.5 text-xs text-ink-2 hover:border-ink disabled:opacity-50">{s}</button>)}
        </div>

        <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-line bg-white px-4 py-3 sm:px-6">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px"; }}
            onKeyDown={onKey}
            rows={1}
            placeholder="پیام خود را بنویسید…"
            aria-label="پیام"
            className="focus-ring max-h-[140px] flex-1 resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-sm leading-6 placeholder:text-muted/70"
          />
          <button type="submit" disabled={!input.trim() || typing} className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper disabled:opacity-40" aria-label="ارسال"><Send className="h-4 w-4 -scale-x-100" /></button>
        </form>
      </div>
    </div>
  );
}
