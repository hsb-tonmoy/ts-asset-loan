<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	export let name: string;
	export let number_of_requests: number = 10;
	export let number_of_pending_requests: number = 5;
	export let number_of_approved_requests: number = 5;

	const items = [
		{ title: 'Total Requests', value: number_of_requests },
		{ title: 'Pending Requests', value: number_of_pending_requests },
		{ title: 'Approved Requests', value: number_of_approved_requests }
	];
</script>

<div class="bg-white px-4 py-4 w-full">
	<h6 class="text-lg text-gray-800 mb-4">Workbench</h6>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<img src="/img/avatars/male.svg" alt={name} class="w-20 rounded-full" />
			<div class="flex flex-col">
				<span class="text-gray-800 text-lg">Welcome back, {name}, how are you doing today?</span>
				<span class="text-gray-600 text-sm">
					{#if number_of_pending_requests > 3}
						Looks like you got quite a lot on your plate!
					{:else}
						Looks like it's going to be an easy day!
					{/if}
				</span>
			</div>
		</div>
		<div class="flex items-center justify-between gap-10">
			{#each items as item}
				<div class="inline-flex flex-col gap-2">
					<span class="text-gray-800 text-sm">{item.title}</span>
					<span class="text-gray-900 text-lg self-end">{item.value}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
