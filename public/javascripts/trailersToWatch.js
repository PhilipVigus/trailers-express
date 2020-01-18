'use strict';

/**
 * Variables storing the rating and ID of the trailer being rated. Having these as
 * globals isn't ideal, but at this stage it will do
 */
let currentRating = 0;
let currentID = 0;

// called when the user clicks one of the rate film buttons
function showRatingDialog(filmTitle, trailerID) {
    currentID = trailerID;
    document.querySelector(".trailer-to-rate").textContent = filmTitle;
    document.querySelector(".modal-overlay").classList.toggle("show-modal");
}

function hideRatingDialog() {

    // hide the dialog
    document.querySelector(".modal-overlay").classList.toggle("show-modal");
    
    // reset information ready for the next time the dialog is shown
    currentID = 0;
    currentRating = 0;
    deselectAllStars();
    clearNotes();
}

// 'deselect' each of the three stars
function deselectAllStars() {
    const starGroup = document.querySelectorAll(".star");

    for (let i = 0; i < 3; i++) {
        starGroup[i].classList.remove("star--lit");
    }
}

function clearNotes() {
    document.querySelector(".notes").value = "";
}

/**
 * Contains the display logic for the different combinations the user can click the stars in.
 */
function handleStarClick(eventTarget) {

    const starGroup = document.querySelectorAll(".star");

    // check which star was clicked, and alter the star group's state depending on what it currently is
    if (eventTarget.id === "star-rating-1") {

        // the first star was clicked

        if (!starGroup[1].classList.contains("star--lit")) {
            starGroup[0].classList.toggle("star--lit");
        }

        starGroup[1].classList.remove("star--lit");
        starGroup[2].classList.remove("star--lit");


        if (starGroup[0].classList.contains("star--lit")) {
            currentRating = 1;
        } else {
            currentRating = 0;
        }

    } else if (eventTarget.id === "star-rating-2") {

        // the second star was clicked

        starGroup[0].classList.add("star--lit");

        if (!starGroup[2].classList.contains("star--lit")) {
            starGroup[1].classList.toggle("star--lit");
        }

        starGroup[2].classList.remove("star--lit");

        if (starGroup[1].classList.contains("star--lit")) {
            currentRating = 2;
        } else {
            currentRating = 1;
        }

    } else {

        // the third star was clicked

        starGroup[0].classList.add("star--lit");
        starGroup[1].classList.add("star--lit");
        starGroup[2].classList.toggle("star--lit");

        if (starGroup[2].classList.contains("star--lit")) {
            currentRating = 3;
        } else {
            currentRating = 2;
        }

    }
}

function sendRating() {
    
    // call the server API, sending the trailer ID and rating chosen by the user
    //fetch(`/shortlist-film/rate?id=${currentID}&rating=${currentRating}`, { method: "PUT"});
    fetch(`trailers-to-watch/${currentID}/shortlist-film`, { method: "PUT"});
    //hideRatingDialog();
}