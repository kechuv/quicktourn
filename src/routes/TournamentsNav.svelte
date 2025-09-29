<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { TournListElement } from '$lib/stores/tournamentList';

  type Props = {
    tournList: TournListElement[];
    onSelectedTourn: () => void;
    onDeleteTourn: (tournId: string) => void;
  };
  let { tournList, onSelectedTourn, onDeleteTourn }: Props = $props();
</script>

<ul class="grid gap-1">
  {#each tournList as tourn (tourn.id)}
    <li class="join-horizontal join w-full">
      <a
        class={[
          'btn join-item grow-1 justify-between btn-sm',
          page.params.tournId === tourn.id && 'btn-active',
        ]}
        href={resolve('/tournaments/[tournId]', { tournId: tourn.id })}
        onclick={onSelectedTourn}
      >
        <span>{tourn.name}</span>
        {#if tourn.format === 'round-robin'}
          <span class="badge badge-xs [--badge-color:var(--color-red-200)]">
            League
          </span>
        {:else}
          <span class="badge badge-xs [--badge-color:var(--color-orange-200)]">
            Elimination
          </span>
        {/if}
      </a>

      <button
        class={[
          'btn join-item btn-square btn-sm hover:btn-error',
          page.params.tournId === tourn.id && 'btn-active',
        ]}
        onclick={() => onDeleteTourn(tourn.id)}
        type="button"
      >
        ✕
      </button>
    </li>
  {/each}
</ul>
