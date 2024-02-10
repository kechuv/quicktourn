<script>
import { useParticipantStore } from '$lib/stores/participantStore.svelte';
import { useRoundStore } from '$lib/stores/roundStore.svelte';
import Participants from './Participants.svelte';

const participantStore = useParticipantStore();
const { register, unregister } = participantStore;
const roundStore = useRoundStore();
const { createRounds } = roundStore;

/** @param {typeof participantStore.participants[0]} participant */
function handleRegister(participant) {
  register(participant);
  createRounds();
}

/** @param {typeof participantStore.participants[0]} participant */
function handleUnregister(participant) {
  unregister(participant);
  createRounds();
}
</script>

<div>
  {#if participantStore.participants}
    <Participants
      participants={participantStore.participants}
      register={handleRegister}
      unregister={handleUnregister}
    />
  {/if}
</div>
