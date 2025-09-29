<script lang="ts">
  import type { Participant } from '$lib/schemas/tourn';

  type Props = {
    participantsList: Participant[];
    onParticipantsUpdated: (list: Participant[]) => void;
  };
  let { participantsList, onParticipantsUpdated }: Props = $props();

  const addParticipant = (name: string) => {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const participants = new Set(participantsList);
    participants.add(name);
    const pArray = Array.from(participants);
    participantsList = pArray;
    onParticipantsUpdated(pArray);
  };
  const removeParticipant = (name: string) => {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const participants = new Set(participantsList);
    participants.delete(name);
    const pArray = Array.from(participants);
    participantsList = pArray;
    onParticipantsUpdated(pArray);
  };
</script>

<div class="grid h-full w-full grid-rows-[auto_1fr] gap-2">
  <form
    class="bg-base-100 p-1"
    onsubmit={(e) => {
      e.preventDefault();
      addParticipant(e.currentTarget.participant.value);
      e.currentTarget.reset();
    }}
  >
    <fieldset class="fieldset">
      <label
        class="fieldset-label"
        for="participant">Add Participant:</label
      >
      <div class="join-horizontal join">
        <input
          id="participant"
          name="participant"
          class="input join-item"
          type="text"
        />
        <button
          class="btn join-item"
          type="submit"
        >
          Add
        </button>
      </div>
    </fieldset>
  </form>

  <div class="w-full overflow-auto">
    <ul class="grid w-full gap-1">
      {#each participantsList as participant (participant)}
        <li class="join grid grid-cols-[1fr_auto]">
          <div
            class="join-item flex items-center overflow-hidden border-2 border-base-300 px-1"
          >
            <span
              class="w-full overflow-hidden text-ellipsis whitespace-nowrap"
              title={participant}>{participant}</span
            >
          </div>
          <button
            class="btn join-item leading-tight btn-sm hover:btn-error"
            onclick={() => removeParticipant(participant)}
            type="button"
          >
            ✕
          </button>
        </li>
      {:else}
        <li class="text-center">No participants.</li>
      {/each}
    </ul>
  </div>
</div>
