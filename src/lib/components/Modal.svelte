<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLDialogAttributes } from 'svelte/elements';

  type Props = HTMLDialogAttributes & {
    invoker: Snippet<[HTMLDialogElement]>;
    content: Snippet<[HTMLDialogElement]>;
    modal: HTMLDialogElement | undefined;
  };
  let {
    invoker,
    content,
    modal = $bindable(),
    ...dialogAttrs
  }: Props = $props();
</script>

<div class="invoker">
  {@render invoker(modal!)}
</div>
<dialog
  {...dialogAttrs}
  bind:this={modal}
  class="modal {dialogAttrs.class}"
>
  {@render content(modal)}
</dialog>
