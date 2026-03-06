# User Flow

## Main Flow
1. The user opens the website.
2. The user sees `Upload PDF`, `Select Speed`, and the theme toggle.
3. The user can upload a PDF, or skip file selection and use default `pdf_start.pdf`.
4. The user selects WPM or keeps the default `100`.
5. The user clicks `Start Reading` (PDF is validated/parsed here).
6. The user sees a `3..1` countdown screen (centered numbers only).
7. The user reads text shown one word at a time (split by punctuation or whitespace).
8. The user can adjust WPM during reading.
9. The user can press `Space` to pause or resume playback.
10. After text completion, the feedback form opens.
11. The user fills in nickname/email.
12. The user selects speed rating: too slow / normal / too fast / custom.
13. The user adds free-text feedback.
14. The user submits the form; data is saved.
15. The user sees `Thank you for your time` with a submission summary table.

## Alternate Flows
- The user does not change speed: the default value is used.
- The user selects `custom` and enters their own speed-rating answer.
- The user does not select a file: default `pdf_start.pdf` is used.

## Edge Cases
- PDF cannot be read or has no extractable text.
- The user interrupts the session before reaching the form.
- The user submits the form with missing required fields.
