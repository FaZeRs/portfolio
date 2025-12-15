# [Portfolio](https://github.com/fazers/portfolio)

![Cover Image](apps/web/public/images/cover.avif)

A modern full-stack portfolio monorepo built with Turborepo, TanStack Start, React 19, and TypeScript.

## Features

### Portfolio & Content Management
- **Blog & Articles** - Full-featured blog with markdown support, comments, likes, views, and tagging system
- **Projects Showcase** - Portfolio projects with tech stack display, GitHub links, demo links, and detailed descriptions
- **Code Snippets** - Organized code snippets with syntax highlighting and categorization
- **Experience Timeline** - Experience, education and certificate timeline
- **Bookmarks** - Curated web bookmarks using [Raindrop](https://raindrop.io/)

### AI-Powered Features
- **AI Chatbot** - Interactive chatbot with portfolio knowledge, reasoning display, and streaming responses

### Analytics & Statistics
- **GitHub Integration** - Real-time GitHub stats, contribution graphs, activity charts, and repository metrics
- **Blog Analytics** - View counts, engagement metrics, and monthly statistics
- **User Analytics** - User registration and activity tracking with visual charts

### Authentication & Administration
- **OAuth Authentication** - GitHub social sign-in with Better Auth
- **Admin Dashboard** - Full CRUD operations for all content types
- **User Management** - Admin interface for managing users
- **Content Moderation** - Draft/publish workflows for all content types

## Tech Stack

- [Turborepo](https://turbo.build/repo) - High-performance monorepo build system
- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler) - Latest React with performance optimizations
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest) + [Form](https://tanstack.com/form/latest) - Full-stack React framework
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) - Modern styling and component library
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL + [Upstash](https://upstash.com/) - Type-safe database operations and caching
- [Better Auth](https://www.better-auth.com/) - Secure authentication system
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs

## Monorepo Structure

```
.
├── apps/
│   ├── web/              # Main portfolio website (port 3000)
│   └── dashboard/        # Admin dashboard (port 3002)
├── packages/
│   ├── api/              # tRPC API routers and procedures
│   ├── auth/             # Better Auth configuration
│   ├── config/           # Shared configuration (site, navbar)
│   ├── db/               # Drizzle ORM setup and schemas
│   ├── mdx/              # MDX processing and plugins
│   ├── shared/           # Shared utilities and constants
│   ├── types/            # TypeScript type definitions
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── utils/            # Utility functions
│   └── validators/       # Zod validation schemas
└── tooling/
    ├── github/           # GitHub Actions workflows
    ├── tailwind/         # Tailwind CSS configuration
    └── typescript/       # Shared TypeScript configs
```

## Getting Started

1. Clone this repository

   ```bash
   git clone git@github.com:FaZeRs/portfolio.git
   cd portfolio
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. Create a `.env` file based on [`.env.example`](./.env.example)

4. Push the schema to your database

   ```bash
   bun db:push
   ```

5. Run the development server

   ```bash
   bun dev
   ```

   - Web app: [http://localhost:3000](http://localhost:3000)
   - Dashboard: [http://localhost:3002](http://localhost:3002)

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start all apps in development mode |
| `bun build` | Build all apps and packages |
| `bun typecheck` | Run TypeScript type checking |
| `bun lint` | Run Biome linter |
| `bun format` | Format code with Biome |
| `bun check` | Run Biome check (lint + format) |
| `bun db:push` | Push schema changes to database |
| `bun db:studio` | Open Drizzle Studio |
| `bun auth:generate` | Regenerate Better Auth schema |
| `bun ui-add` | Add shadcn/ui components |
| `bun clean` | Clean all node_modules |
| `bun clean:workspaces` | Clean workspace build artifacts |
| `bun deps` | Update dependencies to latest versions |

## Issue Watchlist

- [React Compiler docs](https://react.dev/learn/react-compiler), [Working Group](https://github.com/reactwg/react-compiler/discussions) - React Compiler is still in beta.
- https://github.com/TanStack/router/discussions/2863 - TanStack Start is currently in beta and may still undergo major changes.
- https://github.com/shadcn-ui/ui/discussions/6714 - We're using the `canary` version of shadcn/ui for Tailwind v4 support.

## Authentication

Better Auth is configured for OAuth with GitHub, but can be easily modified to use other providers.

To change providers or enable email/password authentication, update:
- Auth config: `packages/auth/src/index.ts`
- Sign-in page in the respective app

Resources:
- [shadcn/ui login blocks](https://ui.shadcn.com/blocks/login)

## Building for Production

Build all apps:

```bash
bun build
```

Start production servers:

```bash
# Web app
cd apps/web && bun start

# Dashboard
cd apps/dashboard && bun start
```

Read the [TanStack Start hosting docs](https://tanstack.com/start/latest/docs/framework/react/hosting) for deployment options.

## License

[MIT](LICENSE)
