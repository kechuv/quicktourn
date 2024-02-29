<script>
import { fly } from 'svelte/transition';

// import BottomNav from './BottomNav.svelte';
import LeftNav from './LeftNav.svelte';
import NewTournModal from './NewTournModal.svelte';

/** @type {number} */
let width = $state(0);
let showMenu = $state(false);

/** @param {boolean} [status] */
function toggleMenu(status) {
  if (!status) return showMenu = !showMenu;
  showMenu = status;
}
</script>

<svelte:window bind:innerWidth={width} />
<div class="grid h-[100svh] grid-rows-[1fr_60px]">
  {#if showMenu}
    <aside
      class="fixed top-0 z-20 grid h-[calc(100%_-_60px)] w-full content-end bg-stone-100 shadow-md lg:w-[300px]"
      transition:fly={{
        x: '-100%',
        duration: 300,
        opacity: 1,
      }}
    >
      <LeftNav {toggleMenu} />
    </aside>
  {/if}
  <slot />
  <footer class="grid h-full grid-flow-col items-center justify-between bg-stone-100 px-4">
    <button
      onclick={() => toggleMenu()}
      type="button"
    >
      {#if !showMenu}
        <svg
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 17h14M5 12h14M5 7h14"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      {:else}
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
      {/if}
    </button>
    <NewTournModal />
    <h1 class="font-bold">Quick tournament</h1>
  </footer>
</div>
