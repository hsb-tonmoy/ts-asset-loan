<script lang="ts">
	import { slide } from 'svelte/transition';
	import { backIn, backOut } from 'svelte/easing';
	import { enhance } from '$app/forms';
	import { MoveRight } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';

	let email: string = '';
	let password: string = '';

	let sso: boolean = false;

	$: if (email.endsWith('@kpl.gov')) {
		sso = true;
	} else {
		sso = false;
	}

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		if (sso) goto('/auth/login/redirect');
	};
</script>

<form method="post" use:enhance class="flex flex-col gap-6 w-full">
	<p class="text-sm">Enter your KPL email to login automatically.</p>
	<div class="flex flex-col gap-2">
		<Label for="email">Email</Label>
		<Input type="email" name="email" id="email" autocomplete="off" bind:value={email} />
	</div>
	{#if !sso}
		<div
			class="flex flex-col gap-2"
			in:slide={{ delay: 100, duration: 300, axis: 'y', easing: backIn }}
			out:slide={{ delay: 100, duration: 300, axis: 'y', easing: backOut }}
		>
			<Label for="password">Password</Label>
			<Input type="password" name="password" id="password" bind:value={password} />
		</div>
	{/if}
	<Button type="button" class="inline-flex items-center gap-1" on:click={handleSubmit}
		>Log in {#if sso}
			<span
				class=""
				in:slide={{ duration: 300, axis: 'x', easing: backIn }}
				out:slide={{ duration: 300, axis: 'x', easing: backOut }}
			>
				<MoveRight />
			</span>
		{/if}
	</Button>
</form>
