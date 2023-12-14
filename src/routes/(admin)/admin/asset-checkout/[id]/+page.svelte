<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Form from './Form.svelte';
	import DataTable from './data-table.svelte';

	export let data: PageData;

	$: action = $page.params.id;

	$: checkouts = data.checkouts;

	const baseMenuItems = [
		{
			name: 'List all assets',
			action: 'list',
			link: '/admin/asset-checkout/list'
		},
		{
			name: 'Create a new asset',
			action: 'add',
			link: '/admin/asset-checkout/add'
		}
	];

	$: menuItems =
		action !== 'list' && action !== 'add' && !isNaN(+action)
			? [
					...baseMenuItems,
					{
						name: `Edit Checkout'`,
						action: action,
						link: `/admin/asset-checkout/${action}`
					}
			  ]
			: [...baseMenuItems];
</script>

<div class="flex gap-6">
	<div class="flex flex-col bg-white dark:bg-[#18181C] py-4 w-3/12">
		<h6 class="text-lg px-4 mb-4">Asset Checkout</h6>
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
		{:else if action === 'list' && checkouts}
			{#key checkouts}
				<DataTable data={checkouts} />
			{/key}
		{/if}
	</div>
</div>
