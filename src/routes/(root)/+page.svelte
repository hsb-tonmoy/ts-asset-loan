<script lang="ts">
	import Form from '$lib/components/Home/RequestForm/Form.svelte';
	import Description from './../../lib/components/Home/Description.svelte';
	import Menu from '$lib/components/Home/Menu.svelte';
	import type { PageData } from './$types';
	import type { SuperValidated } from 'formsnap';
	import type { FormSchema } from '$lib/components/Home/RequestForm/schema';

	export let data: PageData;
	export let form: SuperValidated<FormSchema>;

	$: console.log(form);
</script>

<main class="flex justify-center items-center w-full h-screen bg-[#C1C5D7] dark:bg-[#09090B]">
	<div
		style="box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.3)"
		class="md:max-w-3xl lg:max-w-4xl xl:max-w-screen-2xl w-full p-0 flex h-full max-h-[50rem] rounded-3 border-0 bg-white dark:bg-[#18181B]"
	>
		<div id="menu" class="flex flex-col items-center w-[10%] py-12">
			<Menu />
		</div>
		<div
			id="description"
			style="box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.3)"
			class="flex flex-col justify-center items-center w-[40%] bg-[#0099D8] dark:bg-[#0077b6] -my-6"
		>
			<Description />
		</div>
		<div id="requestForm" class="flex flex-col justify-center items-center w-[50%]">
			<Form form={data.form} />
		</div>
	</div>
</main>
