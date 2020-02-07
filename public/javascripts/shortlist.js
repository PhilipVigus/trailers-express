'use strict';

/**
 * Shows/Hides the div containing the extra information for a film that has
 * been shortlisted. Triggered by clicking on a film in the shortlist
 */
function toggleOtherInfoVisibility(target) {
    target.nextSibling.classList.toggle("show-other-information");
}

function deleteTrailerRatingAndNotes(trailerID) {

    const fetchRequestBodyData = { rating: undefined, notes: "" };
        
    fetch(`shortlist/${trailerID}/`, 
        { 
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fetchRequestBodyData) 
        }
    ); 

    deleteTrailerElementFromPage(trailerID);
}

function deleteTrailerAsFilmWatched(trailerID) {

    fetch(`shortlist/${trailerID}/`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    deleteTrailerElementFromPage(trailerID);
}

function deleteTrailerElementFromPage(trailerID) {
    const trailerElementToDelete = document.querySelector(`#id_${trailerID}`);
    trailerElementToDelete.parentNode.removeChild(trailerElementToDelete);
}
