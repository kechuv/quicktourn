import slugify from '$lib/tools/slugify';
import { z } from 'zod';

export const tournParticipant = z.string();

/** @typedef {z.infer<typeof tournFormats>} TournFormats */
export const tournFormats = z.enum([
  'roundRobin',
  'singleBracket',
]);

/** @typedef {Record<TournSchema['slug'], TournSchema>} TournsMap */
/** @typedef {z.infer<typeof tournSchema>} TournSchema */
export const tournSchema = z.object({
  id: z.string().uuid()
    .default(() => crypto.randomUUID()),
  format: tournFormats,
  name: z.string(),
  slug: z.string(),
  participants: tournParticipant.array().default([]),
  rounds: z.any().array()
    .default([]),
});

/** @param {OptionalExcept<TournSchema, 'name'|'format'>} tourn */
export const createTourn = (tourn) => {
  return tournSchema.parse({
    ...tourn,
    slug: slugify(tourn.name),
  });
};
