<script>
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { useTournStore } from '$lib/stores/tournStore.svelte';

const slug = $derived($page.params.slug);

const tournStore = useTournStore();
const { getTourn, setLastTourn } = tournStore;

$effect(() => {
  const tourn = getTourn(slug);
  setLastTourn(slug);
  if (!tourn) goto('/');
});
</script>

<div class="grid gap-8">
  <h1>{tournStore.lastTourn?.name}</h1>
  <div>
    <slot />
  </div>
</div>
