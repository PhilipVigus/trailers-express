'use strict';

const fileSystem = require("fs");

processFile("test-data.txt");

function processFile(filename) {
    const data = readFileAsString(filename);
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

        let film = {};

        // parse the title, removing the two tags with slice
        film.title = filmChunk.match(/<title>[\s\S]*?<\/title>/)[0].slice(7, -8);

        // parse the guid
        film.guid = filmChunk.match(/<base[\s\S]*?>/)[0].slice(12, -2);

        // parse the image
        film.image = filmChunk.match(/<img[\s\S]*?>/)[0].slice(10, -4);

        // parse the date
        film.articleDate = filmChunk.match(/Received.*/)[0].slice(24, -6);

        // parse the trailer link
        film.trailerLink = filmChunk.match(/<base[\s\S]*?>/)[0].slice(12, -2);

        // parse the tags
        film.tags = filmChunk.match(/Tags[\s\S]*?<\/body>/)[0].replace(/<.*?>/g, "").slice(6, -4);

        films.push(film);
    })

    console.log(films);
}