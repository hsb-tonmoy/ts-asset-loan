<script lang="ts">
	import { writable } from 'svelte/store';
	import { MoveUp, MoveDown } from 'lucide-svelte';
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getSortedRowModel,
		renderComponent
	} from '@tanstack/svelte-table';
	import type { TableOptions, ColumnDef, RowSelectionState } from '@tanstack/svelte-table';
	import type { Asset } from '@prisma/client';

	import RowCheckbox from '../row-checkbox.svelte';
	import ColumnVisibility from '../column-visibility.svelte';

	export let data: Asset[];

	const defaultColumns: ColumnDef<Asset>[] = [
		{
			id: 'select',
			header: ({ table }) =>
				renderComponent(RowCheckbox, {
					checked: table.getIsAllRowsSelected(),
					indeterminate: table.getIsSomeRowsSelected(),
					onChange: table.getToggleAllRowsSelectedHandler()
				}),
			cell: (props) =>
				renderComponent(RowCheckbox, {
					checked: props.row.getIsSelected(),
					disabled: !props.row.getCanSelect(),
					indeterminate: props.row.getIsSomeSelected(),
					onChange: props.row.getToggleSelectedHandler()
				})
		},
		{
			accessorKey: 'id',
			header: 'ID',
			cell: (info) => info.getValue()
		},

		{
			accessorKey: 'asset_tag',
			header: 'Asset Tag',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'category.name',
			header: 'Category',
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
			accessorKey: 'status',
			header: 'Status'
		}
	];

	let selection: RowSelectionState = {};

	let sorting = [];

	const onSelect = (updater: any) => {
		if (updater instanceof Function) {
			selection = updater(selection);
		} else {
			selection = updater;
		}

		options.update(
			(old) =>
				({
					...old,
					state: {
						...old.state,
						rowSelection: selection
					}
				} as TableOptions<Child>)
		);
	};

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

	let columnVisibility = {
		image: false,
		id: false,
		status: false
	};

	const setColumnVisibility = (updater) => {
		if (updater instanceof Function) {
			columnVisibility = updater(columnVisibility);
		} else {
			columnVisibility = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				columnVisibility
			}
		}));
	};

	const options = writable<TableOptions<Asset>>({
		data,
		columns: defaultColumns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			rowSelection: selection,
			columnVisibility
		},
		enableRowSelection: true,
		onRowSelectionChange: onSelect,
		onColumnVisibilityChange: setColumnVisibility
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
	<div class="flex items-center gap-6 mb-4">
		<h6 class="text-lg">Checkout Assets</h6>
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
							<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
