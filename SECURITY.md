# Security policy

## Scope

This policy covers the source in this repository. Timbre is a static browser application with no Timbre-operated backend or account service.

## Reporting a vulnerability

Please do not open a public issue for a suspected security vulnerability. Use [GitHub private vulnerability reporting](https://github.com/pnaaberi/timbre/security/advisories/new), which is enabled for this repository, and include:

- a short description of the issue;
- affected file and function or a minimal reproduction;
- browser and operating-system details when relevant;
- the impact and any safe mitigation.

Do not include real credentials, private recordings, personal data or confidential notes in a report. Use synthetic fixtures.

## Response expectations

This is a small personal open-source project, so response time is best effort. Reports are assessed for reproducibility, user impact and whether the issue crosses the documented browser-local data boundary.

## Automated safeguards

GitHub secret scanning and push protection, Dependabot alerts/security updates, and private vulnerability reporting are enabled. The repository defines weekly npm/GitHub Actions dependency-update PRs, a checksum-pinned Gitleaks history scan, dependency audit, cross-platform browser checks, and CodeQL JavaScript analysis. Workflow actions are commit-pinned, checkout does not persist credentials, and ordinary test jobs have read-only repository access. CodeQL alone receives security-event upload permission.

GitHub Actions requires full-SHA action references at repository level, defaults to read-only workflow tokens, and cannot approve pull requests. Runner OS labels are explicit rather than `*-latest`. Main is intended to require pull requests, passing quality/security/browser checks and resolved conversations, including for administrators; verify the current protection settings before release.

A green scan is bounded evidence, not a guarantee that every vulnerability or secret has been found. Check the latest Actions runs and Security alerts before releasing. No raw audio, session JSON, real-user notes or private QA artifacts belong in CI uploads or source control.

## Out of scope

- vulnerabilities in the user's browser, operating system or browser extensions;
- upstream GitHub, jsDelivr or VSCO 2 Community Edition infrastructure;
- private data that a user intentionally copies to another service;
- missing features or ordinary usability bugs, which may be reported as public issues.
