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
	import type { TableOptions, ColumnDef } from '@tanstack/svelte-table';
	import type { User } from '@prisma/client';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import RowActions from './row-actions.svelte';

	export let data: User[];

	const defaultColumns: ColumnDef<User>[] = [
		{
			accessorKey: 'id',
			header: 'ID',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'email',
			header: 'Email',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'firstName',
			header: 'First Name',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'lastName',
			header: 'Last Name',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'role',
			header: 'Role',
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

	const options = writable<TableOptions<User>>({
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
	<div class="flex items-center gap-6 mb-4">
		<div class="inline-flex items-center gap-4">
			<Label for="name" class="text-sm">Email:</Label>
			<Input
				id="email"
				name="email"
				class="w-48 h-9 rounded bg-white dark:bg-[#303033] text-black dark:text-white"
			/>
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
							<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
