<script lang="ts">
	import {
		Gauge,
		User,
		ClipboardList,
		MonitorSmartphone,
		ClipboardEdit,
		Cog,
		BadgeHelp,
		ChevronDown
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
			link: '/admin/settings/status/add'
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

<div class="flex flex-col h-full w-full">
	<div class="inline-flex flex-col items-center gap-2 mb-10">
		<img src="/logo.svg" alt="Kalamazoo Public Library" class="w-12" /><span
			class="text-white text-sm text-center">Kalamazoo Public Library</span
		>
	</div>
	<div class="flex flex-col gap-6">
		{#each menuItems as item}
			<div class="flex items-center justify-between text-gray-300 hover:text-white">
				<div class="inline-flex items-center gap-2">
					<svelte:component this={item.icon} class="w-5 h-5" />
					<span class="text-sm"><a href={item.link}>{item.name}</a></span>
				</div>
				<ChevronDown strokeWidth={1.25} class="w-5 h-5" />
			</div>
		{/each}
	</div>
</div>
