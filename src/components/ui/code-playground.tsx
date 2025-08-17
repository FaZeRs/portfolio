import { Sandpack } from "@codesandbox/sandpack-react";

type CodePlaygroundProps = {
  files: Record<string, string>;
};

export default function CodePlayground({
  files,
}: Readonly<CodePlaygroundProps>) {
  return (
    <Sandpack
      files={files}
      options={{ showConsole: true, showConsoleButton: true }}
      template="vanilla"
      theme="light"
    />
  );
}
