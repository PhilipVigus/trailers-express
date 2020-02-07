'use strict';

function toggleOtherInfoVisibility(target) {
    target.nextSibling.classList.toggle("show-other-information");
}

function undoTrailerRating(trailerID) {

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

    const trailerElementToDelete = document.querySelector(`#id_${trailerID}`);
    trailerElementToDelete.parentNode.removeChild(trailerElementToDelete);
}