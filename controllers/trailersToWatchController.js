'use strict';

const Trailer = require("../models/trailer");

exports.trailerList = function (req, res) {

    // find all trailer documents that don't have a rating
    Trailer.find({ rating: null }).exec(function (err, trailersFound) {
        if (err) {
            return next(err);
        } else {
            console.log(unescape(trailersFound[1].title));
            res.render("trailersToWatch", { title: "Trailers to Watch", trailers_found: trailersFound })
        }
    });
};

exports.rateTrailer = function (req, res) {
    console.log("called PUT");
    console.log(req.query.rating);
    console.log(req.query.id);
    Trailer.findById(req.query.id).exec(function (err, trailerFound) {
        if (err) {
            return next(err);
        } else {
            console.log(trailerFound.title);
        }
    });
};