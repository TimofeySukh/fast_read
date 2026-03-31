# Features

## P0 Functional Requirements
- `F-01` Language gate:
  - participant must choose `ru` or `en` before the study starts,
  - selected language determines UI copy and reading assets for the whole session.
- `F-02` Welcome gate:
  - participant name is required,
  - `Start` disabled until name is non-empty,
  - participant name is persisted immediately.
- `F-03` Calibration:
  - one-word mode,
  - manual WPM controls (`±5/10/20/50/100`) and direct numeric input,
  - allowed WPM range `50..700`,
  - confirm by `Continue` (desktop `Space` shortcut allowed),
  - selected WPM persisted,
  - source is localized:
    - Russian -> `pdf_start.pdf`,
    - English -> generated PDF from tracked English calibration text.
- `F-04` Test runner:
  - exactly 4 texts,
  - each text is split into part 1 and part 2,
  - exactly 2 segments per text,
  - locked order matrix from scope doc,
  - identical structure across languages.
- `F-05` Segment completion:
  - one-word segments end automatically at the end of the text,
  - PDF segments end with explicit `I finished`.
- `F-06` Hidden timing:
  - stopwatch starts at segment display start,
  - stopwatch stops at segment completion,
  - timer values saved and never displayed.
- `F-07` Transition screens:
  - shown between all segments,
  - include progress + next-format message,
  - include mandatory comprehension score selection (`1..5`) for each finished segment,
  - include `Continue` (plus desktop `Space` shortcut).
- `F-08` One-word playback:
  - pace is WPM-based,
  - words are split by whitespace and punctuation,
  - no character-based stepping,
  - no forced periodic breaks,
  - show per-segment progress bar above the word display area,
  - do not show this progress bar during calibration,
  - Russian mode cleans extracted PDF text before tokenization,
  - English mode uses canonical text assets directly for tokens.
- `F-09` Runtime controls:
  - desktop `Space` pause/resume for one-word reading,
  - mobile on-screen pause/resume equivalent.
- `F-10` Familiarity checklist (mandatory before feedback):
  - 4 listed works with checkboxes,
  - labels localized to selected language.
- `F-11` Feedback:
  - required free-text feedback field,
  - no email collection.
- `F-12` Persistence:
  - save complete session as JSON,
  - persist selected study language,
  - use participant-readable filenames for session files instead of opaque random filenames when possible.
- `F-13` Completion summary:
  - show a compact end-of-session result block,
  - do not dump the full raw dataset on screen.
- `F-14` English PDF delivery:
  - English PDFs are generated at runtime from tracked English text assets,
  - English word playback must stay consistent with those same text assets.

## P1 Quality Requirements
- `Q-01` Mobile and desktop parity for all required actions.
- `Q-02` Clear progress status (`Text X of 4` and segment context).
- `Q-03` Russian mode must remain behaviorally stable while English mode is added.
- `Q-04` Language switch at entry must not alter study order, timing model, or data schema shape.

## P2 Analysis Helpers
- `A-01` Add summary helper for per-format timing comparison by participant.
- `A-02` Add corpus-level aggregate export for offline analysis.

## Acceptance Checklist
- Docs are English-only.
- UI and reading assets switch correctly between Russian and English.
- After every meaningful change:
  - relevant docs are updated,
  - `docs/09_change_log.md` is appended,
  - local commit is created.
