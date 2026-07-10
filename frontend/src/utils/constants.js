// ===========================================================
// Static site configuration & mock data.
// Replace MOCK_* with API data once the backend is connected.
// ===========================================================

export const BRAND = {
  name: "Miopizzeria",
  tagline: "Premium Italian Pizza in Qatar",
  phone: "+974 0000 0000",
  email: "hello@miopizzeria.qa",
  address: "Doha, Qatar",
  about:
    "Handcrafted Italian pizzas baked fresh daily in Doha. Premium ingredients, wood-fired flavour, delivered to your door.",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
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
  whatsapp: "https://wa.me/9740000000",
};

export const HOURS = [
  { day: "Sunday – Thursday", time: "11:00 AM – 11:00 PM" },
  { day: "Friday", time: "1:00 PM – 12:00 AM" },
  { day: "Saturday", time: "11:00 AM – 12:00 AM" },
];

// Featured pizzas for the home preview (mock).
export const MOCK_FEATURED = [
  {
    id: "margherita",
    name: "Margherita",
    category: "Classic",
    price: 38,
    description:
      "San Marzano tomato, fresh mozzarella, basil, extra-virgin olive oil.",
    imageUrl: "/images/prod-1.jpg",
    tags: ["Vegetarian"],
  },
  {
    id: "pepperoni",
    name: "Pepperoni Classico",
    category: "Classic",
    price: 45,
    description: "Double pepperoni, mozzarella, oregano on a wood-fired crust.",
    imageUrl: "/images/prod-2.jpg",
    tags: ["Spicy"],
  },
  {
    id: "truffle-funghi",
    name: "Truffle Funghi",
    category: "Gourmet",
    price: 58,
    description:
      "Wild mushrooms, truffle cream, fontina, thyme, shaved parmesan.",
    imageUrl: "/images/prod-3.jpg",
    tags: ["Vegetarian", "New"],
  },
  {
    id: "diavola",
    name: "Diavola",
    category: "Specialty",
    price: 52,
    description: "Spicy salami, n'duja, chili flakes, mozzarella, tomato.",
    imageUrl: "/images/prod-4.jpg",
    tags: ["Spicy"],
  },
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

// Full menu grouped by category (dummy data — swap for API/admin later).
// `bestSeller` surfaces a badge within its category. `tags` reuse TAG_STYLES.
export const MENU_CATEGORIES = [
  {
    id: "classic",
    name: "Classic Pizzas",
    items: [
      { id: "margherita", name: "Margherita", price: 38, image: "/images/prod-1.jpg", description: "San Marzano tomato, fresh mozzarella, basil, EVOO.", tags: ["Vegetarian"], bestSeller: true },
      { id: "marinara", name: "Marinara", price: 34, image: "/images/prod-2.jpg", description: "Tomato, garlic, oregano, extra-virgin olive oil.", tags: ["Vegetarian"] },
      { id: "pepperoni", name: "Pepperoni Classico", price: 45, image: "/images/prod-3.jpg", description: "Double pepperoni, mozzarella, oregano.", tags: ["Spicy"], bestSeller: true },
      { id: "prosciutto", name: "Prosciutto e Rucola", price: 52, image: "/images/prod-4.jpg", description: "Parma ham, rocket, shaved parmesan, mozzarella." },
    ],
  },
  {
    id: "gourmet",
    name: "Gourmet Pizzas",
    items: [
      { id: "truffle-funghi", name: "Truffle Funghi", price: 58, image: "/images/prod-5.jpg", description: "Wild mushrooms, truffle cream, fontina, thyme.", tags: ["Vegetarian", "New"], bestSeller: true },
      { id: "quattro-formaggi", name: "Quattro Formaggi", price: 54, image: "/images/prod-1.jpg", description: "Mozzarella, gorgonzola, fontina, parmesan.", tags: ["Vegetarian"] },
      { id: "burrata-parma", name: "Burrata & Parma", price: 60, image: "/images/prod-2.jpg", description: "Creamy burrata, Parma ham, cherry tomato, basil.", tags: ["New"] },
    ],
  },
  {
    id: "specialty",
    name: "Specialty Pizzas",
    items: [
      { id: "diavola", name: "Diavola", price: 52, image: "/images/prod-3.jpg", description: "Spicy salami, n'duja, chili flakes, mozzarella.", tags: ["Spicy"], bestSeller: true },
      { id: "bbq-chicken", name: "BBQ Chicken", price: 50, image: "/images/prod-4.jpg", description: "Grilled chicken, BBQ sauce, red onion, mozzarella." },
      { id: "seafood", name: "Seafood Marinara", price: 62, image: "/images/prod-5.jpg", description: "Shrimp, calamari, mussels, garlic, parsley." },
    ],
  },
  {
    id: "vegetarian",
    name: "Vegetarian Pizzas",
    items: [
      { id: "garden-deluxe", name: "Garden Deluxe", price: 42, image: "/images/prod-1.jpg", description: "Peppers, olives, sweet corn, red onion, mozzarella.", tags: ["Vegetarian"], bestSeller: true },
      { id: "ortolana", name: "Ortolana", price: 44, image: "/images/prod-2.jpg", description: "Grilled courgette, aubergine, peppers, tomato.", tags: ["Vegetarian"] },
      { id: "spinach-ricotta", name: "Spinach & Ricotta", price: 46, image: "/images/prod-3.jpg", description: "Baby spinach, ricotta, garlic, mozzarella.", tags: ["Vegetarian"] },
    ],
  },
  {
    id: "gluten-free",
    name: "Gluten-Free",
    items: [
      { id: "gf-margherita", name: "GF Margherita", price: 42, image: "/images/prod-4.jpg", description: "Classic margherita on a gluten-free base.", tags: ["Vegetarian"], bestSeller: true },
      { id: "gf-pepperoni", name: "GF Pepperoni", price: 48, image: "/images/prod-5.jpg", description: "Double pepperoni on a gluten-free base.", tags: ["Spicy"] },
    ],
  },
  {
    id: "breakfast",
    name: "Breakfast",
    items: [
      { id: "shakshuka-pizza", name: "Shakshuka Pizza", price: 36, image: "/images/prod-1.jpg", description: "Baked eggs, spiced tomato, peppers, herbs.", bestSeller: true },
      { id: "egg-cheese-focaccia", name: "Egg & Cheese Focaccia", price: 30, image: "/images/prod-2.jpg", description: "Soft focaccia, scrambled egg, cheese.", tags: ["Vegetarian"] },
      { id: "breakfast-calzone", name: "Breakfast Calzone", price: 34, image: "/images/prod-3.jpg", description: "Folded pizza with egg, cheese & turkey." },
    ],
  },
  {
    id: "sides",
    name: "Sides",
    items: [
      { id: "garlic-bread", name: "Garlic Bread", price: 18, image: "/images/prod-4.jpg", description: "Wood-fired bread, garlic butter, herbs.", tags: ["Vegetarian"], bestSeller: true },
      { id: "truffle-fries", name: "Truffle Fries", price: 24, image: "/images/prod-5.jpg", description: "Crispy fries, truffle oil, parmesan.", tags: ["Vegetarian"] },
      { id: "artichoke-dip", name: "Artichoke Dip", price: 32, image: "/images/prod-1.jpg", description: "Creamy baked artichoke dip with flatbread.", tags: ["Vegetarian"] },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    items: [
      { id: "gelato", name: "Gelato", price: 25, image: "/images/prod-2.jpg", description: "Three scoops of artisan gelato.", bestSeller: true },
      { id: "tiramisu", name: "Tiramisu", price: 28, image: "/images/prod-3.jpg", description: "Espresso-soaked ladyfingers, mascarpone." },
      { id: "nutella-pizza", name: "Nutella Pizza", price: 30, image: "/images/prod-4.jpg", description: "Sweet dough, Nutella, powdered sugar.", tags: ["Vegetarian"] },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      { id: "lemonade", name: "Fresh Lemonade", price: 16, image: "/images/prod-5.jpg", description: "Fresh lemon, mint, a touch of sugar.", bestSeller: true },
      { id: "italian-soda", name: "Italian Soda", price: 14, image: "/images/prod-1.jpg", description: "Sparkling water, fruit syrup, ice." },
      { id: "hot-chocolate", name: "Hot Chocolate", price: 18, image: "/images/prod-2.jpg", description: "Rich Italian hot chocolate, whipped cream." },
    ],
  },
  {
    id: "combos",
    name: "Combos",
    items: [
      { id: "family-combo", name: "Family Combo", price: 99, image: "/images/prod-3.jpg", description: "2 pizzas, 2 sides & 4 drinks.", bestSeller: true },
      { id: "duo-deal", name: "Duo Deal", price: 65, image: "/images/prod-4.jpg", description: "2 pizzas + garlic bread." },
      { id: "solo-meal", name: "Solo Meal", price: 45, image: "/images/prod-5.jpg", description: "1 pizza, fries & a drink." },
    ],
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
