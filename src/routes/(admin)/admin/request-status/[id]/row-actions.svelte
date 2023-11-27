<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import { Trash2, Pencil } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	export let row: any;
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
			if (result.type === 'success') {
				await invalidateAll();
			} else {
				await applyAction(result);
			}
		};
	}}
	class="inline-flex items-center gap-2"
>
	<Button href="/admin/request-status/{row.id}" variant="outline" size="icon">
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
				<AlertDialog.Title>Are you sure you want to delete {row.name}?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will alter all the requests under this status and set
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
