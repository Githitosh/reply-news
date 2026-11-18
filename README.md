# Reply News

https://githitosh.github.io/reply-news/

A short video of a post on X and a reply to it, made in the browser. Each talk plays as four cards:
the post's first word, the whole post, the whole reply, then the post and the reply together.
Download saves the video as an MP4.

## Where the talks come from

- **The day's talks**, from Reply News' own search data:
  [githito.xapi](https://github.com/Githitosh/githito.xapi). A program there collects talks three
  times a day (6:00, 12:00, 18:00 in Japan) and publishes them as one file, about 500 talks: it
  finds posts with its own words, chooses the talks itself, and saves the words that X's official
  embed API returns for each. The owner can also send talks by hand. The page
  reads that file and searches inside it, so no search is made when a video is wanted. The last file
  read is kept in the browser: the next visit plays at once and reads the new file meanwhile, and the
  file is read again every ten minutes while the page is open.
- **Pasted talks**: the link (or the words) of a post and of a reply, pasted under "Add a talk".
  A link is read through X's official embed API (`publish.x.com/oembed`, no key).

The page connects to nothing else: no search service, no news service, no translation, no font
service. The fonts (Noto Serif JP, Noto Sans JP, Tinos; SIL Open Font License) are in `assets/fonts/`.

## How it is used

The page makes a video by itself. A genre button chooses that genre (lit) and makes a new video;
words typed in the box find the day's talks that say them. Update makes another video, and so does
the end of a video; the next one is chosen and its fonts are fetched while the current one plays.
Items in Settings sets how many cards the day's talks fill (5, 10 or 20).

Settings: layout, color, items, story length, wallpaper, music and language.

## Files

- `src/reply.html`: the page. `src/engine.js`: the video's drawing. `src/ui_ja.js`: Japanese for the page's words.
- `lib/mp4-muxer.js`: MP4 writing (MIT License).
- `assets/`: wallpapers, music and fonts.
- `python3 build.py` writes `index.html` and `version.json`.
