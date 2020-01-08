'use strict';

const mongoose = require("mongoose");
const fileSystem = require("fs");
const async = require("async");
const TrailerModel = require("../models/trailer");
const mongoDBConnectionString = "mongodb+srv://PortfolioAdmin:kj43Pipkj43@portfolio-databases-ndtpo.mongodb.net/trailers?retryWrites=true&w=majority";

mongoose.connect(mongoDBConnectionString, { useNewUrlParser: true });
const dbConnection = mongoose.connection;

// bind to the error event, so that errors get printed to console
dbConnection.on("error", console.error.bind(console, 'MongoDB connection error:'));

// this makes sure that the processing is complete before we close the database connection
async.series(
    [processFile],
    function(err, results) {
        if (err) {
            console.log("FINAL ERR: " + err);
        }
        mongoose.connection.close();
    }
);

function processFile() {
    const data = readFileAsString("test-data.txt");
    const parsedData = parseData(data);
}

function readFileAsString(filename) {
    return fileSystem.readFileSync(filename).toString();
}

function parseData(data) {
    let films = [];

    /**
     * split the file into chunks going from the opening 'From' field to the closing html tag
     * [\s\S]* matches zero or more whitespace and non-whitespace characters. We can't use . here as it
     * doesn't match new line and other delimiters. ? makes the search lazy, matching the minimum number
     * of characters to get the pattern
     */
    let filmChunks = data.match(/From - [\s\S]*?<\/html>/g);

    filmChunks.forEach(function(filmChunk) {

        let trailerDetails = {
            title: filmChunk.match(/<title>[\s\S]*?<\/title>/)[0].slice(7, -8),
            guid: filmChunk.match(/<base[\s\S]*?>/)[0].slice(12, -2),
            imageURL: filmChunk.match(/<img[\s\S]*?>/)[0].slice(10, -4),
            articleDate: filmChunk.match(/Received.*/)[0].slice(24, -6),
            trailerLink: filmChunk.match(/<base[\s\S]*?>/)[0].slice(12, -2),
            tags: filmChunk.match(/Tags[\s\S]*?<\/body>/)[0].replace(/<.*?>/g, "").slice(6, -3)
        };

        let trailer = new TrailerModel(trailerDetails);
        trailer.save(function (err) {
            if (err) {
                console.log(err);
            }
        });

    })

    console.log(films);
}