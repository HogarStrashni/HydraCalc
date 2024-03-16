<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { superForm } from 'sveltekit-superforms';
	import { Send } from 'lucide-svelte';

	import { InputField } from '@/components/custom-ui/input-field';
	import { Typography } from '@/components/custom-ui/typography';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { CodeRequestForm } from './components';
	import { type RedirectCause, showRedirectToast } from '@/utils/toasts';

	export let data;

	const { form: formData } = data;

	const { form, errors, submitting, enhance } = superForm(formData, {
		id: 'verify-email',
		onError: 'apply'
	});

	onMount(() => {
		const redirectCause = $page.url.searchParams.get('cause') as RedirectCause;
		if (!redirectCause) return;

		goto('/email-verification');
		showRedirectToast(redirectCause);
	});
</script>

<div class="mx-auto flex h-full w-full max-w-96 flex-col justify-center">
	<Typography as="h1" class="text-xl">Email verification</Typography>
	<Typography as="p" class="mt-2 text-sm font-medium opacity-50">
		Check your email and enter code that we sent you
	</Typography>

	<form class="relative mt-10 w-full" method="post" action="?/verification" use:enhance>
		<InputField
			label="Code"
			name="code"
			placeholder="Enter code..."
			autocomplete="off"
			bind:value={$form.code}
			error={$errors.code?.toString() || $errors._errors?.toString()}
			on:input={() => ($errors = {})}
		/>
		<CodeRequestForm />
		<Separator class="mt-4" />
		<Button
			type="submit"
			class="mt-10 w-full"
			size="lg"
			icon={Send}
			disabled={$submitting}
			isLoading={$submitting}
		>
			Confirm
		</Button>
	</form>

	<div class="mt-8 flex justify-center">
		<Typography as="p" class="h-full text-sm font-medium opacity-70">
			Already have an account?
		</Typography>
		<Button href="/signin" variant="link" size="sm" class="h-fit px-1">Sign In</Button>
	</div>
</div>
