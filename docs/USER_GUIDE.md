# Timbre user guide

## The basic workflow

### 1. Load sounds

Use **Add audio** to select local recordings. You can select multiple files. **Import folder** preserves a browser-provided relative folder path in the library. The initial pair becomes A and B when two files are selected.

The built-in demo pair is optional. It requires an internet connection the first time and loads two pinned VSCO 2 Community Edition cello samples.

Supported extensions are WAV, MP3, OGG, FLAC, M4A, AAC, AIFF, AIF, OPUS and WebM, subject to browser codec support. Timbre rejects empty files, non-audio files, files over 64 MB and decoded recordings longer than five minutes.

### 2. Compare A and B

- **A** is the reference and **B** is the candidate by default.
- **Paint** lets you drag across a waveform to select a region.
- **Seek** changes the playback position without creating a region.
- **A / B** switches the active sound while preserving the shared timeline when possible.
- **Loop** repeats the selected region, or the entire active file when no region is selected.
- **RMS match** attenuates the louder file for a rough full-file level comparison. It does not perform LUFS or perceptual loudness matching.
- **Zoom** exposes a wider view of a long recording. Use the timeline position slider to pan the zoomed view.
- Keyboard shortcuts: **Space** plays or pauses, **A** and **B** switch the active sound, and **Esc** clears the current selection.

The waveform is a maximum absolute peak envelope across channels. It is not a spectrogram and cannot prove a pitch, frequency band, harshness cause or other acoustic diagnosis.

### 3. Write a note

Select a region, then choose:

- **Change this** for a problem to improve.
- **Keep this** for a quality to preserve.
- Optional tags: Attack, Harshness, Noise, Body, Pitch and Tail.
- **What do you hear?** records the listener's observation.
- **Desired result** records the requested outcome.

**Add by time** opens exact numeric inputs in seconds. A region must be ordered, within the selected file and at least 0.010 seconds long. Notes are tied to the file identifier and remain associated with the original A/B assignment.

### 4. Build the brief

**Build your prompt** produces a deterministic text brief containing:

- the overall sound-design goal;
- the A/B filenames and available technical metadata;
- the overall preference, if selected;
- each saved time range, tag, observation and desired result;
- constraints that prevent inventing acoustic causes or silently changing Keep regions.

The brief does not send audio or text anywhere. Attach audio separately if another tool needs to hear it.

## Sessions and local storage

Timbre automatically saves a lightweight session in the browser's `localStorage` when available. **Save session** exports that state as JSON. **Open session** imports it later.

A session stores filenames, browser-provided relative paths, file sizes, modification times, notes, goals, assignments and decoded-file metadata. It does not store audio bytes. After reopening a session, reselect the original files so the browser can decode them again.

There is no separate clear-library button. To remove the current browser-side library and saved session, use the browser's site-data controls for the page. Browser privacy mode, storage quotas or disabled storage can prevent automatic saving; use an explicit session export instead.

## Troubleshooting

### The demo says it cannot load

Check the network connection and browser console. The app tries the pinned GitHub raw URL first and a pinned jsDelivr URL second. You can always use local files without the demo.

### A saved session shows missing files

This is expected when the browser has discarded the original `File` handles. Reselect the original files. Timbre does not silently replace them with a different filename.

### Playback does not start

Click a playback control once to satisfy browser audio-activation rules. Check that the browser can decode the selected format and that the file is not empty or longer than five minutes.

### A waveform looks different from what you hear

The display is a peak envelope only. It is not a frequency visualization, loudness meter or perceptual analysis.

## Accessibility and device limits

Timbre provides semantic labels, keyboard focus styling, keyboard shortcuts and visible validation errors. Some compact controls are smaller than the preferred 44 × 44 CSS-pixel touch target. Physical touch, screen-reader and other assistive-technology testing are not yet complete.
