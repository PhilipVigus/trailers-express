'use strict';

const Trailer = require("../models/trailer");

exports.showTrailersToWatchPage = function (req, res) {
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
    Trailer.findById(req.params.id).sort({ articleDate: 'asc'}).exec(function (err, trailerFound) {
        if (err) {
            return next(err);
        } else {
            /**
             * Adding a rating to the trailer effectively moves it to the shortlist, as it's whether or not
             * a trailer has a rating that defines whether it's shortlisted or not
             */
            trailerFound.rating = req.body.rating;
            trailerFound.notes = req.body.notes;
            trailerFound.save();
        }
    });
};

exports.deleteFilmAsNotInterested = function (req, res) {
    Trailer.findByIdAndDelete(req.params.id).exec(function (err) {
        if (err) {
            return next(err);
        } else {
            console.log(`Trailer with id = ${req.params.id} has been deleted from the database`);
        }
    });
};