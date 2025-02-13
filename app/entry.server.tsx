// @@@ pwned by 1m4unkn0wn @@@
import type { AppLoadContext, EntryContext } from "react-router";

import isbot from "isbot";

import { resolve } from "node:path";
import { PassThrough } from "node:stream";
import { ServerRouter } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { renderToPipeableStream } from "react-dom/server";

import Backend from "i18next-fs-backend";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { remixI18Next } from "./locale/i18next.server";
import { i18nConfig } from "./locale/i18n";
import path from "path";
import { routes as otherRoutes } from "./other-routes.server";

// const ABORT_DELAY = 5_000;
// Reject/cancel all pending promises after 5 seconds
export const streamTimeout = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  loadContext: AppLoadContext
) {
  const callbackName = isbot(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";

  for (const handler of otherRoutes) {
    // eslint-disable-next-line no-await-in-loop
    const otherRouteResponse = await handler(request, reactRouterContext);
    if (otherRouteResponse) return otherRouteResponse;
  }

  // Internationalization (i18n).
  const i18nInstance = createInstance();
  const lng = await remixI18Next.getLocale(request);
  const ns = remixI18Next.getRouteNamespaces(reactRouterContext);

  await i18nInstance
    .use(initReactI18next) // Tell our instance to use react-i18next.
    .use(Backend) // Setup backend.
    .init({
      ...i18nConfig, // Spread configuration.
      lng, // Locale detected above.
      ns, // Namespaces detected above.
      backend: {
        localePath: path.resolve("./public/locales"),
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });

  return new Promise((resolve, reject) => {
    let shellRendered = false;

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18nInstance}>
        <ServerRouter context={reactRouterContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.
          // Don't log errors encountered during initial shell rendering,
          // since they'll reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        },
      }
    );

    // setTimeout(abort, ABORT_DELAY);
    // Automatically timeout the React renderer after 6 seconds, which ensures
    // React has enough time to flush down the rejected boundary contents
    setTimeout(abort, streamTimeout + 1000);
  });
}
