# Solution Scope

## Proposed Solution
- Replace the previous product flow with a research-oriented multi-screen test sequence.

## In Scope
- A `PDF folder` containing 6 test PDFs.
- A calibration source file (`start.pdf`) for speed selection.
- Screen 1 (welcome):
  - thank-you message for joining the study,
  - required participant name field,
  - `Start` button disabled until name is filled,
  - participant name saved immediately.
- Calibration screen:
  - one-word playback from `start.pdf`,
  - speed auto-increases by `+5 WPM` every `2 seconds`,
  - participant stops at comfortable speed (`Space` desktop / `STOP` mobile),
  - selected WPM saved.
- Test sequence for 6 texts with predefined order:
  1. Jump (Tolstoy): words -> PDF
  2. Frog Traveler (Garshin): PDF -> words
  3. Black Man (Yesenin): words -> PDF
  4. Myth of the Cave (Plato): PDF -> words
  5. Macintosh Presentation: words -> PDF
  6. Heart Article: words -> PDF (latest spoken instruction)
- Hidden stopwatch for every reading segment (not visible to participant).
- Transition screens between segments/texts with:
  - `Continue Test` button,
  - message like `Format of the next text: PDF, one word at a time.`
- Completion button after each reading segment (`I finished`).
- Pre-feedback familiarity screen (after all tests, before feedback):
  - question: whether participant has read the listed works before,
  - checkbox list for all 6 items.
- Final feedback screen:
  - free-text feedback box,
  - no email collection.
- Save results as JSON.

## Out Of Scope
- Email capture.
- Authentication.
- Public dashboards.

## First-Release Success Criteria
- Participant can complete the full research flow without dead-ends.
- All key values are saved: participant name, selected WPM, per-segment timings, checklist choices, final feedback.
- Buttons remain in English across desktop and mobile.
