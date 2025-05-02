import '@total-typescript/ts-reset';
import React from 'react';
import { EndgameMessage } from '../EndgameMessage';
import { FrequencyStatistics } from '../FrequencyStatistics';
import { GuessPanel } from '../GuessPanel';
import HintContainer from '../HintContainer';
import { LetterList } from '../LetterList';
import { MessageHandler } from '../MessageHandler';
import { ToggleableLister } from '../ToggleableLister';
import { storedItems } from '../modules/StoredItems';
import { Wordle, WordleStatus } from '../modules/Wordle';
import { WordleAPI } from '../modules/WordleAPI';
import { WordleStatisticsManager } from '../modules/WordleStatisticsManager';

type AppProps = {

};

type AppState = {
    wordle: Wordle | null,
    statisticsManager: WordleStatisticsManager,
    suggestedWords: string[],
    show: boolean,
    success: string | null,
    error: string | null,
};

export class App extends React.Component<AppProps, AppState> {
    private readonly keydownCallback = (e: KeyboardEvent): Promise<void> => this.keydown(e);

    constructor(props: AppProps) {
        super(props);

        const statisticsManager = storedItems.totalStatistics.get()
            .map(stats => WordleStatisticsManager.deserialize(stats))
            .orElse(new WordleStatisticsManager());

        this.state = {
            wordle: null,
            suggestedWords: [],
            show: false,
            statisticsManager,
            success: null,
            error: null,
        };
    }

    private async newWordle(): Promise<void> {
        const targetWord = await WordleAPI.newWord();
        const wordle = new Wordle(targetWord);
        wordle.store();

        this.setState({
            suggestedWords: [],
            wordle,
            success: null,
            error: null,
        });
    }

    componentDidMount(): void {
        const wordleOptional = storedItems.wordle.get();
        if(wordleOptional.isEmpty) {
            this.newWordle();
        } else {
            const wordle = Wordle.deserialize(wordleOptional.value);
            this.setState({
                wordle,
                success: null,
                error: null,
            });
        }
        document.addEventListener("keydown", this.keydownCallback);
    }

    componentWillUnmount(): void {
        document.removeEventListener("keydown", this.keydownCallback);
    }

    async keydown(e: KeyboardEvent): Promise<void> {
        const { wordle, statisticsManager } = this.state;
        if(!wordle) return;

        let error: string | null = null;
        let success: string | null = null;
        let suggestedWords = this.state.suggestedWords;

        const { inProgress } = wordle;
        try {
            switch(e.key) {
                case 'Shift': break;
                case 'Enter':
                    if(inProgress) {
                        const guess = wordle.guess;
                        success = await wordle.submitGuess();
                        statisticsManager.add(guess);
                        suggestedWords = await wordle.suggestedWords(guess);
                    }
                break;
                case 'Backspace': if(inProgress) wordle.removeLastCharacter(); break;
                default: if(inProgress) wordle.addCharacter(e.key);
            }
        } catch(e) {
            error = String(e);
        } finally {
            this.setState({ success, error, suggestedWords });
        }
    }

    onReset() :void {
        const {wordle, statisticsManager} = this.state;
        const worldeInfo = wordle?.info;

        if(worldeInfo?.status == WordleStatus.InProgress ) return;

        statisticsManager.reset();
        this.setState({
           success: "Statistics Successfully Reset!",
            error: "",
        });
    }

    async gameOver(): Promise<void> {
        const {statisticsManager} = this.state;
        await this.newWordle();
        statisticsManager.incrementGamesPlayed();
    }

    getLetterHint() : void {
        const {wordle} = this.state;
        wordle?.getRandomLetter();
        this.setState({});
    }

    render(): JSX.Element {
        const wordleInfo = this.state.wordle?.info;
        const {statisticsManager} = this.state;
        const title = wordleInfo?.title ?? "Wordle";

        if(title == "Turtle") {
            return (
                <div className={"HolyGrail"}>
                    <div className='header'>
                        <div className={"header-text"}>
                            {title}
                        </div>
                    </div>
                    <div className={"turtle animated bounce"}>
                        <img src="/best-pet-turtle-and-tortoise.png" className='centerImage'></img>
                    </div>
                </div>
            );
        }

        return (
            <div className={"HolyGrail"}>
                <div className='header'>
                    <div className={"header-text"}>
                        {title}
                    </div>
                </div>
                <div className={"HolyGrail-body"}>
                    <div className={"HolyGrail-nav"}>
                        <MessageHandler color={'#D16666'} message={this.state.error} />
                        <EndgameMessage status={wordleInfo?.status}
                                        loseMessage={wordleInfo?.loseMessage}
                                        gameOver={this.gameOver.bind(this)}/>
                        <div className={"statisticsContainer"}>
                            <FrequencyStatistics
                                numGuesses={wordleInfo?.grades.length}
                                statisticsManager={statisticsManager}
                                onReset={this.onReset.bind(this)}
                            />
                            <ToggleableLister
                                show={this.state.show}
                                toggle={(()=>this.setState({show: !this.state.show})).bind(this)}
                                title={"Want Some Suggestions?"}
                                listerTitle={"Suggested Words"}
                                list={this.state.suggestedWords}
                            />
                        </div>
                    </div>
                    <div className={"HolyGrail-content"}>
                        { wordleInfo && <GuessPanel
                            guessLength={wordleInfo.guessLength}
                            guessTotal={wordleInfo.guessTotal}
                            guesses={wordleInfo.guesses}
                            grades={wordleInfo.grades}
                        /> }
                    </div>
                    <div className={"HolyGrail-right"}>
                        {wordleInfo && <LetterList
                            grades={wordleInfo.grades}
                            guesses={wordleInfo.guesses}
                        />}
                        <HintContainer
                            hintLetter={wordleInfo?.hintLetter}
                            hintUsed={wordleInfo?.letterHintUsed}
                            getLetterHint={() => this.getLetterHint()}/>
                    </div>
                </div>
                <div className={"footer"}>

                </div>
            </div>
        );
    }
}
