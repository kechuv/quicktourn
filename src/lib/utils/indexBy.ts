export function indexBy<V, K extends string | number | symbol>(
  arr: V[],
  fn: (el: V) => K,
) {
  return arr.reduce(
    (obj, currVal) => {
      const key = fn(currVal);
      obj[key] = currVal;
      return obj;
    },
    {} as Record<K, V>,
  );
}
