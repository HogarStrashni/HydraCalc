<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="flex flex-col h-screen">
	<a href="/" class="ml-auto max-w-fit m-4 border-2 px-5 py-3 text-lg rounded-lg">Back</a>
	<div class="flex-1 flex flex-col items-center justify-center space-y-12">
		<form class="w-96 space-y-8" method="post" use:enhance>
			<div class="flex flex-col">
				<label for="email">Email</label>
				<input type="text" id="email" name="email" class="border-2 rounded px-2 py-1" required />
			</div>
			<div class="flex flex-col">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					class="border-2 rounded px-2 py-1"
					required
				/>
			</div>
			<br />
			<div class="flex justify-end">
				<button type="submit" class="border-2 px-5 py-1.5 rounded-lg">Login</button>
			</div>
		</form>
		<div class="flex justify-end">
			<a href="/api/login/google" class="border-2 px-5 py-1.5 rounded-lg">SIGN IN WITH GOOGLE</a>
		</div>
	</div>
</div>
