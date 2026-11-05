"use strict";

// ==========================================
// CUSTOMIZE YOUR PAGE HERE
// ==========================================

// Your friend's name and yours.
// You can also share a link like: friendship.html?to=Rahul&from=Kushal
const defaultFriend = "buddy";
const defaultFrom = "Your friend";

const compliments = [
  {
    emoji: "😂",
    title: "Funny",
    text: "You can turn the worst day into a good one with one joke."
  },
  {
    emoji: "🛡️",
    title: "Reliable",
    text: "Whenever I needed someone, you were already there."
  },
  {
    emoji: "🧠",
    title: "Wise",
    text: "Your advice is always honest, even when I don't want to hear it."
  },
  {
    emoji: "🍕",
    title: "Fun",
    text: "Every plan is better when you are part of it."
  }
];

const quizQuestions = [
  {
    question: "What do we do best together?",
    options: ["Plan things and never do them", "Laugh at nothing", "Both, obviously"],
    answerIndex: 2
  },
  {
    question: "Who usually ends up paying for the snacks?",
    options: ["Me", "You", "Whoever loses the argument"],
    answerIndex: 2
  },
  {
    question: "What is the rule of this friendship?",
    options: ["No judging", "Always support each other", "Both"],
    answerIndex: 2
  }
];

const certificateText =
  "For being a loyal, funny and dependable friend.\n" +
  "Thank you for all the laughs, the help and the great memories.";

// Put your music file in the SAME folder as friendship.html.
// Use a simple lowercase name with no spaces. Set to "" for no music.
const musicURL = "music.mp3";

// ==========================================
// ELEMENTS
// ==========================================

const $ = (id) => document.getElementById(id);

const friendNameEl = $("friendName");
const startBtn = $("startBtn");
const cardGrid = $("cardGrid");
const cardText = $("cardText");
const toQuizBtn = $("toQuizBtn");
const quizList = $("quizList");
const quizStatus = $("quizStatus");
const toCertBtn = $("toCertBtn");
const certName = $("certName");
const certBody = $("certBody");
const certDate = $("certDate");
const certFrom = $("certFrom");
const printBtn = $("printBtn");
const replayBtn = $("replayBtn");
const sparklesContainer = document.querySelector(".sparkles");
const musicEl = $("bgMusic");
const musicBtn = $("musicBtn");

// ==========================================
// STATE
// ==========================================

let solvedCount = 0;
let musicOn = false;

// ==========================================
// HELPERS
// ==========================================

function getParam(name, fallback) {
  const value = new URLSearchParams(window.location.search).get(name);
  return value && value.trim() ? value.trim().slice(0, 40) : fallback;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
}

// ==========================================
// MUSIC
// ==========================================

function updateMusicBtn() {
  musicBtn.textContent = musicOn ? "🔊" : "🔇";
}

function startMusic() {
  if (!musicEl || !musicURL) return;

  if (!musicEl.getAttribute("src")) {
    musicEl.src = musicURL;
  }

  musicEl.volume = 0.35;

  const p = musicEl.play();
  if (p && typeof p.then === "function") {
    p.then(() => {
      musicOn = true;
      updateMusicBtn();
    }).catch((err) => {
      console.log("Music blocked until a user tap:", err);
    });
  }
}

function toggleMusic() {
  if (musicOn) {
    musicEl.pause();
    musicOn = false;
    updateMusicBtn();
  } else {
    startMusic();
  }
}

function setupMusic() {
  if (!musicURL || !musicEl) return;

  musicBtn.hidden = false;
  updateMusicBtn();

  musicEl.addEventListener("error", () => {
    console.error("Audio failed to load:", musicEl.currentSrc, musicEl.error);
    musicBtn.hidden = true;
  });

  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
  });
}

// ==========================================
// SPARKLES + CONFETTI
// ==========================================

function createSparkle() {
  if (!sparklesContainer) return;

  const item = document.createElement("span");
  item.textContent = ["✨", "⭐", "🎈", "🌟"][Math.floor(Math.random() * 4)];
  item.style.left = Math.random() * 100 + "%";
  item.style.fontSize = 14 + Math.random() * 16 + "px";
  item.style.animationDuration = 7 + Math.random() * 6 + "s";

  sparklesContainer.appendChild(item);
  setTimeout(() => item.remove(), 13000);
}

function showConfetti(count = 60) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = -20 - Math.random() * 80 + "px";
    piece.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 65%)`;
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3800);
  }
}

// ==========================================
// COMPLIMENT CARDS
// ==========================================

function renderCards() {
  cardGrid.innerHTML = "";
  cardText.textContent = "";
  toQuizBtn.disabled = true;

  let opened = 0;

  compliments.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card-btn";

    const emoji = document.createElement("span");
    emoji.className = "emoji";
    emoji.textContent = item.emoji;

    const label = document.createElement("span");
    label.textContent = item.title;

    btn.append(emoji, label);

    btn.addEventListener("click", () => {
      cardText.textContent = item.text;

      if (!btn.classList.contains("opened")) {
        btn.classList.add("opened");
        opened++;
        showConfetti(10);
      }

      if (opened === compliments.length) {
        toQuizBtn.disabled = false;
      }
    });

    cardGrid.appendChild(btn);
  });
}

// ==========================================
// QUIZ
// ==========================================

function renderQuiz() {
  quizList.innerHTML = "";
  quizStatus.textContent = "";
  toCertBtn.disabled = true;
  solvedCount = 0;

  quizQuestions.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "quiz-card";

    const question = document.createElement("p");
    question.className = "quiz-question";
    question.textContent = `${index + 1}. ${item.question}`;
    card.appendChild(question);

    item.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-btn";
      button.textContent = option;

      button.addEventListener("click", () => {
        if (card.dataset.solved === "true") return;

        const buttons = card.querySelectorAll(".option-btn");
        buttons.forEach((node) => node.classList.remove("wrong", "correct"));

        if (optionIndex === item.answerIndex) {
          button.classList.add("correct");
          card.dataset.solved = "true";
          buttons.forEach((node) => (node.disabled = true));

          solvedCount++;
          showConfetti(15);
          quizStatus.textContent = "Correct! 🎯";
        } else {
          button.classList.add("wrong");
          quizStatus.textContent = "Nope, try again 😄";
        }

        if (solvedCount === quizQuestions.length) {
          quizStatus.textContent = "Perfect score! 🏆";
          toCertBtn.disabled = false;
        }
      });

      card.appendChild(button);
    });

    quizList.appendChild(card);
  });
}

// ==========================================
// CERTIFICATE
// ==========================================

function fillCertificate(friend, from) {
  certName.textContent = friend;
  certBody.textContent = certificateText;
  certFrom.textContent = from;
  certDate.textContent = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// ==========================================
// INIT
// ==========================================

function init() {
  const friend = getParam("to", defaultFriend);
  const from = getParam("from", defaultFrom);

  friendNameEl.textContent = friend;
  fillCertificate(friend, from);

  renderCards();
  renderQuiz();
  setupMusic();

  startBtn.addEventListener("click", () => {
    startMusic();
    showConfetti(50);
    showScreen("cards");
  });

  toQuizBtn.addEventListener("click", () => showScreen("quiz"));

  toCertBtn.addEventListener("click", () => {
    showConfetti(90);
    showScreen("certificate");
  });

  printBtn.addEventListener("click", () => window.print());

  replayBtn.addEventListener("click", () => {
    renderCards();
    renderQuiz();
    showScreen("intro");
  });

  // Retry music on the first real interaction if autoplay was blocked.
  ["pointerdown", "touchstart", "click", "keydown"].forEach((evt) => {
    document.addEventListener(
      evt,
      () => {
        if (!musicOn && !musicBtn.hidden) startMusic();
      },
      { passive: true, once: true }
    );
  });

  createSparkle();
  setInterval(createSparkle, 800);

  showScreen("intro");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
