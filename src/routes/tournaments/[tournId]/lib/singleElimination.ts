import {
  getByes,
  getNearestExponentPowerOf2,
  getNextBracketMatch,
  slaughter,
} from './helpers';
import type { Match, Slot } from '$lib/schemas/match';
import { chunk } from '$lib/utils/chunk';

export function createSingleElimination(length: number) {
  const totalRounds = getNearestExponentPowerOf2(length);
  const totalSlots = 2 ** totalRounds;
  const totalMatches = totalSlots - 1;
  const totalByes = totalSlots - length;

  const matches = createMatches({ totalMatches, totalRounds });
  const bracketSlaughter = Array(totalRounds ? totalRounds - 1 : 0)
    .fill(undefined)
    .reduce((arr) => {
      const newArr = chunk(arr, 2);
      const sort = slaughter(newArr.length);
      return sort.map((idx) => newArr[idx]);
    }, slaughter(totalSlots))
    .flat(totalRounds - 1);

  function createMatches({
    totalMatches,
    totalRounds,
  }: {
    totalMatches: number;
    totalRounds: number;
  }) {
    return Array.from({ length: totalMatches }, (_, idx) => {
      const roundIdx =
        totalRounds - Math.floor(Math.log2(totalMatches - idx)) - 1;
      const matchIdx = idx % 2 ** (totalRounds - roundIdx);
      return {
        roundIdx,
        matchIdx: matchIdx,
        slots: [
          {
            seed: 0,
            player: '',
            isBye: false,
            isWinner: false,
            score: null,
          } as Slot,
          {
            seed: 0,
            player: '',
            isBye: false,
            isWinner: false,
            score: null,
          } as Slot,
        ],
      } as Match;
    });
  }

  function setRounds(seeds: number[]) {
    const matches_copy = structuredClone(matches);
    const seedsMatch = chunk(seeds, 2);
    const byes = getByes(totalByes, seedsMatch);
    const matches_by_round = Object.groupBy(
      matches_copy,
      (match) => match.roundIdx,
    );
    matches_by_round[0]?.forEach((match) => {
      // Set seeds & byes
      match.slots.forEach((slot, slotIdx) => {
        const seed = seedsMatch[match.matchIdx][slotIdx];
        slot.seed = seed + 1;
        slot.isBye = byes.includes(seed);
      });
      // Send player to next match if 'player vs bye'
      const realPlayers = match.slots.filter((slot) => !slot.isBye);
      if (realPlayers.length !== 1) return;
      realPlayers[0].isWinner = true;
      const nextMatchRefs = getNextBracketMatch({
        round: match.roundIdx,
        match: match.matchIdx,
      });
      const nextMatchData = matches_by_round[nextMatchRefs.round]?.find(
        (match) => match.matchIdx === nextMatchRefs.match,
      );
      if (!nextMatchData) return;
      nextMatchData.slots[nextMatchRefs.slot].seed = realPlayers[0].seed;
    });
    return matches_copy;
  }

  return setRounds(bracketSlaughter);
}

export function setNextRoundMatch(match: Match, matches: Match[]) {
  const idx = getNextBracketMatch({
    round: match.roundIdx,
    match: match.matchIdx,
  });

  const nextMatch = matches.find(
    (m) => m.roundIdx === idx.round && m.matchIdx === idx.match,
  );
  if (!nextMatch) return matches;

  const winners = match.slots.filter((slot) => slot.isWinner);

  nextMatch.slots = nextMatch.slots.map((slot, slotIdx) => {
    if (slotIdx !== idx.slot)
      return {
        ...slot,
        isWinner: false,
        score: null,
      };
    return {
      seed: winners.length === 1 ? winners[0].seed : 0,
      player: winners.length === 1 ? winners[0].player : '',
      isBye: false,
      isWinner: false,
      score: null,
    };
  });

  return setNextRoundMatch(nextMatch, matches);
}
