import React from "react";
import { Colors } from "./modules/Colors";

type Props = {
    list :string []
    title :string
}

type State = {

}
export class Lister extends React.Component<Props, State> {

    render():JSX.Element {
        const {list, title} = this.props;
        const listAsHTML: JSX.Element[] = [];
        for(let i = 0; i < list.length; i++) {
            listAsHTML.push(<div key={`${i}: ${list[i]}`}>{list[i]}</div>);
        }
        return (<div>
            <div
                className={"Header"}
                style={{
                    color: "white",
                    padding: 10,
                    display: "block",
                    marginTop: 1.33,
                    marginBottom: 1.33,
                    fontWeight: "bold",
                }}>
                {title}
            </div>
            <div
                className={"statisticsLister"}
                style={{
                    color: "white",
                    padding: 20,
                    border: "solid",
                    borderColor: Colors.DarkGrey,
                    borderWidth: 3,
                }}>
                {listAsHTML}
            </div>
        </div>);
    }
}
