import type { Handle } from "@sveltejs/kit";
import { handle as auth } from "$lib/auth";
import { sequence } from "@sveltejs/kit/hooks";
import { createAdapterHandler } from "$lib/server/adapter";
import { Service } from "$lib/server/service";
import { redirect } from "@sveltejs/kit";
import { DrizzleAdapter } from "$lib/server/adapter/drizzle-adapter";
// Sentry temporarily disabled due to SSR compatibility issues
// import * as Sentry from "@sentry/sveltekit";
// import { PUBLIC_SENTRY_DSN } from "$env/static/public";

const adapterHandler = createAdapterHandler();
const adapter = DrizzleAdapter.fromEnv();

const adminCheck: Handle = async ({ event, resolve }) => {
  // Check if the route is an admin route
  if (event.url.pathname.startsWith('/admin')) {
    const session = await event.locals.auth();
    
    // If not authenticated, redirect to signin
    if (!session?.user) {
      throw redirect(302, '/signin');
    }
    
    // Check if user has admin role
    try {
      const user = await adapter.getUser({ id: session.user.id! });
      if (!user || user.role !== 'admin') {
        throw redirect(302, '/');
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      throw redirect(302, '/');
    }
  }
  
  return resolve(event);
};

const service: Handle = async ({ event, resolve }) => {
  const {
    locals: { dbAdapter, getSession },
  } = event;

  event.locals.service = new Service({
    resource: dbAdapter,
    getSession,
    origin: event.url.origin,
  });
  return resolve(event);
};

// Sentry.init({
//   dsn: PUBLIC_SENTRY_DSN
// });

export const handle = sequence(auth, adapterHandler, adminCheck, service);

export const handleError = (error: any, event: any) => {
	console.error('Server error:', error);
	// Your Error Handler
};
