# MVP Plan

## Milestones
1. Implement welcome + required-name entry and immediate save.
2. Implement calibration flow with +5 WPM every 2 seconds and stop control.
3. Implement 6-text alternating-format test runner with hidden timing capture.
4. Implement transition screens and completion actions.
5. Implement pre-feedback familiarity checklist and final feedback box.
6. Persist all study output into JSON.

## Delivery Order
1. Calibration and control logic.
2. Segment runner and timers.
3. Transition/progress screens.
4. Final checklist + feedback + save pipeline.

## Dependencies And Blockers
- Final confirmation of exact format order for text 6.
- Final naming/location for `PDF folder` and `start.pdf` in deployed environments.

## Documentation And Git Rules
- Documentation must stay in English.
- All button labels must stay in English.
- After every meaningful change:
  - update the appropriate docs file(s),
  - append a short entry to `docs/09_change_log.md`,
  - create a git commit immediately.
- Push to GitHub is manual (performed by project owner), not automatic.
