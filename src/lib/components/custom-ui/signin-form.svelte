<script lang="ts">
	import { enhance } from '$app/forms';
	import { page, navigating } from '$app/stores';

	import InputField from '@/components/custom-ui/input-field.svelte';
	import Typography from '@/components/custom-ui/typography.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';

	import { Chrome, LogIn } from 'lucide-svelte';

	const submitButtonText = $page.url.pathname === '/signin' ? 'Sign In' : 'Sign Up';

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

<!-- custom separator -->
<div class="relative mt-8 flex w-full items-center justify-center text-sm">
	<Separator class="absolute -z-10" />
	<Typography as="span" class="bg-background px-1.5 pb-1">or</Typography>
</div>

<form class="mt-6 w-full" method="post" use:enhance>
	<InputField label="Email" name="email" placeholder="example@example.com" autocomplete="on" />
	<InputField
		label="Password"
		name="password"
		type="password"
		placeholder="********"
		class="mt-4"
	/>
	<Button type="submit" class="mt-8 w-full" size="lg" icon={LogIn}>{submitButtonText}</Button>
</form>
