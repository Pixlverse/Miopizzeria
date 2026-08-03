require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/menu-items", require("./routes/menuItems"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/party-orders", require("./routes/partyOrders"));
app.use("/api/users", require("./routes/users"));

// 404 + error handling
app.use((req, res) => res.status(404).json({ message: "Not found" }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`✔ API listening on http://localhost:${PORT}`));
});
