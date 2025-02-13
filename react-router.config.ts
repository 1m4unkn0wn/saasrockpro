// @@@ pwned by 1m4unkn0wn @@@
// import { createRoutesFromFolders } from "@remix-run/v1-route-convention";

import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // tailwind: true,
  // postcss: true,
  // ignoredRouteFiles: ["**/.*"],
  // routes: async (defineRoutes) => {
  //   return flatRoutes("routes", defineRoutes);
  // },
  // routes(defineRoutes) {
  //   // uses the v1 convention, works in v1.15+ and v2
  //   return createRoutesFromFolders(defineRoutes);
  // },
  // serverDependenciesToBundle: ["remix-i18next"],
  // watchPaths: ["./tailwind.config.ts"],
  // cacheDirectory: "./node_modules/.cache/remix",
  // browserNodeBuiltinsPolyfill: {
  //   modules: { crypto: true, events: true },
  // },
  // mdx: async () => {
  //   const [rehypeHighlight] = await Promise.all([import("rehype-highlight").then((mod) => mod.default)]);
  //   return {
  //     rehypePlugins: [rehypeHighlight],
  //   };
  // },
  future: {
    unstable_optimizeDeps: true,
    // v3_fetcherPersist: true,
    // v3_relativeSplatPath: true,
    // v3_throwAbortReason: true,
    // v3_lazyRouteDiscovery: true,
    // v3_singleFetch: true,
    // v3_routeConfig: true,
  },
} satisfies Config;
