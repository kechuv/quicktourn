import { tournSchema } from '$lib/schemas/tourn';
import type z from 'zod';

const tournListElementSchema = tournSchema.pick({
  id: true,
  name: true,
  format: true,
});
export type TournListElement = z.infer<typeof tournListElementSchema>;

export function getTournList() {
  const storeData = localStorage.getItem('_tournList');
  if (!storeData) return [];

  const list = tournListElementSchema.array().parse(JSON.parse(storeData));
  return list;
}

export function saveTournList(list: TournListElement[]) {
  const storeData = JSON.stringify(list);
  localStorage.setItem('_tournList', storeData);
}
