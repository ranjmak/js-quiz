var clearEl = document.querySelector("#clear");
var highscoresEl = document.querySelector("#highscores");


var initialsAndScores = [];


clearEl.addEventListener("click", function(event) {
    //localStorage.clear(); //used only to clear all local storage whilst testing various functions!
    localStorage.setItem("initialsAndScores", "");
    initialsAndScores = [];
    renderInitialsAndScores();
    return;
});

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
        highscoresEl.remove();
    }
    return;
}

function getScores() {
    var storedScores = localStorage.getItem("initialsAndScores");
    if (storedScores) {
        initialsAndScores = JSON.parse(storedScores);
    }
    renderInitialsAndScores();
    return;
}

getScores();