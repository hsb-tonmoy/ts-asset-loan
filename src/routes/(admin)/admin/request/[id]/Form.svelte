<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms/client';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { formSchema } from './schema';
	import { toast } from 'svoast';
	import type { PageData } from './$types';
	import MaskedInput from '$lib/components/ui/input-mask/MaskedInput.svelte';
	import AutoComplete from '$lib/components/ui/autocomplete/AutoComplete.svelte';
	import { GanttChartSquare, Pencil } from 'lucide-svelte';

	export let data: PageData;

	const { statuses, categories } = data;

	export let edit: boolean = false;

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: formSchema,
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(`Request ${edit ? 'updated' : 'added'} successfully`, {
					closable: true
				});
				goto('/admin/request/list');
			}
		},
		onError: ({ result }) => {
			toast.error('Something went wrong!', {
				closable: true
			});
			console.log(result.error.message);
		}
	});

	let requestedAssets: string = '',
		status: any;

	if (edit) {
		status = $form.status;
		for (const [key, value] of Object.entries(JSON.parse(data.request?.requestedCategories))) {
			requestedAssets += `${value} ${key}, `;
		}
	}

	let requestDateTimeFromDb = new Date(data.request?.requestDateTime);
	let returnDateTimeFromDb = new Date(data.request?.returnDateTime);

	let requestDate: string, requestTime: string, returnDate: string, returnTime: string;

	const convertDateTime = (dateString: string, timeString: string) => {
		const date = new Date(dateString + 'T00:00:00');

		const [hours, minutes] = timeString.split(':').map(Number);

		date.setHours(hours, minutes, 0, 0);

		return date;
	};

	const extractDate = (dateObj) => {
		return dateObj.toISOString().split('T')[0];
	};

	const extractTime = (dateObj) => {
		return dateObj.toISOString().split('T')[1].slice(0, 5);
	};

	if (edit) {
		if (requestDateTimeFromDb instanceof Date) {
			requestDate = extractDate(requestDateTimeFromDb);
			requestTime = extractTime(requestDateTimeFromDb);
		}

		if (returnDateTimeFromDb instanceof Date) {
			returnDate = extractDate(returnDateTimeFromDb);
			returnTime = extractTime(returnDateTimeFromDb);
		}
	}

	$: {
		if (requestDate && requestTime) {
			$form.requestDateTime = convertDateTime(requestDate, requestTime).toISOString();
		}

		if (returnDate && returnTime) {
			$form.returnDateTime = convertDateTime(returnDate, returnTime).toISOString();
		}
	}

	$: form.update((old) => ({
		...old,
		status: status?.id
	}));

	$: console.log($form);
</script>

<section class="relative flex gap-6 w-full py-4">
	<button type="button" class="absolute w-8 h-8 top-2 right-2" on:click={() => (edit = !edit)}
		><GanttChartSquare class="w-4 h-4 dark:text-gray-300" /></button
	>
	<form
		method="POST"
		action={edit ? '?/update' : '?/create'}
		use:enhance
		class="flex flex-col gap-4 w-full"
	>
		<Label for="category">Requested Assets</Label>
		<Input type="text" disabled value={requestedAssets} class="w-auto min-w-[300px]" />

		<Label for="status">Request Status</Label>

		<AutoComplete
			items={statuses}
			bind:selectedItem={status}
			labelFieldName="name"
			valueFieldName="id"
			showClear={true}
			><div slot="item" let:item let:label>
				<div class="inline-flex items-center gap-2">
					<span class="w-4 h-4" style="background-color: {item.statusColor} " />{@html label}
				</div>
			</div>
		</AutoComplete>
		<Label for="firstName">First Name</Label>
		<Input
			type="text"
			name="firstName"
			id="firstName"
			bind:value={$form.firstName}
			class="w-auto min-w-[300px]"
		/>
		{#if $errors.firstName}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.firstName}</span
			>
		{/if}

		<Label for="lastName">Last Name</Label>
		<Input
			type="text"
			name="lastName"
			id="lastName"
			bind:value={$form.lastName}
			class="w-auto min-w-[300px]"
		/>
		{#if $errors.lastName}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.lastName}</span>
		{/if}

		<Label for="email">Email</Label>
		<Input
			type="email"
			name="email"
			id="email"
			bind:value={$form.email}
			class="w-auto min-w-[300px]"
		/>
		{#if $errors.email}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.email}</span>
		{/if}

		<Label for="phone">Phone</Label>
		<MaskedInput
			id="phone"
			name="phone"
			mask="(000) 000 - 0000"
			size={20}
			showMask
			maskChar="_"
			value={$form.phone}
			on:change={({ detail }) => ($form.phone = detail.inputState.unmaskedValue)}
		/>
		{#if $errors.phone}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.phone}</span>
		{/if}

		<Label for="requestDate">Request Date</Label>
		<Input type="date" name="requestDate" id="requestDate" bind:value={requestDate} />
		{#if $errors.requestDateTime}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.requestDateTime}</span
			>
		{/if}

		<Label for="requestTime">Request Time</Label>
		<Input type="time" name="requestTime" id="requestTime" bind:value={requestTime} />
		{#if $errors.requestDateTime}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.requestDateTime}</span
			>
		{/if}

		<Label for="returnDate">Return Date</Label>
		<Input type="date" name="returnDate" id="returnDate" bind:value={returnDate} />
		{#if $errors.returnDateTime}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.returnDateTime}</span
			>
		{/if}

		<Label for="returnTime">Return Time</Label>
		<Input
			type="time"
			name="returnTime"
			id="returnTime"
			bind:value={returnTime}
			class="w-auto min-w-[300px]"
		/>
		{#if $errors.requestDateTime}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.returnDateTime}</span
			>
		{/if}

		<Label for="notes">Notes</Label>

		<Textarea
			name="notes"
			id="notes"
			bind:value={$form.notes}
			placeholder="Add notes..."
			rows={1}
			class="w-auto min-w-[300px]"
		/>
		{#if $errors.notes}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.notes}</span>
		{/if}

		<Button type="submit" class="self-start" loading={$delayed}>Submit</Button>
	</form>
</section>
