# Reply News

https://githitosh.github.io/reply-news/

A short video of funny X replies about today's news, couples' talk (恋愛) and
posts from famous places (観光), made in the browser. Settings, the item count
(5 / 10 / 20), story length, wallpaper and music are chosen on the page, and
Download saves the video as an MP4.

## The box under the video and the genres

The genres sit under the video; pressing one makes the video again at once.
Type something in the box and press Enter: it joins the genres (lit) and the lineup
in Settings, and the video is made again. Press a lit genre to take it out.

- words (渋谷, 新しいiPhone): posts on X about them that people replied to, each followed by the replies under it
- @account: that account's newest posts, each followed by its replies
- a post's address (https://x.com/…/status/…): that post, then its replies

Only posts and replies that people wrote are shown; the page writes nothing itself.
The same safety rules apply (no violence, no hard news, no ads). Items, story length,
wallpaper and music are in Settings.

## How posts and reports are chosen

No search engine, news aggregator or ad ranking decides what plays. The page uses
its own rules:

- **X** (on at the start): posts and replies found by X search for words of each
  genre (one word drawn at random per genre), a free request typed in the lineup,
  or an added account. Jokes, couples' talk and travel posts are chosen by this
  page's own word rules, never by likes or views.
- **Web** (off at the start) and **media typed in** (a site's address, like
  asahi.com): reports from GDELT, an open database of news from sites around the
  world, newest first, and Wikipedia's current events, written by volunteers.
- Every genre gets the same share, one site gives at most two reports (more only
  when few sites are chosen), and the reports are drawn at random.
- Nothing that has played is stored: only what played in this visit is skipped.

Google Fonts (the typefaces) and Google's translation service (only when a post
is in the other language) are the remaining outside services; neither chooses
what plays.

## Files

- `index.html` – the page, built by `build.py` (one self-contained file)
- `version.json` – the build id; an old copy kept by the browser loads the new one
- `terms.html` – the terms of use (Japanese, then English), linked under the genres and in Settings
- `src/reply.html` – the page source
- `src/engine.js` – draws the video (1080×1920 portrait, 1920×1080 landscape)
- `src/ui_ja.js` – Japanese for the page's own words
- `lib/mp4-muxer.js` – MP4 export (MIT License, see `lib/mp4-muxer.LICENSE`)
- `assets/` – wallpapers and music (public domain recordings)

## Build

    python3 build.py

Then commit `index.html` and `version.json`. GitHub Pages serves the repository root.
