# Project Summary

## Objective
Build a controlled reading research app that compares two reading formats on a fixed 4-text corpus:
- one-word-at-a-time playback,
- normal PDF page reading.

The study now supports two participant-facing language variants:
- Russian UI + Russian corpus,
- English UI + English corpus.

## Study Constants
- Exactly 4 texts are used in one session.
- Each text is split into 2 logical parts.
- Each part is shown once in one format (8 measured reading segments total).
- Segment order alternates by text (`words -> PDF`, then `PDF -> words`, repeating).
- Calibration is done once at the beginning.
- Calibration speed is selected manually by participant (`50..700`, with quick-step controls).
- Final selected WPM is fixed for all one-word segments in that session.
- The language selected at entry determines both UI copy and reading assets for the whole session.

## Required Data Output
- Participant name.
- Selected study language.
- Calibration result (selected WPM and stop method).
- Timing for every reading segment (hidden stopwatch, never visible in UI).
- Comprehension score (`1..5`) for every finished segment.
- Segment order and text IDs.
- Pre-feedback familiarity checklist answers (4 required items).
- Final mandatory free-text feedback.
- All persisted in JSON.

## Language Rules
- Documentation must stay English.
- UI copy is localized by the participant's selected language.
- Reading assets are localized by the participant's selected language.
- Study order, timing, and data contract must remain identical across languages.

## Operational Rules
- After each meaningful change:
  - update relevant docs files,
  - append one short entry to `docs/09_change_log.md`,
  - create a local git commit immediately.
- Push to GitHub is manual by project owner.
