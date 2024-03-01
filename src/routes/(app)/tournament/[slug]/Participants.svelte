<script>
import CloseIcon from '$lib/components/CloseIcon.svelte';

/**
 * @type {{
 *  participants: import("$lib/schemas/tourns/tourn.schema").TournSchema['participants'],
 *  register: (participant: typeof participants[0]) => void,
 *  unregister: (participant: typeof participants[0]) => void,
 *  clear?: () => void
 * }}
 */
let { participants, register, unregister } = $props();

let input = $state('');
const resetInput = () => input = '';

/** @param {Event & { currentTarget: EventTarget & HTMLFormElement }} event */
function handleRegister(event) {
  event.preventDefault();
  if (!input) return;
  register(input);
  resetInput();
}
/** @param {typeof participants[0]} participant */
function handleUnregister(participant) {
  if (!participant) return;
  unregister(participant);
  resetInput();
}
</script>

<div class="grid gap-2">
  <div class="sticky top-0 grid gap-2 bg-stone-50 pb-2">
    <h1>Add participant:</h1>
    <form
      class="grid gap-2"
      onsubmit={handleRegister}
    >
      <input
        type="text"
        bind:value={input}
      />
      <button
        class="btn px-2 py-1"
        type="submit"
      >
        Add
      </button>
    </form>
  </div>

  <ol class="grid h-full content-start gap-1">
    {#each participants as participant}
      <li class="btn grid w-full grid-cols-[1fr_25px] bg-stone-100 p-0 hover:bg-stone-200">
        <span class="p-1">
          { participant }
        </span>
        <button
          class="flex items-center justify-center rounded-r transition-colors hover:bg-red-400"
          onclick={() => handleUnregister(participant)}
          type="button"
        >
          <CloseIcon />
        </button>
      </li>
    {/each}
  </ol>
</div>
