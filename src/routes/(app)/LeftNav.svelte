<script>
import { goto } from '$app/navigation';
import { useTournStore } from '$lib/stores/tournStore.svelte';

const tournStore = useTournStore();
const tournList = $derived(Object.values(tournStore.tournList || {}));

/**
 * @param {string} slug
 */
function gotoTourn(slug) {
  goto(`/tournament/${slug}`);
}
</script>

<ol class="grid gap-2 p-2">
  {#if tournList.length}
    {#each tournList as tourn, tournIdx}
      <li>
        <button
          class="p-2"
          onclick={() => gotoTourn(tourn.slug)}
          title={tourn.name}
          type="button"
        >
          {tournIdx}
        </button>
      </li>
    {/each}
  {/if}
</ol>
