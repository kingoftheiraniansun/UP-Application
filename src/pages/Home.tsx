import { Link } from "react-router-dom";
import { ArrowUpLeft, CalendarDays, Globe, Images, Instagram, MessageCircle, Phone } from "lucide-react";
import { BRAND, SERVICES } from "../data/brand";
import { GALLERY } from "../data/gallery";
import { ASSETS } from "../data/assets";
import SmartImage from "../components/SmartImage";
import { cn } from "../utils/cn";

export default function Home() {
  const featured = GALLERY.slice(0, 6);

  return (
    <div className="pb-10">
      <section className="relative mx-3 mt-3 h-[68vh] min-h-[520px] overflow-hidden rounded-[28px] bg-ink sm:mx-5 md:h-[78vh]">
        <video
          src={ASSETS.introVideo}
          poster={ASSETS.introPoster}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-paper sm:p-8 md:p-10">
          <img src={ASSETS.logo} alt="" aria-hidden="true" className="mb-5 h-11 w-11 object-contain invert" />
          <p className="text-[10px] tracking-[0.35em] text-paper/65" dir="ltr">UP STUDIO · TEHRAN</p>
          <h1 className="mt-2 text-[2rem] font-extrabold leading-[1.35] sm:text-4xl">نور، قاب، روایت.</h1>
          <p className="mt-2 max-w-md text-sm leading-7 text-paper/80">{BRAND.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/booking"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-gold-2"
            >
              <CalendarDays className="h-4 w-4" />
              رزرو استودیو
            </Link>
            <Link
              to="/gallery"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/30 px-5 py-2.5 text-sm backdrop-blur"
            >
              <Images className="h-4 w-4" />
              نمونه‌کارها
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pt-9 sm:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold">منتخب نمونه‌کارها</h2>
          <Link to="/gallery" className="text-xs text-muted hover:text-ink">مشاهده همه</Link>
        </div>
        <div className="no-scrollbar -mx-5 mt-4 flex gap-3 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
          {featured.map((item) => (
            <Link
              key={item.id}
              to={\`/gallery?img=\${item.id}\`}
              className="group w-32 shrink-0 overflow-hidden rounded-2xl bg-paper-2 sm:w-36"
            >
              <SmartImage
                src={item.thumb}
                fallbacks={[item.src, item.fallback]}
                alt={item.alt}
                loading="lazy"
                wrapperClassName="aspect-[9/16]"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pt-11 sm:px-8">
        <p className="text-[10px] tracking-[0.35em] text-gold" dir="ltr">SERVICES</p>
        <h2 className="mt-1 text-lg font-bold">خدمات استودیو</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              to={\`/gallery?cat=\${service.id}\`}
              className="group rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-gold active:scale-[0.98]"
            >
              <h3 className="font-bold">{service.title}</h3>
              <p className="mt-1 text-xs leading-6 text-muted">{service.desc}</p>
              <span className="mt-3 block text-[11px] font-semibold text-gold opacity-0 transition group-hover:opacity-100">مشاهده نمونه‌ها</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <a href={\`tel:\${BRAND.phoneIntl}\`} className="focus-ring inline-flex items-center justify-center gap-1 rounded-full bg-paper-2 py-2.5 text-xs font-medium"><Phone className="h-3.5 w-3.5" /> تماس</a>
          <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center justify-center gap-1 rounded-full bg-paper-2 py-2.5 text-xs font-medium"><MessageCircle className="h-3.5 w-3.5" /> واتساپ</a>
          <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center justify-center gap-1 rounded-full bg-paper-2 py-2.5 text-xs font-medium"><Instagram className="h-3.5 w-3.5" /> اینستاگرام</a>
        </div>
      </section>

      <section className="px-3 pt-10 sm:px-5">
        <div className="overflow-hidden rounded-[28px] border border-line bg-white">
          <div className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-paper-2"><Globe className="h-5 w-5" strokeWidth={1.5} /></span>
              <div>
                <h2 className="font-bold">وب‌سایت استودیو</h2>
                <p dir="ltr" className="text-right text-xs text-muted">upstudio.ct.ws</p>
              </div>
            </div>
            <a href={BRAND.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-xs text-paper">
              باز کردن <ArrowUpLeft className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="relative h-56 overflow-hidden border-t border-line">
            <img src={featured[3]?.src ?? ASSETS.heroImage} alt="" className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 grid place-items-center bg-ink/35 text-sm font-medium text-paper">وب‌سایت را در مرورگر باز کنید</div>
          </div>
        </div>
      </section>

      <section className="px-5 pt-10 sm:px-8">
        <div className={cn("rounded-3xl bg-ink p-6 text-paper", "sm:p-8")}>
          <p className="text-xs text-paper/55">آپ استودیو</p>
          <h2 className="mt-2 text-2xl font-extrabold">برای قاب بعدی آماده‌ای؟</h2>
          <p className="mt-2 max-w-lg text-sm leading-7 text-paper/70">کانسپت پروژه را بفرستید یا مستقیم برای رزرو زمان اقدام کنید.</p>
          <Link to="/planner" className="mt-5 inline-flex rounded-full bg-paper px-5 py-2.5 text-sm font-bold text-ink">شروع برنامه‌ریزی</Link>
        </div>
      </section>
    </div>
  );
}
