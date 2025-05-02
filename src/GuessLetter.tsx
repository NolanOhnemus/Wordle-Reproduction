import React from "react";
import { Grade } from "./modules/Grade";
import { CSSTools } from "./modules/util/CSSTools";
import { Colors } from "./modules/Colors";

type Props = {
    letter?: string,
    grade?: Grade,
    small?: boolean
}

type State = {

}

export class GuessLetter extends React.Component<Props, State> {
    render(): JSX.Element {
        const color = this.props.grade?.color ?? Colors.Clear;
        return (
            <div
                className={`guess-letter ${this.props.small === true && "small-letter"}`}
                style={{
                    backgroundColor: color,
                    boxShadow: this.props.grade ? 'none' : CSSTools.sharpInsetBoxShadow('3px', Colors.LightGrey),
                }}
            >
                {this.props.letter ?? ""}
            </div>
        );
    }
}
