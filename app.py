from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, render_template, request, send_from_directory
from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
SESSIONS_DIR = DATA_DIR / "sessions"

CALIBRATION_FILE = BASE_DIR / "pdf_start.pdf"
PDF_FOLDER = BASE_DIR / "pdf_folder"

SCHEMA_VERSION = "1.0.0"
BASE_WPM = 100
CALIBRATION_STEP_WPM = 5
CALIBRATION_MIN_WPM = 50
CALIBRATION_MAX_WPM = 700

WORD_PATTERN = re.compile(r"[^\W_]+(?:['’`-][^\W_]+)*", re.UNICODE)

TEXTS: list[dict[str, Any]] = [
    {
        "id": "jump",
        "title": "Прыжок",
        "author": "Лев Толстой",
        "filename": "прыжок.pdf",
        "order": ["words", "pdf"],
        "checklistId": "jump_tolstoy",
        "checklistLabel": "Прыжок (Лев Толстой)",
    },
    {
        "id": "frog_traveler",
        "title": "Лягушка-путешественница",
        "author": "Гаршин",
        "filename": "лягушка.pdf",
        "order": ["pdf", "words"],
        "checklistId": "frog_traveler_garshin",
        "checklistLabel": "Лягушка-путешественница (Гаршин)",
    },
    {
        "id": "myth_of_the_cave",
        "title": "Миф о пещере",
        "author": "Платон",
        "filename": "миф_о_пещере.pdf",
        "order": ["words", "pdf"],
        "checklistId": "myth_of_the_cave_plato",
        "checklistLabel": "Миф о пещере (Платон)",
    },
    {
        "id": "macintosh_presentation",
        "title": "Презентация Макинтоша",
        "author": "—",
        "filename": "макинтош.pdf",
        "order": ["pdf", "words"],
        "checklistId": "macintosh_presentation",
        "checklistLabel": "Презентация Макинтоша",
    },
    {
        "id": "heart_article",
        "title": "Статья про сердце",
        "author": "—",
        "filename": "сердце.pdf",
        "order": ["words", "pdf"],
        "checklistId": "heart_article",
        "checklistLabel": "Статья про сердце",
    },
]

TEXT_MAP = {item["id"]: item for item in TEXTS}
CHECKLIST_IDS = [item["checklistId"] for item in TEXTS]
WORD_CACHE: dict[str, list[str]] = {}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def extract_pdf_text(path: Path) -> str:
    with path.open("rb") as handle:
        reader = PdfReader(handle)
        all_text: list[str] = []
        for page in reader.pages:
            extracted = page.extract_text() or ""
            if extracted:
                all_text.append(extracted)
    return normalize_text(" ".join(all_text))


def tokenize_words(text: str) -> list[str]:
    return WORD_PATTERN.findall(text)


def required_file_for_text_id(text_id: str) -> Path:
    if text_id == "calibration":
        return CALIBRATION_FILE
    text = TEXT_MAP.get(text_id)
    if not text:
        raise KeyError(f"Unknown text id: {text_id}")
    return PDF_FOLDER / text["filename"]


def words_for_text_id(text_id: str) -> list[str]:
    if text_id in WORD_CACHE:
        return WORD_CACHE[text_id]

    source = required_file_for_text_id(text_id)
    if not source.exists():
        raise FileNotFoundError(f"Missing source PDF: {source}")

    text = extract_pdf_text(source)
    words = tokenize_words(text)
    if not words:
        raise ValueError(f"No extractable words in PDF: {source.name}")

    WORD_CACHE[text_id] = words
    return words


def build_segment_plan() -> list[dict[str, Any]]:
    segments: list[dict[str, Any]] = []
    for text_index, item in enumerate(TEXTS, start=1):
        for order_in_text, fmt in enumerate(item["order"], start=1):
            segments.append(
                {
                    "segmentId": f"t{text_index}_{fmt}",
                    "textId": item["id"],
                    "textIndex": text_index,
                    "textTitle": item["title"],
                    "textAuthor": item["author"],
                    "format": fmt,
                    "orderInText": order_in_text,
                }
            )
    return segments


SEGMENT_PLAN = build_segment_plan()
EXPECTED_SEGMENT_IDS = [segment["segmentId"] for segment in SEGMENT_PLAN]


def session_path(session_id: str) -> Path:
    return SESSIONS_DIR / f"{session_id}.json"


def load_session(session_id: str) -> dict[str, Any]:
    path = session_path(session_id)
    if not path.exists():
        raise FileNotFoundError(f"Unknown session id: {session_id}")
    return json.loads(path.read_text(encoding="utf-8"))


def save_session(data: dict[str, Any]) -> None:
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    path = session_path(data["sessionId"])
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def validate_segments(segments: Any) -> tuple[bool, str]:
    if not isinstance(segments, list):
        return False, "segments must be an array"
    if len(segments) != len(EXPECTED_SEGMENT_IDS):
        return False, f"segments must contain {len(EXPECTED_SEGMENT_IDS)} records"

    for index, expected in enumerate(SEGMENT_PLAN):
        actual = segments[index]
        if not isinstance(actual, dict):
            return False, f"segment #{index + 1} must be an object"

        actual_id = str(actual.get("segmentId", ""))
        if actual_id != expected["segmentId"]:
            return False, f"segment order mismatch at position {index + 1}: expected {expected['segmentId']}"

        for required_key in [
            "textIndex",
            "textTitle",
            "format",
            "orderInText",
            "comprehensionScore",
            "startedAtUtc",
            "finishedAtUtc",
            "durationSeconds",
        ]:
            if required_key not in actual:
                return False, f"missing {required_key} in segment {actual_id}"

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
        texts = []
        for item in TEXTS:
            texts.append(
                {
                    "id": item["id"],
                    "title": item["title"],
                    "author": item["author"],
                    "pdfUrl": f"/pdf/{item['id']}",
                    "order": item["order"],
                    "checklistId": item["checklistId"],
                    "checklistLabel": item["checklistLabel"],
                }
            )

        return jsonify(
            {
                "schemaVersion": SCHEMA_VERSION,
                "calibration": {
                    "sourceFile": CALIBRATION_FILE.name,
                    "baseWpm": BASE_WPM,
                    "minWpm": CALIBRATION_MIN_WPM,
                    "maxWpm": CALIBRATION_MAX_WPM,
                    "stepWpm": CALIBRATION_STEP_WPM,
                },
                "texts": texts,
                "segmentPlan": SEGMENT_PLAN,
                "familiarityItems": [
                    {"id": item["checklistId"], "label": item["checklistLabel"]} for item in TEXTS
                ],
            }
        )

    @app.get("/api/calibration/words")
    def calibration_words() -> tuple[Any, int] | Any:
        try:
            words = words_for_text_id("calibration")
        except (FileNotFoundError, ValueError) as error:
            return jsonify({"error": str(error)}), 400
        except Exception:
            return jsonify({"error": "Failed to parse calibration PDF"}), 400

        return jsonify(
            {
                "textId": "calibration",
                "sourceFile": CALIBRATION_FILE.name,
                "wordCount": len(words),
                "words": words,
            }
        )

    @app.get("/api/text/<text_id>/words")
    def text_words(text_id: str) -> tuple[Any, int] | Any:
        if text_id not in TEXT_MAP:
            return jsonify({"error": f"Unknown text id: {text_id}"}), 404

        item = TEXT_MAP[text_id]
        try:
            words = words_for_text_id(text_id)
        except (FileNotFoundError, ValueError) as error:
            return jsonify({"error": str(error)}), 400
        except Exception:
            return jsonify({"error": "Failed to parse source PDF"}), 400

        return jsonify(
            {
                "textId": text_id,
                "title": item["title"],
                "wordCount": len(words),
                "words": words,
            }
        )

    @app.get("/pdf/<text_id>")
    def serve_pdf(text_id: str) -> tuple[Any, int] | Any:
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

        return send_from_directory(source.parent, source.name, as_attachment=False)

    @app.post("/api/session/start")
    def start_session() -> tuple[Any, int] | Any:
        payload = request.get_json(silent=True) or {}
        participant_name = str(payload.get("participantName", "")).strip()
        if not participant_name:
            return jsonify({"error": "participantName is required"}), 400

        session_id = str(uuid.uuid4())
        now = utc_now_iso()
        record = {
            "schemaVersion": SCHEMA_VERSION,
            "sessionId": session_id,
            "status": "in_progress",
            "createdAtUtc": now,
            "updatedAtUtc": now,
            "participant": {
                "name": participant_name,
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
        record["calibration"] = {
            "sourcePdf": CALIBRATION_FILE.name,
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
