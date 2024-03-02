<script lang="ts">
	export let data;

	const { user, session } = data;
</script>

<div class="flex h-full flex-col">
	<div class="flex items-center justify-end space-x-4 p-4">
		{#if user?.id}
			<h1 class="mr-auto">{user.email}</h1>
			<form method="post">
				<button type="submit" class="ml-auto max-w-fit rounded-lg border-2 px-5 py-3 text-lg">
					Sign Out
				</button>
			</form>
		{:else}
			<a href="/login" class="rounded-lg border-2 px-5 py-3 text-lg">Login</a>
			<a href="/signup" class="rounded-lg border-2 px-5 py-3 text-lg">SignUp</a>
		{/if}
	</div>

	<div class="flex flex-1 flex-col items-center justify-center space-y-8">
		<p>user: {JSON.stringify(user)}</p>
		<p>session: {JSON.stringify(session)}</p>
	</div>
</div>
