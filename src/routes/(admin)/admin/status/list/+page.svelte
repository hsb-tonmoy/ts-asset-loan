<script lang="ts">
	import type { PageData } from './$types';
	import DataTable from './data-table.svelte';

	export let data: PageData;

	console.log(data.statuses);
</script>

<DataTable data={data.statuses} />
