<script lang="ts">
	import { convertToImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import Select from 'svelte-select';

	let items: any;

	export let includeAssets: boolean = false;

	let itemId: string = 'id';
	export let justValue: any;
	export let value: any;
	export let multiple: boolean = false;

	export let placeholder: string = 'Search for category';

	async function loadOptions(searchText: string) {
		const params = new URLSearchParams();
		params.append('search', searchText);
		if (includeAssets) {
			params.append('includeAssets', 'true');
		}

		try {
			const response = await fetch(`/api/category?${params.toString()}`);
			items = await response.json();
			return Promise.resolve(items);
		} catch (error) {
			return Promise.resolve([]);
		}
	}

	onMount(async () => {
		await loadOptions('');
	});
</script>

<div id="auto-select">
	<Select
		{itemId}
		{items}
		{loadOptions}
		{multiple}
		bind:justValue
		bind:value
		on:clear
		{placeholder}
		containerStyles="auto-select border border-input bg-transparent"
		class="rounded-md border border-input bg-transparent px-3 py-2 text-sm dark:text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none hover:ring-1 hover:ring-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	>
		<div class="inline-flex items-center gap-1" slot="item" let:item let:index>
			{#if item.image}
				<img class="w-8 h-8 object-cover" src={convertToImageURL(item.image)} alt={item.name} />
			{/if}
			{item.name}
		</div>

		<div class="inline-flex items-center gap-1" slot="selection" let:selection>
			{#if selection.image && !multiple}
				<img
					class="w-8 h-8 object-cover"
					src={convertToImageURL(selection.image)}
					alt={selection.name}
				/>
			{/if}
			{selection.name}
		</div>

		<div slot="clear-icon" />
	</Select>
</div>

<style lang="postcss">
	#auto-select {
		--border: 0;
		--font-size: 0.875rem;
	}
</style>
