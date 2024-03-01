<script lang="ts">
	import { cn } from '@/utils';

	import type { HTMLInputAttributes } from 'svelte/elements';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { AlertCircle } from 'lucide-svelte';

	export let type: HTMLInputAttributes['type'] = 'text';
	export let name: HTMLInputAttributes['name'] = undefined;
	export let value: HTMLInputAttributes['value'] = undefined;
	export let disabled: HTMLInputAttributes['disabled'] = undefined;
	export let placeholder: HTMLInputAttributes['placeholder'] = undefined;

	let className: HTMLInputAttributes['class'] = undefined;
	export { className as class };

	export let label: string | undefined = undefined;
	export let error: string | undefined = undefined;
</script>

<div class={cn('space-y-1.5', className)}>
	<Label for={name}>{label}</Label>
	<div class="relative space-y-1">
		<Input
			{type}
			{name}
			id={name}
			{value}
			{disabled}
			{placeholder}
			class={error ? 'border-destructive' : null}
			aria-invalid={error ? 'true' : undefined}
			on:input
		/>

		<p class="h-4 text-xs font-semibold text-destructive">{error ?? ''}</p>
		{#if error}
			<AlertCircle class="absolute h-5 w-5 text-destructive top-1.5 right-3" />
		{/if}
	</div>
</div>
