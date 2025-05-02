import { Wordle } from "../modules/Wordle";
import fetchMock from 'fetch-mock';
import {LetterList} from "../LetterList";
import {Grade} from "../modules/Grade";

let wordle: Wordle;
let letterList: LetterList;
let letterGrades: Map<string, Grade>;
/*
 * What tests need to occur for the letter list?
 * Check that all letters' grades are undefined when no guesses / when guess not finished
 * Check that it correctly puts the grade color on letters when letter guessed, ie (wrong, almost, and correct)
 * Check that almost correct changes to correct when a correct letter is guessed
 * Check that no letter changes from almost correct/correct to wrong
 * Check that no letter goes from a grade to undefined
 * Check that no correct letter changes to almost correct
 */
beforeEach(() => {
    wordle = new Wordle("avoid");
    letterList = new LetterList(wordle.info);
    letterGrades = letterList.letterGrades;
    //letterGrades = new Map<string, Grade>();

    fetchMock.mock('path:/search', {
        found: true,
        message: `WORLD is a valid word!`,
    });
});

afterEach(() => {
    fetchMock.restore();
});

function addString(string: string) : void {
    for(const char of string) {
        wordle.addCharacter(char);
    }
}

describe("Letter List Tests", ()=>{
    it("No Initial Grades", ()=>{
        expect(letterGrades.size).toBe(0);
    });
    it("Recognise All Types of Letter Grades", async ()=>{
        addString('chard');
        await wordle.submitGuess();
        await letterList.render();
        expect(letterGrades.get('Z')).toBe(undefined);
        expect(letterGrades.get('C')).toBe(Grade.Wrong);
        expect(letterGrades.get('A')).toBe(Grade.Almost);
        expect(letterGrades.get('D')).toBe(Grade.Correct);
    });
    describe("Graded Letters Do not Get Less Correct", ()=>{
        it("Correct Stays Correct", async()=>{
            addString('avail');
            await wordle.submitGuess();
            await letterList.render();

            expect(letterGrades.get('A')).toBe(Grade.Correct);
            expect(letterGrades.get('V')).toBe(Grade.Correct);
            expect(letterGrades.get('I')).toBe(Grade.Correct);

            addString('brood');
            await wordle.submitGuess();
            await letterList.render();

            expect(letterGrades.get('O')).toBe(Grade.Correct);
            expect(letterGrades.get('D')).toBe(Grade.Correct);

            addString('vapor');
            await wordle.submitGuess();
            await letterList.render();

            expect(letterGrades.get('A')).toBe(Grade.Correct);
            expect(letterGrades.get('V')).toBe(Grade.Correct);
            expect(letterGrades.get('O')).toBe(Grade.Correct);
            expect(letterGrades.get('I')).toBe(Grade.Correct);
            expect(letterGrades.get('D')).toBe(Grade.Correct);
        });
        it("Almost & Wrong Grades Upgrade", async ()=>{
            addString('vapor'); //avoid
            await wordle.submitGuess();
            await letterList.render();

            expect(letterGrades.get('V')).toBe(Grade.Almost);
            expect(letterGrades.get('A')).toBe(Grade.Almost);
            expect(letterGrades.get('O')).toBe(Grade.Almost);

            addString('alive');
            await wordle.submitGuess();
            await letterList.render();

            // a upgrades here
            expect(letterGrades.get('A')).toBe(Grade.Correct);
            expect(letterGrades.get('I')).toBe(Grade.Almost);
            // v does not downgrade here
            expect(letterGrades.get('V')).toBe(Grade.Almost);

            addString('avoid');
            await wordle.submitGuess();
            await letterList.render();

            // all correct chars upgrade
            expect(letterGrades.get('A')).toBe(Grade.Correct);
            expect(letterGrades.get('V')).toBe(Grade.Correct);
            expect(letterGrades.get('O')).toBe(Grade.Correct);
            expect(letterGrades.get('I')).toBe(Grade.Correct);
            expect(letterGrades.get('D')).toBe(Grade.Correct);

            let noCorrects = true;
            let noAlmosts = true;
            for(const [key, value] of Object.entries(letterGrades)) {
                if(!"AVOID".includes(key)) {
                    if(value === Grade.Almost) {
                        noAlmosts = false;
                    } else if(value === Grade.Correct) {
                        noCorrects = false;
                    }
                }
            }
            expect(noCorrects).toBe(true);
            expect(noAlmosts).toBe(true);
        });
        it("Different levels of correctness in one word", async ()=> {
            wordle = new Wordle("class");
            letterList = new LetterList(wordle.info);
            letterGrades = letterList.letterGrades;

            addString('fussy');
            await wordle.submitGuess();
            await letterList.render();
            expect(letterGrades.get('S')).toBe(Grade.Correct);
        });
    });
});
