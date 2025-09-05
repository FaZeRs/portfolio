import { ChatStatus, UIMessage as MessageType } from "ai";
import { Message, MessageContent } from "~/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "~/components/ai-elements/reasoning";
import { Response } from "~/components/ai-elements/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "~/components/ai-elements/tool";
import { ToolArticle, ToolExperience, ToolProject } from "~/lib/ai";
import { ArticleCard } from "./article-card";
import { ArticleList } from "./article-list";
import { ExperienceCard } from "./experience-card";
import { ExperienceList } from "./experience-list";
import { ProjectCard } from "./project-card";
import { ProjectList } from "./project-list";

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
            case "tool-getProjects":
            case "tool-searchProjects": {
              const { toolCallId, state } = part;

              return (
                <Tool defaultOpen={true} key={toolCallId}>
                  <ToolHeader state={state} type={part.type} />
                  <ToolContent>
                    {state === "input-available" && (
                      <ToolInput input={part.input} />
                    )}
                    {state === "output-available" && (
                      <ToolOutput
                        errorText={undefined}
                        output={
                          <ProjectList
                            projects={part.output as ToolProject[]}
                          />
                        }
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }
            case "tool-getArticles":
            case "tool-searchArticles": {
              const { toolCallId, state } = part;

              return (
                <Tool defaultOpen={true} key={toolCallId}>
                  <ToolHeader state={state} type={part.type} />
                  <ToolContent>
                    {state === "input-available" && (
                      <ToolInput input={part.input} />
                    )}
                    {state === "output-available" && (
                      <ToolOutput
                        errorText={undefined}
                        output={
                          <ArticleList
                            articles={part.output as ToolArticle[]}
                          />
                        }
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }
            case "tool-getExperience":
            case "tool-searchExperience": {
              const { toolCallId, state } = part;

              return (
                <Tool defaultOpen={true} key={toolCallId}>
                  <ToolHeader state={state} type={part.type} />
                  <ToolContent>
                    {state === "input-available" && (
                      <ToolInput input={part.input} />
                    )}
                    {state === "output-available" && (
                      <ToolOutput
                        errorText={undefined}
                        output={
                          <ExperienceList
                            experiences={part.output as ToolExperience[]}
                          />
                        }
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }
            case "tool-recommendProject": {
              const { toolCallId, state } = part;

              return (
                <Tool defaultOpen={true} key={toolCallId}>
                  <ToolHeader state={state} type="tool-recommendProject" />
                  <ToolContent>
                    {state === "input-available" && (
                      <ToolInput input={part.input} />
                    )}
                    {state === "output-available" && (
                      <ToolOutput
                        errorText={undefined}
                        output={
                          <ProjectCard project={part.output as ToolProject} />
                        }
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }
            case "tool-recommendArticle": {
              const { toolCallId, state } = part;

              return (
                <Tool defaultOpen={true} key={toolCallId}>
                  <ToolHeader state={state} type="tool-recommendArticle" />
                  <ToolContent>
                    {state === "input-available" && (
                      <ToolInput input={part.input} />
                    )}
                    {state === "output-available" && (
                      <ToolOutput
                        errorText={undefined}
                        output={
                          <ArticleCard article={part.output as ToolArticle} />
                        }
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }
            case "tool-recommendExperience": {
              const { toolCallId, state } = part;

              return (
                <Tool defaultOpen={true} key={toolCallId}>
                  <ToolHeader state={state} type="tool-recommendExperience" />
                  <ToolContent>
                    {state === "input-available" && (
                      <ToolInput input={part.input} />
                    )}
                    {state === "output-available" && (
                      <ToolOutput
                        errorText={undefined}
                        output={
                          <ExperienceCard
                            experience={part.output as ToolExperience}
                          />
                        }
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }
            default:
              return null;
          }
        })}
      </MessageContent>
    </Message>
  );
}
