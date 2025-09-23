import { sentryVitePlugin } from '@sentry/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
export default defineConfig(({ mode }) => ({
	plugins: [
		mode === 'production' &&
			sentryVitePlugin({
				org: 'cozyblog',
				project: 'easyrd-web',
				authToken: process.env.SENTRY_AUTH_TOKEN
			}),
		sveltekit(),
		monacoEditorPlugin({
			languageWorkers: ['typescript', 'css', 'html', 'json']
		})
	].filter(Boolean),
	resolve: { alias: { $lib: '/src/lib' } },
	ssr: { 
		noExternal: ['@sentry/sveltekit']
	},
	optimizeDeps: {
		include: ['@sentry/sveltekit']
	}
}));
