# Pre-Launch Checklist — Miopizzeria

Everything below is **dummy / placeholder** and must be replaced before going to
production. Grouped by file. Check each box as you complete it.

> Most content lives in one file: **`frontend/src/utils/constants.js`**.
> Bilingual copy lives in **`frontend/src/i18n/en.js`** and **`ar.js`**.

---

## 1. Site content data — `frontend/src/utils/constants.js`

| # | Item | Const | Current dummy value | How to change |
|---|------|-------|---------------------|---------------|
| [ ] | **WhatsApp number** | `WHATSAPP_NUMBER` | `97400000000` | Set the real business number, digits only, intl format (e.g. `974XXXXXXXX`). Used by the floating button + party-order form. |
| [ ] | **Branch 1 & 2** | `BRANCHES` | West Bay / The Pearl, `+974 0000 0001/2`, dummy hours | Replace `name`, `address`, `phone`, `hours`, and `mapQuery` (a text query or `place_id:...`) for each of the 2 branches. `mapQuery` drives both the embedded map and the Directions link. |
| [ ] | **Opening hours** | `HOURS` | Sun–Thu 11–23, etc. | Confirm real hours per day (shared by both branches unless you give each its own). |
| [ ] | **Google reviews** | `GOOGLE_REVIEWS` | rating `4.8`, `320`, `placeid=REPLACE_ME`, 3 fake reviews | Put the real `rating`/`count`, and set `reviewUrl` + `placeUrl` using your Google **Place ID** (get it from Google's Place ID Finder). Optionally swap `items` for real quotes. |
| [ ] | **Home offer** | `HOME_OFFER` | `image: /images/prod-3.jpg`, `href: /menu#gourmet` | Point `image` at the real promo image and `href` at the target menu section/item. |
| [ ] | **Delivery platform links** | `DELIVERY_PLATFORMS` | generic homepages (`snoonu.com`, `talabat.com`, `rafeeq.qa`, `keeta.com`) | Replace each `url` with your **store page** on that platform, not the homepage. |
| [ ] | **Social links** | `SOCIAL_LINKS` | `instagram.com`, `facebook.com`, `wa.me/9740000000` | Real handles. Add TikTok/Snapchat here if wanted (and to `Footer.jsx`). |
| [ ] | **Brand contact** | `BRAND` | phone `+974 0000 0000`, `hello@miopizzeria.qa`, `Doha, Qatar` | Real phone, email, address. |
| [ ] | **Full menu** | `MENU_CATEGORIES` | dummy items, prices, descriptions, `/images/prod-*.jpg` | Replace with the real menu (categories already include Gluten-Free, Breakfast, Sides, Desserts, Drinks, Combos). Set `bestSeller: true` on real best-sellers; images per item. |
| [ ] | **Homepage testimonials** | `MOCK_TESTIMONIALS` | 4 fake reviews | Replace or remove (Google Reviews section now covers social proof). |

---

## 2. Bilingual copy — `frontend/src/i18n/en.js` + `ar.js`

- [ ] **Arabic translations** — all of `ar.js` is machine/MSA Arabic. **Have a native speaker review** before launch.
- [ ] **English marketing copy** — hero, About story/pillars, FAQ answers, Events blurb are my placeholders; confirm the client's preferred wording.
- [ ] **Legal text** — `legal.privacy` / `legal.terms` are **template** content. Have the client/legal review, and update `legal.updated` (currently "July 2026").

---

## 3. Analytics — Google Analytics 4

- [ ] Set **`NEXT_PUBLIC_GA_ID`** (format `G-XXXXXXXXXX`):
  - **Production:** GitHub → Settings → *Secrets and variables* → *Actions* → *Variables* → add `NEXT_PUBLIC_GA_ID`. (Already wired in `.github/workflows/deploy.yml`.)
  - **Local test:** add `NEXT_PUBLIC_GA_ID=G-...` to `frontend/.env.local`.
- Analytics is **consent-gated** (Google Consent Mode): it stays denied until the visitor clicks *Accept* on the cookie banner. No action needed — just set the ID.
- **Meta Pixel: intentionally NOT added** (per your instruction).

---

## 4. Brand assets

- [ ] **Fonts** — `TT Norms Pro` + `White Oleander` are declared in `tailwind.config.js` but not loaded; site uses fallbacks. Add the licensed font files + `@font-face` in `globals.css`.
- [ ] **Logo / favicon** — confirm final logo files; replace `frontend/public/favicon.ico`.
- [ ] **Photography** — `public/images/prod-*.jpg`, `rest*.jpg`, `slider*.png` are placeholder/stock. Swap for real Mio photos.
- [ ] **OG/social share image** — add a proper Open Graph image (referenced in `Layout.jsx`).

---

## 5. SEO

- [ ] Per-page titles/descriptions + target keywords ("best pizza Qatar", etc.) in `Layout.jsx` / each page.
- [ ] Confirm the OG image and `robots` meta.
- [ ] (Optional) sitemap.xml + submit to Google Search Console.

---

## 6. Trust / compliance

- [ ] **Halal + food-license badges** — not yet added. Provide the badge images and we'll place them (e.g. footer / About).
- [ ] **Google Business Profile** — the "how was your visit?" prompt is a Google Business feature (set up there, not on the site). Make sure the profile is claimed so reviews flow to the widget.

---

## 7. Deployment

- [ ] **Site version** — `.github/workflows/deploy.yml` sets `NEXT_PUBLIC_SITE_VERSION: "1"` (interim PDF-menu landing = the QR target). Flip to `"2"` to launch the **full site**.
- [ ] **Custom domain** — confirm `mio-pizzeria.com` DNS + GitHub Pages custom domain (and `CNAME`). `basePath` in `next.config.js` stays empty for a root domain.
- [ ] **Repo cleanup** — remove stray `frontend/public.zip` and `frontend/src/components.zip` (should not be committed).

---

## 8. Not in scope yet (future phases)

- **Admin panel** — multi-user login, menu CRUD with archive/visibility, editable settings. Backend exists (`/backend`) but isn't wired to the frontend; for production change `ADMIN_EMAIL`/`ADMIN_PASSWORD` and secrets in `backend/.env`.
- **Newsletter** — not needed. **Loyalty** — on hold ("in consideration").
