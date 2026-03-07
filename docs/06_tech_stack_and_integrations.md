# Tech Stack And Integrations

## Stack Preferences
- Web application.
- Russian text content for reading tasks.
- English labels for all buttons and operational UI controls.
- English-only project documentation.

## Data And Storage
- Persist research results as JSON.
- Store:
  - participant name,
  - selected comfortable WPM,
  - timing per segment,
  - segment format order,
  - familiarity checklist values,
  - final feedback.

## Input Assets
- `PDF folder` with 6 study texts.
- `start.pdf` for speed calibration.

## Constraints
- Hidden stopwatch must never be visible to participant.
- Mobile must provide button-based equivalents for keyboard actions.
- No email collection in this version.
- Change tracking must go to `docs/09_change_log.md`.

## TBD
- Exact JSON schema versioning.
- Recovery behavior for interrupted sessions.
