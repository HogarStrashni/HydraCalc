<script lang="ts">
	import { enhance } from '$app/forms';

	import InputField from '@/components/custom-ui/input-field.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';

	import { Chrome, LogIn } from 'lucide-svelte';
</script>

<div class="flex flex-col h-full">
	<Button href="/" variant="secondary" class="m-4 max-w-fit ml-auto">Back</Button>
	<div class="flex-1 flex flex-col items-center justify-center max-w-96 mx-auto w-full">
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
		<div class="relative mt-8 text-sm w-full flex items-center justify-center">
			<Separator class="absolute -z-10" />
			<p class="px-1.5 pb-1 bg-background">or</p>
		</div>

		<form class="w-full mt-6" method="post" use:enhance>
			<InputField label="Email" name="email" placeholder="example@example.com" />
			<InputField
				label="Password"
				name="password"
				type="password"
				placeholder="********"
				class="mt-4"
			/>
			<Button type="submit" class="w-full mt-8" size="lg" icon={LogIn}>Login</Button>
		</form>
	</div>
</div>
