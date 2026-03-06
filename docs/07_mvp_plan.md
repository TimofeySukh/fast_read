# MVP Plan

## Milestones
1. Build base UI: PDF upload, speed selection, theme.
2. Implement word-based playback engine (WPM) and `3..1` countdown.
3. Add mobile-friendly on-screen pause/resume controls and desktop `Space` shortcut.
4. Implement 3-step feedback form.
5. Save form data in project folder and show thank-you summary table.
6. Run basic testing and verify English across UI and code artifacts.

## Delivery Order
1. P0 reading flow functions (upload, parse, speed, playback).
2. P0 feedback collection and storage.
3. P1 reliability and validation.
4. P2 analytics improvements.

## Dependencies And Blockers
- Choose a library/approach for PDF text extraction.
- Finalize acceptable WPM range.
- Decide feedback storage format.

## Team Assumptions
- `Assumption:` MVP can be implemented by one full-stack developer.
- `Assumption:` Minimalist UI design can be implemented without a separate design sprint.

## README Rule After Changes
- After every project change, check whether `README.md` needs corrections.
- Apply only necessary corrections in `README.md`.
- Do not add new README content without a separate user request.

## Git Rule After Changes
- After every project change, immediately create a git commit.
- After each commit, immediately push to GitHub (`main`) unless explicitly told otherwise.
