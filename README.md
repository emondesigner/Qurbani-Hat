# QurbaniHat — Livestock Booking Platform

**Assignment Category**: `category-A8-Pineapple`  
**Live URL**: [https://ais-dev-saep3qev4zsnb3gwzfteby-603458206596.asia-east1.run.app](https://ais-dev-saep3qev4zsnb3gwzfteby-603458206596.asia-east1.run.app)  
**Preview URL**: [https://ais-pre-saep3qev4zsnb3gwzfteby-603458206596.asia-east1.run.app](https://ais-pre-saep3qev4zsnb3gwzfteby-603458206596.asia-east1.run.app)  
**Repository**: [https://github.com/shabazmahamood/qurbanihat](https://github.com/shabazmahamood/qurbanihat)

---

## 1. Project Purpose & Overview

**QurbaniHat** is a modern, high-trust livestock marketplace and booking platform designed specifically for Eid-ul-Adha preparations. The platform connects ethical pastoral farmers with families and individuals seeking healthy, verified sacrificial animals (cows and goats).

Users can:
- **Explore & Browse**: View a curated catalog of verified livestock with authentic regional breeds (Deshi Shahi, Red Chittagong, Black Bengal, Sahiwal, Jamunapari, Brahman).
- **Inspect Specifications**: Review live body weight, certified age (meeting teeth requirements), breed origin, location, high-resolution photography, and descriptions.
- **Sort & Filter**: Dynamically sort animals by Price (Low to High, High to Low) and filter by Type (Cow/Goat) and Category (Large/Medium/Small Animal).
- **Secure Authentication**: Register and log in via email/password or one-click Google Authentication using a custom, server-side Google OAuth 2.0 authorization-code flow (Express).
- **Animal Booking**: Authenticated users can submit a livestock reservation request directly from the animal details page with complete input validation and instant feedback.
- **Profile Management**: Access a protected user profile, view current account credentials, and update display name and avatar photo.

*Note on Assignment Constraints: Booking data is a frontend-only demonstration. Submitting the form resets the fields and presents a success notification without persisting records to databases or localStorage.*

---

## 2. Key Features

- **Responsive Navbar & Navigation**: Sticky header with custom livestock logo, navigation links, active route highlights, user dropdown menu, and mobile drawer.
- **Hero Banner**: Engaging visual presentation featuring Eid livestock branding, key guarantees, and direct CTA buttons with Animate.css entry effects.
- **Featured Animals**: Highlights 4 prime sacrificial animals directly loaded from `data/animals.json`.
- **Informative Qurbani Tips**: Sunnah and veterinary guidance covering health signs, age validation (two teeth), transit planning, and religious consultations.
- **Top Breeds Showcase**: Educational breakdown of prominent cattle and goat breeds across Bangladesh.
- **Why Choose QurbaniHat (Extra Section)**: Key pillars of transparency, direct hat pricing, responsive UX, and clear demonstration notices.
- **All Animals Directory (`/animals`)**: Comprehensive catalog with responsive grid (1-col mobile, 2-col tablet, 3/4-col desktop), price sorting dropdown, multi-attribute filtering, search, and empty-state handling.
- **Animal Details Page (`/details-page/:id`)**: High-resolution image showcase, full health verification badge, specifications, and integrated booking form. Invalid animal IDs display a helpful custom recovery screen.
- **Interactive Booking Form**: Form with live validation for name, email, phone, and delivery address. Protected for authenticated users with automatic pre-filling and instant toast confirmation.
- **Google OAuth & Email/Password Auth**: Registration (`/register`), Login (`/login`), Google OAuth button (custom Express server-side flow), session persistence, and secure logout.
- **My Profile (`/my-profile`)**: Protected user account dashboard displaying avatar, full name, and email.
- **Update Information (`/my-profile/update`)**: Protected interface allowing user updates for Name and Photo URL with read-only email protection.
- **Animation Package**: Implemented via `animate.css` across Hero, Animal Cards, CTA, and Profile cards with motion accessibility.
- **Toast System**: Powered by `sonner` providing rich feedback for logins, registrations, updates, validations, and bookings.
- **Loading & Skeleton States**: Fluid loaders and skeleton placeholders for seamless perceived performance.
- **Custom 404 Not Found Page**: Illustrated error page with recovery buttons to Home and All Animals.

---

## 3. Technology Stack

- **Framework**: React 19 with Vite & TypeScript
- **Styling**: Tailwind CSS v4 & Lucide React icons
- **Animations**: `animate.css` & `motion`
- **Authentication**: Custom Google OAuth 2.0 (Express server-side) + client-side email/password demo sessions
- **Toast Notifications**: `sonner`
- **Data Source**: `data/animals.json`
- **Fonts**: Outfit (Headings) & Plus Jakarta Sans (Body)

---

## 4. Application Routes

| Route | Type | Description |
|---|---|---|
| `/` | Public | Homepage with Hero, Featured Animals, Tips, Breeds, and CTA |
| `/animals` | Public | Full marketplace catalog with sorting and filters |
| `/details-page/:id` | Public / Action | Individual animal details and booking form |
| `/login` | Public | User login with email/password and Google OAuth |
| `/register` | Public | Account registration with email/password and Google |
| `/my-profile` | Protected | User profile details (requires authentication) |
| `/my-profile/update` | Protected | Update profile name and avatar image |
| `/*` (unmatched) | Public | Custom 404 Page Not Found |

---

## 5. Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shabazmahamood/qurbanihat.git
   cd qurbanihat
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Then replace `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with your real
   Google Cloud OAuth credentials (see section 6).

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 6. Environment Variables

The following environment variables are documented in `.env.example`:

```env
# Google OAuth 2.0 (custom server-side flow — required for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional
GEMINI_API_KEY=""
APP_URL=https://your-vercel-app.vercel.app
```

**Google Cloud Console setup** (for OAuth credentials):
1. Open <https://console.cloud.google.com/apis/credentials>.
2. Click **+ CREATE CREDENTIALS → OAuth client ID**, Application type = **Web application**.
3. Add the **Authorized JavaScript origin**: `http://localhost:3000`
4. Add the **Authorized redirect URI** (must match exactly):
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Copy the Client ID into `GOOGLE_CLIENT_ID` and the Client Secret into
   `GOOGLE_CLIENT_SECRET` inside `.env.local`, then restart `npm run dev`.

---

## 7. QA & Verification Checklist

- [x] Assignment Category confirmed as `category-A8-Pineapple`.
- [x] Project name styled consistently as **QurbaniHat**.
- [x] Responsive layout verified at 320px, 375px, 768px, 1024px, and 1440px.
- [x] Price sorting (Low to High, High to Low) dynamically updates animals.
- [x] Booking form requires authentication, validates fields, shows success toast, and resets without database writes.
- [x] Profile page and update page protected; email remains read-only.
- [x] Animate.css active on Hero, Cards, CTA, and Profile.
- [x] Custom 404 page handles invalid routes and unknown animal IDs.
- [x] Build passes with zero compilation or lint errors (`npm run build`, `npm run lint`).
