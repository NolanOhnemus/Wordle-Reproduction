import { ObjectValues } from "../types/ObjectValues";

export const Colors = {
    Green: '#538D4E',
    Yellow: '#B59F3B',
    LightGrey: '#3A3A3C',
    Red: '#D16666',
    DarkGrey: '#424242',
    Clear: '#00000000',
} as const;
export type Colors = ObjectValues<typeof Colors>;
