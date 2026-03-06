# Solution Scope

## Proposed Solution
- Build a website with two main stages: fast text playback from PDF and post-session feedback collection.

## In Scope
- PDF selection with fallback to default file `pdf_start.pdf`.
- Text playback speed selection in `WPM` (default: `100`).
- Light/dark theme switch.
- `Start Reading` button validates/parses selected PDF (or default PDF) and starts flow.
- Minimal `3..1` countdown screen before playback starts.
- One-word-at-a-time text playback split by punctuation or whitespace boundaries.
- Speed can be updated while reading, and playback interval updates accordingly.
- Pause/resume playback on `Space` key press.
- Post-reading form:
  - nickname + email;
  - speed rating (too slow / normal / too fast / custom);
  - free-text feedback.
- Saving user responses in project-local file storage.
- `Thank you for your time` screen with a summary table after form submission.

## Out Of Scope
- User authentication.
- Personal account and session history in UI.
- Advanced analytics or dashboards.
- Mobile apps.

## First-Release Success Criteria
- The user can complete the full cycle: PDF upload -> reading -> form submission.
- All required feedback fields are saved and available for analysis.
- After submission, the user sees a confirmation in the form of a thank-you summary table.
