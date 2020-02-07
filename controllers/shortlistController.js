'use strict';

const Trailer = require("../models/trailer");

exports.showShortListPage = function (req, res) {
    // finds trailers where the rating != null
    Trailer.find({ rating: { $ne: null } }).sort({ articleDate: 'asc'}).exec(function (err, trailersFound) {
        if (err) {
            return next(err);
        } else {
            res.render("shortlist", { title: "Shortlist", trailers_found: trailersFound })
        }
    });
};

exports.updateTrailerData = async function (req, res) {
    Trailer.findById(req.params.id).exec(function (err, trailerFound) {
        if (err) {
            return next(err);
        } else {
            /**
             * if rating is undefined it means we are unrating the trailer,
             * removing it's rating and any notes. This has the effect of
             * removing the trailer from the shortlist and readding it to the
             * 'trailers to watch' list
             */
            if (req.body.rating === undefined ) {
                trailerFound.rating = undefined;
                trailerFound.notes = req.body.notes;
                trailerFound.save();
            }

            console.log(`Trailer with id = ${req.params.id} has been unrated`);
        }
    });
};

exports.deleteTrailerAsFilmWatched = async function (req, res) {
    Trailer.findByIdAndDelete(req.params.id).exec(function (err) {
        if (err) {
            return next(err);
        } else {
            console.log(`Trailer with id = ${req.params.id} has been deleted from the database`);
        }
    });
};

