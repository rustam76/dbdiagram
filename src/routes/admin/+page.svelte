<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Admin Dashboard - Easy RD</title>
</svelte:head>

<div class="dashboard">
	<h2>Admin Dashboard</h2>
	
	<div class="dashboard-grid">
		<div class="card">
			<h3>System Settings</h3>
			<p>Manage system-wide settings including user registration controls.</p>
			<a href="/admin/settings" class="btn btn-primary">Manage Settings</a>
		</div>
		
		<div class="card">
			<h3>User Management</h3>
			<p>View and manage user accounts and permissions.</p>
			<a href="/admin/users" class="btn btn-secondary">Manage Users</a>
		</div>
		
		<div class="card">
			<h3>Project Overview</h3>
			<p>Monitor all projects and their activity across the platform.</p>
			<a href="/admin/projects" class="btn btn-secondary">View Projects</a>
		</div>
	</div>
</div>

<style  lang="css">
	.dashboard h2 {
		margin-bottom: 2rem;
		color: #343a40;
		font-size: 2rem;
		font-weight: 600;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.card {
		background: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		border: 1px solid #e9ecef;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0,0,0,0.15);
	}

	.card h3 {
		margin: 0 0 1rem 0;
		color: #495057;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.card p {
		margin: 0 0 1.5rem 0;
		color: #6c757d;
		line-height: 1.5;
	}

	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.375rem;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s ease;
		cursor: pointer;
		text-align: center;
	}

	.btn-primary {
		background-color: #007bff;
		color: white;
	}

	.btn-primary:hover {
		background-color: #0056b3;
	}

	.btn-secondary {
		background-color: #6c757d;
		color: white;
	}

	.btn-secondary:hover {
		background-color: #545b62;
	}
</style>