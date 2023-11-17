<script lang="ts">
	import type { PageData } from './$types';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms/client';

	import AutoComplete from '$lib/components/ui/autocomplete/AutoComplete.svelte';

	export let data: PageData;
	import colors from '$lib/components/colors.json';

	const { form, errors, enhance } = superForm(data.form, {
		validators: formSchema,
		dataType: 'json'
	});

	let statusColor = { value: '', label: '' };

	$: {
		$form.statusColor = statusColor.value;
	}
</script>

<form method="POST" use:enhance class="flex flex-col gap-4 text-gray-800">
	<Label for="name">Name</Label>
	<Input type="text" name="name" id="name" bind:value={$form.name} class="w-auto min-w-[300px]" />
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

	<Button type="submit" class="self-start">Submit</Button>
</form>
