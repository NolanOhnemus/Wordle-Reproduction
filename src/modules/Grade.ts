import { ObjectValues } from "../types/ObjectValues";
import { Colors } from "./Colors";

export const SerializedGrade = {
    Wrong: 'w',
    Almost: 'a',
    Correct: 'c',
} as const;
export type SerializedGrade = ObjectValues<typeof SerializedGrade>;

export class Grade {
    static readonly Wrong = new Grade(SerializedGrade.Wrong, Colors.LightGrey);
    static readonly Almost = new Grade(SerializedGrade.Almost, Colors.Yellow);
    static readonly Correct = new Grade(SerializedGrade.Correct, Colors.Green);

    static deserialize(serialized: SerializedGrade): Grade {
        switch(serialized) {
            case SerializedGrade.Wrong: return Grade.Wrong;
            case SerializedGrade.Almost: return Grade.Almost;
            case SerializedGrade.Correct: return Grade.Correct;
        }
    }

    private constructor(
        readonly serialized: SerializedGrade,
        readonly color: string,
    ) {}
}
