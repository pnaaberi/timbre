# Timbre

[![CI](https://github.com/pnaaberi/timbre/actions/workflows/ci.yml/badge.svg)](https://github.com/pnaaberi/timbre/actions/workflows/ci.yml)
[![CodeQL](https://github.com/pnaaberi/timbre/actions/workflows/codeql.yml/badge.svg)](https://github.com/pnaaberi/timbre/actions/workflows/codeql.yml)

**Timbre** is a local-first, single-page sound A/B review tool. Load two recordings, compare them on a shared timeline, mark exact regions, write listening notes, and export a structured sound-revision brief.

![Timbre waveform favicon](favicon.svg)

## What it does

- Compares a reference recording **A** with a candidate recording **B**.
- Shows browser-decoded peak-envelope waveforms on a shared time scale.
- Supports playback, looping, seeking, A/B switching and optional RMS matching.
- Lets you paint a region or enter exact start/end seconds.
- Supports horizontal/Shift-wheel scrolling, mouse/pen/touch Pan mode, keyboard panning and anchored zoom.
- Optionally follows playback; backs up unsaved drafts locally when storage is available.
- Records **Change** and **Keep** notes with tags and desired results.
- Builds a deterministic text brief. There is no AI call.
- Saves lightweight session metadata locally when the browser allows it.

## Quick start

No build step or server is required for basic use:

1. Download or clone the repository.
2. Open `index.html` in a current browser.
3. Choose **Add audio** and select two supported files, or load the online demo pair.
4. Use **A** as the reference and **B** as the candidate.
5. Paint a waveform region, or choose **Add by time** for millisecond precision.
6. Describe what you hear, optionally describe the desired result, and save the note.
7. Choose **Build your prompt**, then copy the brief or save it as a text file.

For a local HTTP preview instead of `file://`:

```bash
python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

See the detailed [user guide](docs/USER_GUIDE.md) for controls, sessions and troubleshooting.

## Privacy and networking

Timbre is designed for local browser use:

- Imported audio is decoded with the Web Audio API in the browser. Timbre has no upload endpoint.
- Notes and file metadata may be saved in `localStorage`; audio bytes are not stored there.
- A saved session JSON contains notes, filenames, relative file identifiers, durations and technical metadata. It does not contain audio bytes.
- Reopening a session does not restore local `File` handles. Reselect the original files to reconnect audio.
- The optional demo pair fetches two pinned public samples from VSCO 2 Community Edition on GitHub, with jsDelivr as a fallback, only after an explicit Load demo action. Opening or restoring a session does not fetch demo audio.
- Apart from the optional demo fetch, Timbre makes no analytics, AI or application-backend calls.

Read the complete [privacy and data-flow note](docs/PRIVACY.md) before using Timbre with sensitive filenames or notes.

## Supported audio and limits

- WAV, MP3, OGG, FLAC, M4A, AAC, AIFF, AIF, OPUS and WebM when the browser can decode them.
- Maximum imported file size: 64 MB.
- Maximum decoded duration: 5 minutes per file.
- Maximum library size: 250 files.
- Session JSON: at most 32 MB and 5,000 notes. Saving/exporting checks the same schema and size boundary used by import.
- Waveforms are peak envelopes, not spectrograms or acoustic diagnoses.
- RMS matching attenuates the louder full file. It is not perceptual LUFS normalization.

Browser support and known limitations are documented in [USER_GUIDE.md](docs/USER_GUIDE.md).

## Development

Core tests require Node.js 18 or newer; optional Playwright browser tests require Node.js 20 or newer. The app has no npm runtime dependencies:

```bash
npm test
```

Core tests also compile every inline script. Optional cross-browser regression tests and the verified compatibility matrix are documented in [DEVELOPMENT.md](docs/DEVELOPMENT.md). Browser automation is not a guarantee for every OS, codec or physical input/audio device.

## Demo audio and licensing

The included cello demo references two samples from [VSCO 2 Community Edition](https://github.com/sgossner/VSCO-2-CE), published under [CC0 1.0](https://github.com/sgossner/VSCO-2-CE/blob/master/LICENSE). Demo URLs are pinned to upstream commit `440300901dfe9275fd84e0b7763af1f8443ae62e`.

Timbre source is licensed under the [MIT License](LICENSE). See [SECURITY.md](SECURITY.md) for responsible vulnerability reporting.
