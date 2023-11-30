<script lang="ts">
	import { Button, Hr, Html, Text } from 'svelte-email';

	export let fullName = 'World';
</script>

<Html lang="en">
	<Text>
		Hello, {fullName}!
	</Text>
	<Hr />
	<Button href="https://svelte.dev">Visit Svelte</Button>
</Html>
