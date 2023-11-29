<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	export let info: any;

	const requestedAssets = JSON.parse(JSON.parse(info.getValue()));

	let tooltipText = '';

	for (const [key, value] of Object.entries(requestedAssets)) {
		tooltipText += `${value} ${key} <br />`;
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<span class="decoration-dotted underline underline-offset-4"
			>{Object.keys(requestedAssets).join(', ')}</span
		>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<div>{@html tooltipText}</div>
	</Tooltip.Content>
</Tooltip.Root>
