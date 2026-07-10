const mongoose = require("mongoose");

const dayHoursSchema = new mongoose.Schema(
  { open: String, close: String },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, default: "Miopizzeria" },
    phone: String,
    email: String,
    address: String,
    hours: {
      monday: dayHoursSchema,
      tuesday: dayHoursSchema,
      wednesday: dayHoursSchema,
      thursday: dayHoursSchema,
      friday: dayHoursSchema,
      saturday: dayHoursSchema,
      sunday: dayHoursSchema,
    },
    socialLinks: {
      instagram: String,
      facebook: String,
      whatsapp: String,
    },
    deliveryPlatforms: {
      snoonu: String,
      talabat: String,
      rafeeq: String,
      keeta: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
