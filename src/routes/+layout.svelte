<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	import { Button } from '@/components/ui/button';
	import Typography from '@/components/custom-ui/typography.svelte';

	export let data;

	$: ({ user } = data);
	$: isLoginRoute = ['/login', 'signup'].includes($page.url.pathname);
</script>

<header class="flex items-center justify-end space-x-4 border-b pb-4">
	{#if isLoginRoute}
		<Button href="/" variant="outline" class="ml-auto max-w-fit">Back</Button>
	{:else if user?.id}
		<Typography as="h2" class="mr-auto">{user.email}</Typography>
		<form method="post">
			<Button type="submit" variant="outline">Sign Out</Button>
		</form>
	{:else}
		<Button href="/login" variant="outline">Login</Button>
	{/if}
</header>

<main class="h-full flex-1">
	<slot />
</main>
