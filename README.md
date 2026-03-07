# fast_read

`fast_read` is a reading-format project built for **research purposes**.

It is used to compare reading behavior across formats and collect study data.

## What This Repository Contains
- Web app backend (Flask) and frontend flow for reading sessions.
- PDF text extraction pipeline for one-word mode.
- Session logging to JSON for later analysis.

## Branch Map
```text
main
├── main-idea
│   └── main-idea-rus  (current primary research branch)
```

- `main`: ready product branch where users can upload PDF and read by letters.
- `main-idea`: first research implementation in English.
- `main-idea-rus`: current main branch for collecting data in the research flow.

## Features (main-idea-rus)
- Participant onboarding and calibration.
- Fixed study flow with alternating `words` / `pdf` reading segments.
- Hidden per-segment timing.
- Mandatory familiarity checklist and final feedback.
- JSON session save in `data/sessions/`.

## Installation
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Quickstart
```bash
python3 app.py
```

Open: `http://127.0.0.1:5000`

## Common Branch Workflows
Run current research branch:
```bash
git checkout main-idea-rus
python3 app.py
```

Run stable product branch:
```bash
git checkout main
python3 app.py
```

## Contributing
- Open an issue or PR with a clear scope.
- Keep docs in sync with meaningful behavior changes.
- Create a local commit for each meaningful change.

## License
License is not specified yet.
