<script>
import BottomNav from './BottomNav.svelte';
import LeftNav from './LeftNav.svelte';
import TopNav from './TopNav.svelte';

/** @type {number} */
let width = $state(0);
</script>

<svelte:window bind:innerWidth={width} />
<div class="grid min-h-[100svh] grid-rows-[1fr_auto] lg:grid-cols-[200px_1fr] lg:grid-rows-1">
  {#if width > 1023}
    <aside class="hidden h-full content-start gap-2 bg-stone-100 lg:grid">
      <TopNav />
      <LeftNav />
    </aside>
  {/if}
  <main class="">
    <slot />
  </main>
  {#if width <= 1023}
    <footer class="sticky bottom-0 bg-stone-100 lg:hidden">
      <BottomNav />
    </footer>
  {/if}
</div>
