# Tech Stack And Integrations

## Runtime Stack
- Backend: Flask.
- PDF text extraction: `pypdf`.
- Frontend: browser UI with desktop + mobile controls.
- Persistence: JSON files.

## Study Assets
- Calibration PDF: `pdf_start.pdf` in repository root.
- Corpus folder: `pdf_folder/` with 4 predefined test PDFs.
- Each corpus PDF is split into logical part 1 / part 2 at runtime for segment assignment.
- Corpus is fixed for this study iteration.

## One-Word Processing Contract
- Extract text from PDF pages.
- Clean extraction artifacts before playback:
  - remove null-byte garbage,
  - merge hard line-wrap hyphenation,
  - normalize spaced compounds,
  - drop page-number-only lines.
- Normalize whitespace.
- Tokenize by word boundaries including punctuation separation.
- Drive rendering by WPM timing, not by character count.

## Timing And State Model
- Hidden stopwatch objects for each reading segment.
- Stopwatch values persisted per segment and associated with:
  - participant ID/session ID,
  - text ID,
  - format (`words` or `pdf`),
  - comprehension score (`1..5`),
  - start/end timestamps and duration.
- Transition and UI control events can also be logged for auditability.

## Output Storage
- Save one session record in JSON.
- Store session files under participant-readable filenames when available; keep `sessionId` as the stable record identifier.
- Required payload groups:
  - participant metadata,
  - calibration result,
  - per-segment timings,
  - familiarity checklist,
  - final feedback,
  - completion status.
- Full target schema is in `docs/13_data_schema.md`.

## Localization Rules
- Buttons and controls: English.
- Reading corpus: Russian text.
- Documentation: English.

## Operational Constraints
- No email collection.
- No hidden auto-push to GitHub.
- Every meaningful product change must update docs and change log, then commit.

## Deployment Cache Safety
- Serve `/` and `/api/*` responses with no-cache headers to avoid stale protocol/UI behavior behind tunnels/CDN.
- Add versioned static asset URLs (`app.js`, `styles.css`) from server-side template render to force clients to fetch latest frontend code after deploy.
