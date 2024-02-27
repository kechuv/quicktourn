<script>
import { goto } from '$app/navigation';
import NewTournModal from './NewTournModal.svelte';
import { useTournStore } from '$lib/stores/tournStore.svelte';

const tournStore = useTournStore();
const tournList = $derived(Object.values(tournStore.tournList || {}));

/** @param {Event & { currentTarget: EventTarget & HTMLSelectElement }} e */
function goToTourn(e) {
  if (!e.currentTarget.value) return;
  goto(`/tournament/${e.currentTarget.value}`);
}
function handleRemove() {
  tournStore.deleteTourn(tournStore.lastTourn);
  const nextTourn = Object.values(tournStore.tournList || {})[0];
  if (!nextTourn) return goto('/');
  tournStore.setLastTourn(nextTourn.slug);
}
</script>

<div class="grid grid-flow-col items-center justify-between gap-2 px-2 py-1">
  <div class="font-bold">Quick Tournament</div>
  <div class="grid grid-flow-col gap-1 rounded">
    {#if tournList.length}
      <select
        onchange={goToTourn}
        value={tournStore.lastTourn}
      >
        {#each tournList as tourn}
          <option value={tourn.slug}>
            {tourn.slug}
          </option>
        {/each}
      </select>
      {#if tournStore.currentTourn}
        <button
          class="flex h-full w-full items-center justify-center rounded bg-stone-200 transition-colors hover:bg-red-500"
          onclick={() => handleRemove()}
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
      {/if}
    {/if}
  </div>
  <NewTournModal />
</div>
