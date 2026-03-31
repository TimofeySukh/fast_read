const CALIBRATION_MIN_WPM = 50;
const CALIBRATION_MAX_WPM = 700;
const DEFAULT_LANGUAGE = "ru";

const COPY = {
  en: {
    documentTitle: "Reading Research Protocol",
    heroEyebrow: "Reading Research",
    heroTitle: "Format Comparison Session",
    heroNote: "This study compares two reading formats across 4 texts.",
    languageTitle: "Choose language",
    languageNote: "Select the language for the interface and the reading materials.",
    welcomeTitle: "Welcome",
    welcomeBody:
      "Thank you for taking part in this study. You will read 4 texts, and each of them will appear in two formats: standard paged text and one word at a time. Please read attentively, and at the end leave your opinion about the one-word format.",
    participantNameLabel: "Please introduce yourself",
    start: "Start",
    calibrationTitle: "Calibration",
    calibrationNote:
      "You can change the speed with buttons or by typing it manually. Find a comfortable pace using the calibration text.",
    calibrationWpmUnit: "words/min",
    calibrationSpeedLabel: "Enter your speed (words/min)",
    calibrationHint: "When you find a comfortable speed, press Continue.",
    calibrationDoneTitle: "Calibration complete",
    calibrationReadyWord: "Ready",
    continue: "Continue",
    wordsMode: "One-word mode",
    pdfMode: "PDF mode",
    pause: "Pause",
    resume: "Resume",
    pdfFinish: "I finished",
    checklistTitle: "Before feedback",
    checklistPrompt: "Have you read any of these works before?",
    feedbackTitle: "What do you think about this reading format?",
    feedbackPrompt:
      "Was it more convenient or less convenient? Did this format make the text harder to understand, or did it perhaps help you absorb it better?",
    feedbackLabel: "Your comment",
    submit: "Submit",
    thankYouTitle: "Thank you for your time!",
    thankYouLead: "A short summary for this session:",
    transitionHint: "Press Space or the Continue button.",
    comprehensionTitle: "How well did you understand the text you just read?",
    comprehensionHint: "Choose a score from 1 to 5, then press Continue.",
    wordsHint: "Press Space (desktop) or the Pause / Resume button (phone).",
    prepareFirstText: "Get ready for the first text.",
    partTransition: (previousPart, nextPart) => `Part ${previousPart} is complete. Moving to part ${nextPart}.`,
    nextTextReady: (textIndex, total) => `Get ready for text ${textIndex} of ${total}.`,
    allTextsDone: "All texts are complete. Press Continue to move to the final questions.",
    nextPdfIntro: "The next segment will be shown in the familiar paged PDF format.",
    nextWordsIntro: "The next segment will be shown one word at a time.",
    specialBeforeText4: "Now let's move away from fiction for a while.",
    textHeading: (textIndex, total) => `Text ${textIndex} of ${total}`,
    textCompletedHeading: (textIndex, total) => `Text ${textIndex} of ${total} is complete`,
    segmentLabel: (textIndex, total, title, partIndex) => `Text ${textIndex} of ${total} • ${title}, part ${partIndex}`,
    wordsPerMinute: (wpm) => `${wpm} words/min`,
    loadingProtocol: "Loading study protocol...",
    startingSession: "Starting session...",
    savingResults: "Saving results...",
    missingComprehension: "Please rate your comprehension on a scale from 1 to 5.",
    missingFeedback: "Please fill in the feedback field.",
    failedProtocol: "Failed to load the study protocol.",
    failedStart: "Failed to start the session.",
    failedCalibration: "Failed to save calibration.",
    failedSegment: "Failed to start the segment.",
    failedSave: "Failed to save the results.",
    summaryParticipant: "Participant",
    summarySpeed: "Speed",
    summarySegments: "Segments",
    summaryComprehension: "Average comprehension",
    summaryReadingTime: "Reading time",
    minute: "min",
    second: "sec",
    dash: "—",
  },
  ru: {
    documentTitle: "Протокол исследования чтения",
    heroEyebrow: "Исследование чтения",
    heroTitle: "Сессия исследования форматов",
    heroNote: "Здесь сравниваются два формата чтения на 4 текстах.",
    languageTitle: "Выберите язык",
    languageNote: "Выберите язык интерфейса и текстов исследования.",
    welcomeTitle: "Добро пожаловать",
    welcomeBody:
      "Спасибо, что решили принять участие в моем исследовании. Здесь будут 4 текста, и каждый из них вы увидите в двух форматах: в формате обычного текста и в формате по одному слову. Постарайтесь внимательно вчитываться в материалы, а в самом конце исследования оставьте свое мнение о чтении по словам.",
    participantNameLabel: "Представьтесь пожалуйста",
    start: "Начать",
    calibrationTitle: "Калибровка",
    calibrationNote:
      "Скорость можно менять кнопками или вручную в поле. Подберите комфортный темп по калибровочному тексту.",
    calibrationWpmUnit: "слов/мин",
    calibrationSpeedLabel: "Введите свою скорость (слов/мин)",
    calibrationHint: "Когда выберете комфортную скорость, нажмите Продолжить.",
    calibrationDoneTitle: "Калибровка завершена",
    calibrationReadyWord: "Готово",
    continue: "Продолжить",
    wordsMode: "Режим по одному слову",
    pdfMode: "Режим PDF",
    pause: "Пауза",
    resume: "Продолжить",
    pdfFinish: "Я закончил",
    checklistTitle: "Перед обратной связью",
    checklistPrompt: "Вы читали какие-то из этих произведений раньше?",
    feedbackTitle: "Что вы думаете о формате чтения?",
    feedbackPrompt:
      "Было ли это удобнее или неудобнее? Были ли проблемы с пониманием текста в таком формате, или наоборот усваивалось лучше?",
    feedbackLabel: "Ваш комментарий",
    submit: "Отправить",
    thankYouTitle: "Спасибо за ваше время!",
    thankYouLead: "Короткий итог по этой сессии:",
    transitionHint: "Нажмите Пробел или кнопку Продолжить.",
    comprehensionTitle: "Насколько вы поняли только что прочитанный текст?",
    comprehensionHint: "Выберите оценку от 1 до 5, затем нажмите Продолжить.",
    wordsHint: "Нажмите Пробел (компьютер) или кнопку Пауза / Продолжить (телефон).",
    prepareFirstText: "Приготовьтесь к первому тексту.",
    partTransition: (previousPart, nextPart) => `Часть ${previousPart} завершена. Переходим к части ${nextPart}.`,
    nextTextReady: (textIndex, total) => `Приготовьтесь к тексту ${textIndex} из ${total}.`,
    allTextsDone: "Все тексты пройдены. Нажмите Продолжить, чтобы перейти к финальным вопросам.",
    nextPdfIntro: "Теперь будет текст в привычном вам страничном формате.",
    nextWordsIntro: "Теперь текст будет показываться по одному слову.",
    specialBeforeText4: "Теперь давайте отойдем от художественной литературы.",
    textHeading: (textIndex, total) => `Текст ${textIndex} из ${total}`,
    textCompletedHeading: (textIndex, total) => `Текст ${textIndex} из ${total} завершен`,
    segmentLabel: (textIndex, total, title, partIndex) => `Текст ${textIndex} из ${total} • ${title}, часть ${partIndex}`,
    wordsPerMinute: (wpm) => `${wpm} слов/мин`,
    loadingProtocol: "Загружаем протокол исследования...",
    startingSession: "Запускаем сессию...",
    savingResults: "Сохраняем результаты...",
    missingComprehension: "Пожалуйста, оцените понимание текста по шкале от 1 до 5.",
    missingFeedback: "Пожалуйста, заполните поле обратной связи.",
    failedProtocol: "Не удалось загрузить протокол исследования.",
    failedStart: "Не удалось начать сессию.",
    failedCalibration: "Не удалось сохранить калибровку.",
    failedSegment: "Не удалось запустить сегмент.",
    failedSave: "Не удалось сохранить результаты.",
    summaryParticipant: "Участник",
    summarySpeed: "Скорость",
    summarySegments: "Сегменты",
    summaryComprehension: "Среднее понимание",
    summaryReadingTime: "Время чтения",
    minute: "мин",
    second: "сек",
    dash: "—",
  },
};

const state = {
  language: "",
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
  pendingComprehensionSegmentId: "",
  selectedComprehensionScore: null,
};

const screens = {
  language: document.getElementById("languageScreen"),
  welcome: document.getElementById("welcomeScreen"),
  calibration: document.getElementById("calibrationScreen"),
  transition: document.getElementById("transitionScreen"),
  words: document.getElementById("wordsScreen"),
  pdf: document.getElementById("pdfScreen"),
  checklist: document.getElementById("checklistScreen"),
  feedback: document.getElementById("feedbackScreen"),
  thankYou: document.getElementById("thankYouScreen"),
};

const heroEyebrow = document.getElementById("heroEyebrow");
const heroTitle = document.getElementById("heroTitle");
const heroNote = document.getElementById("heroNote");
const globalStatus = document.getElementById("globalStatus");

const languageTitle = document.getElementById("languageTitle");
const languageNote = document.getElementById("languageNote");
const selectRuBtn = document.getElementById("selectRuBtn");
const selectEnBtn = document.getElementById("selectEnBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeBody = document.getElementById("welcomeBody");
const participantNameLabel = document.getElementById("participantNameLabel");
const participantNameInput = document.getElementById("participantNameInput");
const startSessionBtn = document.getElementById("startSessionBtn");

const calibrationTitle = document.getElementById("calibrationTitle");
const calibrationNote = document.getElementById("calibrationNote");
const calibrationWpmValue = document.getElementById("calibrationWpmValue");
const calibrationWpmUnit = document.getElementById("calibrationWpmUnit");
const calibrationWord = document.getElementById("calibrationWord");
const calibrationContinueBtn = document.getElementById("calibrationContinueBtn");
const calibrationSpeedLabel = document.getElementById("calibrationSpeedLabel");
const calibrationHint = document.getElementById("calibrationHint");
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
const transitionHint = document.getElementById("transitionHint");
const transitionContinueBtn = document.getElementById("transitionContinueBtn");
const comprehensionBlock = document.getElementById("comprehensionBlock");
const comprehensionTitle = document.getElementById("comprehensionTitle");
const comprehensionHint = document.getElementById("comprehensionHint");
const comprehensionButtons = Array.from(document.querySelectorAll(".comprehension-btn"));

const wordsSegmentLabel = document.getElementById("wordsSegmentLabel");
const wordsSegmentFormat = document.getElementById("wordsSegmentFormat");
const wordsSegmentWpm = document.getElementById("wordsSegmentWpm");
const wordsProgressBar = document.getElementById("wordsProgressBar");
const wordsProgressText = document.getElementById("wordsProgressText");
const wordsCurrentWord = document.getElementById("wordsCurrentWord");
const wordsHint = document.getElementById("wordsHint");
const wordsPauseBtn = document.getElementById("wordsPauseBtn");

const pdfSegmentLabel = document.getElementById("pdfSegmentLabel");
const pdfSegmentFormat = document.getElementById("pdfSegmentFormat");
const pdfViewerFrame = document.getElementById("pdfViewerFrame");
const pdfFinishBtn = document.getElementById("pdfFinishBtn");

const checklistTitle = document.getElementById("checklistTitle");
const checklistPrompt = document.getElementById("checklistPrompt");
const checklistForm = document.getElementById("checklistForm");
const checklistContinueBtn = document.getElementById("checklistContinueBtn");

const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackPrompt = document.getElementById("feedbackPrompt");
const feedbackLabel = document.getElementById("feedbackLabel");
const feedbackInput = document.getElementById("feedbackInput");
const submitFeedbackBtn = document.getElementById("submitFeedbackBtn");

const thankYouTitle = document.getElementById("thankYouTitle");
const thankYouLead = document.getElementById("thankYouLead");
const thankYouSummary = document.getElementById("thankYouSummary");

function locale() {
  return COPY[state.language] || COPY[DEFAULT_LANGUAGE];
}

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
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}

function applyStaticCopy() {
  const copy = locale();

  document.documentElement.lang = state.language || DEFAULT_LANGUAGE;
  document.title = copy.documentTitle;

  heroEyebrow.textContent = copy.heroEyebrow;
  heroTitle.textContent = copy.heroTitle;
  heroNote.textContent = copy.heroNote;

  languageTitle.textContent = copy.languageTitle;
  languageNote.textContent = copy.languageNote;
  selectRuBtn.textContent = "Русский";
  selectEnBtn.textContent = "English";

  welcomeTitle.textContent = copy.welcomeTitle;
  welcomeBody.textContent = copy.welcomeBody;
  participantNameLabel.textContent = copy.participantNameLabel;
  startSessionBtn.textContent = copy.start;

  calibrationTitle.textContent = copy.calibrationTitle;
  calibrationNote.textContent = copy.calibrationNote;
  calibrationWpmUnit.textContent = copy.calibrationWpmUnit;
  calibrationSpeedLabel.textContent = copy.calibrationSpeedLabel;
  calibrationHint.textContent = copy.calibrationHint;
  calibrationContinueBtn.textContent = copy.continue;
  calibrationWord.textContent = copy.calibrationReadyWord;

  transitionHint.textContent = copy.transitionHint;
  transitionContinueBtn.textContent = copy.continue;
  comprehensionTitle.textContent = copy.comprehensionTitle;
  comprehensionHint.textContent = copy.comprehensionHint;

  wordsSegmentFormat.textContent = copy.wordsMode;
  wordsCurrentWord.textContent = copy.calibrationReadyWord;
  wordsHint.textContent = copy.wordsHint;
  wordsPauseBtn.textContent = copy.pause;

  pdfSegmentFormat.textContent = copy.pdfMode;
  pdfFinishBtn.textContent = copy.pdfFinish;

  checklistTitle.textContent = copy.checklistTitle;
  checklistPrompt.textContent = copy.checklistPrompt;
  checklistContinueBtn.textContent = copy.continue;

  feedbackTitle.textContent = copy.feedbackTitle;
  feedbackPrompt.textContent = copy.feedbackPrompt;
  feedbackLabel.textContent = copy.feedbackLabel;
  submitFeedbackBtn.textContent = copy.submit;

  thankYouTitle.textContent = copy.thankYouTitle;
  thankYouLead.textContent = copy.thankYouLead;
}

function renderChecklist() {
  checklistForm.innerHTML = "";
  if (!state.protocol) {
    return;
  }

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

function totalTextCount() {
  return state.protocol?.texts?.length || 0;
}

function startCalibrationPlaybackLoop() {
  clearWordTimer();

  if (!isVisible(screens.calibration)) {
    return;
  }

  if (!state.calibrationWords.length) {
    calibrationWord.textContent = locale().failedCalibration;
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
  updateWordsProgress();

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

function updateWordsProgress() {
  const totalWords = state.activeWords.length;
  const shownWords = Math.min(state.activeWordIndex, totalWords);
  const progressPercent = totalWords > 0 ? (shownWords / totalWords) * 100 : 0;

  wordsProgressBar.style.width = `${progressPercent}%`;
  wordsProgressText.textContent = `${shownWords} / ${totalWords}`;
}

function toggleWordsPause() {
  if (!isVisible(screens.words) || !state.currentSegment || state.currentSegment.format !== "words") {
    return;
  }

  if (state.activeWordIndex >= state.activeWords.length) {
    return;
  }

  state.isWordsPaused = !state.isWordsPaused;
  wordsPauseBtn.textContent = state.isWordsPaused ? locale().resume : locale().pause;

  if (state.isWordsPaused) {
    clearWordTimer();
  } else {
    startWordPlaybackLoop();
  }
}

async function getWordsForText(textId, partIndex) {
  const cacheKey = `${state.language}:${textId}:${partIndex}`;
  if (state.wordsCache.has(cacheKey)) {
    return state.wordsCache.get(cacheKey);
  }

  const payload = await fetchJson(`/api/text/${textId}/words?part=${partIndex}&lang=${state.language}`);
  state.wordsCache.set(cacheKey, payload.words);
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
    partIndex: state.currentSegment.partIndex,
    format: state.currentSegment.format,
    orderInText: state.currentSegment.orderInText,
    startedAtUtc: state.currentSegmentStartedAtUtc,
    finishedAtUtc,
    durationSeconds,
    completionAction: state.currentSegment.format === "words" ? "auto_end_of_text" : "i_finished_button",
    selectedWpmAtRun: state.selectedWpm,
    comprehensionScore: null,
  });
}

function resetComprehensionSelection() {
  state.selectedComprehensionScore = null;
  for (const button of comprehensionButtons) {
    button.classList.remove("is-active");
  }
}

function setComprehensionSelection(score) {
  state.selectedComprehensionScore = score;
  for (const button of comprehensionButtons) {
    const buttonScore = Number.parseInt(button.dataset.score || "0", 10);
    button.classList.toggle("is-active", buttonScore === score);
  }
}

function saveComprehensionForPendingSegment() {
  if (!state.pendingComprehensionSegmentId) {
    return true;
  }

  if (!state.selectedComprehensionScore) {
    setGlobalStatus(locale().missingComprehension, true);
    return false;
  }

  const segmentRecord = [...state.segmentResults]
    .reverse()
    .find((item) => item.segmentId === state.pendingComprehensionSegmentId);

  if (!segmentRecord) {
    setGlobalStatus(locale().failedSave, true);
    return false;
  }

  segmentRecord.comprehensionScore = state.selectedComprehensionScore;
  state.pendingComprehensionSegmentId = "";
  resetComprehensionSelection();
  setGlobalStatus("");
  return true;
}

function buildNextFormatText(previousSegment, nextSegment) {
  if (!nextSegment) {
    return "";
  }

  if (nextSegment.format === "pdf") {
    if (nextSegment.textIndex === 4 && (!previousSegment || previousSegment.textIndex < 4)) {
      return locale().specialBeforeText4;
    }
    return locale().nextPdfIntro;
  }

  return locale().nextWordsIntro;
}

function presentTransition(previousSegment, nextSegment) {
  const copy = locale();
  const textsTotal = totalTextCount();
  const requiresComprehension = Boolean(previousSegment);

  if (!previousSegment) {
    transitionTitle.textContent = copy.calibrationDoneTitle;
    transitionProgress.textContent = copy.prepareFirstText;
    transitionNextFormat.textContent = buildNextFormatText(previousSegment, nextSegment);
  } else if (nextSegment && previousSegment.textIndex === nextSegment.textIndex) {
    transitionTitle.textContent = copy.textHeading(nextSegment.textIndex, textsTotal);
    transitionProgress.textContent = copy.partTransition(previousSegment.orderInText, nextSegment.orderInText);
    transitionNextFormat.textContent = buildNextFormatText(previousSegment, nextSegment);
  } else if (nextSegment) {
    transitionTitle.textContent = copy.textCompletedHeading(previousSegment.textIndex, textsTotal);
    transitionProgress.textContent = copy.nextTextReady(nextSegment.textIndex, textsTotal);
    transitionNextFormat.textContent = buildNextFormatText(previousSegment, nextSegment);
  } else {
    transitionTitle.textContent = copy.textCompletedHeading(previousSegment.textIndex, textsTotal);
    transitionProgress.textContent = copy.allTextsDone;
    transitionNextFormat.textContent = "";
  }

  transitionNextFormat.classList.toggle("hidden", !nextSegment);
  comprehensionBlock.classList.toggle("hidden", !requiresComprehension);
  if (requiresComprehension) {
    resetComprehensionSelection();
    comprehensionHint.classList.remove("is-error");
  }
  transitionContinueBtn.disabled = false;
  showScreen("transition");
}

async function startWordsSegment(segment) {
  const words = await getWordsForText(segment.textId, segment.partIndex);

  state.activeWords = words;
  state.activeWordIndex = 0;
  state.isWordsPaused = false;
  wordsPauseBtn.disabled = false;
  wordsPauseBtn.textContent = locale().pause;

  wordsSegmentLabel.textContent = locale().segmentLabel(
    segment.textIndex,
    totalTextCount(),
    segment.textTitle,
    segment.partIndex,
  );
  wordsSegmentFormat.textContent = locale().wordsMode;
  wordsSegmentWpm.textContent = locale().wordsPerMinute(state.selectedWpm);
  wordsCurrentWord.textContent = locale().calibrationReadyWord;
  updateWordsProgress();

  showScreen("words");
  startWordPlaybackLoop();
}

function startPdfSegment(segment) {
  const textInfo = findTextById(segment.textId);
  pdfSegmentLabel.textContent = locale().segmentLabel(
    segment.textIndex,
    totalTextCount(),
    segment.textTitle,
    segment.partIndex,
  );
  pdfSegmentFormat.textContent = locale().pdfMode;
  pdfViewerFrame.src = `${textInfo.pdfUrl}?part=${segment.partIndex}&lang=${state.language}#view=FitH`;
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
    setGlobalStatus(error.message || locale().failedSegment, true);
    showScreen("transition");
  }
}

function continueFromTransition() {
  if (!saveComprehensionForPendingSegment()) {
    return;
  }

  if (!currentSegmentPlan()) {
    showScreen("checklist");
    return;
  }

  startCurrentSegment();
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
  state.pendingComprehensionSegmentId = previousSegment.segmentId;

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

function formatDurationSummary(seconds) {
  const copy = locale();
  const totalSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const restSeconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${restSeconds} ${copy.second}`;
  }
  return `${minutes} ${copy.minute} ${restSeconds} ${copy.second}`;
}

function renderThankYouSummary() {
  const copy = locale();
  const segmentsCompleted = state.segmentResults.length;
  const totalSeconds = state.segmentResults.reduce((sum, segment) => sum + Number(segment.durationSeconds || 0), 0);
  const comprehensionScores = state.segmentResults
    .map((segment) => Number(segment.comprehensionScore || 0))
    .filter((score) => score > 0);
  const averageComprehension = comprehensionScores.length
    ? (comprehensionScores.reduce((sum, score) => sum + score, 0) / comprehensionScores.length).toFixed(1)
    : copy.dash;

  const summaryItems = [
    { label: copy.summaryParticipant, value: state.participantName || copy.dash },
    { label: copy.summarySpeed, value: copy.wordsPerMinute(state.selectedWpm) },
    { label: copy.summarySegments, value: `${segmentsCompleted} / ${state.protocol.segmentPlan.length}` },
    {
      label: copy.summaryComprehension,
      value: averageComprehension === copy.dash ? averageComprehension : `${averageComprehension} / 5`,
    },
    { label: copy.summaryReadingTime, value: formatDurationSummary(totalSeconds) },
  ];

  thankYouSummary.innerHTML = "";
  for (const item of summaryItems) {
    const row = document.createElement("div");
    row.className = "session-summary-item";

    const label = document.createElement("span");
    label.className = "session-summary-label";
    label.textContent = item.label;

    const value = document.createElement("span");
    value.className = "session-summary-value";
    value.textContent = item.value;

    row.append(label, value);
    thankYouSummary.appendChild(row);
  }
}

async function submitFeedback() {
  if (state.busy) {
    return;
  }

  const feedback = feedbackInput.value.trim();
  if (!feedback) {
    setGlobalStatus(locale().missingFeedback, true);
    return;
  }

  state.busy = true;
  submitFeedbackBtn.disabled = true;
  setGlobalStatus(locale().savingResults);

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
    renderThankYouSummary();
    showScreen("thankYou");
  } catch (error) {
    setGlobalStatus(error.message || locale().failedSave, true);
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
    setGlobalStatus(error.message || locale().failedCalibration, true);
    showScreen("welcome");
  } finally {
    state.busy = false;
    calibrationContinueBtn.disabled = false;
  }
}

async function startSession() {
  if (state.busy || !state.language) {
    return;
  }

  const participantName = participantNameInput.value.trim();
  if (!participantName) {
    return;
  }

  state.busy = true;
  startSessionBtn.disabled = true;
  setGlobalStatus(locale().startingSession);

  try {
    const startPayload = await fetchJson("/api/session/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantName,
        language: state.language,
        userAgent: navigator.userAgent,
      }),
    });

    const calibrationPayload = await fetchJson(`/api/calibration/words?lang=${state.language}`);

    state.sessionId = startPayload.sessionId;
    state.participantName = participantName;
    state.currentSegmentIndex = 0;
    state.segmentResults = [];
    state.wordsCache = new Map();
    state.familiarityChecklist = {};
    state.pendingComprehensionSegmentId = "";
    state.selectedComprehensionScore = null;
    state.calibrationWords = calibrationPayload.words;
    state.calibrationWordIndex = 0;
    feedbackInput.value = "";

    const startWpm = state.protocol?.calibration?.baseWpm ?? 100;
    applyCalibrationWpm(startWpm);

    showScreen("calibration");
    setGlobalStatus("");
    startCalibrationPlaybackLoop();
  } catch (error) {
    setGlobalStatus(error.message || locale().failedStart, true);
    showScreen("welcome");
  } finally {
    state.busy = false;
    startSessionBtn.disabled = participantNameInput.value.trim().length === 0;
  }
}

async function selectLanguage(language) {
  if (state.busy) {
    return;
  }

  state.busy = true;
  state.language = language;
  applyStaticCopy();
  setGlobalStatus(locale().loadingProtocol);
  selectRuBtn.disabled = true;
  selectEnBtn.disabled = true;

  try {
    state.protocol = await fetchJson(`/api/protocol?lang=${language}`);
    renderChecklist();
    setGlobalStatus("");
    showScreen("welcome");
    startSessionBtn.disabled = participantNameInput.value.trim().length === 0;
  } catch (error) {
    setGlobalStatus(error.message || locale().failedProtocol, true);
    showScreen("language");
  } finally {
    state.busy = false;
    selectRuBtn.disabled = false;
    selectEnBtn.disabled = false;
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

  selectRuBtn.addEventListener("click", () => selectLanguage("ru"));
  selectEnBtn.addEventListener("click", () => selectLanguage("en"));
  startSessionBtn.addEventListener("click", startSession);
  calibrationContinueBtn.addEventListener("click", completeCalibration);
  transitionContinueBtn.addEventListener("click", continueFromTransition);
  wordsPauseBtn.addEventListener("click", toggleWordsPause);
  pdfFinishBtn.addEventListener("click", finishCurrentSegment);
  for (const button of comprehensionButtons) {
    button.addEventListener("click", () => {
      const score = Number.parseInt(button.dataset.score || "0", 10);
      if (score >= 1 && score <= 5) {
        setComprehensionSelection(score);
      }
    });
  }

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
      continueFromTransition();
      return;
    }

    if (isVisible(screens.words)) {
      event.preventDefault();
      toggleWordsPause();
    }
  });
}

function init() {
  showScreen("language");
  startSessionBtn.disabled = true;
  bindEvents();
}

init();
