'use strict';
const Trailer = require('../models/trailer');
const RSSParser = require('rss-parser');

exports.getTrailersFromRSSFeed = async function () {

    console.log("Getting trailers from RSS feed...");

    // get the latest trailers from the RSS feed
    let feedJSONData = await getFeedJSONData();
    console.log(`${feedJSONData.items.length} trailers retrieved from feed`);

    // parse the trailer json into trailer objects
    let parsedTrailers = parseTrailers(feedJSONData.items);

    // filter out anything that isn't a trailer or is a genre we're not interested in (documentaries, shorts, tv spots etc)
    let filteredTrailers = filterTrailers(parsedTrailers);
    console.log(`${filteredTrailers.length} trailers left after filtering`);

    saveTrailersToDatabase(filteredTrailers);

    // returns an object that contains the entire feed. The trailers are the .items
    // property of this object
    async function getFeedJSONData() {
        const FEED_URL = "https://www.traileraddict.com/rss";
        const parser = new RSSParser();

        let trailers = await parser.parseURL(FEED_URL);
        return trailers;
    }

    // parses out the information from the feed that we're interested in and
    // populates film objects with it
    function parseTrailers(trailers) {

        let parsedTrailers = [];

        console.log("Parsing trailers...");

        trailers.forEach(function(entry) {
            let trailer = {};

            trailer.guid = entry.guid;
            trailer.title = entry.title;
            trailer.articleDate = entry.pubDate;
        
            // relies on there only being one jpg link in the content
            trailer.imageURL = entry.content.match(/http.*?jpg/)[0];
        
            /**
             * tags are found in two stages:-
             * 1. The match uses a capture group to isolate everything after the "Tags: " part of the string
             * 2. The replace then strips all of the HTML tags from what was isolated
             */
            trailer.tags = entry.content.match(/Tags: (.*)/)[1].replace(/<.*?>/g, "");
        
            trailer.trailerLink = entry.link;

            parsedTrailers.push(trailer);
        });

        return parsedTrailers;
    }

    function filterTrailers(trailers) {
        /**
         * Filters first by the trailer title, removing TV spots, auditions, teasers etc, and then by the tags,
         * removing any genres we're not interested in
         */
        return trailers.filter(trailer => trailer.title.match(/^(?!.*(Featurette|TV Spot|Auditions|Teaser)).*$/i))
                    .filter(trailer => trailer.tags.match(/^(?!.*(Documentary|Short)).*$/i));
    }

    function saveTrailersToDatabase(trailers) {
        console.log("Saving trailers to database");

        trailers.forEach ((trailerDetails) => {
            let trailerDocument = new Trailer(trailerDetails);

            trailerDocument.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
};