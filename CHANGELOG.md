# Changelog

## Unreleased

### Fixed
- Zoomed waveform navigation: horizontal/Shift-wheel scrolling, explicit mouse/pen/touch Pan tool, keyboard panning and accessible slider fallback.
- Zoom preserves the visible selection/playhead/view anchor rather than resetting to the beginning; optional playback follow yields to manual panning.
- Dirty Undo and session export no longer silently omit/discard current edits. Best-effort browser draft recovery preserves text and invalid range input through reload; browsers are asked to confirm leaving dirty edits.
- Stalled audio activation reports an actionable error after five seconds; browser-storage failures are visible even on mobile.
- Larger navigation touch targets and a full-width mobile timeline slider.

### Tests and documentation
- Added pure navigation tests, inline-script syntax checks and an optional pinned Playwright integration suite.
- Documented navigation, draft privacy, test commands and bounded browser/device coverage. Physical-device compatibility is not certified; Firefox playback remains unverified in the headless test environment.

- Expanded the README with quick start, privacy, limits, development and licensing guidance.
- Added the user guide, privacy/data-flow note, development checklist and security policy.

## 1.0.0

- Initial public release of the local-first Timbre A/B sound review tool.
- Added browser-local audio comparison, waveform region notes and deterministic prompt export.
- Added MIT source licensing, CC0 demo-audio attribution, privacy documentation and security reporting guidance.
- Added a self-contained waveform favicon and immutable demo-source pin.
