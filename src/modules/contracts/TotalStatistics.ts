import { z } from "zod";
import { DeepReadonly } from "../../types/DeepReadonly";

export const totalStatisticsSchema = z.object({
    totalGamesPlayed: z.number(),
    totalGuesses: z.number(),
    guesses: z.array(z.tuple([z.string(), z.number()])),
    letters: z.array(z.tuple([z.string(), z.number()])),
});

export type TotalStatistics = z.output<typeof totalStatisticsSchema>;
export type ReadonlyTotalStatistics = DeepReadonly<TotalStatistics>;
