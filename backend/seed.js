// Seeds the first admin user, the menu categories and a starter menu.
// Run with: npm run seed  (this RESETS categories + menu items).
require("dotenv").config();
const connectDB = require("./config/database");
const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Category = require("./models/Category");
const mongoose = require("mongoose");

const CATEGORIES = [
  "Pizza",
  "Breakfast",
  "Sandwich",
  "Salads",
  "Speciality Coffee",
  "Tea & Infusions",
  "Refreshers & Coolers",
  "Starters",
  "Gluten-Free",
].map((name, i) => ({ name, order: i + 1 }));

const ITEMS = [
  // Pizza
  { name: "Margherita", category: "Pizza", price: 38, description: "San Marzano tomato, fresh mozzarella, basil, extra-virgin olive oil.", imageUrl: "/images/prod-1.jpg", tags: ["Vegetarian"], bestSeller: true },
  { name: "Pepperoni Classico", category: "Pizza", price: 45, description: "Double pepperoni, mozzarella, oregano on a hand-stretched crust.", imageUrl: "/images/prod-2.jpg", tags: ["Spicy"] },
  { name: "Truffle Funghi", category: "Pizza", price: 58, description: "Wild mushrooms, truffle cream, fontina, thyme, shaved parmesan.", imageUrl: "/images/prod-3.jpg", tags: ["Vegetarian", "New"] },
  // Breakfast
  { name: "Shakshuka", category: "Breakfast", price: 32, description: "Baked eggs in spiced tomato & pepper sauce, served with bread.", imageUrl: "/images/prod-4.jpg", tags: ["Vegetarian"], bestSeller: true },
  { name: "Avocado Toast", category: "Breakfast", price: 28, description: "Sourdough, smashed avocado, cherry tomato, chilli flakes.", imageUrl: "/images/prod-5.jpg", tags: ["Vegetarian"] },
  // Sandwich
  { name: "Grilled Chicken Panini", category: "Sandwich", price: 34, description: "Grilled chicken, mozzarella, pesto on ciabatta.", imageUrl: "/images/prod-1.jpg", bestSeller: true },
  { name: "Caprese Sandwich", category: "Sandwich", price: 30, description: "Tomato, mozzarella, basil, balsamic glaze.", imageUrl: "/images/prod-2.jpg", tags: ["Vegetarian"] },
  // Salads
  { name: "Classic Caesar", category: "Salads", price: 32, description: "Romaine, parmesan, croutons, Caesar dressing.", imageUrl: "/images/prod-3.jpg", bestSeller: true },
  { name: "Caprese Salad", category: "Salads", price: 30, description: "Tomato, buffalo mozzarella, fresh basil.", imageUrl: "/images/prod-4.jpg", tags: ["Vegetarian"] },
  // Speciality Coffee
  { name: "Cappuccino", category: "Speciality Coffee", price: 16, description: "Espresso, steamed milk, velvety foam.", imageUrl: "/images/prod-5.jpg" },
  { name: "Spanish Latte", category: "Speciality Coffee", price: 20, description: "Espresso, condensed milk, steamed milk.", imageUrl: "/images/prod-1.jpg", bestSeller: true },
  // Tea & Infusions
  { name: "Karak Chai", category: "Tea & Infusions", price: 10, description: "Spiced milk tea, cardamom, saffron.", imageUrl: "/images/prod-2.jpg", bestSeller: true },
  { name: "Moroccan Mint", category: "Tea & Infusions", price: 14, description: "Green tea, fresh mint, light honey.", imageUrl: "/images/prod-3.jpg" },
  // Refreshers & Coolers
  { name: "Lemon & Mint Cooler", category: "Refreshers & Coolers", price: 16, description: "Fresh lemon, mint, a touch of sugar.", imageUrl: "/images/prod-4.jpg", bestSeller: true },
  { name: "Berry Refresher", category: "Refreshers & Coolers", price: 18, description: "Mixed berries, sparkling water, ice.", imageUrl: "/images/prod-5.jpg" },
  // Starters
  { name: "Garlic Bread", category: "Starters", price: 18, description: "Oven-baked bread, garlic butter, herbs.", imageUrl: "/images/prod-1.jpg", tags: ["Vegetarian"], bestSeller: true },
  { name: "Bruschetta", category: "Starters", price: 22, description: "Toasted bread, tomato, basil, extra-virgin olive oil.", imageUrl: "/images/prod-2.jpg", tags: ["Vegetarian"] },
  // Gluten-Free
  { name: "Gluten-Free Margherita", category: "Gluten-Free", price: 42, description: "Our classic Margherita on a gluten-free base.", imageUrl: "/images/prod-3.jpg", tags: ["Gluten-Free", "Vegetarian"], bestSeller: true },
  { name: "Gluten-Free Brownie", category: "Gluten-Free", price: 24, description: "Rich chocolate brownie, naturally gluten-free.", imageUrl: "/images/prod-4.jpg", tags: ["Gluten-Free"] },
];

(async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@miopizzeria.qa";
  const password = process.env.ADMIN_PASSWORD || "changeme123";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin ${email} already exists — skipping.`);
  } else {
    await User.create({ email, password, role: "admin" });
    console.log(`✔ Created admin: ${email}`);
  }

  // Reset categories + menu items to the starter set.
  await Category.deleteMany({});
  await Category.insertMany(CATEGORIES);
  console.log(`✔ Seeded ${CATEGORIES.length} categories`);

  await MenuItem.deleteMany({});
  await MenuItem.insertMany(ITEMS);
  console.log(`✔ Seeded ${ITEMS.length} menu items`);

  await mongoose.connection.close();
  process.exit(0);
})();