import { useState } from "react";
import { Phone, Mail, Globe, MapPin, Copy, Check, Navigation } from "lucide-react";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "../components/BrandIcons";
import { BRAND, MAPS_LINK, OSM_EMBED, toFa } from "../data/brand";

const CHANNELS = [
  { label: "تلفن", value: BRAND.phoneDisplay, href: `tel:${BRAND.phoneIntl}`, Icon: Phone, external: false, ltr: false },
  { label: "ایمیل", value: BRAND.email, href: `mailto:${BRAND.email}`, Icon: Mail, external: false, ltr: true },
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
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 md:pt-16">
      <header className="mb-8 md:mb-12">
        <p className="eyebrow mb-2">تماس</p>
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">در تماس باشیم</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted md:text-base">
          برای رزرو، استعلام قیمت یا مشاورهٔ پروژه، از هر کانالی که راحت‌ترید پیام بدهید.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {CHANNELS.map(({ label, value, href, Icon, external, ltr }) => (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="focus-ring flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition hover:border-gold hover:shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{label}</span>
                    <span className="block truncate text-sm font-bold" dir={ltr ? "ltr" : undefined} style={ltr ? { textAlign: "right" } : undefined}>
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">نشانی</p>
                <p className="mt-1 text-sm leading-7">{BRAND.address}</p>
                <p className="mt-2 text-xs text-muted" dir="ltr" style={{ textAlign: "right" }}>
                  {toFa(BRAND.coords.lat)}, {toFa(BRAND.coords.lng)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-paper hover:bg-ink-2">
                <Navigation className="h-3.5 w-3.5" /> مسیریابی
              </a>
              <button onClick={copyAddress} className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-xs font-semibold hover:border-ink">
                {copied ? <Check className="h-3.5 w-3.5 text-gold" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "کپی شد" : "کپی نشانی"}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-paper-2">
          {mapFailed ? (
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="focus-ring flex h-full min-h-[360px] flex-col items-center justify-center gap-3 text-muted">
              <MapPin className="h-8 w-8 text-gold" />
              <span className="text-sm">نقشه بارگذاری نشد — باز کردن در Google Maps</span>
            </a>
          ) : (
            <iframe
              title="موقعیت آپ استودیو روی نقشه"
              src={OSM_EMBED}
              className="h-[360px] w-full border-0 lg:h-full lg:min-h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onError={() => setMapFailed(true)}
              style={{ filter: "saturate(0.6) contrast(1.05)" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
