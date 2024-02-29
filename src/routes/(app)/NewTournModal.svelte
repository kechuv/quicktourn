<script>
import { goto, pushState } from '$app/navigation';
import { page } from '$app/stores';
import { useTournStore } from '$lib/stores/tournStore.svelte';
import { createTourn } from '$lib/schemas/tourns/tourn.schema';

const tournStore = useTournStore();
const { addTourn, setLastTourn } = tournStore;

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
    singleBracket: 'elimination',
    roundRobin: 'league',
  };
  const name = nameMappings[format];
  const sameTypeTourns = Object.values(tournStore.tournList).filter(t => t.format === format);
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
  class="rounded bg-stone-200 p-2 transition-colors hover:bg-stone-300"
  onclick={showModal}
  type="button"
>
  <span class="block">New Tournament</span>
</button>

<dialog
  bind:this={dialog}
  class="rounded bg-stone-50"
>
  <div class="grid gap-4 p-4">
    <button
      class="justify-self-end"
      onclick={closeModal}
      type="button"
    >
      <svg
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12L7 7m5 5l5 5m-5-5l5-5m-5 5l-5 5"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </button>
    <div class="grid grid-cols-2 justify-center gap-8">
      <button
        class="grid justify-items-center gap-1 rounded border-2 border-stone-200 p-2 transition-colors hover:bg-stone-200"
        onclick={() => handleCreateTourn('singleBracket')}
        type="button"
      >
        <svg
          height="3rem"
          viewBox="0 0 24 24"
          width="3rem"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2v2h5v4H2v2h5c1.11 0 2-.89 2-2V7h5v10H9v-1c0-1.11-.89-2-2-2H2v2h5v4H2v2h5c1.11 0 2-.89 2-2v-1h5c1.11 0 2-.89 2-2v-4h6v-2h-6V7c0-1.11-.89-2-2-2H9V4c0-1.11-.89-2-2-2z"
            fill="currentColor"
          />
        </svg>
        Elimination
      </button>
      <button
        class="grid justify-items-center gap-1 rounded border-2 border-stone-200 p-2 transition-colors hover:bg-stone-200"
        onclick={() => handleCreateTourn('roundRobin')}
        type="button"
      >
        <svg
          height="3rem"
          viewBox="0 0 16 16"
          width="3rem"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="currentColor">
            <path
              d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"
              fill-rule="evenodd"
            />
            <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317c0-.185-.158-.31-.361-.31c-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787c.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8c-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309c.254 0 .424-.145.422-.35c-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844c.583 0 .96.326.96.756c0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508c0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z" />
          </g>
        </svg>
        League
      </button>
    </div>
  </div>
</dialog>
