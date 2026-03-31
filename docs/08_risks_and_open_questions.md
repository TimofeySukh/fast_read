# Risks And Open Questions

## Active Risks
- `R-01` Segment timer loss:
  - if start/stop hooks fail, analysis quality drops immediately.
- `R-02` Russian PDF extraction variability:
  - malformed/scanned PDFs may still produce weak tokenization for one-word mode.
- `R-03` Translation drift:
  - if English assets diverge too far from the intended Russian originals, comparison across languages becomes harder to interpret.
- `R-04` Generated English PDF layout drift:
  - if runtime PDF generation changes line/page flow unexpectedly, English reading experience may change after deploy.
- `R-05` Mobile control mismatch:
  - if any desktop keyboard action has no mobile equivalent, completion rate drops.
- `R-06` Flow drift:
  - if format matrix is accidentally changed, cross-session comparison becomes invalid.
- `R-07` Documentation drift:
  - implementation and protocol can diverge if docs updates are skipped.

## Open Questions
- None from product-owner side at this moment.

## Locked Decisions
- Strict alternation across all 4 texts is final.
- Text 4 order is `PDF -> words`.
- Final feedback is mandatory.
- No email field in session output.
- Push to GitHub stays manual by owner.
- Session language is chosen once at entry and does not change mid-run.

## Assumptions
- Corpus remains fixed to current four works for this phase.
- JSON remains the primary persistence output for MVP.
- English mode uses tracked text assets as the canonical source for both one-word playback and generated PDFs.
