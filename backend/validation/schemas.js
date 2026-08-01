const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const menuItemSchema = z.object({
  name: z.string().min(1).max(80),
  category: z.string().min(1).max(60),
  price: z.coerce.number().min(0),
  description: z.string().max(300).optional().default(""),
  imageUrl: z.string().max(500).optional().default(""),
  tags: z.array(z.string().max(30)).optional().default([]),
  bestSeller: z.boolean().optional().default(false),
  status: z.enum(["Active", "Inactive"]).optional().default("Active"),
  order: z.coerce.number().optional().default(0),
});

const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const bookingSchema = z.object({
  name: z.string().min(1).max(80),
  phone: z.string().min(6).max(30),
  date: z.coerce.date(),
  time: z.string().min(1).max(10),
  guests: z.number().int().min(1).max(50),
});

const partyOrderSchema = z.object({
  name: z.string().min(1).max(80),
  phone: z.string().min(6).max(30),
  date: z.string().max(40).optional(),
  guests: z.coerce.number().int().positive().max(1000).optional(),
  type: z.string().max(60).optional(),
  message: z.string().max(1000).optional(),
});

module.exports = {
  loginSchema,
  menuItemSchema,
  bookingSchema,
  partyOrderSchema,
  userCreateSchema,
};
