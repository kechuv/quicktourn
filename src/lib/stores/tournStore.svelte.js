import { createTourn } from '$lib/schemas/tourns/tourn.schema';
import { getStorage, setStorage } from '$lib/tools/localStorage';
import { unstate } from 'svelte';

function createTournStore() {
  /** @typedef {import('$lib/schemas/tourns/tourn.schema').TournSchema} Tourn */
  /** @typedef {import('$lib/schemas/tourns/tourn.schema').TournsMap} TournsMap */

  /** @type {TournsMap} */
  let tournList = $state.frozen({});
  /** @type {Tourn['slug']} */
  let lastTourn = $state('');

  $effect.root(function initTournListStore() {
    tournList = getStorage('tourns', parseTournList);
    lastTourn = getStorage('lastTourn', parseLastTourn);

    $effect(function saveTournList() {
      setStorage('tourns', () => tournList || {});
    });
    $effect(function saveLastTourn() {
      setStorage('lastTourn', () => lastTourn || '');
    });
  });

  /** @param {TournsMap} tourns */
  function parseTournList(tourns) {
    const values = Object.values(tourns || {});
    if (!values?.length) return /** @type {TournsMap} */({});
    values.forEach(tourn => createTourn(tourn));
    return tourns;
  }
  /** @param {Tourn['slug']} tournSlug */
  function parseLastTourn(tournSlug) {
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
      return unstate(tournList[id]);
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
      const dbTourn = tournList[tourn.slug];
      if (!tourn) return;
      const updated = {
        ...dbTourn,
        ...tourn,
      };
      addTourn(updated);
    }

    /** @param {Tourn['slug']} id */
    function deleteTourn(id) {
      const copy = { ...tournList };
      delete copy[id];
      tournList = copy;
    }

    return {
      get tournList() {
        return unstate(tournList);
      },
      get lastTourn() {
        return unstate(lastTourn);
      },
      get currentTourn() {
        return unstate(tournList[lastTourn]);
      },
      setLastTourn,
      addTourn,
      getTourn,
      updateTourn,
      deleteTourn,
    };
  };
}

export const useTournStore = createTournStore();
