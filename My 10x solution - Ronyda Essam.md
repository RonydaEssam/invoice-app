# My 10x Solution - Ronyda Essam

## 1. What is the problem?

Small businesses and family-run ventures need to send professional invoices and get paid, but most free tools force a trade-off: either the invoice data lives in a spreadsheet with no real system behind it, or a "free" invoicing SaaS is actually a funnel toward a paid plan the moment you need more than one user or a proper receipt.

I already had a working invoicing app I previously built - full CRUD across invoices, clients, and line items, live in production.

What it was missing was the two things that make it safe and useful for a real team:
- Authentication so nobody other than the business owner can see or edit invoices.
- A clean, downloadable invoice in PDF format.

**Who has this problem:** anyone running a small business or side project who wants a lightweight, self-owned invoicing tool instead of paying for a SaaS subscription, but still needs it to be secure and to produce something presentable to send a client.

**The 10x claim:** turning a shared, unauthenticated invoicing tool into one where access is protected and a professional PDF receipt is one click away - instead of a client waiting on a manually formatted document, generating and sending a receipt now takes seconds, not the ten-to-fifteen minutes it took to format one by hand.

**Non-goal:** this is not a multi-tenant SaaS product. It's built around a single business owner logging in to manage their own invoices, not self-service signup for arbitrary customer organizations.

## 2. How did you implement your solution?

The system builds on an existing full-stack invoicing app I already built before:

- **Frontend:** React + Vite + TypeScript, deployed on Cloudflare Pages
- **Backend:** Express + TypeScript, deployed on Render
- **Database:** PostgreSQL via Prisma, hosted on Supabase
- **Data model:** clients, services, orders, order items, and invoices, with full CRUD already in place

On top of that existing foundation, I added the two pieces this capstone required:

1. **Authentication.** Supabase Auth handles signup, login, and logout. On login, Supabase issues a JWT; a `requireAuth` middleware verifies that token via `supabase.auth.getUser()` on every protected route, rejecting requests with a missing or invalid token with a 401. Only the anon key is used server-side - never the service_role key - so there's no elevated secret to leak. On the frontend, every route except `/login` and `/signup` is gated behind a route guard that checks for a valid session token before rendering.

2. **PDF reporting.** A `GET /invoices/:id/pdf` endpoint pulls an invoice through Prisma - including its order, client, and line items - and streams back a formatted PDF receipt (client details, itemized services, computed total) generated on demand with `pdfkit`, not stored on disk.

### The 5+ concepts implemented

| # | Concept | Where it lives |
|---|---------|-----------------|
| 1 | API endpoints | Express routes across `clients`, `services`, `orders`, and `invoices` - existing CRUD, correct status codes and validation |
| 2 | Database | PostgreSQL via Prisma, hosted on Supabase - real persistence across a 5-table schema |
| 3 | Authentication | `src/database/supabase.ts` (client init), `src/middleware/auth.ts` (`requireAuth`), `src/handlers/auth.ts` + `src/routes/auth.ts` (signup/login/logout) |
| 4 | Reporting - PDF | `src/handlers/pdf.ts` + `src/routes/pdf.ts` - generates a PDF receipt per invoice via `pdfkit` |
| 5 | Deployment *(swap for Background jobs)* | Frontend on Cloudflare Pages, backend on Render - chosen as the swap because this app has no slow or scheduled work to move off the request path; deployment better reflects real production readiness for this project |

Max 2 swaps allowed; only 1 used here.

### How to run it

```
# Backend
cd server
npm install
cp .env.example .env   # set DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY
npx prisma migrate deploy
npm run dev

# Frontend
cd client
npm install
npm run dev
```

Or use the live deployments:
- Frontend: https://invoice-app-21j.pages.dev
- Backend API: https://invoice-app-3xxg.onrender.com
