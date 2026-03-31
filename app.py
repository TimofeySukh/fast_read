from __future__ import annotations

import json
import re
import unicodedata
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from xml.sax.saxutils import escape

from flask import Flask, jsonify, render_template, request, send_from_directory
from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
SESSIONS_DIR = DATA_DIR / "sessions"

CALIBRATION_FILE = BASE_DIR / "pdf_start.pdf"
PDF_FOLDER = BASE_DIR / "pdf_folder"
EN_CORPUS_DIR = BASE_DIR / "corpus" / "en"

SCHEMA_VERSION = "1.0.0"
BASE_WPM = 100
CALIBRATION_STEP_WPM = 5
CALIBRATION_MIN_WPM = 50
CALIBRATION_MAX_WPM = 700
DEFAULT_LANGUAGE = "ru"
SUPPORTED_LANGUAGES = {"ru", "en"}

WORD_PATTERN = re.compile(r"[^\W_]+(?:['’`-][^\W_]+)*", re.UNICODE)
SESSION_FILENAME_ALLOWED = re.compile(r"[^0-9A-Za-zА-Яа-яЁё._() -]+", re.UNICODE)

TEXTS: list[dict[str, Any]] = [
    {
        "id": "jump",
        "titles": {
            "ru": "Прыжок",
            "en": "The Dive",
        },
        "authors": {
            "ru": "Лев Толстой",
            "en": "Leo Tolstoy",
        },
        "filename": "прыжок.pdf",
        "order": ["words", "pdf"],
        "checklistId": "jump_tolstoy",
        "checklistLabels": {
            "ru": "Прыжок (Лев Толстой)",
            "en": "The Dive (Leo Tolstoy)",
        },
        "englishSource": "https://kids.azovlib.ru/index.php/2-uncategorised/933-tolstoj-lev-rasskazy-anglijskij",
    },
    {
        "id": "frog_traveler",
        "titles": {
            "ru": "Лягушка-путешественница",
            "en": "The Frog Went Travelling",
        },
        "authors": {
            "ru": "Гаршин",
            "en": "Garshin",
        },
        "filename": "лягушка.pdf",
        "order": ["pdf", "words"],
        "checklistId": "frog_traveler_garshin",
        "checklistLabels": {
            "ru": "Лягушка-путешественница (Гаршин)",
            "en": "The Frog Went Travelling (Garshin)",
        },
        "englishSource": "https://freebooksforkids.net/frog-went-travelling.html",
    },
    {
        "id": "myth_of_the_cave",
        "titles": {
            "ru": "Миф о пещере",
            "en": "The Allegory of the Cave",
        },
        "authors": {
            "ru": "Платон",
            "en": "Plato",
        },
        "filename": "миф_о_пещере.pdf",
        "order": ["words", "pdf"],
        "checklistId": "myth_of_the_cave_plato",
        "checklistLabels": {
            "ru": "Миф о пещере (Платон)",
            "en": "The Allegory of the Cave (Plato)",
        },
        "englishSource": "https://www.gutenberg.org/cache/epub/1497/pg1497.txt",
    },
    {
        "id": "heart_article",
        "titles": {
            "ru": "Статья про сердце",
            "en": "Heart Article",
        },
        "authors": {
            "ru": "—",
            "en": "Translated for this study",
        },
        "filename": "сердце.pdf",
        "order": ["pdf", "words"],
        "checklistId": "heart_article",
        "checklistLabels": {
            "ru": "Статья про сердце",
            "en": "Heart Article",
        },
        "englishSource": None,
    },
]

TEXT_MAP = {item["id"]: item for item in TEXTS}
CHECKLIST_IDS = [item["checklistId"] for item in TEXTS]
TEXT_CACHE: dict[tuple[str, str, int], str] = {}
WORD_CACHE: dict[tuple[str, str, int], list[str]] = {}
PAGE_RANGE_CACHE: dict[str, tuple[tuple[int, int], tuple[int, int]]] = {}
PARTS_DIR = DATA_DIR / "parts"
GENERATED_PDF_DIR = DATA_DIR / "generated_pdfs"

ENGLISH_TEXT_FILES: dict[str, dict[int, Path] | Path] = {
    "calibration": EN_CORPUS_DIR / "calibration.txt",
    "jump": {
        1: EN_CORPUS_DIR / "jump_part1.txt",
        2: EN_CORPUS_DIR / "jump_part2.txt",
    },
    "frog_traveler": {
        1: EN_CORPUS_DIR / "frog_traveler_part1.txt",
        2: EN_CORPUS_DIR / "frog_traveler_part2.txt",
    },
    "myth_of_the_cave": {
        1: EN_CORPUS_DIR / "myth_of_the_cave_part1.txt",
        2: EN_CORPUS_DIR / "myth_of_the_cave_part2.txt",
    },
    "heart_article": {
        1: EN_CORPUS_DIR / "heart_article_part1.txt",
        2: EN_CORPUS_DIR / "heart_article_part2.txt",
    },
}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def validate_language(language: str | None) -> str:
    normalized = str(language or DEFAULT_LANGUAGE).strip().lower()
    return normalized if normalized in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE


def localized_value(mapping: dict[str, str], language: str) -> str:
    return mapping.get(language) or mapping.get(DEFAULT_LANGUAGE) or next(iter(mapping.values()))


def part_label(language: str, part_index: int) -> str:
    if language == "en":
        return f"part {part_index}"
    return f"часть {part_index}"


def title_for_text(text_id: str, language: str) -> str:
    item = TEXT_MAP[text_id]
    return localized_value(item["titles"], language)


def author_for_text(text_id: str, language: str) -> str:
    item = TEXT_MAP[text_id]
    return localized_value(item["authors"], language)


def checklist_label_for_text(text_id: str, language: str) -> str:
    item = TEXT_MAP[text_id]
    return localized_value(item["checklistLabels"], language)


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def clean_extracted_text(text: str) -> str:
    cleaned = text.replace("\x00", "").replace("\u00a0", " ")
    # Remove hard line-wrap hyphenation artifacts like "отноше -\nнии" -> "отношении".
    cleaned = re.sub(
        r"(?<=[A-Za-zА-Яа-яЁё])\s*-\s*\n\s*(?=[A-Za-zА-Яа-яЁё])",
        "",
        cleaned,
    )
    # Normalize spaced compounds like "кто - то" -> "кто-то".
    cleaned = re.sub(
        r"(?<=[A-Za-zА-Яа-яЁё])\s*-\s*(?=[A-Za-zА-Яа-яЁё])",
        "-",
        cleaned,
    )
    # Drop page-number-only lines that leak into one-word playback.
    cleaned = re.sub(r"(?m)^\s*\d+\s*$", " ", cleaned)
    return cleaned


def extract_pdf_text(path: Path) -> str:
    with path.open("rb") as handle:
        reader = PdfReader(handle)
        all_text: list[str] = []
        for page in reader.pages:
            extracted = page.extract_text() or ""
            if extracted:
                all_text.append(clean_extracted_text(extracted))
    return normalize_text(" ".join(all_text))


def tokenize_words(text: str) -> list[str]:
    return WORD_PATTERN.findall(text)


def required_ru_file_for_text_id(text_id: str) -> Path:
    if text_id == "calibration":
        return CALIBRATION_FILE
    text = TEXT_MAP.get(text_id)
    if not text:
        raise KeyError(f"Unknown text id: {text_id}")
    return PDF_FOLDER / text["filename"]


def english_text_file_paths(text_id: str, part_index: int | None = None) -> list[Path]:
    if text_id == "calibration":
        path = ENGLISH_TEXT_FILES["calibration"]
        assert isinstance(path, Path)
        return [path]

    entry = ENGLISH_TEXT_FILES.get(text_id)
    if not isinstance(entry, dict):
        raise KeyError(f"Unknown English text id: {text_id}")

    if part_index is None:
        return [entry[1], entry[2]]

    part = validate_part_index(part_index)
    return [entry[part]]


def load_english_text(text_id: str, part_index: int | None = None) -> str:
    key = ("en", text_id, part_index or 0)
    cached = TEXT_CACHE.get(key)
    if cached is not None:
        return cached

    fragments: list[str] = []
    for path in english_text_file_paths(text_id, part_index):
        if not path.exists():
            raise FileNotFoundError(f"Missing English text asset: {path}")
        fragments.append(path.read_text(encoding="utf-8").strip())

    text = "\n\n".join(fragment for fragment in fragments if fragment)
    if not text:
        raise ValueError(f"English text asset is empty for {text_id}")

    TEXT_CACHE[key] = text
    return text


def words_for_text_id(text_id: str, language: str = DEFAULT_LANGUAGE) -> list[str]:
    normalized_language = validate_language(language)
    cache_key = (normalized_language, text_id, 0)
    if cache_key in WORD_CACHE:
        return WORD_CACHE[cache_key]

    if normalized_language == "en":
        text = load_english_text(text_id)
        words = tokenize_words(text)
        if not words:
            raise ValueError(f"No extractable words in English text: {text_id}")
        WORD_CACHE[cache_key] = words
        return words

    source = required_ru_file_for_text_id(text_id)
    if not source.exists():
        raise FileNotFoundError(f"Missing source PDF: {source}")

    text = extract_pdf_text(source)
    words = tokenize_words(text)
    if not words:
        raise ValueError(f"No extractable words in PDF: {source.name}")

    WORD_CACHE[cache_key] = words
    return words


def compute_part_page_ranges(source: Path) -> tuple[tuple[int, int], tuple[int, int]]:
    cache_key = str(source)
    cached = PAGE_RANGE_CACHE.get(cache_key)
    if cached is not None:
        return cached

    with source.open("rb") as handle:
        reader = PdfReader(handle)
        total_pages = len(reader.pages)

    if total_pages <= 1:
        ranges = ((0, max(total_pages, 1)), (0, max(total_pages, 1)))
    else:
        midpoint = (total_pages + 1) // 2
        ranges = ((0, midpoint), (midpoint, total_pages))

    PAGE_RANGE_CACHE[cache_key] = ranges
    return ranges


def validate_part_index(part_index: int) -> int:
    if part_index not in {1, 2}:
        raise ValueError("part must be 1 or 2")
    return part_index


def extract_pdf_text_in_range(path: Path, start_page: int, end_page: int) -> str:
    with path.open("rb") as handle:
        reader = PdfReader(handle)
        all_text: list[str] = []
        safe_end = min(end_page, len(reader.pages))
        safe_start = max(0, min(start_page, safe_end))
        for page_index in range(safe_start, safe_end):
            extracted = reader.pages[page_index].extract_text() or ""
            if extracted:
                all_text.append(clean_extracted_text(extracted))
    return normalize_text(" ".join(all_text))


def words_for_text_part(text_id: str, part_index: int) -> list[str]:
    part = validate_part_index(part_index)
    cache_key = (DEFAULT_LANGUAGE, text_id, part)
    cached = WORD_CACHE.get(cache_key)
    if cached is not None:
        return cached

    source = required_ru_file_for_text_id(text_id)
    if not source.exists():
        raise FileNotFoundError(f"Missing source PDF: {source}")

    ranges = compute_part_page_ranges(source)
    start_page, end_page = ranges[part - 1]
    text = extract_pdf_text_in_range(source, start_page, end_page)
    words = tokenize_words(text)
    if not words:
        raise ValueError(f"No extractable words in PDF part: {source.name} (part {part})")

    WORD_CACHE[cache_key] = words
    return words


def words_for_text_part_by_language(text_id: str, part_index: int, language: str = DEFAULT_LANGUAGE) -> list[str]:
    normalized_language = validate_language(language)
    part = validate_part_index(part_index)

    if normalized_language == "ru":
        return words_for_text_part(text_id, part)

    cache_key = (normalized_language, text_id, part)
    cached = WORD_CACHE.get(cache_key)
    if cached is not None:
        return cached

    text = load_english_text(text_id, part)
    words = tokenize_words(text)
    if not words:
        raise ValueError(f"No extractable words in English text part: {text_id} (part {part})")

    WORD_CACHE[cache_key] = words
    return words


def ensure_pdf_part_file(text_id: str, part_index: int) -> Path:
    part = validate_part_index(part_index)
    source = required_ru_file_for_text_id(text_id)
    if not source.exists():
        raise FileNotFoundError(f"Missing source PDF: {source}")

    output_path = PARTS_DIR / f"{text_id}_part{part}.pdf"
    PARTS_DIR.mkdir(parents=True, exist_ok=True)
    if output_path.exists() and output_path.stat().st_mtime >= source.stat().st_mtime:
        return output_path

    ranges = compute_part_page_ranges(source)
    start_page, end_page = ranges[part - 1]

    with source.open("rb") as handle:
        reader = PdfReader(handle)
        writer = PdfWriter()
        safe_end = min(end_page, len(reader.pages))
        safe_start = max(0, min(start_page, safe_end))
        for page_index in range(safe_start, safe_end):
            writer.add_page(reader.pages[page_index])

        # Fallback for single-page or malformed range edge-cases.
        if len(writer.pages) == 0 and len(reader.pages) > 0:
            writer.add_page(reader.pages[0])

        with output_path.open("wb") as output_handle:
            writer.write(output_handle)

    return output_path


def split_text_paragraphs(text: str) -> list[str]:
    return [normalize_text(chunk) for chunk in re.split(r"\n\s*\n", text) if chunk.strip()]


def build_text_pdf(output_path: Path, title: str, text: str) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "study_title",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        spaceAfter=10,
    )
    body_style = ParagraphStyle(
        "study_body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=11,
        leading=15,
        spaceAfter=8,
    )

    story: list[Any] = [Paragraph(escape(title), title_style), Spacer(1, 3 * mm)]
    for paragraph in split_text_paragraphs(text):
        story.append(Paragraph(escape(paragraph), body_style))
        story.append(Spacer(1, 2 * mm))

    document = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title=title,
    )
    document.build(story)
    return output_path


def generated_pdf_title(text_id: str, language: str, part_index: int | None = None) -> str:
    if text_id == "calibration":
        return "Calibration Text" if language == "en" else "Калибровка"

    title = title_for_text(text_id, language)
    if part_index is None:
        return title
    return f"{title} - Part {part_index}" if language == "en" else f"{title} - Часть {part_index}"


def ensure_english_pdf(text_id: str, part_index: int | None = None) -> Path:
    normalized_part = validate_part_index(part_index) if part_index is not None else None
    source_paths = english_text_file_paths(text_id, normalized_part)

    if text_id == "calibration":
        output_name = "calibration_en.pdf"
    elif normalized_part is None:
        output_name = f"{text_id}_en.pdf"
    else:
        output_name = f"{text_id}_part{normalized_part}_en.pdf"

    output_path = GENERATED_PDF_DIR / output_name
    latest_source_mtime = max(path.stat().st_mtime for path in source_paths)
    if output_path.exists() and output_path.stat().st_mtime >= latest_source_mtime:
        return output_path

    text = load_english_text(text_id, normalized_part)
    title = generated_pdf_title(text_id, "en", normalized_part)
    return build_text_pdf(output_path, title, text)


def build_base_segment_plan() -> list[dict[str, Any]]:
    segments: list[dict[str, Any]] = []
    for text_index, item in enumerate(TEXTS, start=1):
        for order_in_text, fmt in enumerate(item["order"], start=1):
            part_index = order_in_text
            segments.append(
                {
                    "segmentId": f"t{text_index}_{fmt}",
                    "textId": item["id"],
                    "textIndex": text_index,
                    "partIndex": part_index,
                    "format": fmt,
                    "orderInText": order_in_text,
                }
            )
    return segments


def build_segment_plan(language: str = DEFAULT_LANGUAGE) -> list[dict[str, Any]]:
    normalized_language = validate_language(language)
    localized_segments: list[dict[str, Any]] = []

    for segment in BASE_SEGMENT_PLAN:
        title = title_for_text(segment["textId"], normalized_language)
        localized_segments.append(
            {
                **segment,
                "textTitle": title,
                "partTitle": (
                    f"{title} - Part {segment['partIndex']}"
                    if normalized_language == "en"
                    else f"{title} — часть {segment['partIndex']}"
                ),
                "textAuthor": author_for_text(segment["textId"], normalized_language),
            }
        )
    return localized_segments


BASE_SEGMENT_PLAN = build_base_segment_plan()
SEGMENT_PLAN = build_segment_plan()
EXPECTED_SEGMENT_IDS = [segment["segmentId"] for segment in BASE_SEGMENT_PLAN]


def session_files() -> list[Path]:
    if not SESSIONS_DIR.exists():
        return []
    return sorted(SESSIONS_DIR.glob("*.json"))


def session_path(session_id: str) -> Path:
    direct_path = SESSIONS_DIR / f"{session_id}.json"
    if direct_path.exists():
        return direct_path

    for candidate in session_files():
        try:
            payload = json.loads(candidate.read_text(encoding="utf-8"))
        except Exception:
            continue
        if str(payload.get("sessionId", "")).strip() == session_id:
            return candidate

    return direct_path


def session_filename_stem(participant_name: str) -> str:
    normalized = unicodedata.normalize("NFKC", participant_name).strip()
    normalized = SESSION_FILENAME_ALLOWED.sub("", normalized)
    normalized = re.sub(r"\s+", "_", normalized)
    normalized = normalized.strip("._ ")
    return normalized or "session"


def unique_session_path(participant_name: str, session_id: str) -> Path:
    base_stem = session_filename_stem(participant_name)
    attempt = 0
    while True:
        suffix = "" if attempt == 0 else f"__{attempt + 1}"
        candidate = SESSIONS_DIR / f"{base_stem}{suffix}.json"
        if not candidate.exists():
            return candidate
        try:
            payload = json.loads(candidate.read_text(encoding="utf-8"))
        except Exception:
            attempt += 1
            continue
        if str(payload.get("sessionId", "")).strip() == session_id:
            return candidate
        attempt += 1


def load_session(session_id: str) -> dict[str, Any]:
    path = session_path(session_id)
    if not path.exists():
        raise FileNotFoundError(f"Unknown session id: {session_id}")
    return json.loads(path.read_text(encoding="utf-8"))


def save_session(data: dict[str, Any]) -> None:
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    path = session_path(data["sessionId"])
    if not path.exists():
        participant_name = str((data.get("participant") or {}).get("name", "")).strip()
        path = unique_session_path(participant_name, str(data["sessionId"]))
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def validate_segments(segments: Any) -> tuple[bool, str]:
    if not isinstance(segments, list):
        return False, "segments must be an array"
    if len(segments) != len(EXPECTED_SEGMENT_IDS):
        return False, f"segments must contain {len(EXPECTED_SEGMENT_IDS)} records"

    for index, expected in enumerate(BASE_SEGMENT_PLAN):
        actual = segments[index]
        if not isinstance(actual, dict):
            return False, f"segment #{index + 1} must be an object"

        actual_id = str(actual.get("segmentId", ""))
        if actual_id != expected["segmentId"]:
            return False, f"segment order mismatch at position {index + 1}: expected {expected['segmentId']}"

        for required_key in [
            "textIndex",
            "textTitle",
            "partIndex",
            "format",
            "orderInText",
            "comprehensionScore",
            "startedAtUtc",
            "finishedAtUtc",
            "durationSeconds",
        ]:
            if required_key not in actual:
                return False, f"missing {required_key} in segment {actual_id}"

        try:
            part_index = int(actual.get("partIndex", 0))
        except (TypeError, ValueError):
            return False, f"partIndex must be integer in segment {actual_id}"
        if part_index != int(expected["partIndex"]):
            return False, f"partIndex mismatch in segment {actual_id}: expected {expected['partIndex']}"

        if str(actual["format"]) not in {"words", "pdf"}:
            return False, f"invalid format in segment {actual_id}"

        try:
            duration = float(actual["durationSeconds"])
        except (TypeError, ValueError):
            return False, f"durationSeconds must be numeric in segment {actual_id}"
        if duration < 0:
            return False, f"durationSeconds must be >= 0 in segment {actual_id}"

        try:
            comprehension_score = int(actual.get("comprehensionScore", 0))
        except (TypeError, ValueError):
            return False, f"comprehensionScore must be integer in segment {actual_id}"
        if comprehension_score < 1 or comprehension_score > 5:
            return False, f"comprehensionScore must be in range 1..5 in segment {actual_id}"

        if str(actual["format"]) == "words":
            try:
                wpm = int(actual.get("selectedWpmAtRun", 0))
            except (TypeError, ValueError):
                return False, f"selectedWpmAtRun must be integer in segment {actual_id}"
            if wpm < 1 or wpm > 1000:
                return False, f"selectedWpmAtRun out of range in segment {actual_id}"

    return True, ""


def compute_asset_version() -> str:
    """Cache-busting token for static assets served to clients/CDNs."""
    candidates = [
        BASE_DIR / "static" / "app.js",
        BASE_DIR / "static" / "styles.css",
        BASE_DIR / "templates" / "index.html",
    ]
    latest_mtime = 0
    for candidate in candidates:
        if candidate.exists():
            latest_mtime = max(latest_mtime, int(candidate.stat().st_mtime))
    return str(latest_mtime or int(datetime.now(timezone.utc).timestamp()))


def validate_checklist(checklist: Any) -> tuple[bool, str]:
    if not isinstance(checklist, dict):
        return False, "familiarityChecklist must be an object"

    for key in CHECKLIST_IDS:
        if key not in checklist:
            return False, f"missing checklist field: {key}"
        if not isinstance(checklist[key], bool):
            return False, f"checklist field must be boolean: {key}"

    return True, ""


def create_app() -> Flask:
    app = Flask(__name__, template_folder="templates", static_folder="static")

    @app.after_request
    def add_no_cache_headers(response):  # type: ignore[no-untyped-def]
        path = request.path
        if path == "/" or path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response

    @app.get("/")
    def index() -> str:
        return render_template("index.html", asset_version=compute_asset_version())

    @app.get("/api/protocol")
    def protocol() -> Any:
        language = validate_language(request.args.get("lang"))
        texts = []
        for item in TEXTS:
            texts.append(
                {
                    "id": item["id"],
                    "title": localized_value(item["titles"], language),
                    "author": localized_value(item["authors"], language),
                    "pdfUrl": f"/pdf/{item['id']}",
                    "order": item["order"],
                    "checklistId": item["checklistId"],
                    "checklistLabel": localized_value(item["checklistLabels"], language),
                    "englishSource": item["englishSource"],
                }
            )

        return jsonify(
            {
                "schemaVersion": SCHEMA_VERSION,
                "language": language,
                "calibration": {
                    "sourceFile": "calibration_en.pdf" if language == "en" else CALIBRATION_FILE.name,
                    "baseWpm": BASE_WPM,
                    "minWpm": CALIBRATION_MIN_WPM,
                    "maxWpm": CALIBRATION_MAX_WPM,
                    "stepWpm": CALIBRATION_STEP_WPM,
                },
                "texts": texts,
                "segmentPlan": build_segment_plan(language),
                "familiarityItems": [
                    {
                        "id": item["checklistId"],
                        "label": localized_value(item["checklistLabels"], language),
                    }
                    for item in TEXTS
                ],
            }
        )

    @app.get("/api/calibration/words")
    def calibration_words() -> tuple[Any, int] | Any:
        language = validate_language(request.args.get("lang"))
        try:
            words = words_for_text_id("calibration", language)
        except (FileNotFoundError, ValueError) as error:
            return jsonify({"error": str(error)}), 400
        except Exception:
            return jsonify({"error": "Failed to load calibration text"}), 400

        return jsonify(
            {
                "textId": "calibration",
                "language": language,
                "sourceFile": "calibration_en.pdf" if language == "en" else CALIBRATION_FILE.name,
                "wordCount": len(words),
                "words": words,
            }
        )

    @app.get("/api/text/<text_id>/words")
    def text_words(text_id: str) -> tuple[Any, int] | Any:
        if text_id not in TEXT_MAP:
            return jsonify({"error": f"Unknown text id: {text_id}"}), 404
        language = validate_language(request.args.get("lang"))

        try:
            part_index = validate_part_index(int(request.args.get("part", "1")))
        except (TypeError, ValueError):
            return jsonify({"error": "part must be 1 or 2"}), 400

        try:
            words = words_for_text_part_by_language(text_id, part_index, language)
        except (FileNotFoundError, ValueError) as error:
            return jsonify({"error": str(error)}), 400
        except Exception:
            return jsonify({"error": "Failed to load source text"}), 400

        return jsonify(
            {
                "textId": text_id,
                "language": language,
                "partIndex": part_index,
                "title": title_for_text(text_id, language),
                "wordCount": len(words),
                "words": words,
            }
        )

    @app.get("/pdf/<text_id>")
    def serve_pdf(text_id: str) -> tuple[Any, int] | Any:
        language = validate_language(request.args.get("lang"))

        if language == "en":
            part_raw = request.args.get("part")
            try:
                part_index = validate_part_index(int(part_raw)) if part_raw else None
                english_pdf = ensure_english_pdf(text_id, part_index)
            except (TypeError, ValueError):
                return jsonify({"error": "part must be 1 or 2"}), 400
            except (FileNotFoundError, KeyError) as error:
                return jsonify({"error": str(error)}), 404
            return send_from_directory(english_pdf.parent, english_pdf.name, as_attachment=False)

        if text_id == "calibration":
            if not CALIBRATION_FILE.exists():
                return jsonify({"error": f"Missing file: {CALIBRATION_FILE.name}"}), 404
            return send_from_directory(CALIBRATION_FILE.parent, CALIBRATION_FILE.name, as_attachment=False)

        item = TEXT_MAP.get(text_id)
        if not item:
            return jsonify({"error": f"Unknown text id: {text_id}"}), 404

        source = PDF_FOLDER / item["filename"]
        if not source.exists():
            return jsonify({"error": f"Missing file: {source.name}"}), 404

        part_raw = request.args.get("part")
        if not part_raw:
            return send_from_directory(source.parent, source.name, as_attachment=False)

        try:
            part_index = validate_part_index(int(part_raw))
            part_pdf = ensure_pdf_part_file(text_id, part_index)
        except (TypeError, ValueError):
            return jsonify({"error": "part must be 1 or 2"}), 400
        except FileNotFoundError as error:
            return jsonify({"error": str(error)}), 404

        return send_from_directory(part_pdf.parent, part_pdf.name, as_attachment=False)

    @app.post("/api/session/start")
    def start_session() -> tuple[Any, int] | Any:
        payload = request.get_json(silent=True) or {}
        participant_name = str(payload.get("participantName", "")).strip()
        if not participant_name:
            return jsonify({"error": "participantName is required"}), 400
        language = validate_language(payload.get("language"))

        session_id = str(uuid.uuid4())
        now = utc_now_iso()
        record = {
            "schemaVersion": SCHEMA_VERSION,
            "sessionId": session_id,
            "language": language,
            "status": "in_progress",
            "createdAtUtc": now,
            "updatedAtUtc": now,
            "participant": {
                "name": participant_name,
                "language": language,
                "savedAtUtc": now,
            },
            "calibration": {},
            "segments": [],
            "familiarityChecklist": {},
            "feedback": {},
            "device": {
                "startUserAgent": str(payload.get("userAgent", "")).strip(),
            },
        }
        save_session(record)
        return jsonify({"ok": True, "sessionId": session_id})

    @app.post("/api/session/calibration")
    def save_calibration() -> tuple[Any, int] | Any:
        payload = request.get_json(silent=True) or {}
        session_id = str(payload.get("sessionId", "")).strip()
        if not session_id:
            return jsonify({"error": "sessionId is required"}), 400

        try:
            selected_wpm = int(payload.get("selectedWpm", 0))
        except (TypeError, ValueError):
            return jsonify({"error": "selectedWpm must be an integer"}), 400

        if selected_wpm < CALIBRATION_MIN_WPM or selected_wpm > CALIBRATION_MAX_WPM:
            return (
                jsonify(
                    {
                        "error": (
                            f"selectedWpm must be between "
                            f"{CALIBRATION_MIN_WPM} and {CALIBRATION_MAX_WPM}"
                        )
                    }
                ),
                400,
            )

        stop_method = str(payload.get("stopMethod", "")).strip()
        if stop_method not in {"manual_select", "space", "stop_button"}:
            return jsonify({"error": "stopMethod must be 'manual_select', 'space' or 'stop_button'"}), 400

        try:
            record = load_session(session_id)
        except FileNotFoundError:
            return jsonify({"error": "session not found"}), 404

        now = utc_now_iso()
        record_language = validate_language(record.get("language"))
        record["calibration"] = {
            "sourcePdf": "calibration_en.pdf" if record_language == "en" else CALIBRATION_FILE.name,
            "selectionMode": "manual",
            "minWpm": CALIBRATION_MIN_WPM,
            "maxWpm": CALIBRATION_MAX_WPM,
            "stepWpm": CALIBRATION_STEP_WPM,
            "stopMethod": stop_method,
            "selectedWpm": selected_wpm,
            "stoppedAtUtc": now,
        }
        record["updatedAtUtc"] = now
        save_session(record)
        return jsonify({"ok": True})

    @app.post("/api/session/complete")
    def complete_session() -> tuple[Any, int] | Any:
        payload = request.get_json(silent=True) or {}
        session_id = str(payload.get("sessionId", "")).strip()
        if not session_id:
            return jsonify({"error": "sessionId is required"}), 400

        try:
            record = load_session(session_id)
        except FileNotFoundError:
            return jsonify({"error": "session not found"}), 404

        if not record.get("calibration"):
            return jsonify({"error": "calibration must be saved before completion"}), 400

        segments = payload.get("segments")
        ok_segments, segments_error = validate_segments(segments)
        if not ok_segments:
            return jsonify({"error": segments_error}), 400

        checklist = payload.get("familiarityChecklist")
        ok_checklist, checklist_error = validate_checklist(checklist)
        if not ok_checklist:
            return jsonify({"error": checklist_error}), 400

        feedback_obj = payload.get("feedback")
        if not isinstance(feedback_obj, dict):
            return jsonify({"error": "feedback must be an object"}), 400
        feedback_text = str(feedback_obj.get("text", "")).strip()
        if not feedback_text:
            return jsonify({"error": "feedback.text is required"}), 400

        now = utc_now_iso()
        record["segments"] = segments
        record["familiarityChecklist"] = {
            **checklist,
            "submittedAtUtc": now,
        }
        record["feedback"] = {
            "text": feedback_text,
            "submittedAtUtc": now,
        }
        record["device"].update(payload.get("device") or {})
        record["status"] = "completed"
        record["updatedAtUtc"] = now

        save_session(record)
        return jsonify({"ok": True, "sessionId": session_id})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
