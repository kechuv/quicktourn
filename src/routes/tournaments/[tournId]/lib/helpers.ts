export function getNearestExponentPowerOf2(input: number) {
  return input > 0 ? Math.ceil(Math.log2(input)) : 0;
}

export function getByes(
  byesLength: number,
  matches: number[][],
  byes: number[] = [],
): number[] {
  if (!byesLength) return byes;
  const nextSeed = matches.flat().toSorted((a, b) => a - b)[0];
  const match = matches.find((m) => m.includes(nextSeed));
  if (match) {
    const rival = match.find((s) => s !== nextSeed);
    if (rival) byes.push(rival);
  }
  const restMatches = matches.filter((m) => m !== match);
  return getByes(byesLength - 1, restMatches, byes);
}

export function slaughter(size: number) {
  return [...new Array(size)].map(
    (_, index) => (index % 2 ? size - 1 : index) - Math.floor(index / 2),
  );
}

export function cross(size: number) {
  return [...new Array(size)].map((_, index) =>
    index % 2
      ? size / 2 + Math.floor(index / 2)
      : index - Math.floor(index / 2),
  );
}

export function adjacent(size: number) {
  return [...new Array(size)].map((_, index) => index);
}

export function rotateClockwise(size: number) {
  const arr: [number[], number[]] = [...new Array(size)].reduce(
    (newArr, _, index) => {
      newArr[index % 2].push(index);
      return newArr;
    },
    [[], []],
  );
  const nextPlayer1 = arr[0].splice(1, 1)[0];
  const lastPlayer2 = arr[1].pop() as number;
  const newPlayer1 = [...arr[0], lastPlayer2];
  const newPlayer2 = [nextPlayer1, ...arr[1]];
  const newArr = newPlayer1.map((player, matchIndex) => [
    player,
    newPlayer2[matchIndex],
  ]);
  return newArr.flat();
}

export function rotateCounterClockwise(size: number) {
  const arr: [number[], number[]] = [...new Array(size)].reduce(
    (newArr, _, index) => {
      newArr[index % 2].push(index);
      return newArr;
    },
    [[], []],
  );
  const lastPlayer1 = arr[0].pop() as number;
  const firstPlayer2 = arr[1].shift() as number;
  const newPlayer1 = [arr[0][0], firstPlayer2, ...arr[0].slice(1)];
  const newPlayer2 = [...arr[1], lastPlayer1];
  const newArr = newPlayer1.map((player, matchIndex) => [
    player,
    newPlayer2[matchIndex],
  ]);
  return newArr.flat();
}

export function getNextBracketMatch({
  round,
  match,
}: {
  round: number;
  match: number;
}) {
  const nextRound = round + 1;
  const nextMatch = Math.floor(match / 2);
  const nextSlot = match % 2;
  return {
    round: nextRound,
    match: nextMatch,
    slot: nextSlot,
  };
}
