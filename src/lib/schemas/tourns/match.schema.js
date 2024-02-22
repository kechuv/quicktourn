import { z } from 'zod';

/** @typedef {MatchScore[]} Match */
/** @typedef {Match[]} Round */
/** @typedef {z.infer<typeof matchScore>} MatchScore */
export const matchScore = z.object({
  player: z.string(),
  score: z.number().nullish(),
  isBye: z.boolean(),
  status: z.enum(['win', 'lose', 'draw']).optional(),
});

/** @param {MatchScore['player']} player */
export const createMatchScore = player => matchScore.parse({
  player: player || 'BYE',
  isBye: !player,
  score: null,
});

export const matchSchema = z.object({
  roundIndex: z.number().nonnegative(),
  index: z.number().nonnegative(),
  scores: matchScore.array().default([]),
});
