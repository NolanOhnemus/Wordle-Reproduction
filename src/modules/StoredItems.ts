import { serializedWordleSchema } from "./contracts/SerializedWordle";
import { totalStatisticsSchema } from "./contracts/TotalStatistics";
import { LocalStorageItem } from "./util/LocalStorage";

export const storedItems = {
    wordle: new LocalStorageItem('wordle', serializedWordleSchema),
    totalStatistics: new LocalStorageItem('totalStatistics', totalStatisticsSchema),
} as const;
