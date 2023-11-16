<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import AutoComplete from '$lib/components/ui/autocomplete/AutoComplete.svelte';

	import colors from '$lib/components/colors.json';

	let selectedColorObject;

	export let form: SuperValidated<FormSchema>;
</script>

<Form.Root
	method="POST"
	{form}
	schema={formSchema}
	let:config
	class="flex flex-col gap-4 text-gray-800"
>
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input class="w-auto min-w-[300px] border-gray-300 h-10" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="statusColor" let:setValue let:value>
		<Form.Item>
			<Form.Label class="block">Status Color</Form.Label>
			<AutoComplete
				items={colors}
				bind:selectedItem={selectedColorObject}
				labelFieldName="label"
				showClear={true}
				onChange={() => {
					setValue(selectedColorObject);
				}}
			/>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="description">
		<Form.Item>
			<Form.Label>Description</Form.Label>
			<Form.Textarea
				placeholder="Add a short description..."
				rows={1}
				class="w-auto min-w-[300px] border-gray-300"
			/>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Button class="self-start">Submit</Form.Button>
</Form.Root>
