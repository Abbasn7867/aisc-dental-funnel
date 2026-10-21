import { createFileRoute, redirect } from "@tanstack/react-router";

// The full tour now lives on the home page; keep old links working.
export const Route = createFileRoute("/front-office")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
