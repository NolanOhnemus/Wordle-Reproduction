import React from "react";

type Props = {
    color: string,
    message: string | null
}

type State = {

}

export class MessageHandler extends React.Component<Props, State> {
    render():JSX.Element {
        if(this.props.message != null) {
            return (<>
                    <div className={"message-box"} style={{color: this.props.color}}>
                        {this.props.message}
                    </div>
                </>
            );
        } else {
            return <></>;
        }
    }
}
