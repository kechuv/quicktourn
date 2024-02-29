<script>
import Match from './Match.svelte';

/**
 * @type {{
 *  rounds: import('$lib/schemas/tourns/tourn.schema').RoundSchema[],
 *  leaderboard: import('$lib/schemas/tourns/tourn.schema').LeaderboardSchema,
 *  updateTourn: (newRounds: typeof rounds) => void,
 *  updateLeaderboard: (newLeaderboard: typeof leaderboard) => void,
 * }}
 */
const { rounds, leaderboard, updateTourn, updateLeaderboard } = $props();
let selectedRound = $state(0);
// const currentRound = $derived(rounds[selectedRound]);
/** @type {'matches'|'leaderboard'} */
let view = $state('matches');
const board = $derived.by(() => {
  /** @type {[string, number][]} */
  const scores = Object.entries(leaderboard).map(([player, { w, d }]) => {
    return [player, (w * 3) + d];
  });
  return scores.toSorted((a, b) => b[1] - a[1]);
});

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
      if (sIdx !== slotIdx) return s;
      return slot;
    });
    updateRounds(newMatch);
    if (!slot?.player) return;
    const leaderboardClone = structuredClone(leaderboard);
    newMatch.forEach((slot) => {
      if (!slot) return;
      const player = slot.player;
      const newBoard = rounds
        .flat()
        .filter(m => m.some(slot => slot?.player === player) && !m.some(slot => slot?.isBye))
        .reduce((acc, m) => {
          if (m.every(s => !s?.winner)) return acc;
          if (m.every(s => s?.winner)) {
            acc.d = acc.d + 1;
            return acc;
          }
          const p1 = m.find(slot => slot?.player === player);
          if (p1?.winner) {
            acc.w = acc.w + 1;
            return acc;
          }
          acc.l = acc.l + 1;
          return acc;
        }, { w: 0,
          d: 0,
          l: 0 });
      leaderboardClone[player] = newBoard;
    });
    updateLeaderboard(leaderboardClone);
  }

  return {
    reportScore,
    reportWinner,
  };
}
</script>

{#snippet boardHeader()}
  <tr class="*:p-1">
    <th class="text-left">Player</th>
    <th>W</th>
    <th>D</th>
    <th>L</th>
  </tr>
{/snippet}
{#snippet boardRow([player, board])}
  <tr class="*:p-1 odd:bg-stone-200">
    <th class="text-left">{player}</th>
    <td class="w-8 text-center">{board.w}</td>
    <td class="w-8 text-center">{board.d}</td>
    <td class="w-8 text-center">{board.l}</td>
  </tr>
{/snippet}

{#snippet scoresHeader()}
  <tr class="*:p-1">
    <th class="text-left">Player</th>
    <th>Points</th>
  </tr>
{/snippet}
{#snippet scoresRow([player, score])}
  <tr class="*:p-1 odd:bg-stone-200">
    <th class="text-left">{player}</th>
    <td class="text-center">{score}</td>
  </tr>
{/snippet}

<div class="grid gap-8">
  <div class="sticky top-0 z-10 grid grid-flow-col bg-stone-50 pt-1">
    <button
      class="p-1 rounded-l {view === 'matches'
        ? 'bg-stone-300'
        : 'bg-stone-100'}"
      class:font-bold={view === 'matches'}
      onclick={() => view = 'matches'}
      type="button"
    >
      Matches
    </button>
    <button
      class="p-1 rounded-r {view === 'leaderboard'
        ? 'bg-stone-300'
        : 'bg-stone-100'}"
      class:font-bold={view === 'leaderboard'}
      onclick={() => view = 'leaderboard'}
      type="button"
    >
      Leaderboard
    </button>
  </div>

  {#if view === 'matches'}
    <div class="grid gap-8">
      {#each rounds as round, rIdx}
        <div class="grid gap-2">
          <h1 class="font-bold">Round {rIdx + 1}</h1>
          <div class="grid gap-1">
            {#each round as match, mIdx}
              <Match
                {match}
                matchIdx={mIdx}
                reportScore={reportMatch(rIdx, mIdx).reportScore}
                reportWinner={reportMatch(rIdx, mIdx).reportWinner}
                roundIdx={selectedRound}
              />
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if view === 'leaderboard'}
    <div class="grid gap-4">
      <div class="grid gap-4">
        <!-- <h1>Board</h1> -->
        <table class="border-separate border-spacing-y-0 rounded border border-stone-200">
          <thead>
            {@render boardHeader()}
          </thead>
          <tbody>
            {#each Object.entries(leaderboard) as board }
              {@render boardRow(board)}
            {/each}
          </tbody>
        </table>
      </div>

      <div class="grid gap-4">
        <!-- <h1>Leaderboard</h1> -->
        <table class="border-separate border-spacing-y-0 rounded border border-stone-200">
          <thead>
            {@render scoresHeader()}
          </thead>
          <tbody>
            {#each board as score}
              {@render scoresRow(score)}
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
