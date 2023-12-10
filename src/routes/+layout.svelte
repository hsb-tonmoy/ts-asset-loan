<script>
	import '../app.postcss';
	import { Toasts } from 'svoast';
	import { ModeWatcher } from 'mode-watcher';
	import Loading from '$lib/Loading.svelte';
</script>

<svelte:head>
	<title>KPL Asset Management</title>
</svelte:head>
<Loading />
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
