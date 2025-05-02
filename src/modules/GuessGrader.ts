import { Grade } from "./Grade";
import { Iterators } from "./util/Iterators";

export namespace GuessGrader {
    /**
     * This function compates a guess word to a target word and returns an array of guesses.
     * @param guess the current guess the player has made
     * @param target the target word that the player is trying to guess
     * @returns an array of Grade objects representing what letters are correct
     */
    export function gradeAgainst(guess: string, target: string): Grade[] {
        const lowerCaseGuess = guess.toLowerCase();
        const lowerCaseTarget = target.toLowerCase();

        if(lowerCaseGuess.length !== lowerCaseTarget.length) {
            throw new Error("Guessed word and target word must be the same length!");
        }

        const grades: Grade[] = [];
        const incorrectGuesses: [string, number][] = [];

        const missingLetterCounts = new Map<string, number>();
        for(const [[guessLetter, targetLetter], i] of
            Iterators.enumerate(Iterators.zip(lowerCaseGuess, lowerCaseTarget))) {
            if(guessLetter === targetLetter) {
                grades[i] = Grade.Correct;
            } else {
                incorrectGuesses.push([guessLetter, i]);
                const count = missingLetterCounts.get(targetLetter);
                missingLetterCounts.set(targetLetter, (count ?? 0) + 1);
            }
        }

        for(const [guessLetter, i] of incorrectGuesses) {
            grades[i] = gradeLetterGuess(guessLetter, missingLetterCounts);
        }

        return grades;
    }
}

/**
 * Returns the Grade for a letter that was not graded Correct based on how many time the
 * letter appears in the target word in a different position
 * @param guess single char TODO
 * @param missingLetterCounts TODO
 */
function gradeLetterGuess(guess: string, missingLetterCounts: Map<string, number>): Grade {
    const count = missingLetterCounts.get(guess);
    if(count === undefined || count === 0) return Grade.Wrong;

    missingLetterCounts.set(guess, count - 1);
    return Grade.Almost;
}
