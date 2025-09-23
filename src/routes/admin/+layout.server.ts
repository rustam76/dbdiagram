import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { DrizzleAdapter } from '$lib/server/adapter/drizzle-adapter';

const adapter = DrizzleAdapter.fromEnv();

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	
	if (!session?.user) {
		throw redirect(302, '/signin');
	}
	
	// Get user data to check role
	const user = await adapter.getUser({ id: session.user.id! });
	
	if (!user || user.role !== 'admin') {
		throw redirect(302, '/');
	}
	
	return {
		session,
		user
	};
};