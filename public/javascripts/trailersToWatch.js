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

// called when the user clicks the confirm button on the trailers to watch rate trailer dialog
async function handleConfirmClick() {
    
    if (currentRating === 0) {

        // if the rating is 0 then we aren't interested in the fim at all
        fetch(`trailers-to-watch/${currentID}`, { method: "DELETE"});

    } else {

        let bodyData = { rating: currentRating, notes: document.querySelector(".notes").value };
        
        fetch(`trailers-to-watch/${currentID}/`, 
            { 
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData) 
            }
        );          
    }
}