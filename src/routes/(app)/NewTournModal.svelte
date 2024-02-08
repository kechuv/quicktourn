<script>
import { goto, pushState } from '$app/navigation';
import { page } from '$app/stores';
import { useTournStore } from '$lib/stores/tournStore.svelte';
import { createTourn } from '$lib/schemas/tourns/tourn.schema';

const { addTourn, tournList, setLastTourn } = useTournStore();

/** @type {HTMLDialogElement | undefined} */
let dialog = $state();

$effect(() => {
  $page.state.newTournModal
    ? dialog?.showModal()
    : dialog?.close();
});

function showModal() {
  pushState('', {
    newTournModal: true,
  });
}
function closeModal() {
  pushState('', {
    newTournModal: false,
  });
}

/** @param {import('$lib/schemas/tourns/tourn.schema').TournFormats} format */
function handleCreateTourn(format) {
  const nameMappings = {
    singleBracket: 'single bracket',
    roundRobin: 'round robin',
  };
  const name = nameMappings[format];
  const sameTypeTourns = Object.values(tournList).filter(t => t.format === format);
  const newTourn = createTourn({
    format,
    name: `${name} (${sameTypeTourns.length})`,
  });
  addTourn(newTourn);
  setLastTourn(newTourn.slug);
  goto(`/tournament/${newTourn.slug}`);
}
</script>

<button
  onclick={showModal}
  type="button"
>
  CreateNew
</button>

<dialog bind:this={dialog}>
  <button
    onclick={closeModal}
    type="button"
  >
    close
  </button>
  <div class="grid grid-flow-col justify-center gap-16">
    <button
      onclick={() => handleCreateTourn('singleBracket')}
      type="button"
    >
      Bracket
    </button>
    <button
      onclick={() => handleCreateTourn('roundRobin')}
      type="button"
    >
      Round Robin
    </button>
  </div>
</dialog>
