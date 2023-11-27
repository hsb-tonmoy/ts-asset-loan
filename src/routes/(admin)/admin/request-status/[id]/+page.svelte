<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Form from './Form.svelte';
	import DataTable from './data-table.svelte';

	export let data: PageData;

	$: action = $page.params.id;

	$: statuses = data.statuses;

	const baseMenuItems = [
		{
			name: 'List all request statuses',
			action: 'list',
			link: '/admin/request-status/list'
		},
		{
			name: 'Create a new request status',
			action: 'add',
			link: '/admin/request-status/add'
		}
	];

	$: menuItems =
		action !== 'list' && action !== 'add' && !isNaN(+action)
			? [
					...baseMenuItems,
					{
						name: `Edit '${data.status?.name}'`,
						action: action,
						link: `/admin/request-status/${action}`
					}
			  ]
			: [...baseMenuItems];
</script>

<div class="flex gap-6">
	<div class="flex flex-col bg-white dark:bg-[#18181C] py-4 w-3/12">
		<h6 class="text-lg px-4 mb-4">Request Status Settings</h6>
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
		{#if action === 'add'}
			<Form {data} />
		{:else if !isNaN(+action)}
			<Form {data} edit={true} />
		{:else if action === 'list' && statuses}
			{#key statuses}
				<DataTable data={statuses} />
			{/key}
		{/if}
	</div>
</div>
