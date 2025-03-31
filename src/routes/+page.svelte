<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { Typography } from '@/components/custom-ui/typography';
	import { type RedirectCause, showRedirectToast } from '@/utils/toasts';

	$: ({ user, session } = $page.data);

	onMount(() => {
		const redirectCause = $page.url.searchParams.get('cause') as RedirectCause;
		if (!redirectCause) return;

		goto('/');
		showRedirectToast(redirectCause);
	});

	let isModeOpen = true;

	const data = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
		27, 28, 29, 30, 33, 32, 33, 34, 35, 36, 37, 38, 39, 40, 44, 42, 43, 44, 45, 46, 47, 48, 49, 50,
		55, 52, 53, 54, 55, 56, 57, 58, 59, 60
	];

	const len = data.length;
</script>

<div class="flex min-h-full flex-col items-center justify-center space-y-8">
	<table>
		<thead>
			<tr>
				<th class="border"> ONE TEST </th>
				<th class="border"> TWO TEST </th>
				<th class="border"> THREE TEST </th>
				<th class="border"> FOUR TEST </th>
			</tr>
		</thead>

		<tbody>
			{#each data as a, ind}
				<tr>
					<td class="border">{a + 5}+10 </td>
					<td class="border">{a + 7}+20 </td>
					{#if isModeOpen}
						{#if ind === 0}
							<td class="border align-top" colspan="2" rowspan={len}>
								<div class="sticky top-1/2">No data</div>
							</td>
						{/if}
					{:else}
						<td class="border">{a + 9}+30 </td>
						<td class="border">{a + 11}+40 </td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
