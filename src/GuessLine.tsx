import React, { ReactElement } from "react";
import {GuessLetter} from "./GuessLetter";
import { Grade } from "./modules/Grade";

type Props = {
    guess: string | undefined,
    guessLength: number,
    grades: Grade[] | undefined,
}

type State = {

}

export class GuessLine extends React.Component<Props, State> {

    render():JSX.Element {
        const letterArray: ReactElement[] = [];
        for(let i = 0; i < this.props.guessLength; i++) {

            let letter: string | undefined = undefined;
            const guess = this.props.guess;

            if(guess !== undefined) {
                if(i < guess.length) {
                    letter = guess[i];
                }
            }
            letterArray[i] = <GuessLetter
                letter={letter}
                key={`${i}-Letter`}
                grade={this.props.grades?.[i]}
            />;
        }
        return (
            <div className={"guess-line"}>
                {letterArray}
            </div>
        );
    }
}
