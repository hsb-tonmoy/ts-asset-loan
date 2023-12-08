<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		><img src="/img/avatars/male.svg" alt="Name" class="w-8 rounded-full" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label class="text-sm">Account Options</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="text-sm">Profile</DropdownMenu.Item>
			<DropdownMenu.Item href="/auth/logout" class="text-sm">Log Out</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
