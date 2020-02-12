'use strict';

/**
 * Variables storing the rating and ID of the trailer being rated. Having these as
 * globals isn't ideal, but at this stage it will do
 */
let currentRating = 0;
let currentID = 0;

// called when a rate film button is clicked on the trailer list
function showRatingDialog(filmTitle, trailerID) {
    setDialogData();
    showDialogElement();

    function setDialogData() {
        currentID = trailerID;
        document.querySelector(".trailer-to-rate").textContent = filmTitle;
    }

    function showDialogElement() {
        document.querySelector(".modal-overlay").classList.toggle("show-modal");
    }
}

// called when the onfirm or cancel dialog buttons are clicked
function hideAndResetDialog() {

    hideDialogElement();
    resetDialogData();


    function hideDialogElement() {
        document.querySelector(".modal-overlay").classList.toggle("show-modal");
    }

    function resetDialogData() {

        resetCurrentTrailerInfo();
        unlightAllStars();
        clearNotes();

        function resetCurrentTrailerInfo() {
            currentID = 0;
            currentRating = 0;
        }

        function unlightAllStars() {
            const starGroup = document.querySelectorAll(".star");
            /**
             * I don't use foreach here as reports of browser support for it
             * on node lists is inconsistent so I do it this way just to be safe
             */
            for (let i = 0; i < starGroup.length; i++) {
                starGroup[i].classList.remove("star--lit");
            }
        }

        function clearNotes() {
            document.querySelector(".notes").value = "";
        }
    }
}

// called when any of the star elements on the rating dialog are clicked
function handleStarClick(eventTarget) {

    const starElements = document.querySelectorAll(".star");

    /** 
     * Star elements on the page are given ids star-rating-1, 2 and 3.
     * This code works out how to react to each one being clicked based
     * on which stars were already 'on', updating currentRating to reflect the change
     */
    if (eventTarget.id === "star-rating-1") {
        handleClickOnFirstStar();
    } else if (eventTarget.id === "star-rating-2") {
        handleClickOnSecondStar();
    } else {
        handleClickOnThirdStar();
    }

    function handleClickOnFirstStar() {

        if (!starElements[1].classList.contains("star--lit")) {
            starElements[0].classList.toggle("star--lit");
        }

        starElements[1].classList.remove("star--lit");
        starElements[2].classList.remove("star--lit");

        if (starElements[0].classList.contains("star--lit")) {
            currentRating = 1;
        } else {
            currentRating = 0;
        }
    }

    function handleClickOnSecondStar() {

        starElements[0].classList.add("star--lit");

        if (!starElements[2].classList.contains("star--lit")) {
            starElements[1].classList.toggle("star--lit");
        }

        starElements[2].classList.remove("star--lit");

        if (starElements[1].classList.contains("star--lit")) {
            currentRating = 2;
        } else {
            currentRating = 1;
        }
    }

    function handleClickOnThirdStar() {

        starElements[0].classList.add("star--lit");
        starElements[1].classList.add("star--lit");
        starElements[2].classList.toggle("star--lit");

        if (starElements[2].classList.contains("star--lit")) {
            currentRating = 3;
        } else {
            currentRating = 2;
        }
    }




}

// called when the confirm button on the trailers to watch rate trailer dialog is clicked
async function handleConfirmClick() {
    if (currentRating === 0) {
        // if the rating is 0 then we aren't interested in the fim at all so delete it
        deleteTrailerFromDatabase(currentID);
    } else {
        setTrailerRatingAndNotes(currentID);
    }

    deleteTrailerToWatchElementFromPage(currentID);
    hideAndResetDialog();

    function setTrailerRatingAndNotes(trailerId) {
        const fetchRequestBodyData = { rating: currentRating, notes: document.querySelector(".notes").value };
        fetch(`trailers-to-watch/${trailerId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fetchRequestBodyData)
        });
    }
}

// called with a delete button is clicked for one of the trailers
async function handleDeleteClick(trailerId) {
    deleteTrailerFromDatabase(trailerId)
    deleteTrailerToWatchElementFromPage(trailerId)
}

function deleteTrailerFromDatabase(trailerId) {
    fetch(`trailers-to-watch/${trailerId}`, { method: "DELETE" });
}

function deleteTrailerToWatchElementFromPage(trailerId) {
    const trailerElementToDelete = document.querySelector(`#id_${trailerId}`);
    trailerElementToDelete.parentNode.removeChild(trailerElementToDelete);
}