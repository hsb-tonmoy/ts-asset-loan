<script lang="ts">
	import { onMount } from 'svelte';
	import Select from 'svelte-select';

	let items: any;

	async function loadOptions(searchText: string) {
		// if (!searchText.length) return Promise.resolve([]);
		try {
			const response = await fetch(`/api/request-status?search=${searchText}`);
			items = await response.json();
			return Promise.resolve(items);
		} catch (error) {
			return Promise.resolve([]);
		}
	}

	onMount(async () => {
		await loadOptions('');
	});

	let itemId: string = 'id';
	export let justValue: any;
	export let value: any;
</script>

<div id="auto-select">
	<Select
		{itemId}
		{items}
		{loadOptions}
		bind:justValue
		bind:value
		placeholder="Search for status"
		containerStyles="border border-input bg-transparent"
		class="rounded-md border border-input bg-transparent px-3 py-2 text-sm dark:text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none hover:ring-1 hover:ring-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	>
		<div class="inline-flex items-center gap-1" slot="item" let:item let:index>
			<span class="w-4 h-4" style="background-color: {item.statusColor};" />
			{item.name}
		</div>

		<div class="inline-flex items-center gap-1" slot="selection" let:selection>
			<span class="w-4 h-4" style="background-color: {selection.statusColor};" />
			{selection.name}
		</div>
	</Select>
</div>

<style lang="postcss">
	:global(#auto-select) {
		--border: 0;
		--font-size: 0.875rem;
	}
</style>
