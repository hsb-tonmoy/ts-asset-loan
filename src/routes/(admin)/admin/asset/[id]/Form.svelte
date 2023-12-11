<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms/client';
	import { ChevronsUpDown, Trash2 } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { formSchema } from './schema';
	import { toast } from 'svoast';
	import AutoComplete from '$lib/components/ui/autocomplete/AutoComplete.svelte';
	import { convertToImageURL } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	export let edit: boolean = false;

	let uploadedImage: string;

	const categories = data.categories;
	const statuses = data.statuses;

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: formSchema,
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(`Asset ${edit ? 'updated' : 'added'} successfully`, {
					closable: true
				});
				goto('/admin/asset/list');
			}
		},
		onError: ({ result }) => {
			toast.error('Something went wrong!', {
				closable: true
			});
			console.log(result.error.message);
		}
	});

	const handleImageUpload = (e: Event) => {
		const image = (e.target as HTMLInputElement | null)?.files?.[0] ?? null;
		if (!image) return;

		uploadedImage = URL.createObjectURL(image);
	};

	$: form.update((old) => ({
		...old,
		image: uploadedImage
	}));

	if (edit) uploadedImage = convertToImageURL(data.asset.image);

	let category: any;
	let status: any;

	if (edit) {
		category = $form.category;
		status = $form.status;
	}

	$: form.update((old) => ({
		...old,
		category: category?.id
	}));

	$: form.update((old) => ({
		...old,
		status: status?.id
	}));
</script>

<form
	method="POST"
	action={edit ? '?/update' : '?/create'}
	use:enhance
	class="flex flex-col gap-4 text-gray-800"
	enctype="multipart/form-data"
>
	<Label for="asset_tag">Asset Tag</Label>
	<Input
		type="text"
		name="asset_tag"
		id="asset_tag"
		bind:value={$form.asset_tag}
		class="w-auto min-w-[300px]"
	/>
	<p class="text-sm text-muted-foreground">Must be unique</p>
	{#if $errors.asset_tag}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.asset_tag}</span>
	{/if}
	<Label for="category">Asset Category</Label>

	<AutoComplete
		items={categories}
		bind:selectedItem={category}
		labelFieldName="name"
		valueFieldName="id"
		showClear={true}
		><div slot="item" let:item let:label>
			<div class="inline-flex items-center gap-2">
				{#if item.image}
					<img class="w-10 h-10 object-cover" src={convertToImageURL(item.image)} alt={label} />
				{/if}
				{@html label}
			</div>
		</div>
	</AutoComplete>
	<Label for="status">Asset Status</Label>

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
	<Label for="name">Name</Label>
	<Input type="text" name="name" id="name" bind:value={$form.name} class="w-auto min-w-[300px]" />
	{#if $errors.name}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.name}</span>
	{/if}
	<Label for="image">Asset Image</Label>
	<Input type="file" name="image" accept="image/*" on:change={handleImageUpload} />
	{#if $errors.image}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.image}</span>
	{/if}
	{#if uploadedImage}
		<div class="relative mt-2 mb-4">
			<img src={uploadedImage} alt={$form.name} class="w-32 h-32 object-cover" />
			<!-- Hover on image to show delete button -->
			<div class="absolute bottom-2 right-2">
				<Button
					type="button"
					variant="outline"
					size="icon"
					on:click={() => {
						uploadedImage = '';
					}}
				>
					<Trash2 class="h-[1.2rem] w-[1.2rem]" />
				</Button>
			</div>
		</div>
	{/if}
	<Collapsible.Root class="w-full">
		<Collapsible.Trigger
			asChild
			let:builder
			class="text-sm dark:text-white font-normal leading-none"
			><Button
				type="button"
				builders={[builder]}
				class="w-full inline-flex items-center justify-between pl-0 border-b bg-transparent hover:bg-transparent text-black dark:text-white"
			>
				Meta Fields
				<ChevronsUpDown class="h-4 w-4" />
			</Button></Collapsible.Trigger
		>
		<Collapsible.Content class="flex flex-col gap-4 mt-4">
			<Label for="serial">Serial Number</Label>
			<Input
				type="text"
				name="serial"
				id="serial"
				bind:value={$form.serial}
				class="w-auto min-w-[300px]"
			/>
			<p class="text-sm text-muted-foreground">Must be unique</p>
			{#if $errors.serial}
				<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.serial}</span>
			{/if}

			<!-- Model Field -->
			<Label for="model">Model</Label>
			<Input
				type="text"
				name="model"
				id="model"
				bind:value={$form.model}
				class="w-auto min-w-[300px]"
			/>
			{#if $errors.model}
				<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.model}</span>
			{/if}

			<!-- Location Field -->
			<Label for="location">Location</Label>
			<Input
				type="text"
				name="location"
				id="location"
				bind:value={$form.location}
				class="w-auto min-w-[300px]"
			/>
			{#if $errors.location}
				<span class="text-sm font-medium text-destructive dark:text-red-600"
					>{$errors.location}</span
				>
			{/if}

			<!-- Purchase Cost Field -->
			<Label for="purchase_cost">Purchase Cost</Label>
			<Input
				type="number"
				name="purchase_cost"
				id="purchase_cost"
				bind:value={$form.purchase_cost}
				class="w-auto min-w-[300px]"
			/>
			{#if $errors.purchase_cost}
				<span class="text-sm font-medium text-destructive dark:text-red-600"
					>{$errors.purchase_cost}</span
				>
			{/if}

			<!-- MAC Address Field -->
			<Label for="mac_address">MAC Address</Label>
			<Input
				type="text"
				name="mac_address"
				id="mac_address"
				bind:value={$form.mac_address}
				class="w-auto min-w-[300px]"
			/>
			{#if $errors.mac_address}
				<span class="text-sm font-medium text-destructive dark:text-red-600"
					>{$errors.mac_address}</span
				>
			{/if}

			<!-- IMEI Field -->
			<Label for="imei">IMEI</Label>
			<Input
				type="text"
				name="imei"
				id="imei"
				bind:value={$form.imei}
				class="w-auto min-w-[300px]"
			/>
			{#if $errors.imei}
				<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.imei}</span>
			{/if}
		</Collapsible.Content>
	</Collapsible.Root>
	<!-- Serial Number Field -->

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
