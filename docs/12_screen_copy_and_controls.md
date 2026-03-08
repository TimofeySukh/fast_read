# Screen Copy And Controls

This is the screen-level contract for the research flow.

## S1 Welcome
- Purpose: collect participant identity and gate session start.
- Required UI:
  - study intro text,
  - name input,
  - `Start` button (disabled when name empty).
- Action:
  - on valid name + `Start`, persist name and open calibration.

## S2 Calibration (One-Word Ramp)
- Purpose: choose comfortable WPM once.
- Required UI:
  - one-word display area,
  - current WPM indicator,
  - instruction to stop at comfortable speed,
  - desktop hint (`Press Space to stop`),
  - mobile button: `STOP`.
- Behavior:
  - start from baseline speed,
  - increase by `+5 WPM` every `2s`,
  - stop on user action,
  - persist selected WPM.

## S3 Pre-Test Prepare
- Purpose: signal first test start after calibration.
- Required UI:
  - short prepare message,
  - continue action (`Continue Test`, desktop `Space` shortcut allowed).

## S4 Reading Segment: One-Word Mode
- Purpose: run one-word segment at selected fixed WPM.
- Required UI:
  - progress bar above the word display area (segment-local),
  - single token display,
  - progress marker (text index / segment context),
  - control hint under word area (space/button pause-resume).
- Behavior:
  - tokenization splits by whitespace and punctuation,
  - no forced periodic breaks,
  - hidden timer start on render, stop automatically at end-of-text.
  - progress bar is shown only in one-word study segments (not in calibration).

## S5 Reading Segment: PDF Mode
- Purpose: run normal page-reading segment.
- Required UI:
  - rendered PDF pages,
  - progress marker,
  - `I finished` button.
- Behavior:
  - hidden timer start on render, stop on `I finished`.

## S6 Between-Segment Transition
- Purpose: move participant from one segment/format to next.
- Required UI:
  - progress text (`Text X of 4 completed`),
  - next-format text (`Next format: ...`),
  - comprehension scale (`1..5`) for how well the previous segment was understood,
  - `Continue Test` button.
- Desktop shortcut:
  - `Space` triggers continue.

## S7 Familiarity Checklist (Mandatory)
- Purpose: capture prior familiarity before feedback.
- Required UI:
  - prompt question about prior reading,
  - four checkboxes:
    - Jump (Tolstoy),
    - Frog Traveler (Garshin),
    - Myth of the Cave (Plato),
    - Heart Article,
  - `Continue` button.

## S8 Final Feedback (Mandatory)
- Purpose: capture qualitative participant feedback.
- Required UI:
  - text area,
  - `Submit` button.
- Validation:
  - non-empty feedback required.
- Explicitly excluded:
  - no email field.

## S9 Completion
- Purpose: close session after successful save.
- Required UI:
  - thank-you message,
  - optional close/restart action (implementation choice).

## Button Label Set (English)
- `Start`
- `STOP`
- `Continue Test`
- `I finished`
- `Continue`
- `Submit`
