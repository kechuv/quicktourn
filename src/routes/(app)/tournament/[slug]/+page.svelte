<script>
import { useTournStore } from '$lib/stores/tournStore.svelte';
import Bracket from './Bracket.svelte';
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

/** @param {import('$lib/schemas/tourns/tourn.schema').RoundSchema[]} newRounds */
function updateTourn(newRounds) {
  tournStore.updateTourn({
    ...tourn,
    rounds: newRounds,
  });
}
</script>

<div class="grid grid-cols-[auto_1fr] gap-8">
  <div class="p-2">
    {#if tourn?.participants}
      <Participants
        participants={tourn.participants}
        register={handleRegister}
        unregister={handleUnregister}
      />
    {/if}
  </div>
  <div class="p-2">
    {#if tourn?.format === 'singleBracket'}
      <Bracket
        rounds={tourn.rounds}
        {updateTourn}
      />
    {/if}
  </div>
</div>
