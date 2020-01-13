'use strict';

const Trailer = require("../models/trailer");

exports.shortlist = function (req, res) {
    Trailer.find({ rating: { $ne: null } }).exec(function (err, trailersFound) {
        if (err) {
            return next(err);
        } else {
            //res.send(`${trailersFound.length} trailers found`);
            res.render("shortlist", { title: "Shortlist", trailers_found: trailersFound })
        }
    });
};

