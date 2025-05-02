import React from "react";

type Props = {
    statisticString : string,
    fontSize? : number,
    fontWeight? : string,
    centered? : boolean,
}

type State = {

}

export class StatsLine extends React.Component<Props, State> {
    render() :JSX.Element {
        if(this.props.centered === true) {
            return (<>
                <div className={"stats-line"}
                 style={{
                    color: "white",
                    textAlign: "center",
                    padding: 10,
                    fontSize: this.props.fontSize,
                    fontWeight: this.props.fontWeight,
                 }}>
                    {this.props.statisticString}
                </div>
            </>);
        } else {
            return (<>
                <div className={"stats-line"}
                 style={{
                    color: "white",
                    padding: 10,
                    fontSize: this.props.fontSize,
                    fontWeight: this.props.fontWeight,
                 }}>
                    {this.props.statisticString}
                </div>
            </>);
        }
    }
}
