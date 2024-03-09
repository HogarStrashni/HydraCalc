<script lang="ts">
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { page, navigating } from '$app/stores';

	import { Button } from '@/components/ui/button';
	import ProgressBar from '@/components/custom-ui/progress-bar.svelte';
	import Typography from '@/components/custom-ui/typography.svelte';

	import { Toasts } from 'svoast';

	import { ArrowLeft, LogIn, LogOut } from 'lucide-svelte';

	export let data;

	$: ({ user } = data);
	$: isLoginRoute = ['/signin', '/signup'].includes($page.url.pathname);

	// delay LoadingStage for 200 ms
	let isProgressBar = false;

	$: if (!!$navigating === true) {
		setTimeout(() => {
			isProgressBar = !!$navigating;
		}, 200);
	} else {
		isProgressBar = false;
	}
</script>

<!-- add page title on every page -->
<svelte:head>
	<title>{`${$page.data.title ?? 'Home'} | HydraCalc`}</title>
</svelte:head>

{#if isProgressBar}
	<ProgressBar />
{/if}

<Toasts position="bottom-right" />

<div class="mx-auto flex h-[100dvh] max-w-7xl flex-col px-4 py-4 sm:px-8">
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

	{#key $page.url.pathname}
		<main in:fade={{ duration: 300 }} class="h-full flex-1">
			<slot />
		</main>
	{/key}
</div>
