import { z } from 'zod';
import { Fetches } from './util/Fetches';
import { GameStatistics } from './contracts/GameStatistics';
import { GlobalStatistics, ReadonlyGlobalStatistics } from './contracts/GlobalStatistics';

const searchJSONSchema = z.object({
    found: z.boolean(),
    message: z.string(),
});

export namespace WordleAPI {

    /**
     * This method sends a request to the server to see if a guess made by the player is in
     * the current dictionary. It returns a promise with the status message from the server.
     * @param guess the current guess the player has made
     * @returns A Promise<String> that may contain a string containing if the word is in the
     *          dictionary or not.
     */
    export async function search(guess: string): Promise<string> {
        const { found, message } = await Fetches.get(`/search?guess=${guess}`, searchJSONSchema);
        if(!found) throw new Error(message);
        return message;
    }

    /**
     * This method requests a new word from the server. If it is able to find a new word it will
     * return a promise string containing the new word.
     * @returns a Promise<String> containing either the new word or null.
     */
    export function newWord(): Promise<string> {
        return Fetches.get('/newWord', z.string());
    }

    export function getSuggestions(
        targetWord: string,
        currentGuess: string,
        excludedLetters: string,
        includedLetters: string,
    ): Promise<string[]> {
        const input: string =
            `/getSuggestedWords?` +
            `targetWord=${targetWord}&` +
            `currentGuess=${currentGuess}&` +
            `excludedLetters=${excludedLetters}&` +
            `includedLetters=${includedLetters}`;
        return Fetches.get(input, z.array(z.string()));
    }

    export function postGameStatistics(gameStatistics: GameStatistics): Promise<string> {
        return Fetches.post('/postGameStatistics', gameStatistics, z.string());
    }

    export async function getGlobalStatistics(): Promise<ReadonlyGlobalStatistics> {
        const record = await Fetches.get('/getGlobalStatistics', GlobalStatistics.RECORD_SCHEMA);
        return GlobalStatistics.parse(record);
    }

    export async function dbAddVocab(file: string): Promise<void> {
        const response = await fetch(`/dbAddVocab?src=${file}`);
        if(!response.ok) throw new Error(response.statusText);
    }

    export async function dbClearVocab(): Promise<void> {
        const response = await fetch('/dbClearVocab');
        if(!response.ok) throw new Error(response.statusText);
    }
}
