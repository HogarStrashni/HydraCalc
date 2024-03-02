<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="flex h-full flex-col">
	<a href="/" class="m-4 ml-auto max-w-fit rounded-lg border-2 px-5 py-3 text-lg">Back</a>
	<div class="flex flex-1 flex-col items-center justify-center space-y-12">
		<form class="w-96 space-y-8" method="post" use:enhance>
			<div class="flex flex-col">
				<label for="email">Email</label>
				<input type="text" id="email" name="email" class="rounded border-2 px-2 py-1" required />
			</div>
			<div class="flex flex-col">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					class="rounded border-2 px-2 py-1"
					required
				/>
			</div>
			<br />
			<div class="flex justify-end">
				<button type="submit" class="w-full rounded-md border-2 bg-gray-50 py-1.5">Sign Up</button>
			</div>
		</form>
		<div class="flex justify-end">
			<a href="/api/login/google" class="w-96 rounded-md bg-gray-700 py-2 text-center text-white">
				SIGN IN WITH GOOGLE
			</a>
		</div>
	</div>
</div>
