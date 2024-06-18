
let countspan = document.querySelector(".count span")
let startBtn = document.querySelector(".start-btn");
let quizSection = document.querySelector(".quiz");
let bulletsSpanContainer = document.querySelector(".bullets .spans")
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;


function getQuestions(){
    let myrequest = new XMLHttpRequest();

    myrequest.onreadystatechange = function (){
        if(this.readyState === 4 && this.status === 200){
            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length;

            createBullets(qCount);

            addQuestionData(questionObject[currentIndex],qCount);

            countdown(90,qCount);

            submitButton.onclick = () => {
                let theRightAnswer = questionObject[currentIndex].right_answer;
                
                currentIndex++;

                checkAnswer(theRightAnswer , qCount);

                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                addQuestionData(questionObject[currentIndex],qCount);

                handleBullets();

                clearInterval(countdownInterval);
                countdown(90,qCount);

                showResults(qCount);
            }
        }
    }

    myrequest.open("GET", "html_questions.json", true);
    myrequest.send();
}

getQuestions();

function createBullets(num){
    countspan.innerHTML = num;

    for(let i=0 ; i < num; i++){
        let theBullet = document.createElement("span");

        if(i==0){
            theBullet.className="on";
        }

        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj , count){

    if(currentIndex < count){
        let questionTitle = document.createElement("h2");
    
        let questionText = document.createTextNode(obj.title);
    
        questionTitle.appendChild(questionText);
    
        quizArea.appendChild(questionTitle);
    
        for(let i=1; i <= 4; i++){
            let mainDiv = document.createElement('div');
    
            mainDiv.className = "answer";
    
            let radioInput = document.createElement("input");
    
            radioInput.type = "radio";
            radioInput.name = "question";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
    
            let theLabel = document.createElement("label");
    
            theLabel.htmlFor = `answer_${i}`;
    
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
    
            theLabel.appendChild(theLabelText);
    
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
    
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer , count){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i=0 ; i < answers.length ; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === theChoosenAnswer){
        rightAnswer++;
    }
}

function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let bulletsArray = Array.from(bulletsSpans);
    bulletsArray.forEach((span , index) => {
        if (currentIndex === index){
            span.className = "on";
        }
    })
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        
        if(rightAnswer > count / 2 && rightAnswer < count){
            theResults = `<span class="good"> GOOD</span>, ${rightAnswer} from ${count}.`;
        }else if (rightAnswer === count){
            theResults = `<span class="perfect"> PERFECT</span>,  ${rightAnswer} from ${count}.`
        }else{
            theResults = `<span class="bad"> BAD</span>,  ${rightAnswer} from ${count}, try again.`
        }
        resultsContainer.innerHTML = theResults;
    }
    
}

function countdown(duration , count){
    if(currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval( function(){
            minutes = parseInt( duration / 60);
            seconds = parseInt( duration % 60);

           minutes = minutes < 10 ? `0${minutes}`: minutes;
           seconds = seconds < 10 ? `0${seconds}`: seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0){
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
    
}
