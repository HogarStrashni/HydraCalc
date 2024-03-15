<script lang="ts">
	import { page } from '$app/stores';

	import { superForm } from 'sveltekit-superforms';

	import InputField from '@/components/custom-ui/input-field.svelte';
	import Typography from '@/components/custom-ui/typography.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { showFormActionToast } from '@/utils/toasts';

	import { Chrome, LogIn } from 'lucide-svelte';

	export let formData;

	const { form, errors, submitting, enhance } = superForm(formData, {
		onResult: ({ result }) => {
			if ($page.url.pathname === '/signin') {
				showFormActionToast('verify-email', result);
			}
		}
	});

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

<form class="relative mt-6 w-full" method="post" use:enhance>
	<InputField
		label="Email"
		name="email"
		placeholder="example@example.com"
		autocomplete="on"
		bind:value={$form.email}
		error={$errors.email?.toString() || $errors._errors?.toString()}
		on:input={() => ($errors = {})}
	/>
	<InputField
		label="Password"
		name="password"
		type="password"
		placeholder="********"
		class="mt-4"
		bind:value={$form.password}
		error={$errors.password?.toString() || $errors._errors?.toString()}
		on:input={() => ($errors = {})}
	/>
	{#if $page.url.pathname === '/signin'}
		<Button
			href="/forgot-password"
			variant="link"
			class="text-forground absolute right-0 top-[99px] px-0 opacity-50">Forgot password?</Button
		>
	{/if}
	<Button
		type="submit"
		class="mt-8 w-full"
		size="lg"
		icon={LogIn}
		disabled={$submitting}
		isLoading={$submitting}
	>
		{submitButtonText}
	</Button>
</form>
