<script lang="ts">
	import type { Request } from '@prisma/client';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';

	import * as Table from '$lib/components/ui/table';

	export const data: Request[] = [];

	const table = createTable(readable(data));

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'firstName',
			header: 'First Name'
		}),
		table.column({
			accessor: 'lastName',
			header: 'Last Name'
		}),
		table.column({
			accessor: 'equipment_id',
			header: 'Equipment Type'
		}),
		table.column({
			accessor: 'requestDateTime',
			header: 'Request Date'
		}),
		table.column({
			accessor: 'returnDateTime',
			header: 'Return Date'
		}),
		table.column({
			accessor: 'status_id',
			header: 'Status'
		}),

		table.column({
			accessor: ({ id }) => id,
			header: ''
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
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
