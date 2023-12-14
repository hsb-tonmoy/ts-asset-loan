<script lang="ts">
	import AssetCheckout from '../asset-checkout/AssetCheckout.svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Form from './Form.svelte';
	import DataTable from './data-table.svelte';
	import RequestPreview from './RequestPreview.svelte';

	export let data: PageData;

	$: action = $page.params.id;

	$: requests = data.requests;

	let edit: boolean = false;
</script>

<div class="flex gap-6">
	{#if action === 'add'}
		<Form {data} />
	{:else if !isNaN(+action)}
		<div class="text-gray-800 bg-white dark:bg-[#18181C] w-2/4 p-4">
			{#if edit}
				<Form {data} bind:edit />
			{:else}
				<RequestPreview bind:edit {data} />
			{/if}
		</div>
		<div class="bg-white dark:bg-[#18181C] w-2/4 p-4">
			<AssetCheckout request={data.request} />
		</div>
	{:else if action === 'list' && requests}
		{#key requests}
			<DataTable data={requests} />
		{/key}
	{/if}
</div>
