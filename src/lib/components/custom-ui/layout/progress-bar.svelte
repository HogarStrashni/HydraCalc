<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const progress = tweened(0, {
		easing: cubicOut,
		duration: 600
	});

	onMount(() => {
		progress.set(0.96);
	});
</script>

<div class="absolute z-50 h-[3px] w-full">
	<div style="width: {$progress * 100}%" class="h-full w-full rounded-r-full bg-primary" />
</div>
