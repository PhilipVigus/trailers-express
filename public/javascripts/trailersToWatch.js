'use strict';

function toggleRatingDialogVisibility(filmTitle="") {
    document.querySelector(".trailer-to-rate").textContent = filmTitle;
    document.querySelector(".modal-overlay").classList.toggle("show-modal");
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

    } else if (eventTarget.id === "star-rating-2") {
        starGroup[0].classList.add("star--lit");

        if (!starGroup[2].classList.contains("star--lit")) {
            starGroup[1].classList.toggle("star--lit");
        }

        starGroup[2].classList.remove("star--lit");
    } else {

        starGroup[0].classList.add("star--lit");
        starGroup[1].classList.add("star--lit");
        starGroup[2].classList.toggle("star--lit");

    }
}