<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import { Clock, Trash2, Pencil } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { toast } from 'svoast';
	import { convertDateTime } from '$lib/utils';

	export let row: any;

	let checkin_date: string = '';
	let checkin_time: string = '';
	let checkin_date_time: string = '';

	$: {
		if (checkin_date && checkin_time) {
			checkin_date_time = convertDateTime(checkin_date, checkin_time).toISOString();
		}
	}

	const handleCheckIn = async (id: Number) => {
		const res = await fetch(`/api/asset-checkout`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: id,
				checkin_date_time,
				asset_tag: row.asset_tag
			})
		});

		if (res.ok) {
			toast.success(`Asset successfully checked in!`, {
				closable: true
			});
		} else {
			toast.error(`Something went wrong.`, {
				closable: true
			});
		}
	};
</script>

<form
	id="delete-{row.id}"
	method="POST"
	action="?/delete"
	use:enhance={async ({ formData }) => {
		formData.append('delete', 'delete');

		for (const [key, value] of Object.entries(row)) {
			formData.append(key, String(value));
		}
		return async ({ result }) => {
			if (result) {
				await invalidateAll();
			} else {
				await applyAction(result);
			}
		};
	}}
	class="inline-flex items-center gap-2"
>
	<Dialog.Root>
		<Dialog.Trigger type="button" class={buttonVariants({ variant: 'outline' })}>
			<Clock class="w-4 h-4" />
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Asset Check In</Dialog.Title>
				<Dialog.Description>Check this asset back in.</Dialog.Description>
			</Dialog.Header>
			<div class="flex flex-col gap-4 py-4">
				<div class="grid grid-cols-6 items-center gap-4">
					<Label class="col-span-2">Check-in Date</Label>
					<Input class="col-span-4" type="date" bind:value={checkin_date} />
				</div>
				<div class="grid grid-cols-6 items-center gap-4">
					<Label class="col-span-2">Check-in Time</Label>
					<Input class="col-span-4" type="time" bind:value={checkin_time} />
				</div>
			</div>
			<Dialog.Footer>
				<Button
					type="button"
					on:click={() => {
						handleCheckIn(row.id);
					}}>Check-In</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<Button href="/admin/asset-checkout/{row.id}" variant="outline" size="icon">
		<Pencil class="w-4 h-4" />
	</Button>
	<AlertDialog.Root>
		<AlertDialog.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline" size="icon">
				<Trash2 class="w-4 h-4" />
			</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Are you sure you want to delete this checkout?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will alter all the requests under this asset and set
					them to the default.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action type="submit" form="delete-{row.id}" class="bg-destructive text-white"
					>Delete</AlertDialog.Action
				>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</form>
