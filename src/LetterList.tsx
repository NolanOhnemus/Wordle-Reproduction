import React, {ReactElement} from "react";
import {GuessLetter} from "./GuessLetter";
import {Grade} from "./modules/Grade";
import {Tower} from "./modules/util/data-structure/Tower";
import {Iterators} from "./modules/util/Iterators";

type Props = {
    grades: Grade[][],
    guesses: Tower<string>,
}

type State = {

}

export class LetterList extends React.Component<Props, State> {
    static readonly alphabet: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    readonly letterGrades: Map<string, Grade> = new Map<string, Grade>();

    setLetterGrade(letter: string, grade: Grade | undefined) : void {
        const letterGrade = this.letterGrades.get(letter);

        if(grade === Grade.Correct) {
            this.letterGrades.set(letter, grade);
        } else if(grade === Grade.Almost && letterGrade !== Grade.Correct) {
            this.letterGrades.set(letter, grade);
        } else if(letterGrade === undefined) {
            this.letterGrades.set(letter, Grade.Wrong);
        }
    }

    locations(substring : string, str : string) : number[] {
        const a = [];
        let i = -1;
        while((i = str.indexOf(substring, i + 1)) >= 0) a.push(i);
        return a;
    }

    render() : ReactElement {
        this.letterGrades.clear();
        const alphabetLines: ReactElement[] = [];
        for(let i = 0; i < 26; i++) {
            const letter = LetterList.alphabet[i];

            for(const [guess, guessGrades] of Iterators.limit(Iterators.zip(this.props.guesses,
                this.props.grades), this.props.guesses.length - 1)) {

                if(letter !== undefined && guess.includes(letter)) {
                    const indexes = this.locations(letter, guess);
                    for(let j = 0; j < indexes.length; j++) {
                        const index = indexes[j];
                        if(index !== undefined) {
                            this.setLetterGrade(letter, guessGrades[index]);
                        }
                    }
                }
            }
            if(letter !== undefined) {
                alphabetLines[i] = <GuessLetter
                    letter={letter}
                    key={`${i}-Letter`}
                    grade={this.letterGrades.get(letter)}
                    small={true}
                />;
            }
        }
        return (
            <div className={"letter-list"} 
                style={{
                    paddingBottom: 10,
                }}>
                {alphabetLines}
            </div>
        );
    }
}
