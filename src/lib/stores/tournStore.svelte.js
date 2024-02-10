import { useTournListStore } from './tournListStore.svelte';

export function useTournStore() {
  let tournListStore = useTournListStore();
  let tourn = $derived(tournListStore.currentTourn);

  /** @param {Partial<typeof tourn>} tournData */
  function updateTourn(tournData) {
    tournListStore.updateTourn({
      ...tourn,
      ...tournData,
    });
  }

  return {
    get tourn() {
      return tourn;
    },
    updateTourn,
  };
}
