# Timbre development and release notes

## Repository shape

- `index.html`: complete zero-build application, inline styles, deterministic core helpers and browser runtime.
- `favicon.svg`: self-contained product mark wired from the document head.
- `tests/test-core.cjs`: dependency-free tests for the pure helper layer and prompt generation.
- `tests/test-browser.cjs`: optional Playwright regressions against the real HTML via a temporary loopback-only server, using generated WAV fixtures.
- `package.json` / `package-lock.json`: dependency-free core tests; pinned Playwright development dependency only. No browser runtime dependencies.
- `docs/`: user, privacy and development documentation.

## Local development

Run the focused tests:

```bash
npm test
```

For browser testing, use a local static server:

```bash
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/`. The app is also usable from `file://`, but HTTP makes favicon and network behavior easier to inspect.

### Browser regression tests

Use Node.js 20+ for Playwright (Node.js 18+ remains sufficient for `npm test`):

```bash
npm ci
npx playwright install --with-deps
npm run test:browser
```

The browser installer may need OS package privileges; review before running it. Tests serve the real source temporarily on loopback, create disposable WAVs, and stub only online demo responses. No audio, notes or test output is uploaded. Tests do not prove the upstream demo network path.

Optional environment variables:
- `BROWSERS=chromium,firefox,webkit`: engines to run (all three by default).
- `CHROME_PATH`: use an installed Chrome executable rather than the Playwright Chromium download.
- `WEBKIT_PATH`: optional WebKit launcher override for an isolated dependency environment.
- `QA_DIR`: save private screenshots under this directory; keep outside the repository.
- `SKIP_PLAYBACK=1`: explicitly skip normal playback/follow checks on hosts without working audio. The suite prints **UNVERIFIED**; this is not a full playback pass. The bounded stalled-audio error path is still tested.

Coverage includes horizontal/Shift-wheel navigation, wheel units, untouched vertical/zoom gestures, anchored zoom, Pan/paint, keyboard/slider navigation, opt-in playback following, dirty Undo/export guards, draft recovery with invalid inputs, same-file reconnection, session round-trip, storage failure, stalled audio feedback, console checks and desktop/390/320 px layouts. Chromium additionally dispatches emulated touch and cancellation events.

### Verified scope — 23 September 2026

| Target | Scope / status |
| --- | --- |
| Chrome 152 on Linux | Browser regressions including playback/follow and emulated touch pass. Physical listening is not tested. |
| Firefox 155 on Linux | Navigation, draft/session, storage/error and layout checks pass. Normal audio activation stalled on this headless host; playback/follow remains unverified. |
| Playwright WebKit 26.6 on Linux | Browser regressions including playback/follow pass using isolated local dependency libraries. This is not Safari on Apple hardware. |
| Desktop, 390 px, 320 px | Layout/state checks and non-annotated screenshot review; no horizontal page overflow in the tested states. |
| Windows/macOS, Safari/iOS, Android, Edge, pen/physical trackpads, audio devices, screen readers | Unverified. Browser emulation does not certify these platforms. |

The supported interaction design uses standard Wheel/Pointer/Keyboard events and native controls, with the timeline slider as a fallback. Codec support, browser storage and OS audio availability still vary. A universal hardware/platform guarantee is not possible.

## Architecture notes

The first inline script exposes pure helpers through `TimbreCore`:

- range normalization and clipping;
- peak-envelope calculation;
- basic peak/RMS statistics;
- stable local file identifiers;
- deterministic sound-revision prompt generation.

The browser runtime script owns state, file import, Web Audio playback, Canvas drawing, dialogs, local persistence and DOM rendering. Pure viewport anchoring and wheel normalization live in `TimbreCore`. A browser-only draft field shares the session storage key but is excluded from JSON exports and ignored on session-file import. No framework or bundler is required.

The runtime uses a shared validated session export/import boundary (32 MB / 5,000 notes). Demo fetching requires an explicit user action; startup and session restoration reuse local handles or embedded demo bytes without network access.

## Change checklist

Before committing a behavior change:

1. Run `npm test`.
2. Run a Node syntax check over the extracted inline scripts.
3. Exercise the changed browser flow in Chromium at desktop and 390 px mobile widths.
4. Check page errors, console errors and horizontal overflow.
5. Test the relevant empty, invalid and successful states.
6. Review the privacy/data-flow boundary if a new input, storage field or network request is added.
7. Update the closest documentation when behavior, limits, controls or data handling changes.
8. Run `git diff --check` and inspect the final file allowlist.

## Public-release checklist

- Keep local audio, sessions, logs, credentials and generated evidence out of the repository.
- Run Gitleaks and TruffleHog against the candidate and reachable history.
- Keep upstream demo URLs pinned to immutable commits.
- Keep the favicon self-contained, parseable and wired from HTML.
- Raster-check the favicon at 16 px and 32 px on light and dark backgrounds.
- Use the MIT license for Timbre source and retain the upstream CC0 notice for demo audio.
- Re-test a fresh HTTPS clone after pushing.
- Verify the exact default-branch commit and remote file manifest.

## GitHub quality gates

`.github/workflows/ci.yml` runs on pull requests and main updates:
- core/helper and inline-script syntax tests, `npm audit --audit-level=low`;
- Gitleaks 8.30.1 over reachable history, with a pinned archive SHA-256 and redacted findings;
- Playwright Chromium/Firefox/WebKit on Linux plus Chromium on Windows/macOS. Linux jobs use a disposable virtual audio sink; no playback skip is configured in CI.

`.github/workflows/codeql.yml` runs JavaScript security-extended analysis on pull requests, main and a weekly schedule. All referenced actions are commit-pinned. Test jobs cannot write repository contents; CodeQL may upload security events. `.github/dependabot.yml` opens weekly npm and Actions updates. Keep the scanner version/checksum current during maintenance.

Review **all** job failures, warnings and Security alerts before merging. CI runner coverage is not physical-device certification. The earlier local compatibility table records local evidence only; current cross-OS assurance comes from the specific passing GitHub run, not from the presence of a matrix in YAML.

Release procedure: create a feature-branch PR; inspect the complete diff and all checks; merge only passing required checks; verify the exact main SHA and a fresh HTTPS checkout; then deploy only to an explicitly selected hosting destination. Main branch protection and repository settings should be read back via GitHub after changes. Do not bypass checks with administrator merges or force pushes.

## Release scope

The repository is source-published only. GitHub Pages, package publication, hosted audio processing and any backend deployment are separate decisions and are not implied by a GitHub push.
