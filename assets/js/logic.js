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

var maxTimerCountReqd = 75;
var timerCount;
var runningScore = 0;
var currentQuestion = 0;
var initialsAndScores = [];
var hr = document.createElement('hr');
var div = document.createElement('div');
var userInitials = '';


function getQuestion() {
    questionsTileEl.textContent = questions[currentQuestion].question;
    // Render a new button for each answer
    for (var i = 0; i < questions[currentQuestion].answers.length; i++) {
        var button = document.createElement("button");
        
        button.textContent = i+1+". "+questions[currentQuestion].answers[i];
        button.setAttribute("id", "answer");
        button.setAttribute("answer", i); 
        button.addEventListener("click", choiceMade);          
        choicesEl.appendChild(button);
    }
    return;
}

function choiceMade(event) {
    event.preventDefault();
    var choices = event.target;
    var correctSound = new Audio("./assets/sfx/correct.wav");
    var wrongSound = new Audio("./assets/sfx/incorrect.wav");

    currentQuestion++;
    hr.setAttribute("class", "line show");
    questionsEl.appendChild(hr);
    div.setAttribute("class", "line show");
    questionsEl.appendChild(div);

    if (choices.getAttribute("answer") == questions[currentQuestion-1].rightAnswer) {
        runningScore++;
        correctSound.play();
        div.textContent = "Correct";
    } 
    else {
        wrongSound.play();
        div.textContent = "Wrong";
        timerCount = timerCount - 10;
        if (timerCount < 0) {
            timerCount = 0;
        }
    }
    if(currentQuestion < questions.length) {
       //wait just enough for the user to see the correct/wrong message
        setTimeout(() => {
            choicesEl.innerHTML = '';
            hr.setAttribute("class", "line hide");
            div.setAttribute("class", "line hide");
            getQuestion();   
        }, 500);
    }
    return;
}

// The startQuiz function is called when the start button is clicked
function startQuiz() {
    timerCount = maxTimerCountReqd;
    getQuestion();
    questionsEl.setAttribute("class", "show");
    startScreenEl.setAttribute("class", "hide"); 
    getScores();
    startTimer();
    return;
}

// endQuiz function is called when the submit button is clicked
function endQuiz(event) {
    event.preventDefault();
    var iAndS = {
        initials: userInitials,
        score: finalScoreEl.innerHTML
    };

    if (userInitials != '') {
        initialsAndScores.push(iAndS);
        console.log(initialsAndScores);
        localStorage.setItem("initialsAndScores", JSON.stringify(initialsAndScores));
    }
    else {
        return;
    }
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
        if(timerCount >0 ) {
            timerCount--;
        }
        else {
            timerCount = 0;
        }

      timerEl.textContent = "Time: "+timerCount;
      // Tests if time has run out
      if (timerCount <= 0 || currentQuestion === questions.length) {
        // Clears interval
        clearInterval(timer);
        finalScoreEl.textContent = runningScore;
        initialsEl.value = '';
        questionsEl.setAttribute("class", "hide");
        endScreenEl.setAttribute("class", "show");
      }
      return;
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

//the user input for initials is validated, they are only allowed lowercase & uppercase alphabet characters
initialsEl.addEventListener("keydown", function(event) {
    var alphaChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    if (userInitials.length < initialsEl.getAttribute("max") && event.keyCode != 8) {
        if(alphaChars.includes(event.key)) {
            userInitials += event.key;
        }
        else {
            event.preventDefault();
        }
    }
    else if(event.keyCode === 13) {
        event.preventDefault();
    }
    else if (event.keyCode === 8 && userInitials.length != 0){
        userInitials = userInitials.slice(0, userInitials.length-1);
    }  
    else {
        event.preventDefault();
    }
    return;
});
