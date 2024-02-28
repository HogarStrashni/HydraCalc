<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;

	const { user, session } = data;
</script>

<div class="flex flex-col h-screen">
	<div class="flex justify-end items-center space-x-4 p-4">
		{#if user?.id}
			<h1 class="mr-auto">{user.email}</h1>
			<form method="post" use:enhance>
				<button type="submit" class="ml-auto max-w-fit m-4 border-2 px-5 py-3 text-lg rounded-lg">
					Sign Out
				</button>
			</form>
		{:else}
			<a href="/login" class="border-2 px-5 py-3 text-lg rounded-lg">Login</a>
			<a href="/signup" class="border-2 px-5 py-3 text-lg rounded-lg">SignUp</a>
		{/if}
	</div>

	<div class="flex flex-1 flex-col justify-center items-center space-y-8">
		<p>user: {JSON.stringify(user)}</p>
		<p>session: {JSON.stringify(session)}</p>
	</div>
</div>
