import { Component, useState, type ReactNode } from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Shell from "./components/Shell";
import Intro, { introAlreadySeen } from "./components/Intro";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import Assistant from "./pages/Assistant";
import Contact from "./pages/Contact";
import Planner from "./pages/Planner";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center" dir="rtl">
          <h1 className="text-2xl font-extrabold">مشکلی پیش آمد</h1>
          <p className="mt-2 text-sm text-muted">لطفاً صفحه را دوباره بارگذاری کنید.</p>
          <button onClick={() => window.location.reload()} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-bold text-paper">
            بارگذاری مجدد
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <p className="eyebrow">۴۰۴</p>
      <h1 className="font-display mt-3 text-3xl font-extrabold">این صفحه پیدا نشد</h1>
      <p className="mt-3 text-sm text-muted">شاید نشانی اشتباه باشد یا صفحه جابه‌جا شده باشد.</p>
      <Link to="/" className="focus-ring mt-8 rounded-full bg-ink px-7 py-3 text-sm font-bold text-paper">
        بازگشت به خانه
      </Link>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !introAlreadySeen());

  return (
    <ErrorBoundary>
      <HashRouter>
        {showIntro && <Intro onDone={() => setShowIntro(false)} />}
        <div aria-hidden={showIntro} className={showIntro ? "h-screen overflow-hidden" : undefined}>
          <Routes>
            <Route element={<Shell />}>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </HashRouter>
    </ErrorBoundary>
  );
}
