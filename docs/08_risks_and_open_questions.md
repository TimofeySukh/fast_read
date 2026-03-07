# Risks And Open Questions

## Risks
- Format-sequence ambiguity may invalidate comparisons.
- Missing timing events can break analysis quality.
- Mobile interaction gaps can bias participant behavior.
- Inconsistent docs updates can desync implementation and research protocol.

## Open Questions
- Should transition screens wait for `Continue Test` only, or allow timed auto-continue fallback?
  - Suggested owner: UX/Product.

## Assumptions
- The 6 listed works are the fixed test corpus for this study phase.
- Final format order is strict alternation through all 6 texts, including text 6 (`PDF -> words`).
- Free-text feedback is mandatory.
- JSON is the only persistence format for MVP.
