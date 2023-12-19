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

	import Assets from '$lib/components/AsyncSelects/Assets.svelte';
	import AsyncUser from '$lib/components/AsyncSelects/AsyncUser.svelte';
	import { convertDateTime, extractDate, extractTime } from '$lib/utils';

	export let data: PageData;

	export let edit: boolean = false;

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: formSchema,
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(`Asset ${edit ? 'updated' : 'added'} successfully`, {
					closable: true
				});
				goto('/admin/asset-checkout/list');
			}
		},
		onError: ({ result }) => {
			toast.error('Something went wrong!', {
				closable: true
			});
			console.log(result.error.message);
		}
	});

	$: console.log($form, $errors);

	let checkoutDate: string, checkoutTime: string, checkinDate: string, checkinTime: string;

	let checkoutDateTimeFromDb = data.checkout?.checkout_date
		? new Date(data.checkout.checkout_date)
		: null;
	let checkinDateTimeFromDb = data.checkout?.checkin_date
		? new Date(data.checkout.checkin_date)
		: null;

	if (edit) {
		if (checkoutDateTimeFromDb instanceof Date) {
			checkoutDate = extractDate(checkoutDateTimeFromDb);
			checkoutTime = extractTime(checkoutDateTimeFromDb);
		}

		if (checkinDateTimeFromDb instanceof Date) {
			checkinDate = extractDate(checkinDateTimeFromDb);
			checkinTime = extractTime(checkinDateTimeFromDb);
		}
	}

	$: {
		if (checkoutDate && checkoutTime) {
			$form.checkout_date = convertDateTime(checkoutDate, checkoutTime).toISOString();
		}

		if (checkinDate && checkinTime) {
			$form.checkin_date = convertDateTime(checkinDate, checkinTime).toISOString();
		}
	}
</script>

<form
	method="POST"
	action={edit ? '?/update' : '?/create'}
	use:enhance
	class="flex flex-col gap-4 text-gray-800"
>
	<Label for="user">Checkout To</Label>
	<AsyncUser value={edit && { email: data.checkout?.user.email }} bind:justValue={$form.user_id} />

	<Label for="asset">Choose an asset to checkout</Label>
	<Assets
		itemId="asset_tag"
		value={edit && { asset_tag: data.checkout?.asset.asset_tag }}
		bind:justValue={$form.asset_tag}
	/>

	<Label for="checkoutDate">Checkout Date</Label>
	<Input type="date" name="checkoutDate" id="checkoutDate" bind:value={checkoutDate} />
	{#if $errors.checkoutDate}
		<span class="text-sm font-medium text-destructive dark:text-red-600"
			>{$errors.checkoutDate}</span
		>
	{/if}

	<Label for="checkoutTime">Checkout Time</Label>
	<Input type="time" name="checkoutTime" id="checkoutTime" bind:value={checkoutTime} />
	{#if $errors.checkoutDate}
		<span class="text-sm font-medium text-destructive dark:text-red-600"
			>{$errors.checkoutDate}</span
		>
	{/if}

	<Label for="checkinDate">Check-In Date</Label>
	<Input type="date" name="checkinDate" id="checkinDate" bind:value={checkinDate} />
	{#if $errors.checkinDate}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.checkinDate}</span
		>
	{/if}

	<Label for="checkinTime">Check-In Time</Label>
	<Input
		type="time"
		name="checkinTime"
		id="checkinTime"
		bind:value={checkinTime}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.checkinDate}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.checkinDate}</span
		>
	{/if}

	<Label for="notes">Notes</Label>
	<Textarea
		name="notes"
		id="notes"
		bind:value={$form.notes}
		placeholder="Add a short note..."
		rows={1}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.notes}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.notes}</span>
	{/if}

	<Button type="submit" class="self-start" loading={$delayed}>Submit</Button>
</form>
