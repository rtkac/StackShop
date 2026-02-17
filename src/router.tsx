import { QueryClient } from "@tanstack/react-query";
import { createRouter, Link } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      queryClient: new QueryClient(),
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPreload: "intent",
    scrollRestorationBehavior: "instant",
    defaultErrorComponent: () => <div>Oops! An error occurred.</div>,
    defaultNotFoundComponent: () => (
      <div>
        <p>404 - Page Not Found</p>
        <Link to="/">Go back home</Link>
      </div>
    ),
  });

  return router;
};
