# WP Block X‑Ray Vision (Chrome Extension)

Visualize the block structure of WordPress sites that use **block-based themes**.

When enabled, the extension highlights elements whose classes match `wp-block-*` and shows a small label on hover (e.g. `wp-block-group`, `wp-block-columns`) so you can quickly understand how a page is composed.


https://github.com/user-attachments/assets/dd159293-2d4b-4e29-8818-d21d12e0de36



## Features

- **X‑Ray mode toggle** from the extension popup
- **Block outlines** for elements that include `wp-block-*` classes
- **Hover labeling** that displays the detected block class via a tooltip-like tag
- **Nested block friendly**
  - When hovering a child block, the parent’s label is hidden so you see the *most specific* block
  - Parent outlines are reduced to avoid multiple strong outlines overlapping
- **Per-tab state**
  - The enabled/disabled state is stored per browser tab using `chrome.storage.local`

## How it works (implementation overview)

- **Popup UI**: `popup.html`, `popup.css`
  - A simple UI with a single toggle switch.
- **Toggle logic**: `popup.js`
  - Reads the current tab’s saved state from `chrome.storage.local` (keyed by the tab id as a string).
  - On toggle change, saves the new state and injects a function into the active tab via `chrome.scripting.executeScript(...)`.
  - When enabled:
    - Adds `wp-xray-active` to `<body>`
    - Finds every element matching `[class*="wp-block-"]`
    - Extracts the first class that starts with `wp-block-` (excluding the plain `wp-block`) and stores it in `data-block-name`
- **Page styling / labels**: `content.css`
  - Styles only apply when `<body>` has the `wp-xray-active` class.
  - Uses `data-block-name` to show the hover label:
    - `content: "Block: " attr(data-block-name);`

## Install (load unpacked in Chrome)

1. Clone (or download) this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked**.
5. Select the repository folder (the folder containing `manifest.json`).

## Usage

1. Open a WordPress site built with a **block theme**.
2. Click the extension icon to open the popup.
3. Toggle **X‑Ray mode** ON.
4. Hover over page regions to see:
   - a highlighted outline for blocks
   - a label showing the detected block class (e.g. `wp-block-group`)

To disable, toggle X‑Ray mode OFF from the popup.

## Permissions

Defined in `manifest.json` (Manifest V3):

- `activeTab` / `scripting`: to inject the enable/disable logic into the active page
- `storage`: to persist the per-tab toggle state
- Content script CSS runs on `<all_urls>` to provide the X‑Ray styles (they activate only when the `wp-xray-active` class is present).

## Notes / Limitations

- Designed for **WordPress block themes** specifically.
- The extension identifies blocks by scanning for elements with a class containing `wp-block-`. Sites that don’t render blocks with these classes may not show useful results.
- Styling is enabled via the `:has(...)` selector for nested-hover behavior; ensure your target browser supports it (modern Chrome does).

## Files

- `manifest.json` — Chrome extension manifest (MV3)
- `popup.html` / `popup.css` / `popup.js` — popup UI + toggle logic
- `content.css` — X‑Ray styling + hover labels
- `icon.png` — extension icon

<!-- ## License

Add a license if you plan to publish/distribute this extension (MIT is a common choice). -->
