<script lang="ts">
  import {
    participantResultsSchema,
    type ParticipantResults,
  } from '$lib/schemas/leaderboard';
  import type { Match as MatchSchema } from '$lib/schemas/match';
  import type { Participant } from '$lib/schemas/tourn';
  import { saveTournament } from '$lib/stores/tournament';
  import type { PageProps } from './$types';
  import Leaderboard from './Leaderboard.svelte';
  import { computePlayersResults, createRoundRobin } from './lib/roundRobin';
  import {
    createSingleElimination,
    setNextRoundMatch,
  } from './lib/singleElimination';
  import Match from './Match.svelte';
  import Participants from './Participants.svelte';
  import RoundRobin from './RoundRobin.svelte';
  import SingleElimination from './SingleElimination.svelte';

  let { data }: PageProps = $props();

  let tourn = $derived(data.tourn);
  let matches = $derived(tourn.matches);
  let leaderboard = $derived(tourn.leaderboard);

  const formatStrategies = {
    'round-robin': (participantList: Participant[]) => {
      const matches = createRoundRobin(participantList.length);
      const slots = matches.flatMap((match) => match.slots);
      slots.forEach((slot) => {
        if (slot.isBye) return '';
        return (slot.player = participantList[slot.seed - 1] ?? '');
      });

      const leaderboard = participantList.map((p) =>
        participantResultsSchema.parse({
          participant: p,
          w: 0,
          d: 0,
          l: 0,
        }),
      );

      return {
        matches,
        leaderboard,
      };
    },
    'single-elimination': (participantList: Participant[]) => {
      const matches = createSingleElimination(participantList.length);
      const slots = matches.flatMap((match) => match.slots);
      slots.forEach((slot) => {
        if (slot.isBye) return '';
        return (slot.player = participantList[slot.seed - 1] ?? '');
      });
      return {
        matches,
        leaderboard: [] as ParticipantResults[],
      };
    },
  };

  const onParticipantsUpdated = (participantList: string[]) => {
    const format = formatStrategies[tourn.format](participantList);

    matches = format.matches;
    leaderboard = format.leaderboard;

    tourn = {
      ...tourn,
      participants: participantList,
      matches: matches,
      leaderboard: leaderboard,
    };

    saveTournament(tourn);
  };
  const setMatchScore = (match: MatchSchema) => {
    const updatedMatches = matches.map((m) =>
      m.roundIdx === match.roundIdx && m.matchIdx === match.matchIdx
        ? match
        : m,
    );
    matches = updatedMatches;
    saveTournament({
      ...tourn,
      matches: updatedMatches,
      leaderboard: leaderboard,
    });
  };
  const setMatchWinner = (match: MatchSchema) => {
    const clonedMatches = structuredClone(matches);
    const updatedMatches = clonedMatches.map((m) =>
      m.roundIdx === match.roundIdx && m.matchIdx === match.matchIdx
        ? match
        : m,
    );

    if (tourn.format === 'round-robin') {
      const players = match.slots.map((slot) => slot.player);
      const playersResults = computePlayersResults(players, updatedMatches);
      const othersResults = leaderboard.filter(
        (r) => !players.includes(r.participant),
      );
      matches = updatedMatches;
      leaderboard = [...othersResults, ...playersResults];
    }
    if (tourn.format === 'single-elimination') {
      matches = setNextRoundMatch(match, updatedMatches);
    }

    saveTournament({
      ...tourn,
      matches: matches,
      leaderboard: leaderboard,
    });
  };
</script>

<div
  class="grid h-full w-full grid-rows-[auto_1fr] gap-2 overflow-auto md:grid-cols-[250px_1fr] md:grid-rows-1"
>
  <div
    class="sticky top-0 left-0 z-10 grid w-dvw grid-rows-[auto_1fr] gap-1 bg-base-100 p-2 md:w-full"
  >
    <h1 class="flex items-center gap-1 justify-self-center p-1">
      {tourn.name}
      {#if tourn.format === 'round-robin'}
        <span class="badge badge-xs [--badge-color:var(--color-roundrobin)]">
          League
        </span>
      {:else}
        <span class="badge badge-xs [--badge-color:var(--color-elimination)]">
          Elimination
        </span>
      {/if}
    </h1>
    <details
      class="collapse-arrow collapse border border-base-300 bg-base-100 shadow md:collapse-open md:hidden"
    >
      <summary class="collapse-title font-semibold">
        Participants
        <span class="badge badge-sm">
          {tourn.participants.length}
        </span>
      </summary>
      <div class="collapse-content h-[35dvh] grid-rows-[1fr] text-sm">
        <Participants
          {onParticipantsUpdated}
          participantsList={tourn.participants}
        />
      </div>
    </details>
    <div class="hidden min-h-full md:grid">
      <Participants
        {onParticipantsUpdated}
        participantsList={tourn.participants}
      />
    </div>
  </div>
  <div class="py-4 md:pb-0">
    {#if tourn.format === 'single-elimination'}
      <SingleElimination {matches}>
        {#snippet children(match)}
          <Match
            {match}
            onScoreUpdated={setMatchScore}
            onWinnerUpdated={setMatchWinner}
          />
        {/snippet}
      </SingleElimination>
    {/if}
    {#if data.tourn.format === 'round-robin'}
      <div class="tabs-box tabs">
        <input
          name="view"
          class="tab"
          aria-label="Matches"
          checked
          type="radio"
        />
        <div class="tab-content rounded-field border-base-300 bg-base-100 p-6">
          <RoundRobin {matches}>
            {#snippet children(match)}
              <Match
                {match}
                onScoreUpdated={setMatchScore}
                onWinnerUpdated={setMatchWinner}
              />
            {/snippet}
          </RoundRobin>
        </div>

        <input
          name="view"
          class="tab"
          aria-label="Leaderboard"
          type="radio"
        />
        <div class="tab-content rounded-field border-base-300 bg-base-100 p-6">
          <Leaderboard scores={leaderboard} />
        </div>
      </div>
    {/if}
  </div>
</div>
