# Invoice Generator

A full-stack invoice management web app for solo service providers — manage clients, services, and orders, then generate and track invoices.

## Overview

This app lets a freelancer or small service business:
- Keep a record of clients
- Define the services they offer
- Create orders combining multiple services for a client
- Generate an invoice from an order and track its payment status

No authentication — built as a single-user tool.

## Tech Stack

**Frontend:** React + Vite, TypeScript

**Backend:** Node.js, Express, TypeScript

**Database:** PostgreSQL + Prisma

**Validation:** Zod

**Deployment:** Netlify (frontend), Railway (backend) — planned

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

## Data Model

| Table | Description |
|---|---|
| Client | People/businesses being billed |
| Service | Services offered, with price |
| Order | A client's request, grouping one or more services |
| OrderItem | A single service line within an order |
| Invoice | Generated from an order, tracks total + payment status |

## Project Status

🚧 In progress — backend API under active development