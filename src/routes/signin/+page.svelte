<script lang="ts">
	import SigninForm from '@/components/custom-ui/signin-form.svelte';
	import Typography from '@/components/custom-ui/typography.svelte';
	import { Button } from '@/components/ui/button';
</script>

<div class="mx-auto flex h-full w-full max-w-96 flex-col justify-center">
	<Typography as="h1" class="text-xl">Welcome back</Typography>
	<Typography as="p" class="mt-2 text-sm font-medium opacity-50">
		Sign in to your account
	</Typography>

	<SigninForm />

	<div class="mt-8 flex justify-center">
		<Typography as="p" class="h-full text-sm font-medium opacity-70">
			Don't have an account?
		</Typography>
		<Button href="/signup" variant="link" size="sm" class="h-fit px-1">Sign Up Now</Button>
	</div>
</div>
