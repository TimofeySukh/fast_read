const CALIBRATION_MIN_WPM = 50;
const CALIBRATION_MAX_WPM = 700;

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
const calibrationContinueBtn = document.getElementById("calibrationContinueBtn");
const calibrationSpeedInput = document.getElementById("calibrationSpeedInput");
const calibrationMinus100Btn = document.getElementById("calibrationMinus100Btn");
const calibrationMinus50Btn = document.getElementById("calibrationMinus50Btn");
const calibrationMinus20Btn = document.getElementById("calibrationMinus20Btn");
const calibrationMinus10Btn = document.getElementById("calibrationMinus10Btn");
const calibrationMinus5Btn = document.getElementById("calibrationMinus5Btn");
const calibrationPlus5Btn = document.getElementById("calibrationPlus5Btn");
const calibrationPlus10Btn = document.getElementById("calibrationPlus10Btn");
const calibrationPlus20Btn = document.getElementById("calibrationPlus20Btn");
const calibrationPlus50Btn = document.getElementById("calibrationPlus50Btn");
const calibrationPlus100Btn = document.getElementById("calibrationPlus100Btn");

const transitionTitle = document.getElementById("transitionTitle");
const transitionProgress = document.getElementById("transitionProgress");
const transitionNextFormat = document.getElementById("transitionNextFormat");
const transitionContinueBtn = document.getElementById("transitionContinueBtn");

const wordsSegmentLabel = document.getElementById("wordsSegmentLabel");
const wordsSegmentFormat = document.getElementById("wordsSegmentFormat");
const wordsSegmentWpm = document.getElementById("wordsSegmentWpm");
const wordsCurrentWord = document.getElementById("wordsCurrentWord");
const wordsPauseBtn = document.getElementById("wordsPauseBtn");

const pdfSegmentLabel = document.getElementById("pdfSegmentLabel");
const pdfSegmentFormat = document.getElementById("pdfSegmentFormat");
const pdfViewerFrame = document.getElementById("pdfViewerFrame");
const pdfFinishBtn = document.getElementById("pdfFinishBtn");

const checklistForm = document.getElementById("checklistForm");
const checklistContinueBtn = document.getElementById("checklistContinueBtn");

const feedbackInput = document.getElementById("feedbackInput");
const submitFeedbackBtn = document.getElementById("submitFeedbackBtn");

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

function clampCalibrationWpm(value) {
  const raw = Number.parseInt(String(value), 10);
  if (Number.isNaN(raw)) {
    return state.selectedWpm || 100;
  }
  return Math.min(CALIBRATION_MAX_WPM, Math.max(CALIBRATION_MIN_WPM, raw));
}

function applyCalibrationWpm(value) {
  state.selectedWpm = clampCalibrationWpm(value);
  calibrationWpmValue.textContent = String(state.selectedWpm);
  calibrationSpeedInput.value = String(state.selectedWpm);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Ошибка запроса");
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

    const text = document.createElement("span");
    text.textContent = item.label;

    label.append(checkbox, text);
    checklistForm.appendChild(label);
  }
}

function findTextById(textId) {
  return state.protocol.texts.find((item) => item.id === textId);
}

function currentSegmentPlan() {
  return state.protocol.segmentPlan[state.currentSegmentIndex] || null;
}

function startCalibrationPlaybackLoop() {
  clearWordTimer();

  if (!isVisible(screens.calibration)) {
    return;
  }

  if (!state.calibrationWords.length) {
    calibrationWord.textContent = "Нет слов для калибровки";
    return;
  }

  calibrationWord.textContent = state.calibrationWords[state.calibrationWordIndex];
  state.calibrationWordIndex = (state.calibrationWordIndex + 1) % state.calibrationWords.length;

  state.wordTimer = window.setTimeout(startCalibrationPlaybackLoop, readingIntervalMs(state.selectedWpm));
}

function startWordPlaybackLoop() {
  clearWordTimer();

  if (state.isWordsPaused) {
    return;
  }

  if (state.activeWordIndex >= state.activeWords.length) {
    wordsPauseBtn.disabled = true;
    finishCurrentSegment();
    return;
  }

  wordsCurrentWord.textContent = state.activeWords[state.activeWordIndex];
  state.activeWordIndex += 1;

  const intervalMs = readingIntervalMs(state.selectedWpm);
  if (state.activeWordIndex >= state.activeWords.length) {
    state.wordTimer = window.setTimeout(() => {
      if (!state.isWordsPaused) {
        finishCurrentSegment();
      }
    }, intervalMs);
    return;
  }

  state.wordTimer = window.setTimeout(startWordPlaybackLoop, intervalMs);
}

function toggleWordsPause() {
  if (!isVisible(screens.words) || !state.currentSegment || state.currentSegment.format !== "words") {
    return;
  }

  if (state.activeWordIndex >= state.activeWords.length) {
    return;
  }

  state.isWordsPaused = !state.isWordsPaused;
  wordsPauseBtn.textContent = state.isWordsPaused ? "Продолжить" : "Пауза";

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

  state.segmentResults.push({
    segmentId: state.currentSegment.segmentId,
    textIndex: state.currentSegment.textIndex,
    textTitle: state.currentSegment.textTitle,
    format: state.currentSegment.format,
    orderInText: state.currentSegment.orderInText,
    startedAtUtc: state.currentSegmentStartedAtUtc,
    finishedAtUtc,
    durationSeconds,
    completionAction: state.currentSegment.format === "words" ? "auto_end_of_text" : "i_finished_button",
    selectedWpmAtRun: state.selectedWpm,
  });
}

function buildNextFormatText(previousSegment, nextSegment) {
  if (nextSegment.format === "pdf") {
    if (nextSegment.textIndex === 5 && (!previousSegment || previousSegment.textIndex < 5)) {
      return "Теперь давайте отойдем от художественной литературы.";
    }
    return "Теперь будет текст в привычном вам страничном формате.";
  }

  return "Теперь текст будет показываться по одному слову.";
}

function presentTransition(previousSegment, nextSegment) {
  if (!nextSegment) {
    showScreen("checklist");
    return;
  }

  if (!previousSegment) {
    transitionTitle.textContent = "Калибровка завершена";
    transitionProgress.textContent = "Приготовьтесь к первому исследованию.";
  } else if (previousSegment.textIndex === nextSegment.textIndex) {
    transitionTitle.textContent = `Исследование ${nextSegment.textIndex} из 6`;
    transitionProgress.textContent = `Часть ${previousSegment.orderInText} завершена. Переходим к части ${nextSegment.orderInText}.`;
  } else {
    transitionTitle.textContent = `Исследование ${previousSegment.textIndex} из 6 завершено`;
    transitionProgress.textContent = `Приготовьтесь к исследованию ${nextSegment.textIndex} из 6.`;
  }

  transitionNextFormat.textContent = buildNextFormatText(previousSegment, nextSegment);
  transitionContinueBtn.disabled = false;
  showScreen("transition");
}

async function startWordsSegment(segment) {
  const words = await getWordsForText(segment.textId);

  state.activeWords = words;
  state.activeWordIndex = 0;
  state.isWordsPaused = false;
  wordsPauseBtn.disabled = false;
  wordsPauseBtn.textContent = "Пауза";

  wordsSegmentLabel.textContent = `Исследование ${segment.textIndex} из 6 • ${segment.textTitle}`;
  wordsSegmentFormat.textContent = "Режим по одному слову";
  wordsSegmentWpm.textContent = `${state.selectedWpm} слов/мин`;
  wordsCurrentWord.textContent = "Готово";

  showScreen("words");
  startWordPlaybackLoop();
}

function startPdfSegment(segment) {
  const textInfo = findTextById(segment.textId);
  pdfSegmentLabel.textContent = `Исследование ${segment.textIndex} из 6 • ${segment.textTitle}`;
  pdfSegmentFormat.textContent = "Режим PDF";
  pdfViewerFrame.src = `${textInfo.pdfUrl}#view=FitH`;
  showScreen("pdf");
}

async function startCurrentSegment() {
  if (state.currentSegment) {
    return;
  }

  const segment = currentSegmentPlan();
  if (!segment) {
    showScreen("checklist");
    return;
  }

  transitionContinueBtn.disabled = true;
  setSegmentStart(segment);

  try {
    if (segment.format === "words") {
      await startWordsSegment(segment);
    } else {
      startPdfSegment(segment);
    }
  } catch (error) {
    setGlobalStatus(error.message || "Не удалось запустить сегмент.", true);
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

  presentTransition(previousSegment, currentSegmentPlan());
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
    setGlobalStatus("Пожалуйста, заполните поле обратной связи.", true);
    return;
  }

  state.busy = true;
  submitFeedbackBtn.disabled = true;
  setGlobalStatus("Сохраняем результаты...");

  try {
    await fetchJson("/api/session/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: state.sessionId,
        segments: state.segmentResults,
        familiarityChecklist: state.familiarityChecklist,
        feedback: { text: feedback },
        device: {
          platformType: isLikelyMobile() ? "mobile" : "desktop",
          userAgent: navigator.userAgent,
        },
      }),
    });

    setGlobalStatus("");
    showScreen("thankYou");
  } catch (error) {
    setGlobalStatus(error.message || "Не удалось сохранить результаты.", true);
  } finally {
    state.busy = false;
    submitFeedbackBtn.disabled = false;
  }
}

async function completeCalibration() {
  if (!state.sessionId || state.busy || !isVisible(screens.calibration)) {
    return;
  }

  state.busy = true;
  calibrationContinueBtn.disabled = true;

  try {
    await fetchJson("/api/session/calibration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: state.sessionId,
        selectedWpm: state.selectedWpm,
        stopMethod: "manual_select",
      }),
    });

    setGlobalStatus("");
    clearWordTimer();
    presentTransition(null, currentSegmentPlan());
  } catch (error) {
    setGlobalStatus(error.message || "Не удалось сохранить калибровку.", true);
    showScreen("welcome");
  } finally {
    state.busy = false;
    calibrationContinueBtn.disabled = false;
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
  setGlobalStatus("Запускаем сессию...");

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
    state.calibrationWordIndex = 0;

    const startWpm = state.protocol?.calibration?.baseWpm ?? 100;
    applyCalibrationWpm(startWpm);

    showScreen("calibration");
    setGlobalStatus("");
    startCalibrationPlaybackLoop();
  } catch (error) {
    setGlobalStatus(error.message || "Не удалось начать сессию.", true);
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

  calibrationSpeedInput.addEventListener("input", () => {
    applyCalibrationWpm(calibrationSpeedInput.value);
  });

  calibrationMinus100Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm - 100));
  calibrationMinus50Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm - 50));
  calibrationMinus20Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm - 20));
  calibrationMinus10Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm - 10));
  calibrationMinus5Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm - 5));
  calibrationPlus5Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm + 5));
  calibrationPlus10Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm + 10));
  calibrationPlus20Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm + 20));
  calibrationPlus50Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm + 50));
  calibrationPlus100Btn.addEventListener("click", () => applyCalibrationWpm(state.selectedWpm + 100));

  startSessionBtn.addEventListener("click", startSession);
  calibrationContinueBtn.addEventListener("click", completeCalibration);
  transitionContinueBtn.addEventListener("click", startCurrentSegment);
  wordsPauseBtn.addEventListener("click", toggleWordsPause);
  pdfFinishBtn.addEventListener("click", finishCurrentSegment);

  checklistContinueBtn.addEventListener("click", () => {
    collectChecklistAnswers();
    showScreen("feedback");
    setGlobalStatus("");
  });

  submitFeedbackBtn.addEventListener("click", submitFeedback);

  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") {
      return;
    }
    if (isTextInputFocused()) {
      return;
    }

    if (isVisible(screens.calibration)) {
      event.preventDefault();
      completeCalibration();
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
    setGlobalStatus("");
  } catch (error) {
    setGlobalStatus(error.message || "Не удалось загрузить протокол.", true);
    startSessionBtn.disabled = true;
  }

  bindEvents();
}

init();
