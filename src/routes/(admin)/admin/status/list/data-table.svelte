<script lang="ts">
	import type { RequestStatus } from '@prisma/client';
	import { createTable } from 'svelte-headless-table';
	import { readable } from 'svelte/store';

	export let data: RequestStatus[] = [];

	const table = createTable(readable(data));
</script>
