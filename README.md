# fast_read

Research web app for comparing two reading formats on a fixed 6-text corpus:
- one-word-at-a-time mode,
- normal PDF reading mode.

## What It Does
- Collects participant name (required).
- Runs calibration from `pdf_start.pdf` (`+5 WPM` every `2s`, stop at comfortable speed).
- Runs 6 texts in locked alternating format order.
- Measures hidden timing for each segment.
- Collects mandatory familiarity checklist and mandatory feedback.
- Saves one JSON session record to `data/sessions/`.

## Run
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000`.

## Notes
- Buttons are English by design.
- Study corpus PDFs are read from `pdf_folder/`.
- This project commits changes locally; GitHub push is manual.
