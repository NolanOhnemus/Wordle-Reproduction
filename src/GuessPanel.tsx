import React, { ReactElement } from "react";
import {GuessLine} from "./GuessLine";
import { Grade } from "./modules/Grade";
import { Tower } from "./modules/util/data-structure/Tower";

type Props = {
    guesses: Tower<string>,
    guessLength: number,
    guessTotal: number,
    grades: Grade[][],
}

type State = {

}

export class GuessPanel extends React.Component<Props, State> {

    render() :JSX.Element {
        const lineArray: ReactElement[] = [];
        for(let i = 0; i < this.props.guessTotal; i++) {
            lineArray[i] = <GuessLine
                guess={this.props.guesses.at(i)}
                guessLength={this.props.guessLength}
                key={`${i}-Line`}
                grades={this.props.grades[i]}
            />;
        }
        return (
            <div className={"wordle-container"}>
                {lineArray}
            </div>
        );
    }
}
