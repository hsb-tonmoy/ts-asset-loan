<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Form from './Form.svelte';
	import DataTable from './data-table.svelte';

	export let data: PageData;

	$: action = $page.params.id;

	$: checkouts = data.checkouts;
</script>

<div class="flex gap-6">
	<div class="bg-white dark:bg-[#18181C] w-full p-4">
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
