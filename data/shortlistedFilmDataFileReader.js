'use strict';
require('dotenv').config();

const mongoose = require("mongoose");
const fileSystem = require("fs");
const async = require("async");
const TrailerModel = require("../models/trailer");
const dbPath = process.env.USER == "phil" ? process.env.DB_PATH_PERSONAL : process.env.DB_PATH_PORTFOLIO

mongoose.connect(dbPath, { useNewUrlParser: true });
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
    const dataAsString = readFileAsString("./data/Shortlist 20200210.csv");
    const parsedFilms = parseDataToFilmObjects(dataAsString);
    console.log(parsedFilms);
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
        guid: getTitleFromLine(line),
        imageURL: "http://cdn.traileraddict.com/images/errors/noposter.jpg",
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
    const oldRating = parseInt(line.split(";")[3]);

    if (oldRating == 1) {
        return "3";
    } else if (oldRating == 2) {
        return "2";
    } else if (oldRating == 3) {
        return "1";
    } else {
        throw error("This is a humungous error");
    }
}