/* News Shorts drawing engine. Phone and X and YouTube are 1080×1920. PC is 1920×1080. 30fps. 3.2 seconds per story, or 4.2 / 5.2. */
(function (global) {
'use strict';

const FPS = 30;
let DUR = 3.2;
function setDuration(seconds) {
  const n = Math.round(Number(seconds) * 10) / 10;
  DUR = n === 4.2 || n === 5.2 ? n : 3.2;
  return DUR;
}
const INK = '#F5F1E9';
const INK_DAY = '#141414';
const F_SERIF = '"Noto Serif JP","Noto Serif CJK JP","Source Han Serif JP","Hiragino Mincho ProN","Yu Mincho",serif';
const F_TIMES = '"Tinos","Liberation Serif","Times New Roman",Times,serif';
const F_SANS = '"Noto Sans JP","Noto Sans CJK JP","Source Han Sans JP","Hiragino Sans","Yu Gothic",sans-serif';

/* Positions measured from the original videos. youtube: the Nov 14 video. x: the Nov 14 X cut. pc: the wide layout. */
const PRESETS = {
  youtube: {
    name: 'youtube', W: 1080, H: 1920, layout: 'stack', wrap: false,
    left: 60, right: 900, cx: 480,
    header: { base: 241, size: 42, w: 600, sx: 0.742, cx: 477 },
    cat: { base: 304, size: 40, w: 700, sx: 0.965, right: 896 },
    rule: 3,
    rule1: 326, rule2: 1364,
    box: { top: 368, bottom: 1256, center: 812 },
    head: { sx: 0.608, lh: 0.935, max: [257, 200, 160, 130], maxW: 800, cap: 0.743, topPad: 0.139 },
    sub: { sx: 0.60, lh: 0.935, ratio: 0.52, max: 145, maxW: 835, small: 0.62 },
    gap: { headRule: [8, 0.103], ruleSub: [21.4, 0.18], subShort: [16, 0.09], shortJp: 35 },
    short: { w: 240 },
    jp: { size: 68, sx: 0.695, w: 900, line: 80, para: 107.5, maxW: 845, ascent: 0.86, inkH: 64 },
    tags: { base: 1339.5, size: 42.7, w: 700, gap: 43, sx: 0.85, maxW: 840 },
    foot: { base: 1417, size: 41, w: 600, sx: 0.77, page: 40, psx: 0.965 },
    credit: { base1: 1460, base2: 1492, size: 20, maxW: 800, maxW1: 840, color: 'rgba(245,241,233,0.56)' },
    kw: { sx: 0.276, maxH: 891, cy: 818, w: 840, left: 60 },
    zoom: 0.022,
  },
  x: {
    name: 'x', W: 1080, H: 1920, layout: 'stack', wrap: true,
    left: 60, right: 1020, cx: 540,
    header: { base: 151, size: 42, w: 600, sx: 0.742, cx: 537 },
    cat: { base: 214, size: 40, w: 700, sx: 0.965, right: 1016 },
    rule: 3,
    rule1: 236, rule2: 1674,
    box: { top: 274, bottom: 1567, center: 920.5 },
    head: { sx: 0.605, lh: 0.95, max: [322, 322, 250, 200], maxW: 935, cap: 0.743, topPad: 0.139, oneLine: 184 },
    sub: { sx: 0.60, lh: 0.935, ratio: 0, max: 173, maxW: 950, small: 0.62, lines: 4, fexp: 0.32, bal: 0.55 },
    gap: { headRule: [6, 0.103], ruleSub: [18, 0.18], subShort: [16, 0.09], shortJp: 36 },
    short: { w: 240 },
    jp: { size: 76.5, sx: 0.687, w: 900, line: 90, para: 122, maxW: 975, ascent: 0.86, inkH: 72 },
    tags: { base: 1649.5, size: 42.7, w: 700, gap: 43, sx: 0.85, maxW: 960 },
    foot: { base: 1727, size: 41, w: 600, sx: 0.77, page: 40, psx: 0.965 },
    credit: { base1: 1770, base2: 1802, size: 20, maxW: 800, maxW1: 900, color: 'rgba(245,241,233,0.56)' },
    kw: { sx: 0.276, maxH: 1233, cy: 928.5, w: 956, left: 62 },
    zoom: 0.022,
  },
  pc: {
    name: 'pc', W: 1920, H: 1080, layout: 'columns', wrap: true,
    left: 120, right: 1800, cx: 960,
    colL: { left: 120, right: 1080, cx: 600 }, colR: { left: 1180, right: 1800, cx: 1490 }, divider: 1130,
    header: { base: 66, size: 34, w: 600, sx: 0.742, cx: 960 },
    cat: { base: 122, size: 32, w: 700, sx: 0.965, right: 1800 },
    rule: 3,
    rule1: 140, rule2: 948,
    box: { top: 186, bottom: 860, center: 523 },
    head: { sx: 0.608, lh: 0.935, max: [230, 200, 160, 130], maxW: 920, cap: 0.743, topPad: 0.139, oneLine: 150 },
    sub: { sx: 0.60, lh: 0.935, ratio: 0, max: 120, maxW: 930, small: 0.62, lines: 3, fexp: 0.32, bal: 0.55 },
    gap: { headRule: [6, 0.103], ruleSub: [14, 0.18], subShort: [14, 0.09], shortJp: 30 },
    short: { w: 180 },
    jp: { size: 58, sx: 0.695, w: 900, line: 68, para: 92, maxW: 610, ascent: 0.86, inkH: 55 },
    tags: { base: 912, size: 34, w: 700, gap: 34, sx: 0.85, maxW: 1680 },
    foot: { base: 995, size: 33, w: 600, sx: 0.77, page: 32, psx: 0.965 },
    credit: { base1: 1034, base2: 1060, size: 17, maxW: 1680, maxW1: 1680, color: 'rgba(245,241,233,0.56)' },
    kw: { sx: 0.276, maxSx: 0.36, maxH: 800, cy: 540, w: 1680, left: 120 },
    bgFocus: { A: 1200, B: 700, C: 800, D: 900, E: 950 },
    zoom: 0.022,
  },
  wide: {
    name: 'wide', W: 1920, H: 1080, layout: 'stack', wrap: true,
    left: 110, right: 1810, cx: 960,
    header: { base: 70, size: 34, w: 600, sx: 0.742, cx: 960 },
    cat: { base: 114, size: 30, w: 700, sx: 0.965, right: 1810 },
    rule: 3,
    rule1: 132, rule2: 948,
    box: { top: 164, bottom: 880, center: 522 },
    head: { sx: 0.6, lh: 0.95, max: [188, 156, 124, 100], maxW: 1580, cap: 0.74, topPad: 0.1, oneLine: 118 },
    sub: { sx: 0.6, lh: 0.93, ratio: 0, max: 70, maxW: 1480, small: 0.62, lines: 2, fexp: 0.32, bal: 0.55 },
    gap: { headRule: [6, 0.1], ruleSub: [12, 0.16], subShort: [10, 0.08], shortJp: 22 },
    short: { w: 200 },
    jp: { size: 54, sx: 0.7, w: 700, line: 64, para: 82, maxW: 1540, ascent: 0.86, inkH: 52 },
    tags: { base: 972, size: 26, w: 600, gap: 24, sx: 0.85, maxW: 1500 },
    foot: { base: 1004, size: 28, w: 600, sx: 0.77, page: 26, psx: 0.965 },
    credit: { base1: 1036, base2: 1058, size: 15, maxW: 1580, maxW1: 1660, color: 'rgba(28,20,12,0.58)' },
    kw: { sx: 0.28, maxH: 500, cy: 500, w: 1500, left: 150 },
    bgFocus: { A: 900, B: 520, C: 640, D: 700, E: 760 },
    zoom: 0.018,
  },
};
const TIMING = { fade: 0.2, t1: 23 / 30, t2: 47 / 30, t3: 71 / 30 };
let P = PRESETS.youtube;
let W = P.W, H = P.H;
function use(name) { P = PRESETS[name] || PRESETS.youtube; W = P.W; H = P.H; return P; }

const BG_ORDER = ['A', 'B', 'C', 'C', 'A', 'B', 'D', 'C', 'D', 'C', 'B', 'D'];
const CREDIT_MUSIC = 'Music: Holst ‘Jupiter’ – Holst / London Symphony Orchestra (Columbia, 1922–23), Wikimedia Commons';
let musicCredit = CREDIT_MUSIC;
function setMusicCredit(text) { musicCredit = text || CREDIT_MUSIC; }
const WALLPAPERS = {
  morning: '',
  bright: 'brightness(1.85) saturate(1.14) contrast(1.05)',
  day: 'brightness(2.35) saturate(0.55) contrast(1.08)',
  evening: 'brightness(0.72) saturate(1.35) sepia(0.45)',
  night: 'brightness(0.38) saturate(0.5)',
  pop: 'brightness(1.65) saturate(1.85) contrast(1.04)',
  festive: 'brightness(1.7) saturate(1.9) contrast(1.06) sepia(0.06)',
};
function lightWall() { return wallpaper === 'day' || wallpaper === 'festive'; }
function inkNow() { return lightWall() ? INK_DAY : INK; }
function creditNow() { return lightWall() ? 'rgba(28,20,12,0.62)' : P.credit.color; }
let wallpaper = 'morning';
function setWallpaper(id) { wallpaper = Object.prototype.hasOwnProperty.call(WALLPAPERS, id) ? id : 'morning'; }
const CREDIT_PHOTO = 'Photos: U.S. National Park Service & NOAA (Glacier, Yellowstone, Lake Mead, SE Alaska), public domain';
const CREDIT_COFFEE = 'Background: AI-generated image (Karuizawa-style study), Grok Bot';

const mcv = document.createElement('canvas');
const mctx = mcv.getContext('2d');
function font(w, size, fam) { return `${w} ${size}px ${fam}`; }
function adv(text, f) { mctx.font = f; return mctx.measureText(text).width; }
function ink(text, f) {
  mctx.font = f; const m = mctx.measureText(text);
  return { l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight, a: m.actualBoundingBoxAscent, d: m.actualBoundingBoxDescent, w: m.width };
}
const smooth = (a, b, t) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
const pad2 = n => String(n).padStart(2, '0');

/* Words that stay small in a headline. */
function tokens(line) {
  return line.split(/(\s+)/).filter(s => s.length).map(s => ({ t: /^\s+$/.test(s) ? ' ' : s, small: /^[a-z][a-z'’.-]*$/.test(s) }));
}
function subWidth(line, size) {
  let w = 0;
  for (const k of tokens(line)) {
    const s = k.small ? size * P.sub.small : size;
    w += adv(k.small ? k.t.toUpperCase() : k.t, font(900, s, F_SERIF));
  }
  return w * P.sub.sx;
}

/* Options from prepare(script, preset, opts). News passes none.
   uniform: one headline size and one news-line size for every story in the video.
   jp: the news-line size, as a multiple of the preset (2 = twice as large). */
let OPT = {};
/* News lines break on a slash or a newline. A line that is still too long breaks on a phrase. */
let jpScale = 1;
function jpWidth(t) { return adv(t, font(P.jp.w, P.jp.size * jpScale, F_SERIF)) * P.jp.sx; }
const NO_START = '、。，．・：；？！ー）」』】〕”’ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ々〜…‥%％';
const NO_END = '（「『【〔“‘';
function wrapJp(text) {
  const out = [];
  for (const part of String(text).split(/\n/).map(x => x.trim()).filter(Boolean)) {
    const pieces = part.split('／').map(x => x.trim()).filter(Boolean);
    const joined = pieces.join('');
    if (jpWidth(joined) <= P.jp.maxW) { out.push(joined); continue; }
    if (pieces.length > 1 && pieces.every(x => jpWidth(x) <= P.jp.maxW)) {
      let cur = pieces[0];
      for (const x of pieces.slice(1)) { if (jpWidth(cur + x) <= P.jp.maxW) cur += x; else { out.push(cur); cur = x; } }
      out.push(cur); continue;
    }
    out.push(...splitBalanced(joined));
  }
  return out;
}
function breakPoints(s) {
  let segs = null;
  try {
    if (Intl.Segmenter) segs = [...new Intl.Segmenter('ja', { granularity: 'word' }).segment(s)].map(x => x.index);
  } catch (e) { segs = null; }
  const pts = new Set();
  if (segs) segs.forEach(i => { if (i > 0) pts.add(i); });
  else for (let i = 1; i < s.length; i++) pts.add(i);
  for (let i = 1; i < s.length; i++) if (s[i - 1] === ' ' || s[i - 1] === '　') pts.add(i);
  return [...pts].filter(i => !NO_START.includes(s[i]) && !NO_END.includes(s[i - 1]) &&
    !(/[0-9A-Za-z]/.test(s[i - 1]) && /[0-9A-Za-z.,]/.test(s[i]))).sort((a, b) => a - b);
}
function splitBalanced(s) {
  const pts = breakPoints(s);
  let best = null;
  for (const i of pts) {
    const a = s.slice(0, i).trim(), b = s.slice(i).trim();
    const wa = jpWidth(a), wb = jpWidth(b);
    if (wa > P.jp.maxW) continue;
    const particle = /[のがをにはでとへもや、]$/.test(a) ? -40 : 0;
    const score = Math.max(wa, wb) + particle;
    if (!best || score < best.score) best = { score, a, b, wb };
  }
  if (!best) { const h = Math.ceil(s.length / 2); return [s.slice(0, h), ...splitBalanced(s.slice(h))].filter(Boolean); }
  return best.wb > P.jp.maxW ? [best.a, ...splitBalanced(best.b)] : [best.a, best.b];
}

/* Split words into n lines so the longest line stays short. */
function splitWords(words, n, widthFn) {
  if (n <= 1 || words.length <= 1) return [words.join(' ')];
  n = Math.min(n, words.length);
  let best = null;
  const rec = (start, left, acc) => {
    if (left === 1) {
      const lines = [...acc, words.slice(start).join(' ')];
      const ws = lines.map(widthFn), w = Math.max(...ws), q = ws.reduce((a, b) => a + b * b, 0);
      if (!best || w < best.w - 0.005 || (Math.abs(w - best.w) <= 0.005 && q < best.q)) best = { w, q, lines };
      return;
    }
    for (let i = start + 1; i <= words.length - left + 1; i++) rec(i, left - 1, [...acc, words.slice(start, i).join(' ')]);
  };
  rec(0, n, []);
  return best.lines;
}
/* A subhead does not end on a small word such as to or and. That word starts the next line. */
function splitSub(words, n) {
  const ok = [];
  const lines = splitWords(words, n, subW);
  if (!lines.slice(0, -1).some(l => /\s[a-z][a-z'’.-]*$|^[a-z][a-z'’.-]*$/.test(l))) return lines;
  let best = null;
  const rec = (start, left, acc) => {
    if (left === 1) {
      const ls = [...acc, words.slice(start).join(' ')];
      if (ls.slice(0, -1).some(l => /(^|\s)[a-z][a-z'’.-]*$/.test(l))) return;
      const ws = ls.map(subW), w = Math.max(...ws), q = ws.reduce((x, y) => x + y * y, 0);
      if (!best || w < best.w - 0.005 || (Math.abs(w - best.w) <= 0.005 && q < best.q)) best = { w, q, ls };
      return;
    }
    for (let i = start + 1; i <= words.length - left + 1; i++) rec(i, left - 1, [...acc, words.slice(start, i).join(' ')]);
  };
  rec(0, Math.min(n, words.length), []);
  return best ? best.ls : lines;
}
const headW = l => adv(l, font(900, 100, F_SERIF)) * P.head.sx / 100;
const subW = l => subWidth(l, 100) / 100;

/* Stack the headline, subhead, and news lines (YouTube and X). */
function stackPlan(head, sub, jp, sh0, ss0) {
  return function place(f) {
    const Sh = sh0 * f, Ss = ss0 * Math.pow(f, P.sub.fexp || 1);
    const L = { Sh, Ss, head: [], sub: [], jp: [] };
    const capTop0 = P.head.topPad * Sh;
    head.forEach((t, i) => L.head.push({ t, base: capTop0 + P.head.cap * Sh + i * P.head.lh * Sh }));
    let last = L.head[L.head.length - 1].base;
    L.rule = last + P.gap.headRule[0] + P.gap.headRule[1] * Sh;
    if (sub.length) {
      const sc0 = L.rule + P.gap.ruleSub[0] + P.gap.ruleSub[1] * Ss;
      sub.forEach((t, j) => L.sub.push({ t, base: sc0 + P.head.cap * Ss + j * P.sub.lh * Ss }));
      last = L.sub[L.sub.length - 1].base;
      L.short = last + P.gap.subShort[0] + P.gap.subShort[1] * Ss;
    } else L.short = L.rule + 24;
    let jt = L.short + P.gap.shortJp * jpScale;
    jp.forEach((l, k) => {
      if (k > 0) jt += (l.para ? P.jp.para : P.jp.line) * jpScale;
      L.jp.push({ t: l.t, base: jt + P.jp.ascent * P.jp.size * jpScale });
    });
    L.bottom = jp.length ? jt + P.jp.inkH * jpScale : L.short + 3;
    return L;
  };
}
/* Headline and subhead on the left, news lines on the right (PC). */
function columnPlan(head, sub, jp, sh0, ss0) {
  return function place(f) {
    const Sh = sh0 * f, Ss = ss0 * Math.pow(f, P.sub.fexp || 1);
    const L = { Sh, Ss, head: [], sub: [], jp: [] };
    head.forEach((t, i) => L.head.push({ t, base: P.head.topPad * Sh + P.head.cap * Sh + i * P.head.lh * Sh }));
    let last = L.head[L.head.length - 1].base;
    L.rule = last + P.gap.headRule[0] + P.gap.headRule[1] * Sh;
    L.bottom = L.rule + 3;
    if (sub.length) {
      const sc0 = L.rule + P.gap.ruleSub[0] + P.gap.ruleSub[1] * Ss;
      sub.forEach((t, j) => L.sub.push({ t, base: sc0 + P.head.cap * Ss + j * P.sub.lh * Ss }));
      L.bottom = L.sub[L.sub.length - 1].base + 0.02 * Ss;
    }
    return L;
  };
}
function fitPlan(place) {
  const avail = P.box.bottom - P.box.top;
  let L = place(1), f = 1;
  if (L.bottom > avail) {
    let lo = 0.2, hi = 1;
    for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (place(m).bottom > avail) hi = m; else lo = m; }
    f = lo; L = place(f);
  }
  L.f = f;
  return L;
}

function layoutStill(it) {
  const raw = (it.replies || []).map(s => String(s).replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 20);
  const lines = raw.length ? raw : ['No comments yet'];
  const top = P.rule1 + (P.layout === 'columns' ? 16 : 28);
  const bottom = P.rule2 - (P.layout === 'columns' ? 10 : 16);
  const titleSize = P.layout === 'columns' ? 36 : 46;
  const titleBase = top + titleSize * 0.82;
  const listTop = titleBase + (P.layout === 'columns' ? 16 : 22);
  const room = Math.max(40, bottom - listTop);
  const step = room / lines.length;
  const size = Math.max(18, Math.min(P.layout === 'columns' ? 28 : 34, step * 0.78));
  const replies = lines.map((t, i) => ({ t, base: listTop + size + i * step, size }));
  return {
    still: true,
    title: { t: 'COMMENTS', base: titleBase, size: titleSize },
    replies,
    head: [], sub: [], jp: [],
    kw: { t: '', size: 1, sx: 1, x: 0, base: 0 },
    Sh: 10, Ss: 10, rule: listTop, short: top,
    ruleX: [P.left, P.right], cxHead: P.cx, cxJp: P.left,
  };
}
function layout(it) {
  if (it.still && !(it.jp && it.jp.length)) return layoutStill(it);
  return layoutAt(it, OPT.jp || 1);
}
/* A headline split into n lines. Japanese breaks between words, English between words with spaces. */
const CJK_HEAD = /[\u3040-\u30ff\u4e00-\u9fff]/;
function headText(it) {
  const lines = (it.head && it.head.length ? it.head : [it.kw]).map(x => String(x).toUpperCase().trim()).filter(Boolean);
  return lines.some(l => CJK_HEAD.test(l)) ? lines.join('') : lines.join(' ');
}
function splitHead(text, n) {
  if (!CJK_HEAD.test(text)) return splitWords(text.split(/\s+/).filter(Boolean), n, headW);
  if (n <= 1) return [text.trim()];
  const pts = breakPoints(text);
  const memo = new Map();
  const w = (a, b) => { const k = a + ':' + b; if (!memo.has(k)) memo.set(k, headW(text.slice(a, b).trim())); return memo.get(k); };
  let best = null;
  const rec = (start, left, acc) => {
    if (left === 1) {
      const cuts = [...acc, text.length];
      let prev = 0, max = 0, sq = 0;
      for (const c of cuts) { const x = w(prev, c); max = Math.max(max, x); sq += x * x; prev = c; }
      if (!best || max < best.max - 0.005 || (Math.abs(max - best.max) <= 0.005 && sq < best.sq)) best = { max, sq, cuts };
      return;
    }
    for (const p of pts) if (p > start && pts.filter(q => q > p).length >= left - 2) rec(p, left - 1, [...acc, p]);
  };
  rec(0, Math.min(n, pts.length + 1), []);
  if (!best) return [text.trim()];
  const out = [];
  let prev = 0;
  for (const c of best.cuts) { out.push(text.slice(prev, c).trim()); prev = c; }
  return out.filter(Boolean);
}
/* Every story in the video gets the same headline size and the same news-line size.
   The news lines stay at OPT.jp, and the headline stays larger than them. The headline size is the
   largest at which every headline fits in four lines or fewer and every story still fits its box. */
function uniformLayout(items) {
  const avail = P.box.bottom - P.box.top;
  const sizeOf = lines => Math.min(P.head.max[Math.min(lines.length, P.head.max.length) - 1], P.head.maxW / Math.max(...lines.map(headW)));
  const choices = items.map(it => {
    const text = headText(it) || String(it.kw || 'NEWS');
    const list = [];
    for (let n = 1; n <= 4; n++) {
      const lines = splitHead(text, n);
      if (n > 1 && lines.length < n) break;
      list.push({ lines, size: sizeOf(lines) });
    }
    return list;
  });
  const pick = (list, S) => list.find(c => c.size >= S - 0.5) || list.reduce((a, b) => (b.size > a.size ? b : a));
  const S0 = Math.min(...choices.map(list => Math.max(...list.map(c => c.size))));
  const J0 = OPT.jp || 1;
  let S = S0, J = J0;
  for (let k = 0; k < 120; k++) {
    const Ls = items.map((it, i) => { const c = pick(choices[i], S); return layoutAt(it, J, { lines: c.lines, Sh: Math.min(S, c.size) }); });
    if (Ls.every(L => L.blockH <= avail + 0.5 && (L.jpH || 0) <= avail + 0.5)) { items.forEach((it, i) => { it.L = Ls[i]; }); return; }
    /* The news lines keep their size first. The headline gives way, but stays larger than the news lines;
       past that point both get smaller together. */
    const floor = Math.max(S0 * 0.6, J * P.jp.size * 1.12);
    if (S * 0.95 >= floor) S *= 0.95;
    else if (J > 0.6) { J *= 0.95; S = Math.max(Math.min(S, S0), Math.min(S0, J * P.jp.size * 1.12)); }
    else S *= 0.95;
  }
  items.forEach(it => { it.L = layoutAt(it, J0); });
}
function layoutAt(it, scale, forced) {
  jpScale = scale;
  const jp = [];
  (it.jp || []).forEach((p, pi) => wrapJp(p).forEach((t, li) => jp.push({ t, para: li === 0 && pi > 0 })));
  let head = (it.head && it.head.length ? it.head : [it.kw]).map(s => String(s).toUpperCase());
  let sub = (it.sub || []).map(String);
  const plan = P.layout === 'columns' ? columnPlan : stackPlan;
  const hSize = lines => Math.min(P.head.max[Math.min(lines.length, P.head.max.length) - 1], P.head.maxW / Math.max(...lines.map(headW)));
  let L;
  if (forced) {
    /* A size chosen for the whole video: no shrinking per story. */
    head = forced.lines;
    const sw = sub.join(' ').split(/\s+/).filter(Boolean);
    const sl = sw.length ? splitSub(sw, Math.min(P.sub.lines || 3, Math.max(1, Math.ceil(sw.length / 5)))) : [];
    const ss0 = Math.min(P.sub.max, sl.length ? P.sub.maxW / Math.max(...sl.map(subW)) : P.sub.max, P.sub.ratio ? P.sub.ratio * forced.Sh : 1e9);
    L = plan(head, sl, jp, forced.Sh, ss0)(1);
    L.f = 1;
  } else if (!P.wrap) {
    const sh0 = hSize(head);
    const ss0 = Math.min(P.sub.max, sub.length ? P.sub.maxW / Math.max(...sub.map(subW)) : P.sub.max, P.sub.ratio ? P.sub.ratio * sh0 : 1e9);
    L = fitPlan(plan(head, sub, jp, sh0, ss0));
  } else {
    /* One headline line when it is large enough, otherwise two. */
    const hw = head.join(' ').split(/\s+/).filter(Boolean);
    let hl = [hw.join(' ')];
    if (hw.length > 1 && hSize(hl) < P.head.oneLine) hl = splitWords(hw, 2, headW);
    if (hw.length > 2 && hSize(hl) < P.head.oneLine * 0.6) hl = splitWords(hw, 3, headW);
    const sh0 = hSize(hl);
    /* Choose the subhead line count that keeps the headline large. */
    const sw = sub.join(' ').split(/\s+/).filter(Boolean);
    let best = null;
    for (let m = 1; m <= Math.max(1, Math.min(P.sub.lines || 3, sw.length)); m++) {
      const sl = sw.length ? splitSub(sw, m) : [];
      const ss0 = Math.min(P.sub.max, sl.length ? P.sub.maxW / Math.max(...sl.map(subW)) : P.sub.max, P.sub.ratio ? P.sub.ratio * sh0 : 1e9);
      const c = fitPlan(plan(hl, sl, jp, sh0, ss0));
      const score = Math.round(Math.min(P.sub.bal * c.Sh, c.Ss)) * 1000 + c.Ss;
      if (!best || score > best.score + 0.5) best = { score, L: c };
    }
    L = best.L; head = hl;
  }
  /* Align the block vertically. */
  const blockH = L.bottom;
  L.blockH = blockH;
  const off = Math.max(P.box.top, P.box.center - L.bottom / 2);
  L.head.forEach(l => l.base += off); L.sub.forEach(l => l.base += off);
  L.rule += off; L.bottom += off;
  if (P.layout === 'columns') {
    L.cxHead = P.colL.cx; L.ruleX = [P.colL.left, P.colL.right]; L.cxJp = P.colR.cx;
    const line = P.jp.line * jpScale, para = P.jp.para * jpScale, inkH = P.jp.inkH * jpScale;
    const jh = jp.length ? (jp.length - 1) * line + jp.filter(l => l.para).length * (para - line) + inkH : 0;
    L.jpH = jh;
    const jt = Math.max(P.box.top + P.gap.shortJp * jpScale, P.box.center - (jh - P.gap.shortJp * jpScale) / 2);
    L.short = jt - P.gap.shortJp * jpScale;
    let y = jt;
    jp.forEach((l, k) => { if (k > 0) y += l.para ? para : line; L.jp.push({ t: l.t, base: y + P.jp.ascent * P.jp.size * jpScale }); });
  } else {
    L.short += off; L.jp.forEach(l => l.base += off);
    L.cxHead = P.cx; L.ruleX = [P.left, P.right]; L.cxJp = P.cx;
  }

  /* Keyword. */
  const kw = String(it.kw || head[0]).toUpperCase();
  const k = ink(kw, font(900, 1000, F_SERIF));
  let ksize = P.kw.w * 1000 / (P.kw.sx * (k.l + k.r)), ksx = P.kw.sx;
  if ((k.a + k.d) * ksize / 1000 > P.kw.maxH) { ksize = P.kw.maxH * 1000 / (k.a + k.d); ksx = P.kw.w * 1000 / (ksize * (k.l + k.r)); }
  let kx = P.kw.left + k.l * ksize / 1000 * ksx;
  if (P.kw.maxSx && ksx > P.kw.maxSx) {
    ksx = P.kw.maxSx;
    const wInk = (k.l + k.r) * ksize / 1000 * ksx;
    kx = P.cx - wInk / 2 + k.l * ksize / 1000 * ksx;
  }
  L.kw = { t: kw, size: ksize, sx: ksx, x: kx, base: P.kw.cy + (k.a - k.d) / 2 * ksize / 1000 };
  L.jpSize = P.jp.size * jpScale;
  const avail = P.box.bottom - P.box.top;
  const jpH = P.layout === 'columns'
    ? (jp.length ? (jp.length - 1) * P.jp.line * jpScale + P.jp.inkH * jpScale : 0)
    : blockH;
  if (!forced && jpH > avail + 4 && jpScale > 0.28) {
    const next = Math.max(0.28, Math.min(jpScale - 0.02, jpScale * avail / jpH * 0.98));
    if (next < jpScale - 0.01) return layoutAt(it, next);
  }
  return L;
}

/* Script to the drawing sequence. */
function prepare(script, preset, opts) {
  use(preset || 'youtube');
  OPT = opts || {};
  /* The name in the date line: the page can give its own (Reply News). */
  const BRAND = OPT.brand || { ja: '速報ニュース', en: 'News Shorts' };
  const d = new Date((script.date || '') + 'T12:00:00+09:00');
  const ok = !isNaN(d);
  const y = ok ? d.getFullYear() : 2026, mo = ok ? d.getMonth() + 1 : 1, da = ok ? d.getDate() : 1;
  const items = (script.items || []).map((it, i) => it && it.coffee
    ? { ...it, kind: 'coffee', bg: 'E', kw: it.kw || 'COFFEE BREAK', head: (it.head && it.head.length) ? it.head : ['COFFEE', 'BREAK'] }
    : { ...it, kind: 'news', bg: it.bg || BG_ORDER[i % BG_ORDER.length] });
  if (script.coffee && !items.some(it => it.kind === 'coffee')) items.push({ ...script.coffee, kind: 'coffee', bg: 'E', kw: script.coffee.kw || 'COFFEE BREAK', head: script.coffee.head || ['COFFEE', 'BREAK'] });
  const total = items.length;
  items.forEach((it, i) => {
    const no = pad2(i + 1);
    const lead = String(it.kw || it.topic || 'NOTE').toUpperCase();
    it.catLeft = it.kind === 'coffee' ? `NOTE ${no}  /  COFFEE BREAK` : `${lead} ${no}  /  ${String(it.cat || lead).toUpperCase()}`;
    it.catRight = it.kind === 'coffee' ? '' : String(it.topic || '').toUpperCase();
    it.foot = it.kind === 'coffee' ? (it.src || 'COFFEE BREAK') : `${it.src || ''}${it.date ? '\u2006｜\u2006' + it.date : ''}`;
    it.page = `${no} / ${pad2(total)}`;
    it.credit2 = it.kind === 'coffee' ? (it.bgCredit || CREDIT_COFFEE) : CREDIT_PHOTO;
    it.tags = (it.tags || []).map(s => String(s).toUpperCase());
    if (!(OPT.uniform && it.kind === 'news')) it.L = layout(it);
  });
  if (OPT.uniform) uniformLayout(items.filter(it => it.kind === 'news' && !(it.still && !(it.jp && it.jp.length))));
  return {
    P, W, H, preset: P.name, items, total, duration: total * DUR,
    /* The line at the top: Japanese only, English only, or both when the page does not say. */
    header: OPT.lang === 'ja' ? `${y}年${mo}月${da}日 ${BRAND.ja}`
      : OPT.lang === 'en' ? `${pad2(da)}-${pad2(mo)}-${y} ${BRAND.en}`
      : `${pad2(da)}-${pad2(mo)}-${y} ${BRAND.en}｜${y}年${mo}月${da}日 ${BRAND.ja}`,
  };
}

/* Condensed type. */
function textX(ctx, t, x, y, sx, align) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1); ctx.textAlign = align || 'center'; ctx.fillText(t, 0, 0); ctx.restore();
}
function subLine(ctx, line, size, base, cx) {
  const toks = tokens(line);
  const ws = toks.map(k => adv(k.small ? k.t.toUpperCase() : k.t, font(900, k.small ? size * P.sub.small : size, F_SERIF)) * P.sub.sx);
  let x = cx - ws.reduce((a, b) => a + b, 0) / 2;
  toks.forEach((k, i) => {
    if (k.t !== ' ') {
      ctx.font = font(900, k.small ? size * P.sub.small : size, F_SERIF);
      textX(ctx, k.small ? k.t.toUpperCase() : k.t, x, base, P.sub.sx, 'left');
    }
    x += ws[i];
  });
}

function drawBg(ctx, img, t, key) {
  const s = 1 + P.zoom * (Math.floor(t * FPS + 1e-6) / (DUR * FPS));
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
  if (WALLPAPERS[wallpaper]) ctx.filter = WALLPAPERS[wallpaper];
  if (!img) { ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H); }
  else if (P.bgFocus) {
    const k = W / img.width, fy = (P.bgFocus[key] || img.height / 2);
    const y0 = Math.min(0, Math.max(H - img.height * k, H / 2 - fy * k));
    ctx.drawImage(img, 0, y0, W, img.height * k);
  } else ctx.drawImage(img, 0, 0, W, H);
  ctx.filter = 'none';
  if (wallpaper === 'evening') {
    ctx.fillStyle = 'rgba(140,48,0,0.18)';
    ctx.fillRect(0, 0, W, H);
  } else if (wallpaper === 'bright') {
    ctx.fillStyle = 'rgba(255,236,214,0.16)';
    ctx.fillRect(0, 0, W, H);
  } else if (wallpaper === 'day') {
    ctx.fillStyle = 'rgba(255,250,240,0.5)';
    ctx.fillRect(0, 0, W, H);
  } else if (wallpaper === 'festive') {
    const wash = ctx.createLinearGradient(0, 0, W, H);
    wash.addColorStop(0, 'rgba(255, 210, 120, 0.24)');
    wash.addColorStop(0.5, 'rgba(255, 248, 230, 0.06)');
    wash.addColorStop(1, 'rgba(255, 96, 150, 0.16)');
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}

function drawItem(ctx, show, i, t, bgs) {
  use(show.preset);
  const it = show.items[i], L = it.L;
  ctx.textBaseline = 'alphabetic';
  drawBg(ctx, bgs[it.bg], L.still ? 0 : t, it.bg);
  ctx.fillStyle = inkNow();
  /* Lines that stay on screen. */
  ctx.globalAlpha = 1;
  ctx.font = font(P.header.w, P.header.size, F_SERIF);
  textX(ctx, show.header, P.header.cx, P.header.base, P.header.sx, 'center');
  ctx.font = font(400, P.credit.size, F_SANS);
  ctx.fillStyle = creditNow(); ctx.textAlign = 'left';
  const mw = ctx.measureText(musicCredit).width, ms = Math.min(P.credit.size, P.credit.size * P.credit.maxW1 / mw);
  ctx.font = font(400, ms, F_SANS);
  ctx.fillText(musicCredit, P.left, P.credit.base1 - (P.credit.size - ms) * 1.33);
  ctx.font = font(400, P.credit.size, F_SANS);
  const cw = ctx.measureText(it.credit2).width, cs = Math.min(P.credit.size, P.credit.size * P.credit.maxW / cw);
  ctx.font = font(400, cs, F_SANS);
  ctx.fillText(it.credit2, P.left, P.credit.base2 - (P.credit.size - cs) * 1.33);
  ctx.fillStyle = inkNow();
  if (L.still) {
    ctx.globalAlpha = 1;
    ctx.font = font(P.cat.w, P.cat.size, F_TIMES);
    textX(ctx, it.catLeft, P.left, P.cat.base, P.cat.sx, 'left');
    ctx.fillRect(P.left, P.rule1, P.right - P.left, P.rule);
    ctx.font = font(700, L.title.size, F_SANS);
    textX(ctx, L.title.t, P.left, L.title.base, 1, 'left');
    (L.replies || []).forEach(l => {
      ctx.save();
      ctx.font = font(550, l.size, F_SANS);
      ctx.shadowColor = lightWall() ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.72)';
      ctx.shadowBlur = 6;
      const w = ctx.measureText(l.t).width;
      const sx = Math.min(1, (P.right - P.left) / Math.max(1, w));
      textX(ctx, l.t, P.left, l.base, sx, 'left');
      ctx.restore();
    });
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.fillStyle = inkNow();
    ctx.fillRect(P.left, P.rule2, P.right - P.left, P.rule);
    ctx.font = font(P.foot.w, P.foot.size, F_SERIF);
    textX(ctx, it.foot, P.left, P.foot.base, P.foot.sx, 'left');
    ctx.font = font(700, P.foot.page, F_TIMES);
    textX(ctx, it.page, P.cat.right, P.foot.base, P.foot.psx, 'right');
    ctx.globalAlpha = 1;
    return;
  }

  const T = TIMING, a1 = smooth(T.t1, T.t1 + T.fade, t), a2 = smooth(T.t2, T.t2 + T.fade, t), a3 = smooth(T.t3, T.t3 + T.fade, t);
  /* Keyword. */
  if (a1 < 1) {
    ctx.globalAlpha = 1 - a1;
    ctx.font = font(900, L.kw.size, F_SERIF);
    textX(ctx, L.kw.t, L.kw.x, L.kw.base, L.kw.sx, 'left');
  }
  if (a1 > 0) {
    ctx.globalAlpha = a1;
    ctx.font = font(P.cat.w, P.cat.size, F_TIMES);
    textX(ctx, it.catLeft, P.left, P.cat.base, P.cat.sx, 'left');
    textX(ctx, it.catRight, P.cat.right, P.cat.base, P.cat.sx, 'right');
    ctx.fillRect(P.left, P.rule1, P.right - P.left, P.rule);
    ctx.font = font(900, L.Sh, F_SERIF);
    L.head.forEach(l => textX(ctx, l.t, L.cxHead, l.base, P.head.sx, 'center'));
    ctx.fillRect(L.ruleX[0], L.rule, L.ruleX[1] - L.ruleX[0], P.rule);
    L.sub.forEach(l => subLine(ctx, l.t, L.Ss, l.base, L.cxHead));
    if (P.layout === 'columns') ctx.fillRect(P.divider - 1, P.box.top + 10, 2, P.box.bottom - P.box.top - 20);
    else ctx.fillRect(P.cx - P.short.w / 2, L.short, P.short.w, P.rule);
    ctx.fillRect(P.left, P.rule2, P.right - P.left, P.rule);
    ctx.font = font(P.foot.w, P.foot.size, F_SERIF);
    textX(ctx, it.foot, P.left, P.foot.base, P.foot.sx, 'left');
    ctx.font = font(700, P.foot.page, F_TIMES);
    textX(ctx, it.page, P.cat.right, P.foot.base, P.foot.psx, 'right');
  }
  if (a2 > 0) {
    ctx.globalAlpha = a2 * a1;
    ctx.font = font(P.jp.w, L.jpSize || P.jp.size, F_SERIF);
    if (P.layout === 'columns' && L.jp.length) ctx.fillRect(L.cxJp - P.short.w / 2, L.short, P.short.w, P.rule);
    L.jp.forEach(l => textX(ctx, l.t, L.cxJp, l.base, P.jp.sx, 'center'));
  }
  if (a3 > 0 && it.tags.length) {
    ctx.globalAlpha = a3 * a1;
    ctx.font = font(P.tags.w, P.tags.size, F_TIMES);
    let ws = it.tags.map(s => ctx.measureText(s).width * P.tags.sx);
    const tw = ws.reduce((a, b) => a + b, 0) + P.tags.gap * (ws.length - 1);
    if (tw > P.tags.maxW) { const r = P.tags.maxW / tw; ctx.font = font(P.tags.w, P.tags.size * r, F_TIMES); ws = ws.map(w => w * r); }
    let x = P.cx - (ws.reduce((a, b) => a + b, 0) + P.tags.gap * (ws.length - 1)) / 2;
    it.tags.forEach((s, k) => { textX(ctx, s, x, P.tags.base, P.tags.sx, 'left'); x += ws[k] + P.tags.gap; });
  }
  ctx.globalAlpha = 1;
}

function drawFrame(ctx, show, T, bgs) {
  const frame = Math.round(T * FPS);
  const i = Math.min(show.items.length - 1, Math.floor(frame / (DUR * FPS) + 1e-9));
  const t = (frame - i * DUR * FPS) / FPS;
  drawItem(ctx, show, i, t, bgs);
  return i;
}

function fontSpecs() {
  return [font(900, 64, F_SERIF), font(700, 40, F_SERIF), font(P.header.w, 42, F_SERIF), font(P.jp.w, 64, F_SERIF), font(700, 40, F_TIMES), font(700, 46, F_SANS), font(600, 34, F_SANS), font(400, 20, F_SANS)];
}
function allText(script) {
  const s = [];
  (script.items || []).concat(script.coffee ? [script.coffee] : []).forEach(it => {
    s.push(it.kw, it.cat, it.topic, ...(it.head || []), ...(it.sub || []).map(x => x + x.toUpperCase()), ...(it.jp || []), ...(it.replies || []), ...(it.tags || []), it.src, it.date);
  });
  s.push('0123456789 NEWS NOTE COFFEE BREAK News Shorts Reply News 年月日速報ニュース リプライニュース ｜ / -', musicCredit, CREDIT_PHOTO, CREDIT_COFFEE);
  return s.filter(Boolean).join(' ');
}

global.NSEngine = { FPS, get DUR() { return DUR; }, setDuration, PRESETS, BG_ORDER, prepare, drawFrame, drawItem, layout, wrapJp, fontSpecs, allText, use, setMusicCredit, setWallpaper };
})(window);
