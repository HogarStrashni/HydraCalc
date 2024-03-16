<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { Typography } from '@/components/custom-ui/typography';
	import { type RedirectCause, showRedirectToast } from '@/utils/toasts';

	$: ({ user, session } = $page.data);

	onMount(() => {
		const redirectCause = $page.url.searchParams.get('cause') as RedirectCause;
		if (!redirectCause) return;

		goto('/');
		showRedirectToast(redirectCause);
	});
</script>

<div class="flex h-full flex-col items-center justify-center space-y-8">
	<Typography as="h3" class="text-center">user: {JSON.stringify(user)}</Typography>
	<Typography as="h3" class="text-center">session: {JSON.stringify(session)}</Typography>
</div>
