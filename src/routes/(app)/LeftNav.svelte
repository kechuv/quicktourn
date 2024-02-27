<script>
import { page } from '$app/stores';
import { useTournStore } from '$lib/stores/tournStore.svelte';

const tournStore = useTournStore();
const tournList = $derived(Object.values(tournStore.tournList || {}));

/** @param {typeof tournList[0]} tourn */
function handleRemove(tourn) {
  tournStore.deleteTourn(tourn.slug);
}
</script>

<ol class="grid gap-1 p-2">
  {#if tournList.length}
    {#each tournList as tourn}
      <li
        class="grid w-full grid-cols-[1fr_25px] items-center rounded transition-colors hover:bg-stone-200"
        class:bg-stone-300={$page.params.slug === tourn.slug}
      >
        <a
          class="p-[2px] pl-1"
          class:font-bold={$page.params.slug === tourn.slug}
          href={`/tournament/${tourn.slug}`}
          title={tourn.name}
          type="button"
        >
          {tourn.name}
        </a>
        <button
          class="flex h-full w-full items-center justify-center rounded-r transition-colors hover:bg-red-500"
          onclick={() => handleRemove(tourn)}
        >
          <svg
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12L7 7m5 5l5 5m-5-5l5-5m-5 5l-5 5"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>
      </li>
    {/each}
  {/if}
</ol>
