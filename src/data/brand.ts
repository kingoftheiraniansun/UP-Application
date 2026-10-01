export const BRAND = {
  nameFa: "آپ استودیو",
  nameEn: "UP Studio",
  tagline: "نور، قاب، روایت.",
  subtitle: "استودیو عکاسی مد، پرتره، ورزشی و هنری.",
  phoneDisplay: "۰۹۰۱ ۵۷۹ ۳۳۱۲",
  phoneRaw: "09015793312",
  phoneIntl: "+989015793312",
  email: "info@uplabstudio.com",
  website: "https://upstudio.ct.ws",
  whatsapp: "https://wa.link/pcjlml",
  telegram: "https://t.me/uplabstudio",
  instagram: "https://www.instagram.com/uplabstudio",
  instagramHandle: "@uplabstudio",
  coords: { lat: 35.642205, lng: 51.267854 },
  address:
    "آزادگان غرب به شرق، خیابان شمس آباد، بعد از زیرگذر، پلاک ۲۶ (بلوک‌زنی تک) (مینوسپهر)، انتهای مجموعه، آپ استودیو",
} as const;

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${BRAND.coords.lat},${BRAND.coords.lng}`;
export const OSM_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${BRAND.coords.lng - 0.008}%2C${BRAND.coords.lat - 0.005}%2C${BRAND.coords.lng + 0.008}%2C${BRAND.coords.lat + 0.005}&layer=mapnik&marker=${BRAND.coords.lat}%2C${BRAND.coords.lng}`;

export const SERVICES = [
  { id: "fashion", title: "مد و فشن", desc: "لوک‌بوک، کمپین و ادیتوریال با نورپردازی سینمایی." },
  { id: "portrait", title: "پرتره", desc: "پرتره‌های شخصی، هنری و بیزینسی با روایت فردی." },
  { id: "sport", title: "ورزشی", desc: "فریز لحظه، قدرت و حرکت با فلاش‌های پرسرعت." },
  { id: "art", title: "هنری", desc: "پروژه‌های مفهومی، استیل‌لایف و تجربه‌های نوری." },
] as const;

export const DURATIONS = ["۱ ساعت", "۲ ساعت", "۳ ساعت", "نیم‌روز", "تمام‌روز"] as const;

export const EQUIPMENT = [
  "سافت‌باکس",
  "بیوتی‌دیش",
  "استریپ‌لایت",
  "فون رنگی",
  "سایکلوراما",
  "ریم‌لایت",
  "دستگاه مه",
  "رفلکتور",
] as const;

export const TIME_SLOTS = ["۰۹:۰۰", "۱۱:۰۰", "۱۳:۰۰", "۱۵:۰۰", "۱۷:۰۰", "۱۹:۰۰"] as const;

export const toFa = (input: string | number) =>
  String(input).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const toEn = (input: string) =>
  input.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
