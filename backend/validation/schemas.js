const { z } = require("zod");
const { ALL_SLOTS, isClosedDay, closedDaysLabel } = require("../config/reservations");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const menuItemSchema = z.object({
  name: z.string().min(1).max(80),
  nameAr: z.string().max(120).optional().default(""),
  category: z.string().min(1).max(60),
  productCode: z.string().max(40).optional().default(""),
  remarks: z.string().max(200).optional().default(""),
  price: z.coerce.number().min(0),
  description: z.string().max(300).optional().default(""),
  descriptionAr: z.string().max(400).optional().default(""),
  imageUrl: z.string().max(500).optional().default(""),
  imagePublicId: z.string().max(300).optional().default(""),
  tags: z.array(z.string().max(30)).optional().default([]),
  bestSeller: z.boolean().optional().default(false),
  status: z.enum(["Active", "Inactive"]).optional().default("Active"),
  order: z.coerce.number().optional().default(0),
});

const galleryImageSchema = z.object({
  imageUrl: z.string().min(1).max(500),
  publicId: z.string().max(300).optional().default(""),
  alt: z.string().max(160).optional().default(""),
  status: z.enum(["Active", "Inactive"]).optional().default("Active"),
  order: z.coerce.number().optional(),
});

const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// The UI blocks closed days and invalid slots, but the endpoint is public —
// so the same rules are enforced here rather than trusted from the client.
const bookingSchema = z
  .object({
    name: z.string().min(1).max(80),
    phone: z.string().min(6).max(30),
    date: z.coerce.date(),
    time: z.enum(ALL_SLOTS),
    guests: z.coerce.number().int().min(1).max(50),
  })
  .refine((b) => !isClosedDay(b.date), {
    path: ["date"],
    message: `We don't take reservations on ${closedDaysLabel()} — walk-ins only on those days.`,
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
  galleryImageSchema,
  bookingSchema,
  partyOrderSchema,
  userCreateSchema,
};
