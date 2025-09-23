import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DrizzleAdapter } from '$lib/server/adapter/drizzle-adapter';
import { systemSettings } from '$lib/server/entity';
import { eq } from 'drizzle-orm';

const adapter = DrizzleAdapter.fromEnv();

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (session !== null) {
		redirect(307, '/');
	}

	// Get system settings to check if registration is enabled
	try {
		const db = (adapter as any).db;
		const [settings] = await db
			.select()
			.from(systemSettings)
			.where(eq(systemSettings.id, 'default'))
			.limit(1);

		return {
			session,
			registrationEnabled: settings?.registrationEnabled ?? false
		};
	} catch (error) {
		console.error('Error checking registration settings:', error);
		return {
			session,
			registrationEnabled: false
		};
	}
};
