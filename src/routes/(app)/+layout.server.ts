import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession }, url }) => {
	const session = await getSession();
	
	// If user is not authenticated, redirect to signin
	if (!session?.user) {
		throw redirect(302, '/signin');
	}

	return {
		session
	};
};