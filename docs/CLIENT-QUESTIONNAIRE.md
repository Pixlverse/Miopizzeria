# Miopizzeria — Client Discovery Checklist

Questions to confirm scope before we build beyond the current Home page.
Tick what's needed; add notes inline.

---

## 1. Content sections (Home & beyond)

- [ ] **Latest Deals / Offers section** — do you want a dedicated banner or section showing current promotions (e.g. "2 for 1 Tuesdays", combo deals)? Should it be **editable from the admin panel** (start/end dates) or static?
- [ ] **Featured / Best-sellers** — keep the current "Featured Pizzas" preview, or curate it manually each week?
- [ ] **About / Our Story** — a section about the brand, the chef, wood-fired oven, ingredients sourcing?
- [ ] **Photo Gallery** — a grid of food/restaurant photos?
- [ ] **Events / Catering** — do you cater parties or offer private bookings? Need a form for it?
- [ ] **Loyalty / Newsletter** — collect emails or offer a loyalty signup?
- [ ] **Press / Awards** — any "as seen in" or rating badges (Google, Instagram followers)?
- [ ] **FAQ** — common questions (delivery areas, allergens, halal certification)?

## 2. Menu

- [ ] Final list of **categories** (Classic, Gourmet, Specialty, Vegetarian — correct? more?)
- [ ] Beyond pizza — **sides, drinks, desserts, combos**?
- [ ] **Real menu data**: names, descriptions, prices, and **high-res photos** for every item?
- [ ] **Allergen / dietary tags** needed (Halal, Vegan, Gluten-free, Nut-free)?
- [ ] Show **out-of-stock / seasonal** items differently?

## 3. Ordering & delivery — IMPORTANT

- [ ] **Redirect-only** (buttons send users to Snoonu/Talabat/WhatsApp — current design), **or** real **on-site cart & checkout**? *(This significantly changes scope.)*
- [ ] Confirmed **delivery platform links** (Snoonu, Talabat, Rafeeq, Keeta — actual URLs)?
- [ ] **WhatsApp ordering number** and **direct call number**?
- [ ] Should "Order Now" on an item **deep-link** to that item on a platform, or just the storefront?
- [ ] **Delivery zones / minimum order** info to display?

## 4. Language & region

- [ ] **Arabic version + RTL layout?** *(Very common requirement in Qatar — affects everything, decide early.)*
- [ ] Currency display — QAR confirmed?
- [ ] Bilingual menu item names/descriptions?

## 5. Locations

- [ ] **Single branch or multiple?** (changes the Location section + maps)
- [ ] Exact **address, Google Maps pin, phone** per branch
- [ ] **Opening hours** per day (and Ramadan hours?)

## 6. Branding & assets

- [ ] **Licensed fonts** — can you provide TT Norms Pro & White Oleander files? (currently using fallbacks)
- [ ] **Logo files** (SVG / transparent PNG) + favicon
- [ ] **Brand photography** — real pizza/restaurant photos (currently placeholder stock images)
- [ ] Any **brand guideline doc** beyond the colors we have?

## 7. Admin panel — what should be editable?

- [ ] Menu items (add/edit/delete) — assumed yes
- [ ] **Deals/offers** management?
- [ ] Restaurant settings (hours, phone, address, social links, platform URLs)?
- [ ] **Multiple admin users** or just one login?
- [ ] Image uploads via **Cloudinary** (free tier) — OK?

## 8. Legal, compliance & trust

- [ ] **Privacy Policy & Terms** content (we provide template or you supply)?
- [ ] **Cookie consent** banner needed?
- [ ] Halal certification / food license badges to display?

## 9. Marketing & SEO

- [ ] **Google Analytics / Meta Pixel** tracking?
- [ ] Target search keywords confirmed ("best pizza Qatar", etc.)?
- [ ] Social media handles to link (Instagram, Facebook, TikTok, Snapchat)?
- [ ] WhatsApp **click-to-chat** as a floating button?

## 10. Domain, hosting & launch

- [ ] **Domain** owned? (e.g. miopizzeria.qa) — who manages DNS?
- [ ] Accounts to set up: **MongoDB Atlas, Cloudinary, Vercel, Render/Railway** — who owns them?
- [ ] Launch deadline / soft-launch date?

---

### Top 4 decisions that change the build the most
1. **Redirect-only vs. real on-site cart/checkout** (Section 3)
2. **Arabic / RTL support** (Section 4)
3. **Single vs. multiple branches** (Section 5)
4. **Editable Deals/Offers** in admin (Section 1)
