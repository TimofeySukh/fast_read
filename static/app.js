const state = {
  fileName: "",
  rawText: "",
  words: [],
  currentWordIndex: 0,
  speedWpm: 100,
  playbackTimer: null,
  isPaused: false,
};

const setupSection = document.getElementById("setupSection");
const countdownSection = document.getElementById("countdownSection");
const readerSection = document.getElementById("readerSection");
const feedbackSection = document.getElementById("feedbackSection");
const thankYouSection = document.getElementById("thankYouSection");

const pdfInput = document.getElementById("pdfInput");
const speedInput = document.getElementById("speedInput");
const readerSpeedInput = document.getElementById("readerSpeedInput");
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

function clampWpm(value) {
  if (Number.isNaN(value)) {
    return 100;
  }
  return Math.min(1000, Math.max(1, value));
}

function applySpeedWpm(nextSpeed) {
  state.speedWpm = clampWpm(nextSpeed);
  speedInput.value = String(state.speedWpm);
  readerSpeedInput.value = String(state.speedWpm);
  if (!readerSection.classList.contains("hidden")) {
    readerFileName.textContent = `${state.fileName} • ${state.speedWpm} WPM`;
  }
}

function clearPlaybackTimer() {
  if (state.playbackTimer) {
    clearTimeout(state.playbackTimer);
    state.playbackTimer = null;
  }
}

function wordIntervalMs() {
  return Math.max(60, Math.round(60000 / state.speedWpm));
}

function splitTextIntoWords(text) {
  try {
    const tokens = text.match(/[\p{L}\p{N}]+(?:['’`-][\p{L}\p{N}]+)*/gu);
    return tokens || [];
  } catch {
    return text.split(/[^A-Za-z0-9]+/).filter(Boolean);
  }
}

function showSection(section) {
  [setupSection, countdownSection, readerSection, feedbackSection, thankYouSection].forEach((node) => {
    node.classList.add("hidden");
  });
  section.classList.remove("hidden");
}

async function requestReadingPayload() {
  const selectedFile = pdfInput.files?.[0];
  if (selectedFile) {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/upload-pdf", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Failed to parse selected PDF.");
    }
    payload.isDefaultFile = false;
    return payload;
  }

  const response = await fetch("/api/default-pdf", { method: "POST" });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Failed to load default PDF.");
  }
  payload.isDefaultFile = true;
  return payload;
}

function applyLoadedPayload(payload) {
  state.fileName = payload.fileName;
  state.rawText = payload.text;
  state.words = splitTextIntoWords(payload.text);
}

async function prepareTextForReading() {
  const selectedFile = pdfInput.files?.[0];
  const initialLabel = startBtn.textContent;
  startBtn.disabled = true;
  startBtn.textContent = "Checking PDF...";

  if (selectedFile) {
    setStatus(setupStatus, "Checking selected PDF...");
  } else {
    setStatus(setupStatus, "No file selected. Loading default PDF...");
  }

  try {
    const payload = await requestReadingPayload();
    applyLoadedPayload(payload);

    if (!state.words.length) {
      setStatus(setupStatus, "No readable words found in this PDF.", true);
      return false;
    }

    if (payload.isDefaultFile) {
      setStatus(setupStatus, `Using default PDF: ${payload.fileName}. ${state.words.length} words extracted.`);
    } else {
      setStatus(setupStatus, `Loaded ${payload.fileName}. ${state.words.length} words extracted.`);
    }

    return true;
  } catch (error) {
    setStatus(setupStatus, error.message || "Failed to prepare reading text.", true);
    return false;
  } finally {
    startBtn.disabled = false;
    startBtn.textContent = initialLabel;
  }
}

function startCountdown() {
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

function scheduleNextWord() {
  if (state.isPaused) {
    return;
  }

  if (state.currentWordIndex >= state.words.length) {
    finishReading();
    return;
  }

  const interval = wordIntervalMs();
  state.playbackTimer = setTimeout(() => {
    if (state.isPaused) {
      return;
    }

    focusText.textContent = state.words[state.currentWordIndex];
    state.currentWordIndex += 1;
    updateProgress();

    if (state.currentWordIndex >= state.words.length) {
      finishReading();
      return;
    }

    scheduleNextWord();
  }, interval);
}

function pauseReading() {
  if (state.isPaused) {
    return;
  }
  state.isPaused = true;
  clearPlaybackTimer();
  pauseOverlay.textContent = "Paused";
  pauseOverlay.classList.remove("hidden");
}

function resumeReading() {
  if (!state.isPaused) {
    return;
  }
  state.isPaused = false;
  pauseOverlay.classList.add("hidden");
  scheduleNextWord();
}

function togglePauseResume() {
  if (state.currentWordIndex >= state.words.length) {
    return;
  }

  if (state.isPaused) {
    resumeReading();
  } else {
    pauseReading();
  }
}

function startReading() {
  clearPlaybackTimer();

  state.currentWordIndex = 0;
  state.isPaused = false;

  showSection(readerSection);
  readerFileName.textContent = `${state.fileName} • ${state.speedWpm} WPM`;
  readerProgress.textContent = "0%";
  focusText.textContent = "Starting...";
  pauseOverlay.classList.add("hidden");

  scheduleNextWord();
}

async function handleStartReadingClick() {
  applySpeedWpm(Number.parseInt(speedInput.value, 10));
  const ok = await prepareTextForReading();
  if (!ok) {
    return;
  }
  startCountdown();
}

function finishReading() {
  clearPlaybackTimer();
  state.isPaused = false;
  pauseOverlay.classList.add("hidden");
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
  } catch {
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

function bindSpacePauseShortcut() {
  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") {
      return;
    }

    if (readerSection.classList.contains("hidden")) {
      return;
    }

    const tagName = document.activeElement?.tagName;
    if (tagName === "INPUT" || tagName === "TEXTAREA") {
      return;
    }

    event.preventDefault();
    togglePauseResume();
  });
}

function bindSpeedInputs() {
  [speedInput, readerSpeedInput].forEach((input) => {
    input.addEventListener("change", () => {
      const parsed = Number.parseInt(input.value, 10);
      applySpeedWpm(parsed);
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
  clearPlaybackTimer();
  state.isPaused = false;
  pauseOverlay.classList.add("hidden");
  showSection(setupSection);
  setStatus(setupStatus, "");
  setStatus(feedbackStatus, "");
}

startBtn.addEventListener("click", handleStartReadingClick);
feedbackForm.addEventListener("submit", submitFeedback);
newSessionBtn.addEventListener("click", startNewSession);

bindStepNavigation();
bindSpeedFeelingToggle();
bindSpacePauseShortcut();
bindSpeedInputs();
initTheme();
applySpeedWpm(100);
showSection(setupSection);
