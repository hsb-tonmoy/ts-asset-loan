<script lang="ts">
	import { goto } from '$app/navigation';
	import { Gauge, User, HelpCircle, LogOut, Home } from 'lucide-svelte';

	export let site_name: string = '';
	export let user: any;
	export let login: boolean = false;
</script>

<div class="flex flex-col w-full">
	<div class="flex flex-col items-center w-full mb-6 xl:mb-20">
		<img src="/logo.svg" alt="KPL" class="w-14 md:w-20 xl:w-2/4" />
		<span class="font-semibold text-sm text-center text-[#b0b0b0] dark:text-white mt-2"
			>{site_name}</span
		>
	</div>
	<ul class="flex justify-center xl:justify-start xl:flex-col w-full gap-6 xl:gap-16">
		{#if !user && !login}
			<li
				class="flex justify-center shrink border-0 text-[#b0b0b0] hover:text-black hover:dark:text-white hover:border-l-[6px] border-amber-600 transition-all duration-150 ease-in-out"
			>
				<button
					on:click={() => goto('/?login=true')}
					class="inline-flex flex-col items-center gap-1"
				>
					<User />
					<span class="text-sm tracking-wide text-center">Login</span>
				</button>
			</li>
		{:else if login}
			<li
				class="flex justify-center shrink border-0 text-[#b0b0b0] hover:text-black hover:dark:text-white hover:border-l-[6px] border-amber-600 transition-all duration-150 ease-in-out"
			>
				<button
					on:click={() => {
						login = false;
						goto('/');
					}}
					class="inline-flex flex-col items-center gap-1"
				>
					<Home />
					<span class="text-sm tracking-wide text-center">Home</span>
				</button>
			</li>
		{/if}
		<li
			class="flex justify-center shrink border-0 text-[#b0b0b0] hover:text-black hover:dark:text-white hover:border-l-[6px] border-amber-600 transition-all duration-150 ease-in-out"
		>
			<a href="/admin" class="inline-flex flex-col items-center gap-1">
				<Gauge />
				<span class="text-sm tracking-wide text-center">Dashboard</span>
			</a>
		</li>
		<li
			class="flex justify-center shrink border-0 text-[#b0b0b0] hover:text-black hover:dark:text-white hover:border-l-[6px] border-amber-600 transition-all duration-150 ease-in-out"
		>
			<a href="/auth/login" class="inline-flex flex-col items-center gap-1">
				<HelpCircle />
				<span class="text-sm tracking-wide text-center">Help</span>
			</a>
		</li>
		{#if user}
			<li
				class="flex justify-center shrink border-0 text-[#b0b0b0] hover:text-black hover:dark:text-white hover:border-l-[6px] border-amber-600 transition-all duration-150 ease-in-out"
			>
				<a href="/auth/logout" class="inline-flex flex-col items-center gap-1">
					<LogOut />
					<span class="text-sm tracking-wide text-center">Logout</span>
				</a>
			</li>
		{/if}
	</ul>
</div>
