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
const currentRound = $derived(rounds[selectedRound]);
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
  <tr>
    <th>Player</th>
    <th>W</th>
    <th>D</th>
    <th>L</th>
  </tr>
{/snippet}
{#snippet boardRow([player, board])}
  <tr>
    <th>{player}</th>
    <td>{board.w}</td>
    <td>{board.d}</td>
    <td>{board.l}</td>
  </tr>
{/snippet}

{#snippet scoresHeader()}
  <tr>
    <th>Player</th>
    <th>Score</th>
  </tr>
{/snippet}
{#snippet scoresRow([player, score])}
  <tr>
    <th>{player}</th>
    <td>{score}</td>
  </tr>
{/snippet}

<div>
  <select bind:value={selectedRound}>
    <!-- eslint-disable-next-line no-unused-vars -->
    {#each rounds as _round, rIdx}
      <option value={rIdx}>
        Round {rIdx + 1}
      </option>
    {/each}
  </select>

  <div class="grid grid-flow-col items-start gap-8">
    <div class="grid gap-2">
      {#each currentRound as match, mIdx}
        <Match
          {match}
          matchIdx={mIdx}
          reportScore={reportMatch(selectedRound, mIdx).reportScore}
          reportWinner={reportMatch(selectedRound, mIdx).reportWinner}
          roundIdx={selectedRound}
        />
      {/each}
    </div>
    <div class="grid grid-flow-col">
      <div>
        <h1>Board</h1>
        <table>
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
      <div>
        <h1>Leaderboard</h1>
        <table>
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
  </div>
</div>
