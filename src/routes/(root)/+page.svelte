<script lang="ts">
	import { page } from '$app/stores';

	import type { PageData } from './$types';
	import RequestForm from '$lib/components/Home/RequestForm/Form.svelte';
	import LoginForm from '$lib/components/Home/LoginForm/Form.svelte';
	import Description from './../../lib/components/Home/Description.svelte';
	import SuccessPage from '$lib/components/Home/SuccessPage.svelte';
	import Menu from '$lib/components/Home/Menu.svelte';

	export let data: PageData;

	let success: boolean = false;
	let login: boolean = false;

	$: if ($page.url.searchParams.has('login')) {
		login = true;
	} else {
		login = false;
	}
</script>

<main
	class="flex justify-center items-center w-full h-full xl:h-screen bg-[#C1C5D7] dark:bg-[#09090B]"
>
	<div
		style="box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.3)"
		class="md:max-w-3xl lg:max-w-4xl xl:max-w-screen-2xl w-full p-0 flex flex-col xl:flex-row h-full xl:max-h-[45rem] rounded-3 border-0 bg-white dark:bg-[#18181B]"
	>
		<div id="menu" class="order-2 xl:order-1 flex flex-col items-center w-full xl:w-[10%] py-12">
			<Menu site_name={data.siteSettings.site_name} user={data.user} bind:login />
		</div>
		<div
			id="description"
			style="box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.3)"
			class="order-1 xl:order-2 flex flex-col justify-center items-center {success
				? 'w-full bg-green-700'
				: 'bg-[#3B82F6] dark:bg-[#2e5ba3] w-full xl:w-[40%]'} py-6 xl:py-0 xl:-my-6 transition-all duration-300 ease-in-out"
		>
			{#if success}
				<SuccessPage />
			{:else}
				<Description user={data.user} />
			{/if}
		</div>
		{#if !success}
			<div
				id="requestForm"
				class="order-3 flex flex-col items-center {login
					? 'justify-center'
					: ''} w-full xl:w-[50%] xl:overflow-auto px-10 py-10"
			>
				{#if login}
					<LoginForm />
				{:else}
					<RequestForm {data} bind:success />
				{/if}
			</div>
		{/if}
	</div>
</main>
