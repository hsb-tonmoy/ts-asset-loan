<script lang="ts">
	import WelcomeCard from '$lib/components/Admin/HomeCards/WelcomeCard.svelte';
	import type { LayoutData } from '../$types';

	export let data: LayoutData;
</script>

<WelcomeCard name={data.user?.firstName} />
