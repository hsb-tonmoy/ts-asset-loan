<script>
	import { Toasts } from 'svoast';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.postcss';
</script>

<svelte:head>
	<title>KPL Asset Management</title>
</svelte:head>

<Toasts position="top-center" />
<ModeWatcher />
<slot />

<style lang="postcss">
	:root {
		--svoast-bg: #333;
		--svoast-text: #fff;
		--svoast-padding: 20px 18px 20px 22px;
		--svoast-font-size: 16px;
		--svoast-icon-padding: 4px 2px;
	}
</style>
