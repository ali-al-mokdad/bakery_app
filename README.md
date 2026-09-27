# 🥐 Sweet Crumb Bakery — Full-Stack Bakery Menu Website

A complete, production-ready full-stack bakery website with a public menu/showcase site and a
protected admin CMS. Built with React + Vite + Tailwind on the frontend and Node.js + Express +
Prisma + SQLite on the backend. Pure JavaScript — no TypeScript, no Supabase/Firebase.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios
**Backend:** Node.js, Express.js, REST API
**Database:** SQLite via Prisma ORM
**Auth:** JWT (admin-only — customers never need an account)
**Uploads:** Multer, stored in `server/uploads/`

## Project Structure

```
bakery-app/
├── server/     # Express + Prisma + SQLite backend
└── client/     # React + Vite + Tailwind frontend
```

---

## 1. Prerequisites

- Node.js 18+ and npm installed

---

## 2. Backend Setup

```bash
cd server
npm install
```

### Configure environment variables

The project already includes a working `server/.env` for local development. Review/edit it if needed:

```env
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="change_this_secret_in_production_please"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
ADMIN_EMAIL="admin@bakery.com"
ADMIN_PASSWORD="Admin123!"
```

> ⚠️ Change `JWT_SECRET` and `ADMIN_PASSWORD` before deploying to production.
> `ADMIN_EMAIL` / `ADMIN_PASSWORD` are only used the **first time** you run the seed script to
> create the single administrator account.

### Set up the database (Prisma + SQLite)

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This creates `server/dev.db` (SQLite file) and generates the Prisma client.

### Seed the database

```bash
npm run seed
```

This creates:
- One administrator account (from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`)
- Several example categories (Croissants, Cakes, Bread, Donuts, Cookies, Pies)
- Several example products (with placeholder images)
- Default website settings (business name, opening hours, currency, etc.)

You can re-run `npm run seed` safely — it skips records that already exist.

### Start the backend

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

The API runs at **http://localhost:4000**. Uploaded images are served from
`http://localhost:4000/uploads/<filename>`.

---

## 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The site runs at **http://localhost:5173**. In development, Vite proxies `/api` and `/uploads`
requests to the backend at `http://localhost:4000` (see `client/vite.config.js`), so you don't
need to configure CORS URLs manually while developing.

- Public website: `http://localhost:5173/`
- Admin login: `http://localhost:5173/admin/login`

Log in with the admin credentials from your `.env` (default: `admin@bakery.com` / `Admin123!`).

---

## 4. Environment Variables Reference

### Backend (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on (default `4000`) |
| `DATABASE_URL` | SQLite connection string used by Prisma |
| `JWT_SECRET` | Secret used to sign JWTs — **change this in production** |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by the seed script to create the admin account |

### Frontend (`client/.env`, optional)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL. Leave unset in dev (Vite proxy handles it). In production, set this to your deployed API origin, e.g. `https://api.yourbakery.com` |

---

## 5. Uploaded Images

All uploaded images (products, categories, gallery, logo, cover image) are stored as physical
files in `server/uploads/` and served statically at `/uploads/<filename>`. Only the relative path
(e.g. `/uploads/image-123.webp`) is stored in the SQLite database.

When an image is replaced or its parent record (product/category/gallery item) is deleted, the
physical file on disk is automatically deleted too.

Do not commit the contents of `server/uploads/` (already covered by `.gitignore`) — only
`.gitkeep` is tracked.

---

## 6. Managing the Administrator Account

There is intentionally **only one** administrator account, and there is **no public registration
endpoint** — this is a single-owner bakery CMS, not a multi-tenant system.

- **Create the first admin:** handled automatically by `npm run seed` using `ADMIN_EMAIL` /
  `ADMIN_PASSWORD` from `server/.env`.
- **Change the admin password:** log in to `/admin/login`, then go to **Change Password** in the
  admin sidebar.
- **Reset a forgotten password:** easiest way is to open Prisma Studio and update the user, or
  delete `server/dev.db`, re-run migrations and seed with a new `ADMIN_PASSWORD`:

  ```bash
  npx prisma studio
  ```

---

## 7. REST API Overview

All endpoints are prefixed with `/api`.

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me                (protected)
POST   /api/auth/change-password   (protected)

GET    /api/categories
GET    /api/categories/:id
POST   /api/categories             (protected)
PUT    /api/categories/:id         (protected)
DELETE /api/categories/:id         (protected)
PUT    /api/categories/reorder     (protected)

GET    /api/menu
GET    /api/menu/:id
POST   /api/menu                   (protected)
PUT    /api/menu/:id               (protected)
DELETE /api/menu/:id               (protected)
PUT    /api/menu/reorder           (protected)

GET    /api/gallery
GET    /api/gallery/:id
POST   /api/gallery                (protected)
PUT    /api/gallery/:id            (protected)
DELETE /api/gallery/:id            (protected)
PUT    /api/gallery/reorder        (protected)

GET    /api/settings
PUT    /api/settings               (protected)

POST   /api/uploads/image          (protected)
POST   /api/uploads/multiple       (protected)
DELETE /api/uploads/:filename      (protected)
```

Protected routes require an `Authorization: Bearer <token>` header. Public `GET` routes only
return visible/available items by default; when called with a valid admin token and `?all=true`,
they return everything (including hidden/unavailable items) for the CMS tables.

---

## 8. Building for Production

### Backend

The backend runs as-is with `npm start` (no build step needed for plain Node/Express). For
production:

1. Set strong values for `JWT_SECRET` and `ADMIN_PASSWORD` in `.env`.
2. Run `npx prisma migrate deploy` to apply migrations.
3. Run `npm run seed` once to create the admin account (if not already created).
4. Start with a process manager, e.g. `pm2 start server.js` or your platform's Node runtime.
5. Make sure `server/uploads/` is a persistent writable directory on your host.

### Frontend

```bash
cd client
npm run build
```

This outputs a static bundle to `client/dist/`. Set `VITE_API_URL` (in `client/.env` before
building) to your deployed backend's URL, then serve `client/dist/` with any static host
(Nginx, Vercel, Netlify, etc.), making sure to configure SPA fallback routing to `index.html`.

---

## 9. Features Recap

**Public site:** Home (hero, featured products, about, categories, gallery preview, contact CTA),
Menu (search + category filter + product grid), product details modal with WhatsApp ordering,
Gallery with lightbox, Contact page with map, socials, and WhatsApp. Dark/light mode (saved to
`localStorage`). Fully responsive.

**Admin CMS:** JWT-protected login, dashboard with summary stats, full CRUD for categories,
products, and gallery images (with image upload/replace/delete, feature/hide/available toggles,
and simple up/down reordering), Website Settings (branding, contact info, socials, maps embed,
opening hours, currency), and password change.
