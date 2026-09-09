# Raj Hansh Events

Premium celebration curation and luxury event planning web application for **Raj Hansh Events** (Ranchi, Jharkhand). Built with Next.js App Router, React 19, Supabase, and custom CSS design systems.

---

## Features

- **Luxury Aesthetics & Fluid UI**: Tailored typography (Playfair Display, Cormorant Garamond, Nunito Sans, Poppins), golden accents, responsive hero slider, and interactive service showcases.
- **Dynamic Content Management**: Powered by Supabase for real-time CMS updates across services, packages, portfolio media, team, and testimonials.
- **Role-Based Admin Portal**: Secure `/admin` login and protected `/Manage` CMS with session timeouts and authorization checks.
- **WhatsApp Cloud API Integration**: Automated customer communication widget and webhook handler with HMAC-SHA256 signature verification.
- **Appointment Scheduling**: Integrated Calendly consultation booking modal.
- **Security Hardened**: Zero dependency vulnerabilities, strict CSP headers, nosniff, HSTS, upload validation, and safe environment fallbacks.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Backend & Database**: Supabase (Database, Auth, and Storage)
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
├── scripts/               # Maintenance and batch image processing scripts
├── src/
│   ├── app/               # Next.js App Router pages and API routes
│   │   ├── admin/         # Admin login, session verification & auto-logout
│   │   ├── api/           # Webhook routes and API endpoints
│   │   ├── auth/          # OAuth callback handlers
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
│   └── utils/             # Business constants, Supabase clients & upload handlers
├── next.config.mjs        # Next.js configuration, security headers & image domains
├── jsconfig.json          # Path alias configuration (@/*)
└── SECURITY_HARDENING.md  # Detailed security and vulnerability audit logs
```

---

## Security & Compliance

For detailed information on response headers, authentication guards, and vulnerability remediation, please refer to [SECURITY_HARDENING.md](./SECURITY_HARDENING.md).

---

## License

Private repository © Raj Hansh Events. All rights reserved.
