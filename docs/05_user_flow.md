# User Flow

## End-To-End Main Flow
1. Participant opens the app.
2. Welcome screen shows study intro and required name input.
3. Participant enters name.
4. `Start` becomes enabled only after non-empty name.
5. Name is persisted immediately.
6. Calibration screen starts from `pdf_start.pdf` in one-word mode.
7. Participant adjusts speed manually with quick-step buttons and direct input.
8. Participant confirms comfortable speed:
   - desktop: `Space` or `Continue`,
   - mobile: `Continue`.
9. Selected WPM is persisted.
10. Prepare screen appears before first text.
11. Text sequence starts and follows locked alternation:
   - text 1: words then PDF,
   - text 2: PDF then words,
   - text 3: words then PDF,
   - text 4: PDF then words.
12. For each segment:
   - hidden stopwatch starts on segment render,
   - participant reads,
   - one-word segments show a progress bar above the word display,
   - one-word segments auto-complete only after final word is shown,
   - PDF segments are completed by pressing `I finished`,
   - stopwatch stops and duration is saved.
13. Between segments and texts:
   - transition screen shows progress,
   - next format is announced,
   - participant selects comprehension score `1..5` for the just-finished segment,
   - participant continues by `Continue` (desktop `Space` shortcut allowed).
14. After all 8 reading segments are complete, familiarity checklist screen opens.
15. Participant marks familiarity for all 4 listed works.
16. Feedback screen opens.
17. Participant enters mandatory feedback text.
18. Participant submits.
19. Full session record is saved as JSON.
20. Thank-you confirmation is shown.

## Device-Specific Interaction Rules
- Desktop:
  - `Space` is used for calibration confirm and transition continue.
  - `Space` also controls pause/resume in one-word reading mode.
- Mobile:
  - every keyboard action has an on-screen button equivalent.

## Validation Rules
- Name cannot be empty.
- Feedback cannot be empty.
- One-word segments cannot be manually finished early.
- PDF segments require explicit `I finished`.

## Failure / Recovery Notes
- If required corpus PDF is missing, session enters recoverable error state with explicit message.
- If session is interrupted, partial state should be marked and stored (status not completed).
