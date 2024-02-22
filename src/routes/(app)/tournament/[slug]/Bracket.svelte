<script>
/**
 * @type {{
 *  rounds: import('$lib/schemas/tourns/match.schema').Round[]
 * }}
 */
const { rounds } = $props();
/**
 * @param {Event & { currentTarget: EventTarget & HTMLInputElement }} e
 * @param {{
 *  round: number,
 *  match: number,
 *  slot: number
 * }} refs
 */
function setScore(e, refs) {
  const val = e.currentTarget.valueAsNumber;
  val;
  // console.log(val);
  refs;
}
</script>

{#snippet slotView(slotData, refs)}
  <div class="grid min-h-6 grid-cols-[1fr_auto] items-center">
    <div class="p-1">{slotData?.player}</div>
    <div class="h-full w-12 rounded-r bg-stone-300 p-1 text-center">
      <input
        class="h-full w-full bg-stone-300 text-center text-[.8rem] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        oninput={e => setScore(e, refs)}
        type="number"
      />
    </div>
  </div>
{/snippet}

<div class="grid grid-flow-col gap-8">
  {#each rounds as round, rIdx}
    <ol class="grid gap-2">
      {#each round as match, mIdx}
        <li class="relative grid items-center">
          {#if rIdx > 0}
            <div class="absolute right-[calc(100%_+_1rem)] -z-10 h-[calc(50%_+_0.5rem)] w-8 rounded border-y-2 border-r-2 border-stone-300 before:content-[''] after:absolute after:left-full after:top-1/2 after:w-5 after:-translate-y-1/2 after:border-t-2 after:border-stone-300" />
          {/if}
          <div class="divide-y-2 divide-stone-300 rounded bg-stone-200">
            {#each match as slot, sIdx}
              {@render slotView(slot, {round: rIdx, match: mIdx, slot: sIdx})}
            {/each}
          </div>
        </li>
      {/each}
    </ol>
  {/each}
</div>
