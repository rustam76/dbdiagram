import { sentryVitePlugin } from "@sentry/vite-plugin";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import monacoEditorEsmPlugin from "vite-plugin-monaco-editor-esm";
export default defineConfig(({ mode }) => ({
  plugins: [
    mode === "production" &&
      sentryVitePlugin({
        org: "cozyblog",
        project: "easyrd-web",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
    sveltekit(),
    monacoEditorEsmPlugin({
      languageWorkers: [
        "editorWorkerService",
        "typescript",
        "css",
        "html",
        "json",
      ],
    }),
  ].filter(Boolean),
  resolve: { alias: { $lib: "/src/lib" } },
  ssr: {
    noExternal: ["@sentry/sveltekit"],
  },
  optimizeDeps: {
    include: ["@sentry/sveltekit", "monaco-editor"],
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude Monaco Editor CSS files from the build
        if (id.includes('monaco-editor') && id.endsWith('.css')) {
          return true;
        }
        return false;
      },
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
}));
