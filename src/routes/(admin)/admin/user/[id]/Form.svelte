<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms/client';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { formSchema } from './schema';
	import { toast } from 'svoast';

	export let data: any;

	const { form, errors, enhance, delayed } = superForm(data.form, {
		validators: formSchema,
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(`User updated successfully`, {
					closable: true
				});
				goto('/admin/user/list');
			}
		},
		onError: ({ result }) => {
			toast.error('Something went wrong!', {
				closable: true
			});
			console.log(result.error.message);
		}
	});

	let selectedRole = {
		value: $form.role,
		label: $form.role === 'admin' ? 'Admin' : 'Staff'
	};

	$: {
		$form.role = selectedRole.value;
	}
</script>

<form
	method="POST"
	action="?/update"
	enctype="multipart/form-data"
	use:enhance
	class="flex flex-col gap-4 text-gray-800"
>
	<Label for="firstName">First Name</Label>
	<Input
		type="text"
		name="firstName"
		id="firstName"
		bind:value={$form.firstName}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.firstName}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.firstName}</span>
	{/if}

	<Label for="lastName">Last Name</Label>
	<Input
		type="text"
		name="lastName"
		id="lastName"
		bind:value={$form.lastName}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.lastName}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.lastName}</span>
	{/if}

	<Label for="email">Email</Label>
	<Input
		type="email"
		name="email"
		id="email"
		bind:value={$form.email}
		class="w-auto min-w-[300px]"
	/>
	{#if $errors.email}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.email}</span>
	{/if}

	<Label for="role">Role</Label>
	<Select.Root portal={null} bind:selected={selectedRole}>
		<Select.Trigger class="w-[180px]">
			<Select.Value placeholder="Select a role" />
		</Select.Trigger>
		<Select.Content>
			<Select.Label>Role</Select.Label>

			<Select.Item value="admin" label="Admin">Admin</Select.Item>
			<Select.Item value="staff" label="Staff">Staff</Select.Item>
		</Select.Content>
		<Select.Input name="role" />
	</Select.Root>
	{#if $errors.role}
		<span class="text-sm font-medium text-destructive dark:text-red-600">{$errors.role}</span>
	{/if}

	<Button type="submit" class="self-start" loading={$delayed}>Submit</Button>
</form>
