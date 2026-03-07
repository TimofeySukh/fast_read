# Risks And Open Questions

## Active Risks
- `R-01` Segment timer loss:
  - if start/stop hooks fail, analysis quality drops immediately.
- `R-02` PDF extraction variability:
  - malformed/scanned PDFs may produce weak tokenization for one-word mode.
- `R-03` Mobile control mismatch:
  - if any desktop keyboard action has no mobile equivalent, completion rate drops.
- `R-04` Flow drift:
  - if format matrix is accidentally changed, cross-session comparison becomes invalid.
- `R-05` Documentation drift:
  - implementation and protocol can diverge if docs updates are skipped.

## Open Questions
- None from product-owner side at this moment.

## Locked Decisions
- Strict alternation across all 6 texts is final.
- Text 6 order is `PDF -> words`.
- Final feedback is mandatory.
- No email field in session output.
- Push to GitHub stays manual by owner.

## Assumptions
- Corpus remains fixed to current six works for this phase.
- JSON remains the primary persistence output for MVP.
