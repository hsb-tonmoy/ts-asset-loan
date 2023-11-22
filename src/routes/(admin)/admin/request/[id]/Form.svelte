<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms/client';
	import { Trash2 } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { formSchema } from './schema';
	import { toast } from 'svoast';
	import AutoComplete from '$lib/components/ui/autocomplete/AutoComplete.svelte';
	import { formatDateTime } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

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
</script>

<form
	method="POST"
	action={edit ? '?/update' : '?/create'}
	use:enhance
	class="flex flex-col gap-4 text-gray-800"
	enctype="multipart/form-data"
>
	<Label for="asset_tag">request Tag</Label>
	<Input
		type="text"
		name="asset_tag"
		id="asset_tag"
		bind:value={$form.asset_tag}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.asset_tag}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.asset_tag}</span>
	{/if}
	<Label for="category">Request Category</Label>

	<Label for="name">Name</Label>
	<Input type="text" name="name" id="name" bind:value={$form.name} class="w-auto min-w-[300px]" />
	{#if $errors.name}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.name}</span>
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
