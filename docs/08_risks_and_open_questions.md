# Risks And Open Questions

## Risks
- A poorly chosen WPM range can lead to incorrect UX and unreliable feedback.
- PDF text extraction quality may be unstable (complex layout, scanned pages).
- Local file storage may become inconvenient as data volume grows.

## Open Questions
- What WPM range and step size should be used?
  - Suggested owner: Product + UX.
- Should email validation be mandatory for MVP?
  - Suggested owner: Product.
- Which response storage format should be chosen: JSON, CSV, or SQLite?
  - Suggested owner: Backend.
- Is personal-data handling required for nickname/email, and what is the retention period?
  - Suggested owner: Product + Legal/Compliance.

## Assumptions
- `Assumption:` User flow is based on one pass through one PDF per session.
- `Assumption:` Feedback submission is required after each completed text session.
