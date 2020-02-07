'use strict'

const express = require("express");
const router = express.Router();
const shortlistController = require("../controllers/shortlistController");

router.get('/', shortlistController.showShortListPage);
router.patch("/:id/", shortlistController.updateTrailerData);
router.delete("/:id/", shortlistController.deleteTrailerAsFilmWatched);
module.exports = router;