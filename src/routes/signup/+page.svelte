<script lang="ts">
	import SigninForm from '@/components/custom-ui/signin-form.svelte';
	import Typography from '@/components/custom-ui/typography.svelte';
	import { Button } from '@/components/ui/button';
</script>

<div class="mx-auto flex h-full w-full max-w-96 flex-col justify-center">
	<Typography as="h1" class="text-xl">Get started</Typography>
	<Typography as="p" class="mt-2 text-sm font-medium opacity-50">Create a new account</Typography>

	<SigninForm />

	<div class="mt-8 flex justify-center">
		<Typography as="p" class="h-full text-sm font-medium opacity-70">Have an account?</Typography>
		<Button href="/signin" variant="link" size="sm" class="h-fit px-1">Sign In Now</Button>
	</div>
</div>
