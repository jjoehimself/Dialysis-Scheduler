# Security Policy

Dialysis-Scheduler is a local-first scheduling assistant for dialysis-room workflows. It is designed to run in the browser without a backend server. By default, data is stored in the user's local browser storage.

## Do Not Share Patient Data Publicly

Please do not include real patient information in:

- GitHub issues.
- Pull requests.
- Screenshots.
- Demo JSON files.
- Discussions.
- Public bug reports.

This includes names, dialysis IDs, phone numbers, diagnosis details, treatment notes, dates of birth, screenshots of real schedules, or any other information that could identify a patient or staff member.

## Reporting Security Issues

If you find a privacy or security issue, please report it privately by email:

`434881918@qq.com`

Please include:

- A short description of the issue.
- Steps to reproduce it.
- The affected file or feature.
- Whether real patient data could be exposed.
- Suggested mitigation, if you have one.

Please do not open a public issue for vulnerabilities involving patient privacy or sensitive data.

## Current Security Model

The current project is a static browser application:

- No backend server is required.
- No database is required.
- No automatic upload is performed by the application.
- Data is stored in browser `localStorage`.
- Users can export and import JSON backups.

Because data is local, security also depends on the computer, browser profile, operating-system account, local backup files, and any shared-device policies used by the organization.

## Recommended Practices

For testing:

- Use fake or anonymized data.
- Do not upload screenshots with real patient names.
- Export backups only to trusted devices.
- Clear local data before sharing a computer.

For institutional use:

- Review the project with clinical, nursing, infection-control, IT, and privacy teams.
- Add account permissions if multiple people use the same device.
- Add audit logs if required by local policy.
- Store backups in an approved secure location.
- Consider deployment on an internal network only.
- Perform a local security review before using real data.

## Medical Safety Disclaimer

Dialysis-Scheduler is not a medical diagnosis system, not a treatment recommendation system, and not a certified clinical decision system. It is a scheduling-assistance tool.

All generated schedules must be reviewed and approved by qualified healthcare staff before use.

