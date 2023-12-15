<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import Form from './Form.svelte';
</script>

<div class="flex gap-6 w-full">
	<div class="flex flex-col bg-white dark:bg-[#18181C] py-4 px-10 w-full">
		<Form {data} />
	</div>
</div>
