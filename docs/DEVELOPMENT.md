# Timbre development and release notes

## Repository shape

- `index.html`: complete zero-build application, inline styles, deterministic core helpers and browser runtime.
- `favicon.svg`: self-contained product mark wired from the document head.
- `tests/test-core.cjs`: dependency-free tests for the pure helper layer and prompt generation.
- `package.json`: test command only; no runtime npm dependencies.
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

## Architecture notes

The first inline script exposes pure helpers through `TimbreCore`:

- range normalization and clipping;
- peak-envelope calculation;
- basic peak/RMS statistics;
- stable local file identifiers;
- deterministic sound-revision prompt generation.

The second inline script owns browser state, file import, Web Audio playback, Canvas drawing, dialogs, local persistence and DOM rendering. No framework or bundler is required.

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

## Release scope

The repository is source-published only. GitHub Pages, package publication, hosted audio processing and any backend deployment are separate decisions and are not implied by a GitHub push.
