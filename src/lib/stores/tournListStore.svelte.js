import { createTourn } from '$lib/schemas/tourns/tourn.schema';
import { getStorage, setStorage } from '$lib/tools/localStorage';

function createTournListStore() {
  /** @typedef {import('$lib/schemas/tourns/tourn.schema').TournSchema} Tourn */

  /** @type {Record<Tourn['slug'], Tourn>} */
  let tournList = $state({});
  /** @type {Tourn['slug']} */
  let lastTourn = $state('');

  $effect.root(function initTournListStore() {
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

    /** @param {Tourn['slug']} id */
    function getTourn(id = lastTourn) {
      return tournList[id];
    }

    /** @param {Tourn} tourn */
    function addTourn(tourn) {
      tournList = {
        ...tournList,
        [tourn.slug]: tourn,
      };
    }

    /** @param {Tourn} tourn */
    function updateTourn(tourn) {
      if (!tournList[tourn.slug]) return;
      tournList[tourn.slug] = tourn;
    }

    /** @param {Tourn['slug']} id */
    function deleteTourn(id) {
      delete tournList[id];
    }

    return {
      get tournList() {
        return tournList;
      },
      get lastTourn() {
        return lastTourn;
      },
      get currentTourn() {
        return tournList[lastTourn];
      },
      addTourn,
      setLastTourn,
      getTourn,
      updateTourn,
      deleteTourn,
    };
  };
}

export const useTournListStore = createTournListStore();
