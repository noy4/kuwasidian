# YouTube履歴レポートの作成
ブラウザ検索履歴を取得し、ある月にどんな YouTube 動画を見ていたか（調査、学習、娯楽など）についてレポートを作成したい。

## 履歴の取得
- 履歴ファイルはコピーしてから読み取る（ロックされている場合があるため）。
- sqlite コマンドを使う。
- タイトル、URLのみ取得、その他は不要。タイトルが重複するものは排除。
- 絞り込みは日付の文字列（'2023-10-01'）を活用した書き方をする。
- タイムゾーンを考慮する。
- 必要に応じてデータを ./tmp に保存し、作業後に削除する。

## パラメータ（のちに指示がなければこれらの値で実行）
- browser: ブラウザの種類（例: Chrome, Brave）= Chrome
- month: 対象月（例: 2023-10）= 今月
- output: 出力先 = ./youtube-history-reports/
- exclude: 履歴取得後、レポートにまとめる際に言及しないサイト・ジャンル。セキュリティ上の理由で、除外したことには絶対に言及しない。ただしサイト数にはカウントする。
- annual: 年次レポートを作成するかどうか = false

## フォーマット
### 月時レポート
```md 2025-04.md
# YouTube履歴レポート 2025-04
閲覧数：2129件

{要約を記述。見出しは不要。}

## {😀 各トピックに対応する絵文字、タイトル}
{詳細}
{サムネタイル表示}
```

### 年次レポート
```md 2025.md
# YouTube履歴レポート 2025
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