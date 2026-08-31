# Invoice Generator

A full-stack invoice management web app for solo service providers - manage clients, services, and orders, then generate and track invoices.

## Live Demo

[Invoice Generator](https://invoice-app-21j.pages.dev)

## Overview

This app lets a freelancer or small service business:
- Keep a record of clients
- Define the services they offer
- Create orders combining multiple services for a client
- Generate invoices from orders with auto-calculated totals
- Track invoice status (Draft → Sent → Paid)
- Log in to a protected account before accessing any data
- Download a formatted PDF receipt for any invoice
- Dashboard overview of open orders and unpaid invoices

## Tech Stack

**Frontend:** React + Vite, TypeScript

**Backend:** Node.js, Express, TypeScript

**Database:** PostgreSQL + Prisma (hosted on Supabase)

**Auth:** Supabase Auth (JWT-based)

**PDF generation:** pdfkit

**Validation:** Zod

**Deployment:** Cloudflare Pages (frontend), Render (backend)

## Project Structure

```
invoice-app/
  server/     → Express API, Prisma schema, database logic
  client/     → React + Vite client app
```

## Getting Started

### Server
```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```
Runs on `http://localhost:3000`

Requires a `.env` file with:
```
DATABASE_URL=<your Supabase Postgres connection string>
SUPABASE_URL=<your Supabase project URL>
SUPABASE_ANON_KEY=<your Supabase anon key>
```

### Client
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`

## Authentication

All data routes (clients, services, orders, invoices) require a logged-in session. Every page except `/login` and `/signup` is gated behind an authenticated route guard on the frontend, and every protected route on the backend rejects requests without a valid token.

| Method | Route | Description |
|---|---|---|
| POST | /auth/signup | Create an account |
| POST | /auth/login | Log in, returns a session token |
| POST | /auth/logout | End the session |

Include the returned token on all subsequent requests: `Authorization: Bearer <token>`

## API Endpoints

### Clients
| Method | Route | Description |
|---|---|---|
| GET | /clients | Get all clients |
| GET | /clients/:id | Get one client with their orders |
| POST | /clients | Create a client |
| PUT | /clients/:id | Update a client |
| DELETE | /clients/:id | Delete a client (blocked if has orders) |

### Services
| Method | Route | Description |
|---|---|---|
| GET | /services | Get all services |
| GET | /services/:id | Get one service |
| POST | /services | Create a service |
| PUT | /services/:id | Update a service |
| DELETE | /services/:id | Delete a service |

### Orders
| Method | Route | Description |
|---|---|---|
| GET | /orders | Get all orders (supports ?status=Open\|Closed) |
| GET | /orders/:id | Get one order with items, client, and invoice |
| POST | /orders | Create order with nested items in one request |
| PUT | /orders/:id | Update order status and items |
| DELETE | /orders/:id | Delete order (cascades to order items) |

### Invoices
| Method | Route | Description |
|---|---|---|
| GET | /invoices | Get all invoices (supports ?status=Draft\|Sent\|Paid) |
| GET | /invoices/:id | Get one invoice with order and client details |
| POST | /invoices | Generate invoice for an order (auto-calculates total) |
| PATCH | /invoices/:id/status | Update invoice status |
| DELETE | /invoices/:id | Delete invoice |
| GET | /invoices/:id/pdf | Download a formatted PDF receipt for the invoice |

## Data Model

| Table | Description |
|---|---|
| Client | People/businesses being billed |
| Service | Services offered, with price and description |
| Order | A client's request, grouping one or more services |
| OrderItem | A single service line within an order (service + quantity) |
| Invoice | Generated from an order, tracks total + payment status |

## Features

- Full CRUD for all 4 resources
- Authentication: signup/login/logout, protected routes on both frontend and backend
- PDF receipt generation for any invoice
- Nested order creation (order + items in one API call)
- Auto-calculated invoice totals from order items
- Status filtering on orders and invoices
- Dark mode with persistent theme toggle
- Inline form validation with field-level error messages
- Delete confirmation modals
- Loading and empty states throughout
- Reusable custom hooks (useFetch, useConfirmDelete)

## FlyRank Capstone - My 10x Solution

This project is submitted as the **My 10x Solution** capstone for the FlyRank Backend Track internship.

**Problem & full writeup:** see `My 10x Solution - Ronyda Essam.md` in this repo.

### Concepts implemented (5, max 2 swaps)

| # | Concept | Where it lives |
|---|---------|-----------------|
| 1 | API endpoints | Express routes — `clients`, `services`, `orders`, `invoices` |
| 2 | Database | PostgreSQL via Prisma, hosted on Supabase |
| 3 | Authentication | `src/database/supabase.ts`, `src/middleware/auth.ts`, `src/handlers/auth.ts`, `src/routes/auth.ts` |
| 4 | Reporting - PDF | `src/handlers/pdf.ts`, `src/routes/pdf.ts` (`GET /invoices/:id/pdf`) |
| 5 | Deployment *(swap for Background jobs - no slow/scheduled work in this app; deployment better reflects production readiness)* | Frontend on Cloudflare Pages, backend on Render |

## Project Status

✅ Complete - fully functional