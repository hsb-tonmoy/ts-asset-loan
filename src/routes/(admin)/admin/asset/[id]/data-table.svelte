<script lang="ts">
	import { writable } from 'svelte/store';
	import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-svelte';
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getSortedRowModel,
		renderComponent
	} from '@tanstack/svelte-table';
	import type { TableOptions, ColumnDef } from '@tanstack/svelte-table';
	import type { Asset } from '@prisma/client';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import RowActions from './row-actions.svelte';
	import { convertToImageURL } from '$lib/utils';

	export let data: Asset[];

	const defaultColumns: ColumnDef<Asset>[] = [
		{
			accessorKey: 'id',
			header: 'ID',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'category.name',
			header: 'Category',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'asset_tag',
			header: 'Asset Tag',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'name',
			header: 'Name',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'image',
			header: 'Image',
			cell: (info) => info.getValue()
		},
		{
			id: 'actions',
			cell: (info) => renderComponent(RowActions, { row: info.row.original })
		}
	];

	let sorting = [];

	const setSorting = (updater) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				sorting
			}
		}));
	};

	const options = writable<TableOptions<Asset>>({
		data,
		columns: defaultColumns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		initialState: {
			columnVisibility: {
				id: true,
				name: true,
				image: false
			}
		}
	});

	const rerender = () => {
		options.update((options) => ({
			...options,
			data
		}));
	};

	const table = createSvelteTable(options);
</script>

<div class="flex flex-col bg-white dark:bg-[#18181C] box-border p-4">
	<div class="flex items-center gap-6">
		<div class="inline-flex items-center gap-4">
			<Label for="name" class="text-sm">Name:</Label>
			<Input
				id="name"
				name="name"
				class="w-48 h-9 rounded bg-white dark:bg-[#303033] text-black dark:text-white"
			/>
		</div>
		<div class="inline-flex items-center gap-4">
			<Label for="color" class="text-sm">Color:</Label>
			<Input
				id="color"
				name="color"
				class="w-48 h-9 rounded bg-white dark:bg-[#303033] text-black dark:text-white"
			/>
		</div>
	</div>
	<div class="flex justify-between items-center my-4">
		<Button
			class="bg-blue-500 hover:bg-blue-400 text-white px-4 py-1 rounded"
			href="/admin/asset/add"
		>
			<Plus class="h-4 w-4 mr-1" />
			New
		</Button>
		<div class="inline-flex items-center pr-2">
			<Trash2 class="w-5 h-5" />
		</div>
	</div>

	<table class="w-full whitespace-no-wrap border border-input text-sm">
		<thead class="border-b bg-[#FAFAFC] dark:bg-[#26262A]">
			{#each $table.getHeaderGroups() as headerGroup}
				<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
					{#each headerGroup.headers as header}
						<th
							colSpan={header.colSpan}
							class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
							>{#if !header.isPlaceholder}
								<button
									class="inline-flex items-center gap-2"
									class:cursor-pointer={header.column.getCanSort()}
									class:select-none={header.column.getCanSort()}
									on:click={header.column.getToggleSortingHandler()}
								>
									<svelte:component
										this={flexRender(header.column.columnDef.header, header.getContext())}
									/>
									{#if header.column.getIsSorted() === 'asc'}
										<MoveUp class="w-4 h-4" />
									{:else if header.column.getIsSorted() === 'desc'}
										<MoveDown class="w-4 h-4" />
									{/if}
								</button>
							{/if}</th
						>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody class="[&_tr:last-child]:border-0">
			{#each $table.getRowModel().rows as row}
				<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
					{#each row.getVisibleCells() as cell, i}
						<td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
							{#if cell.getContext().column.id === 'name'}
								<div class="inline-flex items-center gap-2">
									{#if cell.getContext().row.original.image}
										<img
											class="w-10 h-10 object-cover"
											src={convertToImageURL(cell.getContext().row.original.image)}
											alt={cell.getValue()}
										/>
									{/if}
									{cell.getValue()}
								</div>
							{:else}
								<svelte:component
									this={flexRender(cell.column.columnDef.cell, cell.getContext())}
								/>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
