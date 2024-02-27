<script>
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { useTournStore } from '$lib/stores/tournStore.svelte';

const slug = $derived($page.params.slug);

const tournListStore = useTournStore();
const { getTourn, setLastTourn } = tournListStore;

$effect(() => {
  const tourn = getTourn(slug);
  setLastTourn(slug);
  if (!tourn) goto('/');
});
</script>

<slot />
