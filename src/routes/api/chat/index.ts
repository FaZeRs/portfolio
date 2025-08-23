import { openai } from "@ai-sdk/openai";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { desc, eq } from "drizzle-orm";
import { db } from "~/lib/server/db";
import { articles, Experience, Project } from "~/lib/server/schema";

type KnowledgeData = {
  projects: Array<{
    title: string;
    slug: string;
    description?: string | null;
    stacks?: string[] | null;
    githubUrl?: string | null;
    demoUrl?: string | null;
    isFeatured: boolean;
  }>;
  articles: Array<{
    title: string;
    slug: string;
    description?: string | null;
    tags?: string[] | null;
    likes: number;
    views: number;
    createdAt: Date;
  }>;
  experiences: Array<{
    title: string;
    description?: string | null;
    institution?: string | null;
    type: string | null;
    startDate?: string | null;
    endDate?: string | null;
    isOnGoing: boolean;
  }>;
};

async function getPortfolioKnowledge(): Promise<KnowledgeData> {
  // Fetch public projects
  const projects = await db.query.Project.findMany({
    orderBy: desc(Project.isFeatured),
    where: eq(Project.isDraft, false),
    columns: {
      title: true,
      slug: true,
      description: true,
      stacks: true,
      githubUrl: true,
      demoUrl: true,
      isFeatured: true,
    },
  });

  // Fetch public articles
  const blogPosts = await db.query.articles.findMany({
    orderBy: desc(articles.createdAt),
    where: eq(articles.isDraft, false),
    columns: {
      title: true,
      slug: true,
      description: true,
      tags: true,
      likes: true,
      views: true,
      createdAt: true,
    },
  });

  // Fetch public experiences
  const experienceList = await db.query.Experience.findMany({
    orderBy: desc(Experience.id),
    where: eq(Experience.isDraft, false),
    columns: {
      title: true,
      description: true,
      institution: true,
      type: true,
      startDate: true,
      endDate: true,
      isOnGoing: true,
    },
  });

  return {
    projects,
    articles: blogPosts,
    experiences: experienceList,
  };
}

function formatKnowledgeForAI(knowledge: KnowledgeData): string {
  const {
    projects,
    articles: blogPosts,
    experiences: workExperiences,
  } = knowledge;

  const formattedKnowledge = `
**Nauris Linde's Portfolio Content:**

**FEATURED PROJECTS:**
${projects
  .filter((p) => p.isFeatured)
  .map((project) => {
    const stacks = project.stacks?.join(", ") || "N/A";
    const github = project.githubUrl
      ? `\n  - GitHub: ${project.githubUrl}`
      : "";
    const demo = project.demoUrl ? `\n  - Live Demo: ${project.demoUrl}` : "";

    return `• **${project.title}** (${project.slug})
  - Description: ${project.description || "No description available"}
  - Technologies: ${stacks}${github}${demo}`;
  })
  .join("\n\n")}

**OTHER PROJECTS:**
${projects
  .filter((p) => !p.isFeatured)
  .slice(0, 10) // Limit to first 10 to avoid too much text
  .map((project) => {
    const stacks = project.stacks?.join(", ") || "N/A";
    return `• **${project.title}**: ${project.description || "No description available"} (${stacks})`;
  })
  .join("\n")}

**RECENT BLOG POSTS:**
${blogPosts
  .slice(0, 10) // Latest 10 articles
  .map((article) => {
    const tags = article.tags?.join(", ") || "General";
    const date = article.createdAt.toLocaleDateString();
    return `• **${article.title}** (${date})
  - Description: ${article.description || "No description available"}
  - Topics: ${tags}
  - Engagement: ${article.likes} likes, ${article.views} views
  - Read at: https://naurislinde.dev/blog/${article.slug}`;
  })
  .join("\n\n")}

**PROFESSIONAL EXPERIENCE:**
${workExperiences
  .filter((exp) => exp.type?.toLowerCase() === "work")
  .map((exp) => {
    const duration = exp.isOnGoing
      ? `${exp.startDate} - Present`
      : `${exp.startDate} - ${exp.endDate}`;
    const company = exp.institution ? ` at ${exp.institution}` : "";

    return `• **${exp.title}**${company} (${duration})
  - ${exp.description || "No description available"}`;
  })
  .join("\n\n")}

**EDUCATION & CERTIFICATIONS:**
${workExperiences
  .filter(
    (exp) =>
      exp.type?.toLowerCase() === "education" ||
      exp.type?.toLowerCase() === "certification"
  )
  .map((exp) => {
    const duration = exp.endDate ? `(${exp.endDate})` : "";
    const institution = exp.institution ? ` - ${exp.institution}` : "";

    return `• **${exp.title}**${institution} ${duration}
  - ${exp.description || "No description available"}`;
  })
  .join("\n\n")}

When discussing projects, you can direct people to view them at:
- Project details: https://naurislinde.dev/projects/[slug]
- All projects: https://naurislinde.dev/projects

For blog content, direct them to:
- Specific article: https://naurislinde.dev/blog/[slug]
- All articles: https://naurislinde.dev/blog

Always mention specific project names, technologies used, and provide direct links when relevant.
`;

  return formattedKnowledge;
}

export const ServerRoute = createServerFileRoute("/api/chat/").methods({
  POST: async ({ request }) => {
    const { messages }: { messages: UIMessage[] } = await request.json();

    const calendlyUrl =
      process.env.CALENDLY_URL ?? "https://calendly.com/naurislinde/30min";

    // Fetch dynamic portfolio knowledge
    const portfolioKnowledge = await getPortfolioKnowledge();
    const dynamicContent = formatKnowledgeForAI(portfolioKnowledge);

    const serviceKnowledge = `
You are Nauris Linde's AI assistant. Here's information about Nauris's services and background:

**About Nauris Linde:**
- Full-Stack Software Engineer
- Email: naurislinde@gmail.com
- Portfolio: https://naurislinde.dev
- GitHub: https://github.com/fazers
- LinkedIn: https://www.linkedin.com/in/naurislinde/
- Twitter: https://twitter.com/naurislinde

**Technical Expertise:**
- Frontend: React, TypeScript, Next.js, Tanstack Router, Tailwind CSS
- Backend: Node.js, tRPC, PostgreSQL, Drizzle ORM
- Full-Stack: Modern web applications, API development, database design
- DevOps: Deployment, CI/CD, performance optimization

**Services Offered:**
1. **Web Application Development**: Custom full-stack web applications using modern technologies
2. **Frontend Development**: React-based user interfaces with TypeScript and modern styling
3. **Backend API Development**: RESTful APIs, GraphQL, tRPC implementations
4. **Desktop Application Development**: Desktop applications using C++ and Qt
5. **Mobile Application Development**: Mobile applications using Expo
6. **Technical Consulting**: Architecture review, code optimization, best practices
7. **Performance Optimization**: Web performance auditing and improvements
8. **Database Design**: PostgreSQL, schema design, optimization

**Meeting Booking:**
When someone wants to schedule a meeting or consultation, use Calendly at ${calendlyUrl}.

${dynamicContent}

Always be helpful, professional, and enthusiastic about Nauris's work. Provide specific examples from his projects and articles when relevant. Direct users to specific URLs for more detailed information.
`;
    try {
      const result = streamText({
        model: openai("gpt-5-nano"),
        system: serviceKnowledge,
        messages: convertToModelMessages(messages),
      });

      return result.toUIMessageStreamResponse({
        sendSources: false,
        sendReasoning: true,
      });
    } catch (error) {
      return new Response(
        `Error: ${error instanceof Error ? error.message : "Internal server error"}`,
        { status: 500 }
      );
    }
  },
});
