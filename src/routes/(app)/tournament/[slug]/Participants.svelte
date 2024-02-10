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

<div>
  <h1>Add participant:</h1>
  <form onsubmit={handleRegister}>
    <input
      type="text"
      bind:value={input}
    />
    <button type="submit">Add</button>
  </form>

  <ol>
    {#each participants as participant}
      <li>
        <span>{ participant }</span>
        <button
          onclick={() => handleUnregister(participant)}
          type="button"
        >
          X
        </button>
      </li>
    {/each}
  </ol>
</div>
