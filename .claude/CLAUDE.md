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

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bun x ultracite fix`
- **Check for issues**: `bun x ultracite check`
- **Diagnose setup**: `bun x ultracite doctor`

Biome (the underlying engine) provides extremely fast Rust-based linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., @unpic/react `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.
