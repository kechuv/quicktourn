import { createTourn } from '$lib/schemas/tourns/tourn.schema';
import { getStorage, setStorage } from '$lib/tools/localStorage';

function createTournStore() {
  /** @typedef {import('$lib/schemas/tourns/tourn.schema').TournSchema} Tourn */

  /** @type {Record<Tourn['slug'], Tourn>} */
  let tournList = $state({});
  /** @type {Tourn['slug']} */
  let lastTourn = $state('');

  $effect.root(function initTournStore() {
    tournList = getStorage('tourns', getTournList);
    lastTourn = getStorage('lastTourn', getLastTourn);

    $effect(function saveTournList() {
      setStorage('tourns', () => tournList || {});
    });
    $effect(function saveLastTourn() {
      setStorage('lastTourn', () => lastTourn || '');
    });
  });

  /** @param {Record<Tourn['slug'], Tourn>} tourns */
  function getTournList(tourns) {
    const values = Object.values(tourns || {});
    if (!values?.length) return {};
    values.forEach(tourn => createTourn(tourn));
    return tourns;
  }
  /** @param {Tourn['slug']} tournSlug */
  function getLastTourn(tournSlug) {
    if (!tournSlug) return '';
    return tournSlug;
  }

  return function TournStore() {
    /** @param {Tourn['slug']} tourn */
    function setLastTourn(tourn) {
      lastTourn = tourn;
    }

    /** @param {Tourn} tourn */
    function addTourn(tourn) {
      tournList = {
        ...tournList,
        [tourn.slug]: tourn,
      };
    }

    /** @param {Tourn['slug']} id */
    function getTourn(id) {
      return tournList[id];
    }

    return {
      get tournList() {
        return tournList;
      },
      get lastTourn() {
        return getTourn(lastTourn);
      },
      addTourn,
      setLastTourn,
      getTourn,
    };
  };
}

export const useTournStore = createTournStore();
