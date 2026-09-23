# Timbre user guide

## The basic workflow

### 1. Load sounds

Use **Add audio** to select local recordings. You can select multiple files. **Import folder** preserves a browser-provided relative folder path in the library. The initial pair becomes A and B when two files are selected.

The built-in demo pair is optional. Choose **Load demo** in a waveform or the Library to download the two pinned VSCO 2 Community Edition cello samples. The app does not request demo audio on initial page load or when restoring a session.

Supported extensions are WAV, MP3, OGG, FLAC, M4A, AAC, AIFF, AIF, OPUS and WebM, subject to browser codec support. Timbre rejects empty files, non-audio files, files over 64 MB and decoded recordings longer than five minutes.

### 2. Compare A and B

- **A** is the reference and **B** is the candidate by default.
- **Paint** lets you drag across a waveform to select a region.
- **Seek** changes the playback position without creating a region.
- **A / B** switches the active sound while preserving the shared timeline when possible.
- **Loop** repeats the selected region, or the entire active file when no region is selected.
- **RMS match** attenuates the louder file for a rough full-file level comparison. It does not perform LUFS or perceptual loudness matching.
- **Zoom** magnifies a shorter section of the shared timeline. Changing zoom keeps the visible selection center, visible playhead or viewport center anchored (in that order, clamped at file edges).
- **Pan** lets you drag either waveform horizontally with mouse, pen or touch. In Pan mode vertical touch movement can scroll the page; Paint mode reserves touch dragging for region selection.
- At greater than 1× zoom, scroll sideways with a trackpad/horizontal wheel, or use **Shift + mouse wheel**. Ordinary vertical wheel scrolling and browser pinch/zoom are not intercepted.
- The **Timeline position** slider works without gesture support. On a focused waveform, **Shift + Left/Right** pans 20% of the visible span; **Home/End** jumps to the timeline edges. Unmodified **Left/Right** seeks 0.1 seconds and reveals the playhead.
- **Follow playback** optionally keeps the playhead visible. Manual panning disables follow so it does not fight your navigation. A/B always share one viewport.
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

Session JSON is limited to **32 MB and 5,000 notes**. Note saves and exports validate the same schema and byte limit used by import, so an oversized edit is rejected without destroying the existing workspace. Larger sessions that exceeded the old 3 MB import limit can now be reopened up to the new limit. Browser-storage quotas may be smaller than the session-file limit: export a file if local backup is unavailable.

Unsaved editor text, tags and range inputs are also backed up in browser storage after a short debounce and when the page is hidden. On reload, Timbre attempts to restore the draft; reselect its original audio to listen. **Undo** and **Save session** require saving or discarding dirty edits first. JSON exports and generated briefs contain saved notes only, not the browser-only draft. Discarding a draft removes its backup on the next save.

Leaving with dirty edits requests the browser's standard confirmation. Mobile OS termination, crashes, disabled/full storage and browser policies can prevent backup or confirmation; this is not guaranteed crash recovery. Storage failures show a warning. Save notes and export sessions for durable copies.

There is no separate clear-library button. To remove the current browser-side library and saved session, use the browser's site-data controls for the page. Browser privacy mode, storage quotas or disabled storage can prevent automatic saving; use an explicit session export instead.

## Troubleshooting

### The demo says it cannot load

Check the network connection and browser console. The app tries the pinned GitHub raw URL first and a pinned jsDelivr URL second. You can always use local files without the demo.

### A saved session shows missing files

This is expected when the browser has discarded the original `File` handles. Reselect the original files. Timbre does not silently replace them with a different filename.

### Playback does not start

Click a playback control once to satisfy browser audio-activation rules. Check that the browser can decode the selected format and that the file is not empty or longer than five minutes.

If audio output does not start within five seconds, Timbre shows an error instead of waiting indefinitely. Check the browser's audio permission, output device and operating-system audio service, then retry.

### A waveform looks different from what you hear

The display is a peak envelope only. It is not a frequency visualization, loudness meter or perceptual analysis.

## Accessibility and device limits

Timbre provides semantic labels, keyboard focus styling, keyboard shortcuts and visible validation errors. Navigation controls use larger touch targets on narrow screens and coarse-pointer devices. Some other compact legacy controls remain smaller than 44 × 44 CSS pixels. Current browser test coverage and exclusions are listed in [DEVELOPMENT.md](DEVELOPMENT.md). Physical touch/pen/trackpad hardware, screen readers, mobile operating systems and audio-device combinations are not fully verified; codec decoding remains browser-dependent.
