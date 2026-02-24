import { ReactNode } from "react";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
} from "~/components/ai-elements/tool";

interface ToolPart {
  input?: ReactNode;
  output?: ReactNode;
  state: string;
  toolCallId: string;
  type: string;
}

interface ToolHandlerProps {
  // biome-ignore lint/suspicious/noExplicitAny: Complex union types from AI library
  outputRenderer: (output: any) => ReactNode;
  part: ToolPart;
}

export function ToolHandler({
  part,
  outputRenderer,
}: Readonly<ToolHandlerProps>) {
  const { toolCallId, state, type, output } = part;

  return (
    <Tool defaultOpen={true} key={toolCallId}>
      {/* biome-ignore lint/suspicious/noExplicitAny: AI library types */}
      <ToolHeader state={state as any} type={type as any} />
      <ToolContent>
        {state === "output-available" && output && (
          <ToolOutput errorText={undefined} output={outputRenderer(output)} />
        )}
      </ToolContent>
    </Tool>
  );
}

export default ToolHandler;
