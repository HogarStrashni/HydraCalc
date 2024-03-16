<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import { InputField } from '@/components/custom-ui/input-field';
	import { Typography } from '@/components/custom-ui/typography';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';

	import { Send } from 'lucide-svelte';

	export let data;

	const { form: formData } = data;

	const { form, errors, submitting, enhance } = superForm(formData);
</script>

<div class="mx-auto flex h-full w-full max-w-96 flex-col justify-center">
	<Typography as="h1" class="text-xl">New Password</Typography>
	<Typography as="p" class="mt-2 text-sm font-medium opacity-50">
		Enter your new password
	</Typography>

	<form class="relative mt-10 w-full" method="post" use:enhance>
		<InputField
			label="Password"
			name="password"
			type="password"
			placeholder="******"
			autocomplete="off"
			bind:value={$form.password}
			error={$errors.password?.toString() || $errors._errors?.toString()}
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
			Reset Password
		</Button>
	</form>
</div>
