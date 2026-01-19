import { siteConfig, socialConfig } from "@acme/config";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => {
        const socialLinks = socialConfig
          .map((social) => `- ${social.name}: ${social.url}`)
          .join("\n");

        const content = `# ${siteConfig.title} - Full-Stack Developer Portfolio

> ${siteConfig.description}

## About
${siteConfig.author.name} is a software engineer who started as a Backend Web Developer specializing in Laravel at a digital agency. Currently serving as an R&D Engineer overseeing the technical aspects of a Floorplan team, developing desktop applications using Qt Framework and implementing C++ algorithms in web applications through WebAssembly (WASM).

## Pages
- Home: ${siteConfig.url}
- About: ${siteConfig.url}/about
- Blog: ${siteConfig.url}/blog
- Projects: ${siteConfig.url}/projects
- Snippets: ${siteConfig.url}/snippets
- Uses: ${siteConfig.url}/uses
- Guestbook: ${siteConfig.url}/guestbook
- Stats: ${siteConfig.url}/stats
- Changelog: ${siteConfig.url}/changelog
- Bookmarks: ${siteConfig.url}/bookmarks

## Services
Professional services offered include custom website development, web application development, and business software solutions. Services help businesses grow with modern, scalable, and high-performance digital products.

## Skills & Technologies
### Frontend
React, TypeScript, TanStack (Router, Query, Start), Next.js, Tailwind CSS, Framer Motion

### Backend
Node.js, tRPC, Hono, Laravel, PostgreSQL, Drizzle ORM

### Desktop & Systems
Qt Framework, C++, WebAssembly (WASM)

### Tools & DevOps
Git, Docker, Vite, Turborepo, Vercel

## Tech Stack (This Website)
- Framework: TanStack Start with React
- Language: TypeScript
- Styling: Tailwind CSS
- Data Fetching: tRPC with TanStack Query
- Animations: Framer Motion
- Monorepo: Turborepo
- Package Manager: Bun

## Contact
- Email: ${siteConfig.author.email}
- Website: ${siteConfig.author.url}
${socialLinks}
- Book a Call: ${siteConfig.calendlyUrl}

## Source Code
- Repository: ${siteConfig.links.githubRepo}
`;

        return new Response(content, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
