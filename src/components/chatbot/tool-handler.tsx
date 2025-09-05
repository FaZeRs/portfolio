import { ReactNode } from "react";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "~/components/ai-elements/tool";

type ToolPart = {
  toolCallId: string;
  state: string;
  type: string;
  input?: ReactNode;
  output?: ReactNode;
};

type ToolHandlerProps = {
  part: ToolPart;
  // biome-ignore lint/suspicious/noExplicitAny: Complex union types from AI library
  outputRenderer: (output: any) => ReactNode;
};

export function ToolHandler({ part, outputRenderer }: ToolHandlerProps) {
  const { toolCallId, state, type, input, output } = part;

  return (
    <Tool defaultOpen={true} key={toolCallId}>
      {/* biome-ignore lint/suspicious/noExplicitAny: AI library types */}
      <ToolHeader state={state as any} type={type as any} />
      <ToolContent>
        {state === "input-available" && input && (
          // biome-ignore lint/suspicious/noExplicitAny: AI library types
          <ToolInput input={input as any} />
        )}
        {state === "output-available" && output && (
          <ToolOutput errorText={undefined} output={outputRenderer(output)} />
        )}
      </ToolContent>
    </Tool>
  );
}
