# ✈️ SkyBook — Premium Flight Ticket Booking Engine

SkyBook is a production-grade, visually stunning global flight ticket booking web application built with a modern aviation meets glassmorphism aesthetic. It integrates with real-time flight inventory (Duffel API test mode + high-fidelity aviation fallback), offers encrypted biometric checkouts, downloadable PDF boarding passes, and transparent flight management.

---

## 🌟 Key Features

1. **Aviation Meets Glassmorphism Aesthetic**:
   - Refined frosted glass surfaces, subtle sky gradients, aviation navy accents.
   - Confident typography pairing **Plus Jakarta Sans** (display) and **Inter** (body).
   - Animated flight route graphics with duration indicators and layover warnings.
   - Dark and light theme toggle with persistent preference.

2. **Real-time Global Flight Search**:
   - Provider adapter architecture (`services/flightProvider/`) supporting the **Duffel API** (test mode) and high-fidelity GDS simulation.
   - One-way and Round-trip flight searches.
   - Real-time airport and city autocomplete with in-memory TTL caching.
   - Multi-passenger support (Adults, Children, Infants) and cabin class selection (Economy, Premium Economy, Business, First).
   - Interactive filtering (stops, airlines, price range, departure time) and sorting (Cheapest, Fastest, Best Match, Departure).
   - Detailed flight drawer/modal with aircraft specifications, baggage allowances, and fare refundability rules.

3. **Secure Auth & State Preservation**:
   - Short-lived JWT access tokens + rotating refresh tokens stored in secure, `httpOnly` cookies.
   - Protected route access: Travelers can search and explore flights publicly; selecting a flight redirects unauthenticated users to Login/Register and seamlessly returns them to their exact flight draft upon login.
   - Quick 1-click test credentials for reviewers (`alex@skybook.com` / `admin@skybook.com`).

4. **Frictionless 4-Step Booking Flow**:
   - **Step 1: Passengers**: Title, names, DOB, passport details, seat assignments, and 1-click profile autofill.
   - **Step 2: Review**: Comprehensive breakdown of itinerary slices, baggage guarantees, and fare policies.
   - **Step 3: Payment**: Sandbox test card tokenization with Stripe or mock provider.
   - **Step 4: Confirmation**: Celebratory confetti animation, PNR booking reference (e.g. `SKY-8X4K9L`), and instant IATA-compliant downloadable PDF e-ticket.

5. **My Bookings & Traveler Profile**:
   - Upcoming, Past, and Cancelled flight itineraries.
   - Download official boarding pass PDF on demand.
   - Self-service 1-click booking cancellation.
   - Saved frequent traveler passport management for instant booking autofill.

---

## 🛠️ Tech Stack

- **Backend**: Node.js (v20+), Express, ES Modules (`"type": "module"`)
- **Database**: MySQL 8 via Docker (`port 3307`), Prisma ORM with migrations & seed script
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide icons, Framer Motion
- **Data & State**: TanStack Query (v5), Zustand (auth & booking draft), React Hook Form, Zod
- **Security**: Helmet, CORS allow-list, rate limiting, bcryptjs password hashing, secure httpOnly cookies
- **E-Tickets**: PDFKit server-side boarding pass generator

---

## 📁 Monorepo Folder Architecture

```
skybook/
├── README.md
├── package.json              (npm workspaces: client, server)
├── .gitignore
├── docker-compose.yml        (MySQL 8 service on port 3307)
├── client/
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.ts
│   └── src/
│       ├── app/              (router, providers, layouts)
│       ├── components/
│       │   ├── ui/           (shadcn button, input, card, badge)
│       │   ├── common/       (Navbar, Footer, Logo, ThemeToggle)
│       │   └── motion/
│       ├── features/
│       │   ├── auth/         (store, api, hooks, LoginForm, RegisterForm, ProtectedRoute)
│       │   ├── flights/      (FlightSearchWidget, AirportAutocomplete, FlightCard, FlightFilters, DetailsModal)
│       │   ├── booking/      (stepper, PassengerFormStep, ReviewStep, PaymentStep, ConfirmationStep)
│       │   └── profile/      (EditProfileForm, SavedPassengersManager, ChangePasswordForm)
│       ├── pages/            (HomePage, FlightResultsPage, BookingPage, BookingsPage, ProfilePage, LoginPage, RegisterPage)
│       ├── lib/              (axios instance with automatic refresh interceptor)
│       └── styles/           (globals.css with aviation glassmorphism tokens)
└── server/
    ├── .env.example
    ├── prisma/
    │   ├── schema.prisma     (User, RefreshToken, Passenger, Booking, BookingPassenger, BookingSegment, Payment, SearchHistory)
    │   └── seed.js           (Seeds demo traveler & admin accounts)
    └── src/
        ├── config/           (env validation via Zod, Prisma client, logger)
        ├── modules/
        │   ├── auth/         (signup, login, refresh rotation, logout, reset password)
        │   ├── flights/      (search, autocomplete, popular routes, offer details)
        │   ├── bookings/     (booking reservation, cancel, PDF boarding pass generation)
        │   ├── payments/     (payment processing, transaction ledger)
        │   └── users/        (profile editing, saved passengers management)
        ├── services/
        │   └── flightProvider/ (FlightProvider interface, DuffelFlightProvider, SimulatedFlightProvider, cache)
        ├── middlewares/      (auth, errorHandler, rateLimiter, validate)
        ├── utils/            (ApiError, asyncHandler, sendSuccess, sendError)
        ├── app.js
        └── server.js
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v20+
- Docker & Docker Compose

### 2. Database Setup (Docker MySQL)
Start the MySQL container (mapped to port 3307):
```bash
docker compose up -d
```
*(Or use your existing container running in `/home/tushar/personal/db/mysql`)*

### 3. Environment Configuration
Verify `server/.env` and `client/.env`:

`server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="mysql://mysql:mysql123@localhost:3307/skybook_db"

JWT_ACCESS_SECRET=skybook_access_secret_development_key_ultra_secure_2026_pass
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=skybook_refresh_secret_development_key_ultra_secure_2026_pass
JWT_REFRESH_EXPIRES_IN=7d

# Optional: Add your live Duffel Test API token (e.g. duffel_test_...)
# If left empty, SkyBook automatically uses its built-in high-fidelity GDS simulation
DUFFEL_API_TOKEN=

# Optional: Stripe Secret Key for live sandbox test cards
STRIPE_SECRET_KEY=

COOKIE_SECRET=skybook_cookie_secret_dev_key_super_safe
```

`client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Migration & Seed
Run Prisma migrations and seed default users and sample itineraries:
```bash
npm run db:migrate --workspace=server
npm run db:seed --workspace=server
```

### 5. Running the Application
To run both backend API server and frontend client concurrently:
```bash
npm run dev
```

Or run individually:
```bash
npm run dev:server   # Starts API at http://localhost:5000
npm run dev:client   # Starts Vite React App at http://localhost:5173
```

---

## 🔑 Demo Customer Credentials

For fast review, a 1-click login button is provided on the login page:

| Role | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- |
| **Customer Traveler** | `alex@skybook.com` | `Password@123` | Saved frequent travelers (Alex & Elena Morgan), Confirmed JFK → LHR Booking |

---

## 📡 API Reference Overview

### Auth (`/api/auth`)
- `POST /api/auth/register` — Create new traveler account
- `POST /api/auth/login` — Sign in & receive access token + secure httpOnly refresh cookie
- `POST /api/auth/refresh` — Rotate refresh token & issue new access token
- `POST /api/auth/logout` — Revoke token & clear cookies
- `GET  /api/auth/me` — Get profile of authenticated user
- `POST /api/auth/forgot-password` — Password reset request
- `POST /api/auth/reset-password` — Reset password with verification code

### Flights (`/api/flights`)
- `GET  /api/flights/airports?q=...` — Real-time airport & city autocomplete
- `GET  /api/flights/popular` — Curated trending global destinations
- `POST /api/flights/search` — Search flight offers with filters and sorting
- `GET  /api/flights/offers/:id` — Detailed offer view

### Bookings (`/api/bookings`)
- `POST /api/bookings` — Create a new flight reservation (Pending)
- `GET  /api/bookings` — List authenticated user's flight bookings
- `GET  /api/bookings/:reference` — View specific booking details
- `POST /api/bookings/:reference/cancel` — Cancel reservation
- `GET  /api/bookings/:reference/pdf` — Download official IATA-compliant PDF e-ticket

### Payments (`/api/payments`)
- `POST /api/payments/process` — Process payment & transition booking to Confirmed

### Users (`/api/users`)
- `PUT    /api/users/profile` — Update personal contact details
- `POST   /api/users/change-password` — Update account password
- `GET    /api/users/passengers` — Get saved frequent traveler passports
- `POST   /api/users/passengers` — Add frequent traveler to profile
- `PUT    /api/users/passengers/:id` — Update frequent traveler details
- `DELETE /api/users/passengers/:id` — Remove saved traveler

---

## 🛡️ Duffel API Integration Details

SkyBook features a provider adapter architecture (`FlightProvider` interface in `server/src/services/flightProvider/`).
- To use your Duffel test key, simply add your token in `server/.env`:
  ```env
  DUFFEL_API_TOKEN=duffel_test_your_token_here
  ```
- If the token is not provided or if Duffel hits rate limits, SkyBook seamlessly falls back to `SimulatedFlightProvider`. This guarantees that all booking, payment, and e-ticket features remain 100% interactive and testable at all times.

---

## 📜 License
SkyBook is open source under the MIT License.
