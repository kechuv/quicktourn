import { createSlot } from '$lib/schemas/tourns/match.schema';
import { chunk } from 'lodash-es';
import { rotateClockwise, slaughter } from './sortStrategies';

/** @param {import("$lib/schemas/tourns/tourn.schema").TournSchema['format']} format */
export function formatFactory(format) {
  /** @type {Record<typeof format, FormatCreator>} */
  const formatMap = {
    roundRobin: createRoundRobin,
    singleBracket: createSingleBracket,
  };

  return formatMap[format];
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
 * @returns {import('$lib/schemas/tourns/tourn.schema').RoundSchema[]}
 */

/** @type {FormatCreator} */
function createRoundRobin(pArray) {
  /** @typedef {import('$lib/schemas/tourns/tourn.schema').RoundSchema} Round */
  if (!pArray.length) return /** @type {Round[]} */([]);
  const copy = [...pArray];
  if (pArray.length % 2) copy.push('');
  const slots = copy.map(p => createSlot({ player: p }));
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

/** @type {FormatCreator} */
function createSingleBracket(pArray) {
  /** @typedef {import('$lib/schemas/tourns/tourn.schema').RoundSchema} Round */
  if (!pArray.length) return /** @type {Round[]} */([]);

  const copy = [...pArray];
  const roundsLength = getNearestExponentPowerOf2(copy.length);
  const slotsLength = 2 ** roundsLength;
  const slots = new Array(slotsLength)
    .fill(null)
    .map((_, pIdx) => createSlot({ player: copy[pIdx] }));
  /** @type {Round[]} */
  const roundsArr = new Array(roundsLength)
    .fill(null)
    .reduce((acc, r, rIdx) => {
      if (!rIdx && roundsLength <= 1) {
        acc[rIdx] = [[...slots]];
        return acc;
      }
      if (!rIdx) {
        const sort = sortMatches(roundsLength);
        const sorted = sort.map(idx => slots[idx]);
        const chunked = chunk(sorted, 2);
        acc[rIdx] = chunked;
        return acc;
      }
      acc[rIdx] = new Array(acc[rIdx - 1].length / 2)
        .fill(null)
        .map(() => ([null, null]));
      return acc;
    }, []);
  const rounds = qualifyMatches(roundsArr);
  return rounds;

  /** @param {number} input */
  function getNearestExponentPowerOf2(input) {
    return input > 1
      ? Math.ceil(Math.log(input) / Math.log(2))
      : 1;
  }
  /** @param {number} roundsLength */
  function sortMatches(roundsLength) {
    const itrs = roundsLength - 1;
    const sortedMatches = new Array(itrs)
      .fill(null)
      .reduce((acc, _, idx) => {
        if (!idx) return chunk(slaughter(2 ** roundsLength), 2);
        const newSort = slaughter(acc.length);
        const sorted = newSort.map(idx => acc[idx]);
        return chunk(sorted, 2);
      }, []);
    /** @type {number[]} */
    const flated = sortedMatches.flat(itrs);
    return flated;
  }
  /** @param {Round[]} rounds */
  function qualifyMatches(rounds) {
    const roundsCopy = structuredClone(rounds);
    roundsCopy[0].forEach((match, matchIdx) => {
      const hasBye = match.some(slot => slot?.isBye);
      if (!hasBye) return;
      const playerIdx = match.findIndex(s => !s?.isBye);
      const player = match[playerIdx];
      match[playerIdx] = createSlot({
        ...player,
        winner: true,
      });
      if (!roundsCopy[1]) return;
      const nextMatchIdx = Math.floor(matchIdx / 2);
      const nextSlotIdx = matchIdx % 2;
      roundsCopy[1][nextMatchIdx][nextSlotIdx] = createSlot({ player: player?.player });
    });
    return roundsCopy;
  }
}
