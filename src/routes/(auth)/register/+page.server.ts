import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { systemSettings } from '$lib/server/entity';
import { eq } from 'drizzle-orm';
import { DrizzleAdapter } from '$lib/server/adapter/drizzle-adapter';

const adapter = DrizzleAdapter.fromEnv();

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user is already authenticated
	const session = await locals.auth();
	if (session?.user) {
		throw redirect(302, '/');
	}

	// Check if registration is enabled
	try {
		const db = (adapter as any).db;
		const [settings] = await db
			.select()
			.from(systemSettings)
			.where(eq(systemSettings.id, 'default'))
			.limit(1);

		// If no settings found or registration is disabled, redirect to signin
		if (!settings || !settings.registrationEnabled) {
			throw redirect(302, '/signin?message=registration_disabled');
		}
	} catch (error) {
		// If there's an error checking settings, assume registration is disabled
		console.error('Error checking registration settings:', error);
		throw redirect(302, '/signin?message=registration_disabled');
	}

	// Registration is enabled, allow access to the page
	return {};
};