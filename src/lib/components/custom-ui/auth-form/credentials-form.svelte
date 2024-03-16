<script lang="ts">
	import { page } from '$app/stores';

	import { superForm } from 'sveltekit-superforms';

	import { InputField } from '@/components/custom-ui/input-field';
	import { Button } from '@/components/ui/button';

	import { showFormActionToast } from '@/utils/toasts';
	import { LogIn } from 'lucide-svelte';

	export let submitButtonText: string | undefined = undefined;
	export let formData;

	const { form, errors, submitting, enhance } = superForm(formData, {
		onResult: ({ result }) => {
			if ($page.url.pathname === '/signin') {
				showFormActionToast('verify-email', result);
			}
		}
	});
</script>

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
	<slot />
</form>
