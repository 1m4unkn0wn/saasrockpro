// @@@ pwned by 1m4unkn0wn @@@
// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderFunctionArgs } from "react-router";
import { db } from "~/utils/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    await Promise.all([
      db.appConfiguration.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok) {
          return Promise.reject(r);
        }
      }),
    ]);
    return new Response("OK");
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log("healthcheck ❌", { error });
    return new Response(error.message, { status: 500 });
  }
};
