import z from 'zod';

export const participantResultsSchema = z.object({
  participant: z.string(),
  w: z.number(),
  d: z.number(),
  l: z.number(),
});
export type ParticipantResults = z.infer<typeof participantResultsSchema>;
