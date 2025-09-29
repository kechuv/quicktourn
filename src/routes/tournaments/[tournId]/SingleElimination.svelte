<script lang="ts">
  import type { Match as MatchSchema } from '$lib/schemas/match';
  import { groupBy } from '$lib/utils/groupBy';
  import type { Snippet } from 'svelte';

  type Props = {
    matches: MatchSchema[];
    children: Snippet<[MatchSchema, number]>;
  };
  const { matches, children }: Props = $props();
  const ordered = $derived.by(() =>
    matches
      .toSorted((a, b) => a.matchIdx - b.matchIdx)
      .toSorted((a, b) => b.roundIdx - a.roundIdx),
  );
  let rounds = $derived(
    Object.values(groupBy(ordered, (match) => match.roundIdx)),
  );
</script>

<div class="carousel w-full carousel-center gap-8 px-4">
  {#each rounds as round, rIdx (rIdx)}
    <div class={['grid grid-rows-[auto_1fr] gap-2']}>
      <h2 class="badge justify-self-center">
        {#if rIdx === rounds.length - 1}
          Final
        {:else if rIdx === rounds.length - 2}
          Semi-Final
        {:else}
          Round {rIdx + 1}
        {/if}
      </h2>
      <ol class="carousel-item grid scroll-ml-8 gap-2">
        {#each round as match, mIdx (mIdx)}
          <li class={['relative grid items-center']}>
            {#if rIdx > 0}
              <div
                class="absolute right-[calc(100%_+_1rem)] -z-10 h-[calc(50%_+_0.4rem)] w-4 rounded-r border-y-2 border-r-2 border-stone-300 before:content-[''] after:absolute after:top-1/2 after:left-full after:w-5 after:-translate-y-1/2 after:border-t-2 after:border-stone-300"
              ></div>
            {/if}
            <!-- <div class="w-[calc(100dvw-3.5rem)]"> -->
            <div class="w-[300px]">
              {@render children(match, rounds.length)}
            </div>
          </li>
        {/each}
      </ol>
    </div>
  {:else}
    <div class="text-center w-full">Not enough participants.</div>
  {/each}
</div>
