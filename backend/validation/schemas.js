const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const menuItemSchema = z.object({
  name: z.string().min(1).max(50),
  category: z.enum(["Classic", "Gourmet", "Specialty", "Vegetarian"]),
  price: z.number().positive(),
  description: z.string().min(1).max(200),
  imageUrl: z.string().url(),
  tags: z.array(z.enum(["Vegetarian", "Spicy", "New"])).optional().default([]),
  status: z.enum(["Active", "Inactive"]).optional().default("Active"),
  order: z.number().optional().default(0),
});

module.exports = { loginSchema, menuItemSchema };
