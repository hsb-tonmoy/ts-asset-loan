<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';

	import Autocomplete from '$lib/components/ui/autocomplete/Autocomplete.svelte';

	export let form: SuperValidated<FormSchema>;

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
				<Autocomplete
					{value}
					{setValue}
					data={categories}
					multiple={true}
					inputPlaceholder="Select an equipment type"
					searchPlaceholder="Search for an equipment....."
				/>
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
