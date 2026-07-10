// Seeds the first admin user and a few sample menu items.
// Run with: npm run seed
require("dotenv").config();
const connectDB = require("./config/database");
const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const mongoose = require("mongoose");

const SAMPLE_ITEMS = [
  {
    name: "Margherita",
    category: "Classic",
    price: 38,
    description: "San Marzano tomato, fresh mozzarella, basil, extra-virgin olive oil.",
    imageUrl:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian"],
  },
  {
    name: "Pepperoni Classico",
    category: "Classic",
    price: 45,
    description: "Double pepperoni, mozzarella, oregano on a wood-fired crust.",
    imageUrl:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    tags: ["Spicy"],
  },
  {
    name: "Truffle Funghi",
    category: "Gourmet",
    price: 58,
    description: "Wild mushrooms, truffle cream, fontina, thyme, shaved parmesan.",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian", "New"],
  },
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

  for (const item of SAMPLE_ITEMS) {
    await MenuItem.updateOne({ name: item.name }, { $setOnInsert: item }, { upsert: true });
  }
  console.log(`✔ Seeded ${SAMPLE_ITEMS.length} sample menu items`);

  await mongoose.connection.close();
  process.exit(0);
})();
