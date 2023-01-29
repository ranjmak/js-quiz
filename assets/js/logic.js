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

var maxTimerCountReqd = 75; //num of secs required
var timerCount; // count down time counter
var runningScore = 0; // the running score of the number of right questions
var currentQuestion = 0; // where we are in the question list
var initialsAndScores = []; // data that will be pushed to the local storage
var hr = document.createElement('hr'); // a light horizontal rule
var div = document.createElement('div'); // div section for saying correct/wrong
var userInitials = '';

// function to render a question from the questions array (questions found in questions.js) and dynamic buttons for answers
function getQuestion() {
    questionsTileEl.textContent = questions[currentQuestion].question;
    // Render a new button for each answer
    for (var i = 0; i < questions[currentQuestion].answers.length; i++) {
        var button = document.createElement("button");
        
        button.textContent = i+1+". "+questions[currentQuestion].answers[i];
        button.setAttribute("id", "answer");
        button.setAttribute("answer", i); 
        // call choiceMade function when the user clicks on an answer
        button.addEventListener("click", choiceMade);          
        choicesEl.appendChild(button);
    }
    return;
}

// function to ascertain whether the answer was correct/wrong and alert the user to that fact visually and via audio
// also update the runningScore if correct
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
        // we don't want to see -ve numer for time, so ensure we show 0 when a wrong answer forces timer below 0
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
// it initialises and starts the timer, hides the startScreen element and shows the questions element
function startQuiz() {
    timerCount = maxTimerCountReqd;
    getQuestion();
    questionsEl.setAttribute("class", "show");
    startScreenEl.setAttribute("class", "hide"); 
    // gets the scores if any from local storage into the initialsAndScores array
    // so that we can push any new initials & scores combo to the array before adding to local storage
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
    // if initials is not empty, push it to the initialsAndScores array before adding it to local storage
    if (userInitials != '') {
        initialsAndScores.push(iAndS);
        localStorage.setItem("initialsAndScores", JSON.stringify(initialsAndScores));
    }
    else {
        return;
    }
    // clear the current vars, hide correct/wrong and endScreen element classes and show the startScreen element
    currentQuestion = 0;
    runningScore = 0;
    choicesEl.innerHTML = '';
    hr.setAttribute("class", "line hide");
    div.setAttribute("class", "line hide");
    endScreenEl.setAttribute("class", "hide");
    startScreenEl.setAttribute("class", "start");
    window.location.href = "highscores.html";
}

// The setTimer function starts and stops the timer and triggers the end screen
function startTimer() {
    // Sets timer
    timer = setInterval(function() {
        if(timerCount >0 ) {
            timerCount--;
        }
        else {
            // we don't like -ve time! which can happen when 10 is substracted for a wrong answer
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

// function to get data into initialsAndScores array from local storage
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

    // the following only allows the max (as dictated by index.html) number of initials of uppercase & lowercase chars
    // but backspace (keyCode 8) is allowed in certain cases!
    if (userInitials.length < initialsEl.getAttribute("max") && event.keyCode != 8) {
        if(alphaChars.includes(event.key)) {
            userInitials += event.key;
        }
        else {
            // ignore other keypresses
            event.preventDefault();
        }
    }
    else if(event.keyCode === 13) {
        // ignore the enter/return key
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
