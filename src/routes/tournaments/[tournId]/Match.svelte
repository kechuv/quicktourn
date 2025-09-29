<script lang="ts">
  import type { Match } from '$lib/schemas/match';

  type Props = {
    match: Match;
    onScoreUpdated: (match: Match) => void;
    onWinnerUpdated: (match: Match) => void;
  };
  let { match, onScoreUpdated, onWinnerUpdated }: Props = $props();

  let slots = $derived(match.slots);

  const hasBye = $derived(slots.some((slot) => slot.isBye));
  const hasSlotsAssigned = $derived(slots.every((slot) => slot.player));
  const isDraw = $derived(slots.filter((slot) => slot.isWinner).length >= 2);
</script>

<fieldset
  class="w-full"
  disabled={hasBye || !hasSlotsAssigned}
>
  {#each slots as slot, sIdx (sIdx)}
    <div
      class="grid w-full max-w-full grid-flow-col grid-cols-[50px_1fr_70px_auto]"
    >
      <div class="bg-base-200 p-1 text-center">
        <small>{slot.seed || ''}</small>
      </div>
      <div
        class="w-full overflow-hidden bg-base-300 p-1 overflow-ellipsis"
        title={slot.player}
      >
        {#if slot.isBye}
          BYE
        {:else}
          {slot.player}
        {/if}
      </div>
      <input
        class="input input-sm w-[70px] rounded-none p-1"
        disabled={hasBye}
        oninput={(e) => {
          const newVal = e.currentTarget.valueAsNumber;
          onScoreUpdated({
            ...match,
            slots: slots.map((slot, slotIdx) =>
              slotIdx !== sIdx ? slot : { ...slot, score: newVal },
            ),
          });
        }}
        type="number"
        value={slot.score}
      />
      <input
        name="winner"
        class={[
          'btn w-14 rounded-l-none btn-sm',
          sIdx % 2 ? 'rounded-tr-none' : 'rounded-br-none',
          isDraw
            ? 'checked:[--btn-color:var(--color-yellow-400)]'
            : 'checked:[--btn-color:var(--color-lime-400)]',
        ]}
        aria-label={isDraw ? 'Draw' : 'Winner'}
        checked={slot.isWinner}
        onchange={(e) => {
          const newVal = e.currentTarget.checked;
          onWinnerUpdated({
            ...match,
            slots: slots.map((slot, slotIdx) =>
              slotIdx !== sIdx ? slot : { ...slot, isWinner: newVal },
            ),
          });
        }}
        type="checkbox"
      />
    </div>
  {/each}
</fieldset>
