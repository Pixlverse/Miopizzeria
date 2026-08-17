// ===========================================================
// Static site configuration & mock data.
// Replace MOCK_* with API data once the backend is connected.
// ===========================================================

export const BRAND = {
  name: "Mio Pizzeria",
  tagline: "Authentic Neapolitan Pizza in Qatar",
  phone: "+974 6006 4003",
  email: "info@miopizzeria.qa",
  address:
    "Dafna Park, Unit 24, Building 55, Street 841, Zone 63 — Opp. Marriott Marquis City Center, Behind Pullman Hotels (Excellence Tower), Doha, Qatar",
  about:
    "Born from a love of Naples — pizza made with 00 flour, tangy San Marzano tomatoes and creamy mozzarella, baked fresh to perfection here in Doha.",
};

// `key` maps to the i18n dictionary (nav.<key>); `label` is the English fallback.
export const NAV_LINKS = [
  { key: "home", label: "Home", href: "/" },
  { key: "menu", label: "Menu", href: "/menu" },
  { key: "about", label: "About", href: "/about" },
  { key: "events", label: "Events", href: "/events" },
  { key: "contact", label: "Contact", href: "/contact" },
];

// WhatsApp business number (digits only, international format). Dummy for now.
export const WHATSAPP_NUMBER = "97460064003";

// Table reservations are hidden until the client provides the real WhatsApp
// booking number (bookings notify the restaurant over WhatsApp, so the flow is
// incomplete without it). Flip to `true` to bring the Book button back.
export const BOOKING_ENABLED = false;

// ---- Reservation rules ----
// Mirrors backend/config/reservations.js — keep the two in sync. The API
// enforces these independently, so a stale copy here only affects the UI.
// JS getDay(): 0 = Sunday. Thursday/Friday/Saturday take walk-ins only.
export const CLOSED_RESERVATION_DAYS = [4, 5, 6];
export const CLOSED_RESERVATION_LABEL = "Thursday, Friday and Saturday";
export const LUNCH_SLOTS = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];
export const DINNER_SLOTS = [
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

// Each platform redirects to its configured ordering URL. `color` is the
// brand accent used for the hover glow; `logo` is the app icon in /public.
// `zoom` scales up logos that ship with built-in white padding so the coloured
// icon fills the tile consistently (excess is clipped by the tile).
export const DELIVERY_PLATFORMS = [
  {
    id: "snoonu",
    name: "Snoonu",
    url: "https://snoonu.com",
    color: "#E30613",
    logo: "/images/snoonu.png",
    zoom: 1,
  },
  {
    id: "talabat",
    name: "Talabat",
    url: "https://talabat.com",
    color: "#FF5A00",
    logo: "/images/talabat.png",
    zoom: 1.32,
  },
  {
    id: "rafeeq",
    name: "Rafeeq",
    url: "https://rafeeq.qa",
    color: "#8E2DE2",
    logo: "/images/rafeeq.png",
    zoom: 1,
  },
  {
    id: "keeta",
    name: "Keeta",
    url: "https://keeta.com",
    color: "#14B8A6",
    logo: "/images/keeta.png",
    zoom: 1.28,
  },
];

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  whatsapp: "https://wa.me/97460064003",
  snapchat: "",
  tiktok: "",
};

export const HOURS = [
  { day: "Monday", time: "10:00 – 22:00" },
  { day: "Tuesday", time: "10:00 – 22:00" },
  { day: "Wednesday", time: "11:00 – 22:00" },
  { day: "Thursday", time: "11:00 – 22:00" },
  { day: "Friday", time: "10:00 – 22:00" },
  { day: "Saturday", time: "10:00 – 22:00" },
  { day: "Sunday", time: "10:00 – 21:00" },
];

// Single location. `mapQuery` feeds the Google Maps embed + directions link.
export const BRANCHES = [
  {
    id: "dafna",
    name: "Mio Pizzeria — Dafna",
    address:
      "Dafna Park, Unit 24, Building 55, Street 841, Zone 63. Opp. Marriott Marquis City Center, Behind Pullman Hotels (Excellence Tower), Doha, Qatar",
    mapQuery: "Mio Pizzeria, Doha, Qatar",
    phone: "+974 6006 4003",
    hours: HOURS,
  },
];

// Google reviews (real, from the Google Business listing).
// `reviewUrl` = "leave a review"; `placeUrl` = see all.
export const GOOGLE_REVIEWS = {
  rating: 4.7,
  count: 284,
  reviewUrl:
    "https://www.google.com/search?sca_esv=5567dd14a60c546e&cs=1&sxsrf=APpeQnsksKwpVldRZlL3iTGXP_UwOuHVzQ:1783924381480&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_w_HDcBJIbG6iPOPtNWKjPFBBJCEmnDHARDcBgm2UhnKlU7h4bnx-92Pi8hWeGYyhuZ69GEh6cJwnuGFS8bA9Sip8R9b&q=Mio+Pizzeria+Reviews&sa=X&ved=2ahUKEwjOlsGYhM-VAxX9dmwGHT_2OpcQ0bkNegQIMBAF&biw=1440&bih=749&dpr=2",
  placeUrl: "https://share.google/Y7FIyu4xJ8bKRnlCl",
  items: [
    {
      id: 1,
      author: "Ranitidine Q",
      meta: "Local Guide · 259 reviews",
      rating: 5,
      time: "2 months ago",
      text: "A visit to this place was long overdue. Location is absolutely amazing overlooking Marriott. We opted to sit outside as weather is still nice. Since it was first time here we wanted to try and that's why chose their Margherita pizza. The people are very very nice and they made an exceptional pizza. Will definitely come again to try their pesto pizza.",
    },
    {
      id: 2,
      author: "Rachel Paras",
      meta: "Local Guide · 17 reviews",
      rating: 5,
      time: "6 months ago",
      text: "Very good pizza place, the chef's specialty pizza is a must try. The saltiness, freshness is the right balance plus its gluten free! Definitely worth a visit. The food is a five star. The coffee is like a comfort of a hug.",
    },
    {
      id: 3,
      author: "Saad Huwio",
      meta: "Local Guide · 12 reviews",
      rating: 5,
      time: "7 months ago",
      text: "This pizzaria stands out, not only because of its top tier pizza but also because of its locations, great chef and kind staff. I have tried several types of pizzas, the truffle pizza stands out! They also make tasty tiramisu and good cappuccinos :)",
    },
  ],
};

// Home promo — a single editable image that links to a menu item/section.
export const HOME_OFFER = {
  image: "/images/prod-3.jpg",
  href: "/menu#gourmet",
};

// Popular categories on the home page — full-scene photo tiles (product on the
// right, brand-rust space on the left for the copy). `nameKey` -> categories.<key>
// in i18n; `href` deep-links into the menu.
// `zoom` optionally scales up a photo whose product sits small in frame;
// `origin` keeps that product in view while the rest crops away.
export const POPULAR_CATEGORIES = [
  { id: "pizza", nameKey: "pizza", image: "/images/cat1pizza.png", href: "/menu?cat=pizza" },
  { id: "beverages", nameKey: "beverages", image: "/images/cat2-beverages.png", href: "/menu?cat=coolers", zoom: 1.25, origin: "right", pos: "object-right" },
  { id: "salads", nameKey: "salads", image: "/images/cat3salads.jpg", href: "/menu?cat=salads" },
  { id: "sandwiches", nameKey: "sandwiches", image: "/images/cat4sandwich.png", href: "/menu?cat=sandwich" },
];

// Featured products — full-bleed poster photos (name baked into the image),
// shot portrait 9:16 on the brand background. Displayed uncropped.
export const FEATURED_PRODUCTS = [
  {
    id: "caponata",
    name: "Caponata",
    category: "Signature",
    price: 42,
    image: "/images/prod-1.jpg",
  },
  {
    id: "caesar-salad",
    name: "Classic Caesar Salad",
    category: "Fresh",
    price: 38,
    image: "/images/prod-3.jpg",
  },
  {
    id: "artichoke-dip",
    name: "Artichoke Dip",
    category: "To Share",
    price: 32,
    image: "/images/prod-5.jpg",
  },
  {
    id: "gelato",
    name: "Gelato",
    category: "Dessert",
    price: 25,
    image: "/images/prod-2.jpg",
  },
  {
    id: "hot-chocolate",
    name: "Hot Chocolate",
    category: "Hot Drinks",
    price: 18,
    image: "/images/prod-4.jpg",
  },
];

export const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: "Aisha M.",
    role: "Food Blogger",
    rating: 5,
    quote:
      "The best Neapolitan pizza in Doha — the crust is unreal. Delivery was quick too!",
  },
  {
    id: 2,
    name: "James K.",
    role: "Gourmet Food Critic",
    rating: 5,
    quote:
      "Truffle Funghi is a masterpiece. Premium ingredients you can actually taste.",
  },
  {
    id: 3,
    name: "Fatima A.",
    role: "Local Foodie",
    rating: 4,
    quote:
      "Beautiful packaging and consistently great quality. My family's weekend ritual.",
  },
  {
    id: 4,
    name: "Omar S.",
    role: "Verified Diner",
    rating: 5,
    quote:
      "Ordered through Snoonu — arrived hot and perfect. Highly recommend the Diavola.",
  },
];

// Photos for the testimonials collage (restaurant / dining shots).
export const TESTIMONIAL_GALLERY = [
  "/images/rest3.jpg",
  "/images/rest1.jpg",
  "/images/rest2.jpg",
  "/images/rest4.jpg",
];

export const TAG_STYLES = {
  Vegetarian: "bg-emerald-600 text-white",
  Spicy: "bg-red-600 text-white",
  New: "bg-amber-500 text-white",
};
