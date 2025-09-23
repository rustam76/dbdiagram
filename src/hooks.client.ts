// Sentry temporarily disabled due to SSR compatibility issues
// import { PUBLIC_SENTRY_DSN } from '$env/static/public';
// import * as Sentry from '@sentry/sveltekit';

// Sentry.init({
//	dsn: PUBLIC_SENTRY_DSN
// });

export const handleError = (error: any, event: any) => {
	console.error('Client error:', error);
	// Your Error Handler
};
