<script lang="ts">
	import type { SuperValidated } from 'formsnap';
	import type { FormSchema } from './schema';
	import Form from './Form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form: SuperValidated<FormSchema>;

	$: console.log(form);
</script>

<div class="flex gap-6 p-4">
	<div class="bg-white p-4 w-3/12">
		<div class="bg-[#F0FAFF] text-blue-500 p-2">
			<h6 class="text-base">Status Settings</h6>
			<span class="text-sm">Add a new status</span>
		</div>
	</div>
	<div class="bg-white w-9/12 p-4">
		<Form form={data.form} />
	</div>
</div>
