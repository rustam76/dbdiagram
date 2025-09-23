<script lang="ts">
	import type { PageData } from './$types';
	import { signIn } from '@auth/sveltekit/client';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { session, registrationEnabled } = data;

	let email = '';
	let password = '';
	let error = '';
	let loading = false;
	let showPassword = false;

	// Check for registration disabled message
	let registrationMessage = $derived((() => {
		const message = $page.url.searchParams.get('message');
		if (message === 'registration_disabled') {
			return 'Registration is currently disabled. Please contact an administrator.';
		}
		return '';
	})())

	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};

	const handleLogin = async (e: Event) => {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false
			});

			if (result?.error) {
				error = 'Invalid email or password';
			} else {
				goto('/signin/after');
			}
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			loading = false;
		}
	};
</script>

{#if session}
	<h1>Already signed in. Will be redirected</h1>
{:else}
	<div class="container">
		<div class="form">
			<div class="panel">Diagram</div>
			<form on:submit={handleLogin}>
				<div class="input-group">
					<label for="email">Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						placeholder="Enter your email"
					/>
				</div>
				<div class="input-group">
					<label for="password">Password</label>
					<div class="password-input-wrapper">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							required
							placeholder="Enter your password"
						/>
						<button
							type="button"
							class="password-toggle"
							on:click={togglePasswordVisibility}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
									<line x1="1" y1="1" x2="23" y2="23"/>
								</svg>
							{:else}
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
									<circle cx="12" cy="12" r="3"/>
								</svg>
							{/if}
						</button>
					</div>
				</div>
				{#if error}
					<div class="error">{error}</div>
				{/if}
				{#if registrationMessage}
					<div class="info-message">{registrationMessage}</div>
				{/if}
				<button type="submit" class="login-button" disabled={loading}>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
				{#if registrationEnabled}
					<div class="register-link">
						<p>Don't have an account? <a href="/register">Register here</a></p>
					</div>
				{/if}
			</form>
		</div>
	</div>
{/if}

<style>
	.container {
		flex-direction: column;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--color-grey-100);
		border-radius: var(--size-4);
		border: 1px solid var(--color-grey-300);
		padding: 2rem 4rem;
		gap: var(--size-4);
		min-width: 400px;
	}

	.form > .panel {
		font-size: var(--size-8);
		margin-bottom: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 600;
		color: var(--color-grey-700);
	}

	.password-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	input {
		padding: 0.75rem;
		border: 1px solid var(--color-grey-300);
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: border-color 0.2s ease-in-out;
		width: 100%;
	}

	.password-input-wrapper input {
		padding-right: 3rem;
	}

	input:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}

	.password-toggle {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-grey-500);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		border-radius: 0.25rem;
		transition: color 0.2s ease-in-out;
	}

	.password-toggle:hover {
		color: var(--color-grey-700);
		background-color: var(--color-grey-200);
	}

	.password-toggle:focus {
		outline: 2px solid #007bff;
		outline-offset: 2px;
	}

	.error {
		color: #dc3545;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 0.25rem;
		padding: 0.75rem;
		text-align: center;
	}

	.info-message {
		color: #0c5460;
		background-color: #d1ecf1;
		border: 1px solid #bee5eb;
		border-radius: 0.25rem;
		padding: 0.75rem;
		text-align: center;
	}

	.login-button {
		padding: 0.75rem 2rem;
		background-color: #007bff;
		border: none;
		border-radius: 0.5rem;
		color: #fff;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		margin-top: 0.5rem;
	}

	.login-button:hover:not(:disabled) {
		background-color: #0056b3;
	}

	.login-button:disabled {
		background-color: #6c757d;
		cursor: not-allowed;
	}

	.register-link {
		text-align: center;
		margin-top: 1rem;
	}

	.register-link p {
		margin: 0;
		color: var(--color-grey-600);
	}

	.register-link a {
		color: #007bff;
		text-decoration: none;
	}

	.register-link a:hover {
		text-decoration: underline;
	}
</style>
