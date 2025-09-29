import { getByes, rotateCounterClockwise, slaughter } from './helpers';
import { chunk } from '$lib/utils/chunk';
import type { Match, Slot } from '$lib/schemas/match';
import {
  participantResultsSchema,
  type ParticipantResults,
} from '$lib/schemas/leaderboard';

export function createRoundRobin(length: number) {
  const totalSlots = length % 2 ? length + 1 : length;

  const createRounds = (firstRound: number[]) => {
    const order = rotateCounterClockwise(totalSlots);
    const byes = getByes(totalSlots - length, chunk(firstRound, 2));
    const rounds = (Array.from({ length: totalSlots - 1 }) as number[][][])
      .reduce(
        (newArr, _, rIdx) => {
          if (!rIdx) return newArr;
          const lastRound = newArr[rIdx - 1].flat();
          const rotated = order.map((idx) => lastRound[idx!]);
          newArr[rIdx] = chunk(rotated, 2);
          return newArr;
        },
        [chunk(firstRound, 2)],
      )
      .map((round, roundIdx) => {
        return round.map((match, matchIdx) => {
          const realPlayer = match.filter((seed) => !byes.includes(seed));
          return {
            roundIdx,
            matchIdx: matchIdx,
            slots: match.map(
              (seed) =>
                ({
                  player: '',
                  seed: seed + 1,
                  isBye: byes.includes(seed),
                  isWinner:
                    realPlayer.length === 1 ? realPlayer.includes(seed) : false,
                  score: null,
                }) as Slot,
            ),
          };
        });
      });
    return rounds.flat();
  };

  return createRounds(slaughter(totalSlots));
}

export function computePlayersResults(players: string[], matches: Match[]) {
  const playersMatches = players.map((player) =>
    matches
      .filter((match) => match.slots.some((slot) => slot.player === player))
      .filter((match) => match.slots.every((slot) => !slot.isBye)),
  );
  const results = players.map((player, idx) => {
    const playerResults = participantResultsSchema.parse({
      participant: player,
      w: 0,
      d: 0,
      l: 0,
    });
    playersMatches[idx].forEach((match) => {
      const winners = match.slots.filter((slot) => slot.isWinner);
      if (!winners.length) return;
      if (winners.length >= 2) return (playerResults.d = playerResults.d + 1);
      const isWinner = winners[0].player === player && winners[0].isWinner;
      if (!isWinner) return (playerResults.l = playerResults.l + 1);
      playerResults.w = playerResults.w + 1;
    });
    return playerResults;
  });
  return results;
}
