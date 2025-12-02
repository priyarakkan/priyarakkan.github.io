let words = [];
let currentIndex = 0;
let timer = 60;
let countdown;
let results = [];
let language = 'en';

// Elements
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const resultsScreen = document.getElementById("results");
const card = document.getElementById("card");
const timerEl = document.getElementById("timer");
const resultsList = document.getElementById("resultsList");

// Events
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("langSelect").addEventListener("change", (e) => {
  language = e.target.value;
});
document.getElementById("skipBtn").addEventListener("click", nextWord);
document.getElementById("correctBtn").addEventListener("click", correctWord);
document.getElementById("playAgainBtn").addEventListener("click", () => location.reload());

// Start game
async function startGame() {
  const response = await fetch("deck.json");
  const data = await response.json();
  words = shuffle(data.words);

  menu.classList.add("hidden");
  game.classList.remove("hidden");

  drawCard();
  startTimer();
}

// Timer
function startTimer() {
  countdown = setInterval(() => {
    timer--;
    timerEl.textContent = timer;

    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

// Draw card based on language mode
function drawCard() {
  const word = words[currentIndex];

  if (language === "en") {
    card.textContent = word.en;
  } else if (language === "ta") {
    card.textContent = word.ta;
  } else {
    card.innerHTML = `${word.en}<br><small>${word.ta}</small>`;
  }
}

// On skip / correct
function nextWord() {
  results.push({ word: words[currentIndex], result: "skipped" });
  moveNext();
}

function correctWord() {
  results.push({ word: words[currentIndex], result: "correct" });
  moveNext();
}

function moveNext() {
  currentIndex++;
  if (currentIndex >= words.length) {
    endGame();
    return;
  }
  drawCard();
}

// End screen
function endGame() {
  clearInterval(countdown);

  game.classList.add("hidden");
  resultsScreen.classList.remove("hidden");

  resultsList.innerHTML = "";

  results.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.word.en} / ${item.word.ta} — ${item.result}`;
    resultsList.appendChild(li);
  });
}

// Shuffle
function shuffle(array) {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
