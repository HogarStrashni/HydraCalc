<script lang="ts">
	import { enhance } from '$app/forms';

	import { Button } from '@/components/ui/button';
	import { showFormActionToast } from '@/utils/toasts';

	let isSending = false;
</script>

<form
	action="?/new-code"
	method="POST"
	use:enhance={() => {
		isSending = true;
		return async ({ result, update }) => {
			showFormActionToast('validation-code', result);
			await update();
			isSending = false;
		};
	}}
>
	<Button
		type="submit"
		variant="link"
		class="text-forground absolute -top-2 right-0 px-0 opacity-50"
		disabled={isSending}
	>
		<span class="duration-75 {isSending ? 'opacity-25' : ''}">Request new Code</span>
	</Button>
</form>
