'use strict';

const express = require('express');
const trailersToWatchController = require("../controllers/trailersToWatchController");
const router = express.Router();

router.get('/', trailersToWatchController.showTrailersToWatchPage);
router.patch("/:id/", trailersToWatchController.shortlistFilm);
router.delete("/:id/", trailersToWatchController.deleteFilmAsNotInterested);

module.exports = router;