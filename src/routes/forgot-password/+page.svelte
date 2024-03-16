<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import { Send } from 'lucide-svelte';

	import { InputField } from '@/components/custom-ui/input-field';
	import { Typography } from '@/components/custom-ui/typography';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { showFormActionToast } from '@/utils/toasts';

	export let data;

	const { form: formData } = data;

	const { form, errors, submitting, enhance } = superForm(formData, {
		onResult: ({ result }) => {
			showFormActionToast('reset-password', result);
		},
		onError: 'apply'
	});
</script>

<div class="mx-auto flex h-full w-full max-w-96 flex-col justify-center">
	<Typography as="h1" class="text-xl">Reset Your Password</Typography>
	<Typography as="p" class="mt-2 text-sm font-medium opacity-50">
		Type in your email and we'll send you a link to reset your password
	</Typography>

	<form class="relative mt-10 w-full" method="post" use:enhance>
		<InputField
			label="Email"
			name="email"
			placeholder="example@example.com"
			autocomplete="on"
			bind:value={$form.email}
			error={$errors.email?.toString() || $errors._errors?.toString()}
			on:input={() => ($errors = {})}
		/>
		<Separator class="mt-8" />
		<Button
			type="submit"
			class="mt-10 w-full"
			size="lg"
			icon={Send}
			disabled={$submitting}
			isLoading={$submitting}
		>
			Send Reset Email
		</Button>
	</form>

	<div class="mt-8 flex justify-center">
		<Typography as="p" class="h-full text-sm font-medium opacity-70">
			Already have an account?
		</Typography>
		<Button href="/signin" variant="link" size="sm" class="h-fit px-1">Sign In</Button>
	</div>
</div>
