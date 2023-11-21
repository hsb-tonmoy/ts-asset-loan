<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import Label from '$lib/components/ui/label/label.svelte';

	export let table;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]}>Columns</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>Show/Hide Columns</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<Input
				type="checkbox"
				checked={$table.getIsAllColumnsVisible()}
				on:change={(e) => {
					console.info($table.getToggleAllColumnsVisibilityHandler()(e));
				}}
				class="w-4 h-4"
			/>
			<Label>Toggle All</Label>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		{#each $table.getAllLeafColumns() as column}
			<DropdownMenu.Item>
				<div class="inline-flex items-center gap-1">
					<Input
						type="checkbox"
						checked={column.getIsVisible()}
						on:change={column.getToggleVisibilityHandler()}
						class="w-4 h-4"
					/>
					<Label>{column.id}</Label>
				</div>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
