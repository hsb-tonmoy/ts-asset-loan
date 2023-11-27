<script lang="ts">
	import { Home, Menu, Cog, BadgeHelp } from 'lucide-svelte';
	import DarkModeSwitcher from '$lib/DarkModeSwitcher.svelte';

	import UserMenu from './UserMenu.svelte';

	const menuItems = [
		{
			name: 'Settings',
			icon: Cog,
			link: '/admin'
		},
		{
			name: 'Help',
			icon: BadgeHelp,
			link: '/admin'
		}
	];
</script>

<div class="flex justify-between items-center px-3 text-neutral-400 ml-[200px] h-full">
	<div class="flex items-center gap-2">
		<Menu class="w-5 h-5 mr-4 text-[#333639]" />
		<a href="/" target="_blank">
			<Home class="w-5 h-5 mr-4 text-[#333639]" />
		</a>
		<div class="inline-flex items-center gap-3">
			<span class="text-sm">Dashboard</span>
			/
			<span class="text-sm">Admin</span>
		</div>
	</div>
	<div class="flex items-center gap-6">
		<DarkModeSwitcher />
		<UserMenu />
		{#each menuItems as item}
			<svelte:component this={item.icon} class="w-5 h-5" />
		{/each}
	</div>
</div>
