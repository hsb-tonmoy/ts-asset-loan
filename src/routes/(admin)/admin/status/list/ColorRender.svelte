<script lang="ts">
	export let color: string;
	export let name: string;
</script>

<div class="flex items-center gap-2">
	<span class="w-4 h-4" style="background-color: {color}" />
	<span>{name}</span>
</div>
