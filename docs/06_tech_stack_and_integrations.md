# Tech Stack And Integrations

## Runtime Stack
- Backend: Flask.
- PDF text extraction: `pypdf`.
- English PDF generation: `reportlab`.
- Frontend: single browser UI with desktop + mobile controls.
- Persistence: JSON files.

## Study Assets
- Russian calibration PDF: `pdf_start.pdf` in repository root.
- Russian study corpus folder: `pdf_folder/` with 4 predefined PDFs.
- English study text assets: `corpus/en/`.
- English PDF assets are generated at runtime from tracked English text files.
- Russian corpus remains PDF-first for this study iteration.
- Corpus is fixed for this study iteration.

## One-Word Processing Contract
- Russian mode:
  - extract text from PDF pages,
  - clean extraction artifacts before playback,
  - normalize whitespace,
  - tokenize by word boundaries including punctuation separation.
- English mode:
  - load canonical tracked text assets directly,
  - tokenize the same text assets used for generated English PDFs,
  - avoid PDF extraction in the one-word pipeline.
- Playback timing is WPM-driven, never character-driven.

## English Source Provenance
- `jump`: English web source used to align the story text.
- `frog_traveler`: English web source used to align the story text.
- `myth_of_the_cave`: Project Gutenberg public-domain text.
- `heart_article`: translated locally for this study because no matching English source was available.
- English calibration text is internal study asset, not part of the measured 4-text corpus.

## Timing And State Model
- Hidden stopwatch objects for each reading segment.
- Stopwatch values persisted per segment and associated with:
  - participant/session ID,
  - selected language,
  - text ID,
  - format (`words` or `pdf`),
  - comprehension score (`1..5`),
  - start/end timestamps and duration.

## Output Storage
- Save one session record in JSON.
- Store session files under participant-readable filenames when available; keep `sessionId` as the stable record identifier.
- Required payload groups:
  - participant metadata,
  - language,
  - calibration result,
  - per-segment timings,
  - familiarity checklist,
  - final feedback,
  - completion status.
- Full target schema is in `docs/13_data_schema.md`.

## Localization Rules
- Documentation: English only.
- UI copy: localized at session start (`ru` or `en`).
- Reading assets: localized at session start (`ru` or `en`).
- Study structure and data contract: invariant across languages.

## Operational Constraints
- No email collection.
- No hidden auto-push to GitHub.
- Every meaningful product change must update docs and change log, then commit.

## Deployment Cache Safety
- Serve `/` and `/api/*` responses with no-cache headers to avoid stale protocol/UI behavior behind tunnels/CDN.
- Add versioned static asset URLs (`app.js`, `styles.css`) from server-side template render to force clients to fetch latest frontend code after deploy.
- Runtime-generated English PDFs are stored under `data/generated_pdfs/` and can be safely regenerated.
