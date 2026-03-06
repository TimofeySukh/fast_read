const state = {
  fileName: "",
  rawText: "",
  words: [],
  currentWordIndex: 0,
  speedWpm: 100,
  playbackTimer: null,
  breakTimer: null,
  activePlaybackMs: 0,
  nextBreakMs: 60000,
};

const setupSection = document.getElementById("setupSection");
const countdownSection = document.getElementById("countdownSection");
const readerSection = document.getElementById("readerSection");
const feedbackSection = document.getElementById("feedbackSection");
const thankYouSection = document.getElementById("thankYouSection");

const pdfInput = document.getElementById("pdfInput");
const speedInput = document.getElementById("speedInput");
const loadPdfBtn = document.getElementById("loadPdfBtn");
const startBtn = document.getElementById("startBtn");
const setupStatus = document.getElementById("setupStatus");

const countdownNumber = document.getElementById("countdownNumber");
const focusText = document.getElementById("focusText");
const readerFileName = document.getElementById("readerFileName");
const readerProgress = document.getElementById("readerProgress");
const pauseOverlay = document.getElementById("pauseOverlay");

const feedbackForm = document.getElementById("feedbackForm");
const feedbackStatus = document.getElementById("feedbackStatus");
const customFeelingWrap = document.getElementById("customFeelingWrap");
const speedFeelingCustomInput = document.getElementById("speedFeelingCustomInput");

const nicknameInput = document.getElementById("nicknameInput");
const emailInput = document.getElementById("emailInput");
const feedbackInput = document.getElementById("feedbackInput");
const themeToggle = document.getElementById("themeToggle");
const newSessionBtn = document.getElementById("newSessionBtn");

const thanksRecordId = document.getElementById("thanksRecordId");
const thanksNickname = document.getElementById("thanksNickname");
const thanksEmail = document.getElementById("thanksEmail");
const thanksSpeed = document.getElementById("thanksSpeed");
const thanksFeeling = document.getElementById("thanksFeeling");

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.style.color = isError ? "#c2463d" : "";
}

function sanitizeSpeedWpm() {
  const value = Number.parseInt(speedInput.value, 10);
  if (Number.isNaN(value)) {
    return 100;
  }
  return Math.min(1000, Math.max(1, value));
}

function clearPlaybackTimers() {
  if (state.playbackTimer) {
    clearTimeout(state.playbackTimer);
    state.playbackTimer = null;
  }
  if (state.breakTimer) {
    clearInterval(state.breakTimer);
    state.breakTimer = null;
  }
}

function wordIntervalMs() {
  return Math.max(60, Math.round(60000 / state.speedWpm));
}

async function loadPdf() {
  const file = pdfInput.files?.[0];
  if (!file) {
    setStatus(setupStatus, "Please select a PDF file.", true);
    return;
  }

  state.speedWpm = sanitizeSpeedWpm();
  speedInput.value = String(state.speedWpm);

  const formData = new FormData();
  formData.append("file", file);

  loadPdfBtn.disabled = true;
  startBtn.disabled = true;
  setStatus(setupStatus, "Loading and parsing PDF...");

  try {
    const response = await fetch("/api/upload-pdf", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();

    if (!response.ok) {
      setStatus(setupStatus, payload.error || "Failed to load PDF.", true);
      return;
    }

    state.fileName = payload.fileName;
    state.rawText = payload.text;
    state.words = payload.text.split(/\s+/).filter(Boolean);
    const extractedWords = Number(payload.wordCount) || state.words.length;

    if (!state.words.length) {
      setStatus(setupStatus, "No readable words found in this PDF.", true);
      return;
    }

    setStatus(setupStatus, `Loaded ${payload.fileName}. ${extractedWords} words extracted.`);
    startBtn.disabled = false;
  } catch (error) {
    setStatus(setupStatus, "Network error while loading PDF.", true);
  } finally {
    loadPdfBtn.disabled = false;
  }
}

function showSection(section) {
  [setupSection, countdownSection, readerSection, feedbackSection, thankYouSection].forEach((node) => {
    node.classList.add("hidden");
  });
  section.classList.remove("hidden");
}

function startCountdown() {
  if (!state.words.length) {
    setStatus(setupStatus, "Load a PDF first.", true);
    return;
  }

  state.speedWpm = sanitizeSpeedWpm();
  speedInput.value = String(state.speedWpm);

  showSection(countdownSection);
  let value = 3;
  countdownNumber.textContent = String(value);

  const timer = setInterval(() => {
    value -= 1;
    if (value <= 0) {
      clearInterval(timer);
      startReading();
      return;
    }
    countdownNumber.textContent = String(value);
  }, 1000);
}

function updateProgress() {
  const total = state.words.length;
  const pct = total === 0 ? 0 : Math.round((state.currentWordIndex / total) * 100);
  readerProgress.textContent = `${pct}%`;
}

function startBreak() {
  clearPlaybackTimers();

  let remaining = 3;
  pauseOverlay.textContent = `Break: ${remaining}`;
  pauseOverlay.classList.remove("hidden");

  state.breakTimer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(state.breakTimer);
      state.breakTimer = null;
      pauseOverlay.classList.add("hidden");
      scheduleNextWord();
      return;
    }
    pauseOverlay.textContent = `Break: ${remaining}`;
  }, 1000);
}

function scheduleNextWord() {
  if (state.currentWordIndex >= state.words.length) {
    finishReading();
    return;
  }

  const interval = wordIntervalMs();
  state.playbackTimer = setTimeout(() => {
    focusText.textContent = state.words[state.currentWordIndex];
    state.currentWordIndex += 1;
    state.activePlaybackMs += interval;
    updateProgress();

    if (state.activePlaybackMs >= state.nextBreakMs && state.currentWordIndex < state.words.length) {
      state.nextBreakMs += 60000;
      startBreak();
      return;
    }

    if (state.currentWordIndex >= state.words.length) {
      finishReading();
      return;
    }

    scheduleNextWord();
  }, interval);
}

function startReading() {
  clearPlaybackTimers();

  state.currentWordIndex = 0;
  state.activePlaybackMs = 0;
  state.nextBreakMs = 60000;

  showSection(readerSection);
  readerFileName.textContent = `${state.fileName} • ${state.speedWpm} WPM`;
  readerProgress.textContent = "0%";
  focusText.textContent = "Starting...";
  pauseOverlay.classList.add("hidden");

  scheduleNextWord();
}

function finishReading() {
  clearPlaybackTimers();
  showSection(feedbackSection);
  showStep(1);
}

function showStep(stepNumber) {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step) => {
    const isTarget = Number(step.dataset.step) === stepNumber;
    step.classList.toggle("hidden", !isTarget);
  });
}

function selectedSpeedFeeling() {
  const checked = document.querySelector('input[name="speedFeeling"]:checked');
  return checked ? checked.value : "";
}

function validateStep(stepNumber) {
  if (stepNumber === 1) {
    if (!nicknameInput.value.trim()) {
      setStatus(feedbackStatus, "Nickname is required.", true);
      return false;
    }
    if (!emailInput.value.trim() || !emailInput.value.includes("@")) {
      setStatus(feedbackStatus, "A valid email is required.", true);
      return false;
    }
  }

  if (stepNumber === 2) {
    const value = selectedSpeedFeeling();
    if (!value) {
      setStatus(feedbackStatus, "Select one speed feeling option.", true);
      return false;
    }
    if (value === "custom" && !speedFeelingCustomInput.value.trim()) {
      setStatus(feedbackStatus, "Custom speed feeling is required.", true);
      return false;
    }
  }

  setStatus(feedbackStatus, "");
  return true;
}

function fillThankYouTable(recordId) {
  const feelingValue = selectedSpeedFeeling();
  const feelingText =
    feelingValue === "custom" ? speedFeelingCustomInput.value.trim() || "custom" : feelingValue;

  thanksRecordId.textContent = recordId;
  thanksNickname.textContent = nicknameInput.value.trim();
  thanksEmail.textContent = emailInput.value.trim();
  thanksSpeed.textContent = String(state.speedWpm);
  thanksFeeling.textContent = feelingText;
}

async function submitFeedback(event) {
  event.preventDefault();

  if (!validateStep(3)) {
    return;
  }

  if (!feedbackInput.value.trim()) {
    setStatus(feedbackStatus, "General feedback is required.", true);
    return;
  }

  const payload = {
    nickname: nicknameInput.value.trim(),
    email: emailInput.value.trim(),
    speedWpm: state.speedWpm,
    speedFeeling: selectedSpeedFeeling(),
    speedFeelingCustom: speedFeelingCustomInput.value.trim(),
    feedback: feedbackInput.value.trim(),
    sourceFile: state.fileName,
    wordCount: state.words.length,
  };

  setStatus(feedbackStatus, "Saving feedback...");

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();

    if (!response.ok) {
      setStatus(feedbackStatus, body.error || "Failed to save feedback.", true);
      return;
    }

    fillThankYouTable(body.recordId);
    feedbackForm.reset();
    customFeelingWrap.classList.add("hidden");
    showSection(thankYouSection);
  } catch (error) {
    setStatus(feedbackStatus, "Network error while saving feedback.", true);
  }
}

function bindStepNavigation() {
  document.querySelectorAll(".next-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const currentStep = Number(button.closest(".step").dataset.step);
      const nextStep = Number(button.dataset.next);
      if (validateStep(currentStep)) {
        showStep(nextStep);
      }
    });
  });

  document.querySelectorAll(".back-btn").forEach((button) => {
    button.addEventListener("click", () => {
      showStep(Number(button.dataset.back));
    });
  });
}

function bindSpeedFeelingToggle() {
  document.querySelectorAll('input[name="speedFeeling"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const isCustom = selectedSpeedFeeling() === "custom";
      customFeelingWrap.classList.toggle("hidden", !isCustom);
      if (!isCustom) {
        speedFeelingCustomInput.value = "";
      }
    });
  });
}

function initTheme() {
  const saved = window.localStorage.getItem("fast-read-theme");
  const initial = saved === "dark" ? "dark" : "light";
  document.body.dataset.theme = initial;
  themeToggle.textContent = initial === "dark" ? "Light Theme" : "Dark Theme";

  themeToggle.addEventListener("click", () => {
    const current = document.body.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    window.localStorage.setItem("fast-read-theme", next);
    themeToggle.textContent = next === "dark" ? "Light Theme" : "Dark Theme";
  });
}

function startNewSession() {
  showSection(setupSection);
  setStatus(setupStatus, "");
  setStatus(feedbackStatus, "");
  startBtn.disabled = state.words.length === 0;
}

loadPdfBtn.addEventListener("click", loadPdf);
startBtn.addEventListener("click", startCountdown);
feedbackForm.addEventListener("submit", submitFeedback);
newSessionBtn.addEventListener("click", startNewSession);

bindStepNavigation();
bindSpeedFeelingToggle();
initTheme();
showSection(setupSection);
