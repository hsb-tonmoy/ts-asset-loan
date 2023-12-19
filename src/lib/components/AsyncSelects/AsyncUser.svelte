<script lang="ts">
	import Select from 'svelte-select';

	let items: any;

	async function loadOptions(searchText: string) {
		// if (!searchText.length) return Promise.resolve([]);
		try {
			const response = await fetch(`/api/user?search=${searchText}`);
			items = await response.json();
			return Promise.resolve(items);
		} catch (error) {
			return Promise.resolve([]);
		}
	}

	export let itemId: string = 'email';
	export let name: string = 'user';
	export let id: string = 'user';
	export let justValue: any;
	export let value: any;
</script>

<div id="auto-select">
	<Select
		{id}
		{name}
		{itemId}
		{items}
		{loadOptions}
		bind:justValue
		bind:value
		placeholder="Search for a user"
		containerStyles="border border-input bg-transparent"
		class="rounded-md border border-input bg-transparent px-3 py-2 text-sm dark:text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none hover:ring-1 hover:ring-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	>
		<div class="" slot="item" let:item let:index>
			<span class="text-sm">{item.firstName + ' ' + item.lastName} ({item.email})</span>
		</div>

		<div slot="selection" let:selection>
			<span class="text-sm">{selection.email}</span>
		</div>
	</Select>
</div>

<style lang="postcss">
	#auto-select {
		--border: 0 !important;
		--font-size: 0.875rem;
	}
</style>
