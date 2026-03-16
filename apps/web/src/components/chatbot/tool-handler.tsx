import type { ToolCallState } from "@tanstack/ai-client";
import type { ReactNode } from "react";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
} from "~/components/ai-elements/tool";

interface ToolPart {
  id: string;
  name: string;
  output?: ReactNode;
  state: ToolCallState;
}

interface ToolHandlerProps {
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: Complex union types from AI library
  outputRenderer: (output: any) => ReactNode;
  part: ToolPart;
}

export function ToolHandler({
  name,
  part,
  outputRenderer,
}: Readonly<ToolHandlerProps>) {
  const { id, state, output } = part;

  return (
    <Tool defaultOpen={true} key={id}>
      <ToolHeader hasOutput={!!output} name={name} state={state} />
      <ToolContent>
        {output && <ToolOutput output={outputRenderer(output)} />}
      </ToolContent>
    </Tool>
  );
}

export default ToolHandler;
