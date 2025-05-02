import {generateSuggestedGuesses} from "../server/modules/SuggestedGuessGenerator";

const dataProvider = [
    {
        //5, 17, 39
        dict: [],
        currentGuess: "ABCDE",
        targetWord: "ABBBB",
        excludedLetters: "",
        expected: [],
    },
    {
        //5, 17, 19, 17, 39
        dict: ["ABCDE"],
        currentGuess: "ABCDE",
        targetWord: "ABBBB",
        excludedLetters: "A",
        expected: [],
    }, {
        //5, 17, 19, 20, 17, 39
        dict: ["ABCDE"],
        currentGuess: "ABCDE",
        targetWord: "ABBBB",
        excludedLetters: "",
        expected: [],
    }, {
        //5, 17, 19, 20, 27a, 27b, 36, 17, 39
        dict: [""],
        currentGuess: "",
        targetWord: "",
        excludedLetters: "",
        expected: [],
    }, {
        //5, 17, 19, 20, 27a, 27b, 30, 31, 27a, 36, 17, 39
        dict: ["A"],
        currentGuess: "Z",
        targetWord: "Z",
        excludedLetters: "",
        expected: [],
    }, {
        //5, 17, 19, 20, 27a, 27b, 30, 27a, 27b,
        //36, 36a, 17, 19, 20, 17, 19, 17, 19, 17, 39
        dict: ["ZB", "ZA", "G", "H"],
        currentGuess: "ZA",
        targetWord: "ZC",
        excludedLetters: "GH",
        expected: ["ZB"],
    },
];

describe.each(dataProvider)(
    "Generate Suggested Guesses Tests",
    ({dict, currentGuess, targetWord, excludedLetters, expected})=> {
    it("Returned array contains the proper elements", () => {
        const actual = generateSuggestedGuesses(dict, currentGuess, targetWord, excludedLetters, "");
        if(expected.length == 0) {
            expect(actual).toStrictEqual([]);
        } else {
            for(const e of expected) {
                expect(actual).toContain(e);
            }
        }
    });
});