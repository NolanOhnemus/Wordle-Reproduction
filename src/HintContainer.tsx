import React from "react";
import { Grade } from "./modules/Grade";
import {GuessLetter} from "./GuessLetter";

type Props = {
    hintLetter? : string,
    hintUsed? : boolean,
    getLetterHint :() => void,
}

type State = {

}

export default class HintContainer extends React.Component<Props, State> {
    private buttonRef = React.createRef<HTMLButtonElement>();

    render(): JSX.Element {
        if(this.props.hintLetter === undefined || this.props.hintUsed === undefined) {
            return <></>;
        }

        const { getLetterHint } = this.props;

        const buttonOnClick = (): void => {
            getLetterHint();
            this.buttonRef.current?.blur();
        };

        if(!this.props.hintUsed) {
            return (
                <div className={"wordle-container"}
                    style={{
                        border: "solid",
                        borderWidth: 3,
                        borderColor: "#424242",
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <GuessLetter
                        letter={'?'}
                    />
                    <button ref={this.buttonRef} onClick={() => buttonOnClick()}
                        style={{
                            backgroundColor: '#424242',
                            border: 'solid',
                            borderWidth: 3,
                            borderColor: '#424242',
                            color: 'white',
                            fontSize: 18,
                            padding: 10,
                            width: 220,
                        }}
                    >Get a hint!</button>
                </div>
            );
        } else {
            if(this.props.hintLetter === "all found") {
                return (
                    <div className={"wordle-container"}
                    style={{
                        border: "solid",
                        borderWidth: 3,
                        borderColor: "#424242",
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                    {"You have found all the letters in the word!"}
                    </div>
                );
            }
            return (
                <div className={"wordle-container"}
                style={{
                    border: "solid",
                    borderWidth: 3,
                    borderColor: "#424242",
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                <GuessLetter
                    letter={this.props.hintLetter}
                    grade={Grade.Correct}
                />
                </div>
            );
        }
    }
}
