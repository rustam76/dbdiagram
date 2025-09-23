import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { systemSettings } from '$lib/server/entity';
import { eq } from 'drizzle-orm';
import { DrizzleAdapter } from '$lib/server/adapter/drizzle-adapter';

const adapter = DrizzleAdapter.fromEnv();

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	
	if (!session?.user) {
		throw new Error('Unauthorized');
	}
	
	// Get current system settings
	const db = (adapter as any).db; // Access drizzle instance from adapter
	let settings;
	
	try {
		// Try to get existing settings
		const result = await db.select().from(systemSettings).where(eq(systemSettings.id, 'default')).limit(1);
		
		if (result.length === 0) {
			// Create default settings if none exist
			await db.insert(systemSettings).values({
				id: 'default',
				registrationEnabled: false
			});
			
			settings = {
				id: 'default',
				registrationEnabled: false,
				createdAt: new Date(),
				updatedAt: new Date()
			};
		} else {
			settings = result[0];
		}
	} catch (error) {
		console.error('Error loading system settings:', error);
		// Return default settings if there's an error
		settings = {
			id: 'default',
			registrationEnabled: false,
			createdAt: new Date(),
			updatedAt: new Date()
		};
	}
	
	return {
		settings
	};
};

export const actions: Actions = {
	updateRegistration: async ({ request, locals }) => {
		const session = await locals.auth();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		// Check if user is admin
		const user = await adapter.getUser({ id: session.user.id! });
		if (!user || user.role !== 'admin') {
			return fail(403, { error: 'Forbidden: Admin access required' });
		}
		
		const data = await request.formData();
		const registrationEnabled = data.get('registrationEnabled') === 'on';
		
		try {
			const db = (adapter as any).db; // Access drizzle instance from adapter
			
			// Update or insert system settings
			await db.insert(systemSettings)
				.values({
					id: 'default',
					registrationEnabled,
					updatedAt: new Date()
				})
				.onConflictDoUpdate({
					target: systemSettings.id,
					set: {
						registrationEnabled,
						updatedAt: new Date()
					}
				});
			
			return {
				success: true,
				message: `Registration ${registrationEnabled ? 'enabled' : 'disabled'} successfully`
			};
		} catch (error) {
			console.error('Error updating system settings:', error);
			return fail(500, { error: 'Failed to update settings' });
		}
	}
};