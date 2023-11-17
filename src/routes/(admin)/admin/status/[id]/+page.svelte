<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Form from './Form.svelte';
	import DataTable from './data-table.svelte';

	export let data: PageData;

	$: action = $page.params.id;
</script>

<div class="flex gap-6">
	<div class="flex flex-col gap-4 bg-white dark:bg-[#18181C] py-4 w-3/12">
		<div class="bg-[#F0FAFF] text-blue-500 py-2 px-4">
			<h6 class="text-base">Status Settings</h6>
			<span class="text-sm">Add a new status</span>
		</div>
		<div class="hover:bg-gray-600 text-white py-2 px-4">
			<h6 class="text-base">Status Settings</h6>
			<span class="text-sm">Add a new status</span>
		</div>
	</div>
	<div class="bg-white dark:bg-[#18181C] w-9/12 p-4">
		{#if action === 'add' || !isNaN(Number(action))}
			<Form {data} />
		{:else if action === 'list'}
			<DataTable data={data.statuses} />
		{/if}
	</div>
</div>
