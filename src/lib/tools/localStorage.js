/**
 * @template In, Out
 * @param {string} key
 * @param {(data: In) => Out} fn
 */
export function getStorage(key, fn) {
  const data = localStorage.getItem(key) || 'null';
  return fn(JSON.parse(data));
}
/**
 * @param {string} key
 * @param {() => any} fn
 */
export function setStorage(key, fn) {
  localStorage.setItem(key, JSON.stringify(fn() ?? 'null'));
}
