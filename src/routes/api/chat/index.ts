import { openai } from "@ai-sdk/openai";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const ServerRoute = createServerFileRoute("/api/chat/").methods({
  POST: async ({ request }) => {
    const { messages }: { messages: UIMessage[] } = await request.json();

    const calendlyUrl =
      process.env.CALENDLY_URL ?? "https://calendly.com/naurislinde/30min";

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

Always be helpful, professional, and enthusiastic about Nauris's work. If asked about specific projects, refer them to the portfolio website for detailed examples.
`;

    const result = streamText({
      model: openai("gpt-5-nano"),
      system: serviceKnowledge,
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  },
});
