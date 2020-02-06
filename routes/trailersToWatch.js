'use strict';

const express = require('express');
const trailersToWatchController = require("../controllers/trailersToWatchController");
const router = express.Router();

router.get('/', trailersToWatchController.trailerList);
router.patch("/:id/", trailersToWatchController.shortlistFilm);
router.delete("/:id/", trailersToWatchController.flagFilmAsUninterested);

module.exports = router;