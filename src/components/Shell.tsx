import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Images, CalendarCheck, MessageCircle, Phone, Sparkles } from "lucide-react";
import Logo from "./Logo";
import { BRAND } from "../data/brand";
import { cn } from "../utils/cn";

const NAV = [
  { to: "/", label: "خانه", icon: Home, end: true },
  { to: "/gallery", label: "گالری", icon: Images },
  { to: "/booking", label: "رزرو", icon: CalendarCheck },
  { to: "/assistant", label: "دستیار", icon: MessageCircle },
  { to: "/contact", label: "تماس", icon: Phone },
];

export default function Shell() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      {/* Desktop / tablet header */}
      <header
        className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md"
        style={{ paddingTop: "var(--sat)" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="ناوبری اصلی">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "focus-ring relative rounded-full px-4 py-2 text-sm transition-colors",
                    isActive ? "font-bold text-ink" : "text-muted hover:text-ink",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span
                      className={cn(
                        "absolute bottom-0.5 right-1/2 h-[2px] translate-x-1/2 rounded-full bg-gold transition-all duration-300",
                        isActive ? "w-5" : "w-0",
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <NavLink
              to="/planner"
              className={({ isActive }) =>
                cn(
                  "focus-ring mr-2 flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors",
                  isActive ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink",
                )
              }
            >
              <Sparkles className="h-4 w-4" />
              برنامه‌ریز
            </NavLink>
          </nav>
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
            className={({ isActive }) =>
              cn(
                "focus-ring flex h-10 w-10 items-center justify-center rounded-full border md:hidden",
                isActive ? "border-ink bg-ink text-paper" : "border-line text-ink-2",
              )
            }
            aria-label="برنامه‌ریز عکاسی"
          >
            <Sparkles className="h-4.5 w-4.5" />
          </NavLink>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* Footer (desktop) */}
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

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(var(--sab), 8px)" }}
        aria-label="ناوبری موبایل"
      >
        <ul className="grid grid-cols-5">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    cn(
                      "focus-ring flex min-h-[56px] flex-col items-center justify-center gap-1 pt-2 text-[11px] transition-colors",
                      isActive ? "font-bold text-ink" : "text-muted",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={cn("rounded-full px-3 py-0.5 transition-colors", isActive && "bg-ink/5")}>
                        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.7} />
                      </span>
                      {n.label}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
