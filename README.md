# Invoice Generator

A full-stack invoice management web app for solo service providers — manage clients, services, and orders, then generate and track invoices.

## Live Demo

[Invoice Generator](https://invoice-app-21j.pages.dev)

## Overview

This app lets a freelancer or small service business:
- Keep a record of clients
- Define the services they offer
- Create orders combining multiple services for a client
- Generate invoices from orders with auto-calculated totals
- Track invoice status (Draft → Sent → Paid)
- Dashboard overview of open orders and unpaid invoices

No authentication — built as a single-user tool.

## Tech Stack

**Frontend:** React + Vite, TypeScript

**Backend:** Node.js, Express, TypeScript

**Database:** PostgreSQL + Prisma

**Validation:** Zod

**Deployment:** Netlify (frontend), Railway (backend)

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

### Client
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`

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
- Nested order creation (order + items in one API call)
- Auto-calculated invoice totals from order items
- Status filtering on orders and invoices
- Dark mode with persistent theme toggle
- Inline form validation with field-level error messages
- Delete confirmation modals
- Loading and empty states throughout
- Reusable custom hooks (useFetch, useConfirmDelete)

## Project Status
 
✅ Complete — fully functional