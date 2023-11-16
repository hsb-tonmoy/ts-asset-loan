<script lang="ts">
	import Form from './Form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex gap-6">
	<div class="bg-white dark:bg-[#18181C] py-4 w-3/12">
		<div class="bg-[#F0FAFF] text-blue-500 py-2 px-4">
			<h6 class="text-base">Status Settings</h6>
			<span class="text-sm">Add a new status</span>
		</div>
	</div>
	<div class="bg-white dark:bg-[#18181C] w-9/12 p-4">
		<Form {data} />
	</div>
</div>
