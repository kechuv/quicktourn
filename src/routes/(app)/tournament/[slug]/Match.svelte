<script>
/**
 * @type {{
 *  match: import("$lib/schemas/tourns/tourn.schema").MatchSchema
 *  roundIdx: number,
 *  matchIdx: number
 *  reportWinner?: (slotIdx: number, slot: import('$lib/schemas/tourns/match.schema').Slot) => void
 *  reportScore?: (slotIdx: number, slot: import('$lib/schemas/tourns/match.schema').Slot) => void
 * }}
 */
let { match, roundIdx, matchIdx, reportWinner, reportScore } = $props();

/**
 * @param {number} slotIdx
 * @param {Event & { currentTarget: EventTarget & HTMLInputElement }} e
 */
function setScore(slotIdx, e) {
  const slot = match[slotIdx];
  if (!slot) return;
  const val = e.currentTarget.valueAsNumber;
  if (reportScore) reportScore(slotIdx, {
    ...slot,
    score: isNaN(val)
      ? null
      : val,
  });
}
/** @param {number} slotIdx */
function setWinner(slotIdx) {
  const slot = match[slotIdx];
  if (!slot) return;
  if (reportWinner) reportWinner(slotIdx, {
    ...slot,
    winner: !slot.winner,
  });
}
</script>

{#snippet slotView(slotData, slotIdx)}
  <div class="grid grid-cols-[1fr_auto] items-center">
    <div class="p-1">{slotData?.player}</div>
    <div class="grid h-full grid-cols-[3rem_auto]">
      <input
        id={`${roundIdx}.${matchIdx}.${slotIdx}`}
        name={`${roundIdx}.${matchIdx}.${slotIdx}`}
        class="h-full w-full bg-stone-300 text-center text-[.8rem] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        oninput={e => setScore(slotIdx, e)}
        type="number"
        value={slotData?.score ?? null}
      />
      <button
        class="rounded-r p-1"
        class:bg-amber-400={match.every(s => s?.winner)}
        class:bg-lime-400={slotData?.winner}
        class:bg-stone-200={!slotData?.winner}
        class:text-stone-400={!slotData?.winner}
        class:text-stone-700={slotData?.winner}
        onclick={() => setWinner(slotIdx)}
        type="button"
      >
        {#if match.every(slot => slot?.winner)}
          <span>Draw</span>
        {:else}
          <span>Win</span>
        {/if}
      </button>
    </div>
  </div>
{/snippet}

<fieldset
  class="divide-y-2 divide-stone-300 rounded bg-stone-200"
  class:opacity-40={match?.some(s => !s || s?.isBye)}
  disabled={match?.some(s => !s || s?.isBye)}
>
  {#each match as slot, slotIdx}
    {@render slotView(slot, slotIdx)}
  {/each}
</fieldset>
