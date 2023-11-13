<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { Check, ChevronsUpDown } from 'lucide-svelte';

	export let form: SuperValidated<FormSchema>;

	let categoryOpen = false;

	function closeAndFocusTrigger(triggerId: string) {
		categoryOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	const categories = [
		{ label: 'Laptop', value: 'laptop' },
		{ label: 'Monitor', value: 'monitor' },
		{ label: 'Keyboard', value: 'keyboard' },
		{ label: 'Mouse', value: 'mouse' },
		{ label: 'Headset', value: 'headset' },
		{ label: 'Webcam', value: 'webcam' },
		{ label: 'Docking Station', value: 'docking-station' },
		{ label: 'Other', value: 'other' }
	];
</script>

<Form.Root method="POST" {form} schema={formSchema} let:config class="grid grid-cols-6 gap-6">
	<div class="col-span-6">
		<Form.Field {config} name="category" let:setValue let:value>
			<Form.Item class="flex flex-col">
				<Form.Label>Type of Equipment</Form.Label>
				<Popover.Root bind:open={categoryOpen} let:ids>
					<Popover.Trigger asChild let:builder>
						<Form.Control id={ids.trigger} let:attrs>
							<Button
								builders={[builder]}
								{...attrs}
								variant="outline"
								role="combobox"
								type="button"
								class={cn(
									'min-w-[200px] max-w-full justify-between',
									!value && 'text-muted-foreground'
								)}
							>
								{value
									? value
											.split(',')
											.map((v) => categories.find((f) => f.value === v)?.label)
											.join(', ')
									: 'Select equipment type'}
								<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</Form.Control>
					</Popover.Trigger>
					<Popover.Content class="min-w-[200px] w-auto p-0">
						<Command.Root>
							<Command.Input autofocus placeholder="Search equipment types..." />
							<Command.Empty>No equipment found.</Command.Empty>
							<Command.Group>
								{#each categories as equipment}
									<Command.Item
										value={equipment.value}
										onSelect={() => {
											let selectedValues = value ? value.split(',') : [];
											const index = selectedValues.indexOf(equipment.value);
											if (index === -1) {
												// Add to selected if not already selected
												selectedValues.push(equipment.value);
											} else {
												// Remove from selected if already selected
												selectedValues = selectedValues.filter((v) => v !== equipment.value);
											}
											setValue(selectedValues.join(','));
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										<Check
											class={cn(
												'mr-2 h-4 w-4',
												!(value && value.split(',').includes(equipment.value)) && 'text-transparent'
											)}
										/>
										{equipment.label}
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
				<Form.Description>Choose the type of equipment you would like to request.</Form.Description>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="col-span-3">
		<Form.Field {config} name="firstName">
			<Form.Item>
				<Form.Label>First Name</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="col-span-3">
		<Form.Field {config} name="lastName">
			<Form.Item>
				<Form.Label>Last Name</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="col-span-3">
		<Form.Field {config} name="email">
			<Form.Item>
				<Form.Label>Email</Form.Label>
				<Form.Input type="email" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="col-span-3">
		<Form.Field {config} name="phone">
			<Form.Item>
				<Form.Label>Phone</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="col-span-3">
		<Form.Field {config} name="requestDate">
			<Form.Item>
				<Form.Label>Request Date</Form.Label>
				<Form.Input type="date" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="col-span-3">
		<Form.Field {config} name="requestTime">
			<Form.Item>
				<Form.Label>Request Time</Form.Label>
				<Form.Input type="time" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="col-span-3">
		<Form.Field {config} name="returnDate">
			<Form.Item>
				<Form.Label>Return Date</Form.Label>
				<Form.Input type="date" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="col-span-3">
		<Form.Field {config} name="returnTime">
			<Form.Item>
				<Form.Label>Return Time</Form.Label>
				<Form.Input type="time" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="col-span-6">
		<Form.Field {config} name="notes">
			<Form.Item>
				<Form.Label>Notes</Form.Label>
				<Form.Textarea placeholder="Add any notes....." rows={6} />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>

	<Form.Button>Submit</Form.Button>
</Form.Root>
