import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { service }, request }) => {
	try {
		await service.createMember();
		
		const url = new URL(request.url);
		const redirectUrl = url.searchParams.get('redirect') ?? '/workspace';
		redirect(303, redirectUrl);
	} catch (error) {
		console.error("Error creating member:", error);
		// Redirect ke halaman error atau tampilkan pesan
		redirect(303, '/signin?error=registration-failed');
	}
};