import {Lister} from "./Lister";
import React, {ReactElement} from "react";
import {WordleStatisticsManager} from "./modules/WordleStatisticsManager";
import {StatsLine} from "./StatsLine";
import { CSSTools } from "./modules/util/CSSTools";
import { Colors } from "./modules/Colors";

type Props = {
    statisticsManager: WordleStatisticsManager,
    numLetters?: number,
    numWords?: number,
    numGuesses?: number,
    onReset: () => void,
};

type State = {
    statToShow: number,
};

export class FrequencyStatistics extends React.Component<Props, State> {
    private button1Ref = React.createRef<HTMLButtonElement>();
    private button2Ref = React.createRef<HTMLButtonElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            statToShow: 0,
        };
    }
    render() :JSX.Element {
        const {statisticsManager, onReset} = this.props;
        let {numLetters, numWords} = this.props;

        numWords ??= 5;
        numLetters ??= 5;

        const buttonOnClick = (): void => {
            onReset();
            this.button1Ref.current?.blur();
        };

        const next = (): void => {
            this.setState({
                statToShow: this.state.statToShow + 1,
            });
            this.button2Ref.current?.blur();
        };

        const correctedAverage = statisticsManager.computeAverage.toFixed(2);
        const currentGuessesString = "Current number of guesses: " + this.props.numGuesses + "\n";
        const averageGuessesString = "Average number of guesses: " + correctedAverage + "\n";
        const statsArray: ReactElement[] = [];
        statsArray[0] = <StatsLine statisticString={currentGuessesString}/>;
        statsArray[1] = <StatsLine statisticString={averageGuessesString}/>;
        statsArray[2] = <Lister
            list={statisticsManager.getTopGuessedWords(numWords)}
            title={`Top ${numWords} Guessed Words`}
        />;
        statsArray[3] = <Lister
            list={statisticsManager.getTopGuessedLetters(numLetters)}
            title={`Top ${numLetters} Guessed Letters`}
        />;

        return (<>
            <div className={"user-stats"}
                 style={{
                     color: "white",
                     boxShadow: CSSTools.sharpInsetBoxShadow('3px', Colors.DarkGrey),
                 }}>
                <StatsLine statisticString="Player Statistics" fontSize={20} fontWeight="bold" centered/>
                <button className={"freq-button"} ref={this.button2Ref} onClick={next}
                        style={{
                            backgroundColor: Colors.DarkGrey,
                            borderColor: Colors.DarkGrey,
                        }}>Next</button>
                <button className={"freq-button"} ref={this.button1Ref} onClick={() => buttonOnClick()}
                        style={{
                            backgroundColor: Colors.Red,
                            borderColor: Colors.Red,
                        }}>Reset Statistics</button>
                {statsArray[this.state.statToShow % statsArray.length]}
            </div>
        </>);
    }
}

