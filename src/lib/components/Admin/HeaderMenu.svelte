<script lang="ts">
	import {
		Menu,
		Gauge,
		User,
		ClipboardList,
		MonitorSmartphone,
		ClipboardEdit,
		Cog,
		BadgeHelp
	} from 'lucide-svelte';

	const menuItems = [
		{
			name: 'Dashboard',
			icon: Gauge,
			link: '/admin'
		},
		{
			name: 'Users',
			icon: User,
			link: '/admin'
		},
		{
			name: 'Requests',
			icon: ClipboardList,
			link: '/admin'
		},
		{
			name: 'Categories',
			icon: MonitorSmartphone,
			link: '/admin'
		},
		{
			name: 'Statues',
			icon: ClipboardEdit,
			link: '/admin'
		},
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
		<Gauge class="w-5 h-5 mr-4 text-[#333639]" />
		<div class="inline-flex items-center gap-3">
			<span class="text-sm">Dashboard</span>
			/
			<span class="text-sm">Admin</span>
		</div>
	</div>
	<div class="flex items-center gap-6">
		{#each menuItems as item}
			<svelte:component this={item.icon} class="w-5 h-5" />
		{/each}
	</div>
</div>
