import { z } from 'zod';

export const slotSchema = z.object({
  seed: z.number(),
  player: z.string(),
  isBye: z.boolean(),
  isWinner: z.boolean(),
  score: z.number().nullable(),
});
export type Slot = z.infer<typeof slotSchema>;

export const matchSchema = z.object({
  roundIdx: z.number(),
  matchIdx: z.number(),
  slots: slotSchema.array(),
});
export type Match = z.infer<typeof matchSchema>;
