<script lang="ts">
	import { enhance } from '$app/forms';

	import InputField from '@/components/custom-ui/input-field.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';

	import { Chrome, LogIn } from 'lucide-svelte';
</script>

<div class="flex h-full flex-col">
	<Button href="/" variant="secondary" class="m-4 ml-auto max-w-fit">Back</Button>
	<div class="mx-auto flex w-full max-w-96 flex-1 flex-col items-center justify-center">
		<Button
			href="/api/login/google"
			variant="secondary"
			size="lg"
			class="w-full text-base"
			icon={Chrome}
		>
			Continue with Google
		</Button>

		<!-- custom separator -->
		<div class="relative mt-8 flex w-full items-center justify-center text-sm">
			<Separator class="absolute -z-10" />
			<p class="bg-background px-1.5 pb-1">or</p>
		</div>

		<form class="mt-6 w-full" method="post" use:enhance>
			<InputField label="Email" name="email" placeholder="example@example.com" />
			<InputField
				label="Password"
				name="password"
				type="password"
				placeholder="********"
				class="mt-4"
			/>
			<Button type="submit" class="mt-8 w-full" size="lg" icon={LogIn}>Login</Button>
		</form>
	</div>
</div>
