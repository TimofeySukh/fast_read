# User Flow

## Main Flow
1. The user opens the website.
2. The user sees `Upload PDF`, `Select Speed`, and the theme toggle.
3. The user uploads a PDF.
4. The user selects WPM or keeps the default `100`.
5. The user starts the session.
6. The user sees a `3..1` countdown screen (centered numbers only).
7. The user reads text shown one word at a time (up to whitespace boundary).
8. Every minute, reading pauses automatically for 3 seconds.
9. After text completion, the feedback form opens.
10. The user fills in nickname/email.
11. The user selects speed rating: too slow / normal / too fast / custom.
12. The user adds free-text feedback.
13. The user submits the form; data is saved.
14. The user sees `Thank you for your time` with a submission summary table.

## Alternate Flows
- The user does not change speed: the default value is used.
- The user selects `custom` and enters their own speed-rating answer.

## Edge Cases
- PDF cannot be read or has no extractable text.
- The user interrupts the session before reaching the form.
- The user submits the form with missing required fields.
