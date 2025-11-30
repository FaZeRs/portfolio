import { ComponentType, createElement, useEffect, useState } from "react";

export function DevtoolsComponent() {
  // biome-ignore lint/suspicious/noExplicitAny: any is acceptable for dynamically loaded dev-only components
  const [devtools, setDevtools] = useState<ComponentType<any> | null>(null);
  const [QueryDevtools, setQueryDevtools] = useState<ComponentType | null>(
    null
  );
  const [RouterDevtools, setRouterDevtools] = useState<ComponentType | null>(
    null
  );

  useEffect(() => {
    const loadDevtools = async () => {
      try {
        const [
          { TanStackDevtools },
          { ReactQueryDevtoolsPanel },
          { TanStackRouterDevtoolsPanel },
        ] = await Promise.all([
          import("@tanstack/react-devtools"),
          import("@tanstack/react-query-devtools"),
          import("@tanstack/react-router-devtools"),
        ]);

        setDevtools(() => TanStackDevtools);
        setQueryDevtools(() => ReactQueryDevtoolsPanel);
        setRouterDevtools(() => TanStackRouterDevtoolsPanel);
      } catch {
        // Silently fail in production
      }
    };

    if (import.meta.env.DEV) {
      loadDevtools();
    }
  }, []);

  const isReady = devtools && QueryDevtools && RouterDevtools;
  if (!isReady) {
    return null;
  }

  const TanStackDevtoolsComponent = devtools;

  return (
    <TanStackDevtoolsComponent
      config={{
        position: "bottom-left",
      }}
      eventBusConfig={{
        debug: false,
        connectToServerBus: true,
      }}
      plugins={[
        {
          name: "TanStack Query",
          render: createElement(QueryDevtools),
        },
        {
          name: "TanStack Router",
          render: createElement(RouterDevtools),
        },
      ]}
    />
  );
}
