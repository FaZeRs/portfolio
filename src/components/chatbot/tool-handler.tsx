import { ReactNode } from "react";
import {
  Tool,
  ToolContent,
  ToolHeader,
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
