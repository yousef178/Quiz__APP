let countspan = document.querySelector(".quiz-info .count span");
let bulletsspancontainer = document.querySelector(".bullets .span");
let currentindex = 0;
let rightanswer = 0;
let countdowninterval;
let quizArea = document.querySelector(".quiz-area");
let answerarea = document.querySelector(".answers-area");
let sumbitbutton = document.querySelector(".sumbit-button");
let bullets = document.querySelector(".bullets");
let resultscontainer = document.querySelector(".result");
let countdownelement = document.querySelector(".countdowen");

function getQuestions() {
  let myrequest = new XMLHttpRequest();
  myrequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qcoun = questionsObject.length;

      createbullets(qcoun);

      addquestiondata(questionsObject[currentindex], qcoun);

      countdown(5, qcoun);

      sumbitbutton.onclick = () => {
        let therightanswer = questionsObject[currentindex].right_answer;

        currentindex++;

        checkanswer(therightanswer, qcoun);

        quizArea.innerHTML = "";
        answerarea.innerHTML = "";

        addquestiondata(questionsObject[currentindex], qcoun);

        clearInterval(countdowninterval);
        countdown(5, qcoun);

        handleBullets();

        showresult(qcoun);
      };
    }
  };

  myrequest.open("GET", "questions.json", true);
  myrequest.send();
}

getQuestions();

function createbullets(num) {
  countspan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let thebullets = document.createElement("span");

    if (i === 0) {
      thebullets.className = "on";
    }

    bulletsspancontainer.appendChild(thebullets);
  }
}

function addquestiondata(obj, count) {
  if (currentindex < count) {
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      let thelabel = document.createElement("label");

      thelabel.htmlFor = `answer_${i}`;

      let thelabeltext = document.createTextNode(obj[`answer_${i}`]);

      thelabel.appendChild(thelabeltext);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(thelabel);
      answerarea.appendChild(mainDiv);
    }
  }
}

function checkanswer(ranswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (ranswer === theChoosenAnswer) {
    rightanswer++;
    console.log("good");
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .span span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentindex === index) {
      span.className = "on";
    }
  });
}

function showresult(count) {
  let results;
  if (currentindex === count) {
    quizArea.remove();
    answerarea.remove();
    bullets.remove();
    sumbitbutton.remove();

    if (rightanswer > count / 2 && rightanswer < count) {
      results = `<span class="good" > Good </span>  ${rightanswer} form ${count}`;
    } else if (rightanswer === count) {
      results = `<span class="perfect" > perfect </span> ${rightanswer} form ${count}   `;
    } else {
      results = `<span class="bad" > bad </span>  ${rightanswer} form ${count}  `;
    }
    resultscontainer.innerHTML = results;
    resultscontainer.style.padding = "10px";
    resultscontainer.style.backgroundColor = "white";
    resultscontainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentindex < count) {
    let minutes, seconds;
    countdowninterval = setInterval(function () {
      let minutes = parseInt(duration / 60);
      let seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownelement.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countdowninterval);
        sumbitbutton.click();
      }
    }, 1000);
  }
}
