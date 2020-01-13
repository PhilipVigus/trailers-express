'use strict'

const express = require("express");
const router = express.Router();
const shortlistController = require("../controllers/shortlistController");

router.get('/', shortlistController.shortlist);

module.exports = router;