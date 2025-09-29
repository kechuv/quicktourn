<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import {
    tournFormats,
    tournSchema,
    type Tourn,
    type TournFormat,
  } from '$lib/schemas/tourn';
  import { slugify } from '$lib/utils/slugify';
  import { z } from 'zod';

  type Props = {
    onSubmit: (tourn: Tourn) => void;
  };
  const { onSubmit }: Props = $props();

  const formSchema = z.object({
    name: tournSchema.shape.name.min(1),
    format: tournSchema.shape.format,
  });
  type FormSchema = z.infer<typeof formSchema>;

  const formatLabels: Record<TournFormat, string> = {
    'single-elimination': 'Elimination',
    'round-robin': 'League',
  };

  const createTournId = (name: string) => {
    const now = Math.floor(new Date().getTime() / 1000);
    const tournId = `${slugify(name)}-${now}`;
    return tournId;
  };
  const createDefaultTournament = (data: Pick<Tourn, 'name' | 'format'>) => {
    return tournSchema.parse({
      id: createTournId(data.name),
      name: data.name,
      format: data.format,
      participants: [],
      matches: [],
      leaderboard: [],
    } as Tourn);
  };

  const createTournament = (
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formResult = formSchema.safeParse({
      name: formData.get('name') as string,
      format: formData.get('format') as FormSchema['format'],
    });
    if (formResult.error)
      return z.treeifyError(formResult.error, (e) => e.code);

    const tourn = createDefaultTournament(formResult.data);

    onSubmit(tourn);
    e.currentTarget.reset();
    goto(resolve('/tournaments/[tournId]', { tournId: tourn.id }));
  };
</script>

<form
  class="grid gap-4"
  onsubmit={createTournament}
>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">Create Tournament</legend>
    <fieldset class="fieldset">
      <label
        class="fieldset-label"
        for="name"
      >
        Name
      </label>
      <input
        id="name"
        name="name"
        class="input w-full input-primary"
        pattern="^(?!\s).*\S$"
        required
        type="text"
      />
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-label">Format</legend>
      {#each tournFormats as format (format)}
        <input
          name="format"
          class="btn validator"
          aria-label={formatLabels[format]}
          required
          type="radio"
          value={format}
        />
      {/each}
    </fieldset>
  </fieldset>

  <button
    class="btn btn-block btn-neutral"
    type="submit"
  >
    Create
  </button>
</form>
