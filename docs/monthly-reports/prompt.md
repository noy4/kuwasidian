# 月次レポートの作成
ある月に何をしていたかのレポートを作成する。フォーマットは以下：

```md 2025-04.md
# 月次レポート 2025-04
2025年4月

## 検索履歴

## その他
- glm-4.7 で生成 // <使用モデル> で生成
```

## 検索履歴セクションの作成
ブラウザ検索履歴を取得し、ある月に何をしていたか（調査、学習、娯楽など）についてレポートを作成する。

### フォーマット
```md 2025-04.md
## 検索履歴
訪問サイト数：2129件（YouTube：338件）

{要約を記述。見出しは不要。}

### {😀 各トピックに対応する絵文字、タイトル}
{詳細}
{トピックに関連する動画がある場合、サムネタイルに表示する。}
```

**サムネタイル:**
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

### 手順
1. **履歴ファイル**をコピーする。
2. 以下をそれぞれ重複を除いて取得する。
    - **すべての履歴**（タイトル）、件数
    - **YouTube履歴**（タイトル、URL）、件数
3. 履歴を元に**レポートを作成**する。

**コマンド例：**
```sh
# 履歴の取得
sqlite3 ./.tmp/History "SELECT DISTINCT u.title FROM urls u JOIN visits v ON u.id = v.url WHERE datetime(v.visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') >= '2025-05-01' AND datetime(v.visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') < '2025-06-01';"

# YouTube履歴の取得
sqlite3 ./.tmp/History "SELECT DISTINCT u.title FROM urls u JOIN visits v ON u.id = v.url WHERE u.url LIKE '%youtube.com/watch%' AND ..."

# 履歴件数の取得
sqlite3 ./.tmp/History "SELECT COUNT(DISTINCT u.title) ..."
```

### パラメータ
のちに指示がなければこれらの値で実行
- `browser`: ブラウザの種類（例: Chrome, Brave）= Chrome
- `month`: 対象月（例: 2023-10）= 先月
- `output`: 出力先 = `./monthly-reports/`
- `exclude`: 履歴取得後、レポートにまとめる際に言及しないサイト・ジャンル。

### 注意
- 一時ファイルは `./.tmp` に保存し、作業後に削除する。
- スクリプトファイルは**絶対に**作成してはいけない。
- 履歴はファイルに**絶対に**書き出してはいけない。書き出したファイルの内容の読み取りに失敗することがあるので、メモリ内で処理する。
- `exclude` で除外したサイトについて、除外したことには**絶対に**言及しない（セキュリティ、ユーザー保護）。

## その他メモ
- `Claude Sonnet 4.5` で検証済み
