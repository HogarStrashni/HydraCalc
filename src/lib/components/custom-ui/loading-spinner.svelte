<script lang="ts">
	import { cn } from '$lib/utils/styleTransition';

	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'animate-spin rounded-full border-[3px] border-solid border-y-inherit border-l-transparent border-r-inherit duration-700',
		className
	)}
/>
