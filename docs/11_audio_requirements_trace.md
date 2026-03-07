# Audio Requirements Trace

Source: `/home/tim/.var/app/org.telegram.desktop/data/TelegramDesktop/tdata/temp_data/Else Alfelts Vej 89 19.m4a`
Transcript reference: `.tmp_raw_transcript_89_19_v2.txt`

This file maps spoken requirements to implementation-level requirements so no detail is lost.

## Timeline Trace
- `00:00-00:10`
  - Project direction changed to research mode.
  - Requirement: protocol-first flow, not generic reader.

- `00:10-00:20`
  - There are 6 PDFs in `pdf_folder/`.
  - Requirement: fixed six-text corpus in one session.

- `00:28-00:52`
  - Welcome message and required name before start.
  - Requirement: start button disabled until name is entered.

- `00:52-01:09`
  - Name must be saved immediately to data output.
  - Requirement: persist participant identity at session start.

- `01:10-01:29`
  - Calibration screen uses one-word mode.
  - Calibration speed ramp is `+5 WPM` every `2 seconds`.
  - Stop action via `Space`; mobile needs a STOP button.

- `01:29-01:45`
  - Selected speed must be saved as participant preference.
  - Requirement: store calibration result in JSON.

- `01:45-01:71`
  - Prepare screen before first text.
  - Requirement: explicit pre-test transition state.

- `01:71-02:33`
  - Text 1 is run in one-word mode first, then normal PDF.
  - Hidden stopwatch is required for both segments.

- `02:33-02:59`
  - Participant sees PDF format as normal page reading.
  - Segment completion button `I finished` is required.

- `02:59-03:17`
  - Completion/progress messaging between texts is required.
  - Transition requires explicit continue action.

- `03:17-04:16`
  - Text 2 starts with PDF, then one-word.
  - One-word segments use fixed selected speed from calibration.
  - Stopwatch remains hidden.

- `04:22-04:86`
  - Text order and alternation pattern for texts 3-6 was listed.
  - Final product-owner lock: strict alternation through all 6 texts.

- `04:86-04:96`
  - Save output in JSON.

- `04:96-05:24`
  - Final screen asks for feedback.
  - Feedback exists as a text box.

- `05:24-05:37`
  - Email should not be collected.

## Clarification Decisions Applied After Audio
- Strict alternation is locked for all six texts; text 6 is `PDF -> words`.
- Final feedback is mandatory.
- Buttons remain English.
- Docs remain English.
- Commit immediately after meaningful changes; GitHub push remains manual by owner.
