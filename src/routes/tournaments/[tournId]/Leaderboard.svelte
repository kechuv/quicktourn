<script lang="ts">
  import type { ParticipantResults } from '$lib/schemas/leaderboard';

  const points = {
    w: 3,
    d: 1,
    l: 0,
  };

  type Props = {
    scores: ParticipantResults[];
  };
  let { scores }: Props = $props();
  let results = $derived(
    scores
      .map((r) => ({
        ...r,
        points: r.w * points.w + r.d * points.d + r.l * points.l,
      }))
      .toSorted((a, b) => a.l - b.l)
      .toSorted((a, b) => b.d - a.d)
      .toSorted((a, b) => b.w - a.w)
      .toSorted((a, b) => b.points - a.points),
  );
</script>

<table class="table table-zebra">
  <thead>
    <tr>
      <th>Player</th>
      <th>W</th>
      <th>D</th>
      <th>L</th>
      <th>Points</th>
    </tr>
  </thead>
  <tbody>
    {#each results as result (result.participant)}
      <tr>
        <th>{result.participant}</th>
        <td>{result.w}</td>
        <td>{result.d}</td>
        <td>{result.l}</td>
        <td>{result.points}</td>
      </tr>
    {/each}
  </tbody>
</table>
