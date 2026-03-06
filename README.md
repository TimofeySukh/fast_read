# fast_read

Read PDF text one word at a time with configurable speed (`WPM`), short focus breaks, and built-in feedback capture.

## Features

- Upload a PDF and extract text for reading.
- One-word-at-a-time playback (word boundary = whitespace).
- Speed control in words per minute (`100 WPM` default).
- Automatic 3-second break every minute of active playback.
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

1. Upload a PDF.
2. Set speed in WPM.
3. Click `Start Reading` and follow the 3-second countdown.

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
