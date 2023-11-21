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
	import { convertToImageURL } from '$lib/utils';

	export let data: any;

	export let edit: boolean = false;

	let uploadedImage: string;

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

	async function getCategories(keyword: string) {
		const url = '/api/category/?search=' + encodeURIComponent(keyword);

		const response = await fetch(url);
		const json = await response.json();
		return json;
	}

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

	$: console.log($form);
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
	{#if $errors.asset_tag}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.asset_tag}</span>
	{/if}
	<Label for="category">Asset Category</Label>

	<AutoComplete
		searchFunction={getCategories}
		delay={200}
		bind:value={$form.category}
		localFiltering={false}
		labelFieldName="name"
		valueFieldName="id"
		showClear={true}
		><div slot="item" let:item let:label>
			<div class="inline-flex items-center gap-2">
				<img
					class="w-10 h-10 object-cover"
					src={convertToImageURL(item.image)}
					alt={label}
				/>{@html label}
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
