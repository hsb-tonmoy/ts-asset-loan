<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import type { Asset, AssetCategory, Request } from '@prisma/client';
	import Assets from '$lib/components/AsyncSelects/Assets.svelte';
	import { convertToImageURL } from '$lib/utils';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svoast';

	type AssetWithCategory = Asset & { category: AssetCategory };
	type RequestWithAssets = Request & { assets: AssetWithCategory[] };

	let data: AssetWithCategory[] = [];

	export let request: RequestWithAssets;

	const hasAssets = request.assets.length > 0;

	$: if (hasAssets) {
		// Map request.assets to data
		for (const asset of request.assets) {
			data = [...data, asset.asset];
		}
	}

	const headers = ['Asset Tag', 'Name', 'Category'];

	let selected: any = null;
	let justValue: any = null;

	$: if (selected && !data.some((asset) => asset.id === selected.id)) {
		data = [...data, selected];
	}

	const handleSubmit = async () => {
		const assetIDs = data.map((asset) => asset.id);

		const res = await fetch(`/api/asset-checkout/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				assetIDs,
				request,
				approved_by_user: $page.data.user.userId
			})
		});

		if (res.ok) {
			invalidateAll();
			toast.success(`Assets successfully checked out!`, {
				closable: true
			});
		}
	};
</script>

<div class="flex flex-col gap-6 bg-white dark:bg-[#18181C] box-border p-4">
	<div class="flex items-center gap-6">
		<h6 class="text-lg">{hasAssets ? 'Assets Checked Out' : 'Checkout Assets'}</h6>
	</div>
	{#if !hasAssets}
		<Assets bind:value={selected} bind:justValue />
	{/if}
	{#if data.length > 0}
		<table class="w-full whitespace-no-wrap border border-input text-sm">
			<thead class="border-b bg-[#FAFAFC] dark:bg-[#26262A]">
				<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
					{#each headers as header}
						<th
							class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
						>
							{header}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="[&_tr:last-child]:border-0">
				{#each data as row}
					<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
						<td class="p-4 align-middle">
							{row.asset_tag}
						</td>
						<td class="inline-flex items-center gap-2 p-4 align-middle">
							{#if row.image}
								<img
									class="w-8 h-8 object-cover"
									src={row.image ? convertToImageURL(row.image) : undefined}
									alt={row.name}
								/>
							{/if}
							{row.name}
						</td>
						<td class="p-4 align-middle">
							{row.category.name}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if !hasAssets}
			<div class="self-end">
				<Button type="button" on:click={handleSubmit}
					>Checkout to {request.firstName + ' ' + request.lastName}</Button
				>
			</div>
		{/if}
	{/if}
</div>
