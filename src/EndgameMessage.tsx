import React from "react";
import { WordleStatus } from './modules/Wordle';
import { Grade } from "./modules/Grade";
import { Colors } from "./modules/Colors";

type Props = {
    status: WordleStatus | undefined,
    loseMessage? : string,
    gameOver: () => void,
}

type State = {

}

export class EndgameMessage extends React.Component<Props, State> {

    private buttonRef = React.createRef<HTMLButtonElement>();

    render():JSX.Element {

        const {gameOver} = this.props;

        const buttonOnClick = () :void => {
            gameOver();
            this.buttonRef.current?.blur();
        };

        if(this.props.status == 'won') {
            return (
                <div className={"endMessageContianer"} style={{paddingBottom: 10}}>
                    <>
                        <div className={"endMessageBox"}
                        style={{
                            color: Grade.Correct.color,
                            border: 'solid',
                            borderColor: Grade.Correct.color,
                            borderWidth: 3,
                            padding: 10,
                        }}>{"Congrats! You won!"}</div>
                        <button ref={this.buttonRef} onClick={() => buttonOnClick()}
                            style={{
                                backgroundColor: Grade.Correct.color,
                                border: 'solid',
                                borderWidth: 3,
                                borderColor: Colors.DarkGrey,
                                color: 'white',
                                width: window.outerWidth / 3.87,
                                padding: 10,
                            }}>
                        Play Again</button>
                        </>
                </div>
            );
        } else if(this.props.status == 'lost') {
            const loseMessages = this.props.loseMessage?.split('\n');

            return (<>
                <div className={"endMessageContainer"} style={{paddingBottom: 10}}>
                    <>
                        <div className={"endMessageBox"}
                        style={{
                            color: Colors.Red,
                            border: 'solid',
                            borderColor: Colors.Red,
                            borderWidth: 3,
                            padding: 10,
                        }}>
                            <p>{loseMessages?.[0] ?? "You lose!"}</p>
                            {loseMessages?.[1] !== undefined && <p>{loseMessages[1]}</p>}
                        </div>
                        <button ref={this.buttonRef} onClick={() => buttonOnClick()}
                            style={{
                                backgroundColor: Colors.Red,
                                border: 'solid',
                                borderWidth: 3,
                                borderColor: Colors.DarkGrey,
                                color: 'white',
                                width: window.outerWidth / 3.87,
                                padding: 10,
                            }}>
                        Play Again</button>
                        </>
                </div>
            </>
        );
        } else {
            return <></>;
        }
    }
}
