import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Globe, MapPin } from "lucide-react";
import { InstagramIcon as Instagram, WhatsAppIcon as MessageCircle, TelegramIcon as Send } from "../components/BrandIcons";
import { BRAND, SERVICES, MAPS_LINK } from "../data/brand";
import { GALLERY } from "../data/gallery";
import { ASSETS } from "../data/assets";
import SmartImage from "../components/SmartImage";
import { useGalleryAvailability } from "../hooks/useGalleryAvailability";

export default function Home() {
  const available = useGalleryAvailability();
  // Only render assets confirmed to resolve (prevents layout collapse when originals are absent)
  const featured = GALLERY.filter((g) => available[g.id] === true).slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <img
          src={ASSETS.heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-top opacity-70"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 sm:px-8 md:min-h-[80vh] md:pb-20">
          <span className="fade-up mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-paper/20 px-3 py-1 text-[11px] text-paper/70">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span dir="ltr" className="tracking-[0.25em]">UP STUDIO</span>
            <span aria-hidden="true">·</span>
            <span>تهران</span>
          </span>
          <h1 className="font-display fade-up fade-up-1 max-w-3xl text-5xl font-extrabold sm:text-6xl md:text-7xl">
            {BRAND.tagline}
          </h1>
          <p className="fade-up fade-up-2 mt-5 max-w-xl text-base leading-8 text-paper/75 sm:text-lg">{BRAND.subtitle}</p>
          <div className="fade-up fade-up-3 mt-9 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-bold text-ink transition hover:bg-gold-2"
            >
              رزرو استودیو
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              to="/gallery"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/30 px-7 py-3.5 text-sm font-semibold text-paper backdrop-blur transition hover:bg-paper/10"
            >
              نمونه‌کارها
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-2">خدمات</p>
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">چهار زبان تصویری، یک استودیو</h2>
          </div>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Link
              key={s.id}
              to={`/gallery?cat=${s.id}`}
              className="focus-ring group bg-paper p-7 transition-colors hover:bg-paper-2"
            >
              <span className="text-xs text-muted" dir="ltr">0{i + 1}</span>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{s.desc}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-gold opacity-0 transition group-hover:opacity-100">
                مشاهده نمونه‌ها <ArrowLeft className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      {featured.length > 0 && (
        <section className="bg-ink py-16 text-paper md:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-2">منتخب آثار</p>
                <h2 className="font-display text-3xl font-extrabold md:text-4xl">قاب‌هایی از استودیو</h2>
              </div>
              <Link to="/gallery" className="focus-ring hidden items-center gap-2 text-sm text-paper/70 hover:text-paper sm:inline-flex">
                همهٔ گالری <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {featured.map((g, i) => (
                <Link
                  key={g.id}
                  to={`/gallery?img=${g.id}`}
                  className={`focus-ring group relative overflow-hidden rounded-lg ${i === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-2" : ""}`}
                  aria-label={g.title}
                >
                  <SmartImage
                    src={g.thumb}
                    fallbacks={[g.src, g.fallback]}
                    alt={g.alt}
                    loading="lazy"
                    wrapperClassName={i === 0 ? "aspect-[4/5] md:h-full" : "aspect-[4/5]"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                    <p className="text-sm font-bold">{g.title}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/gallery" className="focus-ring mt-8 inline-flex items-center gap-2 text-sm text-paper/70 sm:hidden">
              همهٔ گالری <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* STUDIO INTRO */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="eyebrow mb-2">دربارهٔ استودیو</p>
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">فضایی آرام برای تصویرهایی که می‌مانند</h2>
          <p className="mt-5 text-base leading-8 text-ink-2">
            آپ استودیو با سایکلوراما، فون‌های رنگی و مجموعه‌ای کامل از نورهای استودیویی، برای پروژه‌های مد، پرتره، ورزشی و هنری
            آماده است. هر جلسه با مشاوره‌ی کوتاه شروع می‌شود تا نور و قاب، دقیقاً هم‌راستای روایت شما باشد.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[["۱۲۰", "متر مربع"], ["۸+", "ست نورپردازی"], ["۴", "حوزهٔ تخصصی"]].map(([v, l]) => (
              <div key={l} className="border-r-2 border-gold pr-3">
                <p className="font-display text-2xl font-extrabold">{v}</p>
                <p className="text-xs text-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <a href={`tel:${BRAND.phoneIntl}`} className="focus-ring flex items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-gold">
            <Phone className="h-5 w-5 text-gold" />
            <span><span className="block text-xs text-muted">تماس</span><span className="text-sm font-bold">{BRAND.phoneDisplay}</span></span>
          </a>
          <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-gold">
            <MessageCircle className="h-5 w-5 text-gold" />
            <span><span className="block text-xs text-muted">واتس‌اپ</span><span className="text-sm font-bold">پیام مستقیم</span></span>
          </a>
          <a href={BRAND.telegram} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-gold">
            <Send className="h-5 w-5 text-gold" />
            <span><span className="block text-xs text-muted">تلگرام</span><span className="text-sm font-bold" dir="ltr">@uplabstudio</span></span>
          </a>
          <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-gold">
            <Instagram className="h-5 w-5 text-gold" />
            <span><span className="block text-xs text-muted">اینستاگرام</span><span className="text-sm font-bold" dir="ltr">@uplabstudio</span></span>
          </a>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="focus-ring col-span-2 flex items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-gold">
            <MapPin className="h-5 w-5 shrink-0 text-gold" />
            <span className="min-w-0"><span className="block text-xs text-muted">نشانی</span><span className="block truncate text-sm font-bold">{BRAND.address}</span></span>
          </a>
        </div>
      </section>

      {/* WEBSITE CARD */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <a
          href={BRAND.website}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex flex-col items-start justify-between gap-4 rounded-2xl bg-ink p-7 text-paper transition hover:bg-ink-2 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/10"><Globe className="h-5 w-5 text-gold-2" /></span>
            <div>
              <p className="text-xs text-paper/60">وب‌سایت رسمی</p>
              <p className="text-base font-bold" dir="ltr">upstudio.ct.ws</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-gold-2">بازدید <ArrowLeft className="h-4 w-4" /></span>
        </a>
      </section>
    </div>
  );
}
