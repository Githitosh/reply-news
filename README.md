# Reply News

https://githitosh.github.io/reply-news/

A short video of a post on X and a reply to it, made in the browser. Each talk is one set of three
cards: a word taken out of the post, alone and as large as the picture allows; the whole post; the
same post shown small with the reply under it, large. The three cards of a set keep one photo and one
number (1 of 6), and no word is flashed before the text. A video joins six sets.
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

## Matching News

The page opens in **Matching**: two short posts by two different people are shown together at random,
the way a matching app puts two people together (for example 好きだよ with 私も, or ディズニーシーで迷子 with 今USJ).

- Genre buttons show in Replies only.
- The data is `v1/match-<lang>.json` in githito.xapi: about 2000 short sayings gathered with random
  searches (fxtwitter for discovery only; the words saved come from X's official embed API), filtered in
  three stages, then combined into `pairs` (echo, kin, mismatch, random, and similar rules in
  `rules.mjs`). The page draws from those pairs; it does not search or match at play time.
- The two were not written to each other, and are never the same person.
- Every card that shows a post or a reply says ランダムマッチング (Random match), the last card of a match names both people
  (`X @a × @b`), and under the video there are two links, one to each person's own post.
- The **Replies** button goes back to Reply News: the replies really written to each post.
- **Send to the two** (under a match): a first press makes a video of that one set; a second press opens
  the viewer's own X with the video and with words that name both people and link their two posts
  (the share sheet on a phone; on a computer the video is downloaded and X's post window opens). The
  page sends nothing by itself: the viewer reads the post and sends it. An automatic sender is not
  built on purpose: unasked mentions by a program are spam by X's rules.

## How it is used

The page makes a video by itself. A genre button chooses that genre (lit) and makes a new video;
words typed in the box find the day's talks that say them. Update makes another video, and so does
the end of a video; the next one is chosen and its fonts are fetched while the current one plays.
Sets in Settings chooses how many sets a video joins (3, 6 or 10; six unless changed).

Settings: layout, color, items, story length, wallpaper, music and language.

## Files

- `src/reply.html`: the page. `src/engine.js`: the video's drawing. `src/ui_ja.js`: Japanese for the page's words.
- `lib/mp4-muxer.js`: MP4 writing (MIT License).
- `assets/`: wallpapers, music and fonts.
- `python3 build.py` writes `index.html` and `version.json`.
