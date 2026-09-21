# Timbre privacy and data flow

## Summary

Timbre is a browser-local review tool. It has no application server, upload API, analytics SDK, account system or AI integration.

The privacy boundary is still determined by the browser and the user-provided filenames, notes and URLs. Do not treat local browser storage as encrypted storage.

## Data-flow table

| Data | Where it comes from | Where it goes | Retention |
| --- | --- | --- | --- |
| Imported audio bytes | Local file picker or folder picker | Browser memory and Web Audio decoding | Until the page/session releases it |
| Filename, relative path, size and modification time | Browser file metadata | In-memory library; optional local session JSON / `localStorage` | Until cleared, storage is evicted, or exported data is deleted |
| Listening notes, tags, goal and A/B assignment | User input | In-memory state; optional local session JSON / `localStorage`; generated text area | Same as session metadata |
| Demo audio bytes | Pinned public GitHub raw URL, then pinned jsDelivr fallback | Browser memory and Web Audio decoding | Until released by the page |
| Generated brief | Local app state | Text area, clipboard only after the user clicks Copy, or a local `.txt` download | Per browser clipboard/download behavior |

Timbre never puts imported audio bytes into `localStorage` or the exported session JSON.

## Network requests

Only the optional demo pair uses application-level network requests:

1. `raw.githubusercontent.com/sgossner/VSCO-2-CE/<pinned-commit>/...wav`
2. `cdn.jsdelivr.net/gh/sgossner/VSCO-2-CE@<pinned-commit>/...wav`

The app does not contact an analytics, AI, telemetry or Timbre-owned backend. Browser extensions, DNS, the browser itself and the hosting environment are outside this application's control.

## User-provided content

Filenames, relative folder paths, goals, observations and desired results can contain personal or confidential information. Review them before:

- exporting a session JSON;
- copying a generated brief;
- sharing a downloaded prompt;
- publishing a screenshot or screen recording.

A local-first design does not prevent a user from copying sensitive text to another service.

## Browser storage

The storage key is `timbre-session-v1`. It is origin-scoped browser storage, not a vault. Clear it through the browser's site-data controls if the browser UI does not provide the desired cleanup behavior.

## Security claims and limits

Timbre does not claim to provide encryption at rest, secure deletion, malware scanning, forensic privacy, metadata removal or isolation from browser extensions. The browser's file decoder and supported codecs remain part of the trusted computing base.
