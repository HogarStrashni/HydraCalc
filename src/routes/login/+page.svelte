<script lang="ts">
	import { enhance } from '$app/forms';
	import InputField from '@/components/custom-ui/input-field.svelte';
	import { Button } from '@/components/ui/button';
</script>

<div class="flex flex-col h-full">
	<a href="/" class="ml-auto max-w-fit m-4 border-2 px-5 py-3 text-lg rounded-lg">Back</a>
	<div class="flex-1 flex flex-col items-center justify-center">
		<form class="w-96" method="post" use:enhance>
			<InputField label="Email" name="email" />
			<InputField label="Password" name="password" class="mt-4" />
			<div class="flex justify-end mt-8">
				<Button type="submit" class="w-full">Login</Button>
			</div>
		</form>
		<div class="flex justify-end mt-12">
			<a href="/api/login/google" class="w-96 text-center py-2 rounded-md text-white bg-gray-700">
				SIGN IN WITH GOOGLE
			</a>
		</div>
	</div>
</div>
