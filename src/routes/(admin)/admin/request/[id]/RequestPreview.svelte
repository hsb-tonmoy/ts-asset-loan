<script lang="ts">
	import type { PageData } from './$types';
	import { Mail, Phone, User, Pencil } from 'lucide-svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let data: PageData;

	export let edit: boolean;

	const { request } = data;

	const requesterDetails = [
		{
			label: 'Name',
			value: `${request?.firstName} ${request?.lastName}`,
			icon: User
		},
		{
			label: 'Email',
			value: request?.email,
			icon: Mail
		},
		{
			label: 'Phone',
			value: request?.phone,
			icon: Phone
		}
	];

	const requestedCategories = JSON.parse(request?.requestedCategories ?? '');

	let requestedEquipments = '';

	for (const [key, value] of Object.entries(requestedCategories)) {
		requestedEquipments += `${value} ${key} <br /> <br />`;
	}

	function formatDate(date: Date | undefined): string {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZoneName: 'short'
		};

		return new Intl.DateTimeFormat('en-US', options).format(date);
	}
</script>

<div class="relative flex flex-col gap-10 py-4">
	<button class="absolute w-8 h-8 top-2 right-2" on:click={() => (edit = !edit)}
		><Pencil class="w-4 h-4" /></button
	>
	<div class="flex flex-col gap-2">
		<h6 class="text-base">Requester Details</h6>
		<div class="grid grid-cols-3 gap-6">
			{#each requesterDetails as detail}
				<div class="inline-flex flex-col gap-2">
					<Label class="font-semibold">{detail.label}</Label>
					<Label class="inline-flex items-center gap-1">{detail.value}</Label>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<h6 class="text-base">Request Details</h6>
		<div class="grid grid-cols-3 gap-6">
			<div class="inline-flex flex-col gap-2">
				<Label class="font-semibold">Request Status</Label>
				<Label class="inline-flex items-center gap-1" style="color: {request?.status.statusColor};">
					{request?.status.name}</Label
				>
			</div>
			<div class="inline-flex flex-col gap-2 col-span-2">
				<Label class="font-semibold">Requested Equipments</Label>
				<Label class="inline-flex items-center gap-1">{@html requestedEquipments}</Label>
			</div>
			<div class="inline-flex flex-col gap-2">
				<Label class="font-semibold">Request Date & Time</Label>
				<Label class="inline-flex items-center gap-1">{formatDate(request?.requestDateTime)}</Label>
			</div>
			<div class="inline-flex flex-col gap-2">
				<Label class="font-semibold">Return Date & Time</Label>
				<Label class="inline-flex items-center gap-1">{formatDate(request?.returnDateTime)}</Label>
			</div>
			<div class="inline-flex flex-col gap-2">
				<Label class="font-semibold">Return Date & Time</Label>
				<Label class="inline-flex items-center gap-1">{formatDate(request?.returnDateTime)}</Label>
			</div>
			<div class="inline-flex flex-col gap-2 col-span-3">
				<Label class="font-semibold">Notes</Label>
				<Label class="inline-flex items-center gap-1">{request?.notes && request?.notes}</Label>
			</div>
		</div>
	</div>
</div>
