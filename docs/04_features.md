# Features

## P0
- Upload PDF and extract text for playback, with fallback to default file `pdf_start.pdf`.
- Select playback speed in `words per minute`.
- Default speed value: `100 WPM`.
- Allow speed changes during reading and apply them without restarting the session.
- Toggle light/dark theme.
- `3..1` countdown before reading starts.
- Sequential one-word display (word delimiter: punctuation or whitespace).
- Pause/resume playback on-screen (`Pause/Resume`), plus `Space` shortcut on desktop.
- Feedback form after reading completes.
- Save form results into a project folder.
- Thank-you screen with submitted-data summary table.

## P1
- Email and required-form-field validation.
- Explicit success message after saving feedback.
- Error handling for PDF upload/parsing.

## P2
- Basic analytics for comfortable-speed distribution.
- Export collected feedback to CSV.

## Acceptance Notes
- Saved fields: nickname, email, `speedWpm`, speed rating (or custom answer), general feedback, wordCount.
- Speed changes the interval between words, not line length or number of characters on screen.
