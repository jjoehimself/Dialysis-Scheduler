# Roadmap

This roadmap focuses on making Dialysis-Scheduler safer, easier to review, and easier for small dialysis units to use locally.

## Near Term

- Add automated regression tests for scheduling rules.
- Add sample JSON backup files with fake data only.
- Add screenshot-based documentation for common workflows.
- Improve English documentation and keep it aligned with the Chinese README.
- Add GitHub Pages demo using fake data only.
- Add a clearer first-run guide inside the UI.
- Add export reminders before reset or cache clearing.

## Scheduling Reliability

- Expand self-check coverage for two-week cycles.
- Add more detailed explanations for blocked schedules.
- Add edge-case tests for fixed seats, paused machines, and monthly hemofiltration.
- Add test scenarios for severe-care and infection-zone capacity.
- Add clearer warnings when staff coverage is incomplete.
- Improve schedule-difference reports after regeneration.

## Privacy And Institutional Readiness

- Document recommended privacy practices for real healthcare environments.
- Add an optional local backup workflow.
- Add optional audit-log design notes.
- Add optional role-based access-control design notes.
- Add guidance for internal hospital IT review.
- Add warning labels for screenshots and public issue reports.

## Accessibility And Usability

- Improve keyboard navigation.
- Improve screen-reader labels.
- Review contrast in all themes.
- Simplify report wording for non-technical users.
- Add more compact print layouts.
- Improve mobile and tablet readability.

## Internationalization

- Improve translation completeness across all supported languages.
- Add translation review notes.
- Separate clinical terms from general UI terms.
- Add RTL layout checks for Arabic, Urdu, Persian, and Hebrew.

## Open Source Maintenance

- Add issue templates.
- Add pull request template.
- Add a project architecture document.
- Add code comments around complex scheduling logic.
- Add release notes for each stable version.
- Add documented manual QA checklist.

## Long-Term Ideas

- Optional encrypted local backup file.
- Optional offline-first PWA packaging.
- Optional import/export schema validation.
- Optional anonymized demo scenario generator.
- Optional integration guidance for hospital intranet deployment.
- Optional local-only multi-user deployment design.

