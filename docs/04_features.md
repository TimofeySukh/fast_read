# Features

## P0 Functional Requirements
- `F-01` Welcome gate:
  - participant name is required,
  - `Start` disabled until name is non-empty,
  - participant name is persisted immediately.
- `F-02` Calibration:
  - source is `pdf_start.pdf`,
  - one-word mode,
  - manual WPM controls (`±5/10/20/50/100`) and direct numeric input,
  - allowed WPM range `50..700`,
  - confirm by `Continue` (desktop `Space` shortcut allowed),
  - selected WPM persisted.
- `F-03` Test runner:
  - exactly 4 texts,
  - exactly 2 segments per text,
  - locked order matrix from scope doc.
- `F-04` Segment completion:
  - one-word segments end automatically at the end of the text,
  - PDF segments end with explicit `I finished`.
- `F-05` Hidden timing:
  - stopwatch starts at segment display start,
  - stopwatch stops at `I finished`,
  - timer values saved and never displayed.
- `F-06` Transition screens:
  - shown between all segments,
  - include progress + next-format message,
  - include mandatory comprehension score selection (`1..5`) for each finished segment,
  - include `Continue` (plus desktop `Space` shortcut).
- `F-07` One-word playback:
  - pace is WPM-based,
  - words are split by whitespace and punctuation,
  - no character-based stepping,
  - no forced periodic breaks,
  - show per-segment progress bar above the word display area,
  - do not show this progress bar during calibration.
- `F-08` Runtime controls:
  - desktop `Space` pause/resume for one-word reading,
  - mobile on-screen pause/resume equivalent.
- `F-09` Familiarity checklist (mandatory before feedback):
  - 4 listed works with checkboxes.
- `F-10` Feedback:
  - required free-text feedback field,
  - no email collection.
- `F-11` Persistence:
  - save complete session as JSON.

## P1 Quality Requirements
- `Q-01` Mobile and desktop parity for all required actions.
- `Q-02` Clear progress status (`Text X of 4` and segment context).
- `Q-03` Recoverable UX for accidental reload/interruption (at minimum save partial state with status flag).

## P2 Analysis Helpers
- `A-01` Add summary helper for per-format timing comparison by participant.
- `A-02` Add corpus-level aggregate export for offline analysis.

## Acceptance Checklist
- Docs are English-only.
- UI button labels are English-only.
- After every meaningful change:
  - relevant docs are updated,
  - `docs/09_change_log.md` is appended,
  - local commit is created.
