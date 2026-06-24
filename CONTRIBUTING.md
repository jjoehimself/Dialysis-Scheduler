# Contributing

Thank you for your interest in Dialysis-Scheduler.

This project is intended to help dialysis units with local, privacy-friendly scheduling workflows. Contributions should preserve the project's core principles:

- Free and open source.
- Local-first by default.
- No automatic patient-data upload.
- Human review before real-world use.
- Clear and conservative scheduling rules.

## Before You Start

Please do not use real patient data while developing, testing, reporting bugs, or sharing screenshots.

Use fake names, fake dialysis IDs, fake phone numbers, and fake schedules.

## Good First Contributions

- Improve documentation.
- Add screenshots using fake demo data.
- Add translation corrections.
- Improve accessibility labels.
- Add regression tests for scheduling rules.
- Improve report wording.
- Fix UI bugs.
- Add issue templates.

## Development Notes

The app is currently a static browser application:

- `index.html` contains the UI structure.
- `styles.css` contains layout, themes, print styles, and report styles.
- `app.js` contains scheduling logic, state management, validation, import/export, and rendering.
- `languages.js` contains supported languages and UI text.

No build step is required for basic development.

## Pull Request Checklist

Before opening a pull request, please check:

- The app opens from `index.html`.
- No browser console error appears on load.
- Existing demo data can be generated.
- Automatic scheduling still produces a review report.
- Safety self-check still runs.
- JSON export and import still work.
- No real patient data is included.
- User-facing text is updated in relevant language files when needed.
- README or CHANGELOG is updated for user-visible changes.

## Scheduling Rule Changes

Scheduling rules are safety-sensitive. If you change scheduling logic, please explain:

- What rule changed.
- Why it changed.
- Which patient, machine, staff, or zone cases are affected.
- How you tested the change.
- Whether the change affects fixed seats, infection isolation, severe-care capacity, or machine-type matching.

## Privacy Rule

Never commit real patient data, staff personal data, hospital schedules, or identifiable screenshots.

If such data is accidentally submitted, remove it immediately and report it privately.

