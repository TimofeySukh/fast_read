# Tech Stack And Integrations

## Stack Preferences
- Product format: web application.
- Interface language: English only.
- Code language (comments, tests, technical notes): English.

## Integrations
- PDF parsing for text extraction.
- File-based storage of user responses in the project directory (local storage for MVP).

## Constraints
- `Assumption:` MVP runs without an external DB, using local file storage.
- Support for at least light/dark themes is required.
- Speed unit is fixed: `words per minute (WPM)`.
- Default value: `100 WPM`.
- Text playback must be word-based, where a word is determined by whitespace boundary.

## TBD
- Specific frontend framework.
- Specific backend/runtime choice.
- Response storage format (JSON/CSV/SQLite).
