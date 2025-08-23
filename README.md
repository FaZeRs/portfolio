# [Portfolio](https://github.com/fazers/portfolio)

![Cover Image](public/images/cover.avif)

## Features

### 🌟 Portfolio & Content Management
- **Blog & Articles** - Full-featured blog with markdown support, comments, likes, views, and tagging system
- **Projects Showcase** - Portfolio projects with tech stack display, GitHub links, demo links, and detailed descriptions
- **Code Snippets** - Organized code snippets with syntax highlighting and categorization
- **Experience Timeline** - Experience, education and certificate timeline
- **Bookmarks** - Curated web bookmarks using [Raindrop](https://raindrop.io/)

### 🤖 AI-Powered Features
- **AI Chatbot** - Interactive chatbot with portfolio knowledge, reasoning display, and streaming responses

### 📊 Analytics & Statistics
- **GitHub Integration** - Real-time GitHub stats, contribution graphs, activity charts, and repository metrics
- **Blog Analytics** - View counts, engagement metrics, and monthly statistics
- **User Analytics** - User registration and activity tracking with visual charts

### 🔐 Authentication & Administration
- **OAuth Authentication** - GitHub social sign-in with Better Auth
- **Admin Dashboard** - Full CRUD operations for all content types
- **User Management** - Admin interface for managing users
- **Content Moderation** - Draft/publish workflows for all content types

### 🎨 Modern Tech Stack
- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler) - Latest React with performance optimizations
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest) + [Form](https://tanstack.com/form/latest) - Full-stack React framework
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) - Modern styling and component library
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL + [Upstash](https://upstash.com/) - Type-safe database operations and caching
- [Better Auth](https://www.better-auth.com/) - Secure authentication system

### 🛠 Developer Experience
- **MDX Support** - Rich markdown editing with live preview
- **Image Management** - Upload and optimization for all media content
- **SEO Optimization** - Meta tags, sitemap generation, and structured data
- **Form Validation** - Type-safe forms with real-time validation
- **Responsive Design** - Mobile-first approach with dark/light theme support

## Getting Started

1. Clone this repository

   ```bash
   git clone git@github.com:FaZeRs/portfolio.git
   ```

2. Install dependencies:

   ```bash
   bun install # npm install
   ```

3. Create a `.env` file based on [`.env.example`](./.env.example).

4. Push the schema to your database with drizzle-kit:

   ```bash
   bun db push # npm run db push
   ```

   https://orm.drizzle.team/docs/migrations

5. Run the development server:

   ```bash
   bun dev # npm run dev
   ```

   The development server should be now running at [http://localhost:3000](http://localhost:3000).

## Issue watchlist

- [React Compiler docs](https://react.dev/learn/react-compiler), [Working Group](https://github.com/reactwg/react-compiler/discussions) - React Compiler is still in beta. You can disable it in [vite.config.ts](./vite.config.ts#L36) if you prefer.
- https://github.com/TanStack/router/discussions/2863 - TanStack Start is currently in beta and may still undergo major changes.
- https://github.com/shadcn-ui/ui/discussions/6714 - We're using the `canary` version of shadcn/ui for Tailwind v4 support.

## Auth

Better Auth is currently configured for OAuth with GitHub, but can be easily modified to use other providers.

If you want to use email/password authentication or change providers, update the [auth config](./src/lib/server/auth.ts#L38) and [signin page](./src/routes/_authLayout/signin.tsx) with your own UI. You can use [shadcn/ui login blocks](https://ui.shadcn.com/blocks/login) or [@daveyplate/better-auth-ui](https://better-auth-ui.com/) as a starting point.

## Goodies

#### Scripts

These scripts in [package.json](./package.json#L17) use **bun** by default, but you can modify them to use your preferred package manager.

- **`auth:generate`** - Regenerate the [auth db schema](./src/lib/server/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./src/lib/server/auth.ts).
- **`db`** - Run drizzle-kit commands. (e.g. `bun db generate` to generate a migration)
- **`ui`** - The shadcn/ui CLI. (e.g. `bun ui add button` to add the button component)
- **`format`**, **`check`** and **`lint`** - Run Biome.

#### Utilities

- [`auth-guard.ts`](./src/lib/middleware/auth-guard.ts) - Sample middleware for forcing authentication on server functions. ([see #5](https://github.com/dotnize/tanstarter/issues/5))

## Building for production

Read the [hosting docs](https://tanstack.com/start/latest/docs/framework/react/hosting) for information on how to deploy your TanStack Start app.
