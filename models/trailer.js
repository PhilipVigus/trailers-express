'use strict';

const mongoose = require('mongoose');
const he = require('he');
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

/**
 * The following virtuals return decoded versions of their fields.
 * The decoding happens when the fields are stored in the db in
 * the first place, replacing unsafe characters with safe equivalents
 */
TrailerSchema.virtual('titleUnencoded').get(function() {
    return he.decode(this.title);
});

TrailerSchema.virtual('tagsUnencoded').get(function() {
    return he.decode(this.tags);
});

TrailerSchema.virtual('notesUnencoded').get(function() {
    return he.decode(this.notes);
});

module.exports = mongoose.model("Trailer", TrailerSchema);