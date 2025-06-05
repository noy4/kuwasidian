# 検索履歴レポートの作成
ブラウザ検索履歴を取得し、ある月に何をしていたか（調査、学習、娯楽など）についてレポートを作成する。

## 手順
- 履歴ファイルをコピーする。
- 以下をそれぞれ重複を除いて取得する。
  - すべての履歴（タイトル）、件数
  - YouTube履歴（タイトル、URL）、件数
- 履歴を元にレポートを生成する。

コマンド例：
```sh
-- 履歴の取得
sqlite3 ./tmp/History "SELECT DISTINCT u.title FROM urls u JOIN visits v ON u.id = v.url WHERE datetime(v.visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') >= '2025-05-01' AND datetime(v.visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') < '2025-06-01';"

-- YouTube履歴の取得
sqlite3 ./tmp/History "SELECT DISTINCT u.title, u.url FROM urls u JOIN visits v ON u.id = v.url WHERE u.url LIKE '%youtube.com/watch%' AND ..."

-- 履歴件数の取得
sqlite3 ./tmp/History "SELECT COUNT(DISTINCT u.title) ..."
```

## パラメータ（のちに指示がなければこれらの値で実行）
- browser: ブラウザの種類（例: Chrome, Brave）= Chrome
- month: 対象月（例: 2023-10）= 先月
- output: 出力先 = ./browser-history-reports/
- exclude: 履歴取得後、レポートにまとめる際に言及しないサイト・ジャンル。
- annual: 年次レポートを作成するかどうか = false

## 注意
- 一時ファイルは ./tmp に保存し、作業後に削除する。
- スクリプトは絶対に作成してはいけない。
- exclude で除外したサイトについて、除外したことには絶対に言及しない（セキュリティ、ユーザー保護）。
- 履歴はファイルに書き出さず、結果をそのまま使う。

## フォーマット
### 月時レポート
```md 2025-04.md
# 検索履歴レポート 2025-04
訪問サイト数：2129件（YouTube：338件）

{要約を記述。見出しは不要。}

## {😀 各トピックに対応する絵文字、タイトル}
{詳細}
{トピックに関連する動画がある場合、サムネタイルに表示する。各トピックごとに最低20件程度表示する。}
```

### 年次レポート
```md 2025.md
# 検索履歴レポート 2025
{あとは月次レポートと同じ}
```

## サムネタイル
<div class="thumbnail-tiles">
  <a href="https://www.youtube.com/watch?v=0UC1vvHprq8" target="_blank" rel="noopener noreferrer">
    <img src="https://img.youtube.com/vi/0UC1vvHprq8/mqdefault.jpg">
    <span class="video-title">15 in 1 AI VIDEO Generator : Let's CREATE YOUR Own Cinematic AI MOVIE - YouTube</span>
  </a>
</div>

<style>
.thumbnail-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1em;

  a {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  img {
    width: 160px;
    height: 90px;
  }

  .video-title {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 6px;
    font-size: 11px;
    line-height: 1.3;
    opacity: 0;
    transition: opacity 0.2s ease;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;

    &:hover {
      opacity: 1;
    }
  }
}
</style>

## その他メモ
- claude-sonnet-4 で検証済み
