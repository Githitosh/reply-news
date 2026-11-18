# Reply News

https://githitosh.github.io/reply-news/

A short video of a post on X and a reply to it, made in the browser from what you paste.
Each talk plays as four cards: the post's first word, the whole post, the whole reply,
then the post and the reply together. Download saves the video as an MP4.

## No outside services

The page fetches nothing from outside: no search API, no news API, no translation, no font
service. It only loads its own files (this repository, served by GitHub Pages). The fonts
(Noto Serif JP, Noto Sans JP, Tinos; SIL Open Font License) are in `assets/fonts/`.

## How it is used

1. Press a genre (or type words or an @account and press Enter). X's own search opens in a
   new tab, for one of the genre's words, drawn at random each time. Only posts that someone
   replied to are searched (`min_replies:1 -filter:replies`).
2. Copy a post and a reply there.
3. Paste them into Post and Reply (the Paste buttons read what was copied) and press
   Add to the video. A blank line between replies adds more than one.

A post's address or an `@name` line in the pasted text gives the writer's name and the
link shown in the video. The talks are kept in the browser only; the buttons under
"In the video" remove them. A video holds up to 40 cards.

Settings: layout, color, story length, wallpaper, music and language.

## Files

- `src/reply.html`: the page. `src/engine.js`: the video's drawing. `src/ui_ja.js`: Japanese for the page's words.
- `lib/mp4-muxer.js`: MP4 writing (MIT License).
- `assets/`: wallpapers, music and fonts.
- `python3 build.py` writes `index.html` and `version.json`.

The version that searched X through a search API is kept under the tag `with-search-api`.
