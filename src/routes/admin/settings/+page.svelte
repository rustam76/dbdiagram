<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>System Settings - Admin Panel</title>
</svelte:head>

<div class="settings-page">
	<div class="page-header">
		<h2>System Settings</h2>
		<p>Manage system-wide configuration and access controls.</p>
	</div>

	{#if form?.success}
		<div class="alert alert-success">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M9 12l2 2 4-4"/>
				<circle cx="12" cy="12" r="10"/>
			</svg>
			{form.message}
		</div>
	{/if}

	{#if form?.error}
		<div class="alert alert-error">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<line x1="15" y1="9" x2="9" y2="15"/>
				<line x1="9" y1="9" x2="15" y2="15"/>
			</svg>
			{form.error}
		</div>
	{/if}

	<div class="settings-grid">
		<div class="settings-card">
			<div class="card-header">
				<h3>User Registration</h3>
				<p>Control whether new users can register accounts on the platform.</p>
			</div>

			<form 
				method="POST" 
				action="?/updateRegistration"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<div class="form-group">
					<div class="toggle-wrapper">
						<label class="toggle-label">
							<input 
								type="checkbox" 
								name="registrationEnabled" 
								checked={data.settings.registrationEnabled}
								disabled={loading}
							/>
							<span class="toggle-slider"></span>
							<span class="toggle-text">
								{data.settings.registrationEnabled ? 'Registration Enabled' : 'Registration Disabled'}
							</span>
						</label>
					</div>
					
					<div class="help-text">
						{#if data.settings.registrationEnabled}
							<span class="status-enabled">✓ New users can create accounts</span>
						{:else}
							<span class="status-disabled">✗ Registration is currently disabled</span>
						{/if}
					</div>
				</div>

				<div class="form-actions">
					<button type="submit" class="btn btn-primary" disabled={loading}>
						{#if loading}
							<svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 12a9 9 0 11-6.219-8.56"/>
							</svg>
							Updating...
						{:else}
							Save Changes
						{/if}
					</button>
				</div>
			</form>
		</div>

		<!-- Future settings cards can be added here -->
		<div class="settings-card placeholder">
			<div class="card-header">
				<h3>Additional Settings</h3>
				<p>More system settings will be available here in future updates.</p>
			</div>
			<div class="placeholder-content">
				<span>Coming Soon</span>
			</div>
		</div>
	</div>
</div>

<style>
	.settings-page {
		max-width: 1000px;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h2 {
		margin: 0 0 0.5rem 0;
		color: #343a40;
		font-size: 2rem;
		font-weight: 600;
	}

	.page-header p {
		margin: 0;
		color: #6c757d;
		font-size: 1.1rem;
	}

	.alert {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}

	.alert-success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.alert-error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.settings-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 1.5rem;
	}

	.settings-card {
		background: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		border: 1px solid #e9ecef;
	}

	.settings-card.placeholder {
		opacity: 0.6;
	}

	.card-header {
		margin-bottom: 1.5rem;
	}

	.card-header h3 {
		margin: 0 0 0.5rem 0;
		color: #495057;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.card-header p {
		margin: 0;
		color: #6c757d;
		line-height: 1.5;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.toggle-wrapper {
		margin-bottom: 0.75rem;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: 1rem;
		cursor: pointer;
		position: relative;
	}

	.toggle-label input[type="checkbox"] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 24px;
		background-color: #ccc;
		border-radius: 24px;
		transition: background-color 0.3s;
	}

	.toggle-slider::before {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background-color: white;
		border-radius: 50%;
		transition: transform 0.3s;
	}

	.toggle-label input:checked + .toggle-slider {
		background-color: #28a745;
	}

	.toggle-label input:checked + .toggle-slider::before {
		transform: translateX(26px);
	}

	.toggle-label input:disabled + .toggle-slider {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.toggle-text {
		font-weight: 500;
		color: #495057;
	}

	.help-text {
		font-size: 0.9rem;
		margin-left: 66px;
	}

	.status-enabled {
		color: #28a745;
		font-weight: 500;
	}

	.status-disabled {
		color: #dc3545;
		font-weight: 500;
	}

	.form-actions {
		padding-top: 1rem;
		border-top: 1px solid #e9ecef;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.375rem;
		font-weight: 500;
		transition: all 0.2s ease;
		cursor: pointer;
		text-decoration: none;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background-color: #007bff;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #0056b3;
	}

	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.placeholder-content {
		text-align: center;
		padding: 2rem;
		color: #adb5bd;
		font-style: italic;
	}
</style>