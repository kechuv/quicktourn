<script>
import { fly } from 'svelte/transition';

// import BottomNav from './BottomNav.svelte';
import SideNav from './SideNav.svelte';
import NewTournModal from './NewTournModal.svelte';
import CloseIcon from '$lib/components/CloseIcon.svelte';
import MenuIcon from '$lib/components/MenuIcon.svelte';

let { children } = $props();

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
<div class="grid h-dvh grid-rows-[1fr_60px]">
  {#if showMenu}
    <aside
      class="fixed top-0 z-20 grid h-[calc(100%_-_60px)] w-full content-end bg-stone-100 lg:w-[300px]"
      transition:fly={{
        x: '-100%',
        duration: 300,
        opacity: 1,
      }}
    >
      <SideNav {toggleMenu} />
    </aside>
  {/if}
  {@render children()}
  <footer class="grid h-full grid-cols-[auto_1fr_auto] items-center justify-between justify-items-center bg-stone-100 px-4">
    <button
      class="flex aspect-square w-[40px] items-center justify-center justify-self-start rounded bg-stone-200 p-2 hover:bg-stone-300"
      onclick={() => toggleMenu()}
      type="button"
    >
      {#if showMenu}
        <CloseIcon />
      {:else}
        <MenuIcon />
      {/if}
    </button>
    <h1 class="font-bold">Quick tournament</h1>
    <div class="justify-self-end">
      <NewTournModal />
    </div>
  </footer>
</div>
