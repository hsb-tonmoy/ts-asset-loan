<script lang="ts">
	import { Trash2, Pencil } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	export let row: any;
</script>

<div class="inline-flex items-center gap-2">
	<Button href="/admin/status/{row.id}" variant="outline" size="icon">
		<Pencil class="w-4 h-4" />
	</Button>
	<Button variant="outline" size="icon">
		<Trash2 class="w-4 h-4" />
	</Button>
</div>
