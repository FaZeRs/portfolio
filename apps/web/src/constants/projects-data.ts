export const projectsData = [
  {
    id: 1,
    title: "Portfolio",
    slug: "portfolio",
    description:
      "My personal portfolio website, built with Next.js, Tailwind CSS, and TypeScript.",
    content: `# Portfolio Website

This is my personal portfolio website built with modern web technologies. It showcases my projects, skills, and experience while serving as a platform to share my work with others.

## Tech Stack

The project is built using a modern tech stack with the following key technologies:

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **tRPC** - End-to-end typesafe APIs
- **Turborepo** - High-performance build system
- **Drizzle** - TypeScript ORM

## Key Features

### 1. Monorepo Structure

The project uses a monorepo structure powered by Turborepo, organizing code into:

<Files>
  <Folder name="apps" defaultOpen>
    <File name="web" />
  </Folder>
  <Folder name="packages">
    <File name="api" />
    <File name="auth" />
    <File name="db" />
    <File name="ui" />
    <File name="validators" />
  </Folder>
  <Folder name="tooling">
    <File name="eslint" />
    <File name="prettier" />
    <File name="typescript" />
  </Folder>
</Files>

### 2. UI Components

The UI is built using a custom component library based on shadcn/ui, providing:

- Dark/Light theme support
- Responsive design
- Reusable components
- Tailwind CSS styling

### 3. Performance

The website is optimized for performance with:

- Server-side rendering
- Image optimization
- Code splitting
- Edge runtime support

## Development
      
To run this project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/FaZeRs/portfolio.git

# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

## Deployment

The website is deployed on Vercel with:

- Automatic deployments
- Edge functions
- Analytics and Speed Insights
- Sentry error tracking`,
    imageUrl: "/images/projects/portfolio.png",
    isFeature: true,
    githubUrl: "https://github.com/fazers/portfolio",
    demoUrl: "https://naurislinde.dev",
    projectStack: [
      {
        id: 1,
        stack: {
          id: 1,
          name: "Next.js",
        },
      },
      {
        id: 2,
        stack: {
          id: 2,
          name: "TailwindCSS",
        },
      },
      {
        id: 3,
        stack: {
          id: 3,
          name: "TypeScript",
        },
      },
      {
        id: 4,
        stack: {
          id: 4,
          name: "React.js",
        },
      },
      {
        id: 5,
        stack: {
          id: 5,
          name: "Turborepo",
        },
      },
      {
        id: 6,
        stack: {
          id: 6,
          name: "Trpc",
        },
      },
      {
        id: 7,
        stack: {
          id: 7,
          name: "Drizzle",
        },
      },
    ],
  },
];
