# fast_read

Read PDF text one word at a time with configurable speed (`WPM`) and built-in feedback capture.

## Features

- Upload a PDF and extract text for reading (or use default `pdf_start.pdf` when no file is selected).
- One-word-at-a-time playback (word boundary = punctuation or whitespace).
- Speed control in words per minute (`100 WPM` default).
- Speed can be changed during reading.
- Pause/resume playback via on-screen `Pause/Resume` button (mobile-friendly), or `Space` on desktop.
- 3-step feedback form after reading.
- Local feedback storage as JSON files in `data/responses/`.

## Installation

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Quickstart

```bash
python app.py
```

Open `http://127.0.0.1:5000`.

## Usage

### 1) Start a reading session

1. Upload a PDF (optional: skip upload to use default `pdf_start.pdf`).
2. Set speed in WPM.
3. Click `Start Reading` (PDF is validated/parsed here), then follow the 3-second countdown.
4. During reading, you can change WPM and pause/resume via button (or `Space` on desktop).

### 2) Submit feedback

1. Complete nickname and email.
2. Select how speed felt.
3. Submit final feedback text.

A thank-you table is shown after successful submit.

### 3) Check saved feedback locally

```bash
ls -1 data/responses/*.json
```

## Development

Run a quick backend syntax check:

```bash
python -m py_compile app.py
```

## Contributing

Issues and pull requests are welcome.

1. Create a feature branch.
2. Make changes.
3. Verify the app runs locally.
4. Open a PR with a short description of what changed.

## License

No license file is configured yet.
