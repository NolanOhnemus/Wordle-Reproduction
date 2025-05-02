import { ObjectValues } from "../types/ObjectValues";
import { Grade } from "./Grade";
import { GuessGrader } from "./GuessGrader";
import { WordleAPI } from "./WordleAPI";
import { Tower } from "./util/data-structure/Tower";
import { ReadonlySerializedWordle } from "./contracts/SerializedWordle";
import { storedItems } from "./StoredItems";
import { Random } from "./util/Random";

export type WordleInfo = {
    guesses: Tower<string>,
    guessTotal: number,
    guessLength: number,
    grades: Grade[][],
    status: WordleStatus,
    loseMessage : string,
    hintLetter: string,
    letterHintUsed: boolean,
    title: string,
};

export const WordleStatus = {
    InProgress: 'inProgress',
    Won: 'won',
    Lost: 'lost',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WordleStatus = ObjectValues<typeof WordleStatus>;

export class Wordle {
    static deserialize(serialized: ReadonlySerializedWordle): Wordle {
        const wordle = new Wordle(serialized.targetWord, serialized.guessTotal, serialized.guessLength);
        const guesses = serialized.guesses.slice();
        wordle.guesses.first = guesses.shift() ?? "";
        wordle.guesses.push(...guesses);
        wordle.grades.push(...serialized.grades.map(guess => guess.map(grade => Grade.deserialize(grade))));
        wordle.update();
        return wordle;
    }

    private readonly targetWord: string;
    private readonly guesses = new Tower("");
    private readonly grades: Grade[][] = [];
    private numberOfGuesses = 0;
    private status: WordleStatus = WordleStatus.InProgress;
    private hintLetter: string = "?";
    private letterHintUsed: boolean = false;
    private readonly loseMessages = new Tower(
        "Oh shucks you lost",
        "Wow! You really suck at this!",
        "Uhhhh aren't you supposed to win?",
        "Holy smokes! I've never seen someone so bad!",
        "My blind, deaf, dead grandma plays better than you!",
        "You won! SIKE!",
        "Do you need more guesses next time?",
        "... really?",
        "You lost!",
        "You lost! You should just give up...",
    );
    private readonly wordleTitleTower = new Tower(
        "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle",
        "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle", "Wordle",
        "woedlw",
        "Lurdle",
        "Woooooooooooooooooooorrrrrrrrrrrrrrrrrrrdle",
        "wowowowowrldls",
        "wordsle",
        "word game",
        "Wordel",
        "Words but like you have to guess them",
        "Trutle",
        "Turtle",
    );
    private readonly loseMessage : string = Random.element(this.loseMessages);
    private readonly wordleTitle : string = Random.element(this.wordleTitleTower);
    private searching: boolean = false;
    private excludedLetters = "";
    private includedLetters = "";

    /**
     * Default constructor for the wordle board, note that a targetWord must be defined
     * when initializing the object.
     * @param targetWord the word that the player will be trying to guess
     * @param guessTotal the total number of guesses allowed to be made
     * @param guessLength the length of the guesses that are allowed
     */
    constructor(
        targetWord: string,
        private guessTotal: number = 6,
        private readonly guessLength: number = 5,
    ) {
        this.targetWord = targetWord.toUpperCase();
    }

    /**
     * Returns a string of the last guess made on the wordle board
     * @returns the string of the last guess
     */
    get guess(): string {
        return this.guesses.last;
    }

    private serialize(): ReadonlySerializedWordle {
        return {
            grades: this.grades.map(guess => guess.map(grade => grade.serialized)),
            guesses: this.guesses.slice(),
            guessLength: this.guessLength,
            guessTotal: this.guessTotal,
            targetWord: this.targetWord,
        };
    }

    store(): void {
        storedItems.wordle.set(this.serialize());
    }

    /**
     * Adds a new character to the guess so long as it meets certain conditions
     * 1. The key pressed must be an English language character within the alphabet
     * 2. The player must have guesses remaining in order to type
     * 3. The player has inputed fewer characters than the guess supports
     * @param key the key pressed by the player
     */
    addCharacter(key: string):boolean {
        const char = key.toUpperCase();
        if(char.length !== 1) return false;
        if(!/[A-Z]/.test(char)) throw new Error(`${char} is an invalid input.`);
        if(this.guesses.length > this.guessTotal) throw new Error("User is out of guesses");

        const { guess } = this;
        if(guess.length >= this.guessLength) throw new Error("Press Enter To Continue!");

        this.guesses.last = guess + char;
        return true;
    }

    /**
     * Removes the last character added to the guess so long as one exists.
     */
    removeLastCharacter():void {
        const { guess } = this;
        if(guess.length <= 0) throw new Error("No Character Was Deleted.");

        this.guesses.last = guess.substring(0, guess.length - 1);
    }

    /**
     * Submits the guess to the server to see how correct the guess is. This method does a few things:
     * 1. Checks the guess is of correct length
     * 2. Makes sure the guessed word exists in the dictionary
     * 3. Grades the guess
     * 4. Checks to see if we've won or lost
     * @returns the status of the guess
     */
    async submitGuess(): Promise<string> {
        if(this.searching) throw new Error("Guess submission is already is progress!");

        const { guess } = this;
        if(guess.length < this.guessLength) throw new Error("Guess is not enough characters");

        let searchSuccess: string;
        this.searching = true;
        try {
            searchSuccess = await WordleAPI.search(guess);
        } catch(e) {
            this.searching = false;
            throw e;
        }

        this.guesses.push("");
        const gradedGuess = GuessGrader.gradeAgainst(guess, this.targetWord);
        this.grades.push(gradedGuess);
        this.numberOfGuesses++;
        this.update();

        this.addToExcludedLetters(guess, gradedGuess);
        this.addToIncludedLetters(guess, gradedGuess);

        const status = this.status === WordleStatus.Won
            ? "You win!"
            : this.status === WordleStatus.Lost ? "Game over!" : null;

        this.store();
        this.searching = false;
        return status ?? searchSuccess;
    }

    private computeStatus(): WordleStatus {
        if(this.guesses.at(-2)?.toUpperCase() === this.targetWord.toUpperCase()) return WordleStatus.Won;
        if(this.guesses.length <= this.guessTotal) return WordleStatus.InProgress;
        return WordleStatus.Lost;
    }

    /**
     * Sets the hint letter to be a random letter in the target word as well as setting the hint used
     * variable to true so they player cannot get more than one hint. If the player has guessed all the
     * words in the list already this will return with the string "all found" for future checking in the
     * GUI.
     */
    public getRandomLetter(): void {
        let inGuessesCheck = false;
        let returnedLetter = "";
        for(let i = 0; i < this.guessLength; ++i) {
            const indexOfRandom = Math.floor(Math.random() * this.guessLength);
            const foundLetter = this.targetWord ? this.targetWord[indexOfRandom] : "?" ;
            if(foundLetter === undefined) throw new Error("This should not happen");
            let inGuessCheck = false;
            for(const guess of this.guesses) {
                if(guess.includes(foundLetter)) {
                    inGuessCheck = true;
                    break;
                }
            }
            if(!inGuessCheck) {
                inGuessesCheck = true;
                returnedLetter = foundLetter;
                break;
            }
        }
        if(inGuessesCheck) {
            this.hintLetter = returnedLetter;
        } else {
            this.hintLetter = "all found";
        }
        this.letterHintUsed = true;
    }

    /**
     * This method checks the grades of the last made guess to see if we
     * have reached the end of the game. It also checks if we are out of
     * guesses and will end the game if we are;
     *
     * @returns a boolean depicting if we are at the end of the game
     */
    private update(): void {
        if(this.status !== WordleStatus.InProgress) return;

        this.status = this.computeStatus();

        if(this.status !== WordleStatus.InProgress) {
            WordleAPI.postGameStatistics({
                guesses: this.guesses.slice(0, -1),
            });
        }
    }

    /**
     * Returns true if a game of wordle is currently being played.
     */
    get inProgress(): boolean {
        return this.status === WordleStatus.InProgress;
    }

    public async suggestedWords(word: string): Promise<string[]> {
        return await WordleAPI.getSuggestions(
            this.targetWord,
            word,
            this.excludedLetters,
            this.includedLetters,
        );
    }

    /**
     * Returns information about the current wordle board
     * guesses : The entire guesses that have been made
     * guessTotal : The maximum number of guesses allowed
     * guessLength : How long a guess is allowed to be
     * grades : an array of all the grades made on the guesses
     * status : the current status of the wordle board
     * numberOfGuesses : the current number of guesses made for this game
     */
    get info(): WordleInfo {
        return {
            guesses: this.guesses,
            guessTotal: this.guessTotal,
            guessLength: this.guessLength,
            grades: this.grades,
            status: this.status,
            loseMessage: (this.loseMessage + "\nThe correct word was: " + this.targetWord + ". Bozo"),
            hintLetter: this.hintLetter,
            letterHintUsed: this.letterHintUsed,
            title: this.wordleTitle,
        };
    }

    private addToExcludedLetters(word: string, grade: Grade[]): void {
        for(let i = 0; i < word.length; i++) {
            const letter = word.at(i);
            if(
                letter !== undefined &&
                grade[i] === Grade.Wrong &&
                !this.targetWord.includes(letter) &&
                !this.excludedLetters.includes(letter)
            ) {
                this.excludedLetters += word.at(i);
            }
        }
    }

    private addToIncludedLetters(word: string, grade: Grade[]) {
        for(let i = 0; i < word.length; i++) {
            const letter = word.at(i);
            if(
                letter !== undefined &&
                (grade[i] === Grade.Correct || grade[i] === Grade.Almost) &&
                !this.includedLetters.includes(letter)
            ) {
                this.includedLetters += word.at(i);
            }
        }
    }
}
