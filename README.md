# Miopizzeria Qatar

Premium restaurant website (MERN stack). Next.js 14 frontend + Express/MongoDB backend.

## Structure

```
MIOpizzeria/
├── frontend/   # Next.js 14 (pages router), Tailwind, GSAP, Framer Motion
└── backend/    # Express, Mongoose, JWT auth
```

## Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

Design tokens live in `tailwind.config.js` + `src/styles/variables.css`.
Brand palette: rust `#AB4C35`, cream `#FEDCBD`, neutral `#DCDDDE`.

Until the API is wired in, pages render from mock data in `src/utils/constants.js`.

## Backend

```bash
cd backend
cp .env.example .env      # then fill in MONGODB_URI, JWT_SECRET, etc.
npm install
npm run seed              # creates first admin + sample menu items
npm run dev               # http://localhost:5000
```

Requires a running MongoDB (local or MongoDB Atlas).

### API

| Method | Endpoint              | Auth  |
| ------ | --------------------- | ----- |
| POST   | /api/auth/login       | —     |
| POST   | /api/auth/refresh     | —     |
| GET    | /api/menu-items       | —     |
| GET    | /api/menu-items/:id   | —     |
| POST   | /api/menu-items       | admin |
| PUT    | /api/menu-items/:id   | admin |
| DELETE | /api/menu-items/:id   | admin |
| GET    | /api/categories       | —     |
| GET    | /api/settings         | —     |
| PUT    | /api/settings         | admin |

## Status

- [x] Project scaffold (frontend + backend)
- [x] Design system (colors, fonts, Tailwind config, animations)
- [x] Home page (hero w/ parallax, featured menu, delivery, testimonials, location, footer)
- [x] Backend API + models + JWT auth + seed
- [ ] Menu page with category filtering (live data)
- [ ] Item details page (slice-joining animation)
- [ ] Contact form
- [ ] Admin panel (login, dashboard, CRUD)
- [ ] Cloudinary image uploads
- [ ] Deployment config
```
