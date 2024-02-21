<script>
import { useTournStore } from '$lib/stores/tournStore.svelte';
import Participants from './Participants.svelte';
import { formatFactory } from './formatFactory';

const tournStore = useTournStore();

const tourn = $derived(tournStore.currentTourn);
const createRounds = $derived(formatFactory(tourn?.format));

/** @param {typeof tourn.participants[0]} participant */
function handleRegister(participant) {
  if (!participant) return;
  const updated = [...tourn.participants, participant];
  const rounds = createRounds(updated);
  tournStore.updateTourn({
    ...tourn,
    participants: updated,
    rounds,
  });
}
/** @param {typeof tourn.participants[0]} participant */
function handleUnregister(participant) {
  if (!tourn.participants.includes(participant)) return;
  const updated = tourn.participants.filter(p => p !== participant);
  const rounds = createRounds(updated);
  tournStore.updateTourn({
    ...tourn,
    participants: updated,
    rounds,
  });
}
</script>

<div>
  {#if tourn?.participants}
    <Participants
      participants={tourn.participants}
      register={handleRegister}
      unregister={handleUnregister}
    />
  {/if}
</div>
