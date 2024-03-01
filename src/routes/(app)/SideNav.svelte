<script>
import { page } from '$app/stores';
import BracketIcon from '$lib/components/BracketIcon.svelte';
import CloseIcon from '$lib/components/CloseIcon.svelte';
import LeagueIcon from '$lib/components/LeagueIcon.svelte';
import { useTournStore } from '$lib/stores/tournStore.svelte';

/**
 * @type {{
 *  toggleMenu: (status: boolean) => void
 * }}
 */
let { toggleMenu } = $props();

const tournStore = useTournStore();
const tournList = $derived(Object.values(tournStore.tournList || {}));

/** @param {typeof tournList[0]} tourn */
function handleRemove(tourn) {
  tournStore.deleteTourn(tourn.slug);
}
</script>

<ol class="grid h-full gap-1 overflow-auto px-4 py-2">
  {#if tournList.length}
    {#each tournList as tourn}
      <li
        class="grid w-full grid-cols-[1fr_25px] items-center rounded transition-colors hover:bg-stone-200"
        class:bg-stone-300={$page.params.slug === tourn.slug}
      >
        <a
          class="grid grid-cols-[auto_1fr] items-center gap-1 pl-1"
          class:font-bold={$page.params.slug === tourn.slug}
          href={`/tournament/${tourn.slug}`}
          onclick={() => toggleMenu(false)}
          title={tourn.name}
          type="button"
        >
          <span class="block w-4 text-[1rem] leading-none">
            {#if tourn.format === 'singleBracket'}
              <BracketIcon />
            {/if}
            {#if tourn.format === 'roundRobin'}
              <LeagueIcon />
            {/if}
          </span>
          <span class="py-1">{tourn.name}</span>
        </a>
        <button
          class="flex h-full w-full items-center justify-center rounded-r transition-colors hover:bg-red-400"
          onclick={() => handleRemove(tourn)}
        >
          <CloseIcon />
        </button>
      </li>
    {/each}
  {/if}
</ol>
