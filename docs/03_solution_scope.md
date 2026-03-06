# Solution Scope

## Proposed Solution
- Build a website with two main stages: fast text playback from PDF and post-session feedback collection.

## In Scope
- PDF upload.
- Text playback speed selection in `WPM` (default: `100`).
- Light/dark theme switch.
- Minimal `3..1` countdown screen before playback starts.
- One-word-at-a-time text playback up to the nearest whitespace boundary.
- Automatic 3-second pause every 1 minute of active playback.
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
