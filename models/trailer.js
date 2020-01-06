'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrailerSchema = new Schema(
    {
        title: { type: String, required: true },
        guid: { type: String, required: true },
        imageURL: { type: String, required: true },
        articleDate: { type: Date, required: true },
        trailerLink: { type: String, required: true },
        tags: { type: String, required: true, default: "" },
        rating: { type: Number, required: false, min: 1, max: 3 },
        notes: { type: String, default: "" } 
    }
);

module.exports = mongoose.model("Trailer", TrailerSchema);