# Data Schema

Target persistence format for one completed or partial session.

## Top-Level Object
```json
{
  "schemaVersion": "1.0.0",
  "sessionId": "uuid",
  "status": "completed",
  "createdAtUtc": "2026-03-07T08:00:00Z",
  "updatedAtUtc": "2026-03-07T08:12:00Z",
  "participant": {},
  "calibration": {},
  "segments": [],
  "familiarityChecklist": {},
  "feedback": {},
  "device": {}
}
```

## Required Fields
- `schemaVersion`: string.
- `sessionId`: stable unique ID.
- `status`: `in_progress` or `completed` or `aborted`.
- `participant.name`: non-empty string.
- `calibration.selectedWpm`: integer.
- `segments`: array with 8 segment records for completed runs.
- `feedback.text`: non-empty string for completed runs.

## Participant Object
```json
{
  "name": "string",
  "savedAtUtc": "ISO-8601"
}
```

## Calibration Object
```json
{
  "sourcePdf": "pdf_start.pdf",
  "selectionMode": "manual",
  "minWpm": 50,
  "maxWpm": 700,
  "stepWpm": 5,
  "stopMethod": "manual_select",
  "selectedWpm": 180,
  "stoppedAtUtc": "ISO-8601"
}
```

## Segment Record
```json
{
  "segmentId": "t1_words",
  "textIndex": 1,
  "textTitle": "Jump",
  "format": "words",
  "orderInText": 1,
  "startedAtUtc": "ISO-8601",
  "finishedAtUtc": "ISO-8601",
  "durationSeconds": 52.41,
  "completionAction": "auto_end_of_text",
  "selectedWpmAtRun": 180,
  "comprehensionScore": 4
}
```

## Familiarity Checklist Object
```json
{
  "jump_tolstoy": true,
  "frog_traveler_garshin": false,
  "myth_of_the_cave_plato": true,
  "heart_article": true,
  "submittedAtUtc": "ISO-8601"
}
```

## Feedback Object
```json
{
  "text": "string",
  "submittedAtUtc": "ISO-8601"
}
```

## Device Object
```json
{
  "platformType": "desktop_or_mobile",
  "userAgent": "string"
}
```

## Segment Order Contract
For completed runs, `segments` must respect this exact order:
1. `t1_words`
2. `t1_pdf`
3. `t2_pdf`
4. `t2_words`
5. `t3_words`
6. `t3_pdf`
7. `t4_pdf`
8. `t4_words`

## Notes
- No email field is allowed.
- If session is interrupted, save partial data with `status: "aborted"` or `status: "in_progress"`.
