<script lang="ts">
	import { cn } from '@/utils';

	let className: string | null | undefined = undefined;
	export { className as class };

	export let as: keyof HTMLElementTagNameMap = 'p';
</script>

<svelte:element this={as} class={cn('text-foreground', className)}>
	<slot />
</svelte:element>
