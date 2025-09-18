# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern full-stack portfolio website built with React 19, TanStack Start, and TypeScript. It features a blog, projects showcase, code snippets, AI chatbot, and comprehensive admin dashboard with authentication.

## Tech Stack

- **Framework**: TanStack Start (full-stack React framework) with React 19 + React Compiler
- **Database**: PostgreSQL with Drizzle ORM, Upstash caching
- **Authentication**: Better Auth with GitHub OAuth
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: TanStack Query, TanStack Form, TanStack Store
- **AI**: Vercel AI SDK with OpenAI integration
- **Deployment**: Node.js server (configurable via DEPLOY_TARGET)

## Development Commands

- `bun dev` - Start development server on port 3000
- `bun build` - Build for production
- `bun start` - Start production server on port 3000
- `bun serve` - Preview production build
- `bun lint` - Run Biome linter
- `bun format` - Format code with Biome
- `bun check` - Run Biome check (lint + format)
- `bun typecheck` - Run TypeScript type checking
- `bun db` - Run Drizzle Kit commands (e.g., `bun db generate`, `bun db push`)
- `bun ui` - shadcn/ui CLI (e.g., `bun ui add button`)
- `bun auth:generate` - Regenerate Better Auth database schema
- `bun deps` - Update dependencies to latest versions
- `bun auth` - Better Auth CLI for additional auth operations

## Architecture

### Directory Structure

```
src/
├── lib/
│   ├── server/          # Server-side code
│   │   ├── auth.ts      # Better Auth configuration
│   │   ├── db.ts        # Drizzle database setup with Upstash cache
│   │   └── schema/      # Database schemas (snake_case naming)
│   ├── config/          # Configuration files (site, navbar)
│   ├── constants/       # Static data and constants
│   ├── utils/           # Utility functions
│   ├── validators/      # Zod validation schemas
│   ├── middleware/      # Auth guards and middleware
│   └── mdx-plugins/     # Custom MDX processing plugins
├── routes/             # File-based routing (TanStack Start)
│   ├── api/            # API routes
│   ├── (public)/       # Public pages (blogs, projects, snippets)
│   ├── (auth)/         # Auth-related pages (signin)
│   └── dashboard/      # Admin dashboard with CRUD operations
├── trpc/              # tRPC routers and initialization
├── contexts/          # React contexts (theme, auth)
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── plugins/           # Build plugins (sitemap, etc.)
```

### Key Features

- **Content Management**: Articles, projects, code snippets with CRUD operations
- **Authentication**: GitHub OAuth with role-based access
- **AI Integration**: Chatbot with portfolio knowledge and streaming responses
- **Analytics**: GitHub stats, blog metrics, user activity tracking
- **MDX Support**: Rich markdown with live preview and custom plugins
- **Image Management**: Upload and optimization via Vercel Blob

### Database Schema

Uses Drizzle ORM with PostgreSQL:
- Snake_case naming convention
- Schemas organized by feature in `src/lib/server/schema/`
- Upstash caching layer for performance
- Better Auth tables auto-generated

### Routing

TanStack Start file-based routing:
- Route groups: `(public)`, `(auth)`, `dashboard`
- API routes in `/api/` directory
- Layout-based organization with nested routes
- Type-safe routing with generated route tree

### State Management

- **TanStack Query**: Server state, caching, and synchronization
- **TanStack Form**: Type-safe forms with validation
- **TanStack Store**: Client-side state management
- **React Context**: Theme, auth, and global UI state

## Configuration Files

- `vite.config.ts` - Vite configuration with TanStack Start, React Compiler
- `biome.json` - Linting and formatting rules (extends ultracite)
- `drizzle.config.ts` - Database configuration and migrations
- `tsconfig.json` - TypeScript configuration with path aliases (`~/`)
- `.env` - Environment variables (use `.env.example` as template)

## Development Guidelines

### Code Standards
- Use functional components with hooks
- Implement proper memoization for performance
- Prefer interfaces over types for extensibility
- Use discriminated unions for complex state
- Organize by feature, not file type
- Keep components under 300 lines
- Extract reusable logic into custom hooks

### Database Operations
- Use Drizzle queries with proper error handling
- Leverage Upstash cache for frequently accessed data
- Run `bun db generate` after schema changes
- Use `bun db push` for development, migrations for production

### Authentication
- Use `auth-guard.ts` middleware for protected server functions
- Better Auth handles OAuth flow automatically
- User roles managed through database schema

### AI Features
- AI chatbot uses Vercel AI SDK with streaming
- Portfolio knowledge embedded for contextual responses
- Reasoning display shows AI thought process

## Testing and Quality

- Use Biome for linting and formatting
- TypeScript strict mode enabled
- Husky pre-commit hooks with lint-staged
- Ultracite formatting integration
- Always run `bun typecheck` before committing
- No test framework currently configured

## Environment Setup

1. Copy `.env.example` to `.env` and configure variables
2. Set up PostgreSQL database (Neon recommended)
3. Configure Upstash for caching
4. Set up GitHub OAuth app for authentication
5. Run `bun db push` to initialize database schema

## Special Notes

- React Compiler enabled (can disable in vite.config.ts if needed)
- TanStack Start is in beta - breaking changes possible
- Using shadcn/ui canary for Tailwind v4 support
- Sentry integration for error monitoring
- Path aliases configured (`~/` maps to `src/`)
- Biome configured with Ultracite formatting rules
- Pre-commit hooks with lint-staged for automated code quality
- Environment variables required for full functionality (see .env.example)

## Key Integration Points

### tRPC Configuration
- Located in `src/trpc/` directory
- Server and client setup with TanStack Query integration
- Type-safe API calls throughout the application

### Authentication Flow
- Better Auth with GitHub OAuth provider
- Auto-generated database schema in `src/lib/server/schema/auth.schema.ts`
- Protected routes use `auth-guard.ts` middleware
- Session management handled automatically

### Database Integration
- Drizzle ORM with PostgreSQL backend
- Upstash Redis for caching layer
- Schema files use snake_case naming convention
- Migrations managed via `bun db generate` and `bun db push`

### Content Management
- MDX support with custom plugins in `src/lib/mdx-plugins/`
- Image uploads via Vercel Blob storage
- Rich text editing with live preview capabilities
- Content types: articles, projects, code snippets

### AI Features
- Vercel AI SDK integration with OpenAI
- Streaming responses and reasoning display
- Portfolio knowledge embedded for contextual responses