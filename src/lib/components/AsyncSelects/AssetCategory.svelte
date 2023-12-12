<script lang="ts">
	import { convertToImageURL } from '$lib/utils';
	import { onMount } from 'svelte';
	import Select from 'svelte-select';

	let items: any;

	async function loadOptions(searchText: string) {
		// if (!searchText.length) return Promise.resolve([]);
		try {
			const response = await fetch(`/api/category?search=${searchText}`);
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
	export let multiple: boolean = false;
</script>

<div id="auto-select">
	<Select
		{itemId}
		{items}
		{loadOptions}
		bind:multiple
		bind:justValue
		bind:value
		placeholder="Search for category"
		containerStyles="auto-select border border-input bg-transparent"
		class="rounded-md border border-input bg-transparent px-3 py-2 text-sm dark:text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none hover:ring-1 hover:ring-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	>
		<div class="inline-flex items-center gap-1" slot="item" let:item let:index>
			{#if item.image}
				<img class="w-10 h-10 object-cover" src={convertToImageURL(item.image)} alt={item.name} />
			{/if}
			{item.name}
		</div>

		<div class="inline-flex items-center gap-1" slot="selection" let:selection>
			{#if selection.image}
				<img
					class="w-10 h-10 object-cover"
					src={convertToImageURL(selection.image)}
					alt={selection.name}
				/>
			{/if}
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
