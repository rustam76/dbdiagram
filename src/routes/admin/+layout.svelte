<script lang="ts">
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
	}

	let { data, children }: Props = $props();
</script>

<div class="admin-layout">
	<header class="admin-header">
		<div class="container">
			<h1>Admin Panel</h1>
			<nav class="admin-nav">
				<a href="/admin" class="nav-link">Dashboard</a>
				<a href="/admin/settings" class="nav-link">Settings</a>
				<a href="/" class="nav-link">Back to App</a>
			</nav>
			<div class="user-info">
				<span>Welcome, {data.user.name || data.user.email}</span>
				<span class="role-badge">Admin</span>
			</div>
		</div>
	</header>
	
	<main class="admin-main">
		<div class="container">
			{@render children()}
		</div>
	</main>
</div>

<style>
	.admin-layout {
		min-height: 100vh;
		background-color: #f8f9fa;
	}

	.admin-header {
		background-color: #343a40;
		color: white;
		padding: 1rem 0;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.admin-header h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.admin-nav {
		display: flex;
		gap: 1rem;
	}

	.nav-link {
		color: #adb5bd;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		transition: all 0.2s ease;
	}

	.nav-link:hover {
		color: white;
		background-color: rgba(255,255,255,0.1);
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.role-badge {
		background-color: #28a745;
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.admin-main {
		padding: 2rem 0;
	}

	.admin-main .container {
		display: block;
	}
</style>