# リプライニュース専用API

リプライニュースが使う、**自分専用のデータ用API**です。他社の無料公開APIは使いません。

- 集める側：`api/collect.mjs`（このフォルダのプログラム）が、**X公式のAPI**で投稿とリプライを探し、
  会話として使えるものだけを選んで、`api/v1/` のファイルに保存します。
- 配る側：保存したファイルが、そのまま専用APIの応答になります。
  - `https://githitosh.github.io/reply-news/api/v1/talks-ja.json`（日本語の会話）
  - `https://githitosh.github.io/reply-news/api/v1/talks-en.json`（英語の会話）
  - `https://githitosh.github.io/reply-news/api/v1/index.json`（最終更新と件数）
- ページ（`index.html`）は、自分のサイトにあるこのファイルだけを読みます。ページがXや他社のサービスに
  つなぐことはありません。

プログラムもデータもこのリポジトリの中にあるので、内容を変えられるのはリポジトリの持ち主だけです。

## フォルダの中身

| ファイル | 役割 |
|---|---|
| `collect.mjs` | 集めるプログラム（X公式APIで検索し、会話を選んで保存） |
| `words.json` | ジャンルごとの検索語 |
| `v1/talks-ja.json`、`v1/talks-en.json` | 保存した会話（専用APIの応答）。今は空です |
| `v1/index.json` | 最終更新と件数 |
| `collect-talks.workflow.yml` | 1日2回動かすための設定（保存してあるだけで、まだ動いていません） |

## 動かすのに必要なもの

**X公式APIの鍵（Bearer Token）が1つ必要です。** これが無いと、プログラムは何も集めず、ファイルも変えません。

1. X の開発者向けページ（https://developer.x.com/ ）でアプリを作り、Bearer Token を発行します。
   鍵を発行できるのはXだけで、Xのアカウントでの申し込みが必要です。料金は、読んだ投稿の数に応じて払う
   方式（従量課金）が標準とされています。金額はXが決めていて変わるので、申し込む前にXのページで確認してください。
2. GitHub のこのリポジトリで、Settings → Secrets and variables → Actions → New repository secret を開き、
   名前を `X_BEARER_TOKEN`、値を発行した鍵にして保存します。鍵はファイルに書かないでください。
3. 定期実行を有効にします。このフォルダの `collect-talks.workflow.yml` を、リポジトリの
   `.github/workflows/collect-talks.yml` にコピーします（今は保存してあるだけで、動いていません）。
4. Actions タブ → 「Collect talks」→ Run workflow を押すと、すぐ1回集めます。
   そのあとは毎日 9:17 と 18:17（日本時間）に自動で集め、`api/v1/` に保存します。

英語の会話も集めるときは、Settings → Secrets and variables → Actions → Variables に
`TALKS_LANGS` という名前で `ja,en` を入れます。

## 何を集めるか

1回の実行で、ジャンルをランダムに4つ選び、それぞれの言葉（`words.json`）を1つ検索します。

- 最初の投稿：個人の投稿だけ（返信・リポスト・引用は除く）。企業・官公庁の認証アカウントや、
  名前に「公式」「ニュース」などが付くアカウントは選びません。日本語は10〜110文字で、返信が1件以上あるもの。
- リプライ：その投稿に直接付いた返信のうち、笑いやツッコミがあるもの。挨拶や当たりさわりのない返信は選びません。
- 暴力、性的な内容、重い話題、けんか腰の言葉、広告は、投稿・リプライのどちらにあっても選びません。
- 保存した会話は3日で消します。実行のたびに、Xで削除・非公開になった投稿も消します。

## Xから読む件数

Xは、返した投稿の数で使用量を数えます。初期設定では1回あたり最大
4語 × 30件 ＋ 6投稿 × 返信10件 ＝ 180件ほど（ほかに、保存済みの投稿が残っているかの確認）です。
1日2回なので、1か月でおよそ1万1千件です。プランの上限に合わせて、次の値で増減できます
（Actions の Variables か、実行時の環境変数）。

| 名前 | 初期値 | 意味 |
|---|---|---|
| `TALKS_WORDS` | 4 | 1回に検索するジャンルの数 |
| `TALKS_RESULTS` | 30 | 1回の検索で受け取る投稿の数（10〜100） |
| `TALKS_POSTS` | 6 | 返信を読む投稿の数 |
| `TALKS_REPLIES` | 10 | 1つの投稿で受け取る返信の数（10〜100） |
| `TALKS_KEEPDAYS` | 3 | 会話をファイルに残す日数 |
| `TALKS_KEEPMAX` | 200 | ファイルに残す会話の上限 |

回数を変えるときは、コピーした `.github/workflows/collect-talks.yml` の `cron` を書き換えます。

## 手元で動かす

Node 20 以上があれば、追加のインストールは要りません。

```bash
X_BEARER_TOKEN=（鍵） node api/collect.mjs
```

```bash
X_BEARER_TOKEN=（鍵） node api/collect.mjs --dry
```

`--dry` は、ファイルを変えずに結果だけを表示します。

## 応答の形（`api/v1/talks-ja.json`）

```json
{
  "version": 1,
  "lang": "ja",
  "updated": "2026-11-18T09:17:42Z",
  "talks": [
    {
      "id": "投稿のID",
      "genre": "food",
      "word": "ラーメン",
      "found": "2026-11-18T09:17:42Z",
      "post": { "id": "…", "handle": "投稿者", "text": "投稿の文", "url": "https://x.com/…/status/…", "at": "投稿の日時" },
      "replies": [ { "id": "…", "handle": "返信者", "text": "リプライの文", "url": "https://x.com/…/status/…" } ]
    }
  ]
}
```

新しい会話が先頭です。ページはこの中から、選んだジャンルの会話をランダムに選んで動画にします。

## うまくいかないとき

- Actions の「Collect talks」の記録に `X answered 401` や `403` と出る：鍵が違うか、プランで検索が使えません。
- `X answered 429` と出る：そのプランの上限に達しています。上の値を小さくするか、回数を減らしてください。
- 記録に `X_BEARER_TOKEN is not set` と出る：手順2の Secret が入っていません。
- Actions タブに「Collect talks」が無い：手順3のコピーがまだです。
- ファイルは変わったのにページに出ない：GitHub Pages の反映に1〜2分かかります。Actions の
  「pages build and deployment」が動いていなければ、Settings → Pages を開いて保存し直してください。
