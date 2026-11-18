# Reply News

https://githitosh.github.io/reply-news/

A short video of funny X replies about today's news, couples' talk (恋愛) and
posts from famous places (観光), made in the browser. Settings, the item count
(5 / 10 / 20), story length, wallpaper and music are chosen on the page, and
Download saves the video as an MP4.

## Files

- `index.html` – the page, built by `build.py` (one self-contained file)
- `version.json` – the build id; an old copy kept by the browser loads the new one
- `src/reply.html` – the page source
- `src/engine.js` – draws the video (1080×1920 portrait, 1920×1080 landscape)
- `src/ui_ja.js` – Japanese for the page's own words
- `lib/mp4-muxer.js` – MP4 export (MIT License, see `lib/mp4-muxer.LICENSE`)
- `assets/` – wallpapers and music (public domain recordings)

## Build

    python3 build.py

Then commit `index.html` and `version.json`. GitHub Pages serves the repository root.
