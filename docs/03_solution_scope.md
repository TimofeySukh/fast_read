# Solution Scope

## High-Level Scope
Replace the previous app behavior with a deterministic research protocol with a fixed sequence, fixed corpus, and fixed data outputs.

## Input Assets
- Russian calibration PDF in repo root: `pdf_start.pdf`.
- English calibration text asset in `corpus/en/`, rendered to PDF at runtime.
- Russian study corpus folder: `pdf_folder/` with 4 predefined PDFs.
- English study corpus text assets in `corpus/en/`, rendered to PDFs at runtime.
- No participant-side file upload is required in the research flow.

## Core Flow Contract
1. Language selection screen (`Russian` or `English`).
2. Welcome screen with required participant name.
3. Calibration playback in one-word mode with manual speed controls.
4. 4-text test runner (2 reading segments per text).
5. Familiarity checklist screen (mandatory, before feedback).
6. Final feedback screen (mandatory text).
7. Session completion / thank-you confirmation.

## Calibration Contract
- Mode: one-word display.
- Source depends on selected language:
  - Russian: `pdf_start.pdf`,
  - English: generated calibration PDF from tracked English text asset.
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
- Each of 4 texts is split into two logical parts:
  - part 1 is shown in one format,
  - part 2 is shown in the other format.
- Full-text repetition across both formats is removed.
- For every segment:
  - start hidden stopwatch when segment starts,
  - one-word segments stop automatically only at end-of-text,
  - PDF segments stop on explicit `I finished`,
  - save duration to JSON.
- Stopwatch is never shown to participant.

## Locked Text Order And Format Matrix
1. Jump / The Dive (Tolstoy): `part 1 -> words`, `part 2 -> PDF`
2. Frog Traveler / The Frog Went Travelling (Garshin): `part 1 -> PDF`, `part 2 -> words`
3. Myth of the Cave / The Allegory of the Cave (Plato): `part 1 -> words`, `part 2 -> PDF`
4. Heart Article: `part 1 -> PDF`, `part 2 -> words`

This strict alternation is final for current study phase.

## Transition Screens
- Show between every segment and between texts.
- Must contain:
  - progress message,
  - next format hint,
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
- Russian mode may extract words from source PDFs.
- English mode must use tracked text assets directly, not PDF extraction, to reduce parsing regressions.

## Pre-Feedback Familiarity Screen (Mandatory)
Display checklist question: whether participant has previously read each work.
Checklist labels must match the selected session language.

## Final Feedback Screen (Mandatory)
- Required free-text feedback field.
- No email field.
- On submit: persist full session JSON and show thank-you confirmation.

## Language And Copy Rules
- UI copy is localized from the participant's entry selection.
- Reading assets are localized from the participant's entry selection.
- Documentation remains English.
- Study structure must stay identical across languages.

## Out Of Scope
- Email collection.
- Authentication/account system.
- Public analytics dashboard.
- Auto-push to GitHub.

## Success Criteria
- Participant can complete full protocol on desktop and mobile in both supported languages.
- Every required field is present in JSON.
- Format order and transitions are deterministic across sessions.
- English mode must not depend on fragile PDF text extraction for one-word playback.
