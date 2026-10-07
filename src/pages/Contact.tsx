import { useState } from "react";
import { Phone, Mail, Globe, MapPin, Copy, Check, Navigation } from "lucide-react";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "../components/BrandIcons";
import { BRAND, MAPS_LINK, OSM_EMBED, toFa } from "../data/brand";

const CHANNELS = [
  { label: "تلفن", value: BRAND.phoneDisplay, href: \`tel:\${BRAND.phoneIntl}\`, Icon: Phone, external: false, ltr: false },
  { label: "ایمیل", value: BRAND.email, href: \`mailto:\${BRAND.email}\`, Icon: Mail, external: false, ltr: true },
  { label: "واتس‌اپ", value: "wa.link/pcjlml", href: BRAND.whatsapp, Icon: WhatsAppIcon, external: true, ltr: true },
  { label: "تلگرام", value: "@uplabstudio", href: BRAND.telegram, Icon: TelegramIcon, external: true, ltr: true },
  { label: "اینستاگرام", value: "@uplabstudio", href: BRAND.instagram, Icon: InstagramIcon, external: true, ltr: true },
  { label: "وب‌سایت", value: "upstudio.ct.ws", href: BRAND.website, Icon: Globe, external: true, ltr: true },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("نشانی را کپی کنید:", BRAND.address);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      <header className="mb-7 px-1">
        <p className="eyebrow mb-2">Contact</p>
        <h1 className="font-display text-4xl font-extrabold">با ما در ارتباط باشید</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted">برای رزرو، استعلام قیمت یا مشاورهٔ پروژه، از هر کانالی که راحت‌ترید پیام بدهید.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {CHANNELS.map(({ label, value, href, Icon, external, ltr }) => (
              <a key={label} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="focus-ring flex items-center gap-3 rounded-3xl border border-line bg-white p-3 transition hover:border-gold active:scale-[0.99]">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper-2 text-gold"><Icon className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block text-[11px] text-muted">{label}</span>
                  <span className="block truncate text-xs font-bold" dir={ltr ? "ltr" : undefined}>{value}</span>
                </span>
              </a>
            ))}
          </div>
          <div className="rounded-3xl border border-line bg-white p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div className="min-w-0">
                <p className="text-xs text-muted">نشانی</p>
                <p className="mt-1 text-sm leading-7">{BRAND.address}</p>
                <p className="mt-2 text-[11px] text-muted" dir="ltr">{toFa(BRAND.coords.lat)}, {toFa(BRAND.coords.lng)}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3 text-xs font-bold text-paper"><Navigation className="h-4 w-4" /> مسیریابی</a>
              <button onClick={copyAddress} className="focus-ring flex items-center gap-2 rounded-full border border-line px-4 text-xs">{copied ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />} {copied ? "کپی شد" : "کپی آدرس"}</button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-line bg-paper-2">
          {mapFailed ? (
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="focus-ring flex min-h-[360px] flex-col items-center justify-center gap-3 text-muted">
              <MapPin className="h-8 w-8 text-gold" /><span className="text-sm">نقشه بارگذاری نشد — باز کردن در Google Maps</span>
            </a>
          ) : (
            <iframe title="موقعیت آپ استودیو روی نقشه" src={OSM_EMBED} className="h-[360px] w-full border-0 lg:h-full lg:min-h-[520px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" onError={() => setMapFailed(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
