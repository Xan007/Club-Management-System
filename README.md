# Club El Meta - Management System

> Event venue reservation and quotation platform for Club El Meta

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![AdonisJS](https://img.shields.io/badge/AdonisJS-6.x-5A45FF?style=flat-square&logo=adonisjs)](https://adonisjs.com/)
[![Astro](https://img.shields.io/badge/Astro-4.x-FC4B44?style=flat-square&logo=astro)](https://astro.build/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=flat-square&logo=postgresql)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=flat-square)](LICENSE)

---

## Overview

A comprehensive management system for Club El Meta - a venue rental and events club. The platform handles:

- **Public booking**: View venues, check availability, and request quotes
- **Admin dashboard**: Manage reservations, clients, pricing, and venue configurations
- **Quote generation**: Create and export professional PDF quotes
- **Notifications**: Email confirmations and WhatsApp Business integration
- **Member management**: Track club members and their reservations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | AdonisJS 6.x (Node.js, TypeScript) |
| Frontend | Astro 4.x (TypeScript) |
| Database | PostgreSQL via Supabase |
| ORM | AdonisJS Lucid |
| Auth | Supabase Auth + AdonisJS Auth |
| Email | Resend |
| WhatsApp | Meta Business API |
| PDF | PDFKit + jsPDF |
| Deployment | Vercel (frontend) |

## Project Structure

```
Club-Management-System/
├── backend/                 # AdonisJS API
│   ├── app/
│   │   ├── controllers/     # HTTP controllers
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Auth & validation
│   │   └── services/        # Business logic
│   ├── config/              # App configuration
│   ├── database/
│   │   └── seeders/         # Initial data
│   └── scripts/             # SQL utilities
├── frontend/                # Astro web app
│   ├── src/
│   │   ├── components/      # Astro components
│   │   ├── layouts/         # Page layouts
│   │   ├── lib/             # Utilities
│   │   ├── pages/           # Routes
│   │   └── services/        # API client
│   └── public/              # Static assets
```

## Quick Start

### Prerequisites

- Node.js 20.x+
- npm 10.x+
- Supabase account
- Resend account (email)
- Meta for Developers account (WhatsApp, optional)

### Backend Setup

```bash
cd backend
npm install

# Create .env from example
cp .env.example .env

# Generate app key
node ace generate:key

# Configure your .env with Supabase credentials, then:
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env
cp .env.example .env

# Configure with your Supabase URL and backend URL, then:
npm run dev
```

### Environment Variables

**Backend (`backend/.env`)**

```env
# Server
PORT=3333
HOST=0.0.0.0
APP_KEY=<generated>

# Database (Supabase)
DB_HOST=your-pooler-host
DB_PORT=5432
DB_USER=postgres.xxxxx
DB_PASSWORD=your-password
DB_DATABASE=postgres

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SECRET_KEY=eyJ...
SUPABASE_PUBLISHABLE_KEY=eyJ...

# Email (Resend)
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=Club El Meta <noreply@example.com>

# WhatsApp (Optional)
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_ACCESS_TOKEN=EAAV...
```

**Frontend (`frontend/.env`)**

```env
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
PUBLIC_BACKEND_URL=http://localhost:3333
```

## Available Scripts

### Backend

```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript validation
```

### Frontend

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run check      # TypeScript validation
```

## Key Features

### Public Site
- Browse available event venues/spaces
- View venue details, photos, and capacity
- Check availability calendar
- Request quotes for reservations

### Admin Dashboard
- Reservation management (create, update, cancel)
- Quote generation with PDF export
- Member (socio) registration and management
- Venue configuration and pricing
- Operating hours management
- Block calendar dates

### Integrations
- **Email**: Automated notifications via Resend
- **WhatsApp**: Booking confirmations via Meta Business API
- **PDF**: Professional quote documents

## API Endpoints

| Group | Description |
|-------|-------------|
| `/api/auth` | Authentication |
| `/api/espacios` | Venue management |
| `/api/cotizacion` | Quote operations |
| `/api/socios` | Member management |
| `/api/disponibilidad` | Availability checks |
| `/api/horarios` | Operating hours |
| `/api/admin` | Admin operations |

## License

© 2026 [Xan007](https://github.com/Xan007) & [SantiagoDutr](https://github.com/Santiagodutr). All rights reserved.

This project is proprietary and confidential. No part of this software may be reproduced, distributed, or used for any purpose without express written permission from the owners.

## Contact

For technical support, contact the development team.