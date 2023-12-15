<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { formSchema } from './schema';
	import { toast } from 'svoast';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';

	import AsyncUser from '$lib/components/AsyncSelects/AsyncUser.svelte';

	export let data: PageData;

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: formSchema,
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(`Settings successfully updated`, {
					closable: true
				});
			}
		},
		onError: ({ result }) => {
			toast.error('Something went wrong!', {
				closable: true
			});
			console.log(result.error.message);
		}
	});

	let default_assignto_user_email: any;

	$: console.log(default_assignto_user_email);
</script>

<form method="POST" action="?/update" use:enhance class="flex flex-col gap-4 text-gray-800">
	<input type="hidden" id="id" name="id" value={data.siteSettings.id} />
	<Label>Site Name</Label>
	<Input
		type="text"
		name="site_name"
		id="site_name"
		bind:value={$form.site_name}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.site_name}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.site_name}</span>
	{/if}

	<Label>Site Description</Label>
	<Input
		type="text"
		name="site_description"
		id="site_description"
		bind:value={$form.site_description}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.site_description}
		<span class="text-sm font-medium text-destructive dark:text-red-600"
			>{$errors.site_description}</span
		>
	{/if}

	<Label>Maintenance Mode</Label>
	<Switch name="maintenance_mode" id="maintenance_mode" bind:checked={$form.maintenance_mode} />
	{#if $errors.maintenance_mode}
		<span class="text-sm font-medium text-destructive dark:text-red-600"
			>{$errors.maintenance_mode}</span
		>
	{/if}

	<Label>Admin Email</Label>
	<Input
		type="email"
		name="admin_email"
		id="admin_email"
		bind:value={$form.admin_email}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.admin_email}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.admin_email}</span
		>
	{/if}

	<Label>Default Assign-To User</Label>
	<AsyncUser
		value={{ email: data.siteSettings?.default_assignto_user_email }}
		bind:justValue={$form.default_assignto_user_email}
	/>
	{#if $errors.default_assignto_user_email}
		<span class="text-sm font-medium text-destructive dark:text-red-600"
			>{$errors.default_assignto_user_email}</span
		>
	{/if}

	<Button type="submit" class="self-start" loading={$delayed}>Update</Button>
</form>
