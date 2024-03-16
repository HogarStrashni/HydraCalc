<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Chrome } from 'lucide-svelte';

	let signingInWithGoogle = false;
</script>

<Button
	href="/api/login/google"
	variant="secondary"
	size="lg"
	class="mt-8 w-full text-base"
	icon={Chrome}
	bind:isLoading={signingInWithGoogle}
	on:click={() => (signingInWithGoogle = true)}
>
	Continue with Google
</Button>
