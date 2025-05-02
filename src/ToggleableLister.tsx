import React from "react";
import {Lister} from "./Lister";

type Props = {
    show: boolean,
    toggle: () => void,
    title: string,
    listerTitle: string,
    list: string[],
};
type State = {};
export class ToggleableLister extends React.Component<Props, State> {
    private buttonRef = React.createRef<HTMLButtonElement>();
    render() {
        const {
            show,
            title,
            list,
            toggle,
        } = this.props;

        return (<>
            <span>
                {this.props.title}
                <button ref={this.buttonRef} onClick={() => {
                    toggle();
                    this.buttonRef.current?.blur();
                }}>
                    {show && "Hide"}{!show && "Show"}
                </button>
            </span>
            {
                show &&
                <Lister
                    title={title}
                    list={list}
                />
            }
        </>);
    }
}