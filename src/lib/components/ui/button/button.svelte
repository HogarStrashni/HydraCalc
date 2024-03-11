<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/styleTransition';
	import { buttonVariants, type Props, type Events } from '.';

	import LoadingSpinner from '@/components/custom-ui/loading-spinner.svelte';

	type $$Props = Props & { icon?: ConstructorOfATypedSvelteComponent; isLoading?: boolean };
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };

	export let icon: $$Props['icon'] = undefined;
	export let isLoading: $$Props['isLoading'] = undefined;
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	{#if icon}
		<svelte:component this={!isLoading ? icon : LoadingSpinner} class="mr-2 h-4 w-4" />
	{/if}
	<slot />
</ButtonPrimitive.Root>
