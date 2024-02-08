<script>
// import { createMatchScore } from '$lib/schemas/tourns/match.schema';
import { useTournStore } from '$lib/stores/tournStore.svelte';
// import { adjacent, rotateClockwise } from './sortStrategies';

const tournStore = useTournStore();
let tourn = $derived(tournStore.lastTourn);

// function createFormat() {
//   if (!tourn) return;
//   if (tourn.participants.length < 2) return;
//   const length = tourn?.participants.length;
//   const slotsLength = length % 2 === 0
//     ? length
//     : length + 1;
//   const roundsLength = slotsLength - 1;
//   const slots = adjacent(slotsLength).map(slotIdx => createMatchScore(tourn?.participants[slotIdx]));
//   const rotation = rotateClockwise(slotsLength);
//   /** @type {typeof slots[]} */
//   const rounds = new Array(roundsLength).fill(null)
//     .reduce((acc, r, roundIdx) => {
//       if (!roundIdx) return acc;
//       const rotated = rotation.map(idx => acc[roundIdx - 1][idx]);
//       acc[roundIdx] = rotated;
//       return acc;
//     }, ([slots]));
//   return rounds;
// }
// let matches = $derived.call(createFormat);
// $effect(createFormat);
// $inspect(matches);

let participant = $state('');

/** @param {Event & { currentTarget: EventTarget & HTMLFormElement}} event */
function addParticipant(event) {
  event.preventDefault();
  if (!participant) return;
  if (tourn?.participants.includes(participant)) return;
  tourn?.participants.push(participant);
  participant = '';
}

/**
 *
 * @param {typeof tourn['participants'][0]} participant
 */
function removeParticipant(participant) {
  tourn.participants = tourn?.participants.filter(p => p !== participant);
}
</script>

<div>
  <h1>Add participant:</h1>
  <form onsubmit={addParticipant}>
    <input
      type="text"
      bind:value={participant} />
    <button type="submit">Add</button>
  </form>

  {#if tourn}
    {#each tourn.participants as participant}
      <ol>
        <li>
          <span>{ participant }</span>
          <button
            onclick={() => removeParticipant(participant)}
            type="button"
          >
            X
          </button>
        </li>
      </ol>
    {/each}
  {/if}
</div>

<ol />
