# Solution Scope

## High-Level Scope
Replace the previous app behavior with a deterministic research protocol with a fixed sequence, fixed corpus, and fixed data outputs.

## Input Assets
- Calibration source file in repo root: `pdf_start.pdf`.
- Study corpus folder: `pdf_folder/` with 5 predefined texts.
- No participant-side file upload is required in the research flow.

## Core Flow Contract
1. Welcome screen with required participant name.
2. Calibration playback from `pdf_start.pdf` with manual speed controls.
3. 5-text test runner (2 reading segments per text).
4. Familiarity checklist screen (mandatory, before feedback).
5. Final feedback screen (mandatory text).
6. Session completion/thank-you confirmation.

## Calibration Contract
- Source: `pdf_start.pdf`.
- Mode: one-word display.
- Manual controls:
  - quick-step buttons: `-100`, `-50`, `-20`, `-10`, `-5`, `+5`, `+10`, `+20`, `+50`, `+100`,
  - direct numeric input.
- Allowed range: `50..700`.
- Confirm action:
  - desktop: `Space` or `Continue`,
  - mobile: `Continue`.
- Persist:
  - selected WPM,
  - selection interaction type,
  - calibration timestamp.
- Post-confirm prepare state exists before first segment.

## Reading Segment Contract
- Each of 5 texts is read twice:
  - once in one-word mode,
  - once in normal PDF mode.
- For every segment:
  - start hidden stopwatch when segment starts,
  - one-word segments stop automatically only at end-of-text,
  - PDF segments stop on explicit `I finished`,
  - save duration to JSON.
- Stopwatch is never shown to participant.

## Locked Text Order And Format Matrix
1. Jump (Tolstoy): `words -> PDF`
2. Frog Traveler (Garshin): `PDF -> words`
3. Myth of the Cave (Plato): `words -> PDF`
4. Macintosh Presentation: `PDF -> words`
5. Heart Article: `words -> PDF`

This strict alternation is final for current study phase.

## Transition Screens
- Show between every segment and between texts.
- Must contain:
  - progress message (example: `Text 1 of 5 completed`),
  - next format hint (example: `Next format: PDF` or `Next format: one word at a time`),
  - comprehension scale `1..5` for the just-finished segment,
  - explicit continue action (`Continue` button).
- Desktop continue shortcut: `Space`.
- Mobile continue action: on-screen button.
- No forced one-minute breaks.

## One-Word Mode Rules
- Use selected calibration WPM (fixed after calibration).
- Tokenization must split by:
  - whitespace,
  - punctuation marks.
- No character-based slicing.
- Runtime control:
  - desktop `Space` can pause/resume one-word playback,
  - mobile has on-screen equivalent control.

## Pre-Feedback Familiarity Screen (Mandatory)
Display checklist question: whether participant has previously read each work:
- Jump (Tolstoy)
- Frog Traveler (Garshin)
- Myth of the Cave (Plato)
- Macintosh Presentation
- Heart Article

## Final Feedback Screen (Mandatory)
- Required free-text feedback field.
- No email field.
- On submit: persist full session JSON and show thank-you confirmation.

## Language And Copy Rules
- Buttons/controls are English.
- Study text content remains Russian-language corpus.
- Documentation remains English.

## Out Of Scope
- Email collection.
- Authentication/account system.
- Public analytics dashboard.
- Auto-push to GitHub.

## Success Criteria
- Participant can complete full protocol on desktop and mobile.
- Every required field is present in JSON.
- Format order and transitions are deterministic across sessions.
