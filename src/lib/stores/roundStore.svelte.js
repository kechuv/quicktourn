import { createMatchScore } from '$lib/schemas/tourns/match.schema';
import { chunk } from 'lodash-es';
import { rotateClockwise } from '../../routes/(app)/tournament/[slug]/sortStrategies';
import { useTournStore } from './tournStore.svelte';

export function useRoundStore() {
  const tournStore = useTournStore();
  const rounds = $derived(tournStore.tourn?.rounds);

  /** @type {Record<typeof tournStore['tourn']['format'], FormatCreator>} */
  const formatMap = {
    roundRobin: createRoundRobin,
    singleBracket: createRoundRobin,
  };

  function createRounds() {
    const strategy = formatMap[tournStore.tourn.format];
    tournStore.updateTourn({
      rounds: strategy(tournStore.tourn.participants),
    });
  }

  return {
    get rounds() {
      return rounds;
    },
    createRounds,
  };
}

/**
 * @template T
 * @param {T[]} els
 * @param {number[]} newOrder
 */
const reorder = (els, newOrder) => newOrder.map(idx => structuredClone(els[idx]));

/**
 * @callback FormatCreator
 * @param {import('$lib/schemas/tourns/tourn.schema').TournSchema['participants']} pArray
 * @returns {ReturnType<typeof createMatchScore>[][][]}
 */

/** @type {FormatCreator} */
function createRoundRobin(pArray) {
  const copy = [...pArray];
  if (pArray.length % 2) copy.push('');
  const slots = copy.map(p => createMatchScore(p));
  const rotation = rotateClockwise(slots.length);
  /** @type {typeof slots[]} */
  const roundsArr = new Array(slots.length - 1)
    .fill(null)
    .reduce((acc, r, rIdx) => {
      const reordered = !rIdx
        ? structuredClone(slots)
        : reorder(acc[rIdx - 1], rotation);
      acc[rIdx] = reordered;
      return acc;
    }, []);
  return roundsArr.map(r => chunk(r, 2));
}

// /** @param {number} input */
// const getNearestExponentPowerOf2 = input => input > 1
//   ? Math.ceil(Math.log(input) / Math.log(2))
//   : 1;

// /** @type {FormatCreator} */
// function createSingleBracket(pArray) {
//   const copy = [...pArray];
//   const roundsLength = getNearestExponentPowerOf2(copy.length);
//   const slots = new Array(roundsLength ** 2).fill(null)
//     .map(p => createMatchScore(p));
//   const roundsArr = new Array(roundsLength)
//     .fill(null)
//     .reduce((acc, r, rIdx) => {

//     }, []);
// }
