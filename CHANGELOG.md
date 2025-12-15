The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-12-15

### Added

- AI assistant for blog post creation with intelligent content suggestions
- Dashboard sidebar navigation for improved admin UX
- C++ language support in code syntax highlighter
- Dynamic entity filtering with entityName prop in DataTable component
- Chat history management in AI chatbot component
- Changelog page with version history display
- Services page with service offerings showcase
- Contact form with modal dialog
- ServiceContact component for services section
- Guestbook and services routes added to sitemap
- Image handling with @unpic/react for optimized images
- Additional auth providers (Google, Discord)
- Structured data support for enhanced SEO
- Loading indicators for project and blog content
- Loading states in header components
- Book a call button in intro component
- Twitter handle support for user profiles
- Lazy loading for images
- Open-panel analytics integration
- Enhanced article view tracking and metrics
- SEO metadata with dynamic URLs

### Changed

- Migrated to Turborepo for monorepo management
- Switched to Bun runtime for faster builds and execution
- Updated to Ultracite v6 for linting and formatting
- Removed server-side Sentry tracking
- Reduced code duplication across tRPC client initialization
- Query prefetching optimization using Promise.all for improved performance
- Replaced next-themes with custom theme provider
- Switched from react-markdown to marked for better performance
- Upgraded to TanStack Start RC
- Updated navbar to use useLocation for active link detection
- Improved ServiceCard layout and responsiveness
- Enhanced dialog overlay with updated background and blur effect

### Fixed

- Auth middleware handling
- User role validation to use lowercase 'admin' consistently
- Default value for entityName prop in DataTable
- PostCSS configuration
- Tailwind CSS styling issues
- tRPC router configuration
- Dashboard user list display
- Layout spacing in Home component
- Markdown header rendering
- Theme handling improvements
- Twitter image metadata key in SEO configuration

## [1.0.0] - 2025-11-13

### Added

- Modern full-stack portfolio website
- Blog with articles and MDX support
- Projects showcase with GitHub integration
- Code snippets collection
- AI chatbot with portfolio knowledge
- Admin dashboard with authentication
- GitHub OAuth integration
- Analytics and stats page
- Guestbook feature
- Bookmarks collection
- User authentication with Better Auth
- Dark/light theme support
- SEO optimization
- Sitemap generation
- Error monitoring with Sentry

### Tech Stack

- React 19 with React Compiler
- TanStack Start (full-stack React framework)
- PostgreSQL with Drizzle ORM
- Upstash Redis caching
- Vercel AI SDK with OpenAI
- Tailwind CSS v4
- shadcn/ui components
- TypeScript with strict mode
- Biome for linting and formatting

[Unreleased]: https://github.com/FaZeRs/portfolio/compare/v1.0.0...HEAD
[2.0.0]: https://github.com/FaZeRs/portfolio/releases/tag/v2.0.0
[1.0.0]: https://github.com/FaZeRs/portfolio/releases/tag/v1.0.0
