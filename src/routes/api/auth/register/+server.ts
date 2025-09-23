import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcrypt from 'bcryptjs';
import { DrizzleAdapter } from '$lib/server/adapter/drizzle-adapter';
import { nanoid } from 'nanoid';

const adapter = DrizzleAdapter.fromEnv();

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password } = await request.json();

		// Validation
		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		if (password.length < 6) {
			return json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
		}

		// Check if user already exists
		const existingUser = await adapter.getUserByEmail(email);
		if (existingUser) {
			return json({ error: 'User with this email already exists' }, { status: 400 });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create user
		const userId = nanoid();
		const newUser = await adapter.registerUserWithPassword({
			id: userId,
			email,
			password: hashedPassword
		});

		return json({ 
			message: 'User registered successfully',
			user: {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name
			}
		}, { status: 201 });

	} catch (error) {
		console.error('Registration error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};