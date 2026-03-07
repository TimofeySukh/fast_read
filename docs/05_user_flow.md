# User Flow

## End-To-End Main Flow
1. Participant opens the app.
2. Welcome screen shows study intro and required name input.
3. Participant enters name.
4. `Start` becomes enabled only after non-empty name.
5. Name is persisted immediately.
6. Calibration screen starts from `pdf_start.pdf` in one-word mode.
7. WPM ramps automatically by `+5` every `2s`.
8. Participant stops at comfortable speed:
   - desktop: `Space`,
   - mobile: `STOP`.
9. Selected WPM is persisted.
10. Prepare screen appears before first text.
11. Text sequence starts and follows locked alternation:
   - text 1: words then PDF,
   - text 2: PDF then words,
   - text 3: words then PDF,
   - text 4: PDF then words,
   - text 5: words then PDF,
   - text 6: PDF then words.
12. For each segment:
   - hidden stopwatch starts on segment render,
   - participant reads,
   - participant presses `I finished`,
   - stopwatch stops and duration is saved.
13. Between segments and texts:
   - transition screen shows progress,
   - next format is announced,
   - participant continues by `Continue Test` (desktop `Space` shortcut allowed).
14. After all 12 reading segments are complete, familiarity checklist screen opens.
15. Participant marks familiarity for all 6 listed works.
16. Feedback screen opens.
17. Participant enters mandatory feedback text.
18. Participant submits.
19. Full session record is saved as JSON.
20. Thank-you confirmation is shown.

## Device-Specific Interaction Rules
- Desktop:
  - `Space` is used for calibration stop and transition continue.
  - `Space` also controls pause/resume in one-word reading mode.
- Mobile:
  - every keyboard action has an on-screen button equivalent.

## Validation Rules
- Name cannot be empty.
- Feedback cannot be empty.
- Segment completion requires explicit `I finished`; no auto-finish.

## Failure / Recovery Notes
- If required corpus PDF is missing, session enters recoverable error state with explicit message.
- If session is interrupted, partial state should be marked and stored (status not completed).
