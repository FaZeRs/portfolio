import { OpenPanelMethodNames, OpenPanelOptions } from "@openpanel/web";

const CDN_URL = "https://openpanel.dev/op1.js";

type OpenPanelComponentProps = Omit<OpenPanelOptions, "filter"> & {
  profileId?: string;
  cdnUrl?: string;
  filter?: string;
  globalProperties?: Record<string, unknown>;
};

const stringify = (obj: unknown) => {
  if (typeof obj === "object" && obj !== null && obj !== undefined) {
    const entries = Object.entries(obj).map(([key, value]) => {
      if (key === "filter") {
        return `"${key}":${value}`;
      }
      return `"${key}":${JSON.stringify(value)}`;
    });
    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(obj);
};

export function OpenPanelComponent({
  profileId,
  cdnUrl,
  globalProperties,
  ...options
}: OpenPanelComponentProps) {
  const methods: { name: OpenPanelMethodNames; value: unknown }[] = [
    {
      name: "init",
      value: {
        ...options,
      },
    },
  ];
  if (profileId) {
    methods.push({
      name: "identify",
      value: {
        profileId,
      },
    });
  }
  if (globalProperties) {
    methods.push({
      name: "setGlobalProperties",
      value: globalProperties,
    });
  }
  return (
    <>
      <script async defer src={cdnUrl ?? CDN_URL} />
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: valid
        dangerouslySetInnerHTML={{
          __html: `window.op = window.op || function(...args) {(window.op.q = window.op.q || []).push(args)};
          ${methods
            .map((method) => {
              return `window.op('${method.name}', ${stringify(method.value)});`;
            })
            .join("\n")}`,
        }}
      />
    </>
  );
}
