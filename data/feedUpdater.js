'use strict';
const Trailer = require('../models/trailer');
const DownloadedTrailer = require('../models/downloadedTrailer');
const RSSParser = require('rss-parser');

exports.getTrailersFromRSSFeed = async function () {

    let feedJsonData = await getFeedJsonData();
    console.log(`${feedJsonData.items.length} trailers retrieved from feed`);

    let parsedTrailers = parseTrailersFromJsonData(feedJsonData.items);

    let filteredTrailers = await filterTrailers(parsedTrailers);
    console.log(`${filteredTrailers.length} trailers left after filtering`);

    if (filteredTrailers.length > 0) {
        saveTrailersToDatabase(filteredTrailers);
        updateListOfDownloadedTrailerGuids(filteredTrailers);
    }

    async function getFeedJsonData() {
        const FEED_URL = "https://www.traileraddict.com/rss";
        const parser = new RSSParser();

        let trailers = await parser.parseURL(FEED_URL);
        return trailers;
    }

    function parseTrailersFromJsonData(trailers) {

        let parsedTrailers = [];

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

    async function filterTrailers(trailers) {

        let filteredTrailers = removeUninterestingTrailers(trailers);
        filteredTrailers = await removeDuplicateDownloads(filteredTrailers);

        return filteredTrailers;

        function removeUninterestingTrailers(trailers) {
            return trailers.filter(trailer => trailer.title.match(/^(?!.*(Featurette|TV Spot|Auditions|Teaser)).*$/i))
            .filter(trailer => trailer.tags.match(/^(?!.*(Documentary|Short)).*$/i));
        }

        async function removeDuplicateDownloads(trailers) {
            let nonDuplicates = [];

            /** You can't use forEach here as it causes a syntax error with the enclosed await. The reason for this
             * is because forEach will not pause while the promise from DownloadTrailer.exists fulfils. A standard
             * for loop on the other hand, will so we use that instead.
             */
            for (let i = 0; i < trailers.length; i++) {
                let hasAlreadyBeenDownloaded = await DownloadedTrailer.exists({ guid: trailers[i].guid });

                if (!hasAlreadyBeenDownloaded) {
                    nonDuplicates.push(trailers[i]);
                }
            }

            return nonDuplicates;
        }
    }

    function saveTrailersToDatabase(trailers) {

        trailers.forEach ((trailerDetails) => {
            let trailerDocument = new Trailer(trailerDetails);

            trailerDocument.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });

            let downloadedTrailerDocument = new DownloadedTrailer({ guid: trailerDetails.guid });

            downloadedTrailerDocument.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    function updateListOfDownloadedTrailerGuids(trailers) {
        trailers.forEach ((trailerDetails) => {
            let downloadedTrailerDocument = new DownloadedTrailer({ guid: trailerDetails.guid });

            downloadedTrailerDocument.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
};