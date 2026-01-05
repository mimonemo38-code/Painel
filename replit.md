# MatDash - Dashboard Application

## Overview

MatDash is a modern dashboard application built with React frontend and Express backend. It displays financial analytics including revenue forecasts, expense tracking, and key business statistics. The application features a Portuguese language interface with a clean, purple-themed design using Shadcn UI components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled using Vite
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack React Query for server state and data fetching
- **UI Components**: Shadcn UI (New York style) with Radix primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Charts**: Recharts for data visualization (bar charts, line charts)
- **Animations**: Framer Motion for smooth transitions

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Build Process**: Custom esbuild script bundles server for production, Vite handles client

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components (Sidebar, Header, Shadcn UI)
    pages/        # Page components (Dashboard, not-found)
    hooks/        # Custom React hooks (use-dashboard, use-toast)
    lib/          # Utilities (queryClient, utils)
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schemas
  routes.ts       # API route definitions with Zod schemas
```

### Data Flow
1. Client uses custom hooks (`useRevenue`, `useStats`) to fetch data via React Query
2. API routes defined in `shared/routes.ts` ensure type safety across client/server
3. Server handlers in `routes.ts` call storage methods
4. Storage layer (`storage.ts`) uses Drizzle ORM to query PostgreSQL

### Database Schema
- **revenue**: Monthly financial data (month, revenue, expenses)
- **stats**: Dashboard statistics (label, value, change percentage, trend, progress)

### Development vs Production
- Development: Vite dev server with HMR, TSX for running TypeScript directly
- Production: Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and queries
- **connect-pg-simple**: PostgreSQL session store (available but session auth not currently implemented)

### Key NPM Packages
- **@tanstack/react-query**: Data fetching and caching
- **recharts**: Chart components for data visualization
- **framer-motion**: Animation library
- **zod**: Runtime type validation for API contracts
- **drizzle-zod**: Generates Zod schemas from Drizzle tables

### Fonts (Google Fonts)
- DM Sans: Body text
- Outfit: Display/headings

### Database Commands
- `npm run db:push`: Push schema changes to database using Drizzle Kit