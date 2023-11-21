<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import Form from './Form.svelte';
	import DataTable from './data-table.svelte';

	export let data: PageData;

	$: action = $page.params.id;

	$: requests = data.requests;
</script>

<div class="flex gap-6">
	<div class="bg-white dark:bg-[#18181C] w-9/12 p-4">
		{#if action === 'add'}
			<Form {data} />
		{:else if !isNaN(+action)}
			<Form {data} edit={true} />
		{:else if action === 'list' && requests}
			{#key requests}
				<DataTable data={requests} />
			{/key}
		{/if}
	</div>
</div>
