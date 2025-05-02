import { z } from "zod";
import { SerializedGrade } from "../Grade";
import { DeepReadonly } from "../../types/DeepReadonly";

export const serializedWordleSchema = z.object({
    targetWord: z.string(),
    guesses: z.array(z.string()),
    grades: z.array(z.array(z.nativeEnum(SerializedGrade))),
    guessTotal: z.number(),
    guessLength: z.number(),
});

export type SerializedWordle = z.output<typeof serializedWordleSchema>;
export type ReadonlySerializedWordle = DeepReadonly<SerializedWordle>;
