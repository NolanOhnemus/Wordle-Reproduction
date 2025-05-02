import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, UpdateResult, ObjectId } from "mongodb";
import { GlobalStatistics, GlobalStatisticsRecord } from "../modules/contracts/GlobalStatistics";
import { gameStatisticSchema } from "../modules/contracts/GameStatistics";
import { z } from "zod";
import {generateSuggestedGuesses} from "./modules/SuggestedGuessGenerator";

const db = new MongoClient('mongodb://localhost:27017').db('Wordle-RoadSpike');

const collections = {
    gameStatistics: db.collection('gameStatistics'),
    globals: db.collection('globals'),
    vocab: db.collection('vocabulary'),
} as const;

const vocabRecordSchema = z.object({
    _id: z.instanceof(ObjectId),
    word: z.string(),
});

const serverPath = path.dirname(fileURLToPath(import.meta.url));
process.chdir(serverPath);
const app = express();
app.use(express.json());

const webDir = `${import.meta.url}/build`;
const port = 3500;
app.use(express.static(webDir, {index: "index.html"}));

/**
 * This function searches the dictionary to see if a guessed word is in the provided dictionary.
 * @returns a response JSON file that contains the status of the method, if the method succeeded,
 *          and a confirmation of the word if it is in the dictionary.
 */
app.get("/search", async (request, response) => {
    const queryGuess = request.query.guess;
    if(typeof queryGuess !== 'string') throw new Error(`guess was not a string`);

    const guess = queryGuess.toLowerCase();
    console.log(`Searching for ${guess} in dictionary...`);
    collections.vocab.findOne({ word: guess }).then(res => {
        if(res === null) {
            console.log(`${guess} is invalid`);
            response.status(200).json({
                found: false,
                message: `${guess} is an invalid word!`,
            });
        } else {
            console.log(`${guess} was valid!`);
            response.status(200).json({
                found: true,
                message: `${guess} is a valid word!`,
            });
        }

    }).catch(err => {
        console.error(err);
        response.status(500);
    });
});

/**
 * This method searches the dictionary and picks out a word at random for the wordle board to use
 * @returns a JSON file that contains the status of the method, if it was successful, and the
 *          new word if it was able to pick one from the dictionary.
 */
app.get("/newWord", async (_, response) => {
    console.log('Getting new word...');
    if(await collections.vocab.countDocuments() !== 0) {
        const vocabCursor = await collections.vocab
            .aggregate([ { $sample: { size: 1 } }]);
        const wordRecord = await vocabCursor.next();
        const targetWord = vocabRecordSchema.parse(wordRecord).word;

        response.status(200).json(targetWord);
        console.log(`Got new word: ${targetWord.toUpperCase()}`);
    } else {
        response.status(200).json("Dictionary is empty");
    }
});

app.get("/dbAddVocab", async (request, response) => {
    const text = request.query.src;
    if(typeof text !== 'string') throw new Error(`words to add to dict was not a string`);

    // ended up passing all words in one line string, have to split every 5 char
    const lines = text.match(/.{1,5}/g);
    let allWordsAdded = true;
    if(lines !== null) {
        for(let i = 0; i < lines.length; i++) {
            await collections.vocab.insertOne({
                word: lines[i]?.trim(),
            }).catch(() => {
                allWordsAdded = false;
            });
        }
    } else {
        allWordsAdded = false;
    }

    if(allWordsAdded) {
        response.status(200).send();
    } else {
        response.status(500).send("Not all words successfully added to database");
    }
});

app.get("/dbClearVocab", async (_, response) => {
    collections.vocab.deleteMany({}).then(() => {
        console.log("Successfully cleared vocabulary");
        response.status(200).send();
    }).catch(() => {
        console.log("Failed to clear vocabulary");
        response.status(500).send();
    });
});


app.get("/getSuggestedWords", async (request, response) => {
    const {
        targetWord,
        currentGuess,
        excludedLetters,
        includedLetters,
    } = request.query;

    if(typeof targetWord !== 'string') throw new Error("Target Word was not a string");
    if(typeof currentGuess !== 'string') throw new Error("Current Guess was not a string");
    if(typeof excludedLetters !== 'string') throw new Error("Excluded Letters was not a string");
    if(typeof includedLetters !== 'string') throw new Error("Included Letters was not a string");

    console.log(`Getting 5 suggested words...`);

    const iterator = collections.vocab.find({});
    const dict: string[] = [];

    while(await iterator.hasNext()) {
        dict.push(vocabRecordSchema.parse(await iterator.next()).word);
    }

    const suggestions: string[] = generateSuggestedGuesses(dict,
        currentGuess.toLowerCase(),
        targetWord.toLowerCase(),
        excludedLetters.toLowerCase(),
        includedLetters.toLowerCase(),
    );

    let suggestionString = "";

    for(const s of suggestions) {
        suggestionString += `${s}, `;
    }
    console.log(`Suggested Words: ${suggestionString}`);

    response.status(200).json(suggestions);
});

async function getGlobalStatistics(): Promise<GlobalStatisticsRecord | null> {
    const document = await collections.globals.findOne({ name: 'gameStatistics' });
    const parseResult = GlobalStatistics.RECORD_SCHEMA.safeParse(document);
    if(!parseResult.success) {
        console.error("global 'gameStatistics' was not the correct shape!");
        return null;
    }
    return parseResult.data;
}

function updateGlobalStatistics(record: GlobalStatisticsRecord): Promise<UpdateResult<Document>> {
    return collections.globals.updateOne({ name: 'gameStatistics' }, { $set: record });
}

app.post('/postGameStatistics', async (request, response) => {
    const gameStatsResult = gameStatisticSchema.safeParse(request.body);
    if(!gameStatsResult.success) return void response.status(400).send();

    const gameStats = gameStatsResult.data;
    collections.gameStatistics.insertOne(gameStats);

    const record = await getGlobalStatistics();
    if(record === null) return void response.status(500).send();

    const globalStats = GlobalStatistics.parse(record);
    globalStats.register(gameStats);

    updateGlobalStatistics(globalStats.serialize());
    response.status(200).send();
});

app.get('/getGlobalStatistics', async (request, response) => {
    const record = await getGlobalStatistics();
    if(!record) return void response.status(500).send();
    response.status(200).json(record);
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port} in ${serverPath}...`);
});
