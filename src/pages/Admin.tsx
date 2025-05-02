import React, {ReactElement} from "react";
import { WordleAPI } from "../modules/WordleAPI";
import { ReadonlyGlobalStatistics } from "../modules/contracts/GlobalStatistics";
import { Iterators } from "../modules/util/Iterators";
import { Reacts } from "../modules/util/Reacts";
import {VocabHandler} from "../VocabHandler";

export type AdminProps = {

};

export type AdminState = {
    globalStatistics: ReadonlyGlobalStatistics | null,
};

export class Admin extends React.Component<AdminProps, AdminState> {
    state: AdminState = {
        globalStatistics: null,
    };

    componentDidMount(): void {
        WordleAPI.getGlobalStatistics().then(globalStatistics => {
            this.setState({ globalStatistics });
        });
    }

    render(): ReactElement {
        const { topWords, topLetters } = this.state.globalStatistics ?? {};

        return <>
            <h1>Admin</h1>
            <div style={{
                display: 'flex',
                gap: '20px',
            }}>
                <div>
                    {
                        topWords && Reacts.map(
                            Iterators.limit(topWords.entries(), 5),
                            ([word, count]) => <div key={word}>{word}: {count}</div>,
                        )
                    }
                </div>
                <div>
                    {
                        topLetters && Reacts.map(
                            Iterators.limit(topLetters.entries(), 5),
                            ([letter, count]) => <div key={letter}>{letter}: {count}</div>,
                        )
                    }
                </div>
            </div>
            <div>{ <VocabHandler/> }</div>
        </>;
    }
}
