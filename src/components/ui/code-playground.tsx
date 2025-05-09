import { Sandpack } from "@codesandbox/sandpack-react";

interface CodePlaygroundProps {
  files: Record<string, string>;
}

export default function CodePlayground({
  files,
}: Readonly<CodePlaygroundProps>) {
  return (
    <Sandpack
      files={files}
      theme="light"
      template="vanilla"
      options={{ showConsole: true, showConsoleButton: true }}
    />
  );
}
