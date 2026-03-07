# Problem And Users

## Problem Statement
The project needs a strict, repeatable research flow that measures how reading format influences reading time on Russian texts. Previous ad-hoc flows were not valid enough for comparison because:
- participant speed was not calibrated in a consistent way,
- time tracking was not segment-level and structured,
- flow transitions were inconsistent across participants and devices.

## Research Questions
- How does reading time change between one-word mode and normal PDF mode on the same text?
- Does format order influence timing for the same participant?
- Which calibrated WPM do participants select as comfortable in the initial ramp test?

## Primary Users
- Participants completing the reading session on desktop or mobile.
- Research owner analyzing resulting JSON records.

## Non-User Stakeholder
- Development/ops side maintaining deterministic study behavior and clean data export.

## Why This Matters
- The project is not a generic speed-reader now; it is a measurement protocol.
- Session consistency is more important than feature richness.
- Missing one required step can invalidate a participant record for analysis.
