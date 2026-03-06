from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, render_template, request
from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
RESPONSES_DIR = DATA_DIR / "responses"
ALLOWED_EXTENSIONS = {".pdf"}
DEFAULT_PDF_PATH = Path("/home/tim/PDFs/pdf_start.pdf")
WORD_PATTERN = re.compile(r"[^\W_]+(?:['’`-][^\W_]+)*", re.UNICODE)


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def extract_pdf_text(reader: PdfReader) -> str:
    page_text: list[str] = []
    for page in reader.pages:
        extracted = page.extract_text() or ""
        if extracted:
            page_text.append(extracted)
    return normalize_text(" ".join(page_text))


def count_words(text: str) -> int:
    return len(WORD_PATTERN.findall(text))


def validate_feedback_payload(payload: dict[str, Any]) -> tuple[bool, str]:
    required = ["nickname", "email", "speedWpm", "speedFeeling", "feedback"]
    for field in required:
        if field not in payload:
            return False, f"Missing required field: {field}"

    nickname = str(payload["nickname"]).strip()
    email = str(payload["email"]).strip()
    feedback = str(payload["feedback"]).strip()
    speed_feeling = str(payload["speedFeeling"]).strip()

    if not nickname:
        return False, "Nickname is required"
    if not email or "@" not in email:
        return False, "Valid email is required"
    if speed_feeling not in {"too_slow", "normal", "too_fast", "custom"}:
        return False, "Invalid speed feeling value"
    if speed_feeling == "custom" and not str(payload.get("speedFeelingCustom", "")).strip():
        return False, "Custom speed feeling text is required"
    if not feedback:
        return False, "Feedback is required"

    try:
        speed = int(payload["speedWpm"])
    except (TypeError, ValueError):
        return False, "speedWpm must be an integer"

    if speed < 1 or speed > 1000:
        return False, "speedWpm must be between 1 and 1000"

    return True, ""


def save_feedback(payload: dict[str, Any]) -> str:
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)

    record_id = f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}_{uuid.uuid4().hex[:8]}"
    record = {
        "id": record_id,
        "submittedAtUtc": datetime.now(timezone.utc).isoformat(),
        "nickname": str(payload["nickname"]).strip(),
        "email": str(payload["email"]).strip(),
        "speedWpm": int(payload["speedWpm"]),
        "speedFeeling": str(payload["speedFeeling"]).strip(),
        "speedFeelingCustom": str(payload.get("speedFeelingCustom", "")).strip(),
        "feedback": str(payload["feedback"]).strip(),
        "sourceFile": str(payload.get("sourceFile", "")).strip(),
        "wordCount": int(payload.get("wordCount", 0) or 0),
    }

    out_path = RESPONSES_DIR / f"{record_id}.json"
    out_path.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
    return record_id


def create_app() -> Flask:
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.config["MAX_CONTENT_LENGTH"] = 25 * 1024 * 1024

    @app.get("/")
    def index() -> str:
        return render_template("index.html")

    @app.post("/api/upload-pdf")
    def upload_pdf() -> tuple[Any, int] | Any:
        if "file" not in request.files:
            return jsonify({"error": "Missing file"}), 400

        file = request.files["file"]
        original_name = str(file.filename or "").strip()
        suffix = Path(original_name).suffix.lower()

        if not original_name:
            return jsonify({"error": "File name is empty"}), 400
        if suffix not in ALLOWED_EXTENSIONS and file.mimetype != "application/pdf":
            return jsonify({"error": "Only PDF files are allowed"}), 400

        try:
            text = extract_pdf_text(PdfReader(file.stream))
        except Exception:
            return jsonify({"error": "Failed to parse PDF"}), 400

        if not text:
            return jsonify(
                {"error": "No extractable text found in this PDF (it may be a scanned/image PDF)."}
            ), 400

        word_count = count_words(text)

        return jsonify(
            {
                "fileName": original_name,
                "text": text,
                "textLength": len(text),
                "wordCount": word_count,
            }
        )

    @app.post("/api/default-pdf")
    def default_pdf() -> tuple[Any, int] | Any:
        if not DEFAULT_PDF_PATH.exists():
            return jsonify({"error": f"Default PDF not found: {DEFAULT_PDF_PATH}"}), 404

        try:
            with DEFAULT_PDF_PATH.open("rb") as handle:
                text = extract_pdf_text(PdfReader(handle))
        except Exception:
            return jsonify({"error": "Failed to parse default PDF"}), 400

        if not text:
            return jsonify(
                {"error": "No extractable text found in default PDF (it may be a scanned/image PDF)."}
            ), 400

        return jsonify(
            {
                "fileName": DEFAULT_PDF_PATH.name,
                "text": text,
                "textLength": len(text),
                "wordCount": count_words(text),
                "isDefaultFile": True,
            }
        )

    @app.post("/api/feedback")
    def feedback() -> tuple[Any, int] | Any:
        payload = request.get_json(silent=True) or {}
        ok, error = validate_feedback_payload(payload)
        if not ok:
            return jsonify({"error": error}), 400

        record_id = save_feedback(payload)
        return jsonify({"ok": True, "recordId": record_id})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
