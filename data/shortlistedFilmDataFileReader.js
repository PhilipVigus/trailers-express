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
    const dataAsString = readFileAsString("shortlist-test-data.csv");
    const parsedFilms = parseDataToFilmObjects(dataAsString);
    saveFilmsToDatabase(parsedFilms);
}

function readFileAsString(filename) {
    return fileSystem.readFileSync(filename).toString();
}

function parseDataToFilmObjects(data) {
    const dataSplitIntolLines = splitDataIntoLines(data);
    const films = parseLinesIntoFilmObjects(dataSplitIntolLines);
    return films;
}

function saveFilmsToDatabase(films) {
    films.forEach(function(film) {
        film.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}

function splitDataIntoLines(data) {
    return data.match(/.+\s/g)
}

function parseLinesIntoFilmObjects(lines) {
    let trailers = [];

    lines.forEach(function(line) {
        let filmFields = getFilmFieldsFromLine(line);
        let trailer = new TrailerModel(filmFields);
        trailers.push(trailer);
    });

    return trailers;
}

/**
 * The reason most of the fields are blank is because we're importing incomplete
 * data that was recorded manually before this app was set up. Whenever data is
 * missing, it's replaced with either "-" for strings or in the case of the article
 * date, the current date and time 
 */
function getFilmFieldsFromLine(line) {
    let FilmFields = {
        title: getTitleFromLine(line),
        guid: "-",
        imageURL: "-",
        articleDate: Date.now(),
        trailerLink: "-",
        tags: "-",
        notes: getNotesFromLine(line),
        rating: getRatingFromLine(line)
    };

    return FilmFields;
}

/**
 * csv files are formated into fields, and in this case the fields on
 * each line are separated by semicolons. The next three functions each split the fields
 * on a line and extract the field they want based on the field's position on the line 
 */

function getTitleFromLine(line) {
    return line.split(";")[0];
}

function getNotesFromLine(line) {
    return line.split(";")[6].replace("\r", "");
}

function getRatingFromLine(line) {
    return line.split(";")[3];
}