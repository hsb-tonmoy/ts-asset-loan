<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Asset, AssetCategory, Request } from '@prisma/client';
	import Assets from '$lib/components/AsyncSelects/Assets.svelte';
	import { convertToImageURL } from '$lib/utils';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svoast';
	import { X } from 'lucide-svelte';

	type AssetWithCategory = Asset & { category: AssetCategory };
	type RequestWithAssets = Request & { assets: AssetWithCategory[] };

	let data: AssetWithCategory[] = [];

	export let request: RequestWithAssets;

	$: hasAssets = request.assets.length > 0;

	$: if (hasAssets && request.assets.length > 0) {
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
		selected = null;
	}

	$: console.log(data);

	let submitting: boolean = false;

	const handleSubmit = async () => {
		submitting = true;
		const assetIDs = data.map((asset) => asset.id);

		const res = await fetch(`/api/asset-checkout/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				assetIDs,
				request
			})
		});

		if (res.ok) {
			submitting = false;

			toast.success(`Assets successfully checked out!`, {
				closable: true
			});
			invalidateAll();
			goto(`/admin/request/list`);
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
						<td class="p-4 align-middle">
							{#if !hasAssets}
								<Button
									type="button"
									variant="outline"
									size="icon"
									on:click={() => {
										data = data.filter((asset) => asset.id !== row.id);
									}}
								>
									<X class="w-4 h-4 text-red-600" />
								</Button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if !hasAssets}
			<div class="self-end">
				<Button type="button" on:click={handleSubmit} loading={submitting}>
					Checkout to {request.firstName + ' ' + request.lastName ?? 'User'}</Button
				>
			</div>
		{/if}
	{/if}
</div>
