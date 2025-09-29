<script lang="ts">
  import type { Match as MatchSchema } from '$lib/schemas/match';
  import { groupBy } from '$lib/utils/groupBy';
  import type { Snippet } from 'svelte';

  type Props = {
    matches: MatchSchema[];
    children: Snippet<[MatchSchema]>;
  };
  const { matches, children }: Props = $props();
  let rounds = $derived(groupBy(matches, (match) => match.roundIdx));
</script>

<div class="grid grid-flow-row gap-8">
  {#each Object.values(rounds) as round, rIdx (rIdx)}
    <ol class="grid gap-2">
      <h1 class="font-bold">Round {rIdx + 1}</h1>
      {#each round as match, mIdx (mIdx)}
        <li class="grid items-center">
          <div>
            {@render children(match)}
          </div>
        </li>
      {/each}
    </ol>
  {:else}
    <div class="text-center">No Participants.</div>
  {/each}
</div>
