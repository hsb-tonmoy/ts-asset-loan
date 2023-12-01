<script lang="ts">
	import type { PageData } from './$types';
	import { Mail, Phone, User } from 'lucide-svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let data: PageData;

	const { request } = data;
</script>

<div class="flex flex-col gap-6">
	<h6 class="text-base">Requester Details</h6>
	<div class="flex items-center gap-2">
		<div class="grid grid-cols-3 gap-6">
			<span class="inline-flex flex-col gap-2"
				><Label class="font-semibold">Name</Label>
				<Label>{request?.firstName + ' ' + request?.lastName}</Label></span
			>
			<span class="inline-flex flex-col gap-2"
				><Label class="font-semibold">Email</Label><Label>{request?.email}</Label></span
			>
			<span class="inline-flex flex-col gap-2"
				><Label class="font-semibold">Phone</Label><Label>{request?.phone}</Label></span
			>
		</div>
	</div>
</div>
