'use strict';

const Trailer = require("../models/trailer");

exports.shortlist = function (req, res) {
    Trailer.find({ rating: { $ne: null } }).exec(function (err, trailersFound) {
        if (err) {
            return next(err);
        } else {
            res.render("shortlist", { title: "Shortlist", trailers_found: trailersFound })
        }
    });
};

exports.updateTrailer = async function (req, res) {
    Trailer.findById(req.params.id).exec(function (err, trailerFound) {
        if (err) {
            return next(err);
        } else {
            if (req.body.rating === undefined ) {
                console.log(`${trailerFound.title} is having its rating removed...`);
                trailerFound.rating = undefined;
                trailerFound.notes = req.body.notes;
                trailerFound.save();
            }
        }
    });
};

