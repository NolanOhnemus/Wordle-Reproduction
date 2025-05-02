import { Grade } from "../modules/Grade";
import { GuessGrader } from "../modules/GuessGrader";

const testGuess = (guess: string, target: string, expected: string) :void => {
    const expectedGrades: Grade[] = expected.split('').map(char => {
        switch(char) {
            case 'c': return Grade.Correct;
            case 'a': return Grade.Almost;
            case 'w': return Grade.Wrong;
            default: throw new Error(`Invalid Grade char: ${char}`);
        }
    });

    expect(GuessGrader.gradeAgainst(guess, target)).toEqual(expectedGrades);
};

describe('grade-word-guess', () => {
    it('correct guess', () => testGuess("hello", "hello", 'ccccc'));
    it('1 wrong letter', () => testGuess("hellp", "hello", 'ccccw'));
    it('all wrong letters', () => testGuess("abcdf", "hello", 'wwwww'));
    it('2 wrong positions', () => testGuess("wrold", "world", 'caacc'));
    it('all wrong positions', () => testGuess("dlorw", "world", 'aaaaa'));

    it('guess 2 duplicate correct/wrong - target 1', () => testGuess("worod", "world", 'cccwc'));
    it('guess 2 duplicate almost/wrong - target 1', () => testGuess("wrood", "world", 'caawc'));
    it('guess 2 duplicate correct/almost - target 2', () => testGuess("helol", "hello", 'cccaa'));
    it('guess 3 duplicate almost/wrong - target 2', () => testGuess("bbaba", "aaabb", 'awcca'));
    it('guess 3 duplicate correct/almost - target 3', () => testGuess("abbaa", "aaabb", 'caaaa'));

    it('wrong length', () => {
        expect(() => GuessGrader.gradeAgainst("hello", "hello world")).toThrow();
    });
});
