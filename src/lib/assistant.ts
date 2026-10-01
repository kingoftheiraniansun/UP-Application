import { BRAND, DURATIONS, SERVICES, TIME_SLOTS } from "../data/brand";

export interface Reply {
  text: string;
  actions?: { label: string; to?: string; href?: string }[];
}

const norm = (s: string) =>
  s
    .replace(/[يك]/g, (c) => (c === "ي" ? "ی" : "ک"))
    .replace(/\u200c/g, " ")
    .toLowerCase()
    .trim();

const has = (s: string, words: string[]) => words.some((w) => s.includes(w));

export function localAssistant(raw: string): Reply {
  const q = norm(raw);

  if (!q) return { text: "پیامتان خالی است. بفرمایید دربارهٔ چه چیزی کمک می‌خواهید؟" };

  if (has(q, ["سلام", "درود", "hi", "hello", "وقت بخیر"]) && q.length < 25)
    return {
      text: "سلام! به آپ استودیو خوش آمدید. می‌توانم دربارهٔ رزرو، قیمت، تجهیزات، ساعت کاری، آدرس یا نوع عکاسی راهنمایی‌تان کنم.",
      actions: [{ label: "رزرو استودیو", to: "/booking" }, { label: "مشاهده گالری", to: "/gallery" }],
    };

  if (has(q, ["قیمت", "هزینه", "تعرفه", "چند", "پول", "نرخ"]))
    return {
      text: `تعرفه بر اساس مدت (${DURATIONS.join("، ")})، نوع پروژه و تجهیزات موردنیاز تعیین می‌شود. برای دریافت قیمت دقیق، نوع عکاسی و مدت را بگویید یا مستقیم از واتس‌اپ بپرسید؛ معمولاً در چند دقیقه پاسخ می‌دهیم.`,
      actions: [{ label: "استعلام در واتس‌اپ", href: BRAND.whatsapp }, { label: "فرم رزرو", to: "/booking" }],
    };

  if (has(q, ["رزرو", "وقت", "نوبت", "زمان خالی", "book"]))
    return {
      text: `برای رزرو کافی است فرم رزرو را پر کنید؛ پیام آماده می‌شود و با یک لمس به واتس‌اپ استودیو می‌رود. بازه‌های زمانی: ${TIME_SLOTS.join("، ")}. مدت‌ها: ${DURATIONS.join("، ")}.`,
      actions: [{ label: "رفتن به رزرو", to: "/booking" }],
    };

  if (has(q, ["آدرس", "کجا", "مسیر", "نشانی", "لوکیشن", "موقعیت"]))
    return {
      text: `نشانی استودیو:\n${BRAND.address}\n\nبرای مسیریابی روی دکمهٔ نقشه بزنید.`,
      actions: [
        { label: "باز کردن نقشه", href: `https://www.google.com/maps/search/?api=1&query=${BRAND.coords.lat},${BRAND.coords.lng}` },
        { label: "صفحهٔ تماس", to: "/contact" },
      ],
    };

  if (has(q, ["ساعت کاری", "ساعت کار", "چه ساعتی", "باز", "تعطیل", "کی باز"]))
    return {
      text: `جلسات معمولاً از ${TIME_SLOTS[0]} تا ${TIME_SLOTS[TIME_SLOTS.length - 1]} برگزار می‌شود و برای زمان‌های خارج از این بازه هم با هماهنگی قبلی امکان‌پذیر است.`,
      actions: [{ label: "هماهنگی در واتس‌اپ", href: BRAND.whatsapp }],
    };

  if (has(q, ["تلفن", "شماره", "تماس", "زنگ"]))
    return {
      text: `شمارهٔ استودیو: ${BRAND.phoneDisplay}\nایمیل: ${BRAND.email}`,
      actions: [{ label: "تماس تلفنی", href: `tel:${BRAND.phoneIntl}` }, { label: "تلگرام", href: BRAND.telegram }],
    };

  if (has(q, ["تجهیزات", "نور", "فلاش", "فون", "سایکلو", "لنز", "دوربین", "امکانات"]))
    return {
      text: "استودیو شامل سایکلوراما، فون‌های رنگی، سافت‌باکس، بیوتی‌دیش، استریپ‌لایت، ریم‌لایت، دستگاه مه و رفلکتور است. اگر تجهیز خاصی مدنظر دارید در بخش «تجهیزات» فرم رزرو انتخابش کنید.",
      actions: [{ label: "فرم رزرو", to: "/booking" }],
    };

  if (has(q, ["مد", "فشن", "لوک بوک", "لوکبوک", "کمپین"]))
    return {
      text: `${SERVICES[0].title}: ${SERVICES[0].desc} برای پروژه‌های مد معمولاً ۲ تا ۳ ساعت یا نیم‌روز پیشنهاد می‌شود.`,
      actions: [{ label: "نمونه‌کارهای مد", to: "/gallery?cat=fashion" }, { label: "برنامه‌ریز عکاسی", to: "/planner" }],
    };

  if (has(q, ["پرتره", "پرسنلی", "چهره", "بیزینسی", "لینکدین"]))
    return {
      text: `${SERVICES[1].title}: ${SERVICES[1].desc} برای پرتره شخصی ۱ ساعت و برای پرترهٔ تیمی ۲ ساعت کافی است.`,
      actions: [{ label: "نمونه‌کارهای پرتره", to: "/gallery?cat=portrait" }],
    };

  if (has(q, ["ورزش", "بدنساز", "فیتنس", "بوکس", "اسپرت"]))
    return {
      text: `${SERVICES[2].title}: ${SERVICES[2].desc} پیشنهاد ما نور سخت و ریم‌لایت دوطرفه با زمینهٔ تیره است.`,
      actions: [{ label: "نمونه‌کارهای ورزشی", to: "/gallery?cat=sport" }],
    };

  if (has(q, ["هنری", "مفهومی", "کانسپت", "استیل لایف", "آرت"]))
    return {
      text: `${SERVICES[3].title}: ${SERVICES[3].desc} ایده‌تان را در «برنامه‌ریز عکاسی» بنویسید تا طرح نور و قاب پیشنهاد شود.`,
      actions: [{ label: "برنامه‌ریز عکاسی", to: "/planner" }, { label: "نمونه‌کارهای هنری", to: "/gallery?cat=art" }],
    };

  if (has(q, ["گریم", "آرایش", "استایلیست", "لباس"]))
    return {
      text: "گریمور و استایلیست جزو خدمات پیش‌فرض نیستند اما با هماهنگی قبلی قابل تأمین‌اند. در توضیحات فرم رزرو ذکر کنید.",
      actions: [{ label: "فرم رزرو", to: "/booking" }],
    };

  if (has(q, ["ادیت", "رتوش", "تحویل", "فایل", "چند روز", "خام"]))
    return {
      text: "فایل‌های منتخب با رتوش نهایی معمولاً طی ۳ تا ۷ روز کاری تحویل می‌شوند؛ فایل‌های خام هم طبق توافق قابل ارائه‌اند.",
    };

  if (has(q, ["اینستا", "instagram", "پیج"]))
    return { text: `اینستاگرام استودیو: ${BRAND.instagramHandle}`, actions: [{ label: "باز کردن اینستاگرام", href: BRAND.instagram }] };

  if (has(q, ["ممنون", "مرسی", "تشکر", "thanks"])) return { text: "خواهش می‌کنم! منتظر دیدن شما در آپ استودیو هستیم. ✨" };

  return {
    text: "سؤال شما را دقیق متوجه نشدم. می‌توانم دربارهٔ رزرو، قیمت، آدرس، تجهیزات، یا انواع عکاسی (مد، پرتره، ورزشی، هنری) کمک کنم. اگر پرسش خاصی دارید، همکاران ما در واتس‌اپ پاسخ‌گو هستند.",
    actions: [{ label: "گفتگو در واتس‌اپ", href: BRAND.whatsapp }, { label: "رزرو", to: "/booking" }],
  };
}

export const SUGGESTIONS = ["قیمت رزرو چقدره؟", "آدرس استودیو؟", "چه تجهیزاتی دارید؟", "برای پرتره چقدر زمان لازمه؟", "ساعت کاری؟"];
