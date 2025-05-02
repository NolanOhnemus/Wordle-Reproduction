import { storedItems } from "./StoredItems";
import { ReadonlyTotalStatistics } from "./contracts/TotalStatistics";

export class WordleStatisticsManager {
    private readonly guesses: Map<string, number> = new Map();
    private readonly letters: Map<string, number> = new Map();

    static deserialize(serialized: ReadonlyTotalStatistics): WordleStatisticsManager {
        const manager = new WordleStatisticsManager(serialized.totalGamesPlayed, serialized.totalGuesses);
        for(const [key, value] of serialized.guesses) {
            manager.guesses.set(key, value);
        }
        for(const [key, value] of serialized.letters) {
            manager.letters.set(key, value);
        }
        return manager;
    }

    /** Default constructor sets total games played to 1 and total guesses to 0
     *  as it assumes you have never made a guess before initializing stats and
     *  that you have started one game.
     */
    constructor(
        private totalGamesPlayed: number = 1,
        private totalGuesses: number = 0,
    ) {}

    private serialize(): ReadonlyTotalStatistics {
        return {
            totalGamesPlayed: this.totalGamesPlayed,
            totalGuesses: this.totalGuesses,
            guesses: [...this.guesses],
            letters: [...this.letters],
        };
    }

    store(): void {
        storedItems.totalStatistics.set(this.serialize());
    }

    /** This method increases the internal games played variable in the game's statistics */
    incrementGamesPlayed(): void {
        this.totalGamesPlayed += 1;
    }

    /** This method increases the internal guesses made variable in the game's statistics */
    incrementTotalGuesses(): void {
        this.totalGuesses += 1;
    }

    /**
     * This method calculates the average guesses made based off the total guesses and games played.
     * If no games have been played it returns 0 to avoid any division by zeros.
     * @returns the average number of guesses made or 0
     */
    get computeAverage(): number {
        if(this.totalGamesPlayed === 0) return 0;
        return this.totalGuesses / this.totalGamesPlayed;
    }

    /**
     * This method adds the guess the player made into the guesses map for statistics. It will also increment
     * the number of guesses made and increment the number of times a letter has been guessed.
     * @param guess the guess that the player has made.
     */
    add(guess: string): void {
        const upperCaseGuess = guess.toUpperCase();
        this.incrementTotalGuesses();
        this.incrementValue(this.guesses, upperCaseGuess);
        for(const c of upperCaseGuess) {
            this.incrementValue(this.letters, c);
        }
        this.store();
    }

    /**
     * This method returns the top n guesses from the internal map based on how many times they've been guessed.
     * @param num the number of top guessed words we want
     * @returns the top n words from the guesses map
     */
    getTopGuessedWords(num: number = 5) :string[] {
        return this.findTopFromMap(this.guesses, num);
    }

    /**
     * This method returns the top n letters from the internal map based on how many times they've been guessed.
     * @param num number of top guessed letters we want
     * @returns the top n letters from the letters map
     */
    getTopGuessedLetters(num: number = 5) :string[] {
        return this.findTopFromMap(this.letters, num);
    }

    /** This method will reset all statistics */
    reset(): void {
        this.guesses.clear();
        this.letters.clear();
        this.totalGamesPlayed = 1;
        this.totalGuesses = 0;
        this.store();
    }

    // /**
    //  * This method scans a map and returns the top num elements in the map based on frequency.
    //  * @param map the map we will search through
    //  * @param num the number of elements we want
    //  * @returns returns an array of strings representing the top n results in the map or an
    //  *          empty array if there is nothing in the map.
    //  */
    private findTopFromMap(map: Map<string, number>, num: number): string[] {
        return [...map.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, num)
            .map(entry => entry[0]);
    }

    /**
     * This method adjusts the frequency of the key in a map to show that it has appeared in the game one more time.
     * @param map the map the key is in to increment
     * @param key the key to increment
     */
    private incrementValue(map: Map<string, number>, key: string): void {
        map.set(key, (map.get(key) ?? 0) + 1);
    }
}

