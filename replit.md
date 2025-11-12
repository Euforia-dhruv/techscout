# TechScout

## Overview

TechScout is a full-stack web application for custom PC building and tech product discovery. It provides guided PC component selection with real-time compatibility checking, product comparison tools, and curated pre-built PC configurations. The platform is designed for tech-savvy users who need clear data presentation and efficient workflows for building custom PCs or discovering tech products.

**Core Features:**
- Custom PC Builder with step-by-step component selection and compatibility validation
- Product Finder with advanced filtering and search capabilities
- Side-by-side product comparison (up to 3 products)
- Pre-built PC configurations with curated builds
- Build sharing via unique URLs
- Real-time power consumption estimation
- Product ratings and "Best Pick" recommendations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Styling:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Tailwind CSS for utility-first styling with custom design tokens
- Wouter for lightweight client-side routing (alternative to React Router)

**UI Component System:**
- shadcn/ui component library built on Radix UI primitives
- Custom theme system using CSS variables for colors and spacing
- Design inspired by Linear's clean aesthetic and Material Design's data presentation patterns
- Typography: Inter font family for UI, JetBrains Mono for technical specifications
- Responsive grid layouts: 1-4 column product grids, 2-column builder layout, flexible dashboard

**State Management:**
- TanStack Query (React Query) for server state management and caching
- Local React state for UI interactions and form management
- Query client configured with infinite stale time and disabled auto-refetching for performance

**Key Design Patterns:**
- Component composition with reusable UI primitives
- Data clarity prioritized over visual flourish
- Scannable information architecture with clear component hierarchy
- Consistent spacing primitives (Tailwind units: 2, 4, 6, 8, 12, 16, 24)

### Backend Architecture

**Server Framework:**
- Express.js REST API server
- Node.js runtime with ESM module system
- TypeScript for type safety across the stack

**API Structure:**
- RESTful endpoints for products, builds, and pre-built PCs
- Validation using Zod schemas with drizzle-zod integration
- Structured error handling with appropriate HTTP status codes
- Request logging middleware for API calls

**Data Access Layer:**
- In-memory storage implementation (`MemStorage`) for development/demo
- Interface-based storage abstraction (`IStorage`) for future database integration
- Sample data initialization for products, builds, and pre-built PCs
- UUID-based identifiers for all entities

**Key Routes:**
- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch single product
- `POST /api/builds` - Create new build
- `GET /api/builds/:id` - Fetch build by ID
- `GET /api/pre-built-pcs` - Fetch pre-built PC configurations

### Data Storage Solutions

**Current Implementation:**
- In-memory Map-based storage for rapid prototyping
- Sample data includes CPUs, GPUs, RAM, motherboards, storage, PSUs, cases, cooling, and peripherals

**Database Schema (Prepared for PostgreSQL):**
- Drizzle ORM configured for PostgreSQL via Neon serverless
- Schema defined in `shared/schema.ts` with tables for users, products, builds, and pre-built PCs
- Type-safe schema with Zod validation
- Migration system configured with drizzle-kit

**Data Models:**
- **User**: Authentication with username/password
- **Product**: Component category, brand, price, specs, features, ratings, stock status
- **Build**: User-created builds with component selections, total price, power estimation
- **PreBuiltPC**: Curated configurations with use case categorization
- **Component Categories**: CPU, GPU, RAM, Motherboard, PSU, Storage, Case, Cooling, Monitor, Keyboard, Mouse, Headset

**Compatibility System:**
- Socket compatibility validation (AM4, AM5, LGA1700, LGA1200)
- Chipset matching (B550, X570, B650, X670, Z690, Z790, B760)
- RAM type validation (DDR4 vs DDR5)
- Power supply capacity checking
- Issue severity levels: error, warning, info

### Authentication and Authorization

**Current State:**
- User schema defined with username/password fields
- No active authentication implementation in routes
- Prepared for session-based authentication with express-session and connect-pg-simple

**Planned Implementation:**
- Session-based authentication with PostgreSQL session store
- Password hashing (bcrypt or similar recommended)
- Protected routes for build saving and user preferences

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Headless component primitives for accessible UI components (accordion, dialog, dropdown, popover, select, slider, tabs, toast, tooltip, etc.)
- **shadcn/ui**: Pre-built component library following Radix UI patterns
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider functionality
- **class-variance-authority**: Variant-based component styling
- **tailwind-merge**: Intelligent Tailwind class merging

### Data & Forms
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation and type inference
- **@hookform/resolvers**: React Hook Form integration with Zod

### Database & ORM
- **Drizzle ORM**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon
- **drizzle-zod**: Zod schema generation from Drizzle schemas
- **connect-pg-simple**: PostgreSQL session store for Express

### Development & Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **PostCSS & Autoprefixer**: CSS processing
- **esbuild**: JavaScript bundler for production server build
- **tsx**: TypeScript execution for development

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional class name handling
- **nanoid**: Compact unique ID generation
- **wouter**: Lightweight routing library

### Replit-Specific Plugins
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Code navigation assistance
- **@replit/vite-plugin-dev-banner**: Development environment banner

### External Services (Planned/Potential)
- **Image Hosting**: Unsplash URLs currently used for product images (should migrate to CDN or asset storage)
- **Payment Processing**: Not currently implemented (Stripe/PayPal integration recommended for e-commerce features)
- **Email Service**: Not implemented (SendGrid/Mailgun for notifications)
- **Analytics**: Not implemented (Google Analytics/Plausible recommended)