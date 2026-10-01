# UP Studio / آپ استودیو — راهنمای ساخت نسخهٔ موبایل

این پروژه برای دو خروجی موبایل آماده شده است:

| پلتفرم | روش | خروجی |
|---|---|---|
| **اندروید** | Capacitor + GitHub Actions | فایل `UP-Studio.apk` (قابل نصب مستقیم) |
| **آیفون / آیپد** | PWA روی GitHub Pages | نشانی وب که از Safari روی صفحهٔ اصلی نصب می‌شود |

- شناسهٔ اپ: `com.upstudio.app`
- نام: **UP Studio**

---

## ۱) آماده‌سازی مخزن GitHub (یک‌بار)

1. در GitHub یک مخزن جدید بسازید (مثلاً `upstudio-app`). می‌تواند Public یا Private باشد.
2. کل فایل‌های این پروژه را در آن push کنید (شاخهٔ `main`).
3. در تب **Settings → Actions → General**، گزینهٔ *Workflow permissions* را روی **Read and write permissions** بگذارید و ذخیره کنید.
4. در تب **Settings → Pages**، بخش *Build and deployment → Source* را روی **GitHub Actions** بگذارید.

همین. از این به بعد با هر push دو workflow خودکار اجرا می‌شوند.

---

## ۲) دانلود فایل APK اندروید

1. به تب **Actions** بروید و منتظر بمانید تا «Build Android APK» سبز شود (بار اول حدود ۱۰–۱۵ دقیقه).
2. به بخش **Releases** مخزن بروید → ریلیز **«UP Studio — Android (latest)»** → فایل **`UP-Studio.apk`** را دانلود کنید.
   - این لینک همیشه آخرین نسخه را می‌دهد:
     `https://github.com/<نام‌کاربری>/<نام‌مخزن>/releases/download/android-latest/UP-Studio.apk`
3. فایل را روی گوشی باز کنید و اجازهٔ «نصب از منابع ناشناس» را بدهید.

### ⚠️ مهم: کلید امضا (Keystore)

برای اینکه **به‌روزرسانی‌های بعدی روی نسخهٔ نصب‌شده بنشینند**، باید همیشه با یک کلید امضا شوند.

- در **اولین اجرا**، workflow خودش یک کلید می‌سازد و آن را به‌عنوان artifact با نام `upstudio-release-keystore` در صفحهٔ همان اجرای Actions می‌گذارد.
- آن فایل (`release.keystore`) را دانلود کنید و **در جای امن نگه دارید**.
- سپس در **Settings → Secrets and variables → Actions** این Secret ها را اضافه کنید:

| Secret | مقدار |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | خروجی دستور `base64 -w0 release.keystore` (در ویندوز: `certutil -encode release.keystore out.txt` و محتوای بین دو خط BEGIN/END بدون خط جدید) |
| `ANDROID_KEYSTORE_PASSWORD` | `upstudio2025` (رمز کلید تولیدشدهٔ خودکار) |
| `ANDROID_KEY_ALIAS` | `upstudio` |
| `ANDROID_KEY_PASSWORD` | `upstudio2025` |

از این پس همهٔ بیلدها با همان کلید امضا می‌شوند. اگر کلید را گم کنید، کاربران باید اپ را حذف و دوباره نصب کنند.

---

## ۳) نسخهٔ آیفون (PWA)

بعد از سبزشدن workflow «Deploy PWA (GitHub Pages)»، نشانی اپ این است:

```
https://<نام‌کاربری>.github.io/<نام‌مخزن>/
```

(نشانی دقیق در **Settings → Pages** و همچنین در خروجی همان workflow نمایش داده می‌شود.)

**نصب روی آیفون:**
1. نشانی را در **Safari** باز کنید (حتماً Safari، نه Chrome).
2. دکمهٔ **Share** (مربع با فلش بالا) → **Add to Home Screen** → **Add**.
3. آیکون «UP Studio» روی صفحهٔ اصلی اضافه می‌شود و تمام‌صفحه (بدون نوار مرورگر) باز می‌شود.

همین نشانی روی اندروید هم در Chrome قابل نصب است (منوی ⋮ → Install app) — اگر کسی نخواهد APK نصب کند.

> اگر دامنهٔ اختصاصی دارید (مثلاً `app.upstudio.ir`)، در **Settings → Pages → Custom domain** واردش کنید تا نشانی کوتاه‌تر شود.

---

## ۴) انتشار در Google Play (اختیاری، بعداً)

Play Store فایل **AAB** می‌خواهد. کافی است در `android.yml` به‌جای `assembleRelease` از `bundleRelease` استفاده شود و خروجی `app-release.aab` با همان keystore امضا شود. اگر خواستید، این مرحله را هم اضافه می‌کنم.

## ۵) انتشار در App Store (نیازمند حساب Apple Developer)

وقتی حساب Apple Developer (۹۹ دلار/سال) داشتید، با `npx cap add ios` و یک workflow روی `macos-latest` می‌توان IPA ساخت و به TestFlight فرستاد. تا آن زمان، PWA بهترین گزینهٔ آیفون است.

---

## اجرای محلی (اختیاری)

```bash
npm install
npm run build
npx cap add android      # فقط بار اول
npx cap sync android
npx cap open android     # باز شدن در Android Studio → Build → Build APK
```
