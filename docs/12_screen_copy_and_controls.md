# Screen Copy And Controls

This is the screen-level contract for the research flow.

## S0 Language Gate
- Purpose: choose the session language before the protocol starts.
- Required UI:
  - short language prompt,
  - `Russian` button,
  - `English` button.
- Action:
  - on selection, load localized protocol/UI/assets and open the welcome screen.

## S1 Welcome
- Purpose: collect participant identity and gate session start.
- Required UI:
  - localized study intro text,
  - name input,
  - localized `Start` button (disabled when name empty).
- Action:
  - on valid name + `Start`, persist name/language and open calibration.

## S2 Calibration
- Purpose: choose comfortable WPM once.
- Required UI:
  - one-word display area,
  - current WPM indicator,
  - quick-step controls (`±5/10/20/50/100`),
  - direct numeric input,
  - localized continue action.
- Behavior:
  - playback starts immediately,
  - speed changes update the loop immediately,
  - selected WPM is persisted on continue.
- Source:
  - Russian mode uses `pdf_start.pdf`,
  - English mode uses generated PDF/text from tracked English calibration asset.

## S3 Pre-Text / Transition Screen
- Purpose: move participant from calibration or one segment to the next.
- Required UI:
  - localized progress message,
  - localized next-format message,
  - comprehension scale (`1..5`) for finished segments,
  - clearly visible active state for the selected comprehension score,
  - localized `Continue` button.
- Desktop shortcut:
  - `Space` triggers continue.

## S4 Reading Segment: One-Word Mode
- Purpose: run one-word segment for the assigned logical text part at selected fixed WPM.
- Required UI:
  - progress bar above the word display area,
  - single token display,
  - localized progress marker,
  - localized pause/resume hint,
  - localized pause/resume button.
- Behavior:
  - tokenization splits by whitespace and punctuation,
  - no forced periodic breaks,
  - hidden timer starts on render and stops automatically at end-of-text,
  - progress bar is shown only in one-word study segments (not in calibration).

## S5 Reading Segment: PDF Mode
- Purpose: run PDF-reading segment for the assigned logical text part.
- Required UI:
  - rendered PDF pages,
  - localized progress marker,
  - localized `I finished` button.
- Behavior:
  - hidden timer starts on render and stops on `I finished`.

## S6 Familiarity Checklist (Mandatory)
- Purpose: capture prior familiarity before feedback.
- Required UI:
  - localized prompt question,
  - four localized checkboxes,
  - localized `Continue` button.

## S7 Final Feedback (Mandatory)
- Purpose: capture qualitative participant feedback.
- Required UI:
  - localized prompt,
  - text area,
  - localized `Submit` button.
- Validation:
  - non-empty feedback required.
- Explicitly excluded:
  - no email field.

## S8 Completion
- Purpose: close session after successful save.
- Required UI:
  - localized thank-you message,
  - compact summary block with a few session metrics.

## Button / Copy Rules
- All participant-facing UI copy is localized by selected session language.
- The same control roles must exist in both languages.
- Study order and behavior must remain identical across languages.
