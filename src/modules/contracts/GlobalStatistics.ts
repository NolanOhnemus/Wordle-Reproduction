import { z } from 'zod';
import { GameStatistics } from './GameStatistics';

export type GlobalStatisticsRecord = z.output<typeof GlobalStatistics.RECORD_SCHEMA>;

export class GlobalStatistics {
    static readonly RECORD_SCHEMA = z.object({
        topWords: z.array(z.tuple([z.string(), z.number()])),
        topLetters: z.array(z.tuple([z.string(), z.number()])),
        gamesPlayed: z.number(),
    });

    static parse(record: GlobalStatisticsRecord): GlobalStatistics {
        return new GlobalStatistics(
            new Map(record.topWords.sort((a, b) => b[1] - a[1])),
            new Map(record.topLetters.sort((a, b) => b[1] - a[1])),
            record.gamesPlayed,
        );
    }

    private constructor(
        public topWords: Map<string, number>,
        public topLetters: Map<string, number>,
        public gamesPlayed: number,
    ) {}

    register(stats: GameStatistics): this {
        this.gamesPlayed++;

        for(const word of stats.guesses) {
            this.topWords.set(word, (this.topWords.get(word) ?? 0) + 1);
            for(const letter of word) {
                this.topLetters.set(letter, (this.topLetters.get(letter) ?? 0) + 1);
            }
        }

        return this;
    }

    serialize(): GlobalStatisticsRecord {
        return {
            topWords: [...this.topWords.entries()],
            topLetters: [...this.topLetters.entries()],
            gamesPlayed: this.gamesPlayed,
        };
    }
}

export interface ReadonlyGlobalStatistics {
    readonly topWords: ReadonlyMap<string, number>,
    readonly topLetters: ReadonlyMap<string, number>,
    readonly gamesPlayed: number,
}
