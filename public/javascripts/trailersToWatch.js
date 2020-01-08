'use strict';

function showModalRatingDialog(filmTitle) {
    document.querySelector(".trailer-to-rate").textContent = filmTitle;
    document.querySelector(".modal-overlay").classList.toggle("show-modal");
}