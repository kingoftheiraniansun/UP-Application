import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Images, CalendarDays, Sparkles, Phone } from "lucide-react";
import Logo from "./Logo";
import { BRAND } from "../data/brand";
import { cn } from "../utils/cn";

const NAV = [
  { to: "/", label: "خانه", icon: Home, end: true },
  { to: "/gallery", label: "گالری", icon: Images },
  { to: "/booking", label: "رزرو", icon: CalendarDays },
  { to: "/assistant", label: "دستیار", icon: Sparkles },
  { to: "/contact", label: "تماس", icon: Phone },
];

export default function Shell() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/85 backdrop-blur-xl" style={{ paddingTop: "var(--sat)" }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="ناوبری اصلی">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) => cn(
                  "focus-ring rounded-full px-4 py-2 text-sm transition",
                  isActive ? "bg-ink text-paper" : "text-muted hover:text-ink hover:bg-paper-2",
                )}
              >
                {n.label}
              </NavLink>
            ))}
            <NavLink
              to="/planner"
              className={({ isActive }) => cn(
                "focus-ring mr-2 flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition",
                isActive ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink",
              )}
            >
              <Sparkles className="h-4 w-4" /> برنامه‌ریز
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-ink-2 md:block"
            >
              رزرو سریع
            </a>
            <NavLink
              to="/planner"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
              aria-label="برنامه‌ریز عکاسی"
            >
              <Sparkles className="h-4 w-4" />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>

      <footer className="hidden border-t border-line bg-paper-2/60 md:block">
        <div className="mx-auto grid max-w-7xl gap-8 px-8 py-12 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-7 text-muted">{BRAND.subtitle}</p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold text-muted">تماس</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-gold" href={`tel:${BRAND.phoneIntl}`}>{BRAND.phoneDisplay}</a></li>
              <li><a className="hover:text-gold" href={`mailto:${BRAND.email}`} dir="ltr">{BRAND.email}</a></li>
              <li><a className="hover:text-gold" href={BRAND.instagram} target="_blank" rel="noopener noreferrer" dir="ltr">{BRAND.instagramHandle}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold text-muted">نشانی</h4>
            <p className="text-sm leading-7 text-ink-2">{BRAND.address}</p>
          </div>
        </div>
        <div className="border-t border-line py-4 text-center text-xs text-muted">
          © {new Date().getFullYear().toLocaleString("fa-IR", { useGrouping: false })} آپ استودیو — UP Studio
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 pb-2 md:hidden" aria-label="منوی اصلی">
        <div className="mx-3 flex max-w-md items-center justify-between gap-1 rounded-full border border-line/70 bg-white/85 px-2 py-1.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:mx-auto">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) => cn(
                  "focus-ring flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[10.5px] transition-all duration-300",
                  isActive ? "bg-ink text-paper" : "text-muted hover:text-ink",
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("h-[18px] w-[18px] transition-transform duration-300", isActive && "scale-110")} strokeWidth={1.7} />
                    <span className="font-medium">{n.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
