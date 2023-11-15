<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import { getForm } from 'formsnap';
	import * as Form from '$lib/components/ui/form';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<FormSchema>;

	let hex: string = '';

	$: console.log(form.data.name);
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

	<Form.Field {config} name="statusColor" let:setValue>
		<Form.Item>
			<Form.Label>Status Color</Form.Label>
			<ColorPicker bind:hex />
			<!-- <Form.Input class="w-auto min-w-[300px] border-gray-300 h-10" /> -->
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

	<Form.Button>Submit</Form.Button>
</Form.Root>
