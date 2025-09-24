import { sentryVitePlugin } from "@sentry/vite-plugin";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import monacoEditorEsmPlugin from "vite-plugin-monaco-editor-esm";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
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
        "json",
      ],
     globalAPI: true
    }),
    cssInjectedByJsPlugin(),
  ],
  resolve: { alias: { $lib: "/src/lib" } },
  ssr: {
    noExternal: ["@sentry/sveltekit"],
  },
  optimizeDeps: {
    include: ['monaco-editor', 'pollen-css']
  },
 build: {
    rollupOptions: {
      external: [/\.css$/]
    }
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
}));
