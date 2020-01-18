'use strict';

const express = require('express');
const trailersToWatchController = require("../controllers/trailersToWatchController");
const router = express.Router();

// GET home page
router.get('/', trailersToWatchController.trailerList);

/**
 * PUT request server moves trailer to shortlist
 * We use PUT here rather than POST as all the API call is doing is adding a rating and
 * any notes to the exising record in the collection
 */
router.put("/:id/shortlist-film", trailersToWatchController.shortlistFilm);

/**
 * PUT request server moves the trailer to the not interested list
 * We don't delete here. The reason for this is because there is a chance that
 * the RSS feed will resend the same trailer to watch, and we need to know a list of the
 * trailers we're definitely not interested in so they don't get added to the trailers to
 * watch list again
 **/
router.put("/:id/flag-as-uninterested", trailersToWatchController.flagFilmAsUninterested);

module.exports = router;