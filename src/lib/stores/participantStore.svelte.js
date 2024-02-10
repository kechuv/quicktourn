import { useTournStore } from './tournStore.svelte';

export function useParticipantStore() {
  const tournStore = useTournStore();
  const participants = $derived(tournStore.tourn?.participants);

  /** @param {typeof participants[0]} participant */
  function register(participant) {
    if (participants.includes(participant)) return;
    tournStore.updateTourn({
      participants: [...participants, participant],
    });
  }

  /** @param {typeof participants[0]} participant */
  function unregister(participant) {
    if (!participants.includes(participant)) return;
    tournStore.updateTourn({
      participants: participants.filter(p => p !== participant),
    });
  }

  function clear() {
    tournStore.updateTourn({
      participants: [],
    });
  }

  return {
    get participants() {
      return participants;
    },
    register,
    unregister,
    clear,
  };
}
