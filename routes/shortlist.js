'use strict'

const express = require("express");
const router = express.Router();
const shortlistController = require("../controllers/shortlistController");

router.get('/', shortlistController.shortlist);
router.patch("/:id/", shortlistController.updateTrailer);
router.delete("/:id/", shortlistController.deleteTrailerAsFilmWatched);
module.exports = router;