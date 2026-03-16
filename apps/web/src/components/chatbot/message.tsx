import type { UIMessage } from "@tanstack/ai-client";
import type { ReactNode } from "react";
import { memo } from "react";
import { Message, MessageContent } from "~/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "~/components/ai-elements/reasoning";
import { Response } from "~/components/ai-elements/response";
import type { ToolArticle, ToolExperience, ToolProject } from "~/lib/ai";
import { ArticleCard } from "./article-card";
import { ArticleList } from "./article-list";
import { ExperienceCard } from "./experience-card";
import { ExperienceList } from "./experience-list";
import { ProjectCard } from "./project-card";
import { ProjectList } from "./project-list";
import { ToolHandler } from "./tool-handler";

const toolOutputRenderers: Record<string, (output: unknown) => ReactNode> = {
  getProjects: (output) => <ProjectList projects={output as ToolProject[]} />,
  searchProjects: (output) => (
    <ProjectList projects={output as ToolProject[]} />
  ),
  getArticles: (output) => <ArticleList articles={output as ToolArticle[]} />,
  searchArticles: (output) => (
    <ArticleList articles={output as ToolArticle[]} />
  ),
  getExperience: (output) => (
    <ExperienceList experiences={output as ToolExperience[]} />
  ),
  searchExperience: (output) => (
    <ExperienceList experiences={output as ToolExperience[]} />
  ),
  recommendProject: (output) => <ProjectCard project={output as ToolProject} />,
  recommendArticle: (output) => <ArticleCard article={output as ToolArticle} />,
  recommendExperience: (output) => (
    <ExperienceCard experience={output as ToolExperience} />
  ),
};

export const ChatMessage = memo(function ChatMessageComponent({
  message,
  isLoading,
}: Readonly<{
  message: UIMessage;
  isLoading: boolean;
}>) {
  return (
    <Message from={message.role} key={message.id}>
      <MessageContent>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case "text":
              return (
                <Response
                  key={`${message.id}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: ignored using `--suppress`
                    i
                  }`}
                >
                  {part.content}
                </Response>
              );
            case "thinking":
              return (
                <Reasoning
                  className="w-full"
                  isStreaming={isLoading}
                  key={`${message.id}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: ignored using `--suppress`
                    i
                  }`}
                >
                  <ReasoningTrigger />
                  <ReasoningContent>{part.content}</ReasoningContent>
                </Reasoning>
              );
            case "tool-call": {
              const renderer = toolOutputRenderers[part.name];
              if (!renderer) {
                return null;
              }
              return (
                <ToolHandler
                  key={part.id}
                  name={part.name}
                  outputRenderer={renderer}
                  part={{
                    id: part.id,
                    state: part.state,
                    name: part.name,
                    output: part.output as ReactNode,
                  }}
                />
              );
            }
            default:
              return null;
          }
        })}
      </MessageContent>
    </Message>
  );
});
