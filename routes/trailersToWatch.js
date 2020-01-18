'use strict';

const express = require('express');
const trailersToWatchController = require("../controllers/trailersToWatchController");
const router = express.Router();

// GET home page
router.get('/', trailersToWatchController.trailerList);

// PUT trailer rating to db
router.put("/:id/shortlist-film", trailersToWatchController.shortlistFilm);

module.exports = router;