import { Wordle, WordleStatus } from "../modules/Wordle";
import fetchMock from 'fetch-mock';

let wordle: Wordle = new Wordle("hello");

beforeEach(() => {
    wordle = new Wordle("hello");
    fetchMock.mock('path:/search', {
        found: true,
        message: `WORLD is a valid word!`,
    }).mock('path:/newWord', `"hello"`);
});

afterEach(() => {
    fetchMock.restore();
});

function addString(string: string):void {
    for(const char of string) {
        wordle.addCharacter(char);
    }
}

describe("Wordle Tests", () => {
    describe("Add Character Tests", () => {
        describe("Add Character Invalid Inputs", () => {
            it("Add characters past guess length", () => {
                addString('aaaaa');
                expect(() => wordle.addCharacter("a")).toThrow();
            });
            it("Add invalid character", () => {
                expect(() => wordle.addCharacter("0")).toThrow();
            });
            it("Add characters after guesses have been used", async () => {
                for(let i = 0; i < 6; i++) {
                    addString('world');
                    await wordle.submitGuess();
                }
                expect(() => wordle.addCharacter("a")).toThrow();
            });
            it("Add multiple chracters at once", () => {
                expect(wordle.addCharacter("aa")).toBe(false);
            });
            it("Submit too few chracters", async () => {
                addString('aaaa');
                await expect(wordle.submitGuess()).rejects.toThrow();
            });
        });
    });

    describe("Remove Last Character Tests", () => {
        describe("Remove Last Character Valid Input", () => {
            it("Remove Last Character", () => {
                wordle.addCharacter("a");
                wordle.removeLastCharacter();
                expect(wordle.guess).toBe("");
            });
        });
        describe("Remove Last Character Invalid Input", () =>{
            it("Remove character before adding any", () => {
                expect(() => wordle.removeLastCharacter()).toThrow();
            });
            it("Remove 2 character after adding one character", () => {
                wordle.addCharacter("a");
                wordle.removeLastCharacter();
                expect(() => wordle.removeLastCharacter()).toThrow();
            });
        });
    });

    it("Get Info", () => {
        expect(wordle.info).toBeDefined();
    });

    describe("Check if GameOver", () => {
        it("Check if in-progress", () => {
            wordle = new Wordle("hello");
            expect(wordle.info.status).toBe(WordleStatus.InProgress);
            expect(wordle.inProgress).toBe(true);
        });
        it("Check for a finished game that you have won", async () => {
            wordle = new Wordle("pleat");
            wordle.addCharacter('p');
            wordle.addCharacter('l');
            wordle.addCharacter('e');
            wordle.addCharacter('a');
            wordle.addCharacter('t');
            await wordle.submitGuess();
            expect(wordle.info.status).toBe(WordleStatus.Won);
        });
        it("Check for a finished but incorrect game", async () => {
            wordle = new Wordle("pleat");
            for(let i = 0; i < 6; i++) {
                wordle.addCharacter('h');
                wordle.addCharacter('e');
                wordle.addCharacter('l');
                wordle.addCharacter('l');
                wordle.addCharacter('o');
                await wordle.submitGuess();
            }
            expect(wordle.info.status).toBe(WordleStatus.Lost);
        });
    });
});
