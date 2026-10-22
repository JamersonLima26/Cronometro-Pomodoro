const timeElement = document.querySelector(".time");
const controlButton = document.querySelector(".timer-control");
const resetButton = document.querySelector(".reset-button");
const workTimeElement = document.querySelector("#work-time-options");
const turnElement = document.querySelector(".turns");
const totalTurnsElement = document.querySelector("#total-turns-options");
const timeModeElement = document.querySelector(".time-mode");
const notificationSound = document.querySelector("#notification")
const circleElement = document.querySelector(".circle");

controlButton.addEventListener("click", toogleStartPause);
resetButton.addEventListener("click", reset);

let timeRemaining = 0;
let timer = null;
let isRunning = false;
let isBreakTime = false;
let worktime = 0;
let breakTime = 0;
let longeBreakTime = 0;
let totalTurns = 0;
let currentTurn = 1;
let totalTime = 0;

document.getElementById("toogle-config").addEventListener("click", () => {
  const config = document.getElementById("drop-content");
  config.style.display =
    config.style.display === "none" || !config.style.display ? "flex" : "none";
});

function toogleStartPause() {
  isRunning ? pause() : start();
}

function reset() {
  pause();
  initTimerSetting();
  updateTimeDisplay();
  updateUi();
}

function initTimerSetting() {
  const workValue = parseInt(workTimeElement.value);
  const turnsValue = parseInt(totalTurnsElement.value);
  isRunning = false;
  isBreakTime = false;
  worktime = workValue * 60;
  breakTime = (workValue / 5) * 60;
  longeBreakTime = (workValue / 2) * 60;
  totalTurns = turnsValue;
  currentTurn = 1;
  totalTime = worktime;
  timeRemaining = workValue * 60;
  timer = null;
}

function updateTurnsDisplay() {
  const mode = isBreakTime
    ? currentTurn < totalTurns
      ? "Descanso"
      : "Descanso Longo"
    : "Trabalho";

  timeModeElement.innerText = mode;
  turnElement.innerText = `${currentTurn}/${totalTurns}`;
}

function setCirclePercent(percent){
  //2*PI*R
  const circlePerimeter = 565.49
  const dashOffset = circlePerimeter - (circlePerimeter * percent) / 100;
  circleElement.style.setProperty("--dash-offset", dashOffset)
}


function updateTimeDisplay() {
  const minutes = Math.floor(timeRemaining / 60)
    .toString() // Transformar em string os valores.
    .padStart(2, "0"); // Sempre ter um 0 no começo do numero
  const seconds = (timeRemaining % 60).toString().padStart(2, "0");
  timeElement.innerText = `${minutes}:${seconds}`;

  const percent = (timeRemaining / totalTime) * 100;
  setCirclePercent(percent)
}

function nextTurn() {
  isBreakTime = !isBreakTime;
  if (!isBreakTime) currentTurn++;

  if (currentTurn <= totalTurns) {
    if (isBreakTime) {
      totalTime = currentTurn < totalTurns ? breakTime : longeBreakTime;
      showNotification("Hora de descansar", "Parabéns pelo trabalho aproveite os proximos minutos para descansar!!!")
    } else {
      totalTime = worktime;
      showNotification("Voltar ao trabalho", "Vocês tá quase lá, só mais alguns minutos de trabalho!!")
    }
    timeRemaining = totalTime;
  } else {
    reset();
  }
}

function showNotification(tittle, body){
  if (Notification.permission === "granted"){
    const notification = new Notification(tittle,{ body });
    setTimeout (() => notification.close(), 5000);
  }
}

function finishTurn() {
  notificationSound.play();
  nextTurn();
  updateUi();
}

function updateTimer() {
  if (timeRemaining > 0) {
    timeRemaining--;
    updateTimeDisplay();
  } else {
    finishTurn();
  }
}

function updateUi() {
  updateTimeDisplay();
  updateTurnsDisplay();
}

function start() {
  if(Notification.permission !== "granted"){
    Notification.requestPermission();
  }
  isRunning = true;
  controlButton.innerText = "Pausar";
  timer = setInterval(updateTimer, 1000);
}

function pause() {
  isRunning = false;
  controlButton.innerText = "Iniciar";
  clearInterval(timer);
}

initTimerSetting();
