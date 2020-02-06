'use strict';

const Trailer = require("../models/trailer");

exports.trailerList = function (req, res) {

    // find all trailer documents that don't have a rating
    Trailer.find({ rating: null }).exec(function (err, trailersFound) {
        if (err) {
            return next(err);
        } else {
            res.render("trailersToWatch", { title: "Trailers to Watch", trailers_found: trailersFound })
        }
    });
};

exports.shortlistFilm = async function (req, res) {
    Trailer.findById(req.params.id).exec(function (err, trailerFound) {
        if (err) {
            return next(err);
        } else {
            console.log(`${trailerFound.title} is being updated...`);
            trailerFound.rating = req.body.rating;
            trailerFound.notes = req.body.notes;
            trailerFound.save();
        }
    });
};

exports.flagFilmAsUninterested = function (req, res) {
    console.log("Why are you not interested in " + req.params.id);
};