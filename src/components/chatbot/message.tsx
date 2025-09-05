import { ChatStatus, UIMessage as MessageType } from "ai";
import { ReactNode } from "react";
import { Message, MessageContent } from "~/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "~/components/ai-elements/reasoning";
import { Response } from "~/components/ai-elements/response";
import { ToolArticle, ToolExperience, ToolProject } from "~/lib/ai";
import { ArticleCard } from "./article-card";
import { ArticleList } from "./article-list";
import { ExperienceCard } from "./experience-card";
import { ExperienceList } from "./experience-list";
import { ProjectCard } from "./project-card";
import { ProjectList } from "./project-list";
import { ToolHandler } from "./tool-handler";

const toolOutputRenderers = {
  "tool-getProjects": (output: ToolProject[]) => (
    <ProjectList projects={output} />
  ),
  "tool-searchProjects": (output: ToolProject[]) => (
    <ProjectList projects={output} />
  ),
  "tool-getArticles": (output: ToolArticle[]) => (
    <ArticleList articles={output} />
  ),
  "tool-searchArticles": (output: ToolArticle[]) => (
    <ArticleList articles={output} />
  ),
  "tool-getExperience": (output: ToolExperience[]) => (
    <ExperienceList experiences={output} />
  ),
  "tool-searchExperience": (output: ToolExperience[]) => (
    <ExperienceList experiences={output} />
  ),
  "tool-recommendProject": (output: ToolProject) => (
    <ProjectCard project={output} />
  ),
  "tool-recommendArticle": (output: ToolArticle) => (
    <ArticleCard article={output} />
  ),
  "tool-recommendExperience": (output: ToolExperience) => (
    <ExperienceCard experience={output} />
  ),
} as const;

export function ChatMessage({
  message,
  status,
}: Readonly<{
  message: MessageType;
  status: ChatStatus;
}>) {
  return (
    <Message from={message.role} key={message.id}>
      <MessageContent>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case "text":
              return (
                <Response key={`${message.id}-${i}`}>{part.text}</Response>
              );
            case "reasoning":
              return (
                <Reasoning
                  className="w-full"
                  isStreaming={status === "streaming"}
                  key={`${message.id}-${i}`}
                >
                  <ReasoningTrigger />
                  <ReasoningContent>{part.text}</ReasoningContent>
                </Reasoning>
              );
            default: {
              // Handle all tool cases uniformly
              if (
                part.type.startsWith("tool-") &&
                part.type in toolOutputRenderers &&
                "toolCallId" in part &&
                "state" in part
              ) {
                const renderer =
                  toolOutputRenderers[
                    part.type as keyof typeof toolOutputRenderers
                  ];
                return (
                  <ToolHandler
                    key={part.toolCallId}
                    outputRenderer={renderer}
                    part={{
                      toolCallId: part.toolCallId,
                      state: part.state,
                      type: part.type,
                      input: ("input" in part
                        ? part.input
                        : undefined) as ReactNode,
                      output: ("output" in part
                        ? part.output
                        : undefined) as ReactNode,
                    }}
                  />
                );
              }
              return null;
            }
          }
        })}
      </MessageContent>
    </Message>
  );
}
