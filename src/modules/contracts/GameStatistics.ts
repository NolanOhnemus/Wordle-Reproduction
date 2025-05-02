import { z } from "zod";
import { Zods } from "../util/Zods";

export const gameStatisticSchema = Zods.readonly(
    z.object({
        guesses: Zods.readonly(z.array(z.string())),
    }),
);

export type GameStatistics =  z.infer<typeof gameStatisticSchema>;
