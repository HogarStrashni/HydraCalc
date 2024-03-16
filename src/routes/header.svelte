<script lang="ts">
	import { page } from '$app/stores';

	import { Button } from '@/components/ui/button';
	import Typography from '@/components/custom-ui/typography.svelte';

	import { ArrowLeft, LogIn, LogOut } from 'lucide-svelte';

	$: isLoginRoute = ['/signin', '/signup'].includes($page.url.pathname);
	$: user = $page.data.user;
</script>

<header class="flex items-center justify-end space-x-4 border-b pb-4">
	{#if isLoginRoute}
		<Button href="/" variant="outline" class="ml-auto max-w-fit" icon={ArrowLeft}>Back</Button>
	{:else if user?.id}
		<Typography as="h2" class="mr-auto">{user.email}</Typography>
		<Button href="/api/signout" variant="outline" icon={LogOut}>Sign Out</Button>
	{:else}
		<Button href="/signin" variant="outline" icon={LogIn}>Sign In</Button>
	{/if}
</header>
