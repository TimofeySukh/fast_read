# Project Summary

## Objective
Build a controlled reading research app that compares two reading formats on the same Russian-language corpus:
- one-word-at-a-time playback,
- normal PDF page reading.

## Study Constants
- Exactly 6 texts are used in one session.
- Each text is read in both formats (12 measured reading segments total).
- Segment order alternates by text (`words -> PDF`, then `PDF -> words`, repeating).
- Calibration is done once at the beginning from `pdf_start.pdf`.
- Calibration speed ramp is fixed: `+5 WPM` every `2 seconds`.
- Final selected WPM is fixed for all one-word segments in that session.

## Required Data Output
- Participant name.
- Calibration result (selected WPM and stop method).
- Timing for every reading segment (hidden stopwatch, never visible in UI).
- Segment order and text IDs.
- Pre-feedback familiarity checklist answers (6 required items).
- Final mandatory free-text feedback.
- All persisted in JSON.

## Language Rules
- Buttons and controls in UI must be English.
- Research content can stay Russian-language (texts themselves).
- Project documentation must be English.

## Operational Rules
- After each meaningful change:
  - update relevant docs files,
  - append one short entry to `docs/09_change_log.md`,
  - create a local git commit immediately.
- Push to GitHub is manual by project owner.
