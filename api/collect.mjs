#!/usr/bin/env node
/* Reply News' own data service.

   It asks X's official API (v2, recent search) for people's posts about the genres' words, reads the
   replies under each, keeps the pairs that make a good talk (a person's post, then a lively reply),
   and writes them to api/v1/talks-<language>.json. The page reads those files from its own site.
   No other service is used, and the page itself never calls X.

     X_BEARER_TOKEN=...  node api/collect.mjs            collect once (Japanese)
     node api/collect.mjs --langs ja,en                  both languages
     node api/collect.mjs --dry                          print what would be written, change nothing

   Without X_BEARER_TOKEN it changes nothing and says what is missing.
   Node 20 or newer; no packages to install. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'v1');
const args = process.argv.slice(2);
const flag = name => args.includes('--' + name);
const opt = (name, d) => { const i = args.indexOf('--' + name); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const num = (name, d) => { const v = Number(process.env['TALKS_' + name.toUpperCase()] || opt(name, d)); return Number.isFinite(v) && v > 0 ? v : d; };

/* How much is asked of X in one run. X counts every post it returns, so these stay small:
   words x results + posts x replies posts are read (4 x 30 + 6 x 10 = 180 with the values below). */
const CONF = {
  api: (process.env.X_API_BASE || 'https://api.x.com/2').replace(/\/+$/, ''),
  token: process.env.X_BEARER_TOKEN || '',
  langs: String(process.env.TALKS_LANGS || opt('langs', 'ja')).split(',').map(s => s.trim()).filter(l => l === 'ja' || l === 'en'),
  words: num('words', 4),        // genres searched in a run, one word each
  results: num('results', 30),   // posts asked for in each search (10 to 100)
  posts: num('posts', 6),        // posts whose replies are read
  replies: num('replies', 10),   // replies asked for under each post (10 to 100)
  keepDays: num('keepdays', 3),  // a talk leaves the file after this many days
  keepMax: num('keepmax', 200),  // and the file holds at most this many
  dry: flag('dry'),
};

/* ---------- what may play: the same rules the page used ---------- */
const VIOLENT = /murder|stabbed|shot dead|shooting|killed|beheading|homicide|massacre|rape|sexual assault|robbery|凶悪|殺人|殺害|刺殺|遺体|刺され|死傷|銃乱射|暴行|強盗|レイプ|強姦/i;
const HEAVY = /(?:^|[^必])死(?!ぬほど|ぬかと|んだ笑)|亡くな|遺体|事故|災害|震災|地震|津波|火災|病気|闘病|入院|がん(?!ば|が)|癌|自殺|自死|いじめ|虐待|差別|\bdied\b|\bdeath\b|\bcrash\b|\bdisaster\b|\bcancer\b|\bsuicide\b|\bbull(?:y|ied|ying)\b|\bracis/i;
const SUGGESTIVE = /🔞|🍆|🍑|😏|💋|👅|寝かさない|抱いて|抱かれ|夜這い|ベッドで|一緒にお風呂|色っぽ|セクシー|えちえち|\bsexy\b|\bspicy\b|\bnaughty\b|\bin bed\b/i;
const ADULT = /セックス|エッチ|えっち|ｴｯﾁ|エロ|下ネタ|ヤる|ヤれ|体位|下着|裸|おっぱい|乳首|ちんこ|ちんちん|まんこ|射精|中出し|勃起|ムラムラ|性欲|童貞|処女|ラブホ|\bsex|nsfw|nude|naked|horny|kinky/i;
const NEVER = /ヤリモク|風俗|パパ活|ママ活|援交|AV女優|アダルト|porn|onlyfans|中学|小学|ＪＫ|ＪＣ|ＪＳ|\bJ[KCS]\b|高校生|女子高生|男子高生|未成年|ロリ|ショタ|\bteen|high school|middle school|underage|\bloli|\bshota|ＤＶ|\bDV\b|モラハラ|殴られ|abuse|レイプ|強姦|無理やり|盗撮|痴漢/i;
const UNSAFE = new RegExp(ADULT.source + '|' + NEVER.source, 'i');
const MINOR_BIO = /(?:^|[^0-9])1[0-7]\s*(?:歳|才|y\/?o\b|years? old)|高[1-3１-３一二三](?:$|[^0-9０-９])|中[1-3１-３一二三](?:$|[^0-9０-９])|高校生|中学生|ＪＫ|ＪＣ|\bJ[KC]\b|\bminor\b|\bunder ?18\b|\bteen\b/i;
const AD = /PR|広告|キャンペーン|プレゼント企画|応募|フォロー[&＆]|RTで|リツイートで|セール|クーポン|予約受付|販売中|\bgiveaway\b|\bsale\b|\bpromo\b|\bdiscount\b|\bsponsored\b/i;
const TOXIC = /バカ|ばか(?!り)|馬鹿|アホ|あほ(?!う)|阿呆|クズ|カス(?![タテ])|キモ[いイッ]|きも[いっ]|気持ち悪|気色[わ悪]|ウザ|うざ[いっ]|消えろ|黙れ|だまれ|お前|おまえ|てめ[えぇー]|貴様|低脳|低能|無能|老害|痴呆|キチガイ|ガイジ|チー牛|ブス|デブ|ババア|ジジイ|嘘つき|ウソつき|うそつき|捏造|売国|反日|左翼|右翼|パヨク|ネトウヨ|恥を知|頭悪|頭おかし|\b(?:idiot|stupid|moron|dumb|loser|trash|shut up|stfu|libtard|clown)\b/i;
const GREET = /^[\s\p{Extended_Pictographic}️]*(?:おは|オハ|こんにち|こんばん|おやす|おつ|お疲れ|おめで|ありがと|はじめまして|初めまして|good morning|gm\b|good night|congrat|thank)|良い一日|よい一日|良い1日|素敵な(?:一日|1日|週末)|今日も(?:一日|1日)?(?:頑張|がんば|よろしく)|よろしくお願い|フォロー(?:ありがとう|失礼|させて)|have a (?:great|good|nice) day/iu;
const GLOOM = /骨折|折って|怪我|ケガ|手術|通院|発熱|インフル|コロナ|訃報|葬儀|お葬式|遺影|倒産|解雇|失業|借金|離婚|亡き|\b(?:injur|surgery|funeral|divorce|laid off|fired)\w*/i;
const OFFICIAL = /公式|official|ニュース|新聞|news|報道|速報|通信社|放送|テレビ|編集部|広報|株式会社|\bbot\b|情報局|まとめ|運営|事務局|shop|store/i;
const POLITE = /素敵|楽しみ|頑張って|がんばって|お気をつけ|気をつけて|大変です|お疲れ|おつかれ|お大事|ゆっくり|楽しんで|いってらっしゃい|行ってらっしゃい|大丈夫[？?]|ですね[…。！!✨😊☺️🥰]*$|いいですね|良いですね|羨まし|うらやまし|\b(?:lovely|beautiful|so nice|well done|great job)\b/i;
const ZEST = {
  ja: /なんよ|なんだが|してしまっ|しまった|のに|なぜ|なんで|まさか|結局|気になる|わからん|分からん|無理|やばい|ヤバ|つら|詰んだ|終わった|泣|忘れ|寝坊|間違え|気づいた|気付いた|って何|[？?]|💦|😱|😇|🫠|🥲/,
  en: /\b(?:why|somehow|accidentally|forgot|again|help|can't|cannot|never|nobody|apparently|turns out)\b|[?]/i,
};
const QUIP = {
  ja: /かい[！!ｗw笑]*$|やん|やろ|やねん|じゃん|すぎ|なんで|なぜ|それな|まさか|だったんだ|じゃないの|のでは|ってこと|[？?]+[\s\p{Extended_Pictographic}️]*$|[wｗ]+$/u,
  en: /\b(?:wait|bro|nah|same|literally|imagine|plot twist|so you|not the)\b|[?]+\s*$/i,
};
const CJK = /[぀-ヿ一-鿿]/;
const charLen = t => [...String(t || '')].length;
const squash = t => String(t || '').toLowerCase().replace(/[\s　"'“”‘’「」『』（）()\[\]【】、。，．,.!?！？…・:：;；\-–—~〜ｗw]+/g, '');
function isFunny(text, lang) {
  if (lang === 'en') return /\b(lol|lmao|lmfao|rofl|haha\w*|hilarious|i'?m dead|dying)\b|😂|🤣|💀|😆/i.test(text);
  const t = String(text || '').replace(/笑顔|笑み|民草|草の根/g, '');
  return /笑|ワロタ|ワロ[^ッ]|草草|(?:^|[\s　、。！？(（])草(?:$|[\s　、。！？)）])|[てでにのが]草(?=$|[\s　、。！？)）ｗw]|$)|ｗ{2,}|w{2,}|😂|🤣|😆|😅|面白い|冗談|ウケる/.test(t);
}
/* The words of a post: addresses, @names and hashtags are left out. */
function plain(raw) {
  return String(raw || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/https?:\/\/\S+/g, ' ').replace(/@\w+/g, ' ').replace(/[#＃]\S+/g, ' ').replace(/\s+/g, ' ').trim();
}
const rawText = t => (t && t.note_tweet && t.note_tweet.text) || (t && t.text) || '';
const refs = (t, type) => ((t && t.referenced_tweets) || []).filter(r => r.type === type).map(r => r.id);
function safe(text, t) {
  return !!text && !UNSAFE.test(text) && !VIOLENT.test(text) && !HEAVY.test(text) && !SUGGESTIVE.test(text)
    && !(t && t.possibly_sensitive) && !AD.test(rawText(t)) && !TOXIC.test(text);
}
const minor = u => MINOR_BIO.test(String((u && u.description) || '') + ' ' + String((u && u.name) || ''));
/* Media, companies and offices do not open a talk: the first post is a person's own words. */
function personal(u) {
  if (!u || u.protected) return false;
  if (u.verified_type === 'business' || u.verified_type === 'government') return false;
  return !OFFICIAL.test(String(u.name || '') + ' ' + String(u.username || ''));
}
/* A post that can open a talk: a person's own post (not a reply, a repost or a quote), answered by
   someone, short enough to read whole. */
function talkPost(t, u, lang) {
  if (!t || !u || refs(t, 'replied_to').length || refs(t, 'quoted').length || refs(t, 'retweeted').length || t.in_reply_to_user_id) return null;
  if (!personal(u) || minor(u)) return null;
  const raw = rawText(t);
  if (/^\s*[>＞]|\n\s*[>＞]/.test(raw)) return null;
  const text = plain(raw);
  const n = charLen(text);
  if (n < (lang === 'en' ? 12 : 10) || n > (lang === 'en' ? 220 : 110)) return null;
  if (lang === 'en' ? !/[A-Za-z]{3,}/.test(text) : (text.match(/[぀-ヿ]/g) || []).length < 4) return null;
  if (!safe(text, t) || GREET.test(text) || GLOOM.test(text)) return null;
  const m = t.public_metrics || {};
  if (!(m.reply_count > 0)) return null;
  /* A few words beside a picture say little without it. */
  if (t.attachments && (t.attachments.media_keys || []).length && n < 20) return null;
  return { id: t.id, handle: u.username, text, url: 'https://x.com/' + u.username + '/status/' + t.id, at: t.created_at || '' };
}
/* How lively a post is: a little trouble, a question or a laugh draws funny replies. */
function zest(text, t, u, lang) {
  let s = 0;
  if (isFunny(text, lang)) s += 2;
  if (ZEST[lang].test(text)) s += 3;
  const rep = (t.public_metrics && t.public_metrics.reply_count) || 0;
  s += Math.min(3, Math.log2(1 + rep));
  if (rep > 60) s -= 3;
  if (charLen(text) <= (lang === 'en' ? 120 : 60)) s += 2;
  if (((u.public_metrics && u.public_metrics.followers_count) || 0) > 200000) s -= 3;
  return s;
}
/* The replies said to the post itself, the ones with a punch first: a retort, a question back, a laugh.
   Greetings and polite small talk are left out. */
function pickReplies(post, list, users, lang) {
  const picks = [];
  list.forEach(t => {
    const u = users.get(t.author_id);
    if (!u || u.protected || minor(u) || u.username.toLowerCase() === post.handle.toLowerCase()) return;
    if (refs(t, 'replied_to')[0] !== post.id) return;
    const raw = rawText(t);
    const text = plain(raw);
    const n = charLen(text);
    if (n < 3 || n > (lang === 'en' ? 140 : 50) || charLen(post.text) + n > (lang === 'en' ? 280 : 140)) return;
    if (lang === 'en' ? !/[A-Za-z]{2,}/.test(text) : !CJK.test(text)) return;
    if (/^\s*(?:@\w+\s+)*[>＞]/.test(raw) || !safe(text, t)) return;
    const greet = GREET.test(text);
    if (greet && n <= 14) return;
    const tk = squash(text).slice(0, 50);
    if (!tk || picks.some(x => x.tk === tk)) return;
    const funny = isFunny(text, lang);
    const quip = QUIP[lang].test(text);
    const trail = /…+$|\.{3}$/.test(text);
    let score = (funny ? 5 : 0) + (quip ? 3 : trail ? 2 : 0) + (n <= (lang === 'en' ? 70 : 25) ? 2 : 0) - (greet ? 3 : 0) - (POLITE.test(text) ? 2 : 0);
    score += Math.min(2, Math.log2(1 + ((t.public_metrics && t.public_metrics.like_count) || 0)));
    if (!(funny || quip || trail) || score < 4) return;
    picks.push({ id: t.id, handle: u.username, text, url: 'https://x.com/' + u.username + '/status/' + t.id, tk, score });
  });
  return picks.sort((a, b) => b.score - a.score).slice(0, 2).map(({ tk, score, ...r }) => r);
}

/* ---------- X's official API ---------- */
let asked = 0;
let read = 0;
async function xGet(pathname, params) {
  const url = CONF.api + pathname + '?' + new URLSearchParams(params);
  const res = await fetch(url, { headers: { authorization: 'Bearer ' + CONF.token, 'user-agent': 'reply-news-collector' } });
  asked++;
  if (!res.ok) {
    const body = (await res.text().catch(() => '')).slice(0, 300);
    const e = new Error(`X answered ${res.status} for ${pathname}: ${body}`);
    e.status = res.status;
    throw e;
  }
  const data = await res.json();
  read += (data.data || []).length;
  return data;
}
const FIELDS = {
  'tweet.fields': 'author_id,conversation_id,created_at,lang,public_metrics,referenced_tweets,in_reply_to_user_id,possibly_sensitive,note_tweet,attachments',
  expansions: 'author_id',
  'user.fields': 'username,name,description,protected,verified_type,public_metrics',
};
const usersOf = data => new Map(((data.includes && data.includes.users) || []).map(u => [u.id, u]));
const clamp = n => String(Math.max(10, Math.min(100, Math.round(n))));
/* People's own posts about a word, from a few hours ago, so that replies have had time to come. */
function searchPosts(word, lang) {
  const hours = 2 + Math.floor(Math.random() * 6);
  return xGet('/tweets/search/recent', {
    query: `${/\s/.test(word) ? '"' + word + '"' : word} -is:reply -is:retweet -is:quote lang:${lang}`,
    max_results: clamp(CONF.results),
    end_time: new Date(Date.now() - hours * 3600e3).toISOString().replace(/\.\d+Z$/, 'Z'),
    ...FIELDS,
  });
}
function searchReplies(id) {
  return xGet('/tweets/search/recent', { query: `conversation_id:${id} is:reply -is:retweet`, max_results: clamp(CONF.replies), ...FIELDS });
}
/* Posts that were deleted or hidden since they were saved leave the file. One request for 100 posts. */
async function stillThere(ids) {
  const alive = new Set();
  for (let i = 0; i < ids.length; i += 100) {
    const data = await xGet('/tweets', { ids: ids.slice(i, i + 100).join(','), 'tweet.fields': 'id' });
    (data.data || []).forEach(t => alive.add(t.id));
  }
  return alive;
}

/* ---------- one language ---------- */
const pick = list => list[Math.floor(Math.random() * list.length)];
const shuffle = list => list.map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
async function readJson(file, empty) { try { return JSON.parse(await readFile(file, 'utf8')); } catch (e) { return empty; } }
async function collect(lang, genres) {
  const file = path.join(OUT, `talks-${lang}.json`);
  const before = await readJson(file, { talks: [] });
  const old = Array.isArray(before.talks) ? before.talks : [];
  const have = new Set(old.map(t => t.id));
  const lately = new Set(old.slice(0, 40).map(t => t.word));
  /* A few genres, drawn each run; from each, a word that is not among the newest talks already. */
  const drawn = shuffle(genres).slice(0, CONF.words).map(g => {
    const words = g[lang] || [];
    const fresh = words.filter(w => !lately.has(w));
    return { genre: g.id, word: pick(fresh.length ? fresh : words) };
  }).filter(x => x.word);
  const cands = [];
  for (const { genre, word } of drawn) {
    const data = await searchPosts(word, lang);
    const users = usersOf(data);
    const mine = [];
    (data.data || []).forEach(t => {
      const u = users.get(t.author_id);
      const post = talkPost(t, u, lang);
      if (post && !have.has(post.id)) mine.push({ genre, word, post, z: zest(post.text, t, u, lang) });
    });
    mine.sort((a, b) => b.z - a.z);
    cands.push(mine);
    console.log(`  ${lang} ${genre} "${word}": ${(data.data || []).length} posts, ${mine.length} can open a talk`);
  }
  /* The liveliest posts, one from each word in turn, each from a different person. */
  const chosen = [];
  const people = new Set();
  while (chosen.length < CONF.posts && cands.some(l => l.length)) {
    for (const l of cands) {
      while (l.length && chosen.length < CONF.posts) {
        const c = l.shift();
        if (people.has(c.post.handle.toLowerCase())) continue;
        people.add(c.post.handle.toLowerCase());
        chosen.push(c);
        break;
      }
    }
  }
  const found = [];
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  for (const c of chosen) {
    const data = await searchReplies(c.post.id);
    const replies = pickReplies(c.post, data.data || [], usersOf(data), lang);
    if (replies.length) found.push({ id: c.post.id, genre: c.genre, word: c.word, found: now, post: c.post, replies });
  }
  /* The file: new talks first, then the earlier ones that are still young and still on X. */
  const young = old.filter(t => Date.now() - Date.parse(t.found || 0) < CONF.keepDays * 86400e3);
  let kept = young;
  if (young.length) {
    const alive = await stillThere([...new Set(young.flatMap(t => [t.post.id, ...t.replies.map(r => r.id)]))]);
    kept = young.map(t => ({ ...t, replies: t.replies.filter(r => alive.has(r.id)) })).filter(t => alive.has(t.post.id) && t.replies.length);
  }
  const talks = found.concat(kept).slice(0, CONF.keepMax);
  console.log(`  ${lang}: ${found.length} new talks, ${kept.length} kept, ${old.length - kept.length} left the file`);
  const out = { version: 1, lang, updated: now, talks };
  if (CONF.dry) { console.log(JSON.stringify(out, null, 1)); return out; }
  await mkdir(OUT, { recursive: true });
  await writeFile(file, JSON.stringify(out, null, 1) + '\n');
  return out;
}

async function main() {
  if (!CONF.token) {
    console.log('X_BEARER_TOKEN is not set, so nothing was collected and no file was changed.\nSee api/README.md for where to put the key.');
    return;
  }
  const { genres } = JSON.parse(await readFile(path.join(HERE, 'words.json'), 'utf8'));
  const index = { version: 1, updated: '', talks: {} };
  for (const lang of (CONF.langs.length ? CONF.langs : ['ja'])) {
    const out = await collect(lang, genres);
    index.updated = out.updated;
    index.talks[lang] = out.talks.length;
  }
  if (!CONF.dry) {
    /* The other language's count stays as it was. */
    const before = await readJson(path.join(OUT, 'index.json'), { talks: {} });
    index.talks = { ...(before.talks || {}), ...index.talks };
    await writeFile(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1) + '\n');
  }
  console.log(`Asked X ${asked} times; X returned ${read} posts.`);
}
main().catch(e => { console.error(e.message || e); process.exit(1); });
