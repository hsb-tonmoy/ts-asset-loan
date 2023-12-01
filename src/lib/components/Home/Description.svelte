<script lang="ts">
	export let user: any;
</script>

<div class="flex flex-col items-center justify-center px-10">
	<h4 class="text-white font-semibold">
		{user ? `${user.firstName},` : ''} Welcome to KPL's Equipment Request Form
	</h4>
	<span class="text-white/80">
		{#if user}
			You can request equipment by filling out the form on the right
		{:else}
			Login to your account to view and manage previous requests
		{/if}
	</span>
</div>
