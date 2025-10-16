# Overview

This is a full-stack web application built with React and Express.js, featuring a modern UI component library and database integration. The project uses Vite for frontend tooling, Drizzle ORM for database management with PostgreSQL (via Neon serverless), and shadcn/ui components built on Radix UI primitives. The application follows a monorepo-style structure with shared schemas between client and server.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: React with Vite build tooling, using JavaScript (JSX) rather than TypeScript.

**UI Component System**: The application uses shadcn/ui components configured in the "new-york" style. This provides a comprehensive set of pre-built UI components based on Radix UI primitives, including dialogs, dropdowns, forms, navigation, and data display components. The design system uses CSS variables for theming with a neutral base color scheme and Tailwind CSS for styling.

**State Management**: React Query (TanStack Query) handles server state management with aggressive caching strategies (staleTime: Infinity) and disabled automatic refetching. This reduces unnecessary network requests while maintaining predictable data freshness.

**Path Aliases**: The build system uses path aliases (@, @shared, @assets) to simplify imports and maintain clean code organization across the client, shared, and assets directories.

**Styling Approach**: Tailwind CSS with extensive custom color variables defined in CSS, providing a design system with colors like brand colors, grays, status colors (success, warning, destructive), and semantic tokens. PostCSS handles CSS transformations.

## Backend Architecture

**Server Framework**: Express.js with custom middleware for request logging and JSON response capture. The server logs API requests with timing information and truncates long responses to 80 characters for cleaner logs.

**Development vs Production**: The application uses Vite's middleware mode in development for HMR (Hot Module Replacement) and serves static files in production. Vite integration is only activated in development environments.

**Storage Layer**: Currently implements an in-memory storage system (MemStorage class) with basic CRUD operations for users. This is designed as an interface that can be swapped with a database-backed implementation without changing route handlers.

**API Structure**: All application routes are prefixed with `/api` and registered through a centralized `registerRoutes` function. Error handling middleware catches all errors and returns consistent JSON responses.

**Build Process**: The server is bundled using esbuild with ESM format, external packages, and Node.js platform targeting. The client is built with Vite and output to `dist/public`.

## Data Layer

**ORM**: Drizzle ORM configured for PostgreSQL dialect with schema definitions in JavaScript (not TypeScript).

**Database Provider**: Neon serverless PostgreSQL, configured through the `@neondatabase/serverless` package.

**Schema Management**: Database schema lives in a shared directory (`shared/schema.js`) accessible to both client and server. Currently defines a `users` table with auto-generated UUIDs, username, and password fields.

**Validation**: Drizzle-Zod integration automatically generates Zod schemas from database table definitions (e.g., `insertUserSchema`), providing type-safe validation for database operations.

**Migration Strategy**: Uses Drizzle Kit for schema migrations with output directory `./migrations` and push-based deployment via `npm run db:push`.

## Session Management

**Session Store**: Uses `connect-pg-simple` for PostgreSQL-backed session storage, allowing sessions to persist across server restarts and scale horizontally.

## Design Decisions

**JavaScript over TypeScript**: The project explicitly uses JavaScript throughout, with TypeScript checking disabled. This simplifies the development experience while sacrificing compile-time type safety.

**Monorepo Structure**: Shared code (schemas, types) lives in a `shared/` directory accessible to both client and server, preventing duplication and ensuring consistency.

**Development Tooling**: Replit-specific plugins are conditionally loaded in development only, providing runtime error overlays, cartographer for code navigation, and dev banners without affecting production builds.

**Font Loading**: Multiple font families are loaded (Architects Daughter, DM Sans, Fira Code, Geist Mono, Poppins) suggesting a design that requires varied typography for different UI contexts.

# External Dependencies

## UI Component Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives (accordion, dialog, dropdown, select, toast, etc.)
- **shadcn/ui**: Pre-styled component patterns built on Radix UI
- **cmdk**: Command menu component for keyboard-driven interfaces
- **embla-carousel-react**: Carousel/slider component

## Styling & Utilities
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **class-variance-authority (CVA)**: Variant-based styling system for components
- **clsx & tailwind-merge**: Utility libraries for conditional class name composition
- **date-fns**: Date manipulation and formatting

## State & Forms
- **@tanstack/react-query**: Server state management and data fetching
- **@hookform/resolvers**: Form validation resolver integration
- **Zod**: Schema validation (via drizzle-zod integration)

## Database & Backend
- **Drizzle ORM**: Type-safe ORM with PostgreSQL support
- **@neondatabase/serverless**: Neon serverless PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store for Express

## Build Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: JavaScript bundler for server code
- **Replit plugins**: Development-only tooling for error overlays and debugging

## API Integration
The application is structured to consume its own REST API (all routes prefixed with `/api`), with the React Query client configured for credential-based requests and custom error handling for 401 responses.