import { TanStackDevtools } from "@tanstack/react-devtools";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import {
  TanStackRouterDevtools,
  TanStackRouterDevtoolsPanel,
} from "@tanstack/react-router-devtools";


import Header from "../components/Header";
import appCss from "../styles.css?url";
import { useEffect } from "react";
import { client } from "../lib/appwrite";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Ping Appwrite backend to verify setup
    if (typeof client.ping === "function") {
      client.ping();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          </div>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />, 
              },
            ]}
          />
          <TanStackRouterDevtools />
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  );
}
