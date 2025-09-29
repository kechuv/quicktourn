import { browser } from '$app/environment';
import type { Tourn } from '$lib/schemas/tourn.js';
import { getTournament } from '$lib/stores/tournament';
import { redirect } from '@sveltejs/kit';

export const ssr = false;
export const csr = true;
export const load = ({ params }) => {
  if (!browser) return { tourn: {} as Tourn };
  const tourn = getTournament(params.tournId ?? '');
  if (!tourn) redirect(303, '/');
  return {
    tourn: tourn,
  };
};
