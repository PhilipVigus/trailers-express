'use strict';

const express = require('express');
const trailersToWatchController = require("../controllers/trailersToWatchController");
const router = express.Router();

/* GET home page. */
router.get('/', trailersToWatchController.trailerList);

module.exports = router;