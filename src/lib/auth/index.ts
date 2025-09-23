import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import bcrypt from 'bcryptjs';
import { DrizzleAdapter } from '$lib/server/adapter/drizzle-adapter';
import { member } from '$lib/server/entity';
import { eq } from 'drizzle-orm';

const adapter = DrizzleAdapter.fromEnv();

export const { handle, signIn, signOut } = SvelteKitAuth({
	trustHost: true,
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const user = await adapter.getUserByEmail(credentials.email as string);
					if (!user || !user.password) {
						return null;
					}

					const isValidPassword = await bcrypt.compare(
						credentials.password as string,
						user.password
					);

					if (!isValidPassword) {
						return null;
					}

					return {
						id: user.id,
						email: user.email,
						name: user.name,
						image: user.image
					};
				} catch (error) {
					console.error('Auth error:', error);
					return null;
				}
			}
		})
	],
	callbacks: {
		async session({ session, token }) {
			if (token.sub === undefined) {
				throw new Error('No sub in token');
			}
			return {
				...session,
				user: {
					...session.user,
					id: token.sub
				}
			};
		}
	},
	pages: { signIn: '/signin' },
	basePath: ''
});
