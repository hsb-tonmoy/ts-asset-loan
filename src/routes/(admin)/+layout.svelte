<script lang="ts">
	import Header from '$lib/components/Admin/Header/Header.svelte';
	import SidebarMenu from '$lib/components/Admin/SidebarMenu.svelte';

	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="antialiased flex w-full h-screen max-h-full bg-[#F5F7F9] dark:bg-[#101014]">
	<aside
		class="fixed top-0 left-0 flex shrink-0 max-w-[200px] min-h-screen h-full bg-[#001428] dark:bg-[#18181C] py-4 px-6 z-20"
		style="box-shadow: 2px 0 8px #1d23290d;"
	>
		<SidebarMenu site_name={data.siteSettings.site_name ?? ''} />
	</aside>
	<header
		class="fixed top-0 left-0 w-full h-16 bg-white dark:bg-[#18181C] z-10"
		style="box-shadow: 0 1px 4px #00152914;"
	>
		<Header />
	</header>
	<main class="relative ml-[200px] mt-16 p-4 w-full">
		<slot />
	</main>
</div>
