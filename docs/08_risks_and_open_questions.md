# Risks And Open Questions

## Risks
- Format-sequence ambiguity may invalidate comparisons.
- Missing timing events can break analysis quality.
- Mobile interaction gaps can bias participant behavior.
- Inconsistent docs updates can desync implementation and research protocol.

## Open Questions
- Text 6 order conflict:
  - should it follow strict alternation (`PDF -> words`) or latest spoken instruction (`words -> PDF`)?
  - Suggested owner: Product/Research.
- Should free-text feedback be required or optional?
  - Suggested owner: Product/Research.
- Should transition screens wait for `Continue Test` only, or allow timed auto-continue fallback?
  - Suggested owner: UX/Product.

## Assumptions
- The 6 listed works are the fixed test corpus for this study phase.
- JSON is the only persistence format for MVP.
