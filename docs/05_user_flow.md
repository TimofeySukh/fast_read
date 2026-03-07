# User Flow

## Main Flow
1. Participant opens the app.
2. Welcome screen asks for participant name.
3. Participant enters name; `Start` becomes enabled.
4. Name is saved.
5. Calibration starts from `start.pdf` in one-word mode.
6. Speed increases by +5 WPM every 2 seconds.
7. Participant stops at comfortable speed (`Space` desktop / `STOP` mobile).
8. Selected WPM is saved.
9. Short prepare screen appears.
10. Reading tests run through all 6 texts with predefined format order.
11. For each reading segment, hidden stopwatch is captured.
12. After each segment, participant taps `I finished`.
13. Between segments, transition screen appears with `Continue Test` and next-format text.
14. After all tests, participant sees familiarity checklist for:
- Jump (Tolstoy)
- Frog Traveler (Garshin)
- Myth of the Cave (Plato)
- Black Man (Yesenin)
- Macintosh Presentation
- Heart Article
15. Participant selects checkboxes.
16. Final feedback box appears.
17. Participant submits feedback.
18. System saves all results to JSON.

## Alternate Flows
- Mobile users use on-screen controls instead of keyboard input.
- Participant leaves feedback empty: system should validate according to product decision.

## Edge Cases
- Missing or invalid PDF file in test set.
- Participant closes page mid-test.
- Conflicting format sequence instructions (see open questions).
