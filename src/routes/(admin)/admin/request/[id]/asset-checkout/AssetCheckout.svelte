<script lang="ts">
	import type { Asset } from '@prisma/client';

	let data: Asset[];

	const headers = ['Asset Tag', 'Name', 'Category'];
</script>

<div class="flex flex-col bg-white dark:bg-[#18181C] box-border p-4">
	<div class="flex items-center gap-6 mb-4">
		<h6 class="text-lg">Checkout Assets</h6>
	</div>

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
					<td class="p-4 align-middle [&:has([role=checkbox])]:pr-0" />
				</tr>
			{/each}
		</tbody>
	</table>
</div>
