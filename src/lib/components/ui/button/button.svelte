<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { Loader2 } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { buttonVariants, type Props, type Events } from '.';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let loading: boolean = false;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
	disabled={loading}
>
	{#if loading}
		<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		Please wait
	{:else}
		<slot />
	{/if}
</ButtonPrimitive.Root>
