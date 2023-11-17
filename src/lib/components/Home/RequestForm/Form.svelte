<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import AutoComplete from '$lib/components/ui/autocomplete/AutoComplete.svelte';
	import type { PageData } from '../../../../routes/(root)/$types';

	export let data: PageData;

	const { form, errors, enhance } = superForm(data.form, {
		validators: formSchema,
		dataType: 'json'
	});

	const categories = [
		{ label: 'Laptop', value: 'laptop' },
		{ label: 'Monitor', value: 'monitor' },
		{ label: 'Keyboard', value: 'keyboard' },
		{ label: 'Mouse', value: 'mouse' },
		{ label: 'Headset', value: 'headset' },
		{ label: 'Webcam', value: 'webcam' },
		{ label: 'Docking Station', value: 'docking-station' },
		{ label: 'Other', value: 'other' }
	];
</script>

<form method="POST" use:enhance class="grid grid-cols-6 gap-4 text-gray-800">
	<div class="flex flex-col gap-4 col-span-6">
		<Label for="category" class="block">Type of Equipment</Label>
		<AutoComplete
			name="category"
			id="category"
			multiple
			items={categories}
			bind:value={$form.category}
			valueFieldName="value"
			labelFieldName="label"
			showClear={true}
			className="w-full"
		/>

		<!-- {#if $errors.category}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.category}</span>
		{/if} -->
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="firstName">First Name</Label>
		<Input type="text" name="firstName" id="firstName" bind:value={$form.firstName} />
		{#if $errors.firstName}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.firstName}</span
			>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="lastName">Last Name</Label>
		<Input type="text" name="lastName" id="lastName" bind:value={$form.lastName} />
		{#if $errors.lastName}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.lastName}</span>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="email">Email</Label>
		<Input type="email" name="email" id="email" bind:value={$form.email} />
		{#if $errors.email}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.email}</span>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="phone">Phone</Label>
		<Input type="tel" name="phone" id="phone" bind:value={$form.phone} />
		{#if $errors.phone}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.phone}</span>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="requestDate">Request Date</Label>
		<Input type="date" name="requestDate" id="requestDate" bind:value={$form.requestDate} />
		{#if $errors.requestDate}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.requestDate}</span
			>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="requestTime">Request Time</Label>
		<Input type="time" name="requestTime" id="requestTime" bind:value={$form.requestTime} />
		{#if $errors.requestTime}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.requestTime}</span
			>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="returnDate">Return Date</Label>
		<Input type="date" name="returnDate" id="returnDate" bind:value={$form.returnDate} />
		{#if $errors.returnDate}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.returnDate}</span
			>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="returnTime">Return Time</Label>
		<Input
			type="time"
			name="returnTime"
			id="returnTime"
			bind:value={$form.returnTime}
			class="w-auto min-w-[300px]"
		/>
		{#if $errors.returnTime}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.returnTime}</span
			>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-6">
		<Label for="notes" class="">Notes</Label>
		<Textarea
			name="notes"
			id="notes"
			bind:value={$form.notes}
			placeholder="Add any notes..."
			rows={6}
			class="w-full"
		/>
		{#if $errors.notes}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.notes}</span>
		{/if}
	</div>

	<Button type="submit" class="self-start">Submit</Button>
</form>

<style lang="postcss">
	.label-class {
		@apply text-[#fafafa] mb-4;
	}
</style>
