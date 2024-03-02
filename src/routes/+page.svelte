<script lang="ts">
	import { page } from '$app/stores';

	$: ({ user, session } = $page.data);
</script>

<div class="flex h-full flex-col items-center justify-center space-y-8">
	<p>user: {JSON.stringify(user)}</p>
	<p>session: {JSON.stringify(session)}</p>
</div>
