<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms/client';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { formSchema } from './schema';
	import { toast } from 'svoast';
	import AutoComplete from '$lib/components/ui/autocomplete/AutoComplete.svelte';
	import colors from '$lib/components/colors.json';

	export let data: any;

	export let edit: boolean = false;

	let statusColor = { value: '', label: '' };

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: formSchema,
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(`Status ${edit ? 'updated' : 'added'} successfully`, {
					closable: true
				});
				goto('/admin/asset-status/list');
			}
		},
		onError: ({ result }) => {
			toast.error('Something went wrong!', {
				closable: true
			});
			console.log(result.error.message);
		}
	});

	if (edit) {
		statusColor.value = data.status.statusColor;
	}

	console.log(statusColor);

	$: {
		$form.statusColor = statusColor.value;
	}
</script>

<form
	method="POST"
	action={edit ? '?/update' : '?/create'}
	use:enhance
	class="flex flex-col gap-4 text-gray-800"
>
	<Label for="name">Name</Label>
	<Input
		type="text"
		name="name"
		id="name"
		bind:value={$form.name}
		disabled={$form.name === 'Requestable'}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.name}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.name}</span>
	{/if}
	<Label for="statusColor">Status Color</Label>

	<AutoComplete
		items={colors}
		bind:selectedItem={statusColor}
		valueFieldName="value"
		labelFieldName="label"
		showClear={true}
		><div slot="item" let:item let:label>
			<div class="inline-flex items-center gap-2">
				<span class="w-4 h-4" style="background-color:{item.value}" />{@html label}
			</div>
		</div>
	</AutoComplete>
	{#if $errors.statusColor}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.statusColor}</span
		>
	{/if}
	<Label for="description">Description</Label>

	<Textarea
		name="description"
		id="description"
		bind:value={$form.description}
		placeholder="Add a short description..."
		rows={1}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.description}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.description}</span
		>
	{/if}

	<Button type="submit" class="self-start" loading={$delayed}>Submit</Button>
</form>
