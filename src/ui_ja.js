/* Japanese for the page's own words (buttons, settings, messages) when Language is Japanese.
   The video's text follows the Language setting on its own; this covers the page around it.
   Every text node is translated as it appears, so words that the code sets later
   (Pause, Creating…, Searching NHK) change too. The English is kept and comes back
   when another language is chosen. */
(function (global) {
'use strict';

const JA = {
  // The day's talks
  "Search today's talks": '今日の会話から探す',
  "Today's talks have not arrived yet. Paste the link of a post and of a reply below, or come back later.": '今日の会話データがまだ届いていません。下に投稿とリプライのリンクを貼るか、あとでもう一度開いてください。',
  "No talks of this genre in today's data yet.": 'このジャンルの会話は、今日のデータにまだありません。',
  "No talks say that in today's data.": 'その言葉が入った会話は、今日のデータにありません。',
  // Pasting posts
  'Find on X': 'Xで探す', 'Words or @account': '言葉・@アカウント', 'Add a talk': '会話を追加', 'In the video': '動画に入っている会話（押すと消えます）',
  'Post': '投稿', 'Reply': 'リプライ', 'Paste': '貼り付け', 'Add to the video': '動画に追加',
  'Paste the post or its link': '投稿のリンクか、投稿の文を貼り付け', 'Paste the reply or its link': 'リプライのリンクか、リプライの文を貼り付け',
  'Reading from X…': 'Xから読み込んでいます…', 'Could not read the post from its link. Paste its words instead.': 'リンクから投稿を読めませんでした。投稿の文を貼り付けてください。',
  'Press a genre to open the search on X. Copy the links of a post and a reply there, then paste them here.': 'ジャンルを押すと、Xの検索が開きます。そこで投稿とリプライのリンクをコピーして、ここに貼り付けてください。',
  'Opened X. Copy the links of a post and a reply there, then paste them here.': 'Xを開きました。投稿とリプライのリンクをコピーして、ここに貼り付けてください。',
  'Paste the post first.': '先に投稿を貼り付けてください。', 'Removed.': '消しました。',
  'Could not read what was copied. Press and hold the box and choose Paste.': 'コピーした内容を読めませんでした。入力欄を長押しして「貼り付け」を選んでください。',
  // Header and buttons
  'Shibuya': '渋谷', '2002 World Cup final': '2002年のワールドカップ決勝',
  'At the end': '最後まで再生したら', 'Repeat': '繰り返す', 'Update speed': '更新の速さ', 'Normal': 'ふつう', 'Fast': '高速',
  'Add an account to load its posts and the replies to them.': 'アカウントを追加すると、そのアカウントの投稿と、返信を読み込みます。',
  'Web': 'ウェブ', 'Media': 'メディア', 'Public page:': '公開ページ：', 'Replies': 'リプライ', 'Clear': '消す', 'Reading the post': '投稿を読み込んでいます',
  'Words, @account or post URL': '言葉・@アカウント・URL', 'Program repository:': 'プログラムの保存先：', 'Terms of use': '利用規約', 'Searching the web': 'ウェブを探しています',
  'Reply News': 'リプライニュース', 'Reply News settings': 'リプライニュースの設定', 'Opening Reply News…': 'リプライニュースを開いています…',
  'Humor': 'ユーモア', 'News': 'ニュース', 'Pull down to refresh': '引っ張って更新', 'Release to refresh': '離すと更新',
  'Back to video': '動画に戻る', 'Play': '再生', 'Pause': '一時停止', 'Update': '更新', 'Creating…': '作成中…',
  'Full screen': '全画面', 'Exit': '全画面を終了', 'Sound': '音', 'Tap for sound': 'タップで音が出ます',
  'Story length': '1話の長さ', 'Wallpaper': '壁紙', 'Music': '音楽', 'Items': '表示数',
  'Download': 'ダウンロード', 'Saving…': '保存中…', 'Could not save the video.': '動画を保存できませんでした。', 'Making MP4…': '作成中…', 'Save': '保存',
  'The search on X is busy. This video keeps playing; a new one comes in a minute or two.': 'Xの検索が混み合っています。この動画を流し続け、1〜2分後に新しい動画を作ります。',
  'The search on X is busy. Press Update in a minute or two.': 'Xの検索が混み合っています。1〜2分後に「更新」を押してください。',
  'The MP4 is ready. Press Save to keep it.': 'MP4ができました。「保存」を押すと保存できます。',
  'Choose Save Video to keep it.': '「ビデオを保存」を選ぶと保存できます。', 'Not saved yet. Press Save again.': 'まだ保存されていません。もう一度「保存」を押してください。',
  'If the video was not saved, open this page in Safari or Chrome and try again.': '保存されないときは、このページを Safari か Chrome で開いて、もう一度お試しください。',
  'Each story is 3.2 seconds. 4.2s and 5.2s add one or two seconds.': '1話は3.2秒です。4.2秒と5.2秒は1〜2秒長くなります。',
  'Opening the news video…': 'ニュース動画を開いています…', 'Opening the humor video…': 'ユーモア動画を開いています…',
  // Wallpapers and music
  'Morning': '朝', 'Bright': '明るい', 'Day': '昼', 'Evening': '夕方', 'Night': '夜', 'Pop': 'ポップ',
  'Jupiter': '木星', 'Neptune': '海王星', 'Stars and Stripes': '星条旗よ永遠なれ',
  // Settings
  'News settings': 'ニュースの設定', 'Humor settings': 'ユーモアの設定',
  'These settings are for News only. Humor keeps its own.': 'この設定はニュース専用です。ユーモアには別の設定があります。',
  'These settings are for Humor only. News keeps its own.': 'この設定はユーモア専用です。ニュースには別の設定があります。',
  'Color': '色', 'White': '白', 'Beige': 'ベージュ', 'Pink': 'ピンク', 'Sky blue': '水色', 'Mint': 'ミント', 'Dark': 'ダーク',
  'Travel': '観光',
  'Layout': 'レイアウト', 'Auto': '自動', 'Phone': 'スマホ', 'X': 'X', 'YouTube': 'YouTube', 'PC': 'PC',
  'Country': '国', 'Japan': '日本', 'United States': 'アメリカ',
  'Language': '言語', 'English': '英語', 'Japanese': '日本語', 'Both': '両方',
  'Feed': '内容', 'X posts': 'Xの投稿', 'X comments only': 'Xのコメントだけ', 'News, then comments': 'ニュースのあとにコメント',
  'News plays the reports, with no comments. A story that has played does not play again. X posts skips the news and plays posts from the lineup and the accounts below. Japanese text is shown large.':
    'ニュースは報道だけを流し、コメントは入りません。一度流したニュースは二度と流しません。Xの投稿を選ぶと、ニュースは流さず、ラインナップと下のアカウントの投稿を流します。日本語は大きな文字で表示します。',
  "X comments only (the default) plays funny replies on X about today's news in the genres you choose, the lineup, and the accounts below. News, then comments plays the reports first. A comment or story that has played does not play again. Japanese text is shown large.":
    'Xのコメントだけ（初期設定）は、選んだジャンルの今日のニュース、ラインナップ、下のアカウントについての、Xのおもしろい返信を流します。ニュースのあとにコメントを選ぶと、先にニュースを流します。一度流したコメントやニュースは二度と流しません。日本語は大きな文字で表示します。',
  'Genres': 'ジャンル', 'Lineup': 'ラインナップ', 'Apply lineup': 'ラインナップを反映',
  'One request on each line. The number of stories comes from Items under the video.':
    '1行に1つずつ書きます。本数は動画の下の「表示数」で決まります。',
  "One request on each line: a genre, or anything you like, such as a place or an event (Shibuya, 2002 World Cup final). The video then plays posts on X about it. Jokes sets where the jokes play. Romance adds couples' talk, marked 恋愛 in the corner, and Travel adds what people said at famous places, marked 観光. Each comment shows its short part first, then the whole comment. What is typed in the box under the video is added here, and the video is made again. A word, an @account or a post's address plays the posts with the replies under them. The number of items comes from Items in these settings. Leave the lineup empty for a mix of all genres.":
    '1行に1つずつ書きます。ジャンルのほか、場所や出来事など何でも書けます（例：渋谷、2002年のワールドカップ決勝）。書いたことについてのXの投稿を流します。「ジョーク」はジョークを入れる位置を決めます。「恋愛」はカップルの会話を入れ（右上に「恋愛」と表示）、「観光」は観光地での投稿を入れます（右上に「観光」と表示）。コメントは、まず短いひと言を出し、次にコメント全体を出します。動画の下の入力欄に書いた言葉はここに追加され、動画を作り直します。言葉・@アカウント・投稿のURLは、その投稿と下に付いたリプライを流します。本数は設定の「表示数」で決まります。空にすると全ジャンルから選びます。',
  'Space': '宇宙', 'Politics': '政治', 'Science': '科学', 'Culture': '文化', 'Local': '地域', 'Entertainment': 'エンタメ',
  'Public safety': '治安', 'Sports': 'スポーツ', 'Food': '食', 'Restaurant': 'レストラン', 'Romance': '恋愛',
  'Musk X': 'マスク氏のX', 'SpaceX': 'SpaceX', 'Nikkei': '日経', 'ABC': 'ABC', 'Jokes': 'ジョーク',
  'Top': '先頭', 'Middle': '中ほど', 'Bottom': '最後',
  'Turn violence off': '暴力的な内容を出さない',
  'Hide violence': '暴力を非表示', 'Hide sensitive posts': 'センシティブを非表示',
  'A lit button hides those posts.': '色が付いたボタンの内容は表示しません。',
  "Sensitive posts play at the start: couples' talk in Romance may be suggestive or sexual; jokes and places stay clean. Light Hide sensitive posts to leave them out everywhere. Violence and hard news such as deaths, accidents, disasters, illness, bullying and discrimination never play.":
    '最初はセンシティブな投稿も出します。恋愛のカップルの会話に限って、きわどい内容や性的な内容も出ます（ジョークと観光には出ません）。「センシティブを非表示」を点けると、どこにも出しません。暴力や、死亡・事故・災害・病気・いじめ・差別などの重い話題は、設定にかかわらず出しません。',
  'Sources': '情報源', 'X and web': 'Xとウェブ', 'Other web': 'その他のウェブ', 'International': '海外', 'Japanese media': '日本のメディア',
  'Reuters': 'ロイター', 'Associated Press': 'AP通信', 'BBC': 'BBC', 'CNN': 'CNN', 'The New York Times': 'ニューヨーク・タイムズ',
  'NHK': 'NHK', 'Asahi Shimbun': '朝日新聞', 'Yomiuri Shimbun': '読売新聞',
  'X accounts': 'Xアカウント', 'Add': '追加',
  'Add an account to load its posts. Press Add again for another account. Press a name to remove it.':
    'アカウントを追加すると、その投稿を読み込みます。別のアカウントは、もう一度「追加」を押します。名前を押すと外せます。',
  'Add an account to load funny replies to its posts. Press Add again for another account. Press a name to remove it.':
    'アカウントを追加すると、その投稿へのおもしろい返信を読み込みます。別のアカウントは、もう一度「追加」を押します。名前を押すと外せます。',
  'Date': '日付', 'Export MP4 files after the stories are ready': '動画ができたらMP4ファイルを書き出す',
  'Formats to export': '書き出す形式',
  'Phone and X (portrait 1080×1920)': 'スマホとX（縦 1080×1920）',
  'YouTube (portrait 1080×1920, room for buttons)': 'YouTube（縦 1080×1920、ボタン用の余白あり）',
  'PC (landscape 1920×1080)': 'PC（横 1920×1080）',
  'Collect and play': '集めて再生',
  'Forget what has played (stories and jokes can play again)': '流したものを忘れる（ニュースやジョークをまた流せるようにする）',
  'Script (JSON)': 'スクリプト（JSON）', 'Apply script': 'スクリプトを反映', 'Export MP4': 'MP4を書き出す',
  'Sample (Nov 14)': 'サンプル（11月14日）', 'Copy sources': '情報源をコピー',
  // Messages
  'Searching the news': 'ニュースを探しています', 'Searching comments': 'コメントを探しています', 'Searching X': 'Xを探しています',

  'Reading the text': '文章を読み込んでいます', 'Reading genres, sources, and X accounts': 'ジャンル、情報源、Xアカウントを読み込んでいます',
  'Eight accounts is the limit': 'アカウントは8つまでです', 'Use an X account name, like @name': 'Xのアカウント名を入れてください（例：@name）',
  'Copied the sources.': '情報源をコピーしました。', 'Could not copy.': 'コピーできませんでした。', 'Select the text instead.': '文字を選んでコピーしてください。',
  'Paused.': '一時停止中。', 'Press Play to continue.': '再生を押すと続きから流れます。',
  'Tap the video or press Play to continue.': '動画をタップするか再生を押すと続きから流れます。', 'Playing.': '再生中。',
  'Ready.': '準備ができました。', 'Press Play.': '再生を押してください。',
  'Sound off.': '音を消しました。', 'Press Sound to hear the music.': '音を押すと音楽が流れます。', 'Press Sound for music.': '音を押すと音楽が流れます。',
  'Tap the picture for sound.': '画面をタップすると音が出ます。',
  'Refreshing.': '更新しています。', 'The stories and their order change.': 'ニュースと順番が変わります。',
  'No new stories yet.': 'まだ新しいニュースがありません。', 'No new stories or jokes yet.': 'まだ新しいニュースやジョークがありません。',
  'No new stories for this lineup yet.': 'このラインナップの新しいニュースはまだありません。', 'No new X posts yet.': 'まだ新しいXの投稿がありません。',
  'Press Update again later.': 'しばらくしてから更新を押してください。', 'This video keeps playing.': 'この動画を流し続けます。',
  'Add an X account in Settings.': '設定でXアカウントを追加してください。', 'Choose at least one genre in Settings.': '設定でジャンルを1つ以上選んでください。',
  'Jupiter plays instead.': '木星を流します。', 'Forgot what has played.': '流したものを忘れました。', 'Stories and jokes can play again.': 'ニュースやジョークをまた流せます。',
  'This browser cannot export video.': 'このブラウザでは動画を書き出せません。', 'The script has no stories': 'スクリプトにニュースがありません',
  'Could not collect headlines.': '見出しを集められませんでした。', 'Press Update to try again.': '更新を押してもう一度試してください。',
};
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const PATTERNS = [
  [/^Auto \((.+)\)$/, m => `自動（${tr(m[1])}）`],
  [/^(\d+(?:\.\d+)?)s$/, m => `${m[1]}秒`],
  [/^Save (.+)$/, m => `${tr(m[1])}を保存`],
  [/^Share (.+)$/, m => `${tr(m[1])}を共有`],
  [/^Searching (.+)$/, m => `${tr(m[1])}を探しています`],
  [/^No replies found for “(.+)”\. Try other words\.$/, m => `「${m[1]}」へのリプライは見つかりませんでした。別の言葉で試してください。`],
  [/^Adding (.+)$/, m => `${tr(m[1])}を追加しています`],
  [/^Reading (.+)$/, m => `${m[1].split(', ').map(tr).join('、')}を読み込んでいます`],
  [/^Loading (@\w+)$/, m => `${m[1]}を読み込んでいます`],
  [/^Removed (@\w+)$/, m => `${m[1]}を外しました`],
  [/^Removed (.+)$/, m => `${m[1]}を外しました`],
  [/^Added (.+)$/, m => `${m[1]}を追加しました`],
  [/^Already added (@\w+)$/, m => `${m[1]}はもう追加されています`],
  [/^No posts from (.+) yet$/, m => `${m[1]}の投稿はまだありません`],
  [/^Could not read the JSON: (.*)$/, m => `JSONを読めませんでした：${m[1]}`],
  [/^Export failed: (.*)$/, m => `書き出しに失敗しました：${m[1]}`],
  [/^Exporting (.+)… (\d+)%$/, m => `${tr(m[1])}を書き出し中… ${m[2]}%`],
  [/^Recording… (\d+)%$/, m => `録画中… ${m[1]}%`],
  [/^Exported: (.*)$/, m => `書き出しました：${m[1]}`],
  [/^Downloaded (.+)$/, m => `${m[1]}をダウンロードしました`],
  [/^Saved to Downloads: (.+)$/, m => `「ダウンロード」フォルダに保存しました：${m[1]}`],
  [/^Saved to (.+)$/, m => `${m[1]}に保存しました`],
  [/^Saved (.+)$/, m => `${m[1]}を保存しました`],
  [/^Could not load news \((\d+)\)\.$/, m => `ニュースを読み込めませんでした（${m[1]}）。`],
  [/^Could not load (.+?)\.?$/, m => `${tr(m[1])}を読み込めませんでした。`],
  [/^Script loaded \((\d+) stories, ([\d.]+)s\)\.$/, m => `スクリプトを読み込みました（${m[1]}本、${m[2]}秒）。`],
  [/^Playing the (\w+) (\d+), (\d{4}) news video\.$/, m => `${m[3]}年${MONTHS.indexOf(m[1]) + 1}月${m[2]}日のニュース動画を再生中。`],
  [/^Playing (\d+) stor(?:y|ies), then (\d+) comments?\.$/, m => `ニュース${m[1]}本のあと、コメント${m[2]}件を再生中。`],
  [/^Playing (\d+) comments?\.$/, m => `コメント${m[1]}件を再生中。`],
  [/^Playing (\d+) stor(?:y|ies)\.$/, m => `ニュース${m[1]}本を再生中。`],
];
function one(text) {
  if (Object.prototype.hasOwnProperty.call(JA, text)) return JA[text];
  for (const [re, fn] of PATTERNS) { const m = text.match(re); if (m) return fn(m); }
  return null;
}
/* The whole text, or each sentence of it. Anything unknown stays in English. */
function tr(text) {
  const t = String(text || '').trim();
  if (!t) return t;
  const whole = one(t);
  if (whole != null) return whole;
  const parts = t.replace(/([.!?])\s+/g, '$1\u0000').split('\u0000');
  if (parts.length < 2) return t;
  return parts.map(p => { const x = one(p); return x != null ? x : p; }).join('');
}

const SKIP = 'script, style, textarea, canvas, pre, #time, #storyLink, .source-url, #xAccounts, [data-noi18n]';
let lang = () => 'en';
let busy = false;
function wantJa() { try { return lang() === 'ja'; } catch (e) { return false; } }
function setNode(node, ja) {
  const parent = node.parentElement;
  if (!parent || parent.closest(SKIP)) return;
  const raw = node.nodeValue;
  /* Text we put there ourselves keeps its English; anything else is new English from the page. */
  if (node.__shown === undefined || raw !== node.__shown) node.__en = raw;
  const en = node.__en;
  const lead = en.match(/^\s*/)[0], tail = en.match(/\s*$/)[0], core = en.trim();
  if (!core) return;
  const out = ja ? lead + tr(core) + tail : en;
  if (out !== raw) { node.__shown = out; node.nodeValue = out; }
  else node.__shown = raw;
}
function walk(root, ja) {
  if (!root) return;
  if (root.nodeType === 3) { setNode(root, ja); return; }
  const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = it.nextNode())) setNode(n, ja);
}
function placeholders(ja) {
  document.querySelectorAll('textarea[placeholder], input[placeholder]').forEach(el => {
    if (el.dataset.phEn === undefined) el.dataset.phEn = el.getAttribute('placeholder');
    const en = el.dataset.phEn;
    el.setAttribute('placeholder', ja ? en.split('\n').map(line => {
      const m = line.match(/^(.*?),\s*(\d+)$/);
      return m ? `${tr(m[1])}, ${m[2]}` : tr(line);
    }).join('\n') : en);
  });
}
function apply() {
  const ja = wantJa();
  document.documentElement.lang = ja ? 'ja' : 'en';
  busy = true;
  walk(document.body, ja);
  placeholders(ja);
  busy = false;
}
function start(getLang) {
  lang = getLang || lang;
  apply();
  const obs = new MutationObserver(list => {
    if (busy) return;
    const ja = wantJa();
    busy = true;
    for (const m of list) {
      if (m.type === 'characterData') setNode(m.target, ja);
      else m.addedNodes.forEach(n => { if (n.nodeType === 3 || n.nodeType === 1) walk(n, ja); });
    }
    busy = false;
  });
  obs.observe(document.body, { subtree: true, childList: true, characterData: true });
}

global.UIJA = { start, apply, tr };
})(window);
