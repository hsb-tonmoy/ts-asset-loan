<script lang="ts">
	import { page } from '$app/stores';
	import {
		Gauge,
		User,
		ClipboardList,
		ClipboardCheck,
		MonitorSmartphone,
		Monitor,
		Cog,
		BadgeHelp,
		ChevronDown
	} from 'lucide-svelte';

	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Button } from '$lib/components/ui/button';

	export let site_name: string;

	const menuItems = [
		{
			name: 'Dashboard',
			icon: Gauge,
			link: '/admin'
		},
		{
			name: 'Users',
			icon: User,
			link: '/admin/user/list'
		},
		{
			name: 'Requests',
			icon: ClipboardList,
			link: '/admin/request/list',
			submenu: [
				{
					name: 'Add Request',
					link: '/admin/request/add'
				},
				{
					name: 'List Requests',
					link: '/admin/request/list'
				}
			]
		},
		{
			name: 'Checkouts',
			icon: ClipboardCheck,
			link: '/admin/asset-checkout/list',
			submenu: [
				{
					name: 'Checkout Asset',
					link: '/admin/asset-checkout/add'
				},
				{
					name: 'List Checkouts',
					link: '/admin/asset-checkout/list'
				}
			]
		},
		{
			name: 'Assets',
			icon: Monitor,
			link: '/admin/asset/list',
			submenu: [
				{
					name: 'Add Asset',
					link: '/admin/asset/add'
				},
				{
					name: 'List Assets',
					link: '/admin/asset/list'
				}
			]
		},
		{
			name: 'Categories',
			icon: MonitorSmartphone,
			link: '/admin/category/list',
			submenu: [
				{
					name: 'Add Category',
					link: '/admin/category/add'
				},
				{
					name: 'List Categories',
					link: '/admin/category/list'
				}
			]
		},
		{
			name: 'Settings',
			icon: Cog,
			link: '/admin/settings',
			submenu: [
				{
					name: 'Asset Status',
					link: '/admin/asset-status/list'
				},
				{
					name: 'Request Status',
					link: '/admin/request-status/list'
				}
			]
		},
		{
			name: 'Help',
			icon: BadgeHelp,
			link: '#'
		}
	];
</script>

<div class="flex flex-col h-full w-full">
	<div class="inline-flex flex-col items-center gap-2 mb-10">
		<img src="/logo.svg" alt={site_name} class="w-12" /><span class="text-white text-sm text-center"
			>{site_name}</span
		>
	</div>
	<div class="flex flex-col gap-6">
		{#each menuItems as item}
			<Collapsible.Root>
				<div
					class="flex items-center justify-between {$page.url.pathname === item.link
						? 'text-white'
						: 'text-gray-500'} hover:text-white"
				>
					<div class="inline-flex items-center gap-2">
						<svelte:component this={item.icon} class="w-5 h-5" />
						<span class="text-sm"><a href={item.link}>{item.name}</a></span>
					</div>
					<Collapsible.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="ghost"
							size="sm"
							class="w-9 p-0 hover:bg-none {item.submenu === undefined ? 'invisible' : ''} "
							disabled={item.submenu === undefined}
						>
							<ChevronDown strokeWidth={1.25} class="w-5 h-5" />
							<span class="sr-only">Toggle</span>
						</Button>
					</Collapsible.Trigger>
				</div>
				{#if item.submenu}
					<Collapsible.Content class="flex flex-col gap-2 mt-2">
						{#each item.submenu as submenu}
							<a
								href={submenu.link}
								class="{$page.url.pathname != submenu.link
									? 'text-gray-500'
									: 'text-white'} text-sm px-4">{submenu.name}</a
							>
						{/each}
					</Collapsible.Content>
				{/if}
			</Collapsible.Root>
		{/each}
	</div>
</div>
