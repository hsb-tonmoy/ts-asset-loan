<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { Check, ChevronsUpDown } from 'lucide-svelte';

	let open = false;
	export let data: { label: string; value: string }[] = [];
	export let value: string;
	export let setValue: (value: string) => void;

	export let multiple: boolean = false;

	export let inputPlaceholder: string = 'Select an option';
	export let searchPlaceholder: string = 'Search an option....';
	export let notFoundPlaceholder: string = 'No option found';

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function handleSelect(itemValue: string, ids: { trigger: string }): void {
		if (multiple) {
			let selectedValues = value ? value.split(',') : [];
			const index = selectedValues.indexOf(itemValue);
			if (index === -1) {
				// Add to selected if not already selected
				selectedValues.push(itemValue);
			} else {
				// Remove from selected if already selected
				selectedValues = selectedValues.filter((v) => v !== itemValue);
			}
			setValue(selectedValues.join(','));
		} else {
			// For single selection, set the value directly
			setValue(itemValue);
		}
		closeAndFocusTrigger(ids.trigger);
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Form.Control id={ids.trigger} let:attrs>
			<Button
				builders={[builder]}
				{...attrs}
				variant="outline"
				role="combobox"
				type="button"
				class={cn('min-w-[200px] max-w-full justify-between', !value && 'text-muted-foreground')}
			>
				{value
					? value
							.split(',')
							.map((v) => data.find((f) => f.value === v)?.label)
							.join(', ')
					: inputPlaceholder}
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Form.Control>
	</Popover.Trigger>
	<Popover.Content class="min-w-[200px] w-auto p-0">
		<Command.Root>
			<Command.Input autofocus placeholder={searchPlaceholder} />
			<Command.Empty>{notFoundPlaceholder}</Command.Empty>
			<Command.Group>
				{#each data as item}
					<Command.Item value={item.value} onSelect={() => handleSelect(item.value, ids)}>
						<Check
							class={cn(
								'mr-2 h-4 w-4',
								!(value && value.split(',').includes(item.value)) && 'text-transparent'
							)}
						/>
						{item.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
