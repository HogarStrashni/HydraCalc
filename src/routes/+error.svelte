<script lang="ts">
	import { page } from '$app/stores';

	import { Button } from '@/components/ui/button';
	import { errorList } from '$lib/error-list';

	import { AlertCircle, Home } from 'lucide-svelte';

	const status = $page.status as keyof typeof errorList;
	const errorMessage =
		$page.error?.message ?? errorList[status]['fallbackMessage'] ?? 'Internal Error';
	const statusText = errorList[status]['description'] ?? 'Something went wrong... Please try again';
</script>

<div class="flex h-full flex-col items-center justify-center px-6">
	<AlertCircle class="h-20 w-20 text-destructive/80" />

	<div class="mt-4 flex space-x-2 text-xl">
		<p>{status}</p>
		<p>{errorMessage}</p>
	</div>
	<p class="mt-4 text-center text-sm">{statusText}</p>

	<Button href="/" variant="outline" class="mt-8" icon={Home}>Back to Home</Button>
</div>
