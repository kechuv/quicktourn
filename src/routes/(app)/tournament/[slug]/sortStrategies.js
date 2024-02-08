/** @param {number} size */
export const slaughter = size => new Array(size)
  .fill(null)
  .map((_, index) => (index % 2
    ? size - 1
    : index) - Math.floor(index / 2));

/** @param {number} size */
export const cross = size => new Array(size)
  .fill(null)
  .map((_, index) => index % 2
    ? size / 2 + Math.floor(index / 2)
    : (index - Math.floor(index / 2)));

/** @param {number} size */
export const adjacent = size => new Array(size)
  .fill(null)
  .map((_, index) => index);

/** @param {number} size */
export const rotateClockwise = (size) => {
  /** @type {[number[], number[]]} */
  const arr = new Array(size)
    .fill(null)
    .reduce((newArr, _, index) => {
      newArr[index % 2].push(index);
      return newArr;
    }, [
      [],
      [],
    ]);
  const nextPlayer1 = arr[0].splice(1, 1)[0];
  const lastPlayer2 = /** @type {number} */(arr[1].pop());
  const newPlayer1 = [
    ...arr[0],
    lastPlayer2,
  ];
  const newPlayer2 = [
    nextPlayer1,
    ...arr[1],
  ];
  const newArr = newPlayer1.map((player, matchIndex) => ([
    player,
    newPlayer2[matchIndex],
  ]));
  return newArr.flat();
};

/** @param {number} size */
export const rotateCounterClockwise = (size) => {
  /** @type {[number[], number[]]} */
  const arr = new Array(size)
    .fill(null)
    .reduce((newArr, _, index) => {
      newArr[index % 2].push(index);
      return newArr;
    }, [
      [],
      [],
    ]);
  const lastPlayer1 = /** @type {number} */(arr[0].pop());
  const firstPlayer2 = arr[1].shift();
  const newPlayer1 = [
    arr[0][0],
    firstPlayer2,
    ...arr[0].slice(1),
  ];
  const newPlayer2 = [
    ...arr[1],
    lastPlayer1,
  ];
  const newArr = newPlayer1.map((player, matchIndex) => ([
    player,
    newPlayer2[matchIndex],
  ]));
  return newArr.flat();
};
