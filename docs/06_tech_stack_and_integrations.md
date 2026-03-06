# Tech Stack And Integrations

## Stack Preferences
- Product format: web application.
- Interface language: English only.
- Code language (comments, tests, technical notes): English.

## Integrations
- PDF parsing for text extraction.
- File-based storage of user responses in the project directory (local storage for MVP).
- Built-in default source PDF at project root: `./pdf_start.pdf` when no file is selected.

## Constraints
- `Assumption:` MVP runs without an external DB, using local file storage.
- Support for at least light/dark themes is required.
- Speed unit is fixed: `words per minute (WPM)`.
- Default value: `100 WPM`.
- Text playback must be word-based, where a word is determined by punctuation or whitespace boundary.
- Speed changes during reading must update playback interval without restarting the session.
- Pause/resume control is bound to the `Space` key during reading.

## TBD
- Specific frontend framework.
- Specific backend/runtime choice.
- Response storage format (JSON/CSV/SQLite).
