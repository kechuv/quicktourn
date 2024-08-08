<script>
import { createSlot } from '$lib/schemas/tourns/match.schema';
import Match from './Match.svelte';

/**
 * @type {{
 *  rounds: import('$lib/schemas/tourns/tourn.schema').RoundSchema[]
 *  updateTourn: (newRounds: typeof rounds) => void
 * }}
 */
const { rounds, updateTourn } = $props();

/**
 * @param {number} roundIdx
 * @param {number} matchIdx
 */
function reportMatch(roundIdx, matchIdx) {
  /** @param {typeof rounds[0][0]} match */
  function updateRounds(match) {
    const copyRounds = structuredClone(rounds);
    copyRounds[roundIdx][matchIdx] = match;
    updateTourn(copyRounds);
  }
  /**
   * @param {number} slotIdx
   * @param {typeof rounds[0][0][0]} slot
   */
  function reportScore(slotIdx, slot) {
    const currentMatch = rounds[roundIdx][matchIdx];
    const newMatch = currentMatch.map((s, sIdx) => {
      if (sIdx !== slotIdx) return s;
      return slot;
    });
    updateRounds(newMatch);
  }
  /**
   * @param {number} slotIdx
   * @param {typeof rounds[0][0][0]} slot
   */
  function reportWinner(slotIdx, slot) {
    const currentMatch = rounds[roundIdx][matchIdx];
    const newMatch = currentMatch.map((s, sIdx) => {
      if (sIdx === slotIdx) return slot;
      if (!s) return null;
      return {
        ...s,
        winner: false,
      // score: currentMatch.some(s => !s)
        //   ? null
        //   : s.score,
      };
    });
    updateRounds(newMatch);
    if (!rounds[roundIdx + 1]) return;
    const nextMatch = Math.floor(matchIdx / 2);
    const nextSlot = matchIdx % 2;
    const reportNextMatch = reportMatch(roundIdx + 1, nextMatch).reportWinner;
    reportNextMatch(nextSlot, slot?.winner
      ? createSlot({ player: slot?.player })
      : null);
  }
  return {
    reportScore,
    reportWinner,
  };
}
</script>

<div class="grid grid-flow-col gap-8">
  {#each rounds as round, rIdx}
    <ol class="grid gap-2">
      {#each round as match, mIdx}
        <li class="relative grid items-center">
          {#if rIdx > 0}
            <div class="absolute right-[calc(100%_+_1rem)] -z-10 h-[calc(50%_+_0.4rem)] w-4 rounded-r border-y-2 border-r-2 border-stone-300 before:content-[''] after:absolute after:left-full after:top-1/2 after:w-5 after:-translate-y-1/2 after:border-t-2 after:border-stone-300">
            </div>
          {/if}
          <div class="">
            <Match
              match={match}
              matchIdx={mIdx}
              reportScore={reportMatch(rIdx, mIdx).reportScore}
              reportWinner={reportMatch(rIdx, mIdx).reportWinner}
              roundIdx={rIdx}
            />
          </div>
        </li>
      {/each}
    </ol>
  {/each}
</div>
