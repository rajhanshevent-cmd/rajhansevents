# Raj Hansh Events

Premium celebration curation and luxury event planning web application for **Raj Hansh Events** (Ranchi, Jharkhand). Built with Next.js 16 App Router, React 19, Neon Serverless PostgreSQL, Cloudflare R2 Object Storage, and custom CSS design systems.

---

## Features

- **Luxury Aesthetics & Fluid UI**: Tailored typography (Playfair Display, Cormorant Garamond, Nunito Sans, Poppins), golden accents, responsive hero slider, and interactive service showcases.
- **Dynamic Content Management (CMS)**: Manage services, packages, portfolio media, team, and testimonials with instant live database updates.
- **Zero-Inactivity Database (Neon)**: Serverless PostgreSQL that auto-wakes on demand. Never pauses, never requires manual unpausing or ping scripts.
- **Admin Authentication (Google OAuth)**: Direct Google OAuth 2.0 with a strict server-side email whitelist (`ADMIN_EMAIL`) and encrypted HTTP-only session cookies (`jose`). Inherits Google's 2FA security with zero passwords stored.
- **High-Performance Storage (Cloudflare R2)**: Direct browser-to-R2 presigned S3 uploads with zero bandwidth fees, 10GB free tier, and high-speed edge CDN delivery for images and 50MB videos.
- **WhatsApp Cloud API Integration**: Automated customer communication widget and webhook handler with HMAC-SHA256 signature verification.
- **Appointment Scheduling**: Integrated Calendly consultation booking modal.
- **Security Hardened**: Zero hardcoded credentials, strict CSP headers, nosniff, HSTS, MIME/extension whitelisting, and safe fallback states.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Database**: Neon (Serverless PostgreSQL via `@neondatabase/serverless`)
- **Authentication**: Direct Google OAuth 2.0 with Admin Whitelist & `jose` JWT cookies
- **Media Storage**: Cloudflare R2 (S3-compatible via `@aws-sdk/client-s3` presigned URLs)
- **Styling**: Vanilla CSS Modules & Design System Tokens
- **Optimization**: `@next/bundle-analyzer`, `sharp`, `browser-image-compression`

---

## Getting Started

### Prerequisites

- Node.js 20+ (Node 20.19+ or Node 22 recommended)
- npm 10+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rishabh98080/rajhansevents.git
   cd rajhansevents
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy the example environment file and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. Initialize the Neon PostgreSQL schema:
   Run the schema script in your Neon SQL Editor console or via psql:
   ```bash
   psql "$DATABASE_URL" -f scripts/schema.sql
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Compiles the production build with bundle optimization |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Checks code formatting and ESLint rules |
| `node scripts/convert-images.js` | Batch converts gallery images to WebP format |

---

## Project Structure

```
├── public/                # Static assets, logos, and media
├── scripts/
│   ├── schema.sql         # Idempotent DDL for all 13 database tables
│   └── convert-images.js  # Batch image processing scripts
├── src/
│   ├── app/               # Next.js App Router pages and API routes
│   │   ├── admin/         # Secure Google OAuth admin portal
│   │   ├── api/
│   │   │   ├── auth/      # Google OAuth initiator, callback, me & logout
│   │   │   ├── cms/       # Protected CMS upsert handler
│   │   │   ├── upload/    # Cloudflare R2 presigned upload generator
│   │   │   ├── portfolio/ # Public portfolio query endpoint
│   │   │   ├── contact/   # Public contact info query endpoint
│   │   │   ├── footer/    # Public footer data aggregator
│   │   │   ├── enquiry/   # Client enquiry submission endpoint
│   │   │   └── webhook/   # WhatsApp Cloud API webhook handler
│   │   ├── Manage/        # Protected website content manager (CMS)
│   │   ├── about/         # Company story, mission & team
│   │   ├── contact/       # Direct line enquiry and map
│   │   ├── packages/      # Event package tiers & pricing
│   │   ├── portfolio/     # Filterable media gallery & lightbox
│   │   ├── services/      # Signature services & planning process
│   │   ├── testimonials/  # Reviews & video experiences
│   │   ├── layout.js      # Global layout, fonts, Navbar & Footer
│   │   └── page.js        # Homepage
│   ├── component/         # Reusable UI components (Navbar, Footer, Widgets)
│   ├── lib/
│   │   ├── db.js          # Neon PostgreSQL connection & query helpers
│   │   ├── r2.js          # Cloudflare R2 S3 client configuration
│   │   └── session.js     # JWT session signing & HTTP-only cookies
│   ├── utils/
│   │   ├── constants.js   # Business constants & contact fallbacks
│   │   └── r2Upload.js    # Direct browser-to-R2 presigned upload handler
│   └── proxy.js           # Next.js 16 route protection guard for /Manage
├── next.config.mjs        # Next.js configuration, security headers & image domains
├── jsconfig.json          # Path alias configuration (@/*)
└── SECURITY_HARDENING.md  # Detailed security and vulnerability audit logs
```

---

## Security & Handover Checklist

1. **Database (Neon)**: Create a project under the client's account, run `scripts/schema.sql`, and paste `DATABASE_URL`.
2. **Media Storage (Cloudflare R2)**: Create bucket under client's Cloudflare account, set public access domain, and add `R2_*` keys.
3. **Admin Auth (Google Cloud Console)**: Create an OAuth 2.0 Web Client ID, set redirect URI (`https://yourdomain.com/api/auth/google/callback`), and set `ADMIN_EMAIL` to the client's email.
4. **Hosting (Vercel)**: Import repository into client's Vercel account, configure environment variables from `.env.example`, and connect custom domain.

---

## License

Private repository © Raj Hansh Events. All rights reserved.
