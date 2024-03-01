<script>
import BracketIcon from '$lib/components/BracketIcon.svelte';
import LeagueIcon from '$lib/components/LeagueIcon.svelte';
import { createBoard } from '$lib/schemas/tourns/tourn.schema';
import { useTournStore } from '$lib/stores/tournStore.svelte';
import Bracket from './Bracket.svelte';
import Participants from './Participants.svelte';
import RoundRobin from './RoundRobin.svelte';
import { formatFactory } from './formatFactory';

const tournStore = useTournStore();

const tourn = $derived(tournStore.currentTourn);
const createRounds = $derived(formatFactory(tourn?.format));

/** @param {typeof tourn.participants} participants */
function createLeaderboard(participants) {
  const leaderboard = participants.reduce((acc, p) => {
    acc[p] = createBoard({});
    return acc;
  }, /** @type {import('$lib/schemas/tourns/tourn.schema').LeaderboardSchema} */({}));
  return leaderboard;
}

/** @param {typeof tourn.participants[0]} participant */
function handleRegister(participant) {
  if (!participant) return;
  if (tourn.participants.includes(participant)) return;
  const updated = [...tourn.participants, participant];
  const rounds = createRounds(updated);
  tournStore.updateTourn({
    ...tourn,
    participants: updated,
    rounds,
    leaderboard: tourn.format === 'roundRobin'
      ? createLeaderboard(updated)
      : {},
  });
}
/** @param {typeof tourn.participants[0]} participant */
function handleUnregister(participant) {
  if (!tourn.participants.includes(participant)) return;
  const updated = tourn.participants.filter(p => p !== participant);
  const rounds = createRounds(updated);
  tournStore.updateTourn({
    ...tourn,
    participants: updated,
    rounds,
    leaderboard: tourn.format === 'roundRobin'
      ? createLeaderboard(updated)
      : {},
  });
}

/** @param {import('$lib/schemas/tourns/tourn.schema').RoundSchema[]} newRounds */
function updateTourn(newRounds) {
  tournStore.updateTourn({
    ...tourn,
    rounds: newRounds,
  });
}
/** @param {any} newLeaderboard */
function updateLeaderboard(newLeaderboard) {
  tournStore.updateTourn({
    ...tourn,
    leaderboard: newLeaderboard,
  });
}
</script>

<div class="grid h-full grid-rows-[auto_1fr] gap-2 overflow-hidden">
  <h1 class="text-bold sticky top-0 z-10 flex w-full items-center justify-center gap-1 bg-stone-50 text-center font-bold">
    <span class="block w-4 text-[1rem] leading-none">
      {#if tourn?.format === 'singleBracket'}
        <BracketIcon />
      {/if}
      {#if tourn?.format === 'roundRobin'}
        <LeagueIcon />
      {/if}
    </span>
    <span>{tourn?.name}</span>
  </h1>
  <div class="grid h-full grid-rows-[1fr_2fr] gap-8 overflow-auto px-4 lg:grid-cols-[250px_1fr] lg:grid-rows-[1fr]">
    <div class="h-full overflow-auto px-2">
      {#if tourn?.participants}
        <Participants
          participants={tourn.participants}
          register={handleRegister}
          unregister={handleUnregister}
        />
      {/if}
    </div>
    <div class="h-full overflow-auto px-2">
      {#if tourn?.format === 'singleBracket'}
        <Bracket
          rounds={tourn.rounds}
          {updateTourn}
        />
      {/if}
      {#if tourn?.format === 'roundRobin'}
        <RoundRobin
          leaderboard={tourn.leaderboard}
          rounds={tourn.rounds}
          {updateLeaderboard}
          {updateTourn}
        />
      {/if}
    </div>
  </div>
</div>
