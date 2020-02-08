'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DownloadedTrailerSchema = new Schema(
    {
        guid: { type: String, required: true },
        downloadDate: { type: Date, required: true, default: Date.now() }
    }
);

module.exports = mongoose.model("DownloadedTrailer", DownloadedTrailerSchema);