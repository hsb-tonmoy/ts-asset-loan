<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Form from './Form.svelte';
	import DataTable from './data-table.svelte';

	export let data: PageData;

	$: action = $page.params.id;

	const menuItems = [
		{
			name: 'List all statuses',
			action: 'list',
			link: '/admin/status/list'
		},
		{
			name: 'Create a new status',
			action: 'add',
			link: '/admin/status/add'
		}
	];
</script>

<div class="flex gap-6">
	<div class="flex flex-col bg-white dark:bg-[#18181C] py-4 w-3/12">
		<h6 class="text-lg px-4">Status Settings</h6>
		{#each menuItems as item}
			<a
				href={item.link}
				class="{action === item.action
					? 'bg-[#F0FAFF] text-blue-500'
					: 'bg-white dark:bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white'} py-2 px-4"
			>
				<span class="text-sm">{item.name}</span>
			</a>
		{/each}
	</div>
	<div class="bg-white dark:bg-[#18181C] w-9/12 p-4">
		{#if action === 'add' || !isNaN(Number(action))}
			<Form {data} />
		{:else if action === 'list'}
			<DataTable data={data.statuses} />
		{/if}
	</div>
</div>
