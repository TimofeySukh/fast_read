# User Flow

## End-To-End Main Flow
1. Participant opens the app.
2. Language screen appears first.
3. Participant chooses `Russian` or `English`.
4. UI copy and study assets are loaded for the selected language.
5. Welcome screen shows study intro and required name input.
6. Participant enters name.
7. `Start` becomes enabled only after non-empty name.
8. Name and language are persisted immediately.
9. Calibration screen starts in one-word mode.
10. Participant adjusts speed manually with quick-step buttons and direct input.
11. Participant confirms comfortable speed:
   - desktop: `Space` or `Continue`,
   - mobile: `Continue`.
12. Selected WPM is persisted.
13. Prepare screen appears before first text.
14. Text sequence starts and follows locked alternation:
   - text 1: part 1 in words, part 2 in PDF,
   - text 2: part 1 in PDF, part 2 in words,
   - text 3: part 1 in words, part 2 in PDF,
   - text 4: part 1 in PDF, part 2 in words.
15. For each segment:
   - hidden stopwatch starts on segment render,
   - participant reads,
   - one-word segments show a progress bar above the word display,
   - one-word segments auto-complete only after final word is shown,
   - PDF segments are completed by pressing `I finished`,
   - stopwatch stops and duration is saved.
16. Between segments and texts:
   - transition screen shows progress,
   - next format is announced,
   - participant selects comprehension score `1..5` for the just-finished segment,
   - participant continues by `Continue` (desktop `Space` shortcut allowed).
17. After all 8 reading segments are complete, familiarity checklist screen opens.
18. Participant marks familiarity for all 4 listed works.
19. Feedback screen opens.
20. Participant enters mandatory feedback text.
21. Participant submits.
22. Full session record is saved as JSON.
23. Thank-you confirmation is shown with a short session summary (not full raw data).

## Device-Specific Interaction Rules
- Desktop:
  - `Space` is used for calibration confirm and transition continue.
  - `Space` also controls pause/resume in one-word reading mode.
- Mobile:
  - every keyboard action has an on-screen button equivalent.

## Validation Rules
- Language must be selected before the protocol loads.
- Name cannot be empty.
- Feedback cannot be empty.
- One-word segments cannot be manually finished early.
- PDF segments require explicit `I finished`.

## Failure / Recovery Notes
- If a required corpus asset is missing for the selected language, session enters recoverable error state with explicit message.
- If session is interrupted, partial state should be marked and stored (status not completed).
