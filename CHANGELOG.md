# Changelog

This file summarizes user-visible changes. Detailed development notes can be kept here instead of making the README too long.

## Unreleased

- Reorganized project documentation for open-source review.
- Added clearer local-first privacy guidance.
- Added roadmap, security policy, and contribution guide.
- Added stronger safety disclaimer for healthcare use.

## Current Stable Direction

The current version focuses on a complete local scheduling workflow:

- Browser-only operation with no backend requirement.
- Patient, staff, and machine management.
- Default 60-machine layout.
- Long-term fixed patient seats.
- Two-week recurring scheduling.
- Infection-zone and severe-care separation.
- Strict hemodialysis, hemofiltration, and hemoperfusion machine matching.
- Machine pause and temporary adjustment handling.
- Nurse-capacity checks.
- Self-check and printable review reports.
- JSON import, export, and backup.
- Multilingual UI and theme support.

## Safety-Oriented Improvements

- Added hard checks before saving generated schedules.
- Added duplicate same-day patient assignment detection.
- Added paused-machine validation.
- Added treatment-machine compatibility validation.
- Added infection-zone validation.
- Added fixed-seat validation.
- Added nurse capacity validation.
- Added check for no more than one hemofiltration machine per nurse.
- Added doctor, responsible nurse, and backup nurse validation.
- Added import-time safety validation for future schedules.

## UI And Workflow Improvements

- Added two-week cycle workflow.
- Added current two-week report generation.
- Added schedule self-check.
- Added temporary patient insertion.
- Added smart shift swapping.
- Added undo snapshots.
- Added progress indicators for long-running actions.
- Added printable reports.
- Added light, eye-comfort, and dark themes.
- Added multilingual UI support.

## Data Management

- Added local save and auto-load.
- Added JSON export and import.
- Added reset and cache clearing.
- Added corrupted-cache recovery.
- Added compatibility checks during import.

