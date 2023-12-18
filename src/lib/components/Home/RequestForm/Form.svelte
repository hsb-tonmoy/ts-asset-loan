<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import MaskedInput from '$lib/components/ui/input-mask/MaskedInput.svelte';
	import type { PageData } from '../../../../routes/(root)/$types';
	import { toast } from 'svoast';
	import AssetCategory from '$lib/components/AsyncSelects/AssetCategory.svelte';
	import { convertDateTime } from '$lib/utils';

	export let data: PageData;

	export let success: boolean = false;

	let userHasPhone: boolean = false;

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

	if (data.user) {
		form.update(
			($form) => {
				$form.firstName = data.user.firstName;
				$form.lastName = data.user.lastName;
				$form.email = data.user.email;
				$form.phone = data.user.phone;

				return $form;
			},
			{ taint: false }
		);
	}

	$: {
		if (data.user && data.user.phone) {
			userHasPhone = true;
		}
	}

	const handlePhoneUpdate = async () => {
		form.update(
			($form) => {
				$form.updatePhone = true;

				return $form;
			},
			{ taint: false }
		);

		const formElement = document.querySelector('form') as HTMLFormElement;
		formElement.requestSubmit();
	};

	let requestDate: string, requestTime: string, returnDate: string, returnTime: string;

	$: {
		if (requestDate && requestTime) {
			$form.requestDateTime = convertDateTime(requestDate, requestTime).toISOString();
		}

		if (returnDate && returnTime) {
			$form.returnDateTime = convertDateTime(returnDate, returnTime).toISOString();
		}
	}
	let category: any;
	let selectedCategories: any = [];
	let assetRequests: { [categoryName: string]: number } = {};

	$: {
		selectedCategories.forEach((category: any) => {
			if (assetRequests[category.name] === undefined) {
				assetRequests[category.name] = 0;
			}
		});
	}

	$: if (assetRequests) {
		let filteredAssetRequests: { [categoryName: string]: number } = {};
		for (let key in assetRequests) {
			if (assetRequests[key] !== 0) {
				filteredAssetRequests[key] = assetRequests[key];
			}
		}
		form.update(
			($form) => {
				$form.requestedCategories = JSON.stringify(filteredAssetRequests);
				return $form;
			},
			{ taint: false }
		);
	}

	function updateRequestedAssets(categoryName: string, value: number) {
		assetRequests[categoryName] = value;
	}
</script>

<form id="requestForm" method="POST" use:enhance class="grid grid-cols-6 gap-4 text-gray-800">
	<div class="flex flex-col gap-4 col-span-6">
		<Label for="category" class="block">Type of Equipment</Label>
		<AssetCategory
			bind:value={selectedCategories}
			bind:justValue={category}
			multiple={true}
			includeAssets={true}
			placeholder="Search for equipments..."
		/>
	</div>
	{#each selectedCategories as category (category.id)}
		<div class="flex gap-4 col-span-6 w-full">
			<div class="w-1/4">
				<Label>{category.name} ({category.assets.length})</Label>
			</div>
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
		<Input
			type="text"
			name="firstName"
			id="firstName"
			disabled={data.user}
			bind:value={$form.firstName}
		/>
		{#if $errors.firstName}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.firstName}</span
			>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="lastName">Last Name</Label>
		<Input
			type="text"
			name="lastName"
			id="lastName"
			disabled={data.user}
			bind:value={$form.lastName}
		/>
		{#if $errors.lastName}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.lastName}</span>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="email">Email</Label>
		<Input type="email" name="email" id="email" disabled={data.user} bind:value={$form.email} />
		{#if $errors.email}
			<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.email}</span>
		{/if}
	</div>

	<div class="flex flex-col gap-4 col-span-3">
		<Label for="phone">Phone</Label>
		<MaskedInput
			id="phone"
			name="phone"
			mask="(000) 000 - 0000"
			size={20}
			showMask
			maskChar="_"
			value={$form.phone ?? ''}
			on:change={({ detail }) => ($form.phone = detail.inputState.unmaskedValue)}
		/>
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

	<div class="col-span-6">
		{#if !userHasPhone}
			<AlertDialog.Root>
				<AlertDialog.Trigger asChild let:builder>
					<Button type="button" builders={[builder]} class="w-auto self-start">Submit</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Update Phone Number?</AlertDialog.Title>
						<AlertDialog.Description>
							You don't have a phone number set in your profile. Would you like to update your
							profile with this number: ({$form.phone})?
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Not Now</AlertDialog.Cancel>
						<AlertDialog.Action on:click={handlePhoneUpdate} class="bg-destructive text-white"
							>Yes, please</AlertDialog.Action
						>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		{:else}
			<Button type="submit" class="w-auto self-start" loading={$delayed}>Submit</Button>
		{/if}
	</div>
</form>

<style lang="postcss">
	.label-class {
		@apply text-[#fafafa] mb-4;
	}
</style>
