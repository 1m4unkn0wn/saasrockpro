// @@@ pwned by 1m4unkn0wn @@@
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import vercelPreset from "@vercel/remix";

export default defineConfig({
  server: { port: 3000 },
  plugins: [reactRouter(), tsconfigPaths()],
  ssr: {
    // noExternal: ["remix-i18next"],
  },
  resolve: {
    alias: {
      ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
  },
});
