<script lang="ts">
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { page, navigating } from '$app/stores';

	import { Toasts } from 'svoast';
	import { Header, ProgressBar } from '@/components/custom-ui/layout';

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
	<Header />

	{#key $page.url.pathname}
		<main in:fade={{ duration: 300 }} class="h-full flex-1">
			<slot />
		</main>
	{/key}
</div>
