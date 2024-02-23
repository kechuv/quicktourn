import { z } from 'zod';

/** @typedef {z.infer<typeof slot>} Slot */
export const slot = z.object({
  player: z.string(),
  score: z.number().nullable(),
  isBye: z.boolean(),
  status: z.enum(['win', 'lose', 'draw']).nullable(),
  winner: z.boolean(),
});

/** @param {Partial<Slot>} data */
export const createSlot = data => slot.parse({
  player: data.player || 'BYE',
  isBye: !data.player,
  score: data.score ?? null,
  status: data.status ?? null,
  winner: data.winner ?? false,
});
