# MVP Plan

## Implementation Milestones
1. Build welcome gate with required participant name and immediate persistence.
2. Build calibration ramp from `pdf_start.pdf` (`+5 WPM / 2s`) with desktop/mobile stop controls.
3. Build deterministic 5-text runner with locked format matrix and per-segment hidden timers.
4. Build transition screens with progress text and explicit continue action.
5. Build mandatory familiarity checklist before feedback.
6. Build mandatory final feedback submission and end-of-session confirmation.
7. Persist complete session JSON using schema in `docs/13_data_schema.md`.

## Recommended Build Order
1. Data model and session-state machine.
2. Calibration engine and controls.
3. Segment engine (`words` + `pdf`) and hidden timing.
4. Transition UX and progress.
5. Checklist + feedback.
6. Export/save layer and validation.

## Definition Of Done (MVP)
- Full session can be completed on desktop and mobile.
- All 10 reading segments are timed and saved.
- Checklist + feedback are mandatory and persisted.
- Output JSON validates against required fields.
- No legacy fields like email remain.

## Documentation And Git Workflow
- Docs are English-only.
- UI buttons are English-only.
- After every meaningful change:
  - update relevant docs,
  - append `docs/09_change_log.md`,
  - commit locally immediately.
- Push to GitHub is manual by project owner.
- After each change, check whether `README.md` needs correction:
  - only fix existing sections when needed,
  - do not add new README sections unless requested by owner.
