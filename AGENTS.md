# Timbre maintenance

- Read this file, README.md and docs/DEVELOPMENT.md before changes; verify source ownership and a clean Git baseline.
- Preserve the zero-build, local-first app and its lack of runtime npm dependencies or audio-upload endpoints.
- Keep real audio, notes, sessions, credentials and generated evidence out of Git; use disposable synthetic fixtures.
- Keep demo URLs immutable and opt-in. Preserve the validated import/export and storage/privacy boundaries.
- Run npm test for core/syntax checks. Dependency/workflow changes must pass the existing browser, secret-scan and CodeQL gates; never bypass them with admin merges or playback skips.
- Update affected docs and Unreleased notes; commit only the scoped source. Keep public author metadata on the GitHub noreply identity.
- Source publication is not website deployment; preserve the release destination and approval boundaries in docs/DEVELOPMENT.md.
