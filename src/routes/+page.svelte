<script lang="ts">
	import { page } from '$app/stores';

	import Typography from '@/components/custom-ui/typography.svelte';

	$: ({ user, session } = $page.data);
</script>

<div class="flex h-full flex-col items-center justify-center space-y-8">
	<Typography as="h3" class="text-center">user: {JSON.stringify(user)}</Typography>
	<Typography as="h3" class="text-center">session: {JSON.stringify(session)}</Typography>
</div>
