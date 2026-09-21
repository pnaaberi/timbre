# Timbre

Timbre is a local-first, single-page sound A/B review tool. Load two audio files, mark exact regions, write listening notes, and export a structured sound-revision brief.

## Use

Open `index.html` in a current desktop browser. No build step or server is required.

1. Add local audio files or load the included online demo pair.
2. Switch between reference A and candidate B on a shared timeline.
3. Paint or enter a time range and save a Change or Keep note.
4. Select **Build your prompt** to copy or download the revision brief.

## Privacy and networking

- Local audio is decoded in the browser and is not uploaded by Timbre.
- Notes and file metadata may be saved in that browser's `localStorage` and may be exported in a session JSON file.
- Audio bytes are not stored in `localStorage` or exported with the session.
- The optional demo pair is fetched from the public VSCO 2 Community Edition repository on GitHub, with jsDelivr as a fallback.
- Timbre makes no AI or analytics calls.

## Demo audio

The included demo references two cello samples from [VSCO 2 Community Edition](https://github.com/sgossner/VSCO-2-CE), published under [CC0 1.0](https://github.com/sgossner/VSCO-2-CE/blob/master/LICENSE). The app pins the demo files to upstream commit `440300901dfe9275fd84e0b7763af1f8443ae62e`.

## Test

Requires Node.js 18 or newer:

```bash
npm test
```

The test runs without installing packages.

## Known limitations

- Imported local files must be reselected after reopening the page; the saved session reconnects notes by file metadata, not by storing audio.
- Waveforms are peak envelopes, not spectrograms.
- RMS matching attenuates the louder full file; it is not perceptual LUFS normalization.
- Some compact controls are smaller than the ideal 44 × 44 CSS-pixel touch target. Keyboard focus styling is present, but assistive-technology testing has not been completed.

## License

Timbre source is licensed under the [MIT License](LICENSE). Demo audio remains under its upstream CC0 license.
