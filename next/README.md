# QurbaniHat (Next.js) — Livestock Booking Platform

**Assignment Category**: `category-A8-Pineapple`

**Live URL**: `https://your-live-url.vercel.app` *(update after Vercel deployment)*
**Vite version (existing work)**: see the repository-root `README.md`

---

## 1. Purpose

QurbaniHat is a modern, trustworthy livestock marketplace for Eid-ul-Adha. Buyers can browse
verified cows and goats, sort and filter the catalogue, open a full animal details page with
health and Qurbani-suitability information, and — once signed in — submit a booking request.
Authentication is handled by **Better Auth** (email/password + Google OAuth) with user data
persisted in **MongoDB**.

Booking submissions for this assignment are frontend-only: the form validates input, shows a
loading state, fires a success toast and resets — nothing is written to MongoDB or localStorage.

## 2. Routes

| Route                 | Access        | Description                                             |
| --------------------- | ------------- | ------------------------------------------------------- |
| `/`                   | Public        | Hero, featured animals, Qurbani tips, breeds, why-us    |
| `/animals`            | Public        | Full catalogue with type/size/price filters and sorting |
| `/details-page/[id]`  | Auth required | Animal details + health info + booking form             |
| `/login`              | Guest         | Email/password login + Google button                    |
| `/register`           | Guest         | Name/email/photo/password registration + Google button  |
| `/my-profile`         | Auth required | Profile card with avatar, name, email, logout           |
| `/my-profile/update`  | Auth required | Update name + image via Better Auth                     |
| `/api/animals`        | Public        | JSON catalogue (static dataset, no DB writes)           |
| `/api/auth/[...all]`  | Public        | Better Auth route handler                               |
| `not-found.tsx`       | Public        | Custom 404 with Back Home / Browse Animals              |

Unauthenticated visits to private routes are redirected to
`/login?redirect=<original-path>`; after login the app returns to the intended page.

## 3. Authentication setup (Better Auth + MongoDB)

- Server instance: `lib/auth.ts` — MongoDB adapter with a cached `MongoClient`
  (`lib/mongodb.ts`), email/password (minimum 6 characters, `autoSignIn: false` so
  registration lands on `/login`), Google OAuth (enabled only when
  `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set), 7-day sessions via the
  `nextCookies()` plugin. No email verification, no forgot-password (per assignment).
- Browser client: `lib/auth-client.ts` (`better-auth/react`).
- Authoritative server session check: `lib/session.ts` (`auth.api.getSession`).
- Route protection: `proxy.ts` redirects guests away from `/details-page/*` and
  `/my-profile*`, forwards logged-in users away from `/login` and `/register`, and always
  lets `/api/auth/*` through.
- URLs are never hardcoded: `lib/app-url.ts` normalises `BETTER_AUTH_URL` /
  `NEXT_PUBLIC_APP_URL` (rewriting bind-only hosts such as `0.0.0.0` to `localhost`) and
  builds trusted origins. On Vercel the production origin is derived from
  `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL`.


## 4. Environment variables

Copy the template and fill in real values:

```bash
cp .env.example .env.local
```

| Variable               | Required                    | Notes                                                   |
| ---------------------- | --------------------------- | ------------------------------------------------------- |
| `MONGODB_URI`          | Yes                         | Atlas connection string (keep the DB name in it or set `MONGODB_DB`) |
| `MONGODB_DB`           | No (default `qurbanihat`)   | Database name                                           |
| `BETTER_AUTH_SECRET`   | Yes                         | Random 32+ byte hex: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `BETTER_AUTH_URL`      | Yes                         | Local: `http://localhost:3000` · Prod: `https://<your-domain>` — never `0.0.0.0` |
| `NEXT_PUBLIC_APP_URL`  | Yes                         | Same value as `BETTER_AUTH_URL`                         |
| `GOOGLE_CLIENT_ID`     | For Google login            | Google Cloud Console → OAuth client ID (Web)            |
| `GOOGLE_CLIENT_SECRET` | For Google login            | Same place — server-side only                           |

Google Console: add `http://localhost:3000` to authorised JavaScript origins and
`http://localhost:3000/api/auth/callback/google` (plus the production equivalents) to
authorised redirect URIs. The "Continue with Google" button stays hidden while the
credentials are empty.

## 5. Getting started

```bash
cd next
npm install
npm run dev        # local:  http://localhost:3000
npm run dev:lan    # LAN/tunnel access (binds 0.0.0.0; still browse via localhost)
```

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run build      # next build
npm start          # serve the production build
```

## 6. Features

Livestock marketplace · all-animals browsing · price sorting (low→high / high→low) ·
type / category / location / price-band filters + search · animal details with health and
Qurbani-suitability info · frontend-only booking form with validation · Better Auth
email/password + Google OAuth · protected routes · profile page · profile update ·
responsive mobile/tablet/desktop design · Sonner toast notifications · skeleton + spinner
loading states · custom 404 · React Spring entrance animations · accessible forms/buttons ·
SEO metadata.

## 7. Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Better Auth ·
MongoDB (native driver via Better Auth adapter) · Google OAuth · Sonner · React Spring
(`@react-spring/web`) · Lucide React · clsx + tailwind-merge.

## 8. Deployment (Vercel)

1. Import the repository, set **Root Directory** to `next`.
2. Add the production env vars (`BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` =
   `https://<your-domain>`, plus `MONGODB_URI`, `BETTER_AUTH_SECRET`,
   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
3. Atlas: allow Vercel IPs (or `0.0.0.0/0` for the assignment) under Network Access.
4. Google Console: add the production origin and
   `https://<your-domain>/api/auth/callback/google` redirect.
5. Deploy, then replace the Live URL placeholder at the top of this file.
