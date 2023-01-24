var clearEl = document.querySelector("#clear");
var highscoresEl = document.querySelector("#highscores");


var initialsAndScores = [];

// event listener to clear the high scores from local storage, the initialsAndScores array and render it
clearEl.addEventListener("click", function(event) {
    //localStorage.clear(); //used only to clear all local storage whilst testing various functions!
    localStorage.setItem("initialsAndScores", "");
    initialsAndScores = [];
    renderInitialsAndScores();
    return;
});

//function to render what is found in the initialsAndScores array - called after clearing the array and also getting the scores from storage
function renderInitialsAndScores() {
    if(initialsAndScores.length > 0) {
        // Render a new li for each initial/score pair
        for (var i = 0; i < initialsAndScores.length; i++) {
            var li = document.createElement("li");
            li.textContent = initialsAndScores[i].initials + " : " + initialsAndScores[i].score;
            highscoresEl.appendChild(li);
        }
    }
    else {
        //remove the children from the highscores element
        highscoresEl.remove();
    }
    return;
}

// function getScores, called on entering this page
// get the scores from the local storage and if scores are there, parse it using JSON and render
function getScores() {
    var storedScores = localStorage.getItem("initialsAndScores");
    if (storedScores) {
        initialsAndScores = JSON.parse(storedScores);
    }
    renderInitialsAndScores();
    return;
}

getScores();