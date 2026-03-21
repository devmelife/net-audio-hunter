# NetAudio Hunter

A Chrome extension that detects and captures audio streams from network traffic.

---

## Features

- Detects audio files from network traffic
- Supports `.aac`, `.mp3`, `.m4a`, `.wav`, `.ogg` formats
- Play or pause captured audio directly from the popup
- Download captured audio files
- Toggle capture on and off
- Restricted to a specific domain for focused, clean usage

---

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer Mode** (toggle on the top right)
4. Click **Load unpacked**
5. Select the project folder

---

## Files

| File | Description |
|------|-------------|
| `manifest.json` | Extension configuration and permissions |
| `background.js` | Listens for audio network requests |
| `popup.html` | Extension UI |
| `popup.js` | Popup logic and audio controls |

---

## Usage

1. Navigate to the supported website
2. Click the **NetAudio Hunter** icon in your Chrome toolbar
3. Browse and play music
4. Captured audio will appear in the popup list
5. Click the **play button** to preview
6. Click the **download button** to save

---

## Notes

- This extension only works on a specific domain
- Opening the popup on any other website will show a disabled state
- History stores up to the last **50 captured audio files**
- Clearing history also stops any currently playing audio

---

## Tech Stack

- JavaScript (Vanilla)
- Chrome Extensions Manifest V3
- Chrome APIs: `webRequest`, `storage`, `tabs`, `downloads`

---

## License

MIT License — free to use and modify.
