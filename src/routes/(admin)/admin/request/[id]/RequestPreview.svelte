<script lang="ts">
	import type { PageData } from './$types';
	import Label from '$lib/components/ui/label/label.svelte';

	export let data: PageData;

	const { request } = data;
</script>

<div class="flex flex-col gap-6">
	<div class="flex">
		<img src="/img/avatars/male.svg" alt={request?.firstName} class="w-20 rounded-full" />
		<div class="flex flex-col">
			<Label>{request?.firstName + request?.lastName}</Label>
		</div>
	</div>
</div>
