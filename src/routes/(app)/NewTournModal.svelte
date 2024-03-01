<script>
import { goto, pushState } from '$app/navigation';
import { page } from '$app/stores';
import { useTournStore } from '$lib/stores/tournStore.svelte';
import { createTourn } from '$lib/schemas/tourns/tourn.schema';
import CloseIcon from '$lib/components/CloseIcon.svelte';
import BracketIcon from '$lib/components/BracketIcon.svelte';
import LeagueIcon from '$lib/components/LeagueIcon.svelte';

const tournStore = useTournStore();
const { addTourn, setLastTourn } = tournStore;

/** @type {HTMLDialogElement | undefined} */
let dialog = $state();

/**
 * @type {{
 *  name: string,
 *  format?: import('$lib/schemas/tourns/tourn.schema').TournFormats
 * }}
 */
let form = $state({
  name: '',
  format: undefined,
});

function resetForm() {
  form.name = '';
  form.format = undefined;
}

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
  resetForm();
  pushState('', {
    newTournModal: false,
  });
}

/** @param {SubmitEvent & {currentTarget: EventTarget & HTMLFormElement }} e */
function handleCreateTourn(e) {
  e.preventDefault();
  if (!form.format) return;
  const nameMappings = {
    singleBracket: 'elimination',
    roundRobin: 'league',
  };
  const name = nameMappings[form.format];
  const sameTypeTourns = Object.values(tournStore.tournList).filter(t => t.format === form.format);
  const newTourn = createTourn({
    format: form.format,
    name: form.name
      ? form.name
      : `${name} (${sameTypeTourns.length})`,
  });
  addTourn(newTourn);
  setLastTourn(newTourn.slug);
  resetForm();
  goto(`/tournament/${newTourn.slug}`);
}
</script>

<button
  class="btn aspect-square h-full w-[40px] lg:aspect-auto lg:w-auto"
  onclick={showModal}
  type="button"
>
  <span class="hidden lg:block">New Tournament</span>
  <span class="text-[1.5rem] font-bold leading-none lg:hidden">+</span>
</button>

<dialog
  bind:this={dialog}
  class="rounded bg-stone-50"
  onclose={resetForm}
>
  <div class="grid gap-4 p-4">
    <button
      class="justify-self-end p-[2px]"
      onclick={closeModal}
      type="button"
    >
      <CloseIcon />
    </button>
    <form
      class="grid grid-cols-2 gap-8"
      onsubmit={handleCreateTourn}
    >
      <label class="col-span-2 grid gap-1">
        <span>Tournament name:</span>
        <input
          type="text"
          bind:value={form.name}
        />
      </label>

      <button
        class="grid justify-items-center gap-1 rounded border-2 border-stone-200 p-2 transition-colors hover:bg-stone-200"
        class:bg-stone-200={form.format === 'singleBracket'}
        onclick={() => form.format = 'singleBracket'}
        type="button"
      >
        <div class="aspect-square w-12">
          <BracketIcon />
        </div>
        Elimination
      </button>
      <button
        class="grid justify-items-center gap-1 rounded border-2 border-stone-200 p-2 transition-colors hover:bg-stone-200"
        class:bg-stone-200={form.format === 'roundRobin'}
        onclick={() => form.format = 'roundRobin'}
        type="button"
      >
        <div class="aspect-square w-12">
          <LeagueIcon />
        </div>
        League
      </button>

      <button
        class="btn col-span-2"
        type="submit"
      >
        Create
      </button>
    </form>
  </div>
</dialog>
