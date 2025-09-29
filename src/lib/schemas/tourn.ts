import z from 'zod';
import { matchSchema } from './match';
import { participantResultsSchema } from './leaderboard';

export const tournFormats = ['round-robin', 'single-elimination'] as const;
export type TournFormat = (typeof tournFormats)[number];

export const participantSchema = z.string();
export type Participant = z.infer<typeof participantSchema>;

export const tournSchema = z.object({
  id: z.string(),
  format: z.enum(tournFormats),
  name: z.string(),
  participants: z.array(participantSchema),
  matches: matchSchema.array(),
  leaderboard: participantResultsSchema.array(),
});

export type Tourn = z.infer<typeof tournSchema>;
