// ===== Persistent data =====
let sets = JSON.parse(localStorage.getItem("flashcardSets")) || [];

// ===== App state =====
let currentSetIndex = null;
let currentCards = [];
let playIndex = 0;
let isFlipped = false;
let touchStartX = 0;

// ===== Elements =====
const home = document.getElementById("home");
const setEditor = document.getElementById("setEditor");
const pickSet = document.getElementById("pickSet");
const player = document.getElementById("player");

const createSetBtn = document.getElementById("createSetBtn");
const manageSetsBtn = document.getElementById("manageSetsBtn");
const studyBtn = document.getElementById("studyBtn");
const recentSets = document.getElementById("recentSets");

const setTitleInput = document.getElementById("setTitleInput");
const saveSetBtn = document.getElementById("saveSetBtn");
const addCardBtn = document.getElementById("addCardBtn");
const cardQ = document.getElementById("cardQ");
const cardA = document.getElementById("cardA");
const cardsList = document.getElementById("cardsList");
const setsList = document.getElementById("setsList");

const backToHomeFromEditor = document.getElementById("backToHomeFromEditor");
const importFile = document.getElementById("importFile");
const importBtn = document.getElementById("importBtn");
const exportAllBtn = document.getElementById("exportAllBtn");

const playSets = document.getElementById("playSets");
const backToHomeFromPick = document.getElementById("backToHomeFromPick");
const shuffleSetsBtn = document.getElementById("shuffleSetsBtn");
const exportAllBtn2 = document.getElementById("exportAllBtn2");

const flashcardEl = document.getElementById("flashcard");
const frontSide = document.getElementById("frontSide");
const backSide = document.getElementById("backSide");
const playerTitle = document.getElementById("playerTitle");
const playerProgress = document.getElementById("playerProgress");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const flipBtn = document.getElementById("flipBtn");
const exitPlayer = document.getElementById("exitPlayer");
const shuffleCardsCheckbox = document.getElementById("shuffleCardsCheckbox");

// ===== Helpers =====
function saveSets() {
  localStorage.setItem("flashcardSets", JSON.stringify(sets));
}

function showScreen(screenEl) {
  [home, setEditor, pickSet, player].forEach(s => s.classList.add("hidden"));
  screenEl.classList.remove("hidden");
}

// ===== Render functions =====
function renderRecentSets() {
  recentSets.innerHTML = "";
  if (!sets.length) {
    recentSets.innerHTML = "<p class='muted'>No sets yet — create one!</p>";
    return;
  }
  // show up to 4 recent
  sets.slice().reverse().slice(0,4).forEach((s,i)=>{
    const idx = sets.length-1-i;
    const card = document.createElement("div");
    card.className = "set-card";
    card.innerHTML = `<h4>${escapeHTML(s.title)}</h4>
                      <p>${s.cards.length} cards</p>
                      <div class="set-actions">
                        <button onclick="openEditor(${idx})">Edit</button>
                        <button onclick="startStudy(${idx})" class="accent">Study</button>
                      </div>`;
    recentSets.appendChild(card);
  });
}

function renderSetsListInEditor() {
  setsList.innerHTML = "";
  if (!sets.length) {
    setsList.innerHTML = "<p class='muted'>No sets</p>";
    return;
  }
  sets.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "set-card";
    div.innerHTML = `<h4>${escapeHTML(s.title)}</h4>
      <p>${s.cards.length} cards</p>
      <div class="set-actions">
        <button onclick="openEditor(${i})">Open</button>
        <button onclick="duplicateSet(${i})">Duplicate</button>
        <button onclick="deleteSet(${i})" style="background:#b33a3a">Delete</button>
      </div>`;
    setsList.appendChild(div);
  });
}

function renderCardsListInEditor() {
  cardsList.innerHTML = "";
  if (currentSetIndex === null) return;
  const list = sets[currentSetIndex].cards;
  if (!list.length) {
    cardsList.innerHTML = "<p class='muted'>No cards yet</p>";
    return;
  }
  list.forEach((c, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<div class="card-text"><strong>${escapeHTML(c.q)}</strong><div style="color:var(--muted);font-size:0.9rem">${escapeHTML(c.a)}</div></div>
      <div class="card-actions">
        <button onclick="editCardPrompt(${i})">Edit</button>
        <button onclick="deleteCard(${i})" style="background:#b33a3a">Delete</button>
      </div>`;
    cardsList.appendChild(li);
  });
}

function renderPlaySets() {
  playSets.innerHTML = "";
  if (!sets.length) {
    playSets.innerHTML = "<p class='muted'>No sets available</p>";
    return;
  }
  sets.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "set-card";
    card.innerHTML = `<h4>${escapeHTML(s.title)}</h4>
                      <p>${s.cards.length} cards</p>
                      <div class="set-actions">
                        <button onclick="startStudy(${i})" class="accent">Study</button>
                        <button onclick="openEditor(${i})">Edit</button>
                      </div>`;
    playSets.appendChild(card);
  });
}

// ===== Actions: Sets =====
function createEmptySet() {
  const title = prompt("New set title:");
  if (!title) return;
  sets.push({ title: title.trim(), cards: [] });
  saveSets();
  renderSetsListInEditor();
  renderRecentSets();
  openEditor(sets.length - 1);
}

function openEditor(index) {
  currentSetIndex = index;
  setTitleInput.value = sets[index].title;
  renderCardsListInEditor();
  renderSetsListInEditor();
  showScreen(setEditor);
}

function saveSetEdits() {
  if (currentSetIndex === null) {
    // saving a new set not via prompt -> not used
    return;
  }
  const title = setTitleInput.value.trim();
  if (!title) return alert("Please enter a title for the set.");
  sets[currentSetIndex].title = title;
  saveSets();
  renderSetsListInEditor();
  renderRecentSets();
  alert("Set saved.");
}

function deleteSet(index) {
  if (!confirm(`Delete set "${sets[index].title}" ? This cannot be undone.`)) return;
  sets.splice(index, 1);
  saveSets();
  currentSetIndex = null;
  renderSetsListInEditor();
  renderRecentSets();
}

function duplicateSet(index) {
  const copy = JSON.parse(JSON.stringify(sets[index]));
  copy.title = copy.title + " (copy)";
  sets.push(copy);
  saveSets();
  renderSetsListInEditor();
  renderRecentSets();
  alert("Set duplicated.");
}

// ===== Actions: Cards in set =====
function addCardToCurrentSet() {
  if (currentSetIndex === null) {
    return alert("Open or create a set first.");
  }
  const q = cardQ.value.trim();
  const a = cardA.value.trim();
  if (!q || !a) return alert("Enter both front and back.");
  sets[currentSetIndex].cards.push({ q, a });
  saveSets();
  cardQ.value = "";
  cardA.value = "";
  renderCardsListInEditor();
}

function editCardPrompt(cardIndex) {
  const c = sets[currentSetIndex].cards[cardIndex];
  const nq = prompt("Edit front:", c.q);
  if (nq === null) return; // cancelled
  const na = prompt("Edit back:", c.a);
  if (na === null) return;
  sets[currentSetIndex].cards[cardIndex] = { q: nq.trim(), a: na.trim() };
  saveSets();
  renderCardsListInEditor();
}

function deleteCard(cardIndex) {
  if (!confirm("Delete this card?")) return;
  sets[currentSetIndex].cards.splice(cardIndex, 1);
  saveSets();
  renderCardsListInEditor();
}

// ===== Study / Player =====
function startStudy(index) {
  if (!sets[index] || sets[index].cards.length === 0) {
    if (!sets[index]) return alert("Set not found.");
    return alert("This set has no cards.");
  }
  currentSetIndex = index;
  currentCards = sets[index].cards.slice(); // copy
  playIndex = 0;
  isFlipped = false;

  if (shuffleCardsCheckbox.checked) {
    currentCards = shuffleArray(currentCards);
  }

  playerTitle.textContent = sets[index].title;
  updatePlayerCard();
  showScreen(player);
}

function updatePlayerCard() {
  const c = currentCards[playIndex];
  frontSide.textContent = c ? c.q : "";
  backSide.textContent = c ? c.a : "";
  flashcardEl.classList.remove("flipped");
  playerProgress.textContent = `${playIndex + 1} / ${currentCards.length}`;
}

function flipCard() {
  isFlipped = !isFlipped;
  flashcardEl.classList.toggle("flipped", isFlipped);
}

function nextCard() {
  playIndex = (playIndex + 1) % currentCards.length;
  isFlipped = false;
  updatePlayerCard();
}

function prevCard() {
  playIndex = (playIndex - 1 + currentCards.length) % currentCards.length;
  isFlipped = false;
  updatePlayerCard();
}

// ===== Import / Export =====
function exportAllSets() {
  const blob = new Blob([JSON.stringify(sets, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "flashcardSets.json";
  a.click();
  URL.revokeObjectURL(url);
}

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const data = JSON.parse(evt.target.result);
      if (Array.isArray(data)) {
        // assume array of sets or cards
        // determine if each element has title & cards
        const looksLikeSets = data.every(d => d && typeof d.title === "string" && Array.isArray(d.cards));
        if (looksLikeSets) {
          sets = sets.concat(data);
          saveSets();
          renderSetsListInEditor();
          renderRecentSets();
          alert("Imported sets.");
          return;
        }
      }

      // try to interpret as single set (object with title & cards)
      if (data && typeof data.title === "string" && Array.isArray(data.cards)) {
        sets.push(data);
        saveSets();
        renderSetsListInEditor();
        renderRecentSets();
        alert("Imported one set.");
        return;
      }

      alert("Unsupported import format. Expect JSON array of sets or a single set object.");
    } catch (err) {
      console.error(err);
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}

// ===== Utilities =====
function shuffleArray(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

// ===== Event wiring =====
createSetBtn.addEventListener("click", () => {
  const title = prompt("New set title:");
  if (!title) return;
  sets.push({ title: title.trim(), cards: [] });
  saveSets();
  renderSetsListInEditor();
  renderRecentSets();
  openEditor(sets.length - 1);
});

manageSetsBtn.addEventListener("click", () => {
  renderSetsListInEditor();
  showScreen(setEditor);
});

studyBtn.addEventListener("click", () => {
  renderPlaySets();
  showScreen(pickSet);
});

backToHomeFromEditor.addEventListener("click", () => {
  currentSetIndex = null;
  setTitleInput.value = "";
  showScreen(home);
  renderRecentSets();
});

backToHomeFromPick.addEventListener("click", () => {
  showScreen(home);
});

saveSetBtn.addEventListener("click", saveSetEdits);
addCardBtn.addEventListener("click", addCardToCurrentSet);
importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", handleImportFile);
exportAllBtn.addEventListener("click", exportAllSets);
exportAllBtn2.addEventListener("click", exportAllSets);
shuffleSetsBtn.addEventListener("click", () => {
  sets = shuffleArray(sets);
  saveSets();
  renderPlaySets();
  renderSetsListInEditor();
});

prevCardBtn.addEventListener("click", prevCard);
nextCardBtn.addEventListener("click", nextCard);
flipBtn.addEventListener("click", flipCard);
exitPlayer.addEventListener("click", () => { showScreen(home); renderRecentSets(); });

// Flip on click on card
flashcardEl.addEventListener("click", flipCard);

// Touch gestures for swipe
flashcardEl.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].clientX;
});
flashcardEl.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const dx = endX - touchStartX;
  if (dx > 60) prevCard();       // swipe right
  else if (dx < -60) nextCard(); // swipe left
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (player.classList.contains("hidden")) return;
  if (e.key === "ArrowRight") nextCard();
  if (e.key === "ArrowLeft") prevCard();
  if (e.key === " ") { e.preventDefault(); flipCard(); }
});

// Initial render
renderSetsListInEditor();
renderRecentSets();
renderPlaySets();

// expose some functions for onclick in markup
window.openEditor = openEditor;
window.startStudy = startStudy;
window.deleteSet = deleteSet;
window.duplicateSet = duplicateSet;
window.editCardPrompt = editCardPrompt;
window.deleteCard = deleteCard;
