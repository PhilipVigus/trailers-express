'use strict';
/**
 * This script imports trailers from the Thunderbird email feed we were using before this program was written.
 * Once used, as long as the site remains up to date it shouldn't be required again.
 */

require('dotenv').config();

const mongoose = require("mongoose");
const fileSystem = require("fs");
const async = require("async");
const ExternalDataInterface = require('./externalDataInterface');
const TrailerModel = require("../models/trailer");
const dbPath = process.env.USER == "phil" ? process.env.DB_PATH_PERSONAL : process.env.DB_PATH_PORTFOLIO
let dbConnection;

addThunderbirdTrailersToDb();

async function addThunderbirdTrailersToDb() {
    await connectToDb();
    let trailers = await processThunderBirdDataFile();
    await ExternalDataInterface.saveTrailersToDatabase(trailers);
    /**
     * There is a bug here I don't know how to fix. If I try to disconnect the database with the given code,
     * it closes before the save operations have completed, causing an error. There's something wrong with
     * the way I'm doing the async calls, but I can't work out what it is. For them moment, you have t
     * manually disconnect by quitting out of the program after it's completed.
     */
    //await disconnectFromDb();

    async function connectToDb() {
        await mongoose.connect(dbPath, { poolSize: 10, useNewUrlParser: true });
        dbConnection = mongoose.connection;
    
        // bind to the error event, so that errors get printed to console
        dbConnection.on("error", console.error.bind(console, 'MongoDB connection error:'));
    }
    
    async function processThunderBirdDataFile() {
        const stringData = readFileAsString("./data/RSSData 20200210.txt");
        const parsedTrailers = parseTrailersFromStringData(stringData);
        const filteredTrailers =  await ExternalDataInterface.filterTrailers(parsedTrailers);
        
        return filteredTrailers;
    
        function readFileAsString(filename) {
            return fileSystem.readFileSync(filename).toString();
        }
        
        function parseTrailersFromStringData(stringData) {
            let trailers = [];
    
            const dataDividedIntoTrailers = divideDataIntoTrailers(stringData);
    
            dataDividedIntoTrailers.forEach((trailerData) => {
                trailers.push(parseTrailerDetails(trailerData));
            });
    
            return trailers;
    
            function divideDataIntoTrailers(data) {
                return data.match(/From - [\s\S]*?<\/html>/g);
            }
    
            function parseTrailerDetails(trailerData) {
    
                const trailerTagsWithLinks = trailerData.match(/Tags:\s(.*)?/)[1];
    
                return {
                    title: trailerData.match(/<title>([\s\S]*?)<\/title>/)[1],
                    guid: trailerData.match(/<base href="([\s\S]*?)">/)[1],
                    imageURL: trailerData.match(/<img src="([\s\S]*?)" \/>/)[1],
                    articleDate: trailerData.match(/Received: by localhost; (.*)/)[1],
                    trailerLink: trailerData.match(/<base href="([\s\S]*?)">/)[1],
                    tags: trailerTagsWithLinks ? trailerTagsWithLinks.replace(/<.*?>/g, "") : "-" // accounts for trailers with no tags specified
                };
            }
        }
    }
    
    async function disconnectFromDb() {
        console.log("Closing database");
        await dbConnection.close();
        console.log("Database closed");
    }
}

