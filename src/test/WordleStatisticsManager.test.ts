import { WordleStatisticsManager } from "../modules/WordleStatisticsManager";

let wsm = new WordleStatisticsManager();

beforeEach(() => {
   wsm = new WordleStatisticsManager();
});

const dataProvider = [
    {
        wordsToAdd: [],
        expectedTopWords: [],
        expectedTopLetters: []},
    {
        wordsToAdd: ["HAPPY"],
        expectedTopWords: ["HAPPY"],
        expectedTopLetters: ["P", "H", "A", "Y"]},
    {
        wordsToAdd: ["F", "EE", "DDD", "CCCC", "BBBBB", "AAAAAA"],
        expectedTopWords: ["F", "EE", "DDD", "CCCC", "BBBBB"],
        expectedTopLetters: ["A", "B", "C", "D", "E"],
    },
    {
        wordsToAdd: ["B", "B", "B", "B", "B", "B", "B", "B", "AAAACCC", "AAAACCC", "AADDDDE", "EE", "F"],
        expectedTopWords: ["B", "AAAACCC", "AADDDDE", "EE", "F"],
        expectedTopLetters: ["A", "B", "C", "D", "E"],
    },
];

describe.each(dataProvider)(
    "Test Suite for Frequency Statistics",
    ({wordsToAdd, expectedTopWords, expectedTopLetters}) => {
        it("Assert Top Words", () => {
            for(const word of wordsToAdd) {
                wsm.add(word);
            }
            const topWords = wsm.getTopGuessedWords();
            for(let i = 0; i < expectedTopWords.length; i++) {
                expect(topWords[i]).toBe(expectedTopWords[i]);
            }
        });
        it("Assert Top Letters", () => {
            for(const word of wordsToAdd) {
                wsm.add(word);
            }
            const topLetters = wsm.getTopGuessedLetters();
            for(let i = 0; i < expectedTopLetters.length; i++) {
                expect(topLetters[i]).toBe(expectedTopLetters[i]);
            }
        });
        it("Assert Reset Clears Data Structures", () => {
            for(const word of wordsToAdd) {
                wsm.add(word);
            }
            wsm.reset();
            expect(wsm.getTopGuessedWords().length).toBe(0);
            expect(wsm.getTopGuessedLetters().length).toBe(0);
        });
});
