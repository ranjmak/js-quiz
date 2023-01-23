var startScreenEl = document.querySelector("#start-screen");
var endScreenEl = document.querySelector("#end-screen");
var questionsEl = document.querySelector("#questions");
var questionsTileEl = document.querySelector("#question-title");
var choicesEl = document.querySelector("#choices");
var timerEl = document.querySelector(".timer");
var startButtonEl = document.querySelector("#start");
var finalScoreEl = document.querySelector("#final-score");
var initialsEl = document.querySelector("#initials");
var endButtonEl = document.querySelector("#submit");

var timerCount;
var runningScore = 0;
var currentQuestion = 0;
var initialsAndScores = [];
var hr = document.createElement('hr');
var div = document.createElement('div');
var userInitials = '';


function getQuestion() {
    questionsTileEl.textContent = questions[currentQuestion].question;
}

// The startQuiz function is called when the start button is clicked
function startQuiz() {
    timerCount = 2;
    getQuestion();
    questionsEl.setAttribute("class", "show");
    startScreenEl.setAttribute("class", "hide"); 
    getScores();
    startTimer();
}

// endQuiz function is called when the submit button is clicked
function endQuiz(event) {
    event.preventDefault();

    currentQuestion = 0;
    runningScore = 0;
    choicesEl.innerHTML = '';
    hr.setAttribute("class", "line hide");
    div.setAttribute("class", "line hide");
    endScreenEl.setAttribute("class", "hide");
    startScreenEl.setAttribute("class", "start");
    return;
}

// The setTimer function starts and stops the timer and triggers the end screen
function startTimer() {
    // Sets timer
    timer = setInterval(function() {
      timerCount--;
      timerEl.textContent = "Time: "+timerCount;
      // Tests if time has run out
      if (timerCount === 0 || currentQuestion === questions.length) {
        // Clears interval
        clearInterval(timer);
        finalScoreEl.textContent = runningScore;
        initialsEl.value = '';
        questionsEl.setAttribute("class", "hide");
        endScreenEl.setAttribute("class", "show");
      }
    }, 1000);
}

function getScores() {
    var storedScores = localStorage.getItem("initialsAndScores");

    if (storedScores) {
        initialsAndScores = JSON.parse(storedScores);
    }
    return;
}
// Attach event listener to start button to call startQuiz function on click
startButtonEl.addEventListener("click", startQuiz);

// Attach event listener to submit button to call endQuiz function on click
endButtonEl.addEventListener("click", endQuiz);

//the user input for initials is validated, though they are allowed alphanumeric and special chars - aka Elon Musk's child!!!
initialsEl.addEventListener("keydown", function(event) {

});
