import {Grade} from "../../modules/Grade";
import {GuessGrader} from "../../modules/GuessGrader";
import gradeAgainst = GuessGrader.gradeAgainst;

function generateSuggestedGuesses (
    dictionary: string[],
    currentGuess: string,
    targetWord: string,
    excludedLetters: string,
    includedLetters: string,
) :string[] {
    if(currentGuess.length !== targetWord.length) return [];

    //Grade the user's current guess
    const gradeToMatch = gradeAgainst(currentGuess, targetWord);
    //Create an array to store the suggested words
    const suggestedWords :string[] = [];
    //Loop through the dictionary array
    for(const w of dictionary) {
        //Check the word to see if it has any excluded letters -> go to the next word if so
        if(includesAny(w, excludedLetters)) continue;
        if(w === currentGuess) continue;
        //Grade the word against the target word
        const wGrade = gradeAgainst(w, targetWord);

        //Compare the current guess's grade with the word's grade
        let ok :boolean = true;

        for(let i = 0; ok && i < gradeToMatch.length; i++) {
            //If the there is an index where the current guess and the word do not both have a correct grade,
            //move to the next word
            if(gradeToMatch[i] == Grade.Correct && wGrade[i] != Grade.Correct) {
                ok = false;
            }
        }

        //Otherwise add it to the suggested words array.
        if(ok && includesAll(w, includedLetters)) suggestedWords.push(w);
    }

    return suggestedWords.slice(0, Math.min(5, suggestedWords.length));
}

export{
    generateSuggestedGuesses,
};

function includesAny(word :string, letters :string) {
    if(letters == "") return false;
    for(const l of letters) {
        if(word.includes(l)) return true;
    }
    return false;
}

function includesAll(word: string, letters: string) {
    if(letters === "") return true;
    for(const l of letters) {
        if(!word.includes(l)) return false;
    }
    return true;
}