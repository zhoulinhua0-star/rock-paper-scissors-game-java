const MOVES = ["rock", "paper", "scissors"];

const MOVE_LABEL = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
};

/** @type {Record<string, string>} */
const CARD_GLYPH = {
  rock: `<svg viewBox="0 0 64 64" width="92" height="92" aria-hidden="true"><path fill="currentColor" d="M10 54c14-34 42-42 42-42s2 34-42 42z"/><circle cx="41" cy="18" r="6" fill="var(--surface)"/></svg>`,
  paper: `<svg viewBox="0 0 64 64" width="92" height="92" aria-hidden="true"><path fill="currentColor" d="M8 12h30l18 42H12L8 12z"/><path fill="var(--surface)" opacity=".35" d="M16 20h18l14 34H21L16 20z"/></svg>`,
  scissors: `<svg viewBox="0 0 64 64" width="92" height="92" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" d="M10 54l18-42M54 54L36 12"/><circle cx="32" cy="36" r="7" fill="currentColor"/></svg>`,
};

function pickComputerMove() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

/** @param {string} player @param {string} computer */
function judgeRound(player, computer) {
  if (player === computer) return "tie";
  const win =
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper");
  return win ? "win" : "lose";
}

/** @param {"win"|"lose"|"tie"} outcome */
function scoreFromOutcome(outcome) {
  switch (outcome) {
    case "tie":
      return 1;
    case "win":
      return 2;
    case "lose":
      return -1;
    default:
      return 0;
  }
}

const els = {
  arena: document.getElementById("arena"),
  glyphYou: document.getElementById("glyph-you"),
  glyphHouse: document.getElementById("glyph-house"),
  labelYou: document.getElementById("label-you"),
  labelHouse: document.getElementById("label-house"),
  movesIntro: document.getElementById("moves-intro"),
  moveButtons: document.getElementById("move-buttons"),
  verdict: document.getElementById("verdict-headline"),
  scoreHint: document.getElementById("score-hint"),
  statusLine: document.getElementById("status-line"),
  scoreValue: document.getElementById("score-value"),
  lastPlayer: document.getElementById("last-player"),
  lastHouse: document.getElementById("last-house"),
  roundActions: document.getElementById("round-actions"),
  btnAgain: document.getElementById("btn-again"),
  btnQuit: document.getElementById("btn-quit"),
  epilogue: document.getElementById("epilogue"),
  finalScore: document.getElementById("final-score"),
  btnRestart: document.getElementById("btn-restart"),
  announce: document.getElementById("sr-announcement"),
};

/** @typedef {"picking"|"busy"|"prompting"|"farewell"} Phase */
/** @type {Phase} */
let phase = "picking";
let score = 0;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** @param {string} verbal */
function speak(verbal) {
  els.announce.textContent = "";
  window.requestAnimationFrame(() => {
    els.announce.textContent = verbal;
  });
}

function setMovesDisabled(disabled) {
  /** @type {NodeListOf<HTMLButtonElement>} */
  const nodes = els.moveButtons.querySelectorAll(".move");
  nodes.forEach((btn) => {
    btn.disabled = disabled;
  });
}

function mysteryHouseGlyph() {
  els.glyphHouse.innerHTML =
    '<span class="pulse-dot"></span>';
  els.glyphHouse.classList.add("card__glyph--mystery");
}

function clearArenaMood() {
  els.arena.classList.remove(
    "is-revealing",
    "is-resolving",
    "arena--tie",
    "arena--win",
    "arena--lose",
  );
  /** @type {HTMLElement[]} */
  const cards = [els.glyphHouse.closest(".card"), els.glyphYou.closest(".card")].filter(Boolean);
  cards.forEach((c) => c.classList.remove("reveal-pop"));
}

function verdictCopy(outcome) {
  switch (outcome) {
    case "win":
      return { headline: "You win!", hintTone: `Board credits +${scoreFromOutcome("win")}`, mood: "win" };
    case "tie":
      return {
        headline: "Tied round.",
        hintTone: `Shared pot +${scoreFromOutcome("tie")}`,
        mood: "tie",
      };
    case "lose":
      return {
        headline: "House takes it.",
        hintTone: `Ledger trims ${scoreFromOutcome("lose")}`,
        mood: "lose",
      };
    default:
      return { headline: "", hintTone: "", mood: "" };
  }
}

function verdictVerbal(player, computer, outcome) {
  const p = MOVE_LABEL[player];
  const h = MOVE_LABEL[computer];
  switch (outcome) {
    case "win":
      return `You threw ${p}. House threw ${h}. You win.`;
    case "tie":
      return `You threw ${p}. House threw ${h}. Tie.`;
    case "lose":
      return `You threw ${p}. House threw ${h}. House wins the round.`;
    default:
      return "";
  }
}

async function settleRound(player) {
  if (phase !== "picking") return;
  phase = "busy";
  setMovesDisabled(true);
  clearArenaMood();
  els.roundActions.classList.add("round-actions--hidden");
  els.verdict.hidden = true;
  els.scoreHint.hidden = true;

  els.labelYou.textContent = MOVE_LABEL[player];
  els.glyphYou.innerHTML = CARD_GLYPH[player];
  mysteryHouseGlyph();
  els.labelHouse.textContent = "Thinking…";

  els.movesIntro.textContent = "Sealed gesture";
  els.statusLine.textContent = "Violet veil lifts shortly…";

  const computer = pickComputerMove();

  els.arena.classList.add("is-revealing");
  await wait(560);

  els.glyphHouse.innerHTML = CARD_GLYPH[computer];
  els.glyphHouse.classList.remove("card__glyph--mystery");
  els.labelHouse.textContent = MOVE_LABEL[computer];
  const houseCard = els.glyphHouse.closest(".card");
  if (houseCard) houseCard.classList.add("reveal-pop");

  const outcome = judgeRound(player, computer);
  const verbalCore = verdictVerbal(player, computer, outcome);
  const { headline, mood, hintTone } = verdictCopy(outcome);

  els.arena.classList.remove("is-revealing");
  els.arena.classList.add("is-resolving", `arena--${mood}`);

  els.verdict.hidden = false;
  els.verdict.textContent = headline;
  els.verdict.classList.remove("verdict--win", "verdict--tie", "verdict--lose");
  els.verdict.classList.add(`verdict--${mood}`);

  await wait(80);
  els.statusLine.textContent =
    outcome === "win"
      ? "Clean read—celebrate in neon."
      : outcome === "tie"
        ? "Even duel. No shame in a draw."
        : "Rough beat. Table stays honest—shuffle again anytime.";

  speak(`${verbalCore}`);

  await wait(340);
  els.scoreHint.hidden = false;
  els.scoreHint.textContent = hintTone;
  els.scoreHint.classList.remove("flash");
  void els.scoreHint.offsetWidth;
  els.scoreHint.classList.add("flash");

  await wait(220);
  score += scoreFromOutcome(outcome);
  els.scoreValue.textContent = String(score);

  els.lastPlayer.textContent = MOVE_LABEL[player];
  els.lastHouse.textContent = MOVE_LABEL[computer];

  speak(`${verbalCore} Session score ${score}.`);

  await wait(120);
  els.arena.classList.remove("is-resolving");

  els.roundActions.classList.remove("round-actions--hidden");
  phase = "prompting";
  els.btnAgain.focus({ preventScroll: true });
}

function resumePicking() {
  clearArenaMood();
  els.roundActions.classList.add("round-actions--hidden");
  els.verdict.hidden = true;
  els.scoreHint.hidden = true;

  els.movesIntro.textContent = "Lock in your gesture";
  els.statusLine.textContent = "Deal your move—the house waits in the violet void.";

  els.labelYou.textContent = "Choose";
  els.glyphYou.innerHTML = "";
  mysteryHouseGlyph();
  els.labelHouse.textContent = "Awaiting seal";

  setMovesDisabled(false);
  phase = "picking";

  els.announce.textContent = "";
  els.moveButtons.querySelector(".move")?.focus();
}

function quitSession() {
  phase = "farewell";
  document.body.classList.add("is-endgame");
  els.finalScore.textContent = String(score);
  els.epilogue.classList.remove("epilogue--hidden");
  els.btnRestart.focus({ preventScroll: true });
}

function restartSession() {
  score = 0;
  els.scoreValue.textContent = "0";
  els.lastPlayer.textContent = "—";
  els.lastHouse.textContent = "—";
  els.epilogue.classList.add("epilogue--hidden");
  document.body.classList.remove("is-endgame");
  resumePicking();
}

function handlePick(move) {
  if (phase !== "picking") return;
  void settleRound(move);
}

function handleKeyboard(event) {
  const key = event.key.toLowerCase();

  if (phase === "picking") {
    if (key === "r" || key === "p" || key === "s") {
      /** @type {Record<string, string>} */
      const map = { r: "rock", p: "paper", s: "scissors" };
      event.preventDefault();
      handlePick(map[key]);
      return;
    }
  }

  if (phase === "prompting") {
    if (key === "y" || key === "enter") {
      event.preventDefault();
      resumePicking();
      return;
    }
    if (key === "n" || event.key === "Escape") {
      event.preventDefault();
      quitSession();
    }
  }
}

els.moveButtons.querySelectorAll(".move").forEach((btn) => {
  btn.addEventListener("click", () => {
    const move = btn.getAttribute("data-move");
    if (move) handlePick(move);
  });
});

els.btnAgain.addEventListener("click", () => resumePicking());
els.btnQuit.addEventListener("click", () => quitSession());
els.btnRestart.addEventListener("click", () => restartSession());

document.addEventListener("keydown", handleKeyboard);

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("is-endgame");
  els.moveButtons.querySelector(".move")?.focus();
});
