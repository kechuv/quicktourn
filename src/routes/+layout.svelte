<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import Modal from '$lib/components/Modal.svelte';
  import CreateTournament from './CreateTournament.svelte';
  import TournamentsNav from './TournamentsNav.svelte';
  import { onMount } from 'svelte';
  import { getTournList, saveTournList } from '$lib/stores/tournamentList';
  import type { TournListElement } from '$lib/stores/tournamentList';
  import type { Tourn } from '$lib/schemas/tourn';
  import { deleteTournament, saveTournament } from '$lib/stores/tournament';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';

  let { children } = $props();
  let modal: HTMLDialogElement | undefined = $state(undefined);
  let showNavbar = $state(false);

  let tournList: TournListElement[] = $state([]);

  onMount(async () => {
    tournList = getTournList();
  });

  const saveTourn = (tourn: Tourn) => {
    tournList.push(tourn);
    saveTournList($state.snapshot(tournList));
    saveTournament(tourn);
    modal?.close();
  };
  const deleteTourn = (tournId: string) => {
    const newTournList = tournList.filter((tourn) => tourn.id !== tournId);
    tournList = newTournList;
    saveTournList($state.snapshot(newTournList));
    deleteTournament(tournId);
    goto(resolve('/'));
  };
</script>

<svelte:head>
  <link
    href={favicon}
    rel="icon"
  />
</svelte:head>

<div class="grid h-dvh w-dvw grid-rows-[1fr_auto]">
  <main class="min-h-full min-w-full">
    {@render children?.()}
  </main>
  <footer class="navbar min-h-12 bg-base-300">
    <div class="navbar-start">
      <div class="drawer">
        <input
          id="my-tournaments"
          class="drawer-toggle"
          type="checkbox"
          bind:checked={showNavbar}
        />
        <div class="drawer-content">
          <label
            class="btn btn-square btn-ghost btn-xs"
            aria-label="open sidebar"
            for="my-tournaments"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
            </svg>
          </label>
        </div>
        <div class="drawer-side">
          <label
            class="drawer-overlay"
            aria-label="close sidebar"
            for="my-tournaments"
          ></label>
          <div
            class="menu relative min-h-full w-full bg-base-200 p-4 text-base-content md:w-60"
          >
            <TournamentsNav
              onDeleteTourn={deleteTourn}
              onSelectedTourn={() => (showNavbar = false)}
              {tournList}
            />
            <label
              class="btn absolute bottom-2 left-2 btn-square btn-ghost btn-xs"
              aria-label="close sidebar"
              for="my-tournaments"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"
                ></path>
              </svg>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="navbar-center font-bold">
      <h1 class="md:hidden">QT</h1>
      <h1 class="hidden md:block">Quick Tournament</h1>
    </div>
    <div class="navbar-end">
      <Modal
        class="modal-bottom"
        bind:modal
      >
        {#snippet invoker()}
          <button
            id="new-tourn"
            class="btn btn-sm btn-primary"
            onclick={() => modal?.showModal()}
            type="button"
          >
            New Tournament
          </button>
        {/snippet}
        {#snippet content()}
          <div class="modal-box">
            <CreateTournament onSubmit={saveTourn} />
          </div>
          <form
            class="modal-backdrop"
            method="dialog"
          >
            <button>close</button>
          </form>
        {/snippet}
      </Modal>
    </div>
  </footer>
</div>
