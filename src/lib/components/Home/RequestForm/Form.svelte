<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import AutoComplete from '$lib/components/ui/autocomplete/AutoComplete.svelte';
	import type { PageData } from '../../../../routes/(root)/$types';
	import { toast } from 'svoast';

	export let data: PageData;

	export let success: boolean = false;

	const categories = data.categories;

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: formSchema,
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(`Request successfully submitted`, {
					closable: true
				});
				success = true;
			}
		},
		onError: ({ result }) => {
			toast.error('Something went wrong!', {
				closable: true
			});
			console.log(result.error.message);
		}
	});

	let requestDate: string, requestTime: string, returnDate: string, returnTime: string;

	const convertDateTime = (dateString: string, timeString: string) => {
		const date = new Date(dateString + 'T00:00:00');

		const [hours, minutes] = timeString.split(':').map(Number);

		date.setHours(hours, minutes, 0, 0);

		return date;
	};

	$: {
		if (requestDate && requestTime) {
			$form.requestDateTime = convertDateTime(requestDate, requestTime).toISOString();
		}

		if (returnDate && returnTime) {
			$form.returnDateTime = convertDateTime(returnDate, returnTime).toISOString();
		}
	}

	let selectedCategories: any[] = [];
	let assetRequests: { [categoryName: string]: number } = {};

	$: {
		selectedCategories.forEach((category) => {
			if (assetRequests[category.name] === undefined) {
				assetRequests[category.name] = 0;
			}
		});
	}

	$: {
		$form.requestedCategories = JSON.stringify(assetRequests);
	}

	function updateRequestedAssets(categoryName: string, value: number) {
		assetRequests[categoryName] = value;
	}
</script>

<form method="POST" use:enhance class="grid grid-cols-6 gap-4 text-gray-800">
	<div class="flex flex-col gap-4 col-span-6">
		<Label for="category" class="block">Type of Equipment</Label>
		<AutoComplete
			multiple
			items={categories}
			bind:selectedItem={selectedCategories}
			valueFieldName="id"
			labelFieldName="name"
			showClear={true}
			className="w-full"
		/>
	</div>
	{#each selectedCategories as category (category.id)}
		<div class="flex gap-4 col-span-6 w-full">
			<div class="w-1/4"><Label>{category.name} ({category.assets.length})</Label></div>
			<div class="w-3/4">
				<Input
					type="number"
					min="0"
					max={category.assets.length}
					bind:value={assetRequests[category.name]}
					on:input={(event) => updateRequestedAssets(category.name, +event.target.value)}
				/>
			</div>
		</div>
	{/each}
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
		<Input type="date" name="requestDate" id="requestDate" bind:value={requestDate} />
		{#if $errors.requestDateTime}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.requestDateTime}</span
			>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="requestTime">Request Time</Label>
		<Input type="time" name="requestTime" id="requestTime" bind:value={requestTime} />
		{#if $errors.requestDateTime}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.requestDateTime}</span
			>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="returnDate">Return Date</Label>
		<Input type="date" name="returnDate" id="returnDate" bind:value={returnDate} />
		{#if $errors.returnDateTime}
			<span class="text-sm font-medium text-destructive dark:text-red-600"
				>{$errors.returnDateTime}</span
			>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
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

	<Button type="submit" class="self-start" loading={$delayed}>Submit</Button>
</form>

<style lang="postcss">
	.label-class {
		@apply text-[#fafafa] mb-4;
	}
</style>
