const state = {
  protocol: null,
  sessionId: "",
  participantName: "",
  selectedWpm: 100,
  currentSegmentIndex: 0,
  segmentResults: [],
  currentSegment: null,
  currentSegmentStartPerf: 0,
  currentSegmentStartedAtUtc: "",
  wordsCache: new Map(),
  activeWords: [],
  activeWordIndex: 0,
  isWordsPaused: false,
  wordTimer: null,
  calibrationWords: [],
  calibrationWordIndex: 0,
  calibrationRampTimer: null,
  busy: false,
  familiarityChecklist: {},
};

const screens = {
  welcome: document.getElementById("welcomeScreen"),
  calibration: document.getElementById("calibrationScreen"),
  transition: document.getElementById("transitionScreen"),
  words: document.getElementById("wordsScreen"),
  pdf: document.getElementById("pdfScreen"),
  checklist: document.getElementById("checklistScreen"),
  feedback: document.getElementById("feedbackScreen"),
  thankYou: document.getElementById("thankYouScreen"),
};

const globalStatus = document.getElementById("globalStatus");

const participantNameInput = document.getElementById("participantNameInput");
const startSessionBtn = document.getElementById("startSessionBtn");

const calibrationWpmValue = document.getElementById("calibrationWpmValue");
const calibrationWord = document.getElementById("calibrationWord");
const calibrationStopBtn = document.getElementById("calibrationStopBtn");

const transitionTitle = document.getElementById("transitionTitle");
const transitionProgress = document.getElementById("transitionProgress");
const transitionNextFormat = document.getElementById("transitionNextFormat");
const transitionContinueBtn = document.getElementById("transitionContinueBtn");

const wordsSegmentLabel = document.getElementById("wordsSegmentLabel");
const wordsSegmentFormat = document.getElementById("wordsSegmentFormat");
const wordsSegmentWpm = document.getElementById("wordsSegmentWpm");
const wordsCurrentWord = document.getElementById("wordsCurrentWord");
const wordsPauseBtn = document.getElementById("wordsPauseBtn");
const wordsFinishBtn = document.getElementById("wordsFinishBtn");

const pdfSegmentLabel = document.getElementById("pdfSegmentLabel");
const pdfSegmentFormat = document.getElementById("pdfSegmentFormat");
const pdfViewerFrame = document.getElementById("pdfViewerFrame");
const pdfFinishBtn = document.getElementById("pdfFinishBtn");

const checklistForm = document.getElementById("checklistForm");
const checklistContinueBtn = document.getElementById("checklistContinueBtn");

const feedbackInput = document.getElementById("feedbackInput");
const submitFeedbackBtn = document.getElementById("submitFeedbackBtn");

const summarySessionId = document.getElementById("summarySessionId");
const summaryParticipantName = document.getElementById("summaryParticipantName");
const summarySelectedWpm = document.getElementById("summarySelectedWpm");
const summarySegmentCount = document.getElementById("summarySegmentCount");
const summaryTotalTime = document.getElementById("summaryTotalTime");
const restartBtn = document.getElementById("restartBtn");

function setGlobalStatus(message, isError = false) {
  globalStatus.textContent = message;
  globalStatus.classList.toggle("is-error", isError);
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, node]) => {
    node.classList.toggle("hidden", key !== name);
  });
}

function isVisible(node) {
  return !node.classList.contains("hidden");
}

function isTextInputFocused() {
  const active = document.activeElement;
  if (!active) {
    return false;
  }
  const tag = active.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

function isLikelyMobile() {
  const ua = navigator.userAgent || "";
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
}

function readingIntervalMs(wpm) {
  const safe = Math.max(1, Number(wpm) || 1);
  return Math.max(50, Math.round(60000 / safe));
}

function clearWordTimer() {
  if (state.wordTimer) {
    window.clearTimeout(state.wordTimer);
    state.wordTimer = null;
  }
}

function clearCalibrationRampTimer() {
  if (state.calibrationRampTimer) {
    window.clearInterval(state.calibrationRampTimer);
    state.calibrationRampTimer = null;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}

function renderChecklist() {
  checklistForm.innerHTML = "";
  for (const item of state.protocol.familiarityItems) {
    const label = document.createElement("label");
    label.className = "checklist-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `check-${item.id}`;
    checkbox.dataset.checkId = item.id;

    const text = document.createElement("span");
    text.textContent = item.label;

    label.append(checkbox, text);
    checklistForm.appendChild(label);
  }
}

function segmentFormatLabel(format) {
  return format === "pdf" ? "PDF" : "one word at a time";
}

function findTextById(textId) {
  return state.protocol.texts.find((item) => item.id === textId);
}

function currentSegmentPlan() {
  return state.protocol.segmentPlan[state.currentSegmentIndex] || null;
}

function startWordPlaybackLoop() {
  clearWordTimer();

  if (state.isWordsPaused) {
    return;
  }

  if (state.activeWordIndex >= state.activeWords.length) {
    wordsPauseBtn.disabled = true;
    return;
  }

  const nextWord = state.activeWords[state.activeWordIndex];
  wordsCurrentWord.textContent = nextWord;
  state.activeWordIndex += 1;

  state.wordTimer = window.setTimeout(startWordPlaybackLoop, readingIntervalMs(state.selectedWpm));
}

function toggleWordsPause() {
  if (!isVisible(screens.words) || !state.currentSegment || state.currentSegment.format !== "words") {
    return;
  }

  if (state.activeWordIndex >= state.activeWords.length) {
    return;
  }

  state.isWordsPaused = !state.isWordsPaused;
  wordsPauseBtn.textContent = state.isWordsPaused ? "Resume" : "Pause";

  if (state.isWordsPaused) {
    clearWordTimer();
  } else {
    startWordPlaybackLoop();
  }
}

async function getWordsForText(textId) {
  if (state.wordsCache.has(textId)) {
    return state.wordsCache.get(textId);
  }

  const payload = await fetchJson(`/api/text/${textId}/words`);
  state.wordsCache.set(textId, payload.words);
  return payload.words;
}

function setSegmentStart(segment) {
  state.currentSegment = segment;
  state.currentSegmentStartPerf = performance.now();
  state.currentSegmentStartedAtUtc = new Date().toISOString();
}

function pushFinishedSegment() {
  const finishedAtUtc = new Date().toISOString();
  const durationSeconds = Number(((performance.now() - state.currentSegmentStartPerf) / 1000).toFixed(2));

  const record = {
    segmentId: state.currentSegment.segmentId,
    textIndex: state.currentSegment.textIndex,
    textTitle: state.currentSegment.textTitle,
    format: state.currentSegment.format,
    orderInText: state.currentSegment.orderInText,
    startedAtUtc: state.currentSegmentStartedAtUtc,
    finishedAtUtc,
    durationSeconds,
    completionAction: "i_finished_button",
    selectedWpmAtRun: state.currentSegment.format === "words" ? state.selectedWpm : state.selectedWpm,
  };

  state.segmentResults.push(record);
}

function presentTransition(previousSegment, nextSegment) {
  if (!nextSegment) {
    showScreen("checklist");
    return;
  }

  if (!previousSegment) {
    transitionTitle.textContent = "Calibration completed";
    transitionProgress.textContent = "Get ready for Text 1 of 6.";
  } else if (previousSegment.textIndex === nextSegment.textIndex) {
    transitionTitle.textContent = `Text ${nextSegment.textIndex} of 6`;
    transitionProgress.textContent = `Part ${previousSegment.orderInText} completed. Continue to part ${nextSegment.orderInText}.`;
  } else {
    transitionTitle.textContent = `Text ${previousSegment.textIndex} of 6 completed`;
    transitionProgress.textContent = `Get ready for Text ${nextSegment.textIndex} of 6.`;
  }

  transitionNextFormat.textContent = `Format of the next segment: ${segmentFormatLabel(nextSegment.format)}.`;
  showScreen("transition");
}

async function startWordsSegment(segment) {
  const words = await getWordsForText(segment.textId);

  state.activeWords = words;
  state.activeWordIndex = 0;
  state.isWordsPaused = false;
  wordsPauseBtn.disabled = false;
  wordsPauseBtn.textContent = "Pause";

  wordsSegmentLabel.textContent = `Text ${segment.textIndex} of 6 • ${segment.textTitle}`;
  wordsSegmentFormat.textContent = "One-word mode";
  wordsSegmentWpm.textContent = `${state.selectedWpm} WPM`;
  wordsCurrentWord.textContent = "Ready";

  showScreen("words");
  startWordPlaybackLoop();
}

function startPdfSegment(segment) {
  const textInfo = findTextById(segment.textId);
  pdfSegmentLabel.textContent = `Text ${segment.textIndex} of 6 • ${segment.textTitle}`;
  pdfSegmentFormat.textContent = "PDF mode";
  pdfViewerFrame.src = `${textInfo.pdfUrl}#view=FitH`;
  showScreen("pdf");
}

async function startCurrentSegment() {
  const segment = currentSegmentPlan();
  if (!segment) {
    showScreen("checklist");
    return;
  }

  setSegmentStart(segment);

  try {
    if (segment.format === "words") {
      await startWordsSegment(segment);
    } else {
      startPdfSegment(segment);
    }
  } catch (error) {
    setGlobalStatus(error.message || "Failed to start segment.", true);
    showScreen("transition");
  }
}

function finishCurrentSegment() {
  if (!state.currentSegment) {
    return;
  }

  clearWordTimer();
  pushFinishedSegment();

  const previousSegment = state.currentSegment;
  state.currentSegment = null;
  state.currentSegmentIndex += 1;

  const nextSegment = currentSegmentPlan();
  presentTransition(previousSegment, nextSegment);
}

function collectChecklistAnswers() {
  const payload = {};
  for (const item of state.protocol.familiarityItems) {
    const checkbox = document.getElementById(`check-${item.id}`);
    payload[item.id] = Boolean(checkbox?.checked);
  }
  state.familiarityChecklist = payload;
}

async function submitFeedback() {
  if (state.busy) {
    return;
  }

  const feedback = feedbackInput.value.trim();
  if (!feedback) {
    setGlobalStatus("Feedback is required.", true);
    return;
  }

  state.busy = true;
  submitFeedbackBtn.disabled = true;
  setGlobalStatus("Saving session...");

  const payload = {
    sessionId: state.sessionId,
    segments: state.segmentResults,
    familiarityChecklist: state.familiarityChecklist,
    feedback: {
      text: feedback,
    },
    device: {
      platformType: isLikelyMobile() ? "mobile" : "desktop",
      userAgent: navigator.userAgent,
    },
  };

  try {
    await fetchJson("/api/session/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const totalSeconds = state.segmentResults.reduce((acc, item) => acc + Number(item.durationSeconds || 0), 0);
    summarySessionId.textContent = state.sessionId;
    summaryParticipantName.textContent = state.participantName;
    summarySelectedWpm.textContent = String(state.selectedWpm);
    summarySegmentCount.textContent = `${state.segmentResults.length} / ${state.protocol.segmentPlan.length}`;
    summaryTotalTime.textContent = `${totalSeconds.toFixed(2)} sec`;

    setGlobalStatus("Session saved.");
    showScreen("thankYou");
  } catch (error) {
    setGlobalStatus(error.message || "Failed to save session.", true);
  } finally {
    state.busy = false;
    submitFeedbackBtn.disabled = false;
  }
}

function startCalibrationLoop() {
  clearWordTimer();
  clearCalibrationRampTimer();

  state.calibrationWordIndex = 0;
  state.selectedWpm = state.protocol.calibration.baseWpm;
  calibrationWpmValue.textContent = String(state.selectedWpm);

  const stepMs = state.protocol.calibration.stepSeconds * 1000;
  state.calibrationRampTimer = window.setInterval(() => {
    state.selectedWpm += state.protocol.calibration.wpmStep;
    calibrationWpmValue.textContent = String(state.selectedWpm);
  }, stepMs);

  const tick = () => {
    if (!state.calibrationWords.length) {
      calibrationWord.textContent = "No words";
      return;
    }

    calibrationWord.textContent = state.calibrationWords[state.calibrationWordIndex];
    state.calibrationWordIndex = (state.calibrationWordIndex + 1) % state.calibrationWords.length;
    state.wordTimer = window.setTimeout(tick, readingIntervalMs(state.selectedWpm));
  };

  tick();
}

async function stopCalibration(stopMethod) {
  if (!state.sessionId || state.busy || !isVisible(screens.calibration)) {
    return;
  }

  state.busy = true;
  calibrationStopBtn.disabled = true;
  clearWordTimer();
  clearCalibrationRampTimer();

  try {
    await fetchJson("/api/session/calibration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: state.sessionId,
        selectedWpm: state.selectedWpm,
        stopMethod,
      }),
    });

    setGlobalStatus("Calibration saved.");
    presentTransition(null, currentSegmentPlan());
  } catch (error) {
    setGlobalStatus(error.message || "Failed to save calibration.", true);
    showScreen("welcome");
  } finally {
    state.busy = false;
    calibrationStopBtn.disabled = false;
  }
}

async function startSession() {
  if (state.busy) {
    return;
  }

  const participantName = participantNameInput.value.trim();
  if (!participantName) {
    return;
  }

  state.busy = true;
  startSessionBtn.disabled = true;
  setGlobalStatus("Starting session...");

  try {
    const startPayload = await fetchJson("/api/session/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantName,
        userAgent: navigator.userAgent,
      }),
    });

    const calibrationPayload = await fetchJson("/api/calibration/words");

    state.sessionId = startPayload.sessionId;
    state.participantName = participantName;
    state.currentSegmentIndex = 0;
    state.segmentResults = [];
    state.wordsCache = new Map();
    state.familiarityChecklist = {};
    state.calibrationWords = calibrationPayload.words;

    showScreen("calibration");
    setGlobalStatus("Calibration started.");
    startCalibrationLoop();
  } catch (error) {
    setGlobalStatus(error.message || "Failed to start session.", true);
    showScreen("welcome");
  } finally {
    state.busy = false;
    startSessionBtn.disabled = participantNameInput.value.trim().length === 0;
  }
}

function bindEvents() {
  participantNameInput.addEventListener("input", () => {
    startSessionBtn.disabled = participantNameInput.value.trim().length === 0 || state.busy;
  });

  startSessionBtn.addEventListener("click", () => {
    startSession();
  });

  calibrationStopBtn.addEventListener("click", () => {
    stopCalibration("stop_button");
  });

  transitionContinueBtn.addEventListener("click", () => {
    startCurrentSegment();
  });

  wordsPauseBtn.addEventListener("click", () => {
    toggleWordsPause();
  });

  wordsFinishBtn.addEventListener("click", () => {
    finishCurrentSegment();
  });

  pdfFinishBtn.addEventListener("click", () => {
    finishCurrentSegment();
  });

  checklistContinueBtn.addEventListener("click", () => {
    collectChecklistAnswers();
    showScreen("feedback");
    setGlobalStatus("");
  });

  submitFeedbackBtn.addEventListener("click", () => {
    submitFeedback();
  });

  restartBtn.addEventListener("click", () => {
    window.location.reload();
  });

  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") {
      return;
    }
    if (isTextInputFocused()) {
      return;
    }

    if (isVisible(screens.calibration)) {
      event.preventDefault();
      stopCalibration("space");
      return;
    }

    if (isVisible(screens.transition)) {
      event.preventDefault();
      startCurrentSegment();
      return;
    }

    if (isVisible(screens.words)) {
      event.preventDefault();
      toggleWordsPause();
    }
  });
}

async function init() {
  showScreen("welcome");
  startSessionBtn.disabled = true;

  try {
    state.protocol = await fetchJson("/api/protocol");
    renderChecklist();
    setGlobalStatus("Protocol loaded.");
  } catch (error) {
    setGlobalStatus(error.message || "Failed to load protocol.", true);
    startSessionBtn.disabled = true;
  }

  bindEvents();
}

init();
