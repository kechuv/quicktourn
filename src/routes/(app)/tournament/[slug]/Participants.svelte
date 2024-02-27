<script>
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

<div class="grid grid-rows-[auto_1fr] gap-4">
  <div class="grid">
    <h1>Add participant:</h1>
    <form onsubmit={handleRegister}>
      <input
        type="text"
        bind:value={input}
      />
      <button
        class="rounded bg-stone-200 px-2 py-1 transition-colors hover:bg-stone-300"
        type="submit"
      >
        Add
      </button>
    </form>
  </div>

  <ol class="grid h-[20svh] content-start gap-1 overflow-auto">
    {#each participants as participant}
      <li class="grid w-full grid-cols-[1fr_25px] rounded bg-stone-100 transition-colors hover:bg-stone-200">
        <span class="p-1">
          { participant }
        </span>
        <button
          class="flex items-center justify-center rounded-r transition-colors hover:bg-red-500"
          onclick={() => handleUnregister(participant)}
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
      </li>
    {/each}
  </ol>
</div>
