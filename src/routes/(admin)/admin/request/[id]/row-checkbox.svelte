<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	export let checked,
		indeterminate,
		onChange,
		disabled = false;
</script>

<Input
	type="checkbox"
	on:change={onChange}
	{checked}
	{disabled}
	bind:indeterminate
	class="w-4 h-4"
/>
