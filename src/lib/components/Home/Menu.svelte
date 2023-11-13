<script lang="ts">
	import { ActivitySquare } from 'lucide-svelte';

	const menuItems = [
		{
			name: 'Login',
			icon: 'material-symbols:person',
			link: '/auth/login'
		},
		{
			name: 'Dashboard',
			icon: 'IconsDashboard',
			link: '/admin'
		},
		{
			name: 'Help',
			icon: 'material-symbols:support',
			link: '/auth/login'
		}
	];
</script>

<div class="flex flex-col w-full">
	<div class="flex flex-col items-center w-full mb-6 xl:mb-20">
		<img src="/logo.svg" alt="KPL" class="w-14 md:w-20 xl:w-2/4" />
		<span class="font-semibold text-sm text-center text-[#b0b0b0] dark:text-white mt-2"
			>Kalamazoo Public Library</span
		>
	</div>
	<ul class="flex justify-center xl:justify-start xl:flex-col w-full gap-6 xl:gap-16">
		{#each menuItems as menuItem}
			<li
				class="flex justify-center shrink border-0 text-[#b0b0b0] hover:text-black hover:dark:text-white hover:border-l-[6px] border-amber-600 transition-all duration-150 ease-in-out"
			>
				<a href={menuItem.link} class="inline-flex flex-col items-center gap-1">
					<ActivitySquare />
					<span class="text-sm tracking-wide text-center">{menuItem.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>
