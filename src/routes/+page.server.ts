import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	
	// If user is authenticated, redirect to workspace
	if (session?.user) {
		throw redirect(302, '/workspace');
	}
	
	// If user is not authenticated, redirect to signin
	throw redirect(302, '/signin');
};