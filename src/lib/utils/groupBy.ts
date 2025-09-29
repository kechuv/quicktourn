export const groupBy = <V, K extends string | number | symbol>(
  arr: V[],
  fn: (el: V) => K,
) =>
  arr.reduce(
    (obj, el) => {
      const idx = fn(el);
      if (!obj[idx]) obj[idx] = [];
      obj[idx].push(el);
      return obj;
    },
    {} as Record<K, V[]>,
  );
