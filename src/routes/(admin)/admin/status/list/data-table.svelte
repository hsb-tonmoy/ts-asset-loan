<script lang="ts">
	import { readable } from 'svelte/store';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { addHiddenColumns } from 'svelte-headless-table/plugins';
	import { Plus, Trash2 } from 'lucide-svelte';
	import type { RequestStatus } from '@prisma/client';
	import * as Table from '$lib/components/ui/table';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import ColorRender from './ColorRender.svelte';

	export let data: RequestStatus[] = [];

	const table = createTable(readable(data), {
		hide: addHiddenColumns()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'statusColor',
			header: 'Color',
			plugins: {
				hide: true
			}
		}),
		table.column({
			accessor: 'name',
			header: 'Name',
			cell: ({ value, row }) => {
				return createRender(ColorRender, { color: row.cells[1].value, name: value });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
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
			href="/admin/status/add"
		>
			<Plus class="h-4 w-4 mr-1" />
			New
		</Button>
		<div class="inline-flex items-center pr-2">
			<Trash2 class="w-5 h-5" />
		</div>
	</div>
	<Table.Root {...$tableAttrs} class="border border-input">
		<Table.Header class="bg-[#FAFAFC] dark:bg-[#26262A]">
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
