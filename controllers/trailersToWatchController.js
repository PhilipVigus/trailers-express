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

exports.shortlistFilm = function (req, res) {
    console.log("Yay, you're interested in it " + req.params.id);
    console.log("Rating " + req.body.rating);
    console.log("Notes " + req.body.notes);
/*     console.log("called PUT");
    console.log(req.query.rating);
    console.log(req.query.id);
    Trailer.findById(req.query.id).exec(function (err, trailerFound) {
        if (err) {
            return next(err);
        } else {
            console.log(trailerFound.title);
        }
    }); */
};

exports.flagFilmAsUninterested = function (req, res) {
    console.log("Why are you not interested in " + req.params.id);
};