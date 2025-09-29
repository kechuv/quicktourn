import { tournSchema, type Tourn } from '$lib/schemas/tourn';

export const getTournament = (tournId: string) => {
  const store_data = localStorage.getItem(tournId);
  if (!store_data) return;
  return tournSchema.parse(JSON.parse(store_data));
};

export const saveTournament = (tourn: Tourn) => {
  const store_data = JSON.stringify(tourn);
  localStorage.setItem(tourn.id, store_data);
};

export const deleteTournament = (tournId: string) => {
  localStorage.removeItem(tournId);
};
