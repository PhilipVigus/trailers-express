'use strict';

let currentRating = 0;
let currentID = 0;

function showRatingDialog(filmTitle, trailerID) {
    currentID = trailerID;
    document.querySelector(".trailer-to-rate").textContent = filmTitle;
    document.querySelector(".modal-overlay").classList.toggle("show-modal");
}

function hideRatingDialog() {
    currentID = 0;
    currentRating = 0;
    document.querySelector(".modal-overlay").classList.toggle("show-modal");
    resetStars();
}

function resetStars() {
    const starGroup = document.querySelectorAll(".star");

    for (let i = 0; i < 3; i++) {
        starGroup[i].classList.remove("star--lit");
    }
}

function handleStarClick(eventTarget) {
    const starGroup = document.querySelectorAll(".star");

    // check which star was clicked, and alter the star group's state depending on what it currently is
    if (eventTarget.id === "star-rating-1") {

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
    fetch(`/trailers-to-watch/rate?id=${currentID}&rating=${currentRating}`, { method: "PUT"});
    hideRatingDialog();
}