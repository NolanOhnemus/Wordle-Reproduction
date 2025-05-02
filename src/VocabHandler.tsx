import React, {ReactElement} from "react";
import {WordleAPI} from "./modules/WordleAPI";

type Props = {

}

type State = {

}

function buildFileSelector(): HTMLInputElement {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    return fileSelector;
}

export class VocabHandler extends React.Component<Props, State> {
    private fileSelector: HTMLInputElement | undefined;

    verifyWord(word : string) : boolean {
        let permissible = true;

        if(word.length !== 5) { // had || word.toUpperCase() !== word, unnecessary
            permissible = false;
        }
        return permissible;
    }

    componentDidMount(): void {
        this.fileSelector = buildFileSelector();
    }

    handleFileSelect(e: { preventDefault: () => void; }): void {
        e.preventDefault();
        if(this.fileSelector !== undefined) {
            this.fileSelector.click(); //selects file
        }
    }

    readVocab(e: { preventDefault: () => void; }): void {
        e.preventDefault();
        if(this.fileSelector !== undefined) { // if file is selected...
            const reader = new FileReader();
            reader.onload = async (e) => {
                if(e.target !== null) {
                    const text = e.target.result;
                    if(text !== null && typeof text === 'string') {
                        const lines = text.split('\n');
                        let permissible = true;
                        for(let i = 0; i < lines.length; i++) {
                            const line = lines[i]?.trim();
                            if(line !== undefined) {
                                const permissibleWord = this.verifyWord(line);
                                if(!permissibleWord) {
                                    permissible = false; //if any word is unacceptable
                                }
                            } else {
                                permissible = false; //or if there is a blank line/null err
                            }
                        }
                        if(permissible) { // if impermissible, does not set file to be vocab
                            await WordleAPI.dbClearVocab();
                            // add all words to db
                            await WordleAPI.dbAddVocab(text);
                        }
                    }
                }
            };
            if(this.fileSelector.files !== null && this.fileSelector.files[0] !== undefined) {
                    reader.readAsText(this.fileSelector.files[0]);
            }
        }
    }

    render(): ReactElement {
        return (
            <div className={""}>
                <p>Set vocabulary list</p>
                <button className="button" onClick={this.handleFileSelect.bind(this)}>Select vocab file</button>
                <button className="button" onClick={this.readVocab.bind(this)}> Submit vocab </button>
            </div>
        );
    }
}