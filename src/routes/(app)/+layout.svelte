<script>
import LeftNav from './LeftNav.svelte';
import TopNav from './TopNav.svelte';
</script>

<div class="grid min-h-[100svh] grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
  <header class="col-span-full col-start-1 row-start-1">
    <TopNav />
  </header>
  <aside>
    <LeftNav />
  </aside>
  <main>
    <slot />
  </main>
</div>
